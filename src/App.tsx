import { FurnitureSidebar } from './components/FurnitureSidebar'
import { LayoutToolbar } from './components/LayoutToolbar'
import { RoomControls } from './components/RoomControls'
import { usePlanner } from './hooks/usePlanner'
import { RoomScene } from './scene/RoomScene'
import './styles/planner.css'

function App() {
  const planner = usePlanner()

  return (
    <div className="planner">
      <RoomControls layout={planner.layout} disabled={planner.isDragging}
        onResize={planner.resize} onBeginChange={planner.beginChange} onEndChange={planner.endChange}
        toolbar={
          <LayoutToolbar disabled={planner.isChanging} canUndo={planner.canUndo}
            message={planner.layoutMessage} onSave={planner.saveLayout}
            onLoad={planner.loadLayout} onUndo={planner.undoChange} />
        }
      />
      <div className="viewer-layout">
        <FurnitureSidebar furniture={planner.layout.furniture} selectedItem={planner.selectedItem}
          message={planner.libraryMessage} hasOverlaps={planner.hasOverlaps}
          isChanging={planner.isChanging} isDragging={planner.isDragging} mode={planner.transformMode}
          onAdd={planner.addFurniture} onSelect={planner.selectFurniture}
          onModeChange={planner.setTransformMode} onClearSelection={planner.clearSelection}
          onDelete={planner.deleteSelectedFurniture} />
        <RoomScene layout={planner.layout} selectedId={planner.selectedId}
          mode={planner.transformMode} isDragging={planner.isDragging}
          onSelect={planner.selectFurniture} onClearSelection={planner.clearSelection}
          onTransform={planner.updateFurniture} onDraggingChange={planner.handleDraggingChange} />
      </div>
    </div>
  )
}

export default App
