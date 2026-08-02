/* GitHub-powered project rendering: status sections, category filter,
   and README-rendered detail pages. Reads window.PROJECTS / GITHUB_USER
   from projects-config.js. */
(function () {
  const USER = window.GITHUB_USER || "";
  const PROJECTS = window.PROJECTS || [];

  // category -> card cover icon + gradient
  const CATS = {
    embedded: { label: "Embedded", icon: "fa-microchip", c1: "#2d96bd", c2: "#20303a" },
    iot:      { label: "IoT",       icon: "fa-wifi",      c1: "#3a7bd5", c2: "#2d96bd" },
    robotics: { label: "Robotics",  icon: "fa-robot",     c1: "#ef6a3a", c2: "#c0392b" },
    software: { label: "Software",  icon: "fa-code",      c1: "#6a5acd", c2: "#2d96bd" },
    fun:      { label: "Fun",        icon: "fa-gamepad",   c1: "#16a085", c2: "#2d96bd" },
  };
  const STATUS = {
    done:    { label: "Done",         icon: "fa-circle-check", blurb: "Shipped and written up." },
    brewing: { label: "Brewing",      icon: "fa-mug-hot",      blurb: "In progress right now." },
    idea:    { label: "Future ideas", icon: "fa-lightbulb",    blurb: "Things I want to build." },
  };
  const STATUS_ORDER = ["done", "brewing", "idea"];

  // ---- tiny cache (30 min) to be kind to GitHub's rate limit ----
  const TTL = 30 * 60 * 1000;
  function cacheGet(k) {
    try { const o = JSON.parse(localStorage.getItem(k)); if (o && Date.now() - o.t < TTL) return o.d; } catch {}
    return null;
  }
  function cacheSet(k, d) { try { localStorage.setItem(k, JSON.stringify({ t: Date.now(), d })); } catch {} }

  async function fetchRepo(repo) {
    const key = "gh:repo:" + repo;
    const hit = cacheGet(key); if (hit) return hit;
    const r = await fetch(`https://api.github.com/repos/${USER}/${repo}`);
    if (!r.ok) throw new Error("repo " + r.status);
    const j = await r.json();
    const data = {
      name: j.name, description: j.description || "", html_url: j.html_url,
      homepage: j.homepage || "", topics: j.topics || [], language: j.language || "",
      stars: j.stargazers_count || 0, pushed: j.pushed_at || "",
    };
    cacheSet(key, data); return data;
  }
  async function fetchReadme(repo) {
    const key = "gh:readme:" + repo;
    const hit = cacheGet(key); if (hit != null) return hit;
    for (const branch of ["HEAD"]) {
      const r = await fetch(`https://raw.githubusercontent.com/${USER}/${repo}/${branch}/README.md`);
      if (r.ok) { const t = await r.text(); cacheSet(key, t); return t; }
    }
    throw new Error("no README");
  }

  function primaryCat(cats) { return (cats && cats.find((c) => CATS[c])) || null; }
  function coverHTML(cats) {
    const c = CATS[primaryCat(cats)] || { icon: "fa-cube", c1: "#2d96bd", c2: "#ef3982" };
    return `<div class="pcard-cover" style="--c1:${c.c1};--c2:${c.c2};"><i class="fa-solid ${c.icon}"></i></div>`;
  }
  function tagsHTML(cats) {
    return `<div class="pcard-tags">${(cats || []).map((c) => `<span>${(CATS[c] && CATS[c].label) || c}</span>`).join("")}</div>`;
  }
  function cardHref(p) {
    if (p.repo) return `project.html?repo=${encodeURIComponent(p.repo)}`;
    if (p.page) return p.page;
    if (p.url) return p.url;
    return null;
  }

  // ============ INDEX PAGE ============
  async function renderIndex(root) {
    // Build a section per status, in order.
    root.innerHTML = "";
    const byStatus = {};
    PROJECTS.forEach((p) => { (byStatus[p.status] = byStatus[p.status] || []).push(p); });

    for (const st of STATUS_ORDER) {
      const list = byStatus[st]; if (!list || !list.length) continue;
      const meta = STATUS[st];
      const section = document.createElement("section");
      section.className = "status-section reveal show";
      section.dataset.status = st;
      section.innerHTML =
        `<div class="status-head"><h2><i class="fa-solid ${meta.icon}"></i> ${meta.label}</h2>` +
        `<span class="status-blurb">${meta.blurb}</span></div>` +
        `<div class="pgrid"></div>`;
      const grid = section.querySelector(".pgrid");
      root.appendChild(section);

      for (const p of list) {
        const href = cardHref(p);
        const el = document.createElement(href ? "a" : "div");
        el.className = "pcard";
        el.dataset.cats = (p.categories || []).join(" ");
        if (href) {
          el.href = href;
          if (p.url && !p.repo && !p.page) { el.target = "_blank"; el.rel = "noopener"; }
        }
        // initial content from config
        let title = p.title || p.repo || "Untitled";
        let desc = p.desc || "";
        el.innerHTML = coverHTML(p.categories) +
          `<div class="pcard-body"><h3>${title}</h3><p class="pcard-desc">${desc}</p>${tagsHTML(p.categories)}</div>`;
        grid.appendChild(el);

        // enrich from GitHub if a repo is set
        if (p.repo) {
          fetchRepo(p.repo).then((r) => {
            const h3 = el.querySelector("h3"); const d = el.querySelector(".pcard-desc");
            if (!p.title) h3.textContent = r.name;
            if (!p.desc && r.description) d.textContent = r.description;
          }).catch(() => {});
        }
      }
    }
    wireFilter(root);
  }

  function wireFilter(root) {
    const bar = document.querySelector(".filter-bar");
    if (!bar) return;
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn"); if (!btn) return;
      bar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      root.querySelectorAll(".status-section").forEach((sec) => {
        let shown = 0;
        sec.querySelectorAll(".pcard").forEach((c) => {
          const cats = (c.dataset.cats || "").split(/\s+/);
          const show = f === "all" || cats.includes(f);
          c.classList.toggle("hide", !show);
          if (show) shown++;
        });
        sec.classList.toggle("hide", shown === 0);
      });
    });
  }

  // ============ DETAIL PAGE (renders README) ============
  function fixRelativeLinks(container, repo) {
    const rawBase = `https://raw.githubusercontent.com/${USER}/${repo}/HEAD/`;
    const blobBase = `https://github.com/${USER}/${repo}/blob/HEAD/`;
    container.querySelectorAll("img").forEach((img) => {
      const s = img.getAttribute("src") || "";
      if (s && !/^https?:|^data:/.test(s)) img.setAttribute("src", rawBase + s.replace(/^\.?\//, ""));
      img.loading = "lazy";
    });
    container.querySelectorAll("a").forEach((a) => {
      const h = a.getAttribute("href") || "";
      if (h && !/^https?:|^#|^mailto:/.test(h)) a.setAttribute("href", blobBase + h.replace(/^\.?\//, ""));
      if (/^https?:/.test(a.getAttribute("href") || "")) { a.target = "_blank"; a.rel = "noopener"; }
    });
  }

  async function renderDetail() {
    const params = new URLSearchParams(location.search);
    const repo = params.get("repo");
    const titleEl = document.getElementById("proj-title");
    const metaEl = document.getElementById("proj-meta");
    const bodyEl = document.getElementById("proj-body");
    if (!repo) { titleEl.textContent = "Project not found"; bodyEl.innerHTML = "<p>No project specified.</p>"; return; }

    // find config entry for categories
    const cfg = PROJECTS.find((p) => p.repo === repo) || {};
    document.title = repo + " — Lumosmax";

    try {
      const [r, md] = await Promise.all([fetchRepo(repo), fetchReadme(repo).catch(() => "")]);
      titleEl.textContent = cfg.title || r.name;
      const cats = cfg.categories || r.topics.filter((t) => CATS[t]);
      const stat = cfg.status && STATUS[cfg.status];
      metaEl.innerHTML =
        (stat ? `<span class="status-badge status-${cfg.status}"><i class="fa-solid ${stat.icon}"></i> ${stat.label}</span>` : "") +
        (r.language ? `<span><i class="fa-solid fa-code"></i>${r.language}</span>` : "") +
        (r.stars ? `<span><i class="fa-solid fa-star"></i>${r.stars}</span>` : "") +
        `<a class="gh-link" href="${r.html_url}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> View on GitHub</a>` +
        `<div class="tags">${cats.map((c) => `<span class="tag">${(CATS[c] && CATS[c].label) || c}</span>`).join("")}</div>`;
      if (md && window.marked) {
        bodyEl.innerHTML = window.marked.parse(md);
        fixRelativeLinks(bodyEl, repo);
      } else if (r.description) {
        bodyEl.innerHTML = `<p>${r.description}</p><p><a href="${r.html_url}" target="_blank" rel="noopener">See the repository on GitHub →</a></p>`;
      } else {
        bodyEl.innerHTML = `<p>No README yet. <a href="${r.html_url}" target="_blank" rel="noopener">See the repository on GitHub →</a></p>`;
      }
    } catch (err) {
      titleEl.textContent = cfg.title || repo;
      bodyEl.innerHTML =
        `<p>Couldn't load this project from GitHub right now (it may be private, or the API rate limit was hit). ` +
        `You can view it directly on <a href="https://github.com/${USER}/${repo}" target="_blank" rel="noopener">GitHub</a>.</p>`;
    }
  }

  // ---- boot ----
  document.addEventListener("DOMContentLoaded", () => {
    const idx = document.getElementById("projects-root");
    if (idx) renderIndex(idx);
    const det = document.getElementById("proj-body");
    if (det) renderDetail();
  });
})();
