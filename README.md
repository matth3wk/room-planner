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

## Code structure

- `src/App.tsx` connects the UI to the planner and 3D scene.
- `src/components/` contains the room controls, toolbar and furniture sidebar.
- `src/scene/` contains the room shell, furniture models and transform controls.
- `src/hooks/` owns React state, layout history and keyboard shortcuts.
- `src/domain/` contains shared types, dimensions and pure layout calculations.
- `src/services/layoutStorage.ts` validates and reads/writes browser saves.
- `src/styles/planner.css` keeps the existing planner styling.

A component receives data and callbacks through **props** (similar to method
parameters). A **custom hook** is a function that combines React state and
behaviour; `usePlanner` is called once in App, so there is one source of truth.
Components request changes through callbacks rather than editing layout data.

Domain functions return new layouts without changing their inputs. This
keeps previous snapshots safe for Undo and allows tests without React or WebGL.
The storage service accepts a storage object for tests but uses localStorage
in the app. The save key and version remain unchanged.

To add a furniture type, update `domain/types.ts`, `domain/catalog.ts` and
`scene/FurnitureModels.tsx`, then choose its model in
`scene/FurnitureInstance.tsx`. The sidebar uses the catalog for labels and sizes.

Run `npm test` for layout, placement, storage and boundary checks.
Run `npm run lint` and `npm run build` before committing changes.
