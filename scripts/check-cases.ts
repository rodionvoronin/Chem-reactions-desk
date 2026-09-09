/**
 * Проверка дел: `npm run check:cases`.
 *
 * Дело — это сюжет поверх задач, и сюжет легко расходится с химией. Скрипт
 * следит за обоими: шаги должны ссылаться на существующие задачи, а каждое
 * утверждение из facts — подтверждаться таблицей реакций. Если реакция из
 * рассказа не идёт, дело не соберётся.
 */

import { CASES, caseDifficulty, caseTasks } from '../src/game/cases'
import { TASK_MAP } from '../src/game/bank'
import { matchReactions } from '../src/reactions'

const problems: string[] = []

const ids = new Set<string>()
for (const item of CASES) {
  const where = `дело «${item.title}»`
  if (ids.has(item.id)) problems.push(`${where}: повторяющийся идентификатор ${item.id}`)
  ids.add(item.id)

  if (item.steps.length < 3) problems.push(`${where}: шагов меньше трёх — это не расследование`)

  // Шаги ссылаются на реальные задачи и не повторяются внутри дела
  const seen = new Set<string>()
  for (const step of item.steps) {
    if (!TASK_MAP[step.taskId]) problems.push(`${where}: нет задачи ${step.taskId}`)
    if (seen.has(step.taskId)) problems.push(`${where}: задача ${step.taskId} встречается дважды`)
    seen.add(step.taskId)
    if (!step.evidence.trim()) problems.push(`${where}: у шага ${step.taskId} нет улики`)
  }

  // Финальный вопрос
  if (item.options.length < 3) problems.push(`${where}: меньше трёх вариантов ответа`)
  if (new Set(item.options).size !== item.options.length) {
    problems.push(`${where}: варианты ответа повторяются`)
  }
  if (item.answer < 0 || item.answer >= item.options.length) {
    problems.push(`${where}: ответ указывает за пределы списка вариантов`)
  }
  if (!item.explanation.trim()) problems.push(`${where}: нет разбора финального вопроса`)

  // Утверждения сюжета сверяем с таблицей реакций
  for (const fact of item.facts) {
    const effects = matchReactions(fact.inputs, fact.dry ?? false)
    const precipitate = effects.precipitate !== undefined
    const gas = effects.gas === true
    const anything = precipitate || gas || effects.liquidColor !== undefined
    const label = fact.inputs.join(' + ') + (fact.dry ? ' (сухой)' : '')

    const ok = fact.expect === 'precipitate' ? precipitate
      : fact.expect === 'gas' ? gas
      : fact.expect === 'both' ? precipitate && gas
      : anything
    if (!ok) {
      problems.push(`${where}: ${label} не даёт «${fact.expect}» — ${fact.why}`)
    }
  }
}

console.log(`Дел: ${CASES.length}`)
for (const item of CASES) {
  console.log(`  ${item.title.padEnd(22)} шагов ${item.steps.length}, `
    + `сложность ${caseDifficulty(item)}, задачи: ${caseTasks(item).map((t) => t.id).join(', ')}`)
}

if (problems.length > 0) {
  console.error(`\nПроблем: ${problems.length}`)
  for (const p of problems) console.error('  ✗ ' + p)
  process.exit(1)
}
console.log('\nСюжеты дел не расходятся с таблицей реакций.')
