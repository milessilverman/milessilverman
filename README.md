# milessilverman.com

Personal portfolio of Miles Silverman — civil engineering at USC.

Plain static site: no build step, no framework. Vercel serves the repo root as-is
(Framework Preset: **Other**, Root Directory: `./`). Every push to `main` deploys.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Home: hero, selected work, research, clubs & teams, about, experience, contact |
| `projects/<name>/index.html` | One page per project (`ewb-guatemala`, `treety`, `streetforge`, `electric-island`, `friendly-neighborhood`, `weblane`) |
| `projects/ewb-guatemala/analysis/index.html` | Full Rev B hydraulic analysis of the Vicampanavitz conduction line |
| `research/<name>/index.html` | Research and writing pages |
| `apps/` | Interactive project apps embedded in the project pages (Treety, StreetForge, Electric Island) |
| `documents/` | Résumé (PDF) and essay PDFs |
| `assets/site.css`, `assets/site.js` | Shared styles and behavior for every page |

The site header, contact section and footer are repeated in each page, so a change to the
navigation or contact details has to be made in every `index.html`.
