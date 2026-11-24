# pcha.dev

The homepage is static HTML. The site build copies it to `dist/index.html` and generates `dist/cv/index.html` and `dist/cv.pdf` from `resume.json`.

## Update the résumé

Edit `resume.json`, then run the following commands with Node.js 24 and npm.

| Command | Result |
| --- | --- |
| `npm ci` | Install the locked dependencies and the browser used by the CLI. |
| `npm run cv:validate` | Validate against the JSON Resume schema bundled with the pinned CLI. |
| `npm run cv:preview` | Open http://localhost:4000 for live HTML preview. |
| `npm run cv:html` | Generate the HTML résumé. |
| `npm run cv:pdf` | Generate the A4 PDF. |
| `npm run cv:build` | Validate and generate both CV artifacts. |
| `npm run cv:audit` | Run the CLI’s advisory ATS audit against the HTML. |
| `npm run build` | Build the entire static site into `dist/`. |

To exercise both routes and the PDF download locally, build the site and serve `dist/` with a static HTTP server, for example `python3 -m http.server --directory dist 4321`. To inspect the PDF independently, run `pdfinfo dist/cv.pdf` and `pdftotext dist/cv.pdf -`.

## Theme configuration

The [Stack Overflow theme](https://github.com/phoinixi/jsonresume-theme-stackoverflow) controls the layout and section labels. Set section order and any native theme options in `resume.json` under `meta.theme`. Add print or layout adjustments to `cv/override.css`.

The [JSON Resume CLI](https://jsonresume.org/cli) loads `cv/theme.cjs` through its local theme option. The module calls the upstream renderer and applies the CSS override, A4 print options, and the site download link. It inlines the exact Font Awesome version used by the theme, so the contact icons work offline. Print uses the matching brand images and regular text for the usernames. It also marks the email link for Cloudflare’s per-address obfuscation opt-out.

## Cloudflare Pages

In the existing Pages project for pcha.dev, point the Git integration at the production branch of this repository and use these settings.

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Root directory | Repository root |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Build environment variable | `NODE_VERSION=24` |
| Linux build environment variable | `RESUME_PUPPETEER_NO_SANDBOX=1` if Chrome cannot start its sandbox. |

After configuring Pages, deploy the production branch. Verify that [the HTML résumé](https://pcha.dev/cv/) shows the CV and that [the PDF route](https://pcha.dev/cv.pdf) returns a PDF. If a build host uses its own Chromium binary, set Puppeteer’s `PUPPETEER_EXECUTABLE_PATH` to that executable. An Astro site can serve the same output paths as static assets from its public directory without rendering résumé sections in Astro.

## Migration and theme limits

The published Google Docs résumé supplied the content. Month and year dates use `YYYY-MM`. Open-ended dates omit `endDate`. Google’s tracking redirects were unwrapped to retain the original link targets. Skills retain their original categories and the programming-language experience values.

All six certificate descriptions and instructor credits are stored verbatim in `certificates[].summary`. Version 3.3.0 of the theme displays the certificate name, issuer, date, and URL, and omits the summary field. The original Icons8 artwork credit and link are carried in `meta.sourceIconAttribution` because the standard schema has no dedicated artwork credit field. The rendered résumé uses the theme’s own artwork.

The HTML audit considers screen styles, including the theme’s columns and icon fonts. PDF extraction is a separate check. The PDF uses the print overrides for single-column sections and removes icon-font glyphs from the text layer.
