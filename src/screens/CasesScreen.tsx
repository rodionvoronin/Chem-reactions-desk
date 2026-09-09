import { useState } from 'react'
import { CASES, Case, caseDifficulty } from '../game/cases'
import { TASK_MAP } from '../game/bank'
import { Task } from '../game/types'
import { Progress, maxDifficulty, recordCaseAnswer } from '../game/progress'
import { Screen, Card, Button, ProgressBar, FONT } from './ui'
import { useIsNarrow } from '../useViewport'

interface Props {
  progress: Progress
  onBack: () => void
  onStartStep: (task: Task, caseId: string) => void
  /** Дело, из которого только что вернулись с шага: его и открываем сразу */
  initialCaseId?: string | null
}

const solvedStep = (p: Progress, taskId: string) => (p.results[taskId]?.stars ?? 0) > 0
const doneSteps = (p: Progress, item: Case) => item.steps.filter((s) => solvedStep(p, s.taskId)).length

/**
 * Дела — расследования из нескольких задач. Каждый шаг открывает улику,
 * а финальный вопрос решается только по всем уликам сразу: так отдельные
 * задачи перестают быть списком и складываются в связную работу.
 */
export function CasesScreen({ progress, onBack, onStartStep, initialCaseId }: Props) {
  const narrow = useIsNarrow()
  const [openId, setOpenId] = useState<string | null>(initialCaseId ?? null)
  const open = openId ? CASES.find((c) => c.id === openId) ?? null : null

  if (open) {
    return (
      <CaseDetail
        item={open}
        progress={progress}
        narrow={narrow}
        onBack={() => setOpenId(null)}
        onStartStep={onStartStep}
      />
    )
  }

  const maxDiff = maxDifficulty(progress)

  return (
    <Screen
      title="Дела"
      subtitle="Расследование из нескольких задач: каждый шаг даёт улику, а финальный вопрос
                решается только по всем уликам сразу."
      onBack={onBack}
    >
      <div style={{
        display: 'grid', gap: 14,
        gridTemplateColumns: narrow ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
        alignItems: 'start',
      }}>
        {CASES.map((item) => {
          const done = doneSteps(progress, item)
          const answered = progress.cases?.[item.id]
          const locked = caseDifficulty(item) > maxDiff
          return (
            <Card
              key={item.id}
              onClick={locked ? undefined : () => setOpenId(item.id)}
              style={{ padding: 18, opacity: locked ? 0.55 : 1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🔍</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#263238' }}>{item.title}</span>
                {answered?.correct && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '3px 8px',
                    borderRadius: 20, color: 'white', background: '#66BB6A',
                  }}>
                    РАСКРЫТО
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#78909C', lineHeight: 1.5 }}>
                {item.brief}
              </p>
              {locked ? (
                <div style={{ fontSize: 12, color: '#90A4AE' }}>
                  🔒 нужен уровень допуска выше — в деле есть задачи сложности {caseDifficulty(item)}
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 12, color: '#78909C', marginBottom: 6,
                  }}>
                    <span>улик собрано <b style={{ color: '#37474F' }}>{done}</b> из {item.steps.length}</span>
                    <span style={{ fontSize: 11 }}>
                      {done === item.steps.length ? 'можно отвечать' : 'открыть дело →'}
                    </span>
                  </div>
                  <ProgressBar value={done} max={item.steps.length} color="#7E57C2" />
                </>
              )}
            </Card>
          )
        })}
      </div>
    </Screen>
  )
}

function CaseDetail({ item, progress, narrow, onBack, onStartStep }: {
  item: Case
  progress: Progress
  narrow: boolean
  onBack: () => void
  onStartStep: (task: Task, caseId: string) => void
}) {
  const done = doneSteps(progress, item)
  const ready = done === item.steps.length
  const answered = progress.cases?.[item.id]
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)

  return (
    <Screen title={item.title} subtitle={item.brief} onBack={onBack}>
      <Card style={{ padding: narrow ? 16 : 20, marginBottom: 16 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', fontSize: 12.5,
          color: '#78909C', marginBottom: 8,
        }}>
          <span>Улики</span>
          <b style={{ color: '#37474F' }}>{done} / {item.steps.length}</b>
        </div>
        <ProgressBar value={done} max={item.steps.length} color="#7E57C2" />
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {item.steps.map((step, i) => {
          const task = TASK_MAP[step.taskId]
          const solved = solvedStep(progress, step.taskId)
          // Шаги открываются по порядку: расследование ведут последовательно
          const available = i === 0 || solvedStep(progress, item.steps[i - 1].taskId)
          return (
            <Card key={step.taskId} style={{
              padding: narrow ? 14 : 18,
              borderLeft: `4px solid ${solved ? '#66BB6A' : available ? '#7E57C2' : '#ECEFF1'}`,
              opacity: available ? 1 : 0.6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'white',
                  background: solved ? '#66BB6A' : available ? '#7E57C2' : '#CFD8DC',
                }}>
                  {solved ? '✓' : i + 1}
                </span>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: '#263238' }}>
                  {task?.title ?? step.taskId}
                </span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 13, color: '#78909C', lineHeight: 1.5 }}>
                {step.intro}
              </p>

              {solved ? (
                <div style={{
                  background: '#F1F8E9', borderRadius: 8, padding: '10px 13px',
                  fontSize: 13, color: '#33691E', lineHeight: 1.5,
                }}>
                  🔎 {step.evidence}
                </div>
              ) : available && task ? (
                <Button kind="primary" onClick={() => onStartStep(task, item.id)}>
                  Взяться за шаг
                </Button>
              ) : (
                <div style={{ fontSize: 12.5, color: '#B0BEC5' }}>
                  Сначала разберитесь с предыдущей пробой.
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <Card style={{
        padding: narrow ? 16 : 20, marginTop: 16,
        borderLeft: `4px solid ${ready ? '#FFB300' : '#ECEFF1'}`,
        opacity: ready ? 1 : 0.65,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: '#B0BEC5' }}>
          ВЫВОД ПО ДЕЛУ
        </div>
        {!ready ? (
          <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#90A4AE', lineHeight: 1.55 }}>
            Соберите все улики — тогда откроется финальный вопрос.
          </p>
        ) : (
          <>
            <p style={{ margin: '8px 0 14px', fontSize: 14.5, color: '#37474F', lineHeight: 1.55 }}>
              {item.question}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {item.options.map((option, i) => {
                const chosen = picked === i
                const right = i === item.answer
                return (
                  <button
                    key={option}
                    disabled={checked}
                    onClick={() => setPicked(i)}
                    style={{
                      textAlign: 'left', minHeight: 44, padding: '11px 14px', borderRadius: 9,
                      cursor: checked ? 'default' : 'pointer', fontFamily: FONT,
                      fontSize: 13.5, fontWeight: 600, color: '#37474F',
                      border: `2px solid ${
                        checked && right ? '#66BB6A'
                        : checked && chosen ? '#EF9A9A'
                        : chosen ? '#1565C0' : '#E0E0E0'}`,
                      background: checked && right ? '#F1F8E9'
                        : checked && chosen ? '#FFEBEE'
                        : chosen ? '#E3F2FD' : 'white',
                    }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            {!checked ? (
              <div style={{ marginTop: 13 }}>
                <Button
                  kind="primary"
                  onClick={() => {
                    if (picked === null) return
                    setChecked(true)
                    recordCaseAnswer(item.id, picked === item.answer)
                  }}
                >
                  Закрыть дело
                </Button>
              </div>
            ) : (
              <div style={{
                marginTop: 14, padding: '13px 15px', borderRadius: 9,
                background: picked === item.answer ? '#F1F8E9' : '#FFF3E0',
                fontSize: 13.5, lineHeight: 1.6,
                color: picked === item.answer ? '#33691E' : '#5D4037',
              }}>
                <b>{picked === item.answer ? 'Дело раскрыто.' : 'Не сходится.'}</b> {item.explanation}
              </div>
            )}

            {answered?.correct && !checked && (
              <p style={{ margin: '12px 0 0', fontSize: 12.5, color: '#66BB6A' }}>
                Это дело вы уже раскрыли — можно пройти его заново.
              </p>
            )}
          </>
        )}
      </Card>
    </Screen>
  )
}
