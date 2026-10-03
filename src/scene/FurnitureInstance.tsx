import { useRef } from 'react'
import { Edges, TransformControls } from '@react-three/drei'
import type { Group } from 'three'
import { Bed, BedsideTable } from './FurnitureModels'
import { furnitureLibrary } from '../domain/catalog'
import { constrainToRoom } from '../domain/furnitureBounds'
import type { FurnitureItem, Position, Size, TransformMode } from '../domain/types'

type FurnitureInstanceProps = {
  item: FurnitureItem
  selected: boolean
  mode: TransformMode
  room: Size
  onSelect: (id: string) => void
  onTransform: (id: string, position: Position, rotation: number) => void
  onDraggingChange: (dragging: boolean) => void
}

function SelectionOutline({ width, depth, height }: Size & { height: number }) {
  return (
    <mesh position={[0, height / 2, 0]} raycast={() => {}}>
      <boxGeometry args={[width + 0.06, height + 0.06, depth + 0.06]} />
      <meshBasicMaterial visible={false} />
      <Edges color="#f59e0b" depthTest={false} raycast={() => {}} />
    </mesh>
  )
}

export function FurnitureInstance({
  item, selected, mode, room, onSelect, onTransform, onDraggingChange,
}: FurnitureInstanceProps) {
  // A ref exposes the actual Three.js object manipulated by the gizmo.
  const group = useRef<Group>(null!)
  const size = furnitureLibrary[item.type]

  function handleObjectChange() {
    const object = group.current
    if (!object) return
    const constrained = constrainToRoom(
      [object.position.x, object.position.y, object.position.z],
      object.rotation.y, size, room, item.rotation,
    )
    object.position.set(...constrained.position)
    object.rotation.set(0, constrained.rotation, 0)
    onTransform(item.id, constrained.position, constrained.rotation)
  }

  return (
    <>
      <group ref={group} position={item.position} rotation={[0, item.rotation, 0]}
        onClick={(event) => { event.stopPropagation(); onSelect(item.id) }}>
        {item.type === 'bed' ? <Bed /> : <BedsideTable />}
        {selected && <SelectionOutline {...size} />}
      </group>
      {selected && (
        <TransformControls
          object={group} mode={mode} space="world"
          showX={mode === 'translate'} showY={mode === 'rotate'} showZ={mode === 'translate'}
          rotationSnap={Math.PI / 12}
          onObjectChange={handleObjectChange}
          onMouseDown={() => onDraggingChange(true)}
          onMouseUp={() => onDraggingChange(false)}
        />
      )}
    </>
  )
}
