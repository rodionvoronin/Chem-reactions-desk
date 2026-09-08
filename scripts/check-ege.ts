/**
 * Проверка генератора заданий ЕГЭ: `npm run check:ege`.
 *
 * Задания собираются из таблицы реакций автоматически, поэтому вопрос
 * не в том, красиво ли они выглядят, а в том, есть ли у них ровно один
 * верный ответ. Скрипт генерирует пачку заданий каждого номера и проверяет
 * это перебором — так же, как проверял бы придирчивый ученик.
 */

import { generateItem, seeded } from '../src/ege/generate'
import { EGE_TASKS, EgeItem } from '../src/ege/types'
import { SUBSTANCES, isExchange, isRedox, reactionOf, stepsFrom } from '../src/ege/graph'
import { renderIonic } from '../src/chem/ionic'

const PER_TASK = 40
const problems: string[] = []
const rnd = seeded(20260908)

const idByFormula = new Map<string, string>()
for (const s of Object.values(SUBSTANCES)) idByFormula.set(s.label, s.id)

function checkItem(item: EgeItem): string | null {
  if (item.kind === 'choose') {
    if (item.answer.length !== 2) return 'в ответе не два вещества'
    if (!item.answer.every((id) => item.options.includes(id))) return 'ответ не входит в перечень'
    if (new Set(item.options).size !== item.options.length) return 'вещество в перечне повторяется'

    if (item.task === 29 || item.task === 30) {
      const fits = (a: string, b: string): boolean => {
        const r = reactionOf(a, b)
        if (!r) return false
        if (item.task === 29) return isRedox(r)
        if (item.given) {
          return r.ionic.short !== null && renderIonic(r.ionic.short) === item.given
        }
        return isExchange(r) && r.ionic.short !== null
      }
      const matching: string[][] = []
      for (let i = 0; i < item.options.length; i++) {
        for (let j = i + 1; j < item.options.length; j++) {
          if (fits(item.options[i], item.options[j])) matching.push([item.options[i], item.options[j]])
        }
      }
      if (matching.length !== 1) {
        return `подходящих пар ${matching.length}, а должна быть одна `
             + `(${matching.map((p) => p.map((id) => SUBSTANCES[id].formula).join('+')).join(', ')})`
      }
      if (matching[0].sort().join() !== [...item.answer].sort().join()) return 'найденная пара не совпала с ответом'
    }

    if (item.task === 6) {
      // Подпись может содержать пробел: «H₂SO₄ (разб)»
      const target = item.prompt.match(/с (.+)\.$/)?.[1]
      const targetId = target ? idByFormula.get(target) : undefined
      if (!targetId) return 'не удалось определить вещество из условия'
      for (const id of item.answer) {
        if (!reactionOf(targetId, id)) return `${SUBSTANCES[id].formula} не реагирует с ${target}`
      }
      for (const id of item.options.filter((o) => !item.answer.includes(o))) {
        if (reactionOf(targetId, id)) return `дистрактор ${SUBSTANCES[id].formula} тоже реагирует с ${target}`
      }
    }
    return null
  }

  if (item.kind === 'chain') {
    if (item.chain.length !== 3) return 'в цепочке не три вещества'
    const ids = item.chain.map((f) => idByFormula.get(f))
    if (ids.some((id) => !id)) return 'вещество цепочки не опознано'
    const [a, b, c] = ids as string[]
    const fitsFirst = (id: string) => stepsFrom(a).some((t) => t.reagent === id && t.to === b)
    const fitsSecond = (id: string) => stepsFrom(b).some((t) => t.reagent === id && t.to === c)
    if (!fitsFirst(item.answer[0])) return 'X не даёт первого превращения'
    if (!fitsSecond(item.answer[1])) return 'Y не даёт второго превращения'
    for (const id of item.options) {
      if (id !== item.answer[0] && fitsFirst(id)) return `${SUBSTANCES[id].formula} тоже подходит на место X`
      if (id !== item.answer[1] && fitsSecond(id)) return `${SUBSTANCES[id].formula} тоже подходит на место Y`
    }
    return null
  }

  // match: 7 и 8
  if (item.left.length !== item.answer.length) return 'число строк и ответов не совпало'
  if (new Set(item.answer).size !== item.answer.length) return 'два вещества указывают на один вариант'
  if (item.right.length <= item.left.length) return 'вариантов справа должно быть больше'
  if (item.answer.some((i) => i < 0 || i >= item.right.length)) return 'ответ указывает за пределы списка'
  if (new Set(item.right).size !== item.right.length) return 'варианты справа повторяются'

  if (item.task === 7) {
    // Набор реагентов обязан подходить ровно одному веществу слева
    for (const [row, answerIndex] of item.answer.entries()) {
      const reagents = item.right[answerIndex].split(', ').map((f) => idByFormula.get(f))
      if (reagents.some((id) => !id)) return 'реагент не опознан'
      for (const [otherRow, formula] of item.left.entries()) {
        const otherId = idByFormula.get(formula)
        if (!otherId) return 'вещество не опознано'
        const all = (reagents as string[]).every((r) => reactionOf(otherId, r) !== null)
        if (all && otherRow !== row) {
          return `набор «${item.right[answerIndex]}» подходит и веществу ${formula}`
        }
        if (!all && otherRow === row) return `набор «${item.right[answerIndex]}» не подходит своему веществу`
      }
    }
  }
  return null
}

for (const task of EGE_TASKS) {
  let made = 0
  let failed = 0
  for (let i = 0; i < PER_TASK; i++) {
    const item = generateItem(task.number, rnd)
    if (!item) { failed++; continue }
    made++
    const problem = checkItem(item)
    if (problem) problems.push(`задание ${task.number}: ${problem}\n      ${item.prompt}`
      + (item.kind === 'choose' ? `\n      перечень: ${item.options.map((id) => SUBSTANCES[id].formula).join(', ')}` : ''))
  }
  console.log(`Задание ${String(task.number).padEnd(2)} — собрано ${made} из ${PER_TASK}`
    + (failed ? `, не удалось собрать ${failed}` : ''))
}

if (problems.length > 0) {
  console.error(`\nОшибок в заданиях: ${problems.length}`)
  for (const p of problems.slice(0, 20)) console.error('  ✗ ' + p)
  process.exit(1)
}
console.log('\nУ всех собранных заданий ровно один верный ответ.')
