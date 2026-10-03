import assert from 'node:assert/strict'
import { test } from 'node:test'
import { initialLayout, furnitureLibrary } from '../src/domain/catalog.ts'
import { getFootprint } from '../src/domain/furnitureBounds.ts'
import { findFurnitureSpace, furnitureOverlaps, hasFurnitureOverlaps, removeFurniture, resizeRoom, transformFurniture } from '../src/domain/layout.ts'

test('resizing clamps furniture without mutating the previous layout', () => {
  const before = structuredClone(initialLayout)
  const resized = resizeRoom(initialLayout, 2, 2)
  assert.deepEqual(initialLayout, before)
  assert.equal(resized.roomWidth, 2)
  for (const item of resized.furniture) {
    const size = getFootprint(furnitureLibrary[item.type], item.rotation)
    assert.ok(Math.abs(item.position[0]) + size.width / 2 <= 1 + 1e-9)
    assert.ok(Math.abs(item.position[2]) + size.depth / 2 <= 1 + 1e-9)
    assert.equal(item.position[1], 0)
  }
})

test('transforming and deleting target one item and preserve undo snapshots', () => {
  const before = structuredClone(initialLayout)
  const moved = transformFurniture(initialLayout, 'starter-bed', [30, 8, -30], 0)
  assert.deepEqual(moved.furniture[0].position, [1.01, 0, -1])
  assert.deepEqual(moved.furniture[1], initialLayout.furniture[1])
  const removed = removeFurniture(moved, 'starter-bed')
  assert.equal(removed.furniture.length, 1)
  assert.deepEqual(initialLayout, before)
  assert.equal(moved.furniture.length, 2)
})

test('overlap checks account for rotation and allow touching edges', () => {
  const bed = { id: 'a', type: 'bed', position: [0, 0, 0], rotation: Math.PI / 2 }
  const table = { id: 'b', type: 'bedsideTable', position: [1.225, 0, 0], rotation: 0 }
  assert.equal(furnitureOverlaps(bed, table), false)
  assert.equal(furnitureOverlaps(bed, table, 0.05), true)
  assert.equal(hasFurnitureOverlaps([bed, { ...table, position: [0.8, 0, 0] }]), true)
  assert.equal(hasFurnitureOverlaps(initialLayout.furniture), false)
})

test('spawning finds clear floor space and reports a full room', () => {
  const before = structuredClone(initialLayout)
  const position = findFurnitureSpace(initialLayout, 'bedsideTable')
  assert.ok(position)
  const candidate = { id: 'new', type: 'bedsideTable', position, rotation: 0 }
  assert.equal(hasFurnitureOverlaps([...initialLayout.furniture, candidate]), false)
  assert.deepEqual(initialLayout, before)
  const full = { roomWidth: 2, roomDepth: 2, furniture: [
    { id: 'a', type: 'bed', position: [-0.5, 0, 0], rotation: 0 },
    { id: 'b', type: 'bed', position: [0.5, 0, 0], rotation: 0 },
  ] }
  assert.equal(findFurnitureSpace(full, 'bedsideTable'), null)
  assert.equal(findFurnitureSpace({ ...full, roomWidth: 0.5 }, 'bed'), null)
})
