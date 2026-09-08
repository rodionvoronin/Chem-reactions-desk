/**
 * Аудит базы реакций: каждое уравнение разбирается и проверяется на баланс
 * атомов и зарядов. Запуск: `npm run check:equations`.
 *
 * Проверка нужна не ради красоты. На уравнениях базы строятся задания ЕГЭ 8,
 * 9, 29, 30 и 31: продукты, ионные уравнения и электронный баланс берутся
 * оттуда же. Неверный коэффициент — это не косметика, а неверный ответ
 * в тренажёре, поэтому база должна сходиться по атомам.
 */

import { REACTION_TABLE } from '../src/reactions'
import { parseEquation, checkBalance, stripNotes } from '../src/chem/formula'
import { toIonic, checkIonicBalance, renderIonic } from '../src/chem/ionic'
import { analyzeRedox, describeRedox } from '../src/chem/oxidation'
import { classify } from '../src/chem/substances'

interface Problem {
  description: string
  kind: 'не разобрано' | 'не сходится'
  detail: string
}

const problems: Problem[] = []
const seen = new Set<string>()

let equations = 0
let notEquations = 0
let balanced = 0
let ionic = 0

for (const rule of REACTION_TABLE) {
  const description = rule.description
  if (!description || seen.has(description)) continue
  seen.add(description)

  const parsed = parseEquation(description)
  if (!parsed) {
    // Записи вида «Cu + HCl — реакция не идёт» уравнениями не являются
    if (stripNotes(description).includes('→')) {
      problems.push({ description, kind: 'не разобрано', detail: 'есть стрелка, но разбор не удался' })
    } else {
      notEquations++
    }
    continue
  }

  equations++
  if (parsed.ionic) ionic++

  const report = checkBalance(parsed)
  if (report.balanced) { balanced++; continue }

  const bits: string[] = []
  if (report.unparsed.length > 0) bits.push('не разобраны формулы: ' + report.unparsed.join(', '))
  const diff = Object.entries(report.elementDiff)
    .map(([el, n]) => `${el}: ${n > 0 ? '+' : ''}${n}`)
  if (diff.length > 0) bits.push('расхождение по атомам — ' + diff.join(', '))
  if (report.chargeDiff !== 0) bits.push(`заряд слева больше на ${report.chargeDiff}`)
  problems.push({
    description,
    kind: report.unparsed.length > 0 ? 'не разобрано' : 'не сходится',
    detail: bits.join('; '),
  })
}

console.log(`Уникальных записей: ${seen.size}`)
console.log(`  уравнений: ${equations} (из них в ионном виде: ${ionic})`)
console.log(`  не уравнения (пассивация, «реакция не идёт», индикаторы): ${notEquations}`)
console.log(`  сходятся по атомам и зарядам: ${balanced}`)

// ── Ионные уравнения (задания 6 и 30) ───────────────────────────────────────
let shortIonic = 0
let ionicBroken = 0
for (const description of seen) {
  const parsed = parseEquation(description)
  if (!parsed || parsed.ionic) continue
  const result = toIonic(parsed)
  if (!result.short) continue
  shortIonic++
  const balance = checkIonicBalance(result.short)
  if (!balance.balanced) {
    ionicBroken++
    problems.push({
      description,
      kind: 'не сходится',
      detail: `сокращённое ионное не сходится: ${renderIonic(result.short)}`,
    })
  }
}
console.log(`\nСокращённых ионных уравнений построено: ${shortIonic}, из них сходятся: ${shortIonic - ionicBroken}`)

// ── Степени окисления (задание 29) ──────────────────────────────────────────
let annotated = 0
let redoxBroken = 0
let redoxCount = 0
const elementOf = (note: string, role: string): string | null =>
  note.match(new RegExp(role + ':\\s*\\d*([A-Z][a-z]?)'))?.[1] ?? null

for (const description of seen) {
  const parsed = parseEquation(description)
  if (!parsed) continue
  const analysis = analyzeRedox(parsed)
  if (analysis.isRedox && analysis.skipped.length === 0) redoxCount++

  if (!/Окислитель|Восстановитель/.test(description)) continue
  annotated++
  const note = description.match(/\(([^()]*(?:Окислитель|Восстановитель)[^()]*)\)/)?.[1] ?? ''
  const wantOxidizer = elementOf(note, 'Окислитель')
  const wantReducer = elementOf(note, 'Восстановитель')
  const okOxidizer = wantOxidizer === null || wantOxidizer === analysis.oxidizer?.element
  const okReducer = wantReducer === null || wantReducer === analysis.reducer?.element
  if (okOxidizer && okReducer) continue
  redoxBroken++
  problems.push({
    description,
    kind: 'не сходится',
    detail: `пометка ОВР расходится с расчётом: в базе «${note}», посчитано «${describeRedox(analysis)}»`,
  })
}
console.log(`Реакций распознано как ОВР: ${redoxCount}; пометок окислитель/восстановитель: ${annotated}, `
  + `совпали с расчётом: ${annotated - redoxBroken}`)

// ── Классы веществ (задания 7 и 8) ──────────────────────────────────────────
const formulas = new Set<string>()
for (const description of seen) {
  const parsed = parseEquation(description)
  if (!parsed) continue
  for (const term of [...parsed.left, ...parsed.right]) formulas.add(term.formula)
}
const unclassified = [...formulas].filter((f) => classify(f) === 'прочее')
console.log(`Различных формул: ${formulas.size}, класс не определён у ${unclassified.length}: `
  + unclassified.join(' '))

if (problems.length > 0) {
  console.log(`\nТребуют внимания: ${problems.length}`)
  for (const p of problems) {
    console.log(`  [${p.kind}] ${p.description}`)
    console.log(`      ${p.detail}`)
  }
  process.exit(1)
}
console.log('\nВся база сходится.')
