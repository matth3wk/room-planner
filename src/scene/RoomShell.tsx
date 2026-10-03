import { wallHeight, wallThickness } from '../domain/catalog'
import type { Position, Size } from '../domain/types'

export function RoomShell({ width, depth, onClearSelection }: Size & { onClearSelection: () => void }) {
  // Walls sit outside the usable floor; the origin is the floor's centre.
  const walls: { position: Position; size: Position }[] = [
    { position: [0, wallHeight / 2, -(depth + wallThickness) / 2], size: [width + 2 * wallThickness, wallHeight, wallThickness] },
    { position: [0, wallHeight / 2, (depth + wallThickness) / 2], size: [width + 2 * wallThickness, wallHeight, wallThickness] },
    { position: [-(width + wallThickness) / 2, wallHeight / 2, 0], size: [wallThickness, wallHeight, depth] },
    { position: [(width + wallThickness) / 2, wallHeight / 2, 0], size: [wallThickness, wallHeight, depth] },
  ]
  return (
    <group onClick={(event) => { event.stopPropagation(); onClearSelection() }}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#b89b7a" />
      </mesh>
      {walls.map((wall, index) => (
        <mesh key={index} position={wall.position}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color="#eee9df" />
        </mesh>
      ))}
    </group>
  )
}
