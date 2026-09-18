# Repository Guidelines

## Structure

- `src/lib/` - pure TypeScript: contract text (`vertrag.ts`, the only source of the wording), amount parsing and words, dates (§ 188 BGB), IBAN, instalments, PDF (`pdf-lib`), Word (`docx`), legal texts, law page and FAQ content, i18n.
- `src/components/` - Astro components per page (`Generator`, `VorlagenSeite`, `RechtslageSeite`, `FragenSeite`, `RechtsText`) plus `Kopf`, `Fuss`, `Logo`, `Dokument`, `Einwilligung`.
- `src/pages/` - German at `/`, English at `/en/`. Templates are generated as PDF and DOCX at build time (`vorlagen/[datei].ts`).
- `src/scripts/generator.ts` - the only client-side logic besides the theme switch.
- `src/styles/global.css` - all styling. Colours are CSS variables, dark mode only swaps variables.
- `tests/` - vitest. `tools/` - browser smoke test, accessibility check, image generator.
- `docs/` - design drafts, legal research (source for the law page), code review of the 2025 version.

## Commands

- `npm run dev`, `npm run build`, `npm test`
- `npm run pruefen` - tests, build, launch gate, smoke test and axe check against the production build (preview on port 4412)
- `npm run bilder` - regenerate favicons and the share image after a logo change

## Rules

- Never put user input into `innerHTML`. The preview is built with `textContent` (`src/lib/dokument-dom.ts`).
- Store nothing in the browser unless the user asks for it (tick "merken", click the theme switch). The privacy policy says so and the smoke test measures it.
- Every legal statement on the site needs a source in `docs/recherche-rechtslage.md`. Court decisions only if opened and checked in full.
- The base rate lives in `src/lib/basiszins.ts` and changes on 1 January and 1 July. Update value, date and table together.
- Analytics is fail-closed: without `PUBLIC_GA_ID` no banner and no Google, and the privacy policy omits both.
- German UI text uses real umlauts and the informal "Du". No em or en dashes.

## Commits

Conventional Commits (`feat:`, `fix:`, `docs:`). Keep `README.md` and `README.de.md` in sync.
