import { useMemo, useState } from 'react'
import { Progress, TOTAL_EQUATIONS } from '../game/progress'
import {
  FAMILIES, FAMILY_EQUATIONS, FAMILY_OF, TIERS, tierGoal, tierReached,
} from '../game/families'
import { PAIR_REACTIONS, SUBSTANCES } from '../ege/graph'
import { Screen, Card, ProgressBar, FONT } from './ui'
import { useIsNarrow } from '../useViewport'

interface Props {
  progress: Progress
  onBack: () => void
}

interface FamilyState {
  id: string
  found: number
  total: number
  /** Сколько ещё открыть до следующей ступени */
  need: number
  goalLabel: string | null
}

/** Пары реагентов, которыми получают уравнение — для подсказок «что попробовать» */
const PAIR_BY_EQUATION = new Map<string, { reagents: string[]; heated: boolean }>()
for (const reaction of PAIR_REACTIONS) {
  const previous = PAIR_BY_EQUATION.get(reaction.rule.description)
  // Из нескольких способов получить одно уравнение предпочитаем тот, что идёт
  // без нагрева: его ученик соберёт на столе сразу
  if (!previous || (previous.heated && !reaction.heated)) {
    PAIR_BY_EQUATION.set(reaction.rule.description, {
      reagents: reaction.reagents,
      heated: reaction.heated,
    })
  }
}

/**
 * Лабораторный журнал как карта открытий. Каждое впервые увиденное уравнение
 * попадает сюда и из песочницы, и из заданий, но лежит не сплошным списком:
 * реакции разложены по семействам, и у каждого видно, сколько осталось найти.
 * Так у свободного стола появляется собственная цель — не «поиграть», а
 * закрыть ветку, — и журнал остаётся справочником перед экзаменом.
 */
export function JournalScreen({ progress, onBack }: Props) {
  const narrow = useIsNarrow()
  const [query, setQuery] = useState('')
  const [openFamily, setOpenFamily] = useState<string | null>(null)

  const found = useMemo(() => new Set(progress.journal), [progress.journal])

  const families: FamilyState[] = useMemo(() => FAMILIES.map((family) => {
    const list = FAMILY_EQUATIONS[family.id]
    const opened = list.filter((e) => found.has(e)).length
    const goal = tierGoal(opened, list.length)
    return {
      id: family.id,
      found: opened,
      total: list.length,
      need: goal?.need ?? 0,
      goalLabel: goal ? `${goal.tier.label}: ещё ${goal.need}` : null,
    }
  }), [found])

  // Подсказка ведёт туда, где до ступени осталось меньше всего — так у ученика
  // всегда есть близкая цель, а не список из семисот недостающих реакций
  const suggestions = useMemo(() => {
    const closest = families
      .filter((f) => f.need > 0 && f.total > 0)
      .sort((a, b) => a.need - b.need || a.id.localeCompare(b.id))[0]
    if (!closest) return []
    const candidates = FAMILY_EQUATIONS[closest.id]
      .filter((e) => !found.has(e) && PAIR_BY_EQUATION.has(e))
      .map((e) => ({ equation: e, ...PAIR_BY_EQUATION.get(e)!, familyId: closest.id }))
    // Реакции без нагрева идут первыми — их проще собрать
    candidates.sort((a, b) => Number(a.heated) - Number(b.heated))
    return candidates.slice(0, 3)
  }, [families, found])

  const searching = query.trim().length > 0
  const matches = useMemo(() => {
    if (!searching) return []
    const q = query.trim().toLowerCase()
    return [...progress.journal].reverse().filter((e) => e.toLowerCase().includes(q))
  }, [progress.journal, query, searching])

  return (
    <Screen
      title="Лабораторный журнал"
      subtitle={`Открыто ${progress.journal.length} реакций из ${TOTAL_EQUATIONS}. `
              + 'Запись появляется, как только реакция прошла у вас на столе.'}
      onBack={onBack}
      actions={
        <input
          value={query}
          placeholder="Поиск по формуле…"
          onChange={(e) => setQuery(e.target.value)}
          style={{
            border: '1.5px solid #E0E0E0', borderRadius: 9, padding: '10px 13px',
            fontFamily: FONT, fontSize: 13, color: '#37474F',
            width: narrow ? '100%' : 240, outline: 'none',
          }}
        />
      }
    >
      {searching ? (
        <FlatList matches={matches} />
      ) : (
        <>
          <Card style={{ padding: 18, marginBottom: 14 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', fontSize: 12.5,
              color: '#78909C', marginBottom: 9,
            }}>
              <span>Собрано за всё время</span>
              <b style={{ color: '#37474F' }}>{progress.journal.length} / {TOTAL_EQUATIONS}</b>
            </div>
            <ProgressBar value={progress.journal.length} max={TOTAL_EQUATIONS} color="#42A5F5" />
          </Card>

          {suggestions.length > 0 && (
            <Card style={{ padding: 18, marginBottom: 18, borderLeft: '4px solid #FFB300' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: '#B0BEC5' }}>
                ЧТО ОТКРЫТЬ ДАЛЬШЕ
              </div>
              <p style={{ margin: '7px 0 12px', fontSize: 13, color: '#78909C', lineHeight: 1.5 }}>
                Ближе всего ступень в семействе «{FAMILIES.find((f) => f.id === suggestions[0].familyId)?.title}».
                Соберите на столе одну из этих пар:
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {suggestions.map((s) => (
                  <span
                    key={s.equation}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      background: '#FFF8E1', border: '1.5px solid #FFE082', borderRadius: 9,
                      padding: '9px 13px', fontSize: 13.5, fontWeight: 700, color: '#8D6E00',
                    }}
                  >
                    {s.reagents.map((id) => SUBSTANCES[id]?.label ?? id).join('  +  ')}
                    {s.heated && <span title="Нужно нагревание">🔥</span>}
                  </span>
                ))}
              </div>
            </Card>
          )}

          <div style={{
            display: 'grid', gap: 12,
            gridTemplateColumns: narrow ? '1fr' : 'repeat(auto-fill, minmax(268px, 1fr))',
            // Без этого раскрытая карточка растягивает по высоте весь свой ряд
            alignItems: 'start',
          }}>
            {FAMILIES.map((family) => {
              const state = families.find((f) => f.id === family.id)!
              const reached = tierReached(state.found, state.total)
              const open = openFamily === family.id
              return (
                <Card
                  key={family.id}
                  onClick={() => setOpenFamily(open ? null : family.id)}
                  style={{
                    padding: 16, borderLeft: `4px solid ${family.color}`,
                    outline: open ? `2px solid ${family.color}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ fontSize: 17 }}>{family.icon}</span>
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: '#263238', lineHeight: 1.25 }}>
                      {family.title}
                    </span>
                    {reached > 0 && (
                      <span
                        title={TIERS[reached - 1].label}
                        style={{
                          marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '3px 8px',
                          borderRadius: 20, color: 'white', background: TIERS[reached - 1].color,
                        }}
                      >
                        {TIERS[reached - 1].label.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '7px 0 11px', fontSize: 12, color: '#90A4AE', lineHeight: 1.45 }}>
                    {family.subtitle}
                  </p>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    fontSize: 12, color: '#78909C', marginBottom: 6,
                  }}>
                    <span>открыто <b style={{ color: '#37474F' }}>{state.found}</b> из {state.total}</span>
                    {state.goalLabel && <span style={{ fontSize: 11 }}>{state.goalLabel}</span>}
                  </div>
                  <ProgressBar value={state.found} max={state.total} color={family.color} />

                  {open && (
                    <div style={{ marginTop: 13 }}>
                      {state.found === 0 ? (
                        <p style={{ margin: 0, fontSize: 12.5, color: '#B0BEC5', lineHeight: 1.5 }}>
                          Здесь пока пусто. Проведите реакцию этого типа на столе — запись появится сама.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {FAMILY_EQUATIONS[family.id]
                            .filter((e) => found.has(e))
                            .map((equation) => (
                              <div key={equation} style={{
                                background: '#F7FAF7', borderLeft: `3px solid ${family.color}`,
                                borderRadius: 7, padding: '8px 11px', fontSize: 12.5,
                                fontWeight: 600, color: '#37474F', lineHeight: 1.45,
                              }}>
                                {equation}
                              </div>
                            ))}
                        </div>
                      )}
                      {state.total - state.found > 0 && (
                        <p style={{ margin: '10px 0 0', fontSize: 11.5, color: '#B0BEC5' }}>
                          Не открыто ещё {state.total - state.found}.
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </>
      )}
    </Screen>
  )
}

function FlatList({ matches }: { matches: string[] }) {
  if (matches.length === 0) {
    return (
      <Card style={{ padding: 26, textAlign: 'center', color: '#B0BEC5', fontSize: 14 }}>
        По этому запросу в журнале записей нет.
      </Card>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {matches.map((equation) => {
        const family = FAMILIES.find((f) => f.id === FAMILY_OF[equation])
        return (
          <div
            key={equation}
            style={{
              background: 'white', border: '1px solid #ECEFF1',
              borderLeft: `4px solid ${family?.color ?? '#66BB6A'}`,
              borderRadius: 9, padding: '12px 16px', display: 'flex', gap: 12,
              alignItems: 'baseline', fontSize: 14.5, color: '#37474F',
              fontWeight: 600, lineHeight: 1.45, flexWrap: 'wrap',
            }}
          >
            {family && <span style={{ fontSize: 13 }}>{family.icon}</span>}
            {equation}
          </div>
        )
      })}
    </div>
  )
}
