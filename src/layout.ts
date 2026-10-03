import { constrainToRoom } from './furnitureBounds.ts'

export type FurnitureType = 'bed' | 'bedsideTable'
export type FurnitureItem = {
  id: string
  type: FurnitureType
  position: [number, number, number]
  rotation: number
}
export type Layout = {
  roomWidth: number
  roomDepth: number
  furniture: FurnitureItem[]
}

export const storageKey = 'room-planner.layout.v1'
export const furnitureLibrary = {
  bed: { name: 'Bed', width: 0.98, depth: 2 },
  bedsideTable: { name: 'Bedside table', width: 0.45, depth: 0.4 },
}

// Store the same constrained positions that the user sees in the room.
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

export function serializeLayout(layout: Layout): string {
  return JSON.stringify({ version: 1, layout })
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isMeasurement(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 2 && value <= 12
}

// localStorage contains strings, so check the parsed data before using it.
export function parseLayout(text: string): Layout {
  const saved: unknown = JSON.parse(text)
  if (!isObject(saved) || saved.version !== 1 || !isObject(saved.layout)) {
    throw new Error('Unsupported saved layout.')
  }
  const layout = saved.layout
  if (!isMeasurement(layout.roomWidth) || !isMeasurement(layout.roomDepth)
    || !Array.isArray(layout.furniture)) throw new Error('Invalid room dimensions.')

  const ids = new Set<string>()
  const furniture = layout.furniture.map((item): FurnitureItem => {
    if (!isObject(item) || typeof item.id !== 'string' || !item.id || ids.has(item.id)
      || (item.type !== 'bed' && item.type !== 'bedsideTable')
      || !Array.isArray(item.position) || item.position.length !== 3
      || !item.position.every((value) => typeof value === 'number' && Number.isFinite(value))
      || typeof item.rotation !== 'number' || !Number.isFinite(item.rotation)) {
      throw new Error('Invalid furniture data.')
    }
    ids.add(item.id)
    return {
      id: item.id,
      type: item.type,
      position: [item.position[0], item.position[1], item.position[2]],
      rotation: item.rotation,
    }
  })
  return normalizeLayout({ roomWidth: layout.roomWidth, roomDepth: layout.roomDepth, furniture })
}
