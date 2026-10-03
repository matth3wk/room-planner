import { useRef } from 'react'
import { TransformControls } from '@react-three/drei'
import type { Group } from 'three'
import { Bed, BedsideTable } from './Furniture'
import { constrainToRoom } from './furnitureBounds'

type FurnitureInstanceProps = {
  type: 'bed' | 'bedsideTable'
  position: [number, number, number]
  rotation: number
  selected: boolean
  mode: 'translate' | 'rotate'
  size: { width: number; depth: number }
  room: { width: number; depth: number }
  onSelect: () => void
  onTransform: (position: [number, number, number], rotation: number) => void
  onDraggingChange: (dragging: boolean) => void
}

export function FurnitureInstance({
  type, position, rotation, selected, mode, size, room,
  onSelect, onTransform, onDraggingChange,
}: FurnitureInstanceProps) {
  // A ref gives us the actual Three.js group being changed by the gizmo.
  const group = useRef<Group>(null!)

  function handleObjectChange() {
    const object = group.current
    if (!object) return
    const constrained = constrainToRoom(
      [object.position.x, object.position.y, object.position.z],
      object.rotation.y, size, room, rotation,
    )
    object.position.set(...constrained.position)
    object.rotation.set(0, constrained.rotation, 0)
    onTransform(constrained.position, constrained.rotation)
  }

  return (
    <>
      <group ref={group} position={position} rotation={[0, rotation, 0]}>
        {type === 'bed' ? (
          <Bed position={[0, 0, 0]} selected={selected} onSelect={onSelect} />
        ) : (
          <BedsideTable position={[0, 0, 0]} selected={selected} onSelect={onSelect} />
        )}
      </group>
      {selected && (
        <TransformControls
          object={group}
          mode={mode}
          space="world"
          showX={mode === 'translate'}
          showY={mode === 'rotate'}
          showZ={mode === 'translate'}
          rotationSnap={Math.PI / 12}
          onObjectChange={handleObjectChange}
          onMouseDown={() => onDraggingChange(true)}
          onMouseUp={() => onDraggingChange(false)}
        />
      )}
    </>
  )
}
