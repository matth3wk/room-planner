import { useEffect, useRef, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { FurnitureInstance } from './FurnitureInstance'
import { constrainToRoom, getFootprint } from './furnitureBounds'
import './App.css'

// All measurements are in metres: one Three.js unit = one metre.
const wallHeight = 3
const wallThickness = 0.2

// Representative starter footprints, rather than measured UK-wide averages.
const bedroomPresets = [
  { name: 'Small bedroom', width: 2.5, depth: 3.2 },
  { name: 'Standard bedroom', width: 3, depth: 4 },
  { name: 'Loft bedroom', width: 4, depth: 5 },
]
const defaultPreset = bedroomPresets[1]

type FurnitureType = 'bed' | 'bedsideTable'
type FurnitureItem = {
  id: string
  type: FurnitureType
  position: [number, number, number]
  rotation: number
}

const furnitureLibrary = {
  bed: { name: 'Bed', width: 0.98, depth: 2 },
  bedsideTable: { name: 'Bedside table', width: 0.45, depth: 0.4 },
}

function App() {
  const [roomWidth, setRoomWidth] = useState(defaultPreset.width)
  const [roomDepth, setRoomDepth] = useState(defaultPreset.depth)
  const [furniture, setFurniture] = useState<FurnitureItem[]>([
    { id: 'starter-bed', type: 'bed', position: [-0.85, 0, -1], rotation: 0 },
    { id: 'starter-table', type: 'bedsideTable', position: [0.05, 0, -1.7], rotation: 0 },
  ])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [libraryMessage, setLibraryMessage] = useState('')
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>('translate')
  const [isDragging, setIsDragging] = useState(false)
  const isTransforming = useRef(false)

  // Register the shortcut while this component is mounted; remove it on cleanup.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target
      if (target instanceof HTMLElement
        && (target.closest('input, textarea, select') || target.isContentEditable)) return
      if (!selectedId || isDragging || event.ctrlKey || event.metaKey || event.altKey) return
      if (event.key !== 'Delete' && event.key !== 'Backspace') return
      event.preventDefault()
      setFurniture((items) => items.filter((item) => item.id !== selectedId))
      setSelectedId(null)
      setLibraryMessage('Furniture deleted.')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, isDragging])
  const matchingPreset = bedroomPresets.find(
    (preset) => preset.width === roomWidth && preset.depth === roomDepth,
  )
  // Clamp positions to the floor when the room shrinks.
  const placedFurniture = furniture.map<FurnitureItem>((item) => {
    return {
      ...item,
      ...constrainToRoom(item.position, item.rotation, furnitureLibrary[item.type], {
        width: roomWidth, depth: roomDepth,
      }),
    }
  })
  const selectedItem = placedFurniture.find((item) => item.id === selectedId)

  function overlapsFurniture(x: number, z: number, type: FurnitureType, other: FurnitureItem) {
    const size = furnitureLibrary[type]
    const otherSize = getFootprint(furnitureLibrary[other.type], other.rotation)
    return Math.abs(x - other.position[0]) < (size.width + otherSize.width) / 2 + 0.05
      && Math.abs(z - other.position[2]) < (size.depth + otherSize.depth) / 2 + 0.05
  }

  const hasOverlaps = placedFurniture.some((item, index) => {
    const size = getFootprint(furnitureLibrary[item.type], item.rotation)
    return placedFurniture.slice(index + 1).some((other) => {
      const otherSize = getFootprint(furnitureLibrary[other.type], other.rotation)
      return Math.abs(item.position[0] - other.position[0]) < (size.width + otherSize.width) / 2 - 1e-9
        && Math.abs(item.position[2] - other.position[2]) < (size.depth + otherSize.depth) / 2 - 1e-9
    })
  })

  function clearSelection() {
    if (!isTransforming.current) setSelectedId(null)
  }

  function handleDraggingChange(dragging: boolean) {
    isTransforming.current = true
    setIsDragging(dragging)
    if (!dragging) {
      // Ignore the click following a gizmo drag before permitting deselection.
      requestAnimationFrame(() => { isTransforming.current = false })
    }
  }

  function updateFurniture(id: string, position: [number, number, number], rotation: number) {
    setFurniture(placedFurniture.map((item) => item.id === id ? { ...item, position, rotation } : item))
  }

  function deleteSelectedFurniture() {
    if (!selectedId || isDragging) return
    setFurniture(furniture.filter((item) => item.id !== selectedId))
    setSelectedId(null)
    setLibraryMessage('Furniture deleted.')
  }

  function addFurniture(type: FurnitureType) {
    const size = furnitureLibrary[type]
    const xLimit = (roomWidth - size.width) / 2
    const zLimit = (roomDepth - size.depth) / 2

    // Scan the floor in 20 cm steps for a free footprint.
    for (let z = -zLimit; z <= zLimit + 0.000001; z += 0.2) {
      for (let x = -xLimit; x <= xLimit + 0.000001; x += 0.2) {
        if (placedFurniture.some((other) => overlapsFurniture(x, z, type, other))) continue
        const id = crypto.randomUUID()
        setFurniture([...placedFurniture, { id, type, position: [x, 0, z], rotation: 0 }])
        setSelectedId(id)
        setLibraryMessage(`${size.name} added.`)
        return
      }
    }
    setLibraryMessage(`No free space for another ${size.name.toLowerCase()}. Increase the room dimensions.`)
  }

  return (
    <div className="planner">
      <section className="room-controls" aria-labelledby="room-title">
        <h1 id="room-title">Room dimensions</h1>
        <div className="dimension-options">
          <fieldset className="preset-controls">
            <legend>Bedroom presets</legend>
            <div className="preset-buttons">
              {bedroomPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className="preset-button"
                  aria-pressed={matchingPreset === preset}
                  onClick={() => {
                    setRoomWidth(preset.width)
                    setRoomDepth(preset.depth)
                  }}
                >
                  <span>{preset.name}</span>
                  <span>{preset.width.toFixed(1)} × {preset.depth.toFixed(1)} m</span>
                  <span>{(preset.width * preset.depth).toFixed(1)} m²</span>
                </button>
              ))}
            </div>
          </fieldset>
          <div className="measurement-controls">
            <label htmlFor="room-width">Width (X): {roomWidth.toFixed(1)} m</label>
            <input
              id="room-width"
              type="range"
              min="2"
              max="12"
              step="0.1"
              value={roomWidth}
              onChange={(event) => setRoomWidth(Number(event.target.value))}
              aria-valuetext={`${roomWidth.toFixed(1)} metres`}
            />
            <label htmlFor="room-depth">Depth (Z): {roomDepth.toFixed(1)} m</label>
            <input
              id="room-depth"
              type="range"
              min="2"
              max="12"
              step="0.1"
              value={roomDepth}
              onChange={(event) => setRoomDepth(Number(event.target.value))}
              aria-valuetext={`${roomDepth.toFixed(1)} metres`}
            />
            <p aria-live="polite">
              {matchingPreset?.name ?? 'Custom room'} · Floor area: {(roomWidth * roomDepth).toFixed(1)} m²
            </p>
          </div>
        </div>
        <p>Inside dimensions · Height: {wallHeight} m · Wall thickness: {wallThickness * 100} cm</p>
        <p>Drag to rotate · Scroll to zoom · Right-drag to pan</p>
      </section>
      <div className="viewer-layout">
        <aside className="furniture-sidebar" aria-labelledby="library-title">
          <h2 id="library-title">Furniture library</h2>
          <p>Click an item to add it.</p>
          <button className="preset-button library-button" type="button" onClick={() => addFurniture('bed')}>
            <span>Add bed</span>
            <span>0.98 × 2 m</span>
          </button>
          <button className="preset-button library-button" type="button" onClick={() => addFurniture('bedsideTable')}>
            <span>Add bedside table</span>
            <span>0.45 × 0.4 m</span>
          </button>
          <p role="status">{libraryMessage}</p>
          {hasOverlaps && <p>Some furniture footprints overlap. Move items apart to make space.</p>}
          <h2>In this room</h2>
          <ul className="furniture-list">
            {furniture.map((item, index) => (
              <li key={item.id}>
                <button
                  className="preset-button library-button"
                  type="button"
                  aria-pressed={item.id === selectedId}
                  onClick={() => setSelectedId(item.id)}
                >
                  {furnitureLibrary[item.type].name} {index + 1}
                </button>
              </li>
            ))}
          </ul>
          <p aria-live="polite">{selectedItem ? `Selected: ${furnitureLibrary[selectedItem.type].name}` : 'Click furniture to select it.'}</p>
          {selectedItem && (
            <div className="selection-controls">
              <div className="transform-modes" role="group" aria-label="Furniture transform mode">
                <button type="button" className="preset-button" aria-pressed={transformMode === 'translate'} disabled={isDragging} onClick={() => setTransformMode('translate')}>Move</button>
                <button type="button" className="preset-button" aria-pressed={transformMode === 'rotate'} disabled={isDragging} onClick={() => setTransformMode('rotate')}>Rotate</button>
              </div>
              <p>Drag the arrows to move, or the ring to rotate.</p>
              <p>X: {selectedItem.position[0].toFixed(2)} m · Z: {selectedItem.position[2].toFixed(2)} m</p>
              <p>Rotation: {Math.round(selectedItem.rotation * 180 / Math.PI)}°</p>
              <button type="button" className="preset-button library-button" disabled={isDragging} onClick={clearSelection}>Clear selection</button>
              <button type="button" className="preset-button library-button delete-button" disabled={isDragging} onClick={deleteSelectedFurniture}>Delete selected</button>
              <p>Shortcut: Delete or Backspace.</p>
            </div>
          )}
        </aside>
        <main className="scene-container" aria-label="3D room preview">
          <Canvas
            className="scene"
            camera={{ position: [6, 18, 6], fov: 45 }}
            onPointerMissed={clearSelection}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 2]} intensity={1.5} />

            <group onClick={(event) => {
              event.stopPropagation()
              clearSelection()
            }}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[roomWidth, roomDepth]} />
                <meshStandardMaterial color="#b89b7a" />
              </mesh>

              {/* Offset walls outward so width and depth measure the usable floor. */}
              <mesh position={[0, wallHeight / 2, -(roomDepth + wallThickness) / 2]}>
                <boxGeometry args={[roomWidth + 2 * wallThickness, wallHeight, wallThickness]} />
                <meshStandardMaterial color="#eee9df" />
              </mesh>

              <mesh position={[0, wallHeight / 2, (roomDepth + wallThickness) / 2]}>
                <boxGeometry args={[roomWidth + 2 * wallThickness, wallHeight, wallThickness]} />
                <meshStandardMaterial color="#eee9df" />
              </mesh>

              <mesh position={[-(roomWidth + wallThickness) / 2, wallHeight / 2, 0]}>
                <boxGeometry args={[wallThickness, wallHeight, roomDepth]} />
                <meshStandardMaterial color="#eee9df" />
              </mesh>

              <mesh position={[(roomWidth + wallThickness) / 2, wallHeight / 2, 0]}>
                <boxGeometry args={[wallThickness, wallHeight, roomDepth]} />
                <meshStandardMaterial color="#eee9df" />
              </mesh>

            </group>

            {placedFurniture.map((item) => (
              <FurnitureInstance
                key={item.id}
                type={item.type}
                position={item.position}
                rotation={item.rotation}
                selected={item.id === selectedId}
                mode={transformMode}
                size={furnitureLibrary[item.type]}
                room={{ width: roomWidth, depth: roomDepth }}
                onSelect={() => { if (!isTransforming.current) setSelectedId(item.id) }}
                onTransform={(position, rotation) => updateFurniture(item.id, position, rotation)}
                onDraggingChange={handleDraggingChange}
              />
            ))}

            <OrbitControls makeDefault enabled={!isDragging} target={[0, 1, 0]} />
          </Canvas>
        </main>
      </div>
    </div>
  )
}

export default App
