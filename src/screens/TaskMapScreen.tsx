import { TASKS, TOPICS, tasksOfTopic } from '../game/bank'
import { Task } from '../game/types'
import { Progress, LEVELS, levelIndex, maxDifficulty, solvedCount } from '../game/progress'
import { Screen, Card, Stars, FONT } from './ui'

const DIFFICULTY: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'база',      color: '#2E7D32', bg: '#E8F5E9' },
  2: { label: 'ЕГЭ',       color: '#EF6C00', bg: '#FFF3E0' },
  3: { label: 'олимпиада', color: '#AD1457', bg: '#FCE4EC' },
}

const TYPE_LABEL: Record<Task['type'], string> = {
  identify: 'определи вещество',
  achieve: 'добейся признака',
  distinguish: 'различи пару',
  chain: 'цепочка превращений',
  flame: 'окрашивание пламени',
  dry: 'сухой режим',
}

interface Props {
  progress: Progress
  onBack: () => void
  onStart: (task: Task) => void
}

/**
 * Карта прогресса по темам качественного анализа. Видно не только что решено,
 * но и где пробел — это и есть та сводка, которую спрашивает преподаватель.
 */
export function TaskMapScreen({ progress, onBack, onStart }: Props) {
  const maxDiff = maxDifficulty(progress)
  const level = LEVELS[levelIndex(progress)]

  return (
    <Screen
      title="Задания"
      subtitle={`Уровень допуска «${level.title}»: доступна сложность до ${maxDiff}. `
              + `Решено ${solvedCount(progress)} из ${TASKS.length}.`}
      onBack={onBack}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {TOPICS.map((topic) => {
          const list = tasksOfTopic(topic.id)
          const done = list.filter((t) => (progress.results[t.id]?.stars ?? 0) > 0).length
          return (
            <div key={topic.id}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 11, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#263238' }}>
                  {topic.title}
                </h2>
                <span style={{ fontSize: 12.5, color: '#B0BEC5' }}>{topic.subtitle}</span>
                <span style={{
                  marginLeft: 'auto', fontSize: 12, fontWeight: 700,
                  color: done === list.length ? '#2E7D32' : '#90A4AE',
                }}>
                  {done} / {list.length}
                </span>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(238px, 1fr))',
                gap: 12, marginTop: 11,
              }}>
                {list.map((task) => {
                  const result = progress.results[task.id]
                  const locked = task.difficulty > maxDiff
                  const diff = DIFFICULTY[task.difficulty]
                  return (
                    <Card
                      key={task.id}
                      onClick={locked ? undefined : () => onStart(task)}
                      style={{
                        padding: 15, opacity: locked ? 0.55 : 1,
                        borderLeft: `4px solid ${result?.stars ? '#66BB6A' : '#ECEFF1'}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, padding: '2px 7px',
                          borderRadius: 20, color: diff.color, background: diff.bg,
                        }}>
                          {diff.label.toUpperCase()}
                        </span>
                        <span style={{ fontSize: 10.5, color: '#B0BEC5' }}>{TYPE_LABEL[task.type]}</span>
                      </div>

                      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#37474F', lineHeight: 1.35 }}>
                        {task.title}
                      </div>

                      <div style={{
                        marginTop: 11, display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', gap: 8,
                      }}>
                        {locked ? (
                          <span style={{ fontSize: 11.5, color: '#90A4AE' }}>
                            🔒 нужен уровень выше
                          </span>
                        ) : (
                          <>
                            <Stars value={result?.stars ?? 0} />
                            <span style={{ fontSize: 11, color: '#B0BEC5' }}>
                              {result
                                ? `попыток: ${result.attempts}`
                                : `бюджет: ${task.budget}`}
                            </span>
                          </>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}

        <p style={{
          margin: 0, fontSize: 12, color: '#B0BEC5', lineHeight: 1.6, fontFamily: FONT,
        }}>
          Цепочки превращений (тип T4) и генератор заданий из полной таблицы реакций —
          следующий этап; сейчас банк собран вручную по группам катионов и анионов.
        </p>
      </div>
    </Screen>
  )
}
