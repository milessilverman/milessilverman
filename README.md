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

The site header, contact section and footer are repeated in each page, so a change to the
navigation or contact details has to be made in every `index.html`.

## Conventions

- Every project carries a stage chip (`.stage` with `winner`, `live`, `prototype`, `dev` or `concept`) on its card and page. Keep them honest.
- No emoji anywhere on the site. Use the inline SVG `.icon` pattern or CSS-drawn marks instead.
- Placeholders still waiting on content: the headshot (`#about`), the HSR corridor map (`#transportation`), the CE 106 report PDF, and Treety prototype photos.
