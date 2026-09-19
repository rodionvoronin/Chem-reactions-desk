// ── Содержимое палитр реагентов ───────────────────────────────────────────────
//
// Раньше каждая палитра была отдельным плавающим окном со своей ручкой
// перетаскивания. Четыре таких окна закрывали и стол, и друг друга, а внутрь
// одного из них было спрятано управление пробиркой. Теперь окон нет: здесь
// только списки реагентов, а рамку вокруг них рисует ReagentDock.

import { useState } from 'react'
import { COMMON_SECTIONS, MAIN_GROUPS, TRANSITION_GROUPS, REAGENT_MAP } from '../reactions'
import { SOLID_SECTIONS } from './SolidsPalette'
import { FLAME_METALS } from './FlameColorsPalette'

const FONT = "'Montserrat', system-ui, sans-serif"

interface BodyProps {
  onReagentClick: (id: string) => void
  /** Подсказка, почему реагент сейчас не приливается; пусто — можно лить */
  blockedReason: string
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 9.5, fontWeight: 700, color: '#B0BEC5',
      letterSpacing: 0.7, margin: '14px 0 6px',
    }}>
      {children}
    </div>
  )
}

/**
 * Кнопка реагента. Не гасится, когда пробирка не выбрана: стол сам выберет
 * единственную пробирку, а если их несколько — подскажет, какую взять.
 * Раньше вся палитра была серой, и серое занимало весь экран.
 */
function Reagent({ id, onClick, blockedReason }: {
  id: string
  onClick: (id: string) => void
  blockedReason: string
}) {
  const reagent = REAGENT_MAP[id]
  if (!reagent) return null
  return (
    <button
      title={blockedReason || `Прилить ${reagent.label}`}
      onClick={() => onClick(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        border: '1.5px solid #ECEFF1', borderRadius: 8, padding: '7px 10px',
        background: 'white', cursor: 'pointer', textAlign: 'left',
        fontSize: 12.5, fontWeight: 500, fontFamily: FONT, color: '#37474F',
        transition: 'background 0.12s, border-color 0.12s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#F0F7FF'
        e.currentTarget.style.borderColor = '#90CAF9'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'white'
        e.currentTarget.style.borderColor = '#ECEFF1'
      }}
    >
      <span style={{
        width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
        background: reagent.color, border: '1px solid rgba(0,0,0,0.15)',
      }} />
      {reagent.label}
    </button>
  )
}

function List({ ids, onReagentClick, blockedReason }: { ids: string[] } & BodyProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {ids.map((id) => (
        <Reagent key={id} id={id} onClick={onReagentClick} blockedReason={blockedReason} />
      ))}
    </div>
  )
}

export function CommonBody(props: BodyProps) {
  return (
    <>
      {COMMON_SECTIONS.map((section) => (
        <div key={section.label}>
          <SectionTitle>{section.label}</SectionTitle>
          <List ids={section.ids} {...props} />
        </div>
      ))}
    </>
  )
}

export function SolidsBody(props: BodyProps) {
  return (
    <>
      {SOLID_SECTIONS.map((section) => (
        <div key={section.label}>
          <SectionTitle>{section.label}</SectionTitle>
          <List ids={section.ids} {...props} />
        </div>
      ))}
    </>
  )
}

export function GroupsBody(props: BodyProps) {
  const all = [...MAIN_GROUPS, ...TRANSITION_GROUPS]
  const [activeId, setActiveId] = useState(MAIN_GROUPS[0].id)
  const active = all.find((g) => g.id === activeId) ?? all[0]

  return (
    <>
      <SectionTitle>ОСНОВНЫЕ ГРУППЫ</SectionTitle>
      <GroupRow groups={MAIN_GROUPS} activeId={activeId} onSelect={setActiveId} />
      <SectionTitle>ПЕРЕХОДНЫЕ МЕТАЛЛЫ</SectionTitle>
      <GroupRow groups={TRANSITION_GROUPS} activeId={activeId} onSelect={setActiveId} />
      <SectionTitle>{active.fullLabel.toUpperCase()}</SectionTitle>
      <List ids={active.reagentIds} {...props} />
    </>
  )
}

function GroupRow({ groups, activeId, onSelect }: {
  groups: typeof MAIN_GROUPS
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {groups.map((g) => {
        const active = g.id === activeId
        return (
          <button
            key={g.id}
            onClick={() => onSelect(g.id)}
            title={g.fullLabel}
            style={{
              flex: '1 0 auto', minWidth: 34, padding: '5px 8px', borderRadius: 7,
              border: `1.5px solid ${active ? '#1565C0' : '#ECEFF1'}`,
              background: active ? '#E3F2FD' : 'white',
              color: active ? '#0D47A1' : '#78909C',
              cursor: 'pointer', fontFamily: FONT, fontSize: 11.5, fontWeight: 700,
            }}
          >
            {g.label}
          </button>
        )
      })}
    </div>
  )
}

export function FlameBody({ burnerSelected, currentMetalId, onAddBurner, onSetFlame }: {
  burnerSelected: boolean
  currentMetalId: string
  onAddBurner: () => void
  onSetFlame: (color: string, label: string, metalId: string) => void
}) {
  if (!burnerSelected) {
    return (
      <div style={{ paddingTop: 12 }}>
        <p style={{ margin: '0 0 12px', fontSize: 12.5, color: '#90A4AE', lineHeight: 1.5 }}>
          Окрашивание пламени идёт на горелке. Поставьте её на стол и выберите,
          чтобы вносить пробы.
        </p>
        <button
          onClick={onAddBurner}
          style={{
            width: '100%', padding: '10px 0', borderRadius: 9, cursor: 'pointer',
            border: '1.5px solid #FFCC80', background: '#FFF8E1',
            fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#EF6C00',
          }}
        >
          🔥 Поставить горелку
        </button>
      </div>
    )
  }

  return (
    <>
      <SectionTitle>ИОН МЕТАЛЛА В ПРОБЕ</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: 5 }}>
        {FLAME_METALS.map((metal) => {
          const active = currentMetalId === metal.id
          return (
            <button
              key={metal.id}
              onClick={() => onSetFlame(metal.color, `${metal.name} (${metal.symbol})`, metal.id)}
              title={metal.name}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '8px 6px', borderRadius: 8, cursor: 'pointer', fontFamily: FONT,
                border: `1.5px solid ${active ? '#1565C0' : '#ECEFF1'}`,
                background: active ? '#E3F2FD' : 'white',
                fontSize: 12.5, fontWeight: 700, color: '#37474F',
              }}
            >
              <span style={{
                width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
                background: metal.color, border: '1px solid rgba(0,0,0,0.18)',
              }} />
              {metal.symbol}
            </button>
          )
        })}
      </div>
    </>
  )
}
