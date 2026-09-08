// ── Проверка заданий ──────────────────────────────────────────────────────────
// Ни один эталонный признак здесь не записан руками: всё, что нужно проверяющему,
// считает движок реакций по загаданному веществу. Правишь химию в reactions.ts —
// задания подстраиваются сами.

import {
  matchReactions, getReactionDescription, getPrecipitateLabel, REAGENT_MAP,
} from '../reactions'
import { Action, Task, TargetEffect } from './types'

export interface Observation {
  liquidColor: string
  precipitateLabel: string
  gasFormula: string
}

export function observe(contents: string[], isDry = false): Observation {
  const e = matchReactions(contents, isDry)
  return {
    liquidColor: e.liquidColor ?? '',
    precipitateLabel: e.precipitate ? getPrecipitateLabel(e.precipitate.color) : '',
    gasFormula: e.gasInfo?.formula ?? '',
  }
}

/**
 * Цвет раствора в том виде, в каком он виден на светлом фоне пробирки:
 * полупрозрачная заливка накладывается на белое.
 */
function flatten(color: string): [number, number, number] {
  const m = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/)
  if (!m) return [255, 255, 255]
  const a = m[4] !== undefined ? +m[4] : 1
  return [+m[1] * a + 255 * (1 - a), +m[2] * a + 255 * (1 - a), +m[3] * a + 255 * (1 - a)]
}

/**
 * Порог, ниже которого два раствора для глаза одинаковы. Нужен, чтобы
 * доказательством не считалась разница в пару единиц RGB: ученик её не видит,
 * а значит и различить по ней вещества не может.
 */
const LOOKALIKE = 26

export function colorsLookAlike(a: string, b: string): boolean {
  const [r1, g1, b1] = flatten(a)
  const [r2, g2, b2] = flatten(b)
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2) < LOOKALIKE
}

/** Одинаковы ли наблюдения с точки зрения ученика, а не движка. */
export function sameObservation(a: Observation, b: Observation): boolean {
  return colorsLookAlike(a.liquidColor, b.liquidColor)
    && a.precipitateLabel === b.precipitateLabel
    && a.gasFormula === b.gasFormula
}

/** Человекочитаемое описание наблюдения — то же, что видит ученик в панели. */
export function describeObservation(o: Observation): string {
  const parts: string[] = []
  if (o.precipitateLabel) parts.push(o.precipitateLabel)
  if (o.gasFormula) parts.push(`выделение газа (${o.gasFormula})`)
  if (parts.length === 0 && o.liquidColor) parts.push('изменение окраски раствора')
  return parts.length > 0 ? parts.join(', ') : 'видимых изменений нет'
}

export function matchesTarget(o: Observation, t: TargetEffect): boolean {
  if (t.precipitateLabel !== undefined && o.precipitateLabel !== t.precipitateLabel) return false
  if (t.gasFormula !== undefined && o.gasFormula !== t.gasFormula) return false
  if (t.liquidColor !== undefined && o.liquidColor !== t.liquidColor) return false
  return true
}

export function describeTarget(t: TargetEffect): string {
  const parts: string[] = []
  if (t.precipitateLabel) parts.push(t.precipitateLabel)
  if (t.gasFormula) parts.push(`выделение газа ${t.gasFormula}`)
  if (t.liquidColor && parts.length === 0) parts.push('заданная окраска раствора')
  return parts.join(' и ')
}

/**
 * Даёт ли реагент разные признаки в двух пробирках.
 *
 * Важна не любая разница, а именно та, которую создал реагент. Растворы
 * Fe²⁺ и Fe³⁺ и без него разного цвета, поэтому BaCl₂, осаждающий в обеих
 * пробирках одинаковый белый BaSO₄, ничего не доказывает — хотя «наблюдения»
 * формально отличаются. Разницу в окраске засчитываем только тогда, когда до
 * реагента растворы выглядели одинаково.
 */
export function separates(a: string, b: string, reagent: string, isDry = false): boolean {
  const afterA = observe([a, reagent], isDry)
  const afterB = observe([b, reagent], isDry)
  if (afterA.precipitateLabel !== afterB.precipitateLabel) return true
  if (afterA.gasFormula !== afterB.gasFormula) return true
  return colorsLookAlike(observe([a], isDry).liquidColor, observe([b], isDry).liquidColor)
      && !colorsLookAlike(afterA.liquidColor, afterB.liquidColor)
}

export function distinguishingReagents(
  a: string, b: string, palette: string[], isDry = false,
): string[] {
  return palette.filter((r) => separates(a, b, r, isDry))
}

/**
 * Достаточность доказательства для T3. Угадать пару можно и монеткой, поэтому
 * ответ засчитывается, только если ученик реально применил реагент, дающий
 * в двух пробирках разные признаки.
 */
export function isProofSufficient(
  pair: string[], actions: Action[], isDry = false,
): boolean {
  if (pair.length < 2) return true
  const used = Array.from(new Set(actions.map((a) => a.reagentId)))
  return used.some((r) => separates(pair[0], pair[1], r, isDry))
}

/** Оптимальное число приливаний — длина эталонной последовательности. */
export function optimalSteps(task: Task): number {
  return task.solution.length
}

export function gradeStars(
  task: Task, spent: number, hintsUsed: number, correct: boolean,
): 0 | 1 | 2 | 3 {
  if (!correct) return 0
  if (spent <= optimalSteps(task) && hintsUsed === 0) return 3
  if (spent <= task.budget) return 2
  return 1
}

// ── Разбор после решения ──────────────────────────────────────────────────────

export interface TraceStep {
  reagentId: string
  observation: string
  equation: string
}

/**
 * Прогоняет последовательность реагентов по пробирке и возвращает, что видно
 * на каждом шаге. Используется и для эталонного хода, и для фактического —
 * в разборе они стоят рядом.
 */
export function trace(base: string[], reagents: string[], isDry = false): TraceStep[] {
  const steps: TraceStep[] = []
  const acc = [...base]
  for (const r of reagents) {
    acc.push(r)
    steps.push({
      reagentId: r,
      observation: describeObservation(observe(acc, isDry)),
      equation: getReactionDescription(acc, isDry) ?? '',
    })
  }
  return steps
}

export function reagentLabel(id: string): string {
  return REAGENT_MAP[id]?.label ?? id
}

// ── Проверка ответа ───────────────────────────────────────────────────────────

export interface Verdict {
  correct: boolean
  /** Почему не засчитано — показывается ученику вместо сухого «неверно» */
  reason: string
}

export interface AnswerInput {
  /** Выбранные варианты: для T3 — по пробирке, иначе один элемент */
  picked: string[]
  actions: Action[]
  /** Содержимое пробирок на момент ответа — нужно для T2 */
  tubeContents: string[][]
  /** Фактическая раскладка загаданных веществ по пробиркам */
  assignment: string[]
}

export function checkAnswer(task: Task, input: AnswerInput): Verdict {
  const isDry = task.dry === true

  if (task.type === 'achieve') {
    const target = task.target!
    const hit = input.tubeContents.some((c) => matchesTarget(observe(c, isDry), target))
    return hit
      ? { correct: true, reason: '' }
      : { correct: false, reason: `Ни в одной пробирке нет признака «${describeTarget(target)}».` }
  }

  if (task.type === 'distinguish') {
    const right = input.picked.length === input.assignment.length
      && input.picked.every((p, i) => p === input.assignment[i])
    if (!right) return { correct: false, reason: 'Вещества распределены по пробиркам неверно.' }
    if (!isProofSufficient(input.assignment, input.actions, isDry)) {
      return {
        correct: false,
        reason: 'Ответ угадан, но не доказан: выбранные реагенты дают в обеих '
              + 'пробирках одинаковый признак. Нужен реагент, который ведёт себя по-разному.',
      }
    }
    return { correct: true, reason: '' }
  }

  // identify, dry, flame — один правильный вариант
  const right = input.picked[0] === task.answer[0]
  return right ? { correct: true, reason: '' } : { correct: false, reason: 'Вещество определено неверно.' }
}
