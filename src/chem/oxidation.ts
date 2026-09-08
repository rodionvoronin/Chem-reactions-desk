// ── Степени окисления и электронный баланс ────────────────────────────────────
//
// Задание 29 требует не просто уравнение, а электронный баланс с указанием
// окислителя и восстановителя. Считаем степени окисления по обычным школьным
// правилам и сравниваем их слева и справа — так реакция сама сообщает,
// окислительно-восстановительная она или обменная.

import { ParsedEquation, parseFormula } from './formula'
import { ionsOf } from './substances'

/** Элементы с постоянной степенью окисления в соединениях */
const FIXED: Record<string, number> = {
  F: -1,
  Li: 1, Na: 1, K: 1, Rb: 1, Cs: 1, Ag: 1,
  Be: 2, Mg: 2, Ca: 2, Sr: 2, Ba: 2, Zn: 2,
  Al: 3,
}

const METALS_FOR_HYDRIDES = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Ca', 'Sr', 'Ba', 'Mg']
const PEROXIDES = ['H₂O₂', 'Na₂O₂', 'K₂O₂', 'BaO₂']

/**
 * Степени окисления элементов в частице. Возвращает null, если однозначно
 * посчитать нельзя — например, у углерода в органике или когда неизвестных
 * элементов больше одного.
 */
export function oxidationStates(formula: string, charge = 0): Record<string, number> | null {
  const parsed = parseFormula(formula)
  if (!parsed) return null
  const counts = parsed.counts
  const elements = Object.keys(counts)
  const total = charge || parsed.charge

  // Один элемент: у простого вещества степень нулевая, а у одноатомного иона
  // она равна его заряду — Fe²⁺ это Fe⁺², а не Fe⁰
  if (elements.length === 1) return { [elements[0]]: total / counts[elements[0]] }

  const known: Record<string, number> = {}
  const unknown: string[] = []

  for (const el of elements) {
    if (el in FIXED) { known[el] = FIXED[el]; continue }
    if (el === 'O') { known[el] = PEROXIDES.includes(formula) ? -1 : -2; continue }
    if (el === 'H') {
      // Гидрид металла: NaH, CaH₂ — водород принимает электрон
      known[el] = elements.some((e) => METALS_FOR_HYDRIDES.includes(e)) && elements.length === 2 ? -1 : 1
      continue
    }
    unknown.push(el)
  }

  if (unknown.length === 0) return known
  if (unknown.length > 1) return null

  const sum = Object.entries(known).reduce((acc, [el, n]) => acc + n * counts[el], 0)
  const el = unknown[0]
  const value = (total - sum) / counts[el]
  return { ...known, [el]: value }
}

/**
 * Степени окисления для вещества целиком: соли сначала разбиваются на ионы,
 * иначе для K₂Cr₂O₇ пришлось бы решать уравнение с двумя неизвестными.
 */
export function statesOfSubstance(formula: string): Record<string, number> | null {
  const direct = oxidationStates(formula)
  if (direct) return direct

  const comp = ionsOf(formula)
  if (!comp) return null
  const cation = oxidationStates(comp.cation.formula, comp.cation.charge)
  const anion = oxidationStates(comp.anion.formula, comp.anion.charge)
  if (!cation || !anion) return null
  return { ...cation, ...anion }
}

// ── Разбор ОВР ────────────────────────────────────────────────────────────────

export interface ElementChange {
  element: string
  from: number
  to: number
  /** Сколько электронов отдаёт (>0) или принимает (<0) один атом */
  electrons: number
}

export interface RedoxAnalysis {
  isRedox: boolean
  /** Кто принимает электроны */
  oxidizer: ElementChange | null
  /** Кто отдаёт электроны */
  reducer: ElementChange | null
  /** Элементы, для которых степень посчитать не удалось */
  skipped: string[]
}

function statesOnSide(terms: ParsedEquation['left']): { states: Map<string, Set<number>>; skipped: string[] } {
  const states = new Map<string, Set<number>>()
  const skipped: string[] = []
  for (const term of terms) {
    const s = statesOfSubstance(term.formula)
    if (!s) { skipped.push(term.formula); continue }
    for (const [el, value] of Object.entries(s)) {
      if (!states.has(el)) states.set(el, new Set())
      states.get(el)!.add(value)
    }
  }
  return { states, skipped }
}

/**
 * Ищет элементы, у которых степень окисления изменилась. Для школьных реакций
 * этого достаточно: окислитель понижает свою степень, восстановитель повышает.
 */
export function analyzeRedox(equation: ParsedEquation): RedoxAnalysis {
  const left = statesOnSide(equation.left)
  const right = statesOnSide(equation.right)
  const skipped = [...new Set([...left.skipped, ...right.skipped])]

  let oxidizer: ElementChange | null = null
  let reducer: ElementChange | null = null

  const nearest = (value: number, options: number[]): number =>
    options.reduce((best, o) => (Math.abs(o - value) < Math.abs(best - value) ? o : best), options[0])

  for (const [el, before] of left.states) {
    const after = right.states.get(el)
    if (!after) continue
    const dropped = [...before].filter((b) => !after.has(b))
    const gained = [...after].filter((a) => !before.has(a))
    if (dropped.length === 0 && gained.length === 0) continue

    // Один элемент может стоять сразу в нескольких веществах: кислород в H₂O₂
    // и в щёлочи, хлор в KCl и в Cl₂. Поэтому сопоставляем исчезнувшие
    // степени с появившимися по близости — это же корректно разбирает
    // и диспропорционирование, где из одной степени получаются две.
    const pairs: Array<[number, number]> = []
    for (const b of dropped) {
      if (after.size > 0) pairs.push([b, nearest(b, [...after])])
    }
    for (const a of gained) {
      if (!pairs.some(([, to]) => to === a) && before.size > 0) pairs.push([nearest(a, [...before]), a])
    }

    for (const [from, to] of pairs) {
      if (to > from && (reducer === null || to - from > reducer.electrons)) {
        reducer = { element: el, from, to, electrons: to - from }
      }
      if (to < from && (oxidizer === null || from - to > -oxidizer.electrons)) {
        oxidizer = { element: el, from, to, electrons: to - from }
      }
    }
  }

  return { isRedox: oxidizer !== null || reducer !== null, oxidizer, reducer, skipped }
}

/** «Mn⁺⁷ → Mn⁺²» — как это записывают в электронном балансе */
const SUPER_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹'

export function formatState(element: string, state: number): string {
  const sign = state > 0 ? '⁺' : state < 0 ? '⁻' : ''
  const digits = String(Math.abs(state)).replace(/\d/g, (d) => SUPER_DIGITS[+d])
  return state === 0 ? `${element}⁰` : `${element}${digits}${sign}`
}

export function describeRedox(analysis: RedoxAnalysis): string {
  const parts: string[] = []
  if (analysis.oxidizer) {
    const o = analysis.oxidizer
    parts.push(`Окислитель: ${formatState(o.element, o.from)} → ${formatState(o.element, o.to)}`)
  }
  if (analysis.reducer) {
    const r = analysis.reducer
    parts.push(`Восстановитель: ${formatState(r.element, r.from)} → ${formatState(r.element, r.to)}`)
  }
  return parts.join(', ')
}
