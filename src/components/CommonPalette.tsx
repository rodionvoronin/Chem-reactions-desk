import { useRef, useState } from 'react'
import { COMMON_SECTIONS, REAGENT_MAP } from '../reactions'

const FONT = "'Montserrat', system-ui, sans-serif"

const PEN_COLORS = [
  { id: 'black',  hex: '#1D1D1D' },
  { id: 'grey',   hex: '#9E9E9E' },
  { id: 'red',    hex: '#E03131' },
  { id: 'orange', hex: '#E8590C' },
  { id: 'yellow', hex: '#FAB005' },
  { id: 'green',  hex: '#2F9E44' },
  { id: 'blue',   hex: '#1971C2' },
  { id: 'violet', hex: '#7048E8' },
]

const PEN_SIZES = [
  { id: 's', label: 'S' },
  { id: 'm', label: 'M' },
  { id: 'l', label: 'L' },
]

interface Props {
  onReagentClick: (id: string) => void
  tubeSelected: boolean
  onPenColor: (color: string) => void
  onPenSize: (size: string) => void
  penColor: string
  penSize: string
}

export function CommonPalette({ onReagentClick, tubeSelected, onPenColor, onPenSize, penColor, penSize }: Props) {
  const [pos, setPos] = useState({ x: 16, y: 16 })
  const drag = useRef<{ mx: number; my: number; px: number; py: number } | null>(null)

  return (
    <div
      style={{
        position: 'fixed', left: pos.x, top: pos.y,
        width: 188, background: 'white', borderRadius: 12,
        boxShadow: '0 2px 24px rgba(0,0,0,0.15)', zIndex: 500,
        fontFamily: FONT, userSelect: 'none', display: 'flex', flexDirection: 'column',
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
    >
      {/* Ручка перетаскивания */}
      <div
        style={{
          padding: '10px 12px 7px', borderBottom: '1px solid #f0f0f0',
          cursor: drag.current ? 'grabbing' : 'grab',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
        onPointerDown={(e) => {
          drag.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
          e.currentTarget.setPointerCapture(e.pointerId)
          e.stopPropagation()
        }}
        onPointerMove={(e) => {
          if (!drag.current) return
          setPos({ x: drag.current.px + e.clientX - drag.current.mx, y: drag.current.py + e.clientY - drag.current.my })
          e.stopPropagation()
        }}
        onPointerUp={(e) => { drag.current = null; e.stopPropagation() }}
      >
        <span style={{ fontSize: 14, color: '#bbb', letterSpacing: 2 }}>⠿</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 0.5 }}>
          ТИПИЧНЫЕ РЕАГЕНТЫ
        </span>
      </div>

      {/* Секции реагентов */}
      <div style={{ padding: '8px 10px 0' }}>
        {COMMON_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#aaa', letterSpacing: 0.7, marginBottom: 4 }}>
              {section.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {section.ids.map((id) => {
                const r = REAGENT_MAP[id]
                if (!r) return null
                return (
                  <button
                    key={id}
                    title={`Добавить ${r.label}`}
                    disabled={!tubeSelected}
                    onClick={() => onReagentClick(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      border: '1.5px solid #e8e8e8', borderRadius: 7, padding: '5px 9px',
                      background: tubeSelected ? 'white' : '#fafafa',
                      cursor: tubeSelected ? 'pointer' : 'not-allowed',
                      fontSize: 12, fontWeight: 500, fontFamily: FONT, textAlign: 'left',
                      color: tubeSelected ? '#333' : '#bbb', transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { if (tubeSelected) e.currentTarget.style.background = '#f0f7ff' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = tubeSelected ? 'white' : '#fafafa' }}
                  >
                    <span style={{
                      width: 11, height: 11, borderRadius: '50%',
                      background: r.color, border: '1px solid #ccc', flexShrink: 0,
                    }} />
                    {r.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Карандаш */}
      <div style={{ padding: '4px 10px 10px', borderTop: '1px solid #f0f0f0', marginTop: 2 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#aaa', letterSpacing: 0.7, marginBottom: 6, marginTop: 6 }}>
          КАРАНДАШ
        </div>

        {/* 8 цветов */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5, marginBottom: 6 }}>
          {PEN_COLORS.map((c) => (
            <button
              key={c.id}
              title={c.id}
              onClick={() => onPenColor(c.id)}
              style={{
                width: '100%', aspectRatio: '1', borderRadius: 6, background: c.hex, padding: 0,
                border: penColor === c.id ? '2.5px solid #333' : '2px solid transparent',
                cursor: 'pointer',
                boxShadow: penColor === c.id ? '0 0 0 1.5px white inset' : 'none',
                outline: 'none',
              }}
            />
          ))}
        </div>

        {/* 3 толщины */}
        <div style={{ display: 'flex', gap: 5 }}>
          {PEN_SIZES.map((s) => (
            <button
              key={s.id}
              onClick={() => onPenSize(s.id)}
              style={{
                flex: 1, borderRadius: 7, padding: '5px 0',
                border: penSize === s.id ? '2px solid #1971C2' : '1.5px solid #e0e0e0',
                background: penSize === s.id ? '#E3F2FD' : 'white',
                cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: FONT,
                color: penSize === s.id ? '#1565C0' : '#666',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
