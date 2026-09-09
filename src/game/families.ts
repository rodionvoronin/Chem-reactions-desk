// ── Семейства реакций для лабораторного журнала ───────────────────────────────
//
// Журнал из счётчика превращается в коллекцию: все уравнения разложены по
// семействам, и у каждого видно «открыто 7 из 12». Принадлежность семейству
// не размечается руками, а вычисляется из самой реакции — по её признакам,
// продуктам и степеням окисления. Правишь химию — группы пересобираются сами.

import { REACTION_TABLE, ReactionRule, ALL_EQUATIONS } from '../reactions'
import { ParsedEquation, parseEquation } from '../chem/formula'
import { analyzeRedox, RedoxAnalysis } from '../chem/oxidation'
import { ionsOf } from '../chem/substances'

export interface FamilyContext {
  rule: ReactionRule
  equation: ParsedEquation | null
  redox: RedoxAnalysis | null
  /** Формулы продуктов */
  products: string[]
  /** Формулы того, что выпало в осадок — по знаку ↓ в уравнении */
  precipitates: string[]
  /** Цвет раствора, если он различим глазом */
  visibleColor: boolean
  description: string
}

export interface Family {
  id: string
  title: string
  /** Чему учит семейство — подпись под названием */
  subtitle: string
  color: string
  icon: string
  match: (c: FamilyContext) => boolean
}

const has = (products: string[], test: (f: string) => boolean) => products.some(test)

/**
 * Серый rgba(200,200,200, …) в таблице означает «раствор остался бесцветным»
 * — это служебная заливка, а не признак реакции. Настоящей окраской считаем
 * любой другой цвет.
 */
function hasVisibleColor(color: string | undefined): boolean {
  if (!color) return false
  return !color.startsWith('rgba(200,200,200')
}

/** Анион выпавшего осадка: по нему и различают группы качественного анализа */
function precipitateAnion(c: FamilyContext): string | null {
  for (const formula of c.precipitates) {
    const anion = ionsOf(formula)?.anion.formula
    if (anion) return anion
  }
  return null
}

const precipitateCation = (c: FamilyContext): string | null => {
  for (const formula of c.precipitates) {
    const cation = ionsOf(formula)?.cation.formula
    if (cation) return cation
  }
  return null
}

/** Гидроксо-комплексы и метаформы — след амфотерности */
const AMPHOTERIC_PRODUCT = /\[(?:Al|Zn|Cr|Pb|Be|Sn)\(OH\)|AlO₂|CrO₂|ZnO₂|PbO₂|FeO₂/
const AMMONIA_COMPLEX = /\[[A-Za-z]+\(NH₃\)/
const COMMON_GASES = ['CO₂', 'SO₂', 'H₂', 'O₂', 'NH₃', 'H₂S', 'NO', 'NO₂', 'Cl₂', 'N₂', 'N₂O', 'PH₃']

/**
 * Порядок важен: реакция попадает в первое подошедшее семейство, поэтому
 * сверху стоят самые узнаваемые признаки, а общие типы — ниже.
 */
export const FAMILIES: Family[] = [
  {
    id: 'indicators',
    title: 'Индикаторы',
    subtitle: 'Как узнать среду, не приливая реактивов',
    color: '#E91E8C', icon: '🎨',
    match: (c) => /индикатор/i.test(c.description),
  },
  {
    id: 'no-reaction',
    title: 'Реакция не идёт',
    subtitle: 'Знать, что не реагирует, — половина анализа',
    color: '#90A4AE', icon: '⊘',
    match: (c) => c.equation === null,
  },
  {
    id: 'ammonia',
    title: 'Аммиачные комплексы',
    subtitle: 'Осадок растворяется в избытке аммиака',
    color: '#5C6BC0', icon: '💠',
    match: (c) => has(c.products, (f) => AMMONIA_COMPLEX.test(f)),
  },
  {
    id: 'amphoteric',
    title: 'Амфотерность',
    subtitle: 'Осадок растворяется в избытке щёлочи',
    color: '#26A69A', icon: '⇄',
    match: (c) => has(c.products, (f) => AMPHOTERIC_PRODUCT.test(f)),
  },
  {
    id: 'decomposition',
    title: 'Разложение при нагревании',
    subtitle: 'Что остаётся после прокаливания',
    color: '#EF6C00', icon: '🔥',
    match: (c) => c.rule.inputs.includes('heat')
      && c.rule.inputs.filter((id) => id !== 'heat').length === 1,
  },
  {
    id: 'hydroxides',
    title: 'Осадки гидроксидов',
    subtitle: 'Цвет осадка выдаёт катион',
    color: '#42A5F5', icon: '🔵',
    match: (c) => c.rule.effects.precipitate !== undefined
      && has(c.products, (f) => f.includes('OH') && !f.startsWith('[')),
  },
  {
    id: 'halides',
    title: 'Галогениды серебра и свинца',
    subtitle: 'Классическая проба на хлорид, бромид и иодид',
    color: '#78909C', icon: '⚪',
    match: (c) => ['Cl', 'Br', 'I'].includes(precipitateAnion(c) ?? '')
      && ['Ag', 'Pb'].includes(precipitateCation(c) ?? ''),
  },
  {
    id: 'sulfates',
    title: 'Сульфаты',
    subtitle: 'Белый BaSO₄ — проба на сульфат-ион',
    color: '#B0BEC5', icon: '⬜',
    match: (c) => precipitateAnion(c) === 'SO₄',
  },
  {
    id: 'carbonates',
    title: 'Карбонаты',
    subtitle: 'Осаждаются почти со всеми катионами',
    color: '#A1887F', icon: '🪨',
    match: (c) => precipitateAnion(c) === 'CO₃',
  },
  {
    id: 'sulfides',
    title: 'Сульфиды',
    subtitle: 'Цвет сульфида — отдельная примета катиона',
    color: '#455A64', icon: '⬛',
    match: (c) => precipitateAnion(c) === 'S',
  },
  {
    id: 'phosphates',
    title: 'Фосфаты и силикаты',
    subtitle: 'Осадки, растворимые в кислотах',
    color: '#9575CD', icon: '🔶',
    match: (c) => ['PO₄', 'SiO₃'].includes(precipitateAnion(c) ?? ''),
  },
  {
    id: 'other-precipitates',
    title: 'Прочие осадки',
    subtitle: 'Хроматы, оксиды, свободная сера',
    color: '#7E57C2', icon: '🔻',
    match: (c) => c.rule.effects.precipitate !== undefined,
  },
  {
    id: 'gases',
    title: 'Газы',
    subtitle: 'Реакции, в которых что-то улетает',
    color: '#66BB6A', icon: '🫧',
    match: (c) => c.rule.effects.gas === true || has(c.products, (f) => COMMON_GASES.includes(f)),
  },
  {
    id: 'redox',
    title: 'Окислительно-восстановительные',
    subtitle: 'Степени окисления меняются — материал задания 29',
    color: '#EC407A', icon: '⚡',
    match: (c) => c.redox?.isRedox === true,
  },
  {
    id: 'color',
    title: 'Окраска раствора',
    subtitle: 'Переходы, которые видно по цвету',
    color: '#FFA726', icon: '🌈',
    match: (c) => c.visibleColor,
  },
  {
    id: 'exchange',
    title: 'Обмен без внешнего признака',
    subtitle: 'Идёт, но глазом не увидеть',
    color: '#8D6E63', icon: '↔',
    match: () => true,
  },
]

export const FAMILY_MAP: Record<string, Family> = Object.fromEntries(
  FAMILIES.map((f) => [f.id, f]),
)

// ── Раскладка всех уравнений по семействам ───────────────────────────────────

function contextOf(rule: ReactionRule): FamilyContext {
  const equation = parseEquation(rule.description)
  return {
    rule,
    equation,
    redox: equation ? analyzeRedox(equation) : null,
    products: equation ? equation.right.map((t) => t.formula) : [],
    precipitates: equation
      ? equation.right.filter((t) => t.phase === 'precipitate').map((t) => t.formula)
      : [],
    visibleColor: hasVisibleColor(rule.effects.liquidColor),
    description: rule.description,
  }
}

/** Первое правило для каждого уравнения: по нему и определяется семейство */
const ruleByEquation = new Map<string, ReactionRule>()
for (const rule of REACTION_TABLE) {
  if (rule.description && !ruleByEquation.has(rule.description)) {
    ruleByEquation.set(rule.description, rule)
  }
}

export const FAMILY_OF: Record<string, string> = (() => {
  const out: Record<string, string> = {}
  for (const equation of ALL_EQUATIONS) {
    const rule = ruleByEquation.get(equation)
    if (!rule) continue
    const context = contextOf(rule)
    out[equation] = (FAMILIES.find((f) => f.match(context)) ?? FAMILIES[FAMILIES.length - 1]).id
  }
  return out
})()

export const FAMILY_EQUATIONS: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = Object.fromEntries(FAMILIES.map((f) => [f.id, []]))
  for (const [equation, familyId] of Object.entries(FAMILY_OF)) out[familyId].push(equation)
  return out
})()

// ── Ступени внутри семейства ─────────────────────────────────────────────────

export interface Tier {
  label: string
  /** Доля семейства, которую нужно открыть */
  share: number
  color: string
}

/**
 * Ступени вместо одной далёкой цели: у семейства из ста уравнений «открыть всё»
 * недостижимо, а «открыть четверть» — задача на один урок.
 */
export const TIERS: Tier[] = [
  { label: 'Знакомство', share: 0.25, color: '#CD7F32' },
  { label: 'Уверенно',   share: 0.6,  color: '#78909C' },
  { label: 'Полностью',  share: 1,    color: '#FFB300' },
]

export function tierReached(found: number, total: number): number {
  if (total === 0) return 0
  let reached = 0
  for (const [i, tier] of TIERS.entries()) {
    if (found >= Math.ceil(total * tier.share)) reached = i + 1
  }
  return reached
}

export function tierGoal(found: number, total: number): { tier: Tier; need: number } | null {
  for (const tier of TIERS) {
    const target = Math.ceil(total * tier.share)
    if (found < target) return { tier, need: target - found }
  }
  return null
}
