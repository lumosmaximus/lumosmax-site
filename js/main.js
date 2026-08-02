// ---- Theme toggle (persists across visits, LoveIt-style moon/sun) ----
(function () {
  const KEY = "portfolio-theme";
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));

  function icon() {
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    const dark = root.getAttribute("data-theme") === "dark";
    btn.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".theme-toggle")) return;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
    icon();
  });
  document.addEventListener("DOMContentLoaded", icon);
})();

// ---- Animated typing subtitle (LoveIt uses TypeIt; this is a tiny vanilla version) ----
document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector("[data-typing]");
  if (!el) return;
  let phrases;
  try { phrases = JSON.parse(el.getAttribute("data-typing")); }
  catch { phrases = [el.getAttribute("data-typing")]; }
  if (!Array.isArray(phrases) || !phrases.length) return;

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.textContent = "|";
  el.after(cursor);

  let p = 0, i = 0, deleting = false;
  function tick() {
    const word = phrases[p];
    el.textContent = word.slice(0, i);
    if (!deleting && i < word.length) { i++; setTimeout(tick, 70); }
    else if (!deleting && i === word.length) { deleting = true; setTimeout(tick, 1600); }
    else if (deleting && i > 0) { i--; setTimeout(tick, 35); }
    else { deleting = false; p = (p + 1) % phrases.length; setTimeout(tick, 350); }
  }
  tick();
});

// ---- Project category filter ----
document.addEventListener("DOMContentLoaded", () => {
  const bar = document.querySelector(".filter-bar");
  const grid = document.querySelector(".pgrid");
  if (!bar || !grid) return;
  const cards = [...grid.querySelectorAll(".pcard")];

  function apply(filter) {
    cards.forEach((c) => {
      const cats = (c.dataset.cats || "").split(/\s+/);
      const show = filter === "all" || cats.includes(filter);
      c.classList.toggle("hide", !show);
      if (show) { c.style.animation = "none"; void c.offsetWidth; c.style.animation = ""; }
    });
  }

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    bar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    apply(btn.dataset.filter);
  });
});

// ---- Reveal-on-scroll ----
document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach((el) => el.classList.add("show"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); }
    }),
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
});

// ---- Footer year ----
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
