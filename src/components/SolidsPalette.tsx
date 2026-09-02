import { useRef, useState } from 'react'
import { REAGENT_MAP } from '../reactions'

const FONT = "'Montserrat', system-ui, sans-serif"

// ── Секции твёрдых веществ ────────────────────────────────────────────────────

const SOLID_SECTIONS: Array<{ label: string; ids: string[] }> = [
  {
    label: 'АКТИВНЫЕ МЕТАЛЛЫ',
    ids: ['Na_s', 'K_s', 'Ca_s', 'Ba_s', 'Mg_s', 'Al_s'],
  },
  {
    label: 'МЕТАЛЛЫ',
    ids: ['Fe_s', 'Cu_s', 'Zn_s', 'Cr_s', 'Ag_s'],
  },
  {
    label: 'НЕМЕТАЛЛЫ',
    ids: ['S_s', 'C_s', 'P_s', 'Si_s'],
  },
  {
    label: 'ОКСИДЫ МЕТАЛЛОВ',
    ids: ['CuO', 'Cu2O', 'Fe2O3', 'FeO', 'Fe3O4', 'Al2O3', 'ZnO', 'CaO', 'Na2O', 'MgO', 'BaO', 'Cr2O3', 'MnO2'],
  },
  {
    label: 'КИСЛОТНЫЕ ОКСИДЫ',
    ids: ['SiO2', 'P2O5', 'CrO3', 'CO'],
  },
  {
    label: 'ГИДРОКСИДЫ',
    ids: ['AlOH3', 'ZnOH2', 'CrOH3', 'CuOH2', 'FeOH3'],
  },
  {
    label: 'БИНАРНЫЕ (гидролиз)',
    ids: ['Al2S3', 'Al4C3', 'CaC2', 'Mg3N2', 'Ca3P2', 'Na2O2'],
  },
  {
    label: 'СОЛИ (тв.)',
    ids: ['CaCO3', 'BaCO3', 'MgCO3', 'CaSO4', 'FeS'],
  },
]

interface Props {
  onReagentClick: (id: string) => void
  tubeSelected: boolean
  isDry: boolean
  onToggleDry: () => void
}

export function SolidsPalette({ onReagentClick, tubeSelected, isDry, onToggleDry }: Props) {
  const [pos, setPos] = useState({ x: 212, y: 16 })
  const drag = useRef<{ mx: number; my: number; px: number; py: number } | null>(null)

  return (
    <div
      style={{
        position: 'fixed', left: pos.x, top: pos.y,
        width: 256, background: '#FAFAFA', borderRadius: 12,
        boxShadow: '0 2px 24px rgba(0,0,0,0.15)', zIndex: 500,
        fontFamily: FONT, userSelect: 'none', display: 'flex', flexDirection: 'column',
        border: '1px solid #EEEEEE',
        // Не вылезаем за нижний край экрана, где бы палитра ни стояла
        maxHeight: `calc(100vh - ${Math.max(0, pos.y)}px - 16px)`,
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => {
        e.stopPropagation()
        if (!drag.current) return
        setPos({
          x: drag.current.px + (e.clientX - drag.current.mx),
          y: drag.current.py + (e.clientY - drag.current.my),
        })
      }}
      onPointerUp={(e) => { e.stopPropagation(); drag.current = null }}
    >
      {/* Ручка перетаскивания */}
      <div
        style={{
          padding: '10px 12px 7px',
          borderBottom: '1px solid #EEEEEE',
          cursor: drag.current ? 'grabbing' : 'grab',
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#F5F5F5', borderRadius: '12px 12px 0 0',
          flexShrink: 0,   // заголовок не сжимается при нехватке места
        }}
        onPointerDown={(e) => {
          drag.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
          e.currentTarget.setPointerCapture(e.pointerId)
          e.stopPropagation()
        }}
      >
        <span style={{ fontSize: 14, color: '#bbb', letterSpacing: 2 }}>⠿</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#777', letterSpacing: 0.5 }}>
          ТВ. ВЕЩЕСТВА
        </span>
      </div>

      {/* Секции с реагентами — прокручиваются, если не помещаются */}
      <div style={{
        padding: '8px 10px 4px',
        overflowY: 'auto', overflowX: 'hidden',
        flex: '1 1 auto', minHeight: 0,
        scrollbarWidth: 'thin',
      }}>
        {SOLID_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: 8 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, color: '#aaa',
              letterSpacing: 0.7, marginBottom: 5,
            }}>
              {section.label}
            </div>
            {/* Сетка 4 колонки */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 4,
            }}>
              {section.ids.map((id) => {
                const r = REAGENT_MAP[id]
                if (!r) return null
                const isMetal = [
                  'Fe_s', 'Cu_s', 'Zn_s', 'Al_s', 'Mg_s',
                  'Na_s', 'K_s', 'Ca_s', 'Ba_s', 'Cr_s', 'Ag_s',
                ].includes(id)
                const isLight = isLightColor(r.color)
                return (
                  <button
                    key={id}
                    title={`Добавить ${r.label} в пробирку`}
                    disabled={!tubeSelected}
                    onClick={() => onReagentClick(id)}
                    style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: 3, padding: '7px 3px 6px',
                      borderRadius: 8,
                      border: '1.5px solid',
                      borderColor: tubeSelected
                        ? (isLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.25)')
                        : '#EEEEEE',
                      background: tubeSelected ? r.color : '#F5F5F5',
                      cursor: tubeSelected ? 'pointer' : 'not-allowed',
                      opacity: tubeSelected ? 1 : 0.45,
                      transition: 'transform 0.08s, opacity 0.15s',
                      outline: 'none',
                      // Crystal texture indicator for solids
                      boxShadow: isMetal && tubeSelected
                        ? 'inset 0 1px 2px rgba(255,255,255,0.45), 0 1px 3px rgba(0,0,0,0.18)'
                        : tubeSelected ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (tubeSelected) e.currentTarget.style.transform = 'scale(1.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    {/* Иконка-тип: кристалл или металл */}
                    <span style={{ fontSize: 8, opacity: 0.55, lineHeight: 1 }}>
                      {isMetal ? '▪' : '◆'}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: tubeSelected ? (isLight ? '#333' : '#fff') : '#ccc',
                      lineHeight: 1.1, textAlign: 'center',
                      textShadow: (!isLight && tubeSelected) ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
                    }}>
                      {r.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Режим: водный / сухой — закреплён снизу, не уезжает при прокрутке */}
      <div style={{
        padding: '4px 10px 0', borderTop: '1px solid #EEEEEE',
        background: '#FAFAFA', flexShrink: 0,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 700, color: '#aaa',
          letterSpacing: 0.7, marginBottom: 5, marginTop: 5,
        }}>
          РЕЖИМ ПРОБИРКИ
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 8 }}>
          {/* Водный режим */}
          <button
            disabled={!tubeSelected}
            onClick={() => { if (isDry) onToggleDry() }}
            style={{
              padding: '7px 4px',
              border: `2px solid ${!isDry ? '#29B6F6' : '#EEEEEE'}`,
              borderRadius: 8,
              background: !isDry ? '#E1F5FE' : '#F5F5F5',
              color: !isDry ? '#0277BD' : '#bbb',
              fontSize: 11, fontWeight: 700,
              cursor: tubeSelected ? 'pointer' : 'not-allowed',
              opacity: tubeSelected ? 1 : 0.5,
              fontFamily: FONT,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              transition: 'border-color 0.15s, background 0.15s',
              outline: 'none',
            }}
          >
            <span style={{ fontSize: 14 }}>💧</span>
            <span>Раствор</span>
          </button>
          {/* Сухой режим */}
          <button
            disabled={!tubeSelected}
            onClick={() => { if (!isDry) onToggleDry() }}
            style={{
              padding: '7px 4px',
              border: `2px solid ${isDry ? '#FF7043' : '#EEEEEE'}`,
              borderRadius: 8,
              background: isDry ? '#FBE9E7' : '#F5F5F5',
              color: isDry ? '#BF360C' : '#bbb',
              fontSize: 11, fontWeight: 700,
              cursor: tubeSelected ? 'pointer' : 'not-allowed',
              opacity: tubeSelected ? 1 : 0.5,
              fontFamily: FONT,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              transition: 'border-color 0.15s, background 0.15s',
              outline: 'none',
            }}
          >
            <span style={{ fontSize: 14 }}>🔬</span>
            <span>Сухой</span>
          </button>
        </div>
      </div>

      {/* Кнопка НАГРЕТЬ — тоже закреплена снизу */}
      <div style={{
        padding: '4px 10px 10px',
        background: '#FAFAFA', borderRadius: '0 0 12px 12px', flexShrink: 0,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 700, color: '#aaa',
          letterSpacing: 0.7, marginBottom: 5, marginTop: 5,
        }}>
          НАГРЕВАНИЕ
        </div>
        <button
          disabled={!tubeSelected}
          onClick={() => onReagentClick('heat')}
          style={{
            width: '100%', padding: '8px 0',
            border: 'none', borderRadius: 8,
            background: tubeSelected ? 'linear-gradient(135deg, #FF5722, #FF8F00)' : '#F5F5F5',
            color: tubeSelected ? '#fff' : '#ccc',
            fontSize: 13, fontWeight: 700,
            cursor: tubeSelected ? 'pointer' : 'not-allowed',
            fontFamily: FONT,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: tubeSelected ? '0 2px 8px rgba(255,87,34,0.35)' : 'none',
            transition: 'opacity 0.15s',
            opacity: tubeSelected ? 1 : 0.5,
          }}
          onMouseEnter={(e) => {
            if (tubeSelected) e.currentTarget.style.opacity = '0.85'
          }}
          onMouseLeave={(e) => {
            if (tubeSelected) e.currentTarget.style.opacity = '1'
          }}
        >
          <span>🔥</span>
          <span>Нагреть</span>
        </button>
        {!tubeSelected && (
          <p style={{ margin: '6px 0 0', fontSize: 10, color: '#bbb', lineHeight: 1.35 }}>
            Выберите пробирку
          </p>
        )}
      </div>
    </div>
  )
}

/** Воспринимаемая яркость: нужен тёмный текст? */
function isLightColor(hex: string): boolean {
  const m = hex.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/)
  if (!m) return true
  return (parseInt(m[1], 16) * 299 + parseInt(m[2], 16) * 587 + parseInt(m[3], 16) * 114) / 1000 > 130
}
