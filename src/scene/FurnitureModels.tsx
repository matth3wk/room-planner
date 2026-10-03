// A compact bed with an overall footprint of 0.98 × 2 m.
// Each group is positioned at floor level; its parts use local coordinates.
export function Bed() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.9, 0.3, 1.9]} />
        <meshStandardMaterial color="#79553a" />
      </mesh>
      <mesh position={[0, 0.39, 0]}>
        <boxGeometry args={[0.9, 0.18, 1.9]} />
        <meshStandardMaterial color="#f6f2e9" />
      </mesh>
      <mesh position={[0, 0.51, 0.3]}>
        <boxGeometry args={[0.92, 0.06, 1.2]} />
        <meshStandardMaterial color="#577d9b" />
      </mesh>
      <mesh position={[0, 0.53, -0.62]}>
        <boxGeometry args={[0.6, 0.1, 0.35]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.5, -0.96]}>
        <boxGeometry args={[0.98, 1, 0.08]} />
        <meshStandardMaterial color="#79553a" />
      </mesh>
    </group>
  )
}

// A 0.45 × 0.4 m bedside table, 0.55 m tall.
export function BedsideTable() {
  return (
    <group>
      <mesh position={[0, 0.505, 0]}>
        <boxGeometry args={[0.45, 0.09, 0.4]} />
        <meshStandardMaterial color="#a67850" />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.38, 0.04, 0.33]} />
        <meshStandardMaterial color="#a67850" />
      </mesh>
      <mesh position={[-0.16, 0.23, -0.135]}>
        <boxGeometry args={[0.06, 0.46, 0.06]} />
        <meshStandardMaterial color="#79553a" />
      </mesh>
      <mesh position={[0.16, 0.23, -0.135]}>
        <boxGeometry args={[0.06, 0.46, 0.06]} />
        <meshStandardMaterial color="#79553a" />
      </mesh>
      <mesh position={[-0.16, 0.23, 0.135]}>
        <boxGeometry args={[0.06, 0.46, 0.06]} />
        <meshStandardMaterial color="#79553a" />
      </mesh>
      <mesh position={[0.16, 0.23, 0.135]}>
        <boxGeometry args={[0.06, 0.46, 0.06]} />
        <meshStandardMaterial color="#79553a" />
      </mesh>
    </group>
  )
}
