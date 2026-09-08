// ── Индекс реакций для заданий ЕГЭ ────────────────────────────────────────────
//
// Задания 6–9 и 29–31 оперируют не пробирками, а веществами на бумаге. Здесь
// таблица реакций пересобирается в удобный для этого вид: пара реагентов →
// разобранное уравнение, ионные формы и разбор ОВР. Всё считается один раз
// при загрузке модуля.

import { REACTION_TABLE, REAGENT_MAP, ReactionRule } from '../reactions'
import { ParsedEquation, parseEquation } from '../chem/formula'
import { IonicEquation, toIonic } from '../chem/ionic'
import { RedoxAnalysis, analyzeRedox } from '../chem/oxidation'
import { classify, SubstanceClass } from '../chem/substances'

/** Подпись реагента без уточнений: «H₂SO₄ (разб)» → «H₂SO₄» */
function labelFormula(label: string): string {
  return label.replace(/\s*\(.*\)$/, '').trim()
}

export interface Substance {
  id: string
  /** Формула для показа ученику */
  formula: string
  /** Как назван реагент в палитре: с уточнением концентрации */
  label: string
  class: SubstanceClass
}

export const SUBSTANCES: Record<string, Substance> = Object.fromEntries(
  Object.values(REAGENT_MAP)
    .filter((r) => r.id !== 'heat' && r.id !== 'phenolphthalein')
    .map((r) => [r.id, {
      id: r.id,
      formula: labelFormula(r.label),
      label: r.label,
      class: classify(labelFormula(r.label)),
    }]),
)

export interface Reaction {
  rule: ReactionRule
  /** Реагенты без служебного токена нагрева */
  reagents: string[]
  heated: boolean
  equation: ParsedEquation
  ionic: IonicEquation
  redox: RedoxAnalysis
  /** Молекулярное уравнение без пояснения */
  molecular: string
  /** Продукты как формулы */
  products: string[]
}

function build(): Reaction[] {
  const out: Reaction[] = []
  const seen = new Set<string>()
  for (const rule of REACTION_TABLE) {
    const equation = parseEquation(rule.description)
    if (!equation || equation.ionic) continue

    const heated = rule.inputs.includes('heat')
    const reagents = rule.inputs.filter((id) => id !== 'heat')
    // Пары одинаковых реагентов (избыток щёлочи) для бумажных заданий не нужны
    if (new Set(reagents).size !== reagents.length) continue
    if (reagents.some((id) => !(id in SUBSTANCES))) continue

    const key = [...reagents].sort().join('+') + (heated ? '/t' : '')
    if (seen.has(key)) continue
    seen.add(key)

    out.push({
      rule,
      reagents,
      heated,
      equation,
      ionic: toIonic(equation),
      redox: analyzeRedox(equation),
      molecular: rule.description.split('  (')[0].trim(),
      products: equation.right.map((t) => t.formula),
    })
  }
  return out
}

export const REACTIONS: Reaction[] = build()

/** Реакции ровно между двумя веществами — материал заданий 6, 29 и 30 */
export const PAIR_REACTIONS: Reaction[] = REACTIONS.filter((r) => r.reagents.length === 2)

// Реакция без нагревания важнее: если пара реагирует и на холоду, и при
// прокаливании, в задании должна стоять та, что идёт сама по себе
const pairIndex = new Map<string, Reaction>()
for (const reaction of [...PAIR_REACTIONS].sort((a, b) => Number(a.heated) - Number(b.heated))) {
  const key = [...reaction.reagents].sort().join('+')
  if (!pairIndex.has(key)) pairIndex.set(key, reaction)
}

/** Сколько парных реакций знает база про это вещество */
const coverage = new Map<string, number>()
for (const reaction of PAIR_REACTIONS) {
  for (const id of reaction.reagents) coverage.set(id, (coverage.get(id) ?? 0) + 1)
}

/**
 * Насколько хорошо вещество представлено в базе. Нужно для подбора
 * дистракторов: утверждение «эти вещества не реагируют» надёжно лишь тогда,
 * когда про оба вещества база знает много, — иначе это может быть не химия,
 * а пробел в таблице.
 */
export function reactionCount(id: string): number {
  return coverage.get(id) ?? 0
}

/** Идёт ли реакция между двумя веществами (по таблице) */
export function reactionOf(a: string, b: string): Reaction | null {
  return pairIndex.get([a, b].sort().join('+')) ?? null
}

export function isExchange(reaction: Reaction): boolean {
  return !reaction.redox.isRedox && reaction.redox.skipped.length === 0
}

export function isRedox(reaction: Reaction): boolean {
  return reaction.redox.isRedox && reaction.redox.skipped.length === 0
}

// ── Граф превращений для цепочек (задания 9 и 31) ────────────────────────────

const formulaToId = new Map<string, string>()
for (const substance of Object.values(SUBSTANCES)) {
  if (!formulaToId.has(substance.formula)) formulaToId.set(substance.formula, substance.id)
}

export function idOfFormula(formula: string): string | null {
  return formulaToId.get(formula) ?? null
}

export interface Transition {
  /** Исходное вещество цепочки */
  from: string
  /** Что к нему прилили */
  reagent: string
  /** Во что превратилось */
  to: string
  /** Элемент, который цепочка прослеживает: Cu в ряду Cu → CuSO₄ → Cu(OH)₂ */
  element: string
  reaction: Reaction
}

const METALS_ORDER = [
  'Na', 'K', 'Li', 'Ba', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Cu', 'Ag', 'Cr', 'Mn', 'Ni', 'Co', 'Pb',
]

/**
 * Элемент, за которым следят в цепочке. У соли или основания это металл,
 * у кислоты и неметалла — кислотообразующий элемент. Без него цепочка
 * уходит по побочному продукту: CuSO₄ + NaOH дал бы «переход» в Na₂SO₄.
 */
export function keyElement(formula: string): string | null {
  const elements: string[] = formula.match(/[A-Z][a-z]?/g) ?? []
  const metal = METALS_ORDER.find((m) => elements.includes(m))
  if (metal) return metal
  return elements.find((e) => e !== 'H' && e !== 'O') ?? null
}

/**
 * Переходы «вещество + реагент → вещество». Годятся только те реакции, где
 * продукт снова опознаётся как вещество из справочника: иначе цепочку
 * не продолжить.
 */
export const TRANSITIONS: Transition[] = (() => {
  const out: Transition[] = []
  for (const reaction of PAIR_REACTIONS) {
    for (const [i, from] of reaction.reagents.entries()) {
      const reagent = reaction.reagents[1 - i]
      const element = keyElement(SUBSTANCES[from].formula)
      if (!element) continue
      for (const product of reaction.products) {
        if (product === 'H₂O') continue
        const to = idOfFormula(product)
        // Продукт не должен совпадать с исходным веществом или реагентом
        if (!to || to === from || to === reagent) continue
        // Цепочка идёт по одному элементу: продукт обязан его содержать
        const inProduct: string[] = product.match(/[A-Z][a-z]?/g) ?? []
        if (!inProduct.includes(element)) continue
        out.push({ from, reagent, to, element, reaction })
      }
    }
  }
  return out
})()

const transitionsFrom = new Map<string, Transition[]>()
for (const t of TRANSITIONS) {
  if (!transitionsFrom.has(t.from)) transitionsFrom.set(t.from, [])
  transitionsFrom.get(t.from)!.push(t)
}

export function stepsFrom(id: string): Transition[] {
  return transitionsFrom.get(id) ?? []
}

/** Все вещества, с которыми данное вступает в реакцию — материал задания 7 */
const partnersOf = new Map<string, Set<string>>()
for (const reaction of PAIR_REACTIONS) {
  const [a, b] = reaction.reagents
  if (!partnersOf.has(a)) partnersOf.set(a, new Set())
  if (!partnersOf.has(b)) partnersOf.set(b, new Set())
  partnersOf.get(a)!.add(b)
  partnersOf.get(b)!.add(a)
}

export function reactsWith(id: string): Set<string> {
  return partnersOf.get(id) ?? new Set()
}
