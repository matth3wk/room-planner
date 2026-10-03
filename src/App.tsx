import { useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bed, BedsideTable } from './Furniture'
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

function App() {
  const [roomWidth, setRoomWidth] = useState(defaultPreset.width)
  const [roomDepth, setRoomDepth] = useState(defaultPreset.depth)
  const matchingPreset = bedroomPresets.find(
    (preset) => preset.width === roomWidth && preset.depth === roomDepth,
  )
  // Keep the furniture beside the back-left corner as the room changes size.
  const bedX = -roomWidth / 2 + 0.65
  const bedZ = -roomDepth / 2 + 1

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
      <main className="scene-container" aria-label="3D room preview">
        <Canvas className="scene" camera={{ position: [6, 18, 6], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 2]} intensity={1.5} />

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

          <Bed position={[bedX, 0, bedZ]} />
          <BedsideTable position={[bedX + 0.9, 0, -roomDepth / 2 + 0.3]} />

          <OrbitControls target={[0, 1, 0]} />
        </Canvas>
      </main>
    </div>
  )
}

export default App
