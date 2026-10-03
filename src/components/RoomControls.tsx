import type { ReactNode } from 'react'
import { bedroomPresets, roomMeasurements, wallHeight, wallThickness } from '../domain/catalog'
import type { Layout } from '../domain/types'

type RoomControlsProps = {
  layout: Layout
  disabled: boolean
  toolbar: ReactNode
  onResize: (width: number, depth: number) => void
  onBeginChange: () => void
  onEndChange: () => void
}

type MeasurementSliderProps = {
  id: string
  label: string
  value: number
  disabled: boolean
  onChange: (value: number) => void
  onBeginChange: () => void
  onEndChange: () => void
}

const sliderKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown']

function MeasurementSlider({ id, label, value, disabled, onChange, onBeginChange, onEndChange }: MeasurementSliderProps) {
  return (
    <>
      <label htmlFor={id}>{label}: {value.toFixed(1)} m</label>
      <input
        id={id} type="range" {...roomMeasurements} value={value} disabled={disabled}
        onPointerDown={onBeginChange} onPointerUp={onEndChange}
        onPointerCancel={onEndChange} onBlur={onEndChange}
        onKeyDown={(event) => { if (sliderKeys.includes(event.key)) onBeginChange() }}
        onKeyUp={onEndChange}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={`${value.toFixed(1)} metres`}
      />
    </>
  )
}

export function RoomControls({ layout, disabled, toolbar, onResize, onBeginChange, onEndChange }: RoomControlsProps) {
  const { roomWidth, roomDepth } = layout
  const matchingPreset = bedroomPresets.find((preset) => preset.width === roomWidth && preset.depth === roomDepth)
  return (
    <section className="room-controls" aria-labelledby="room-title">
      <h1 id="room-title">Room dimensions</h1>
      {toolbar}
      <div className="dimension-options">
        <fieldset className="preset-controls">
          <legend>Bedroom presets</legend>
          <div className="preset-buttons">
            {bedroomPresets.map((preset) => (
              <button key={preset.name} type="button" className="preset-button"
                aria-pressed={matchingPreset === preset} disabled={disabled}
                onClick={() => onResize(preset.width, preset.depth)}>
                <span>{preset.name}</span>
                <span>{preset.width.toFixed(1)} × {preset.depth.toFixed(1)} m</span>
                <span>{(preset.width * preset.depth).toFixed(1)} m²</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="measurement-controls">
          <MeasurementSlider id="room-width" label="Width (X)" value={roomWidth} disabled={disabled}
            onChange={(width) => onResize(width, roomDepth)} onBeginChange={onBeginChange} onEndChange={onEndChange} />
          <MeasurementSlider id="room-depth" label="Depth (Z)" value={roomDepth} disabled={disabled}
            onChange={(depth) => onResize(roomWidth, depth)} onBeginChange={onBeginChange} onEndChange={onEndChange} />
          <p aria-live="polite">{matchingPreset?.name ?? 'Custom room'} · Floor area: {(roomWidth * roomDepth).toFixed(1)} m²</p>
        </div>
      </div>
      <p>Inside dimensions · Height: {wallHeight} m · Wall thickness: {wallThickness * 100} cm</p>
      <p>Drag to rotate · Scroll to zoom · Right-drag to pan</p>
    </section>
  )
}
