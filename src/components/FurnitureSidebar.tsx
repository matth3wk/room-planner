import { furnitureLibrary, furnitureTypes } from '../domain/catalog'
import type { FurnitureItem, FurnitureType, TransformMode } from '../domain/types'

type FurnitureSidebarProps = {
  furniture: FurnitureItem[]
  selectedItem: FurnitureItem | undefined
  message: string
  hasOverlaps: boolean
  isChanging: boolean
  isDragging: boolean
  mode: TransformMode
  onAdd: (type: FurnitureType) => void
  onSelect: (id: string) => void
  onModeChange: (mode: TransformMode) => void
  onClearSelection: () => void
  onDelete: () => void
}

export function FurnitureSidebar({
  furniture, selectedItem, message, hasOverlaps, isChanging, isDragging,
  mode, onAdd, onSelect, onModeChange, onClearSelection, onDelete,
}: FurnitureSidebarProps) {
  return (
    <aside className="furniture-sidebar" aria-labelledby="library-title">
      <h2 id="library-title">Furniture library</h2>
      <p>Click an item to add it.</p>
      {furnitureTypes.map((type) => (
        <button key={type} className="preset-button library-button" type="button"
          disabled={isChanging} onClick={() => onAdd(type)}>
          <span>Add {furnitureLibrary[type].name.toLowerCase()}</span>
          <span>{furnitureLibrary[type].width} × {furnitureLibrary[type].depth} m</span>
        </button>
      ))}
      <p role="status">{message}</p>
      {hasOverlaps && <p>Some furniture footprints overlap. Move items apart to make space.</p>}
      <h2>In this room</h2>
      <ul className="furniture-list">
        {furniture.map((item, index) => (
          <li key={item.id}>
            <button
              className="preset-button library-button"
              type="button"
              aria-pressed={item.id === selectedItem?.id}
              disabled={isDragging}
              onClick={() => onSelect(item.id)}
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
            <button type="button" className="preset-button" aria-pressed={mode === 'translate'} disabled={isDragging} onClick={() => onModeChange('translate')}>Move</button>
            <button type="button" className="preset-button" aria-pressed={mode === 'rotate'} disabled={isDragging} onClick={() => onModeChange('rotate')}>Rotate</button>
          </div>
          <p>Drag the arrows to move, or the ring to rotate.</p>
          <p>X: {selectedItem.position[0].toFixed(2)} m · Z: {selectedItem.position[2].toFixed(2)} m</p>
          <p>Rotation: {Math.round(selectedItem.rotation * 180 / Math.PI)}°</p>
          <button type="button" className="preset-button library-button" disabled={isDragging} onClick={onClearSelection}>Clear selection</button>
          <button type="button" className="preset-button library-button delete-button" disabled={isDragging} onClick={onDelete}>Delete selected</button>
          <p>Shortcut: Delete or Backspace.</p>
        </div>
      )}
    </aside>
  )
}
