import assert from 'node:assert/strict'
import { test } from 'node:test'
import { initialLayout } from '../src/domain/catalog.ts'
import { loadLayoutFromStorage, saveLayoutToStorage, storageKey } from '../src/services/layoutStorage.ts'

test('storage service preserves the existing save key and version', () => {
  const entries = new Map()
  const storage = { getItem: (key) => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) }
  assert.equal(loadLayoutFromStorage(storage), null)
  saveLayoutToStorage(initialLayout, storage)
  assert.equal(JSON.parse(entries.get(storageKey)).version, 1)
  assert.deepEqual(loadLayoutFromStorage(storage), initialLayout)
})

test('storage failures and invalid data propagate to the UI error handler', () => {
  const unavailable = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('full') } }
  assert.throws(() => saveLayoutToStorage(initialLayout, unavailable), /full/)
  assert.throws(() => loadLayoutFromStorage(unavailable), /blocked/)
  assert.throws(() => loadLayoutFromStorage({ ...unavailable, getItem: () => '{broken' }))
})
