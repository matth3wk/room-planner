# 3D Room Planner

Run `npm run dev` to launch the app, `npm run build` to type-check and build,
and `npm run lint` to check code quality.

## Save, load and undo

Save layout stores one room in this browser's local storage, replacing the
previous save. Load layout restores its dimensions, furniture, positions and
rotations. After refreshing or reopening the app, click Load layout to restore
your save. Saves belong to the browser and site address (including its port).

Undo or Ctrl+Z / Command+Z restores the last layout change. Adding, deleting,
room presets, dimensions, movement, rotation and loading are undoable. A slider
or furniture drag counts as one change. The last 50 changes are kept in memory;
refreshing clears undo history but retains the saved layout. Saving does not
add an undo step. Selection and camera movement do not add undo steps either.

Malformed saves and unavailable/full browser storage show an error without
discarding the current layout. Use `npm test` to run storage validation and
floor-boundary tests.

## Furniture controls

Use the sidebar to add a bed or bedside table. Click an item in the room or
its sidebar entry to select it. Choose Move to drag the X/Z arrows or floor
handle; choose Rotate to drag the Y-axis ring (15-degree steps).
Furniture stays at floor level and its rotated footprint is kept inside the
room. Camera orbit pauses while dragging. Resizing the room clamps furniture
back inside; if its current angle cannot fit, it returns to zero rotation.

Delete selected furniture with the sidebar button, Delete, or Backspace.
Keyboard deletion is ignored while editing inputs or dragging a gizmo.
Run `npm test` with Node.js 22.6+ to check floor and rotated-wall boundaries.

## Bedroom presets

One scene unit represents one metre. Presets set the inside floor width (X)
and depth (Z); all currently use the same 3 m wall height (Y).
The default is Standard bedroom. Sliders can customise any preset, and the UI
shows Custom room when the dimensions no longer match a preset.

| Preset | Width × depth | Floor area |
| --- | --- | --- |
| Small bedroom | 2.5 × 3.2 m | 8 m² |
| Standard bedroom | 3 × 4 m | 12 m² |
| Loft bedroom | 4 × 5 m | 20 m² |

These are representative starting footprints, not measured UK-wide averages.
The small and standard choices sit above the single/double bedroom floor-area
benchmarks in [England's nationally described space standard](https://www.gov.uk/government/publications/technical-housing-standards-nationally-described-space-standard/technical-housing-standards-nationally-described-space-standard):
7.5 m² for a single and 11.5 m² for a double. Those figures are minimums within
that standard, not averages or a UK-wide specification.

The loft footprint is an illustrative larger room, not a published average.
[Building Control Partnership's loft guidance](https://www.buildingcontrolpartnershiphants.gov.uk/guides/raising-the-roof-with-a-loft-conversion/)
explains that the roof, available headroom and stairs affect what fits in a loft.
The current preset changes floor size only: sloped ceilings, stairs and eaves
are not modelled.

## Original Vite template notes

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
