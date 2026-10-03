import { useEffect } from 'react'

type ShortcutOptions = {
  disabled: boolean
  canDelete: boolean
  onUndo: () => void
  onDelete: () => void
}

export function usePlannerShortcuts({ disabled, canDelete, onUndo, onDelete }: ShortcutOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target
      const isRange = target instanceof HTMLInputElement && target.type === 'range'
      if (target instanceof HTMLElement
        && (target.closest('input, textarea, select') || target.isContentEditable)
        && !isRange) return
      if (disabled || event.altKey) return
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) {
        event.preventDefault()
        onUndo()
        return
      }
      if (target instanceof HTMLInputElement || !canDelete || event.ctrlKey || event.metaKey) return
      if (event.key !== 'Delete' && event.key !== 'Backspace') return
      event.preventDefault()
      onDelete()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, canDelete, onUndo, onDelete])
}
