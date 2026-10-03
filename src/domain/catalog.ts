import type { FurnitureType, Layout, Size } from './types'

export const roomMeasurements = { min: 2, max: 12, step: 0.1 }
export const wallHeight = 3
export const wallThickness = 0.2

// Representative starter footprints, rather than measured UK-wide averages.
export const bedroomPresets = [
  { name: 'Small bedroom', width: 2.5, depth: 3.2 },
  { name: 'Standard bedroom', width: 3, depth: 4 },
  { name: 'Loft bedroom', width: 4, depth: 5 },
]

export const furnitureTypes: FurnitureType[] = ['bed', 'bedsideTable']
export const furnitureLibrary: Record<FurnitureType, Size & { name: string; height: number }> = {
  bed: { name: 'Bed', width: 0.98, depth: 2, height: 1 },
  bedsideTable: { name: 'Bedside table', width: 0.45, depth: 0.4, height: 0.55 },
}

export const initialLayout: Layout = {
  roomWidth: bedroomPresets[1].width,
  roomDepth: bedroomPresets[1].depth,
  furniture: [
    { id: 'starter-bed', type: 'bed', position: [-0.85, 0, -1], rotation: 0 },
    { id: 'starter-table', type: 'bedsideTable', position: [0.05, 0, -1.7], rotation: 0 },
  ],
}
