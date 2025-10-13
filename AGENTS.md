# Repository Guidelines

## Project Structure & Module Organization
- `src/` — Astro app source
  - `src/pages/` (routes, e.g., `index.astro`, `about.astro`)
  - `src/components/` (UI, e.g., `Generator.astro`)
  - `src/layouts/` (shared layout, e.g., `Base.astro`)
  - `src/styles/` (Tailwind entry `global.css`)
- `public/` — served static assets (css, js, translations, icons)
- `js/`, `css/`, `translations/` — source copies kept in repo root; keep in sync with `public/` equivalents
- Legacy `index.html` exists; primary entry is `src/pages/index.astro`.

## Build, Test, and Development Commands
- `npm install` — install dependencies
- `npm run dev` — start Astro dev server on `http://localhost:4321`
- `npm run build` — build static site to `dist/`
- `npm run preview` — serve built output locally
- Sync helpers when editing raw sources: `cp js/*.js public/js/ && cp translations/*.js public/translations/`

## Coding Style & Naming Conventions
- Indentation: Astro/HTML/CSS = 2 spaces; JS = 4 spaces (match existing files)
- Components: PascalCase (`src/components/Generator.astro`); Pages: lowercase (`src/pages/impressum.astro`)
- Styling: Tailwind CSS + DaisyUI; prefer utilities/components over custom CSS. Do not add bespoke dark-mode CSS (use DaisyUI themes).
- No analytics, cookies, or server calls. Client-only behavior.

## Testing Guidelines
- No formal test suite yet. Perform manual checks via `npm run dev`:
  - Generator renders, autosave works, due date auto-calculates
  - Theme toggle persists; DE/EN toggle updates texts and routes
  - PDF button triggers client action (jsPDF integration lives in `public/js/pdf.js`)
  - No network requests are made during normal use

## Commit & Pull Request Guidelines
- Commits: concise, imperative; Conventional Commits preferred (e.g., `feat(generator): add repayment rhythm`)
- PRs: clear description, linked issues, screenshots/GIFs for UI changes, test steps, and note if `public/*` was synced from root sources
- Keep `package.json` version and the header badge in `src/layouts/Base.astro` in sync when bumping versions

## Security & Configuration Tips
- Keep `astro.config.mjs` `output: 'static'` to ensure a fully static, privacy-preserving build
- Translations live in JS files (`translations/*.js`); update both root and `public/translations/` copies
- Do not introduce server-side features or data collection; all logic must remain browser-side

