import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseLayout, serializeLayout } from '../src/services/layoutStorage.ts'

const layout = {
  roomWidth: 3, roomDepth: 4,
  furniture: [{ id: 'bed-1', type: 'bed', position: [0, 0, 0], rotation: Math.PI / 2 }],
}

test('save/load preserves room size, furniture IDs, positions and rotations', () => {
  assert.deepEqual(parseLayout(serializeLayout(layout)), layout)
  assert.deepEqual(parseLayout(serializeLayout({ ...layout, furniture: [] })).furniture, [])
})

test('invalid JSON, unsupported versions and malformed furniture are rejected', () => {
  assert.throws(() => parseLayout('not JSON'))
  assert.throws(() => parseLayout(JSON.stringify({ version: 2, layout })))
  for (const invalid of [
    { ...layout, roomWidth: 0 },
    { ...layout, roomDepth: 100 },
    { ...layout, furniture: [{ ...layout.furniture[0], type: 'unknown' }] },
    { ...layout, furniture: [{ ...layout.furniture[0], position: [0, null, 0] }] },
    { ...layout, furniture: [{ ...layout.furniture[0], rotation: null }] },
    { ...layout, furniture: [layout.furniture[0], layout.furniture[0]] },
  ]) assert.throws(() => parseLayout(serializeLayout(invalid)))
})

test('valid but out-of-bounds saved positions are brought back onto the floor', () => {
  const result = parseLayout(serializeLayout({
    ...layout,
    furniture: [{ ...layout.furniture[0], position: [30, 5, -30] }],
  }))
  assert.ok(Math.abs(result.furniture[0].position[0] - 0.5) < 1e-9)
  assert.equal(result.furniture[0].position[1], 0)
  assert.ok(Math.abs(result.furniture[0].position[2] + 1.51) < 1e-9)
})
