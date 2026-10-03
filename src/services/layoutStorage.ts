import { furnitureLibrary, roomMeasurements } from '../domain/catalog.ts'
import { normalizeLayout } from '../domain/layout.ts'
import type { FurnitureItem, Layout } from '../domain/types'

export const storageKey = 'room-planner.layout.v1'
type LayoutStorage = Pick<Storage, 'getItem' | 'setItem'>

export function serializeLayout(layout: Layout): string {
  return JSON.stringify({ version: 1, layout })
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isMeasurement(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= roomMeasurements.min && value <= roomMeasurements.max
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
      || !isFurnitureType(item.type)
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

function isFurnitureType(value: unknown): value is FurnitureItem['type'] {
  return typeof value === 'string' && Object.hasOwn(furnitureLibrary, value)
}

// Passing storage explicitly also makes failures easy to exercise in tests.
export function saveLayoutToStorage(layout: Layout, storage: LayoutStorage = localStorage): void {
  storage.setItem(storageKey, serializeLayout(layout))
}

export function loadLayoutFromStorage(storage: LayoutStorage = localStorage): Layout | null {
  const text = storage.getItem(storageKey)
  return text === null ? null : parseLayout(text)
}
