import { furnitureLibrary } from './catalog.ts'
import { constrainToRoom, getFootprint } from './furnitureBounds.ts'
import type { FurnitureItem, FurnitureType, Layout, Position } from './types'

// Keep saved data, rendering and undo snapshots consistent with room boundaries.
export function normalizeLayout(layout: Layout): Layout {
  return {
    ...layout,
    furniture: layout.furniture.map((item) => ({
      ...item,
      ...constrainToRoom(item.position, item.rotation, furnitureLibrary[item.type], {
        width: layout.roomWidth, depth: layout.roomDepth,
      }),
    })),
  }
}

export function resizeRoom(layout: Layout, width: number, depth: number): Layout {
  return normalizeLayout({ ...layout, roomWidth: width, roomDepth: depth })
}

export function transformFurniture(layout: Layout, id: string, position: Position, rotation: number): Layout {
  return normalizeLayout({
    ...layout,
    furniture: layout.furniture.map((item) => item.id === id ? { ...item, position, rotation } : item),
  })
}

export function removeFurniture(layout: Layout, id: string): Layout {
  return { ...layout, furniture: layout.furniture.filter((item) => item.id !== id) }
}

// Rotated axis-aligned footprints provide a simple, conservative overlap check.
export function furnitureOverlaps(first: FurnitureItem, second: FurnitureItem, gap = 0): boolean {
  const firstSize = getFootprint(furnitureLibrary[first.type], first.rotation)
  const secondSize = getFootprint(furnitureLibrary[second.type], second.rotation)
  return Math.abs(first.position[0] - second.position[0]) < (firstSize.width + secondSize.width) / 2 + gap - 1e-9
    && Math.abs(first.position[2] - second.position[2]) < (firstSize.depth + secondSize.depth) / 2 + gap - 1e-9
}

export function hasFurnitureOverlaps(furniture: FurnitureItem[]): boolean {
  return furniture.some((item, index) =>
    furniture.slice(index + 1).some((other) => furnitureOverlaps(item, other)),
  )
}

export function findFurnitureSpace(layout: Layout, type: FurnitureType): Position | null {
  const size = furnitureLibrary[type]
  const xLimit = (layout.roomWidth - size.width) / 2
  const zLimit = (layout.roomDepth - size.depth) / 2
  if (xLimit < 0 || zLimit < 0) return null

  // Scan in 20 cm steps, allowing a 5 cm gap between furniture footprints.
  for (let z = -zLimit; z <= zLimit + 1e-6; z += 0.2) {
    for (let x = -xLimit; x <= xLimit + 1e-6; x += 0.2) {
      const candidate: FurnitureItem = { id: '', type, position: [x, 0, z], rotation: 0 }
      if (!layout.furniture.some((other) => furnitureOverlaps(candidate, other, 0.05))) {
        return candidate.position
      }
    }
  }
  return null
}
