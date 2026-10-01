// ── Формулы для конструктора молекул ──────────────────────────────────────────
// Счёт атомов не пишется руками рядом с формулой, а берётся разбором формулы —
// тем же, что проверяет уравнения лаборатории.

import { parseFormula, toSubscripts } from '../chem/formula'
import { CARD_MAP } from './elements'

export type Counts = Record<string, number>

export function countsOf(formula: string): Counts {
  return parseFormula(formula)?.counts ?? {}
}

export function sameCounts(a: Counts, b: Counts): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const k of keys) if ((a[k] ?? 0) !== (b[k] ?? 0)) return false
  return true
}

/** Формула из набора атомов; порядок знаков — как в образце, остальные в конце */
export function formulaOf(counts: Counts, order: string[]): string {
  const els = [...order.filter((e) => counts[e]), ...Object.keys(counts).filter((e) => !order.includes(e) && counts[e])]
  return toSubscripts(els.map((e) => e + (counts[e] > 1 ? counts[e] : '')).join(''))
}

/** Порядок знаков в формуле: «CO₂» → ['C', 'O'] */
export function elementOrder(formula: string): string[] {
  return [...formula.matchAll(/[A-Z][a-z]?/g)].map((m) => m[0])
}

const NUMBERS = ['', '', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']

/** Как формулу читают вслух: H₂O — «аш-два-о» */
export function readFormula(formula: string): string {
  const counts = countsOf(formula)
  return elementOrder(formula)
    .map((e) => [CARD_MAP[e]?.say ?? e, NUMBERS[counts[e]] ?? String(counts[e])].filter(Boolean).join('-'))
    .join('-')
}

// ── Расчёты ───────────────────────────────────────────────────────────────────

/**
 * Относительные атомные массы, округлённые по-школьному: так их записывают
 * в тетради 8 класса. Хлор — единственное исключение, у него 35,5.
 */
export const AR: Record<string, number> = {
  H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, S: 32, Cl: 35.5,
  K: 39, Ca: 40, Fe: 56, Cu: 64, Zn: 65, P: 31, Si: 28,
}

/** Mr по формуле; NaN, если в формуле элемент без школьной массы */
export function mrOf(formula: string): number {
  const counts = countsOf(formula)
  let sum = 0
  for (const [el, n] of Object.entries(counts)) sum += (AR[el] ?? NaN) * n
  return Math.round(sum * 10) / 10
}

/** Запись расчёта Mr: «2 · 1 + 16 = 18» */
export function mrSteps(formula: string): string {
  const counts = countsOf(formula)
  const parts = elementOrder(formula)
    .filter((el, i, all) => all.indexOf(el) === i)
    .map((el) => (counts[el] > 1 ? `${counts[el]} · ${fmt(AR[el])}` : fmt(AR[el])))
  return `${parts.join(' + ')} = ${fmt(mrOf(formula))}`
}

/** Массовая доля элемента, %, с одним знаком после запятой */
export function fractionOf(formula: string, el: string): number {
  const n = countsOf(formula)[el] ?? 0
  return Math.round((n * AR[el] / mrOf(formula)) * 1000) / 10
}

/** Число по-русски: 58.5 → «58,5» */
export function fmt(n: number): string {
  return String(n).replace('.', ',')
}

/** Запись с коэффициентом: «3CO₂» → { k: 3, formula: 'CO₂' } */
export function splitCoefficient(expr: string): { k: number; formula: string } {
  const m = expr.match(/^(\d*)(.+)$/)!
  return { k: m[1] ? +m[1] : 1, formula: m[2] }
}

/** Уравнение без коэффициентов: «H₂ + O₂ → H₂O» → левые и правые формулы */
export function splitEquation(eq: string): { left: string[]; right: string[] } {
  const [l, r] = eq.split('→').map((side) => side.split('+').map((t) => t.trim()))
  return { left: l, right: r }
}

/** Сколько атомов каждого элемента на стороне уравнения при данных коэффициентах */
export function sideCounts(formulas: string[], coefs: number[]): Counts {
  const out: Counts = {}
  formulas.forEach((f, i) => {
    for (const [el, n] of Object.entries(countsOf(f))) out[el] = (out[el] ?? 0) + n * coefs[i]
  })
  return out
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a
}

export function gcdAll(nums: number[]): number {
  return nums.reduce((a, b) => gcd(a, b))
}

/** Наименьшие коэффициенты перебором — для проверки банка уравнений */
export function solveEquation(eq: string, max = 8): number[] | null {
  const { left, right } = splitEquation(eq)
  const n = left.length + right.length
  const coefs = new Array(n).fill(1)
  const total = Math.pow(max, n)
  for (let code = 0; code < total; code++) {
    let c = code
    for (let i = 0; i < n; i++) { coefs[i] = (c % max) + 1; c = Math.floor(c / max) }
    if (gcdAll(coefs) !== 1) continue
    if (sameCounts(sideCounts(left, coefs.slice(0, left.length)), sideCounts(right, coefs.slice(left.length)))) {
      return [...coefs]
    }
  }
  return null
}
