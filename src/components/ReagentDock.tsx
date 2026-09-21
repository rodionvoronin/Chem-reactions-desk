import { useState } from 'react'
import { CommonBody, GroupsBody, SolidsBody, FlameBody } from './PaletteBodies'
import { TOOLBAR_HEIGHT } from './BenchToolbar'
import { PeriodicTableModal } from './PeriodicTableModal'

const FONT = "'Montserrat', system-ui, sans-serif"

export const DOCK_WIDTH = 288
export const DOCK_COLLAPSED = 52

const TABS = [
  { id: 'common', label: 'Типичные', icon: '💧', hint: 'Среда, окислители, газы, индикаторы' },
  { id: 'groups', label: 'Группы',   icon: '🧪', hint: 'Катионы по аналитическим группам' },
  { id: 'solids', label: 'Твёрдые',  icon: '◆',  hint: 'Металлы, оксиды, гидроксиды' },
  { id: 'flame',  label: 'Пламя',    icon: '🔥', hint: 'Окрашивание пламени на горелке' },
] as const

type TabId = (typeof TABS)[number]['id']

interface Props {
  onReagentClick: (id: string) => void
  blockedReason: string
  burnerSelected: boolean
  currentMetalId: string
  onAddBurner: () => void
  onSetFlame: (color: string, label: string, metalId: string) => void
  collapsed: boolean
  onToggleCollapsed: () => void
}

/**
 * Одна панель реагентов вместо четырёх плавающих окон. Разделы переключаются
 * вкладками, поэтому на экране всегда открыт ровно один список, а не все сразу.
 * Панель сворачивается в полоску значков — стол получает всю ширину.
 */
export function ReagentDock({
  onReagentClick, blockedReason, burnerSelected, currentMetalId,
  onAddBurner, onSetFlame, collapsed, onToggleCollapsed,
}: Props) {
  const [tab, setTab] = useState<TabId>('common')
  const [tableOpen, setTableOpen] = useState(false)

  const table = (
    <PeriodicTableModal
      open={tableOpen}
      onClose={() => setTableOpen(false)}
      onReagentClick={onReagentClick}
      blockedReason={blockedReason}
    />
  )

  if (collapsed) {
    return (
      <>
      {table}
      <div style={{
        position: 'fixed', left: 0, top: TOOLBAR_HEIGHT, bottom: 0, width: DOCK_COLLAPSED, zIndex: 400,
        background: 'white', borderRight: '1px solid #ECEFF1',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        paddingTop: 10, fontFamily: FONT, userSelect: 'none',
      }}>
        <RailButton icon="»" title="Развернуть реагенты" onClick={onToggleCollapsed} />
        <div style={{ width: 28, height: 1, background: '#ECEFF1', margin: '2px 0' }} />
        {TABS.map((t) => (
          <RailButton
            key={t.id}
            icon={t.icon}
            title={t.label + ' — ' + t.hint}
            onClick={() => { setTab(t.id); onToggleCollapsed() }}
          />
        ))}
        <div style={{ width: 28, height: 1, background: '#ECEFF1', margin: '2px 0' }} />
        <RailButton icon="▦" title="Периодическая система — реагенты по элементам" onClick={() => setTableOpen(true)} />
      </div>
      </>
    )
  }

  return (
    <>
    {table}
    <div style={{
      position: 'fixed', left: 0, top: TOOLBAR_HEIGHT, bottom: 0, width: DOCK_WIDTH, zIndex: 400,
      background: 'white', borderRight: '1px solid #ECEFF1',
      display: 'flex', flexDirection: 'column', fontFamily: FONT, userSelect: 'none',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 8px 8px 14px', borderBottom: '1px solid #F5F7F9',
      }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#90A4AE', letterSpacing: 0.6 }}>
          РЕАГЕНТЫ
        </span>
        <button
          onClick={onToggleCollapsed}
          title="Свернуть панель"
          style={{
            border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px',
            fontSize: 14, color: '#B0BEC5', fontFamily: FONT, lineHeight: 1,
          }}
        >
          «
        </button>
      </div>

      {/* Второй вход в реагенты — по элементу, а не по разделу */}
      <div style={{ padding: '0 12px 10px' }}>
        <button
          onClick={() => setTableOpen(true)}
          title="Выбрать элемент и увидеть все его соединения на столе"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '9px 0', borderRadius: 9, cursor: 'pointer',
            border: '1.5px solid #BBDEFB', background: '#F3F9FF',
            fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#1565C0',
          }}
        >
          <span style={{ fontSize: 15, lineHeight: 1 }}>▦</span>
          Таблица Менделеева
        </button>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #ECEFF1' }}>
        {TABS.map((t) => {
          const active = t.id === tab
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              title={t.hint}
              style={{
                flex: 1, border: 'none', cursor: 'pointer', padding: '8px 2px 7px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                background: active ? '#E3F2FD' : 'white',
                borderBottom: `2px solid ${active ? '#1565C0' : 'transparent'}`,
                color: active ? '#0D47A1' : '#90A4AE',
                fontFamily: FONT, fontSize: 11.5, fontWeight: 700,
              }}
            >
              <span style={{ fontSize: 15, lineHeight: 1 }}>{t.icon}</span>
              {t.label}
            </button>
          )
        })}
      </div>

      {blockedReason && (
        <div style={{
          margin: '10px 12px 0', padding: '8px 10px', borderRadius: 8,
          background: '#FFF8E1', fontSize: 12.5, color: '#8D6E63', lineHeight: 1.4,
        }}>
          {blockedReason}
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 12px 16px' }}>
        {tab === 'common' && <CommonBody onReagentClick={onReagentClick} blockedReason={blockedReason} />}
        {tab === 'groups' && <GroupsBody onReagentClick={onReagentClick} blockedReason={blockedReason} />}
        {tab === 'solids' && <SolidsBody onReagentClick={onReagentClick} blockedReason={blockedReason} />}
        {tab === 'flame' && (
          <FlameBody
            burnerSelected={burnerSelected}
            currentMetalId={currentMetalId}
            onAddBurner={onAddBurner}
            onSetFlame={onSetFlame}
          />
        )}
      </div>
    </div>
    </>
  )
}

function RailButton({ icon, title, onClick }: { icon: string; title: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 36, height: 36, borderRadius: 9, border: '1px solid transparent',
        background: 'none', cursor: 'pointer', fontSize: 15, color: '#90A4AE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#F0F7FF' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
    >
      {icon}
    </button>
  )
}
