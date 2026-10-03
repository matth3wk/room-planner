import { useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import './App.css'

// All measurements are in metres: one Three.js unit = one metre.
const wallHeight = 3
const wallThickness = 0.2

function App() {
  const [roomWidth, setRoomWidth] = useState(8)
  const [roomDepth, setRoomDepth] = useState(6)

  return (
    <div className="planner">
      <section className="room-controls" aria-labelledby="room-title">
        <h1 id="room-title">Room dimensions</h1>
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
        <p>Inside dimensions · Height: {wallHeight} m · Wall thickness: {wallThickness * 100} cm</p>
        <p>Floor: X/Z · Height: Y · Centre of the floor: (0, 0, 0)</p>
        <p>Drag to rotate · Scroll to zoom · Right-drag to pan</p>
      </section>
      <main className="scene-container" aria-label="3D room preview">
    <Canvas className="scene" camera={{ position: [14, 12, 14], fov: 45 }}>
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

      <OrbitControls target={[0, 1, 0]} />
    </Canvas>
      </main>
    </div>
  )
}

export default App
