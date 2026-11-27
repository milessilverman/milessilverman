# milessilverman.com

Personal portfolio of Miles Silverman — civil engineering at USC.

Plain static site: no build step, no framework. Vercel serves the repo root as-is
(Framework Preset: **Other**, Root Directory: `./`). Every push to `main` deploys.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Home: hero with award badges, selected work, transportation & cities, research, concepts, clubs & teams, now, about, experience, contact |
| `projects/<name>/index.html` | One page per project (`ewb-guatemala`, `treety`, `streetforge`, `electric-island`, `friendly-neighborhood`, `weblane`) |
| `projects/ewb-guatemala/analysis/index.html` | Full Rev B hydraulic analysis of the Vicampanavitz conduction line |
| `research/<name>/index.html` | Research and writing pages |
| `apps/` | Interactive project apps embedded in the project pages (Treety, StreetForge, Electric Island) |
| `documents/` | Résumé (PDF) and essay PDFs |
| `robots.txt`, `sitemap.xml` | Crawler hints; add new pages to the sitemap by hand |
| `assets/site.css`, `assets/site.js` | Shared styles and behavior for every page |

## Project sites under this domain

`vercel.json` gives each separately hosted project an address here. Nothing is copied into this repo, so there is nothing to keep in sync:

| Address | What it shows |
| --- | --- |
| `/everyspace/` | The GitHub Pages site of [milessilverman/everyspace](https://github.com/milessilverman/everyspace), passed through live |
| `/city-pretty/` (`/citypretty` redirects here) | The GitHub Pages site of [milessilverman/city-pretty](https://github.com/milessilverman/city-pretty), passed through live |
| `/streetforge` (and `/streetforward`) | Redirects to https://www.streetforge.app, where StreetForge is hosted. Its project page here stays at `/projects/streetforge/` |

The two passed-through sites update on their own whenever their GitHub Pages site is published (GitHub lets browsers keep a page for up to 10 minutes). Files in this repo always win over these rules, and the rules only cover the paths above.

To add another GitHub Pages project, copy the three `everyspace` lines in `vercel.json` (two redirects that add the missing trailing slash, one rewrite) and change the name to the repository's name. Keep the address the same as the repository name, because Pages sites often link to their own files by that path. The project's pages must use relative links.

The site header, contact section and footer are repeated in each page, so a change to the
navigation or contact details has to be made in every `index.html`.

## Conventions

- Every project carries a stage chip (`.stage` with `winner`, `live`, `prototype`, `dev` or `concept`) on its card and page. Keep them honest.
- No emoji anywhere on the site. Use the inline SVG `.icon` pattern or CSS-drawn marks instead.
- Placeholders still waiting on content: the headshot (`#about`), the HSR corridor map (`#transportation`), the CE 106 report PDF, and Treety prototype photos.
