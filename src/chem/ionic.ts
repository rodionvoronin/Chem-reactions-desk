// ── Ионные уравнения ──────────────────────────────────────────────────────────
//
// Задание 30 требует три записи одной реакции: молекулярную, полную ионную и
// сокращённую ионную. Задание 6 идёт обратным ходом: по сокращённому ионному
// уравнению нужно назвать вещества. И то и другое строится отсюда — из
// молекулярного уравнения, которое уже есть в таблице реакций.

import { ParsedEquation, Term, parseFormula } from './formula'
import { dissociates, ionsOf, Ion } from './substances'

export interface Species {
  /** Как показать: 'Na⁺', 'BaSO₄↓', 'H₂O' */
  label: string
  /** Формула без заряда и знаков состояния — по ней сверяют одинаковость */
  key: string
  charge: number
  coefficient: number
}

export interface IonicSides {
  left: Species[]
  right: Species[]
}

export interface IonicEquation {
  full: IonicSides
  /** Сокращённое ионное. null — если сокращать нечего: реакция не идёт */
  short: IonicSides | null
}

function marker(term: Term): string {
  return term.phase === 'precipitate' ? '↓' : term.phase === 'gas' ? '↑' : ''
}

function ionLabel(ion: Ion): string {
  return ion.label
}

/** Расписывает один член уравнения на ионы либо оставляет молекулой. */
function expand(term: Term): Species[] {
  const molecule: Species = {
    label: term.formula + marker(term),
    key: term.formula,
    charge: 0,
    coefficient: term.coefficient,
  }
  if (!dissociates(term.formula, term.phase !== 'none')) return [molecule]

  const comp = ionsOf(term.formula)
  if (!comp) return [molecule]
  return [
    {
      label: ionLabel(comp.cation),
      key: comp.cation.formula + '^' + comp.cation.charge,
      charge: comp.cation.charge,
      coefficient: term.coefficient * comp.cationCount,
    },
    {
      label: ionLabel(comp.anion),
      key: comp.anion.formula + '^' + comp.anion.charge,
      charge: comp.anion.charge,
      coefficient: term.coefficient * comp.anionCount,
    },
  ]
}

function merge(list: Species[]): Species[] {
  const out: Species[] = []
  for (const s of list) {
    const same = out.find((x) => x.key === s.key)
    if (same) same.coefficient += s.coefficient
    else out.push({ ...s })
  }
  return out
}

/**
 * Сокращает ионы-зрители: те, что стоят в одинаковом виде слева и справа.
 * Именно их вычёркивание и отличает полное ионное уравнение от сокращённого.
 */
function cancel(sides: IonicSides): IonicSides {
  const left = sides.left.map((s) => ({ ...s }))
  const right = sides.right.map((s) => ({ ...s }))
  for (const l of left) {
    const r = right.find((x) => x.key === l.key)
    if (!r) continue
    const common = Math.min(l.coefficient, r.coefficient)
    l.coefficient -= common
    r.coefficient -= common
  }
  return {
    left: left.filter((s) => s.coefficient > 0),
    right: right.filter((s) => s.coefficient > 0),
  }
}

/** Делит все коэффициенты на общий делитель: 2Ag⁺ + 2Cl⁻ → Ag⁺ + Cl⁻ */
function reduce(sides: IonicSides): IonicSides {
  const all = [...sides.left, ...sides.right].map((s) => s.coefficient)
  if (all.length === 0) return sides
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const g = all.reduce((acc, n) => gcd(acc, n))
  if (g <= 1) return sides
  const scale = (list: Species[]) => list.map((s) => ({ ...s, coefficient: s.coefficient / g }))
  return { left: scale(sides.left), right: scale(sides.right) }
}

export function toIonic(equation: ParsedEquation): IonicEquation {
  const full: IonicSides = {
    left: merge(equation.left.flatMap(expand)),
    right: merge(equation.right.flatMap(expand)),
  }
  const shortened = reduce(cancel(full))
  const nothingLeft = shortened.left.length === 0 || shortened.right.length === 0
  return { full, short: nothingLeft ? null : shortened }
}

// ── Отображение и проверка ────────────────────────────────────────────────────

export function renderSide(side: Species[]): string {
  return side
    .map((s) => (s.coefficient > 1 ? s.coefficient : '') + s.label)
    .join(' + ')
}

export function renderIonic(sides: IonicSides): string {
  return `${renderSide(sides.left)} → ${renderSide(sides.right)}`
}

export interface IonicBalance {
  balanced: boolean
  elementDiff: Record<string, number>
  chargeDiff: number
  unparsed: string[]
}

function sideTotals(side: Species[]) {
  const counts: Record<string, number> = {}
  const unparsed: string[] = []
  let charge = 0
  for (const s of side) {
    // key вида 'SO₄^-2' — берём часть до знака заряда
    const formula = s.key.split('^')[0]
    const parsed = parseFormula(formula)
    if (!parsed) { unparsed.push(formula); continue }
    charge += s.charge * s.coefficient
    for (const [el, n] of Object.entries(parsed.counts)) {
      counts[el] = (counts[el] ?? 0) + n * s.coefficient
    }
  }
  return { counts, charge, unparsed }
}

/** Ионное уравнение обязано сходиться и по атомам, и по заряду. */
export function checkIonicBalance(sides: IonicSides): IonicBalance {
  const l = sideTotals(sides.left)
  const r = sideTotals(sides.right)
  const elementDiff: Record<string, number> = {}
  for (const el of new Set([...Object.keys(l.counts), ...Object.keys(r.counts)])) {
    const diff = (l.counts[el] ?? 0) - (r.counts[el] ?? 0)
    if (diff !== 0) elementDiff[el] = diff
  }
  const unparsed = [...l.unparsed, ...r.unparsed]
  return {
    balanced: unparsed.length === 0 && Object.keys(elementDiff).length === 0 && l.charge === r.charge,
    elementDiff,
    chargeDiff: l.charge - r.charge,
    unparsed,
  }
}
