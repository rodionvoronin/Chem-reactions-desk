import { useState } from 'react'
import { COMMON_SECTIONS, MAIN_GROUPS, TRANSITION_GROUPS, REAGENT_MAP } from '../reactions'
import { SOLID_SECTIONS } from './SolidsPalette'
import { FLAME_METALS } from './FlameColorsPalette'
import {
  BottomSheet, ReagentButton, SheetAction, SheetGrid, SheetSection, SheetTab,
} from './BottomSheet'

const FONT = "'Montserrat', system-ui, sans-serif"

const TABS: SheetTab[] = [
  { id: 'bench',    label: 'Стол',     icon: '🧫' },
  { id: 'common',   label: 'Типичные', icon: '💧' },
  { id: 'groups',   label: 'Группы',   icon: '🧪' },
  { id: 'solids',   label: 'Твёрдые',  icon: '◆' },
  { id: 'flame',    label: 'Пламя',    icon: '🔥' },
]

interface Props {
  onReagentClick: (id: string) => void
  tubeSelected: boolean
  isDry: boolean
  onToggleDry: () => void
  onAddTube: () => void
  onClearTube: () => void
  onRemoveTube: () => void
  /** Что удастся выделить из пробирки; null — выделять нечего */
  isolatable: string | null
  onIsolate: () => void
  burnerSelected: boolean
  currentMetalId: string
  onAddBurner: () => void
  onSetFlame: (color: string, label: string, metalId: string) => void
  onClearFlame: () => void
  onRemoveBurner: () => void
}

/**
 * Палитры песочницы для телефона: то же содержимое, что в плавающих окнах
 * на десктопе, но собранное в одну нижнюю шторку с вкладками. Перетаскивать
 * окна пальцем на маленьком экране бессмысленно — там просто некуда двигать.
 */
export function MobilePalettes(raw: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [group, setGroup] = useState(MAIN_GROUPS[0].id)

  // Шторка закрывается после каждого действия: иначе она закроет собой и
  // пробирку, и панель результата — то есть ровно то, ради чего реагент лили
  const close = () => setActive(null)
  const props: Props = {
    ...raw,
    onReagentClick: (id) => { raw.onReagentClick(id); close() },
    onToggleDry: () => { raw.onToggleDry(); close() },
    onAddTube: () => { raw.onAddTube(); close() },
    onClearTube: () => { raw.onClearTube(); close() },
    onRemoveTube: () => { raw.onRemoveTube(); close() },
    onIsolate: () => { raw.onIsolate(); close() },
    onAddBurner: () => { raw.onAddBurner(); close() },
    onSetFlame: (color, label, metalId) => { raw.onSetFlame(color, label, metalId); close() },
    onClearFlame: () => { raw.onClearFlame(); close() },
    onRemoveBurner: () => { raw.onRemoveBurner(); close() },
  }

  const { tubeSelected, onReagentClick } = props
  const allGroups = [...MAIN_GROUPS, ...TRANSITION_GROUPS]
  const activeGroup = allGroups.find((g) => g.id === group) ?? allGroups[0]

  return (
    <BottomSheet tabs={TABS} active={active} onSelect={setActive}>
      {active === 'bench' && <BenchTab {...props} />}

      {active === 'common' && (
        <>
          <Hint show={!tubeSelected} />
          {COMMON_SECTIONS.map((section) => (
            <SheetSection key={section.label} title={section.label}>
              <SheetGrid>
                {section.ids.map((id) => {
                  const reagent = REAGENT_MAP[id]
                  if (!reagent) return null
                  return (
                    <ReagentButton
                      key={id}
                      label={reagent.label}
                      color={reagent.color}
                      disabled={!tubeSelected}
                      onClick={() => onReagentClick(id)}
                    />
                  )
                })}
              </SheetGrid>
            </SheetSection>
          ))}
        </>
      )}

      {active === 'groups' && (
        <>
          <Hint show={!tubeSelected} />
          <div style={{
            display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 8, marginBottom: 4,
          }}>
            {allGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => setGroup(g.id)}
                title={g.fullLabel}
                style={{
                  flex: '0 0 auto', minHeight: 34, padding: '6px 13px', borderRadius: 8,
                  border: `2px solid ${group === g.id ? '#1565C0' : '#E0E0E0'}`,
                  background: group === g.id ? '#E3F2FD' : 'white',
                  color: group === g.id ? '#0D47A1' : '#78909C',
                  fontFamily: FONT, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
          <SheetSection title={activeGroup.fullLabel.toUpperCase()}>
            <SheetGrid>
              {activeGroup.reagentIds.map((id) => {
                const reagent = REAGENT_MAP[id]
                if (!reagent) return null
                return (
                  <ReagentButton
                    key={id}
                    label={reagent.label}
                    color={reagent.color}
                    disabled={!tubeSelected}
                    onClick={() => onReagentClick(id)}
                  />
                )
              })}
            </SheetGrid>
          </SheetSection>
        </>
      )}

      {active === 'solids' && (
        <>
          <Hint show={!tubeSelected} />
          {SOLID_SECTIONS.map((section) => (
            <SheetSection key={section.label} title={section.label}>
              <SheetGrid min={72}>
                {section.ids.map((id) => {
                  const reagent = REAGENT_MAP[id]
                  if (!reagent) return null
                  return (
                    <ReagentButton
                      key={id}
                      label={reagent.label}
                      color={reagent.color}
                      disabled={!tubeSelected}
                      onClick={() => onReagentClick(id)}
                    />
                  )
                })}
              </SheetGrid>
            </SheetSection>
          ))}
        </>
      )}

      {active === 'flame' && <FlameTab {...props} />}
    </BottomSheet>
  )
}

function Hint({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <p style={{
      margin: '0 0 10px', fontSize: 12, color: '#90A4AE', lineHeight: 1.45,
      background: '#F5F7F9', borderRadius: 8, padding: '9px 11px', fontFamily: FONT,
    }}>
      Сначала коснитесь пробирки на столе, потом выберите реагент.
    </p>
  )
}

function BenchTab({
  tubeSelected, isDry, onToggleDry, onAddTube, onClearTube, onRemoveTube,
  onAddBurner, onReagentClick, isolatable, onIsolate,
}: Props) {
  return (
    <>
      {isolatable && (
        <SheetSection title="ЦЕПОЧКА">
          <SheetAction
            label={`Выделить ${REAGENT_MAP[isolatable]?.label ?? isolatable}`}
            tone="primary"
            onClick={onIsolate}
          />
        </SheetSection>
      )}
      <SheetSection title="ПОСУДА">
        <SheetGrid min={120}>
          <SheetAction label="+ Пробирка" tone="primary" onClick={onAddTube} />
          <SheetAction label="+ Горелка" tone="primary" onClick={onAddBurner} />
          <SheetAction label="Очистить" tone="warning" disabled={!tubeSelected} onClick={onClearTube} />
          <SheetAction label="Убрать со стола" disabled={!tubeSelected} onClick={onRemoveTube} />
        </SheetGrid>
      </SheetSection>

      <SheetSection title="РЕЖИМ ПРОБИРКИ">
        <SheetGrid min={120}>
          <SheetAction
            label="💧 Раствор"
            tone={!isDry ? 'primary' : 'neutral'}
            disabled={!tubeSelected}
            onClick={() => { if (isDry) onToggleDry() }}
          />
          <SheetAction
            label="🔬 Сухой"
            tone={isDry ? 'warning' : 'neutral'}
            disabled={!tubeSelected}
            onClick={() => { if (!isDry) onToggleDry() }}
          />
        </SheetGrid>
      </SheetSection>

      <SheetSection title="НАГРЕВАНИЕ">
        <SheetAction
          label="🔥 Нагреть"
          tone="heat"
          disabled={!tubeSelected}
          onClick={() => onReagentClick('heat')}
        />
      </SheetSection>
    </>
  )
}

function FlameTab({
  burnerSelected, currentMetalId, onAddBurner, onSetFlame, onClearFlame, onRemoveBurner,
}: Props) {
  if (!burnerSelected) {
    return (
      <SheetSection>
        <p style={{
          margin: '0 0 10px', fontSize: 12.5, color: '#90A4AE', lineHeight: 1.5, fontFamily: FONT,
        }}>
          Поставьте горелку на стол и коснитесь её, чтобы окрасить пламя.
        </p>
        <SheetAction label="+ Горелка" tone="primary" onClick={onAddBurner} />
      </SheetSection>
    )
  }

  return (
    <>
      <SheetSection title="ИОН МЕТАЛЛА">
        <SheetGrid min={96}>
          {FLAME_METALS.map((metal) => (
            <button
              key={metal.id}
              onClick={() => onSetFlame(metal.color, `${metal.name} (${metal.symbol})`, metal.id)}
              style={{
                minHeight: 46, borderRadius: 9, cursor: 'pointer', fontFamily: FONT,
                border: `2px solid ${currentMetalId === metal.id ? '#1565C0' : '#E0E0E0'}`,
                background: currentMetalId === metal.id ? '#E3F2FD' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                fontSize: 13, fontWeight: 700, color: '#37474F',
              }}
            >
              <span style={{
                width: 13, height: 13, borderRadius: '50%', background: metal.color,
                border: '1px solid rgba(0,0,0,0.2)', flexShrink: 0,
              }} />
              {metal.symbol}
            </button>
          ))}
        </SheetGrid>
      </SheetSection>

      <SheetSection title="ГОРЕЛКА">
        <SheetGrid min={120}>
          <SheetAction label="Погасить" tone="warning" onClick={onClearFlame} />
          <SheetAction label="Убрать со стола" onClick={onRemoveBurner} />
        </SheetGrid>
      </SheetSection>
    </>
  )
}
