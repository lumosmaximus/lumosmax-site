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

   To add a project: copy a line, set the repo + status + categories.
   ============================================================ */

window.GITHUB_USER = "lumosmaximus";

window.PROJECTS = [
  {
    repo: "spectra",
    title: "Spectra 6 Converter",
    status: "done",
    categories: ["software", "embedded", "fun"],
  },
  {
    title: "E-ink Display for Flipper Zero",
    desc: "An e-ink screen module riding on the Flipper Zero's GPIO header.",
    status: "brewing",
    categories: ["embedded", "iot", "fun"],
    // no repo yet — add `repo: "..."` once it's public
  },
  {
    title: "Your next idea",
    desc: "Something you want to build. Replace or delete this.",
    status: "idea",
    categories: ["robotics"],
  },
];
