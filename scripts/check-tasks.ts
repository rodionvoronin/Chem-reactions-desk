/**
 * Прогоняет весь банк заданий через движок реакций.
 *
 * Смысл проверки — в том, что эталонные признаки заданий нигде не записаны
 * руками: они вычисляются из REACTION_TABLE. Значит, правка химии может тихо
 * сломать задачу (два кандидата вдруг стали неразличимы). Этот скрипт ловит
 * такие поломки: `npm run check:tasks`.
 */

import { REAGENT_MAP } from '../src/reactions'
import { TASKS, TOPICS } from '../src/game/bank'
import { observe, describeObservation, matchesTarget, separates, sameObservation } from '../src/game/engine'
import { FLAME_METALS } from '../src/components/FlameColorsPalette'
import { Task } from '../src/game/types'

const problems: string[] = []
const fail = (t: Task, msg: string) => problems.push(`${t.id}: ${msg}`)

/** Что ученик видит на каждом шаге эталонного хода — по этому и различают. */
function traceObservations(base: string[], steps: string[], isDry: boolean) {
  const acc = [...base]
  return steps.map((r) => {
    acc.push(r)
    return observe(acc, isDry)
  })
}

/** Различает ли эталонный ход два вещества хотя бы на одном шаге. */
function traceSeparates(a: string, b: string, steps: string[], isDry: boolean): boolean {
  const ta = traceObservations([a], steps, isDry)
  const tb = traceObservations([b], steps, isDry)
  return ta.some((o, i) => !sameObservation(o, tb[i]))
}

function traceText(base: string[], steps: string[], isDry: boolean): string {
  return traceObservations(base, steps, isDry).map(describeObservation).join(' → ')
}

const metalIds = new Set(FLAME_METALS.map((m) => m.id))
const topicIds = new Set(TOPICS.map((t) => t.id))
const seen = new Set<string>()

for (const task of TASKS) {
  if (seen.has(task.id)) fail(task, 'дублирующийся id')
  seen.add(task.id)
  if (!topicIds.has(task.topic)) fail(task, `неизвестная тема ${task.topic}`)
  if (task.hints.length === 0) fail(task, 'нет подсказок')
  if (task.solution.length > task.budget) fail(task, 'эталонный ход длиннее бюджета')

  const isDry = task.dry === true
  const known = (id: string) => id in REAGENT_MAP

  for (const id of [...task.hidden, ...(task.start ?? []), ...task.palette, ...task.solution]) {
    if (!known(id)) fail(task, `неизвестный реагент ${id}`)
  }
  for (const r of task.solution) {
    if (task.type !== 'flame' && !task.palette.includes(r)) fail(task, `${r} из эталона нет в палитре`)
  }

  if (task.type === 'flame') {
    if (!task.flameMetal || !metalIds.has(task.flameMetal)) fail(task, 'неизвестный металл пламени')
    if (task.answer[0] !== task.flameMetal) fail(task, 'эталон не совпадает с окраской пламени')
    for (const o of task.options ?? []) if (!metalIds.has(o)) fail(task, `неизвестный металл ${o}`)
    if (!(task.options ?? []).includes(task.answer[0])) fail(task, 'правильного варианта нет в списке')
    continue
  }

  if (task.type === 'achieve') {
    const base = task.start ?? []
    const final = observe([...base, ...task.solution], isDry)
    if (!matchesTarget(final, task.target!)) {
      fail(task, `эталонный ход не даёт цели: получилось «${describeObservation(final)}»`)
    }
    continue
  }

  if (task.type === 'distinguish') {
    const [a, b] = task.hidden
    if (task.hidden.length !== 2) fail(task, 'для «различи пару» нужно ровно два вещества')
    if (task.answer.join() !== task.hidden.join()) fail(task, 'эталон не совпадает с загаданной парой')
    const separators = task.palette.filter((r) => separates(a, b, r, isDry))
    if (separators.length === 0) fail(task, 'палитра не содержит различающего реагента — задача нерешаема')
    if (!separates(a, b, task.solution[0], isDry)) {
      fail(task, `эталонный реагент ${task.solution[0]} не различает пару`)
    }
    continue
  }

  // identify и dry: эталонный ход обязан отделять ответ от каждого дистрактора
  const answer = task.answer[0]
  if (!(task.options ?? []).includes(answer)) fail(task, 'правильного варианта нет в списке')
  if (task.hidden[0] !== answer) fail(task, 'загаданное вещество не совпадает с эталоном')
  for (const opt of task.options ?? []) {
    if (opt === answer) continue
    if (!known(opt)) { fail(task, `неизвестный вариант ${opt}`); continue }
    if (!traceSeparates(answer, opt, task.solution, isDry)) {
      fail(task, `дистрактор ${opt} неотличим от ответа эталонным ходом `
                + `(«${traceText([answer], task.solution, isDry)}»)`)
    }
  }
}

const byTopic = TOPICS.map((t) => `${t.title}: ${TASKS.filter((x) => x.topic === t.id).length}`)
console.log(`Задач в банке: ${TASKS.length}  (${byTopic.join(', ')})`)

if (problems.length > 0) {
  console.error(`\nПроблем: ${problems.length}`)
  for (const p of problems) console.error('  ✗ ' + p)
  process.exit(1)
}
console.log('Все задания решаются эталонным ходом.')
