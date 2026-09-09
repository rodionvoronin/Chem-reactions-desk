/**
 * Проверка семейств лабораторного журнала: `npm run check:families`.
 *
 * Журнал показывает «открыто 7 из 12», и эти числа обязаны сходиться: каждое
 * уравнение принадлежит ровно одному семейству, сумма по семействам равна
 * всей базе, пустых семейств нет. Иначе ученик увидит цель, которую нельзя
 * достичь, или потеряет реакцию, которую честно открыл.
 */

import { ALL_EQUATIONS } from '../src/reactions'
import {
  FAMILIES, FAMILY_EQUATIONS, FAMILY_OF, TIERS, tierGoal, tierReached,
} from '../src/game/families'

const problems: string[] = []

// ── Разбиение ────────────────────────────────────────────────────────────────
const classified = Object.keys(FAMILY_OF)
const missing = ALL_EQUATIONS.filter((e) => !FAMILY_OF[e])
if (missing.length > 0) {
  problems.push(`без семейства осталось ${missing.length}: ${missing.slice(0, 3).join(' | ')}`)
}

const total = FAMILIES.reduce((sum, f) => sum + FAMILY_EQUATIONS[f.id].length, 0)
if (total !== ALL_EQUATIONS.length) {
  problems.push(`сумма по семействам ${total}, а уравнений ${ALL_EQUATIONS.length}`)
}

const seen = new Set<string>()
for (const family of FAMILIES) {
  for (const equation of FAMILY_EQUATIONS[family.id]) {
    if (seen.has(equation)) problems.push(`уравнение попало в два семейства: ${equation}`)
    seen.add(equation)
  }
}

const ids = new Set(FAMILIES.map((f) => f.id))
if (ids.size !== FAMILIES.length) problems.push('совпадают идентификаторы семейств')

for (const family of FAMILIES) {
  const size = FAMILY_EQUATIONS[family.id].length
  if (size === 0) problems.push(`семейство «${family.title}» пустое — цель недостижима`)
}

// ── Ступени ──────────────────────────────────────────────────────────────────
for (const family of FAMILIES) {
  const size = FAMILY_EQUATIONS[family.id].length
  if (size === 0) continue

  // Пустой журнал: ступеней нет, цель есть
  if (tierReached(0, size) !== 0) problems.push(`${family.title}: ступень выдана за ноль открытий`)
  if (tierGoal(0, size) === null) problems.push(`${family.title}: у пустого семейства нет цели`)

  // Полный журнал: все ступени взяты, целей больше нет
  if (tierReached(size, size) !== TIERS.length) {
    problems.push(`${family.title}: при полном сборе взято ступеней ${tierReached(size, size)} из ${TIERS.length}`)
  }
  if (tierGoal(size, size) !== null) problems.push(`${family.title}: после полного сбора осталась цель`)

  // Ступени не убывают, а цель всегда достижима в пределах семейства
  let previous = 0
  for (let opened = 0; opened <= size; opened++) {
    const reached = tierReached(opened, size)
    if (reached < previous) problems.push(`${family.title}: ступень уменьшилась на ${opened} открытых`)
    previous = reached
    const goal = tierGoal(opened, size)
    if (goal && opened + goal.need > size) {
      problems.push(`${family.title}: цель требует ${opened + goal.need} при размере ${size}`)
    }
  }
}

console.log(`Семейств: ${FAMILIES.length}, уравнений разложено: ${classified.length}`)
for (const family of FAMILIES) {
  console.log(`  ${family.icon} ${family.title.padEnd(32)} ${String(FAMILY_EQUATIONS[family.id].length).padStart(4)}`)
}

if (problems.length > 0) {
  console.error(`\nПроблем: ${problems.length}`)
  for (const p of problems.slice(0, 20)) console.error('  ✗ ' + p)
  process.exit(1)
}
console.log('\nСемейства разбивают базу без потерь и пересечений.')
