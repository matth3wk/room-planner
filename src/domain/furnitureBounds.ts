import type { Position, Size } from './types'

// Axis-aligned floor footprint of a rectangle rotated around Y.
export function getFootprint(size: Size, rotation: number): Size {
  const cos = Math.abs(Math.cos(rotation))
  const sin = Math.abs(Math.sin(rotation))
  return {
    width: size.width * cos + size.depth * sin,
    depth: size.width * sin + size.depth * cos,
  }
}

export function constrainToRoom(
  position: Position,
  rotation: number,
  size: Size,
  room: Size,
  previousRotation = 0,
): { position: Position; rotation: number } {
  let footprint = getFootprint(size, rotation)
  const fits = (footprint: Size) => footprint.width <= room.width + 1e-9
    && footprint.depth <= room.depth + 1e-9

  // Reject an angle that cannot fit, even at the centre of the room.
  if (!fits(footprint)) {
    rotation = previousRotation
    footprint = getFootprint(size, rotation)
    // A room resize may invalidate the previous angle too.
    if (!fits(footprint)) {
      rotation = 0
      footprint = getFootprint(size, rotation)
    }
  }

  const xLimit = Math.max(0, (room.width - footprint.width) / 2)
  const zLimit = Math.max(0, (room.depth - footprint.depth) / 2)
  return {
    position: [
      Math.max(-xLimit, Math.min(xLimit, position[0])),
      0,
      Math.max(-zLimit, Math.min(zLimit, position[2])),
    ],
    rotation,
  }
}
