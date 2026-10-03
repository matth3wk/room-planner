import { useRef, useState } from 'react'
import { furnitureLibrary, initialLayout } from '../domain/catalog'
import { findFurnitureSpace, hasFurnitureOverlaps, removeFurniture, resizeRoom, transformFurniture } from '../domain/layout'
import type { FurnitureType, Position, TransformMode } from '../domain/types'
import { loadLayoutFromStorage, saveLayoutToStorage } from '../services/layoutStorage'
import { useLayoutHistory } from './useLayoutHistory'
import { usePlannerShortcuts } from './usePlannerShortcuts'

// This hook owns planner behaviour; UI and scene components receive props.
export function usePlanner() {
  const history = useLayoutHistory(initialLayout)
  const { layout, changeLayout, beginChange, endChange, undo, canUndo, isChanging } = history
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [libraryMessage, setLibraryMessage] = useState('')
  const [layoutMessage, setLayoutMessage] = useState('')
  const [transformMode, setTransformMode] = useState<TransformMode>('translate')
  const [isDragging, setIsDragging] = useState(false)
  const isTransforming = useRef(false)

  function selectFurniture(id: string) {
    if (!isTransforming.current) setSelectedId(id)
  }

  function clearSelection() {
    if (!isTransforming.current) setSelectedId(null)
  }

  function handleDraggingChange(dragging: boolean) {
    isTransforming.current = true
    setIsDragging(dragging)
    if (dragging) beginChange()
    else endChange()
    // Ignore the click immediately following a gizmo drag.
    if (!dragging) requestAnimationFrame(() => { isTransforming.current = false })
  }

  function resize(width: number, depth: number) {
    changeLayout((current) => resizeRoom(current, width, depth))
  }

  function updateFurniture(id: string, position: Position, rotation: number) {
    changeLayout((current) => transformFurniture(current, id, position, rotation))
  }

  function deleteSelectedFurniture() {
    if (!selectedId || isChanging || isDragging) return
    changeLayout((current) => removeFurniture(current, selectedId))
    setSelectedId(null)
    setLibraryMessage('Furniture deleted.')
  }

  function addFurniture(type: FurnitureType) {
    const position = findFurnitureSpace(layout, type)
    const name = furnitureLibrary[type].name
    if (!position) {
      setLibraryMessage(`No free space for another ${name.toLowerCase()}. Increase the room dimensions.`)
      return
    }
    const id = crypto.randomUUID()
    changeLayout((current) => ({
      ...current, furniture: [...current.furniture, { id, type, position, rotation: 0 }],
    }))
    setSelectedId(id)
    setLibraryMessage(`${name} added.`)
  }

  function saveLayout() {
    try {
      saveLayoutToStorage(layout)
      setLayoutMessage('Layout saved in this browser.')
    } catch {
      setLayoutMessage('Could not save. Browser storage may be unavailable or full.')
    }
  }

  function loadLayout() {
    try {
      const saved = loadLayoutFromStorage()
      if (!saved) {
        setLayoutMessage('No saved layout in this browser yet.')
        return
      }
      changeLayout(saved)
      setSelectedId(null)
      setLibraryMessage('')
      setLayoutMessage('Saved layout loaded.')
    } catch {
      setLayoutMessage('Could not load. Saved data may be invalid or browser storage unavailable.')
    }
  }

  function undoChange() {
    undo()
    setSelectedId(null)
    setLibraryMessage('')
    setLayoutMessage(canUndo ? 'Last change undone.' : 'Nothing to undo.')
  }

  usePlannerShortcuts({
    disabled: isChanging || isDragging,
    canDelete: selectedId !== null,
    onUndo: undoChange,
    onDelete: deleteSelectedFurniture,
  })

  return {
    layout, selectedId, selectedItem: layout.furniture.find((item) => item.id === selectedId),
    libraryMessage, layoutMessage, transformMode, isDragging, isChanging, canUndo,
    hasOverlaps: hasFurnitureOverlaps(layout.furniture),
    selectFurniture, clearSelection, handleDraggingChange, setTransformMode,
    resize, updateFurniture, deleteSelectedFurniture, addFurniture,
    saveLayout, loadLayout, undoChange, beginChange, endChange,
  }
}
