import { useCallback, useEffect, useState } from 'react'
import { generateItem } from '../ege/generate'
import { SUBSTANCES } from '../ege/graph'
import { EgeItem, EgeNumber, EGE_TASKS } from '../ege/types'
import { recordEquations } from '../game/progress'
import { logEvent } from '../game/telemetry'
import { Screen, Card, Button, FONT } from './ui'
import { useIsNarrow } from '../useViewport'

interface Props {
  onBack: () => void
  /** С какого номера открыть тренажёр */
  initialTask?: EgeNumber
}

interface Stats {
  right: number
  total: number
}

/**
 * Тренажёр заданий ЕГЭ. Условия не хранятся, а собираются из таблицы реакций
 * при каждом показе, поэтому задания не кончаются и не повторяются заученно.
 */
export function EgeScreen({ onBack, initialTask = 6 }: Props) {
  const narrow = useIsNarrow()
  const [task, setTask] = useState<EgeNumber>(initialTask)
  // Собираем первое задание сразу, чтобы экран не мигал пустой карточкой
  const [item, setItem] = useState<EgeItem | null>(() => generateItem(initialTask))
  const [picked, setPicked] = useState<string[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const [stats, setStats] = useState<Record<number, Stats>>({})

  const next = useCallback((number: EgeNumber) => {
    const fresh = generateItem(number)
    setItem(fresh)
    setPicked([])
    setMatched([])
    setChecked(false)
    if (fresh) logEvent('task_started', { taskId: `ege-${number}`, type: fresh.kind, difficulty: 2 })
  }, [])

  useEffect(() => { next(task) }, [task, next])

  const correct = item ? isCorrect(item, picked, matched) : false
  const ready = item
    ? item.kind === 'match'
      ? matched.filter((v) => v !== undefined).length === item.left.length
      : picked.length === (item.kind === 'chain' ? item.answer.length : 2)
    : false

  const check = () => {
    if (!item || checked || !ready) return
    setChecked(true)
    const stat = stats[item.task] ?? { right: 0, total: 0 }
    setStats({ ...stats, [item.task]: { right: stat.right + (correct ? 1 : 0), total: stat.total + 1 } })
    // Уравнения из разбора попадают в лабораторный журнал — как и на столе
    recordEquations(item.debrief.flatMap((block) => block.lines.filter((l) => l.includes('→'))))
    logEvent('task_finished', { taskId: `ege-${item.task}`, correct, spent: 0, hintsUsed: 0, stars: correct ? 3 : 0 })
  }

  const stat = stats[task] ?? { right: 0, total: 0 }

  return (
    <Screen
      title="Тренажёр заданий ЕГЭ"
      subtitle="Условия собираются из базы реакций: 750 уравнений, у каждого задания ровно один верный ответ."
      onBack={onBack}
      actions={
        <div style={{ fontSize: 13, color: '#78909C' }}>
          В этой сессии: <b style={{ color: '#37474F' }}>{stat.right} / {stat.total}</b>
        </div>
      }
    >
      {/* Выбор номера задания */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
        {EGE_TASKS.map((t) => (
          <button
            key={t.number}
            onClick={() => setTask(t.number)}
            title={t.subtitle}
            style={{
              border: `2px solid ${task === t.number ? '#1565C0' : '#E0E0E0'}`,
              background: task === t.number ? '#E3F2FD' : 'white',
              color: task === t.number ? '#0D47A1' : '#546E7A',
              borderRadius: 9, padding: '8px 14px', cursor: 'pointer',
              fontFamily: FONT, fontSize: 13, fontWeight: 700,
            }}
          >
            № {t.number}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 13, color: '#90A4AE', marginBottom: 14 }}>
        {EGE_TASKS.find((t) => t.number === task)?.subtitle}
      </div>

      {!item ? (
        <Card style={{ padding: 26, color: '#B0BEC5' }}>
          Не удалось собрать задание из базы. Попробуйте другой номер.
        </Card>
      ) : (
        <>
          <Card style={{ padding: 22 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#37474F' }}>
              {item.prompt}
            </p>

            {item.kind === 'choose' && item.given && (
              <div style={{
                marginTop: 13, padding: '12px 16px', borderRadius: 9,
                background: '#E8F5E9', borderLeft: '4px solid #66BB6A',
                fontSize: 16, fontWeight: 600, color: '#1B5E20',
              }}>
                {item.given}
              </div>
            )}

            {item.kind === 'chain' && (
              <div style={{
                marginTop: 15, display: 'flex', alignItems: 'center', gap: 10,
                flexWrap: 'wrap', fontSize: 17, fontWeight: 700, color: '#263238',
              }}>
                {item.chain.map((formula, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {i > 0 && (
                      <span style={{
                        fontSize: 13, fontWeight: 700, color: '#1565C0',
                        background: '#E3F2FD', borderRadius: 6, padding: '3px 9px',
                      }}>
                        {i === 1 ? 'X' : 'Y'} ↓
                      </span>
                    )}
                    {i > 0 && <span style={{ color: '#B0BEC5' }}>→</span>}
                    {formula}
                  </span>
                ))}
              </div>
            )}

            {/* Перечень веществ */}
            {item.kind !== 'match' ? (
              <div style={{ marginTop: 17, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {item.options.map((id, index) => {
                  const chosen = picked.includes(id)
                  const isAnswer = item.answer.includes(id)
                  return (
                    <button
                      key={id}
                      disabled={checked}
                      onClick={() => setPicked(toggle(picked, id, item.kind === 'chain' ? item.answer.length : 2))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left',
                        border: `2px solid ${optionBorder(chosen, isAnswer, checked)}`,
                        background: optionBackground(chosen, isAnswer, checked),
                        borderRadius: 9, padding: '10px 14px',
                        cursor: checked ? 'default' : 'pointer',
                        fontFamily: FONT, fontSize: 15, fontWeight: 600, color: '#37474F',
                      }}
                    >
                      <span style={{ color: '#90A4AE', fontSize: 13, minWidth: 16 }}>{index + 1})</span>
                      {SUBSTANCES[id]?.label ?? id}
                      {checked && isAnswer && <span style={{ marginLeft: 'auto', color: '#2E7D32' }}>✓</span>}
                      {checked && chosen && !isAnswer && <span style={{ marginLeft: 'auto', color: '#C62828' }}>✗</span>}
                      {item.kind === 'chain' && chosen && !checked && (
                        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#1565C0' }}>
                          {picked.indexOf(id) === 0 ? 'X' : 'Y'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <MatchTable
                item={item}
                matched={matched}
                checked={checked}
                narrow={narrow}
                onPick={(row, option) => {
                  const next = [...matched]
                  next[row] = option
                  setMatched(next)
                }}
              />
            )}
          </Card>

          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            {!checked
              ? <Button kind="primary" onClick={check} style={{ opacity: ready ? 1 : 0.5 }}>Проверить</Button>
              : <Button kind="primary" onClick={() => next(task)}>Следующее задание</Button>}
            {!checked && <Button onClick={() => next(task)}>Пропустить</Button>}
          </div>

          {checked && (
            <Card style={{
              marginTop: 16, padding: 22,
              borderLeft: `5px solid ${correct ? '#66BB6A' : '#FF7043'}`,
            }}>
              <h2 style={{
                margin: 0, fontSize: 17, fontWeight: 700,
                color: correct ? '#1B5E20' : '#BF360C',
              }}>
                {correct ? '✓ Верно' : '✗ Неверно'}
              </h2>
              {item.kind === 'match' && !correct && (
                <p style={{ margin: '9px 0 0', fontSize: 13.5, color: '#546E7A' }}>
                  Правильная последовательность: {item.answer.map((i) => i + 1).join('')}
                </p>
              )}
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 13 }}>
                {item.debrief.map((block, i) => (
                  <div key={i}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
                      color: '#90A4AE', marginBottom: 6,
                    }}>
                      {block.title.toUpperCase()}
                    </div>
                    {block.lines.map((line, j) => (
                      <div key={j} style={{
                        fontSize: 14.5, lineHeight: 1.55, color: '#37474F',
                        fontWeight: 600, marginBottom: 4,
                      }}>
                        {line}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </Screen>
  )
}

function MatchTable({ item, matched, checked, onPick, narrow }: {
  item: Extract<EgeItem, { kind: 'match' }>
  matched: number[]
  checked: boolean
  onPick: (row: number, option: number) => void
  narrow: boolean
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 18,
        fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: '#90A4AE', marginBottom: 8,
      }}>
        <div>{item.leftTitle}</div>
        <div>{item.rightTitle}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: narrow ? 14 : 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {item.left.map((row, i) => (
            <div key={i} style={{
              border: '1.5px solid #ECEFF1', borderRadius: 9, padding: '10px 13px',
              background: '#FAFAFA',
            }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: '#37474F' }}>
                {'АБВГ'[i]}) {row}
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                {item.right.map((_, option) => {
                  const chosen = matched[i] === option
                  const right = item.answer[i] === option
                  return (
                    <button
                      key={option}
                      disabled={checked}
                      onClick={() => onPick(i, option)}
                      style={{
                        width: narrow ? 40 : 30, height: narrow ? 40 : 30, borderRadius: 7,
                        border: `2px solid ${optionBorder(chosen, right, checked)}`,
                        background: optionBackground(chosen, right, checked),
                        cursor: checked ? 'default' : 'pointer',
                        fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#37474F',
                      }}
                    >
                      {option + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {item.right.map((row, i) => (
            <div key={i} style={{
              border: '1.5px solid #ECEFF1', borderRadius: 9, padding: '10px 13px',
              fontSize: 14.5, color: '#37474F', fontWeight: 600, background: 'white',
            }}>
              <span style={{ color: '#90A4AE', fontSize: 13, marginRight: 7 }}>{i + 1})</span>
              {row}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Вспомогательное ───────────────────────────────────────────────────────────

function toggle(picked: string[], id: string, limit: number): string[] {
  if (picked.includes(id)) return picked.filter((x) => x !== id)
  if (picked.length >= limit) return [...picked.slice(1), id]
  return [...picked, id]
}

function isCorrect(item: EgeItem, picked: string[], matched: number[]): boolean {
  if (item.kind === 'match') {
    return item.answer.every((value, i) => matched[i] === value)
  }
  if (item.kind === 'chain') {
    // Порядок важен: X и Y стоят на разных стадиях
    return item.answer.every((id, i) => picked[i] === id)
  }
  return picked.length === item.answer.length && item.answer.every((id) => picked.includes(id))
}

function optionBorder(chosen: boolean, isAnswer: boolean, checked: boolean): string {
  if (!checked) return chosen ? '#1565C0' : '#E0E0E0'
  if (isAnswer) return '#66BB6A'
  return chosen ? '#EF5350' : '#E0E0E0'
}

function optionBackground(chosen: boolean, isAnswer: boolean, checked: boolean): string {
  if (!checked) return chosen ? '#E3F2FD' : 'white'
  if (isAnswer) return '#E8F5E9'
  return chosen ? '#FFEBEE' : 'white'
}
