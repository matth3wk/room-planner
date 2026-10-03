// All positions and dimensions are in metres; rotations are in radians.
export type Position = [number, number, number]
export type Size = { width: number; depth: number }
export type FurnitureType = 'bed' | 'bedsideTable'
export type TransformMode = 'translate' | 'rotate'

export type FurnitureItem = {
  id: string
  type: FurnitureType
  position: Position
  rotation: number
}

export type Layout = {
  roomWidth: number
  roomDepth: number
  furniture: FurnitureItem[]
}
