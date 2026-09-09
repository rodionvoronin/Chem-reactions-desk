import { ReactNode } from 'react'
import { REAGENT_MAP } from '../reactions'
import { FLAME_METALS } from './FlameColorsPalette'
import { Session, sampleLabel } from '../game/session'
import { Action } from '../game/types'
import { trace, TraceStep, Verdict, optimalSteps } from '../game/engine'
import { useIsNarrow } from '../useViewport'
import { AttemptChart, attemptVerdict, classVerdict } from './AttemptChart'

const FONT = "'Montserrat', system-ui, sans-serif"

interface Props {
  session: Session
  verdict: Verdict
  stars: number
  /** Длины всех удачных решений этой задачи, включая текущее */
  history: number[]
  /** Лучшие ходы одноклассников по этой задаче */
  classRuns: number[]
  /** Сколько из них длиннее текущего хода */
  classLonger: number
  spent: number
  hintsUsed: number
  actions: Action[]
  /** Уравнения, впервые попавшие в журнал за эту попытку */
  newEquations: string[]
  hasNext: boolean
  onRetry: () => void
  onNext: () => void
  onExit: () => void
}

/**
 * Разбор после решения — главный обучающий момент режима. Фактический ход
 * ученика ставится рядом с эталонным; оба считает движок, поэтому разбор
 * не может разойтись с химией.
 */
export function DebriefModal({
  session, verdict, stars, history, classRuns, classLonger, spent, hintsUsed, actions, newEquations,
  hasNext, onRetry, onNext, onExit,
}: Props) {
  const narrow = useIsNarrow()
  const { task } = session
  const isDry = task.dry === true
  const tubeCount = Math.max(1, session.assignment.length)

  // Фактический ход: по каждой пробирке — то, что ученик в неё лил
  const actual = Array.from({ length: tubeCount }, (_, i) => {
    const base = session.assignment[i] !== undefined ? [session.assignment[i]] : (task.start ?? [])
    const reagents = actions.filter((a) => a.tubeIndex === i).map((a) => a.reagentId)
    return { index: i, steps: trace(base, reagents, isDry) }
  })

  const optimalBase = session.assignment[0] !== undefined
    ? [session.assignment[0]]
    : (task.start ?? [])
  const optimal = trace(optimalBase, task.solution, isDry)

  const equations = Array.from(new Set(
    [...optimal, ...actual.flatMap((a) => a.steps)]
      .flatMap((s) => (s.equation ? s.equation.split('  ·  ') : []))
  ))

  const flame = task.flameMetal ? FLAME_METALS.find((m) => m.id === task.flameMetal) : undefined
  const answerLabel = task.type === 'flame'
    ? flame ? `${flame.name} (${flame.symbol})` : task.answer[0]
    : session.assignment.length > 1
      ? session.assignment.map((id, i) => `${sampleLabel(i, tubeCount)} — ${REAGENT_MAP[id]?.label ?? id}`).join(', ')
      : REAGENT_MAP[task.answer[0]]?.label ?? task.answer[0]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(20,30,40,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: narrow ? 10 : 24,
      fontFamily: FONT,
    }}>
      <div style={{
        background: 'white', borderRadius: 16, width: 'min(820px, 100%)',
        maxHeight: '100%', display: 'flex', flexDirection: 'column',
        boxShadow: '0 12px 48px rgba(0,0,0,0.3)', overflow: 'hidden',
      }}>
        {/* Итог */}
        <div style={{
          padding: narrow ? '16px 16px 13px' : '20px 26px 16px',
          background: verdict.correct ? 'linear-gradient(135deg,#E8F5E9,#F1F8E9)' : '#FFF3E0',
          borderBottom: '1px solid #ECEFF1',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 26 }}>{verdict.correct ? '✓' : '✗'}</span>
            <h2 style={{
              margin: 0, fontSize: narrow ? 18 : 21, fontWeight: 700,
              color: verdict.correct ? '#1B5E20' : '#BF360C',
            }}>
              {verdict.correct ? 'Задача решена' : 'Пока не засчитано'}
            </h2>
            <span
              title={`Оценка: ${stars} из 3`}
              style={{ fontSize: 15, letterSpacing: 2, marginLeft: 'auto', color: '#FFB300' }}
            >
              {'★'.repeat(stars)}<span style={{ color: '#CFD8DC' }}>{'★'.repeat(3 - stars)}</span>
            </span>
          </div>

          {!verdict.correct && (
            <p style={{ margin: '10px 0 0', fontSize: 14, color: '#5D4037', lineHeight: 1.5 }}>
              {verdict.reason}
            </p>
          )}

          <div style={{ marginTop: 12, display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13, color: '#546E7A' }}>
            <span>Подсказки: <b>{hintsUsed}</b></span>
            <span>Правильный ответ: <b style={{ color: '#37474F' }}>{answerLabel}</b></span>
          </div>
        </div>

        {/* Ходы */}
        <div style={{ padding: narrow ? '14px 16px' : '18px 26px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {/* Экономность хода. Главное число разбора: не «идеально или нет»,
              а насколько ход короче прежнего и далеко ли до оптимума. */}
          <div style={{ marginBottom: 20 }}>
            <ColumnTitle>ЭКОНОМНОСТЬ ХОДА</ColumnTitle>
            <p style={{ margin: '0 0 13px', fontSize: 13.5, color: '#37474F', lineHeight: 1.55 }}>
              {attemptVerdict(optimalSteps(task), history, spent, verdict.correct)}
              {verdict.correct && classRuns.length > 0 && (
                <> {classVerdict(classLonger, classRuns.length, spent)}</>
              )}
            </p>
            {history.length > 0 && (
              <AttemptChart
                optimum={optimalSteps(task)}
                budget={task.budget}
                history={history}
                current={spent}
                currentCorrect={verdict.correct}
                classRuns={classRuns}
                compact={narrow}
              />
            )}
          </div>

          {task.type === 'flame' ? (
            <p style={{ margin: 0, fontSize: 14, color: '#455A64', lineHeight: 1.6 }}>
              Окраска пламени — экспресс-проба: она указывает металл, но ничего не говорит
              об анионе. В настоящем анализе ею начинают, а не заканчивают.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: narrow ? 14 : 22 }}>
              <div>
                <ColumnTitle>ВАШ ХОД</ColumnTitle>
                {actual.map((a) => (
                  <div key={a.index} style={{ marginBottom: 12 }}>
                    {tubeCount > 1 && (
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#90A4AE', marginBottom: 5 }}>
                        {sampleLabel(a.index, tubeCount).toUpperCase()}
                      </div>
                    )}
                    {a.steps.length === 0
                      ? <Empty>Реагенты не приливались</Empty>
                      : a.steps.map((s, i) => <StepRow key={i} step={s} n={i + 1} />)}
                  </div>
                ))}
              </div>
              <div>
                <ColumnTitle>ОПТИМАЛЬНЫЙ ХОД</ColumnTitle>
                {optimal.length === 0
                  ? <Empty>Реагенты не требуются</Empty>
                  : optimal.map((s, i) => <StepRow key={i} step={s} n={i + 1} optimal />)}
              </div>
            </div>
          )}

          {/* Уравнения — открываем только после разбора */}
          {equations.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <ColumnTitle>УРАВНЕНИЯ</ColumnTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {equations.map((eq, i) => (
                  <div key={i} style={{
                    background: '#E8F5E9', borderLeft: '4px solid #66BB6A', borderRadius: 7,
                    padding: '9px 13px', fontSize: 14, fontWeight: 600, color: '#1B5E20', lineHeight: 1.45,
                  }}>
                    {eq}
                  </div>
                ))}
              </div>
            </div>
          )}

          {newEquations.length > 0 && (
            <p style={{
              margin: '14px 0 0', fontSize: 13, color: '#0D47A1',
              background: '#E3F2FD', borderRadius: 8, padding: '10px 13px',
            }}>
              📓 В лабораторный журнал добавлено новых записей: <b>{newEquations.length}</b>
            </p>
          )}
        </div>

        {/* Кнопки */}
        <div style={{
          padding: narrow ? '12px 16px 14px' : '14px 26px 18px', borderTop: '1px solid #ECEFF1',
          display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap',
        }}>
          <Button onClick={onExit} kind="ghost">К списку заданий</Button>
          <Button onClick={onRetry} kind="ghost">Решить заново</Button>
          {hasNext && <Button onClick={onNext} kind="primary">Следующая задача</Button>}
        </div>
      </div>
    </div>
  )
}

function StepRow({ step, n, optimal }: { step: TraceStep; n: number; optimal?: boolean }) {
  const r = REAGENT_MAP[step.reagentId]
  return (
    <div style={{
      display: 'flex', gap: 9, alignItems: 'flex-start', padding: '7px 10px',
      borderRadius: 8, background: optimal ? '#F1F8E9' : '#FAFAFA', marginBottom: 5,
    }}>
      <span style={{
        width: 19, height: 19, borderRadius: '50%', flexShrink: 0,
        background: optimal ? '#AED581' : '#CFD8DC', color: '#37474F',
        fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {n}
      </span>
      <span style={{ fontSize: 13, lineHeight: 1.45, color: '#37474F' }}>
        <b>{step.reagentId === 'heat' ? 'прокаливание' : `+ ${r?.label ?? step.reagentId}`}</b>
        {' — '}
        <span style={{ color: '#607D8B' }}>{step.observation}</span>
      </span>
    </div>
  )
}

function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: 0.7,
      color: '#90A4AE', marginBottom: 9,
    }}>
      {children}
    </div>
  )
}

function Empty({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 12.5, color: '#B0BEC5', padding: '4px 0' }}>{children}</div>
}

function Button({ children, onClick, kind }: {
  children: ReactNode; onClick: () => void; kind: 'primary' | 'ghost'
}) {
  const primary = kind === 'primary'
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px', borderRadius: 9, cursor: 'pointer', fontFamily: FONT,
        fontSize: 13.5, fontWeight: 700,
        border: primary ? 'none' : '1.5px solid #CFD8DC',
        background: primary ? '#1565C0' : 'white',
        color: primary ? 'white' : '#546E7A',
      }}
    >
      {children}
    </button>
  )
}
