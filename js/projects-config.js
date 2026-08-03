/* ============================================================
   PROJECTS CONFIG — this is the only file you edit to add projects.
   ------------------------------------------------------------
   Each entry is one project card.

   Fields:
     repo       GitHub repo name under your account (pulls title,
                description, and README automatically). Optional.
     title      Shown on the card. If a repo is set and you leave
                title empty, the repo name is used.
     desc       Short blurb for the card. If empty and a repo is
                set, the repo's GitHub description is used.
     status     "done" | "brewing" | "idea"   (controls the section)
     categories any of: embedded, iot, robotics, software, fun
     url        Optional external link (used when there's no repo)
     related    Array of other repo names in this list. Shows a
                "Related project" link on the detail page.

   To add a project: copy a line, set the repo + status + categories.
   ============================================================ */

window.GITHUB_USER = "lumosmaximus";

window.PROJECTS = [
  {
    repo: "spectra",
    title: "Spectra 6 Converter",
    desc: "A browser app that dithers any photo down to six e-paper inks and exports a panel-ready file.",
    cover: "docs/app.png",
    status: "done",
    categories: ["software", "embedded", "fun"],
    live: "https://lumosmaximus.github.io/spectra/",  // deployed tool, embedded on the project page
    embed: "index.html",   // fallback: runs the raw index.html if `live` is ever removed
    related: ["eink-flipper-badge"],
  },
  {
    repo: "eink-flipper-badge",
    title: "E-Paper Badge for Flipper Zero",
    desc: "A wearable six-color e-paper badge with a bit-banged display driver written from the datasheet up.",
    cover: "docs/hero.jpg",
    status: "done",
    categories: ["embedded", "iot", "fun"],
    related: ["spectra"],
  },
  {
    title: "Your next idea",
    desc: "Something you want to build. Replace or delete this.",
    status: "idea",
    categories: ["robotics"],
  },
];
