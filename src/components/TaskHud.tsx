import { REAGENT_MAP } from '../reactions'
import { FLAME_METALS } from './FlameColorsPalette'
import { Session, sampleLabel } from '../game/session'
import { describeTarget, optimalSteps } from '../game/engine'
import { TOPICS } from '../game/bank'

const FONT = "'Montserrat', system-ui, sans-serif"

const DIFFICULTY: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'база',      color: '#2E7D32', bg: '#E8F5E9' },
  2: { label: 'ЕГЭ',       color: '#EF6C00', bg: '#FFF3E0' },
  3: { label: 'олимпиада', color: '#AD1457', bg: '#FCE4EC' },
}

interface Props {
  session: Session
  spent: number
  hintsUsed: number
  revealedHints: number
  /** Выбранный ответ: по слоту на пробирку для «различи пару», иначе один элемент */
  picked: string[]
  onPick: (slot: number, value: string) => void
  onHint: () => void
  onSubmit: () => void
  onExit: () => void
  /**
   * 'panel' — плавающая панель слева от стола (десктоп),
   * 'sheet' — то же содержимое внутри нижней шторки (телефон).
   */
  layout?: 'panel' | 'sheet'
}

export function TaskHud({
  session, spent, hintsUsed, revealedHints, picked, onPick, onHint, onSubmit, onExit,
  layout = 'panel',
}: Props) {
  const sheet = layout === 'sheet'
  const { task } = session
  const topic = TOPICS.find((t) => t.id === task.topic)
  const diff = DIFFICULTY[task.difficulty]
  const overBudget = spent > task.budget
  const slots = task.type === 'distinguish' ? session.assignment.length : 1
  const answered = task.type === 'achieve'
    || (picked.filter(Boolean).length === slots)

  return (
    <div style={sheet ? {
      display: 'flex', flexDirection: 'column', fontFamily: FONT,
    } : {
      position: 'fixed', left: 16, top: 16, bottom: 16, width: 296,
      background: 'white', borderRadius: 14, zIndex: 500,
      boxShadow: '0 2px 24px rgba(0,0,0,0.15)', fontFamily: FONT,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Шапка */}
      <div style={{
        padding: sheet ? '0 0 10px' : '12px 16px 10px',
        borderBottom: '1px solid #F0F0F0', flexShrink: 0,
      }}>
        <button
          onClick={onExit}
          style={{
            border: 'none', background: 'none', padding: sheet ? '11px 10px' : 0,
            cursor: 'pointer',
            fontSize: 12, color: '#90A4AE', fontFamily: FONT, fontWeight: 600,
            marginLeft: sheet ? -10 : undefined,
            minHeight: sheet ? 44 : undefined,
          }}
        >
          ← К списку заданий
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 9 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5, padding: '3px 8px',
            borderRadius: 20, color: diff.color, background: diff.bg,
          }}>
            {diff.label.toUpperCase()}
          </span>
          <span style={{ fontSize: 11, color: '#B0BEC5', fontWeight: 500 }}>{topic?.title}</span>
        </div>
        <h2 style={{ margin: '8px 0 0', fontSize: 17, fontWeight: 700, color: '#263238', lineHeight: 1.3 }}>
          {task.title}
        </h2>
      </div>

      {/* Прокручиваемая часть. В шторке прокруткой занимается она сама */}
      <div style={sheet
        ? { padding: '13px 0 4px' }
        : { flex: 1, minHeight: 0, overflowY: 'auto', padding: '13px 16px 4px' }}>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: '#455A64' }}>
          {task.prompt}
        </p>

        {task.target && (
          <div style={{
            marginTop: 10, padding: '9px 12px', borderRadius: 8,
            background: '#E3F2FD', borderLeft: '4px solid #42A5F5',
            fontSize: 13, color: '#0D47A1', fontWeight: 600,
          }}>
            Цель: {describeTarget(task.target)}
          </div>
        )}

        {/* Бюджет реактивов */}
        <div style={{ marginTop: 15 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: '#90A4AE',
          }}>
            <span>РЕАКТИВЫ</span>
            <span style={{ color: overBudget ? '#E64A19' : '#546E7A', fontSize: 12 }}>
              {spent} / {task.budget}
            </span>
          </div>
          <div style={{ marginTop: 6, height: 7, borderRadius: 4, background: '#ECEFF1', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (spent / task.budget) * 100)}%`, height: '100%',
              background: overBudget ? '#FF7043' : spent === task.budget ? '#FFB74D' : '#66BB6A',
              transition: 'width 0.25s',
            }} />
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 10.5, color: '#B0BEC5', lineHeight: 1.4 }}>
            Оптимум — {optimalSteps(task)} {plural(optimalSteps(task), 'приливание', 'приливания', 'приливаний')}.
            Уложитесь в него без подсказок — три звезды.
          </p>
        </div>

        {/* Подсказки */}
        {task.hints.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: '#90A4AE' }}>
              ПОДСКАЗКИ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 7 }}>
              {task.hints.map((h, i) => (
                i < revealedHints ? (
                  <div key={i} style={{
                    fontSize: 12.5, lineHeight: 1.5, color: '#5D4037',
                    background: '#FFF8E1', borderRadius: 8, padding: '9px 11px',
                    borderLeft: '4px solid #FFCA28',
                  }}>
                    {h.text}
                  </div>
                ) : i === revealedHints ? (
                  <button
                    key={i}
                    onClick={onHint}
                    style={{
                      border: '1.5px dashed #FFCA28', background: '#FFFDE7', borderRadius: 8,
                      padding: sheet ? '13px 12px' : '8px 11px', cursor: 'pointer', fontFamily: FONT,
                      minHeight: sheet ? 44 : undefined,
                      fontSize: 12, fontWeight: 600, color: '#F57F17', textAlign: 'left',
                    }}
                  >
                    Открыть подсказку {i + 1} — минус {h.cost} к бюджету
                  </button>
                ) : null
              ))}
              {revealedHints >= task.hints.length && (
                <p style={{ margin: 0, fontSize: 10.5, color: '#B0BEC5' }}>
                  Подсказок больше нет. Открыто: {hintsUsed}.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Ответ */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: '#90A4AE' }}>
            ОТВЕТ
          </div>

          {task.type === 'achieve' ? (
            <p style={{ margin: '8px 0 0', fontSize: 12.5, color: '#78909C', lineHeight: 1.5 }}>
              Соберите нужный признак в пробирке и нажмите «Проверить».
            </p>
          ) : task.type === 'distinguish' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 9 }}>
              {Array.from({ length: slots }, (_, slot) => (
                <div key={slot}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#546E7A', marginBottom: 5 }}>
                    {sampleLabel(slot, slots)} — это:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {session.options.map((id) => (
                      <OptionButton
                        key={id}
                        label={REAGENT_MAP[id]?.label ?? id}
                        color={REAGENT_MAP[id]?.color}
                        active={picked[slot] === id}
                        big={sheet}
                        onClick={() => onPick(slot, id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 9 }}>
              {session.options.map((id) => {
                const metal = task.type === 'flame' ? FLAME_METALS.find((m) => m.id === id) : undefined
                return (
                  <OptionButton
                    key={id}
                    label={metal ? `${metal.name} (${metal.symbol})` : REAGENT_MAP[id]?.label ?? id}
                    color={metal ? metal.color : REAGENT_MAP[id]?.color}
                    active={picked[0] === id}
                    big={sheet}
                    onClick={() => onPick(0, id)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Кнопка проверки */}
      <div style={{
        padding: sheet ? '12px 0 4px' : '12px 16px 14px',
        borderTop: '1px solid #F0F0F0', flexShrink: 0,
      }}>
        <button
          disabled={!answered}
          onClick={onSubmit}
          style={{
            width: '100%', padding: sheet ? '14px 0' : '11px 0', border: 'none', borderRadius: 9,
            background: answered ? '#1565C0' : '#ECEFF1',
            color: answered ? 'white' : '#B0BEC5',
            fontSize: 14, fontWeight: 700, fontFamily: FONT,
            cursor: answered ? 'pointer' : 'not-allowed',
          }}
        >
          {task.type === 'achieve' ? 'Проверить' : 'Ответить'}
        </button>
      </div>
    </div>
  )
}

function OptionButton({ label, color, active, onClick, big }: {
  label: string; color?: string; active: boolean; onClick: () => void
  /** В шторке на телефоне вариант должен быть не меньше пальца */
  big?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        border: `2px solid ${active ? '#1565C0' : '#E0E0E0'}`,
        background: active ? '#E3F2FD' : 'white',
        color: active ? '#0D47A1' : '#455A64',
        borderRadius: 8, padding: big ? '12px 14px' : '6px 10px', cursor: 'pointer',
        minHeight: big ? 44 : undefined,
        fontSize: big ? 14 : 12.5, fontWeight: 600, fontFamily: FONT,
      }}
    >
      {color && (
        <span style={{
          width: 10, height: 10, borderRadius: '50%', background: color,
          border: '1px solid rgba(0,0,0,0.18)', flexShrink: 0,
        }} />
      )}
      {label}
    </button>
  )
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}
