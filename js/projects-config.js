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
     cover      Image path inside the repo, used as the card cover.
     coverPos   Optional CSS object-position for that cover, e.g.
                "center top". Useful when a tall image would
                otherwise be cropped through its middle.

   To add a project: copy a line, set the repo + status + categories.
   ============================================================ */

window.GITHUB_USER = "lumosmaximus";

window.PROJECTS = [
  {
    repo: "spectra",
    title: "Spectra 6 Converter",
    desc: "A browser app that dithers any photo down to six e-paper inks and exports a panel-ready file.",
    cover: "docs/app.png",
    coverPos: "center top",   // tall screenshot: keep the header, not the blank preview
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
  // Future ideas are a plain bulleted list of links. A title is enough to start.
  // Add `notes` when you begin thinking one through: it renders as the body of
  // that idea's own page. Markdown works, so headings, lists, and links are fine.
  {
    title: "Implementing Whisper on a handheld device",
    status: "idea",
    categories: ["embedded", "software"],
    notes: `Speech to text running entirely on the device, with no network round trip.

## Why

Every voice assistant worth using sends audio to a server. That rules them out
for anything private, anything offline, and anything that needs to answer in
under a second.

## Open questions

- Which Whisper variant actually fits? tiny and base are the realistic candidates.
- How much RAM does inference need once the model is quantized?
- Is a microcontroller enough, or does this want a small Linux board?
- What is the power budget for something battery powered and pocket sized?

## First step

Benchmark whisper.cpp with a quantized tiny model on a few candidate boards and
measure latency, memory, and current draw before committing to hardware.`,
  },
  {
    title: "Building a personal AI pet",
    status: "idea",
    categories: ["robotics", "fun"],
  },
  {
    title: "Device for heart rate zone indicator",
    status: "idea",
    categories: ["embedded", "iot"],
  },
];
