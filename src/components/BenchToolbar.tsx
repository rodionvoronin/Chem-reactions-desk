import { ReactNode } from 'react'

const FONT = "'Montserrat', system-ui, sans-serif"

export const TOOLBAR_HEIGHT = 52

interface Props {
  onExit: () => void
  /** Подпись выбранного объекта: «Пробирка 2», «Горелка 1» или пусто */
  selectionLabel: string
  tubeSelected: boolean
  burnerSelected: boolean
  isDry: boolean
  onToggleDry: (dry: boolean) => void
  onHeat: () => void
  isolatable: string | null
  onIsolate: () => void
  onAddTube: () => void
  onAddBurner: () => void
  onClearTube: () => void
  onRemoveTube: () => void
  onClearFlame: () => void
  onRemoveBurner: () => void
}

/**
 * Панель управления столом. Раньше эти кнопки лежали внутри палитр реагентов:
 * «очистить» и «убрать» — в одной, режим пробирки и нагрев — в другой, под
 * длинным списком. Найти их можно было только случайно. Теперь всё управление
 * собрано в одной полосе наверху, и она меняется вместе с тем, что выбрано
 * на столе: для пробирки одни действия, для горелки другие.
 */
export function BenchToolbar({
  onExit, selectionLabel, tubeSelected, burnerSelected, isDry, onToggleDry, onHeat,
  isolatable, onIsolate, onAddTube, onAddBurner, onClearTube, onRemoveTube,
  onClearFlame, onRemoveBurner,
}: Props) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: TOOLBAR_HEIGHT, zIndex: 450,
      display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px',
      background: 'white', borderBottom: '1px solid #ECEFF1', fontFamily: FONT,
      userSelect: 'none', overflowX: 'auto',
    }}>
      <Action label="← В меню" onClick={onExit} tone="quiet" />
      <Divider />

      <Action label="+ Пробирка" onClick={onAddTube} tone="primary" />
      <Action label="+ Горелка" onClick={onAddBurner} tone="primary" />

      {(tubeSelected || burnerSelected) && <Divider />}

      {selectionLabel && (
        <span style={{
          fontSize: 13, fontWeight: 700, color: '#455A64', whiteSpace: 'nowrap',
          padding: '5px 12px', borderRadius: 20, background: '#ECEFF1',
        }}>
          {selectionLabel}
        </span>
      )}

      {tubeSelected && (
        <>
          <Segmented
            options={[
              { id: 'wet', label: '💧 Раствор' },
              { id: 'dry', label: '🔬 Сухой' },
            ]}
            active={isDry ? 'dry' : 'wet'}
            onSelect={(id) => onToggleDry(id === 'dry')}
          />
          <Action label="🔥 Нагреть" onClick={onHeat} tone="heat" />
          {isolatable && (
            <Action label={`Выделить ${isolatable}`} onClick={onIsolate} tone="isolate" />
          )}
          <Action label="Очистить" onClick={onClearTube} tone="warning" />
          <Action label="Убрать" onClick={onRemoveTube} tone="quiet" />
        </>
      )}

      {burnerSelected && (
        <>
          <Action label="Погасить" onClick={onClearFlame} tone="warning" />
          <Action label="Убрать" onClick={onRemoveBurner} tone="quiet" />
        </>
      )}

      {!tubeSelected && !burnerSelected && (
        <span style={{ fontSize: 13, color: '#B0BEC5', whiteSpace: 'nowrap', marginLeft: 4 }}>
          Выберите пробирку или горелку на столе — управление появится здесь
        </span>
      )}
    </div>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 24, background: '#ECEFF1', flexShrink: 0 }} />
}

type Tone = 'primary' | 'quiet' | 'warning' | 'heat' | 'isolate'

function Action({ label, onClick, tone }: { label: string; onClick: () => void; tone: Tone }) {
  const palette: Record<Tone, { bg: string; border: string; color: string }> = {
    primary: { bg: '#E3F2FD', border: '#BBDEFB', color: '#1565C0' },
    quiet:   { bg: 'white',   border: '#E0E0E0', color: '#607D8B' },
    warning: { bg: '#FFF3E0', border: '#FFCCBC', color: '#BF360C' },
    heat:    { bg: '#FFF8E1', border: '#FFCC80', color: '#EF6C00' },
    isolate: { bg: '#EDE7F6', border: '#B39DDB', color: '#4527A0' },
  }
  const c = palette[tone]
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
        border: `1.5px solid ${c.border}`, background: c.bg, color: c.color,
        fontFamily: FONT, fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

function Segmented({ options, active, onSelect }: {
  options: Array<{ id: string; label: ReactNode }>
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <div style={{
      display: 'flex', flexShrink: 0, borderRadius: 8, overflow: 'hidden',
      border: '1.5px solid #E0E0E0',
    }}>
      {options.map((o) => {
        const on = o.id === active
        return (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            style={{
              border: 'none', cursor: 'pointer', padding: '8px 13px',
              background: on ? '#E3F2FD' : 'white',
              color: on ? '#0D47A1' : '#90A4AE',
              fontFamily: FONT, fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
