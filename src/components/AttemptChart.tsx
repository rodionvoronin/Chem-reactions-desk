const FONT = "'Montserrat', system-ui, sans-serif"

interface Props {
  /** Теоретический минимум приливаний */
  optimum: number
  budget: number
  /** Длины всех удачных решений, включая текущее */
  history: number[]
  /** Длина хода в этой попытке */
  current: number
  /** Засчитана ли текущая попытка */
  currentCorrect: boolean
  /** Лучшие ходы одноклассников, если преподаватель выдал код класса */
  classRuns?: number[]
  compact?: boolean
}

/**
 * Гистограмма экономности вместо одной оценки. Три звезды отвечают на вопрос
 * «идеально или нет», и ответ почти всегда «нет». Гистограмма отвечает на
 * другой вопрос — «насколько короче я стал», — и на него хороший ответ есть
 * почти всегда.
 *
 * Сравнение только со своим прошлым ходом и с оптимумом: чужих результатов
 * приложение не знает, и придумывать их нельзя.
 */
export function AttemptChart({
  optimum, budget, history, current, currentCorrect, classRuns, compact,
}: Props) {
  const worst = Math.max(budget, current, ...history, ...(classRuns ?? []))
  // Ось не растягиваем бесконечно: после десятка колонок она нечитаема
  const last = Math.min(worst, optimum + 11)
  const columns: number[] = []
  for (let n = optimum; n <= last; n++) columns.push(n)

  const counts = new Map<number, number>()
  for (const value of history) {
    const key = Math.min(value, last)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const tallest = Math.max(1, ...counts.values())

  // Класс рисуем фоновым столбиком, чтобы он не спорил с точками ученика
  const classCounts = new Map<number, number>()
  for (const value of classRuns ?? []) {
    const key = Math.min(value, last)
    classCounts.set(key, (classCounts.get(key) ?? 0) + 1)
  }
  const classTallest = Math.max(1, ...classCounts.values())

  const dot = compact ? 7 : 9
  const gap = 3

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        {columns.map((n) => {
          const count = counts.get(n) ?? 0
          const isCurrent = currentCorrect && Math.min(current, last) === n
          const isOptimum = n === optimum
          const overBudget = n > budget
          return (
            <div key={n} style={{ flex: 1, textAlign: 'center', minWidth: 18 }}>
              <div style={{
                display: 'flex', flexDirection: 'column-reverse', alignItems: 'center',
                gap, minHeight: tallest * (dot + gap), position: 'relative',
              }}>
                {/* Столбик класса живёт внутри области точек, иначе он
                    закрывает подписи оси под колонкой */}
                {classCounts.get(n) && (
                  <div
                    title={`В классе таких решений: ${classCounts.get(n)}`}
                    style={{
                      position: 'absolute', left: '12%', right: '12%', bottom: 0, zIndex: 0,
                      height: `${(classCounts.get(n)! / classTallest) * 100}%`,
                      background: '#ECEFF1', borderRadius: '4px 4px 0 0',
                    }}
                  />
                )}
                {Array.from({ length: count }, (_, i) => {
                  // Точка всегда означает одно — ваше решение. Оптимум и бюджет
                  // отмечены на оси, иначе цвет пришлось бы читать двояко
                  const isThisAttempt = isCurrent && i === count - 1
                  return (
                    <span
                      key={i}
                      style={{
                        width: dot, height: dot, borderRadius: '50%', flexShrink: 0,
                        // Над столбиком класса, иначе точка утонет в фоне
                        position: 'relative', zIndex: 1,
                        background: isThisAttempt ? '#1565C0' : '#90CAF9',
                        boxShadow: isThisAttempt ? '0 0 0 3px rgba(21,101,192,0.28)' : 'none',
                      }}
                    />
                  )
                })}
              </div>
              <div style={{
                marginTop: 6, paddingTop: 5,
                // Ось и есть шкала оценки: зелёная граница — оптимум,
                // оранжевая — предел бюджета
                borderTop: `2px solid ${isOptimum ? '#66BB6A' : overBudget ? '#FFAB91' : '#ECEFF1'}`,
                fontSize: compact ? 10.5 : 11.5,
                fontWeight: isOptimum || isCurrent ? 700 : 600,
                color: isOptimum ? '#2E7D32' : overBudget ? '#BF360C' : '#90A4AE',
              }}>
                {n === last && worst > last ? `${n}+` : n}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{
        display: 'flex', gap: 14, marginTop: 9, flexWrap: 'wrap',
        fontSize: compact ? 10.5 : 11.5, color: '#90A4AE',
      }}>
        <Legend color="#1565C0" text="точка — ваше решение" />
        {classCounts.size > 0 && <Legend color="#CFD8DC" text="столбик — класс" />}
        <Legend color="#66BB6A" text={`оптимум — ${optimum}`} />
        {worst > budget && <Legend color="#FFAB91" text={`сверх бюджета — больше ${budget}`} />}
      </div>
      <div style={{ marginTop: 4, fontSize: compact ? 10 : 11, color: '#B0BEC5' }}>
        По горизонтали — сколько приливаний ушло на решение.
      </div>
    </div>
  )
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      {text}
    </span>
  )
}

/**
 * Короткая фраза о том, что означает результат. Она и есть замена звёздам:
 * говорит не «идеально/нет», а на сколько ход стал экономнее.
 */
export function attemptVerdict(
  optimum: number, history: number[], current: number, currentCorrect: boolean,
): string {
  if (!currentCorrect) {
    return history.length > 0
      ? `Эта попытка не засчитана. Ваш лучший ход остаётся ${Math.min(...history)}.`
      : 'Задача ещё не решена, поэтому в гистограмме пока пусто.'
  }

  const best = Math.min(...history)
  const previous = history.slice(0, -1)
  const previousBest = previous.length > 0 ? Math.min(...previous) : null

  if (current === optimum) {
    return previousBest !== null && previousBest > current
      ? `Оптимум! Короче нельзя, а прошлый ваш ход был на ${previousBest - current} длиннее.`
      : 'Оптимум — короче эту задачу не решить.'
  }
  if (previousBest !== null && current < previousBest) {
    return `Лучше прежнего на ${previousBest - current}: было ${previousBest}, стало ${current}. `
         + `До оптимума осталось ${current - optimum}.`
  }
  if (current === best) {
    return `Ваш лучший ход — ${current}. До оптимума ${current - optimum}: попробуйте обойтись без лишнего реактива.`
  }
  return `В этот раз ${current}, ваш лучший — ${best}, оптимум — ${optimum}.`
}

/**
 * Сравнение с классом. Считаем в людях, а не в процентах: в группе из
 * двенадцати человек «62%» — точность, которой в данных нет.
 */
export function classVerdict(longer: number, total: number, spent: number): string {
  if (total === 0) return ''
  if (longer === total) return `Короче, чем у всех ${total} в классе — пока лучший результат.`
  if (longer === 0) {
    return `В классе есть решения короче: ваш ход — ${spent}. Есть куда расти.`
  }
  return `Короче, чем у ${longer} ${plural(longer, 'ученика', 'учеников', 'учеников')} `
       + `из ${total} в классе.`
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  const mod10 = n % 10
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}
