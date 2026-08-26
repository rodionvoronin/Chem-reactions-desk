import { useRef, useState } from 'react'
import { MAIN_GROUPS, TRANSITION_GROUPS, REAGENT_MAP, ReagentGroup } from '../reactions'

const FONT = "'Montserrat', system-ui, sans-serif"

interface Props {
  onReagentClick: (id: string) => void
  onAddTube: () => void
  onClearTube: () => void
  tubeSelected: boolean
}

function TabRow({
  groups,
  activeId,
  onSelect,
}: {
  groups: ReagentGroup[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div style={{ display: 'flex' }}>
      {groups.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelect(g.id)}
          title={g.fullLabel}
          style={{
            flex: 1,
            border: 'none',
            background: 'none',
            padding: '5px 2px',
            fontSize: 10,
            fontWeight: 700,
            fontFamily: FONT,
            cursor: 'pointer',
            color: activeId === g.id ? '#1565C0' : '#999',
            borderBottom: activeId === g.id ? '2px solid #1565C0' : '2px solid transparent',
            transition: 'color 0.12s',
            marginBottom: -1,
            whiteSpace: 'nowrap',
          }}
        >
          {g.label}
        </button>
      ))}
    </div>
  )
}

export function GroupsPalette({ onReagentClick, onAddTube, onClearTube, tubeSelected }: Props) {
  const allGroups = [...MAIN_GROUPS, ...TRANSITION_GROUPS]
  const [pos, setPos] = useState(() => ({ x: window.innerWidth - 225, y: 16 }))
  const [activeId, setActiveId] = useState(MAIN_GROUPS[0].id)
  const drag = useRef<{ mx: number; my: number; px: number; py: number } | null>(null)

  const activeGroup = allGroups.find((g) => g.id === activeId)!
  const reagents = activeGroup.reagentIds.map((id) => REAGENT_MAP[id]).filter(Boolean)

  return (
    <div
      style={{
        position: 'fixed', left: pos.x, top: pos.y,
        width: 215, background: 'white', borderRadius: 12,
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
          РЕАГЕНТЫ
        </span>
      </div>

      {/* Основные группы */}
      <div style={{ padding: '7px 10px 0' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#aaa', letterSpacing: 0.6, marginBottom: 3 }}>
          ОСНОВНЫЕ ГРУППЫ
        </div>
        <div style={{ borderBottom: '1px solid #f0f0f0' }}>
          <TabRow groups={MAIN_GROUPS} activeId={activeId} onSelect={setActiveId} />
        </div>
      </div>

      {/* Переходные металлы */}
      <div style={{ padding: '7px 10px 0' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#aaa', letterSpacing: 0.6, marginBottom: 3 }}>
          ПЕРЕХОДНЫЕ МЕТАЛЛЫ
        </div>
        <div style={{ borderBottom: '1px solid #f0f0f0' }}>
          <TabRow groups={TRANSITION_GROUPS} activeId={activeId} onSelect={setActiveId} />
        </div>
      </div>

      {/* Подпись активной группы */}
      <div style={{ padding: '5px 12px 2px', fontSize: 10, color: '#aaa', fontWeight: 500 }}>
        {activeGroup.fullLabel}
      </div>

      {/* Список реагентов */}
      <div style={{ padding: '4px 10px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {reagents.map((r) => (
          <button
            key={r.id}
            title={`Добавить ${r.label}`}
            disabled={!tubeSelected}
            onClick={() => onReagentClick(r.id)}
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
        ))}
      </div>

      {/* Управление пробирками */}
      <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ borderTop: '1px solid #f0f0f0', marginBottom: 3 }} />
        <button
          onClick={onAddTube}
          style={{
            border: '1.5px solid #90CAF9', borderRadius: 7, padding: '6px 10px',
            background: '#E3F2FD', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            color: '#1565C0', fontFamily: FONT,
          }}
        >
          + Пробирка
        </button>
        <button
          onClick={onClearTube}
          disabled={!tubeSelected}
          style={{
            border: '1.5px solid #FFCCBC', borderRadius: 7, padding: '6px 10px',
            background: tubeSelected ? '#FFF3E0' : '#fafafa',
            cursor: tubeSelected ? 'pointer' : 'not-allowed',
            fontSize: 12, fontWeight: 600, fontFamily: FONT,
            color: tubeSelected ? '#BF360C' : '#ccc',
          }}
        >
          Очистить
        </button>
        {!tubeSelected && (
          <p style={{ margin: 0, fontSize: 10, color: '#bbb', lineHeight: 1.35, fontFamily: FONT }}>
            Выберите пробирку, затем нажмите реагент.
          </p>
        )}
      </div>
    </div>
  )
}
