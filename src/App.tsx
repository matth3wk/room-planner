import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import './App.css'

function App() {
  return (
    <Canvas className="scene" camera={{ position: [4, 3, 4], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1.5} />

      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>

      <OrbitControls />
    </Canvas>
  )
}

export default App
