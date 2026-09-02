import { useRef, useState } from 'react'

const FONT = "'Montserrat', system-ui, sans-serif"

export interface FlameMetal {
  id: string
  symbol: string
  name: string
  color: string
}

export const FLAME_METALS: FlameMetal[] = [
  // Щелочные и щёлочноземельные металлы — цвета точно по изображению
  { id: 'Li', symbol: 'Li⁺',     name: 'Литий',    color: '#CC1C22' }, // насыщенный багрово-красный
  { id: 'Na', symbol: 'Na⁺',     name: 'Натрий',   color: '#E88A00' }, // янтарно-оранжевый
  { id: 'K',  symbol: 'K⁺',      name: 'Калий',    color: '#8336A5' }, // фиолетово-пурпурный
  { id: 'Rb', symbol: 'Rb⁺',     name: 'Рубидий',  color: '#B85078' }, // тёмно-розово-малиновый (мов)
  { id: 'Cs', symbol: 'Cs⁺',     name: 'Цезий',    color: '#9B7DC8' }, // светло-лавандово-лиловый
  { id: 'Ca', symbol: 'Ca²⁺',    name: 'Кальций',  color: '#E85520' }, // кирпично-оранжевый
  { id: 'Sr', symbol: 'Sr²⁺',    name: 'Стронций', color: '#D82020' }, // ярко-красный (алый)
  { id: 'Ba', symbol: 'Ba²⁺',    name: 'Барий',    color: '#AACC28' }, // жёлто-зелёный (лайм)
  { id: 'Ra', symbol: 'Ra²⁺',    name: 'Радий',    color: '#880D10' }, // тёмно-тёмно-красный (бордо)
  // Другие металлы
  { id: 'Cu', symbol: 'Cu²⁺',    name: 'Медь',     color: '#28A040' }, // изумрудно-зелёный
  { id: 'Fe', symbol: 'Fe²⁺/³⁺', name: 'Железо',   color: '#E89500' }, // золотисто-жёлтый
  { id: 'B',  symbol: 'B³⁺',     name: 'Бор',      color: '#4EAA3A' }, // ярко-зелёный (чуть светлее Cu)
  { id: 'In', symbol: 'In³⁺',    name: 'Индий',    color: '#2C55AC' }, // синий (индиго)
  { id: 'Pb', symbol: 'Pb²⁺',    name: 'Свинец',   color: '#7ABFDF' }, // бледно-голубой
  { id: 'As', symbol: 'As³⁺',    name: 'Мышьяк',   color: '#C0DCED' }, // очень бледно-голубой
  { id: 'Sb', symbol: 'Sb³⁺',    name: 'Сурьма',   color: '#AECAAB' }, // бледно-серо-зелёный
  { id: 'Se', symbol: 'Se⁴⁺',    name: 'Селен',    color: '#8BB8C5' }, // светло-бирюзово-синий
  { id: 'Zn', symbol: 'Zn²⁺',    name: 'Цинк',     color: '#CCDEE5' }, // почти белый, очень бледный
]

/** Проверяет, светлый ли цвет (использовать тёмный текст) */
function isLight(hex: string): boolean {
  const m = hex.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/)
  if (!m) return true
  const lum = (parseInt(m[1], 16) * 299 + parseInt(m[2], 16) * 587 + parseInt(m[3], 16) * 114) / 1000
  return lum > 145
}

interface Props {
  burnerSelected: boolean
  currentMetalId: string
  onAddBurner: () => void
  onSetFlame: (color: string, label: string, metalId: string) => void
  onClearFlame: () => void
  onRemoveBurner: () => void
}

export function FlameColorsPalette({ burnerSelected, currentMetalId, onAddBurner, onSetFlame, onClearFlame, onRemoveBurner }: Props) {
  const [pos, setPos] = useState({ x: Math.max(0, window.innerWidth - 268), y: 300 })
  const drag = useRef<{ mx: number; my: number; px: number; py: number } | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div
      style={{
        position: 'fixed', left: pos.x, top: pos.y,
        width: 248, background: 'white', borderRadius: 12,
        boxShadow: '0 2px 24px rgba(0,0,0,0.16)', zIndex: 500,
        fontFamily: FONT, userSelect: 'none', display: 'flex', flexDirection: 'column',
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
      {/* Заголовок-ручка */}
      <div
        style={{
          padding: '10px 12px 8px', borderBottom: '1px solid #f0f0f0',
          cursor: drag.current ? 'grabbing' : 'grab',
          display: 'flex', alignItems: 'center', gap: 7,
        }}
        onPointerDown={(e) => {
          drag.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
          e.currentTarget.setPointerCapture(e.pointerId)
          e.stopPropagation()
        }}
      >
        <span style={{ fontSize: 16 }}>🔥</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Цвета пламени</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#ccc' }}>⠿</span>
      </div>

      {/* Кнопка добавить горелку */}
      <div style={{ padding: '8px 10px 0' }}>
        <button
          onClick={onAddBurner}
          style={{
            width: '100%', padding: '7px 0',
            border: 'none', borderRadius: 8,
            background: '#FFF3E0', color: '#BF360C',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FFE0B2' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFF3E0' }}
        >
          <span>🔥</span> + Горелка
        </button>
      </div>

      {/* Сетка металлов */}
      <div style={{ padding: '8px 10px 10px' }}>
        <div style={{
          fontSize: 9, fontWeight: 700, color: '#aaa', letterSpacing: 0.6, marginBottom: 6,
        }}>
          МЕТАЛЛЫ И ЦВЕТА ПЛАМЕНИ
        </div>

        {!burnerSelected && (
          <div style={{
            fontSize: 11, color: '#bbb', textAlign: 'center',
            padding: '2px 0 6px', fontStyle: 'italic',
          }}>
            Выберите горелку на холсте
          </div>
        )}

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4,
        }}>
          {FLAME_METALS.map((m) => {
            const selected = currentMetalId === m.id
            const light = isLight(m.color)
            const textColor = light ? '#333' : '#fff'
            const shadow = light ? 'none' : '0 1px 3px rgba(0,0,0,0.35)'
            return (
              <button
                key={m.id}
                title={`${m.name} — ${m.symbol}`}
                disabled={!burnerSelected}
                onClick={() => onSetFlame(m.color, `${m.name} (${m.symbol})`, m.id)}
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 1,
                  padding: '6px 2px 5px',
                  borderRadius: 8,
                  border: selected ? '2.5px solid #222' : `2px solid ${light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.20)'}`,
                  background: m.color,
                  cursor: burnerSelected ? 'pointer' : 'not-allowed',
                  opacity: burnerSelected ? 1 : 0.40,
                  transform: (hovered === m.id && burnerSelected) ? 'scale(1.10)' : 'scale(1)',
                  transition: 'transform 0.08s, opacity 0.15s',
                  boxShadow: selected ? '0 0 0 3px rgba(0,0,0,0.12)' : 'none',
                  outline: 'none',
                }}
              >
                <span style={{
                  fontSize: 11, fontWeight: 700, color: textColor,
                  lineHeight: 1.1, textShadow: shadow,
                }}>
                  {m.id}
                </span>
                <span style={{
                  fontSize: 7, fontWeight: 500, color: textColor,
                  lineHeight: 1, opacity: 0.80, textShadow: shadow,
                }}>
                  {m.symbol}
                </span>
              </button>
            )
          })}
        </div>

        {/* Управление выбранной горелкой */}
        {burnerSelected && (
          <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
            <button
              onClick={onClearFlame}
              style={{
                flex: 1, padding: '5px 0',
                border: '1.5px solid #e8e8e8', borderRadius: 7,
                background: 'white', color: '#999',
                fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: FONT,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white' }}
            >
              Погасить
            </button>
            <button
              onClick={onRemoveBurner}
              style={{
                flex: 1, padding: '5px 0',
                border: '1.5px solid #e8e8e8', borderRadius: 7,
                background: 'white', color: '#999',
                fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: FONT,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white' }}
            >
              Убрать
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
