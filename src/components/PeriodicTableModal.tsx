// ── Окно «Периодическая система» ──────────────────────────────────────────────
//
// Второй вход в реагенты — через элемент. Палитры «Типичные / Группы /
// Твёрдые» отвечают на вопрос «что за реактив мне нужен», таблица — на вопрос
// «что на столе есть у железа». Элементы без соединений на столе бледные,
// но нажимаются: степени окисления видны и у них.

import { useEffect, useState } from 'react'
import { ELEMENTS, Element, Block, compoundsOf, reactionCountOf } from '../periodic'
import { REAGENT_MAP } from '../reactions'
import { useIsNarrow } from '../useViewport'
import { count } from '../plural'

const FONT = "'Montserrat', system-ui, sans-serif"

/** Цвета блоков — как на настенной таблице: s голубые, p жёлтые, d розовые */
const BLOCK_COLOR: Record<Block, string> = {
  s: '#A9DCEB',
  p: '#FBE36A',
  d: '#F5A3B8',
  f: '#5EC4F0',
}
/** Актиноиды отличаются от лантаноидов цветом, хотя оба — f-элементы */
const ACTINIDE_COLOR = '#6CC477'

function colorOf(el: Element): string {
  return el.series === 'Ac' ? ACTINIDE_COLOR : BLOCK_COLOR[el.block]
}

/** Сколько соединений каждого элемента есть на столе — считаем один раз */
const COMPOUND_COUNT = new Map(
  ELEMENTS.map((el) => [el.symbol, compoundsOf(el.symbol).reduce((n, g) => n + g.ids.length, 0)]),
)

interface Props {
  open: boolean
  onClose: () => void
  onReagentClick: (id: string) => void
  /** Почему реагент сейчас не приливается; пусто — можно лить */
  blockedReason: string
  /** Кнопки соединений неактивны (на телефоне — пока не выбрана пробирка) */
  disabled?: boolean
}

export function PeriodicTableModal({ open, onClose, onReagentClick, blockedReason, disabled }: Props) {
  const narrow = useIsNarrow()
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  const element = ELEMENTS.find((el) => el.symbol === selected) ?? null

  const pick = (id: string) => {
    if (disabled) return
    onReagentClick(id)
    // Если лить некуда, окно оставляем: иначе подсказка исчезнет вместе с ним
    if (!blockedReason) onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 850, background: 'rgba(20,30,40,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: narrow ? 0 : 20, fontFamily: FONT,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: narrow ? 0 : 16,
          width: narrow ? '100%' : 'min(1500px, 100%)',
          height: narrow ? '100%' : 'min(920px, 100%)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: narrow ? '12px 14px' : '14px 22px', borderBottom: '1px solid #ECEFF1',
        }}>
          <div style={{ fontSize: narrow ? 16 : 19, fontWeight: 700, color: '#263238' }}>
            Периодическая система
          </div>
          {!narrow && (
            <div style={{ fontSize: 12.5, color: '#90A4AE' }}>
              Нажмите на элемент — справа появятся его соединения на столе
            </div>
          )}
          <button
            onClick={onClose}
            title="Закрыть (Esc)"
            style={{
              marginLeft: 'auto', border: 'none', background: '#F5F7F9', borderRadius: 8,
              width: 34, height: 34, cursor: 'pointer', fontSize: 18, color: '#607D8B',
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          flex: 1, minHeight: 0, display: 'flex',
          flexDirection: narrow ? 'column' : 'row',
          overflowY: narrow ? 'auto' : 'hidden',
        }}>
          <div style={{
            flex: narrow ? '0 0 auto' : 1, minWidth: 0,
            overflow: narrow ? 'auto hidden' : 'auto', padding: narrow ? 10 : 18,
          }}>
            <Table
              selected={selected}
              onSelect={setSelected}
              narrow={narrow}
              inset={<Inset element={element} narrow={narrow} />}
            />
          </div>

          <div style={{
            flex: narrow ? '0 0 auto' : '0 0 330px',
            borderLeft: narrow ? 'none' : '1px solid #ECEFF1',
            borderTop: narrow ? '1px solid #ECEFF1' : 'none',
            overflowY: narrow ? 'visible' : 'auto',
            padding: narrow ? '12px 14px 24px' : '16px 18px 24px',
            background: '#FAFBFC',
          }}>
            <Compounds
              element={element}
              onPick={pick}
              blockedReason={blockedReason}
              disabled={!!disabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Сама таблица ──────────────────────────────────────────────────────────────

function Table({ selected, onSelect, narrow, inset }: {
  selected: string | null
  onSelect: (symbol: string) => void
  narrow: boolean
  inset: React.ReactNode
}) {
  const cell = narrow ? 40 : 46
  const fRow = (series: 'La' | 'Ac') => ELEMENTS.filter((el) => el.series === series)

  return (
    <div style={{
      display: 'grid', gap: narrow ? 3 : 4,
      gridTemplateColumns: `16px repeat(18, minmax(${cell}px, 1fr))`,
      minWidth: 16 + 18 * (cell + 4),
    }}>
      {/* Номера групп */}
      {Array.from({ length: 18 }, (_, i) => (
        <div key={`g${i}`} style={{
          gridColumn: i + 2, gridRow: 1, textAlign: 'center',
          fontSize: 10.5, fontWeight: 700, color: '#B0BEC5', alignSelf: 'end',
        }}>
          {i + 1}
        </div>
      ))}
      {/* Номера периодов */}
      {Array.from({ length: 7 }, (_, i) => (
        <div key={`p${i}`} style={{
          gridColumn: 1, gridRow: i + 2, alignSelf: 'center',
          fontSize: 10.5, fontWeight: 700, color: '#B0BEC5',
        }}>
          {i + 1}
        </div>
      ))}

      {ELEMENTS.filter((el) => el.group !== null).map((el) => (
        <Cell
          key={el.z} el={el} narrow={narrow}
          selected={selected === el.symbol} onSelect={onSelect}
          style={{ gridColumn: el.group! + 1, gridRow: el.period + 1 }}
        />
      ))}

      {/* Пустое место над d-элементами — под легенду и карточку элемента */}
      <div style={{ gridColumn: '4 / 14', gridRow: '2 / 5', minWidth: 0 }}>{inset}</div>

      {/* Лантаноиды и актиноиды — отдельными рядами под таблицей */}
      {(['La', 'Ac'] as const).map((series, row) => (
        <div key={series} style={{ display: 'contents' }}>
          <div style={{
            gridColumn: '2 / 5', gridRow: 10 + row, alignSelf: 'center', textAlign: 'right',
            paddingRight: 6, fontSize: narrow ? 10 : 11.5, fontWeight: 600, color: '#90A4AE',
          }}>
            {series === 'La' ? 'Лантаноиды' : 'Актиноиды'}
          </div>
          {fRow(series).map((el, i) => (
            <Cell
              key={el.z} el={el} narrow={narrow}
              selected={selected === el.symbol} onSelect={onSelect}
              style={{ gridColumn: 5 + i, gridRow: 10 + row }}
            />
          ))}
        </div>
      ))}
      {/* Зазор между основной таблицей и f-рядами */}
      <div style={{ gridColumn: 1, gridRow: 9, height: narrow ? 6 : 10 }} />
    </div>
  )
}

function Cell({ el, selected, onSelect, narrow, style }: {
  el: Element
  selected: boolean
  onSelect: (symbol: string) => void
  narrow: boolean
  style: React.CSSProperties
}) {
  const [hover, setHover] = useState(false)
  const available = (COMPOUND_COUNT.get(el.symbol) ?? 0) > 0
  return (
    <button
      onClick={() => onSelect(el.symbol)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={`${el.name}${available ? '' : ' — соединений на столе нет'}`}
      style={{
        ...style,
        position: 'relative', aspectRatio: '1 / 1.08', minWidth: 0,
        border: 'none', borderRadius: narrow ? 5 : 7, padding: 0, cursor: 'pointer',
        background: colorOf(el), fontFamily: FONT, color: '#1C2B33',
        opacity: available || selected ? 1 : 0.38,
        boxShadow: selected
          ? '0 0 0 3px #263238'
          : hover ? '0 3px 10px rgba(0,0,0,0.22)' : '0 1px 2px rgba(0,0,0,0.08)',
        transform: hover && !selected ? 'translateY(-1px)' : 'none',
        transition: 'box-shadow 0.12s, transform 0.12s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <span style={{
        position: 'absolute', top: narrow ? 2 : 3, left: narrow ? 3 : 5,
        fontSize: narrow ? 8 : 9.5, fontWeight: 600, opacity: 0.75,
      }}>
        {el.z}
      </span>
      {el.radioactive && (
        <span
          title="Радиоактивен"
          style={{
            position: 'absolute', top: narrow ? 4 : 5, right: narrow ? 4 : 5,
            width: 5, height: 5, borderRadius: '50%', background: '#E53935',
          }}
        />
      )}
      <span style={{ fontSize: narrow ? 15 : 'clamp(15px, 1.45vw, 22px)', fontWeight: 700, lineHeight: 1, marginTop: 4 }}>
        {el.symbol}
      </span>
      {!narrow && (
        <span style={{
          fontSize: 'clamp(6.5px, 0.55vw, 8.5px)', fontWeight: 600, marginTop: 3, opacity: 0.8,
          maxWidth: '96%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {el.name}
        </span>
      )}
    </button>
  )
}

// ── Врезка над d-элементами: легенда или карточка выбранного элемента ─────────

function Inset({ element, narrow }: { element: Element | null; narrow: boolean }) {
  if (!element) {
    const items: Array<[string, string]> = [
      [BLOCK_COLOR.s, 's-элементы'], [BLOCK_COLOR.p, 'p-элементы'],
      [BLOCK_COLOR.d, 'd-элементы'], [BLOCK_COLOR.f, 'лантаноиды'], [ACTINIDE_COLOR, 'актиноиды'],
    ]
    return (
      <div style={{
        height: '100%', display: 'flex', flexWrap: 'wrap', alignContent: 'center',
        gap: narrow ? '4px 10px' : '6px 16px', padding: '0 8px',
        fontSize: narrow ? 10 : 12, color: '#607D8B',
      }}>
        {items.map(([color, label]) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 22, height: 11, borderRadius: 4, background: color }} />
            {label}
          </span>
        ))}
        <span style={{ flexBasis: '100%', color: '#90A4AE' }}>
          Бледные клетки — соединений этого элемента на столе нет.
        </span>
      </div>
    )
  }

  return (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', gap: narrow ? 10 : 16, padding: '0 8px',
    }}>
      <div style={{
        flex: '0 0 auto', width: narrow ? 64 : 92, aspectRatio: '1 / 1.08', borderRadius: 10,
        background: colorOf(element), color: '#1C2B33', position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ position: 'absolute', top: 5, left: 7, fontSize: narrow ? 10 : 12, fontWeight: 700 }}>
          {element.z}
        </span>
        <span style={{ fontSize: narrow ? 26 : 38, fontWeight: 700, lineHeight: 1 }}>{element.symbol}</span>
        <span style={{ fontSize: narrow ? 9 : 11, fontWeight: 600, marginTop: 4 }}>{element.mass}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: narrow ? 15 : 20, fontWeight: 700, color: '#263238' }}>{element.name}</div>
        <div style={{ fontSize: narrow ? 10.5 : 12, color: '#90A4AE', marginTop: 2 }}>
          {element.series === 'La' ? 'лантаноид' : element.series === 'Ac' ? 'актиноид' : `${element.block}-элемент`}
          {element.group ? `, ${element.group} группа` : ''}, {element.period} период
          {element.radioactive ? ', радиоактивен' : ''}
        </div>
        {element.states.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 7 }}>
            {element.states.map((s) => (
              <span key={s} style={{
                fontSize: narrow ? 10.5 : 12, fontWeight: 700, color: '#455A64',
                background: '#F1F4F6', borderRadius: 5, padding: '2px 6px',
              }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Соединения выбранного элемента ────────────────────────────────────────────

function Compounds({ element, onPick, blockedReason, disabled }: {
  element: Element | null
  onPick: (id: string) => void
  blockedReason: string
  disabled: boolean
}) {
  if (!element) {
    return (
      <div style={{ fontSize: 13, color: '#90A4AE', lineHeight: 1.55, paddingTop: 4 }}>
        Выберите элемент в таблице — здесь появятся все его соединения, которые есть
        на столе: простое вещество, оксиды, гидроксиды, кислоты и соли.
        Нажатие на соединение приливает его в выбранную пробирку.
      </div>
    )
  }

  const groups = compoundsOf(element.symbol)
  const total = COMPOUND_COUNT.get(element.symbol) ?? 0

  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#263238' }}>
        {element.name} на столе
      </div>
      <div style={{ fontSize: 12, color: '#90A4AE', marginTop: 3 }}>
        {total > 0
          ? `${count(total, 'соединение', 'соединения', 'соединений')} · `
            + `${count(reactionCountOf(element.symbol), 'реакция', 'реакции', 'реакций')} с их участием`
          : 'Соединений этого элемента в лаборатории нет.'}
      </div>

      {total > 0 && blockedReason && (
        <div style={{
          marginTop: 10, padding: '8px 10px', borderRadius: 8,
          background: '#FFF8E1', fontSize: 12.5, color: '#8D6E63', lineHeight: 1.4,
        }}>
          {blockedReason}
        </div>
      )}

      {groups.map((group) => (
        <div key={group.label}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, color: '#B0BEC5', letterSpacing: 0.7, margin: '16px 0 7px',
          }}>
            {group.label.toUpperCase()}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))', gap: 5 }}>
            {group.ids.map((id) => (
              <CompoundButton key={id} id={id} onPick={onPick} disabled={disabled} />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

function CompoundButton({ id, onPick, disabled }: {
  id: string
  onPick: (id: string) => void
  disabled: boolean
}) {
  const reagent = REAGENT_MAP[id]
  const [hover, setHover] = useState(false)
  if (!reagent) return null
  return (
    <button
      onClick={() => onPick(id)}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={disabled ? '' : `Прилить ${reagent.label}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, minWidth: 0,
        border: `1.5px solid ${hover && !disabled ? '#90CAF9' : '#ECEFF1'}`,
        background: hover && !disabled ? '#F0F7FF' : 'white',
        borderRadius: 8, padding: '9px 10px', cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1, textAlign: 'left',
        fontSize: 13.5, fontWeight: 500, fontFamily: FONT, color: '#37474F',
      }}
    >
      <span style={{
        width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
        background: reagent.color, border: '1px solid rgba(0,0,0,0.15)',
      }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {reagent.label}
      </span>
    </button>
  )
}
