# Portfolio site

A minimalist, no-build static website to showcase your skills and projects.
Plain HTML/CSS/JS — nothing to compile, so it deploys to Cloudflare Pages just by
connecting a git repo.

## Files

```
portfolio/
├── index.html              ← Home / About / Skills / Contact
├── projects.html           ← Grid of project cards
├── projects/
│   ├── sample-project.html ← Example project detail page
│   └── _template.html      ← Copy this to add a new project
├── css/style.css           ← All styling + theme (edit variables at the top)
└── js/main.js              ← Theme toggle + scroll animations
```

Styled after the **LoveIt** Hugo theme: a centered profile homepage (avatar,
name, animated typing subtitle, social icons), blue links with a pink hover,
Lato type, light/dark toggle, and a blog-style project list. Font Awesome and
the Lato font load from a CDN — an internet connection shows them; everything
else works offline.

## Make it yours

1. **Avatar** — replace `assets/avatar.svg` with your own photo (a `.jpg`/`.png`
   works too; update the `src` in `index.html` if you change the filename).
2. **Profile** — in `index.html`, edit **Your Name** and the typing phrases in
   `data-typing='[ ... ]'` (each quoted phrase types out in turn).
3. Edit anything marked `<!-- EDIT: ... -->` — About text, skills chips, contacts.
   (No company or industry names are included by design — keep it that way.)
4. Update the social links in every page (search for `github.com`,
   `linkedin.com`, `hackster.io`, and `you@example.com`).

## Add a project

1. Copy `projects/_template.html` to `projects/my-new-project.html`.
2. Fill in the title, tags, and each section.
3. In `projects.html`, copy the card block marked
   `<!-- ===== PROJECT CARD ... -->` and point its `href` at your new file.

The detail-page sections (Story → How it works → Bill of materials → Schematics →
Code → Result) match what a strong **Hackster.io** submission needs, so you can
reuse the same write-up in both places.

## Preview locally

Just double-click `index.html`, or run a tiny server for cleaner paths:

```bash
# from inside the portfolio/ folder
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy on Cloudflare Pages (git)

1. **Put the site in a git repo.** Create a new repo on GitHub, then from inside
   this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
2. **Connect it to Cloudflare Pages.** In the Cloudflare dashboard go to
   *Workers & Pages → Create → Pages → Connect to Git*, pick your repo, and authorize.
3. **Build settings.** Because there's no build step:
   - **Framework preset:** *None*
   - **Build command:** *(leave blank)*
   - **Build output directory:** `/`  (or `portfolio` if you committed the parent folder)
4. **Save and Deploy.** You'll get a `*.pages.dev` URL in about a minute. Every
   `git push` after this redeploys automatically.
5. *(Optional)* Add a custom domain under the project's **Custom domains** tab.

> Tip: keep `index.html` at the root of whatever folder you set as the build output
> directory, so Cloudflare serves it as the homepage.
