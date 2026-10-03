import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { Layout, Position, TransformMode } from '../domain/types'
import { FurnitureInstance } from './FurnitureInstance'
import { RoomShell } from './RoomShell'

type RoomSceneProps = {
  layout: Layout
  selectedId: string | null
  mode: TransformMode
  isDragging: boolean
  onSelect: (id: string) => void
  onClearSelection: () => void
  onTransform: (id: string, position: Position, rotation: number) => void
  onDraggingChange: (dragging: boolean) => void
}

export function RoomScene({
  layout, selectedId, mode, isDragging, onSelect, onClearSelection, onTransform, onDraggingChange,
}: RoomSceneProps) {
  return (
    <main className="scene-container" aria-label="3D room preview">
      <Canvas className="scene" camera={{ position: [6, 18, 6], fov: 45 }} onPointerMissed={onClearSelection}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1.5} />
        <RoomShell width={layout.roomWidth} depth={layout.roomDepth} onClearSelection={onClearSelection} />
        {layout.furniture.map((item) => (
          <FurnitureInstance key={item.id} item={item} selected={item.id === selectedId}
            mode={mode} room={{ width: layout.roomWidth, depth: layout.roomDepth }}
            onSelect={onSelect} onTransform={onTransform} onDraggingChange={onDraggingChange} />
        ))}
        <OrbitControls makeDefault enabled={!isDragging} target={[0, 1, 0]} />
      </Canvas>
    </main>
  )
}
