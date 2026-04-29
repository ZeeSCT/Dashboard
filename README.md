# Scientechnic Frontend — Exact HTML Matched Modular Version

This keeps the exact requested folder structure and creates one separate component per screen.

The page content and styling are extracted from `scientechnic-FINAL(1).html` so the screens visually match the final HTML mock as closely as possible while remaining modular.

## Run

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Structure

- `src/components/layout` — AppShell, Sidebar, Topbar, ModuleSection
- `src/components/shared` — reusable shared components retained for future refactor/API binding
- `src/components/screens` — 41 separate screen components
- `src/data/navigation.ts` — sidebar module/menu config
- `src/lib/pageRegistry.ts` — screen key to component mapping
- `src/styles/globals.css` — extracted HTML CSS
