import { TASKS, TOPICS, tasksOfTopic } from '../game/bank'
import { Task } from '../game/types'
import {
  Progress, LEVELS, levelIndex, maxDifficulty, solvedCount, levelUnlocking, toNextLevel,
} from '../game/progress'
import { Screen, Card, Stars, ProgressBar, FONT } from './ui'
import { optimalSteps } from '../game/engine'
import { useIsNarrow } from '../useViewport'
import { count } from '../plural'

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

/** Что именно открыто на уровне — в терминах ярлыков сложности */
function openedLabel(maxDiff: number): string {
  const opened = [1, 2, 3].filter((d) => d <= maxDiff).map((d) => DIFFICULTY[d].label)
  return opened.join(', ')
}

interface Props {
  progress: Progress
  onBack: () => void
  onStart: (task: Task) => void
}

/**
 * Карта заданий. Уровень допуска раньше был строчкой в подзаголовке: по ней
 * нельзя было понять ни как он растёт, ни почему половина списка серая.
 * Теперь уровень показан отдельной панелью с остатком до следующего, а темы,
 * до которых ученик ещё не дорос, свёрнуты в одну строку — чтобы список
 * раскрывался постепенно, а не вываливался стеной из тридцати семи карточек.
 */
export function TaskMapScreen({ progress, onBack, onStart }: Props) {
  const narrow = useIsNarrow()
  const maxDiff = maxDifficulty(progress)
  const level = LEVELS[levelIndex(progress)]
  const next = toNextLevel(progress)

  const openTopics = TOPICS.filter((t) => tasksOfTopic(t.id).some((x) => x.difficulty <= maxDiff))
  const futureTopics = TOPICS.filter((t) => !openTopics.includes(t))

  return (
    <Screen
      title="Задания"
      subtitle={`Решено ${solvedCount(progress)} из ${TASKS.length}.`}
      onBack={onBack}
    >
      <Card style={{ padding: narrow ? 16 : 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 11, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.7, color: '#90A4AE' }}>
            УРОВЕНЬ ДОПУСКА
          </span>
          <span style={{ fontSize: narrow ? 18 : 21, fontWeight: 700, color: '#263238' }}>
            {level.title}
          </span>
          <span style={{ fontSize: 13, color: '#78909C' }}>
            открыты задания: {openedLabel(maxDiff)}
          </span>
        </div>

        {next ? (
          <>
            <p style={{ margin: '14px 0 12px', fontSize: 13.5, color: '#455A64', lineHeight: 1.55 }}>
              До уровня «{next.level.title}» — {next.level.unlocks}. Осталось:{' '}
              <b>{remainder(next.needSolved - next.solved, 'решить', 'задачу', 'задачи', 'задач')}</b>
              {' и '}
              <b>{remainder(next.needJournal - next.journal, 'открыть', 'уравнение', 'уравнения', 'уравнений')}</b>.
            </p>
            <div style={{
              display: 'grid', gap: 14,
              gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
            }}>
              <Requirement
                label="Решено задач"
                value={next.solved} max={next.needSolved} color="#66BB6A"
              />
              <Requirement
                label="Записей в журнале"
                value={next.journal} max={next.needJournal} color="#42A5F5"
              />
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 12, color: '#B0BEC5', lineHeight: 1.5 }}>
              Журнал пополняется и в песочнице: свободные опыты за столом тоже двигают уровень.
            </p>
          </>
        ) : (
          <p style={{ margin: '13px 0 0', fontSize: 13.5, color: '#2E7D32', lineHeight: 1.55 }}>
            Открыт весь банк заданий — выше уровня нет.
          </p>
        )}
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {openTopics.map((topic) => {
          const all = tasksOfTopic(topic.id)
          // Доступные вперёд, закрытые — хвостом. Вперемешку они читались
          // как одна куча, в которой половина карточек просто не нажимается
          const list = [...all].sort((a, b) => {
            const lockedA = a.difficulty > maxDiff ? 1 : 0
            const lockedB = b.difficulty > maxDiff ? 1 : 0
            return lockedA - lockedB || a.difficulty - b.difficulty
          })
          const done = all.filter((t) => (progress.results[t.id]?.stars ?? 0) > 0).length
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
                  {done} / {all.length}
                </span>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(238px, 1fr))',
                gap: 12, marginTop: 11,
              }}>
                {list.map((task) => {
                  const result = progress.results[task.id]
                  const history = result?.history ?? []
                  const best = history.length > 0 ? Math.min(...history) : null
                  const locked = task.difficulty > maxDiff
                  const diff = DIFFICULTY[task.difficulty]
                  return (
                    <Card
                      key={task.id}
                      onClick={locked ? undefined : () => onStart(task)}
                      style={{
                        padding: 15, opacity: locked ? 0.45 : 1,
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
                            🔒 откроется на уровне «{levelUnlocking(task.difficulty).title}»
                          </span>
                        ) : (
                          <>
                            <Stars value={result?.stars ?? 0} />
                            {/* Экономность виднее звёзд: она и есть то, что
                                имеет смысл улучшать при повторном решении */}
                            <span style={{ fontSize: 11, color: '#B0BEC5' }}>
                              {best !== null
                                ? `лучший ход: ${best} · оптимум ${optimalSteps(task)}`
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

        {/* Темы, до которых ученик ещё не дорос: видно, что они есть,
            но стеной карточек они не мешают */}
        {futureTopics.length > 0 && (
          <div>
            <h2 style={{ margin: '0 0 11px', fontSize: 15, fontWeight: 700, color: '#B0BEC5' }}>
              Откроется позже
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {futureTopics.map((topic) => {
                const list = tasksOfTopic(topic.id)
                const need = levelUnlocking(Math.min(...list.map((t) => t.difficulty)))
                return (
                  <div
                    key={topic.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                      padding: '13px 16px', borderRadius: 11,
                      background: '#F5F7F9', border: '1px solid #ECEFF1', fontFamily: FONT,
                    }}
                  >
                    <span style={{ fontSize: 15 }}>🔒</span>
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: '#78909C' }}>
                      {topic.title}
                    </span>
                    <span style={{ fontSize: 12.5, color: '#B0BEC5' }}>{topic.subtitle}</span>
                    <span style={{
                      marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: '#90A4AE',
                      whiteSpace: 'nowrap',
                    }}>
                      уровень «{need.title}» · задач: {list.length}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Screen>
  )
}

function Requirement({ label, value, max, color }: {
  label: string; value: number; max: number; color: string
}) {
  const done = value >= max
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontSize: 12.5, color: '#78909C', marginBottom: 6,
      }}>
        <span>{label}</span>
        <b style={{ color: done ? '#2E7D32' : '#37474F' }}>
          {Math.min(value, max)} / {max}{done ? ' ✓' : ''}
        </b>
      </div>
      <ProgressBar value={Math.min(value, max)} max={max} color={done ? '#66BB6A' : color} />
    </div>
  )
}

/** «решить ещё 2 задачи»; при нулевом остатке — «готово» */
function remainder(left: number, verb: string, one: string, few: string, many: string): string {
  return left <= 0 ? 'готово' : `${verb} ещё ${count(left, one, few, many)}`
}
