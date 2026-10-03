type LayoutToolbarProps = {
  disabled: boolean
  canUndo: boolean
  message: string
  onSave: () => void
  onLoad: () => void
  onUndo: () => void
}

export function LayoutToolbar({ disabled, canUndo, message, onSave, onLoad, onUndo }: LayoutToolbarProps) {
  return (
    <>
      <div className="layout-actions" role="group" aria-label="Save, load and undo">
        <button type="button" className="preset-button" disabled={disabled} onClick={onSave}>Save layout</button>
        <button type="button" className="preset-button" disabled={disabled} onClick={onLoad}>Load layout</button>
        <button type="button" className="preset-button" disabled={!canUndo} onClick={onUndo}>Undo</button>
        <span>Undo: Ctrl+Z / ⌘Z</span>
      </div>
      <p role="status" className="layout-message">{message}</p>
    </>
  )
}
