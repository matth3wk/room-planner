import assert from 'node:assert/strict'
import { test } from 'node:test'
import { constrainToRoom } from '../src/furnitureBounds.ts'

const bed = { width: 0.98, depth: 2 }

test('translation stays on the floor and stops at both room edges', () => {
  const result = constrainToRoom([20, 9, -20], 0, bed, { width: 3, depth: 4 })
  assert.deepEqual(result.position, [1.01, 0, -1])
})

test('rotation uses the turned footprint rather than the original width', () => {
  const result = constrainToRoom([20, 1, 20], Math.PI / 2, bed, { width: 3, depth: 4 })
  assert.ok(Math.abs(result.position[0] - 0.5) < 1e-9)
  assert.ok(Math.abs(result.position[2] - 1.51) < 1e-9)
  assert.equal(result.rotation, Math.PI / 2)
})

test('an oversized angle is rejected and a resize can reset an invalid prior angle', () => {
  const room = { width: 2, depth: 2 }
  assert.equal(constrainToRoom([0, 0, 0], Math.PI / 4, bed, room, 0).rotation, 0)
  assert.equal(constrainToRoom([0, 0, 0], Math.PI / 4, bed, room, Math.PI / 4).rotation, 0)
})

test('every rotated corner stays inside the room across many angles and room sizes', () => {
  for (const room of [{ width: 2, depth: 2 }, { width: 2.5, depth: 3.2 }, { width: 3, depth: 4 }]) {
    for (const size of [bed, { width: 0.45, depth: 0.4 }]) {
      for (let angle = -Math.PI; angle <= Math.PI; angle += Math.PI / 48) {
        const result = constrainToRoom([20, 5, -20], angle, size, room)
        const cos = Math.cos(result.rotation)
        const sin = Math.sin(result.rotation)
        for (const x of [-size.width / 2, size.width / 2]) {
          for (const z of [-size.depth / 2, size.depth / 2]) {
            const worldX = result.position[0] + x * cos + z * sin
            const worldZ = result.position[2] - x * sin + z * cos
            assert.ok(Math.abs(worldX) <= room.width / 2 + 1e-9)
            assert.ok(Math.abs(worldZ) <= room.depth / 2 + 1e-9)
          }
        }
        assert.equal(result.position[1], 0)
      }
    }
  }
})
