# schuldschein-generator.de

Die Arbeitsregeln und der Aufbau stehen in `AGENTS.md`. Dort nachlesen, nicht hier doppeln.

## Stand

- Neu gebaut im September 2026 (Branch `redesign`): Astro 7, Tailwind 4, eine Seite ohne Assistent im
  Überweisungsträger-Stil, Vorlagen, Rechtslage und Fragen als eigene Seiten, Deutsch und Englisch.
- Entscheidungen und Begründungen: `docs/UMBAU.md`, `docs/design-vorschlaege/PLAN.md`.
- Rechtliche Aussagen stammen aus `docs/recherche-rechtslage.md` (Stand 18.09.2026).

## Vor jedem Deploy

```bash
npm run pruefen
```

Tests, Build, Gate (`pruefe-gate.mjs`, 28 Bedingungen), Smoketest und axe gegen den Produktionsbuild.
Mit Mess-Kennung zusätzlich `PUBLIC_GA_ID=G-... npm run build` und `npm run einwilligung`.

## Wiederkehrend

- Basiszins zum 1. Januar und 1. Juli in `src/lib/basiszins.ts` nachziehen (Quelle Bundesbank).
- Links der Urteile prüfen: `testphase.rechtsinformationen.bund.de` ist noch eine Testphase.
