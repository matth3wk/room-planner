import { useRef, useState } from 'react'
import { normalizeLayout } from './layout'
import type { Layout } from './layout'

// Keep layout snapshots together so Undo restores room size and furniture.
export function useLayoutHistory(initialLayout: Layout) {
  const [layout, setLayout] = useState(initialLayout)
  const [past, setPast] = useState<Layout[]>([])
  const [isChanging, setIsChanging] = useState(false)
  const current = useRef(initialLayout)
  const changeStart = useRef<Layout | null>(null)

  function changeLayout(next: Layout) {
    next = normalizeLayout(next)
    const previous = current.current
    if (JSON.stringify(previous) === JSON.stringify(next)) return
    if (!changeStart.current) setPast((history) => [...history, previous].slice(-50))
    current.current = next
    setLayout(next)
  }

  function beginChange() {
    if (changeStart.current) return
    changeStart.current = current.current
    setIsChanging(true)
  }

  function endChange() {
    const previous = changeStart.current
    changeStart.current = null
    setIsChanging(false)
    if (previous && JSON.stringify(previous) !== JSON.stringify(current.current)) {
      setPast((history) => [...history, previous].slice(-50))
    }
  }

  function undo() {
    if (changeStart.current || past.length === 0) return
    const previous = past[past.length - 1]
    current.current = previous
    setLayout(previous)
    setPast(past.slice(0, -1))
  }

  return { layout, changeLayout, beginChange, endChange, undo, isChanging, canUndo: past.length > 0 && !isChanging }
}
