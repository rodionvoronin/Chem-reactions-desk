import { useRef, useState } from 'react'
import { COMMON_SECTIONS, REAGENT_MAP } from '../reactions'

const FONT = "'Montserrat', system-ui, sans-serif"

interface Props {
  onReagentClick: (id: string) => void
  tubeSelected: boolean
}

export function CommonPalette({ onReagentClick, tubeSelected }: Props) {
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

      <div style={{ height: 6 }} />
    </div>
  )
}
