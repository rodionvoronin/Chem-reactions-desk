// ── Вещества: ионный состав, класс, растворимость ─────────────────────────────
//
// Нужно для заданий 6 и 30 (ионные уравнения), 7 и 8 (классы веществ).
// Ионный состав солей не разбирается из строки, а наоборот — порождается:
// для каждой пары «катион + анион» строится каноническая запись формулы, и
// формулы из таблицы реакций ищутся в этом справочнике. Так исключены
// разночтения вида Fe2(SO4)3 / Fe₂(SO₄)₃ и не нужен разбор скобок наугад.

import { toSubscripts } from './formula'

export interface Ion {
  /** Формула иона с индексами, без заряда: 'SO₄' */
  formula: string
  charge: number
  /** Как ион называется в ответе ученика */
  label: string
}

export const CATIONS: Ion[] = [
  { formula: 'H',            charge: 1, label: 'H⁺' },
  { formula: 'Li',           charge: 1, label: 'Li⁺' },
  { formula: 'Na',           charge: 1, label: 'Na⁺' },
  { formula: 'K',            charge: 1, label: 'K⁺' },
  { formula: 'NH₄',          charge: 1, label: 'NH₄⁺' },
  { formula: 'Ag',           charge: 1, label: 'Ag⁺' },
  { formula: 'Cu',           charge: 1, label: 'Cu⁺' },
  { formula: 'Mg',           charge: 2, label: 'Mg²⁺' },
  { formula: 'Ca',           charge: 2, label: 'Ca²⁺' },
  { formula: 'Sr',           charge: 2, label: 'Sr²⁺' },
  { formula: 'Ba',           charge: 2, label: 'Ba²⁺' },
  { formula: 'Zn',           charge: 2, label: 'Zn²⁺' },
  { formula: 'Cu',           charge: 2, label: 'Cu²⁺' },
  { formula: 'Fe',           charge: 2, label: 'Fe²⁺' },
  { formula: 'Mn',           charge: 2, label: 'Mn²⁺' },
  { formula: 'Ni',           charge: 2, label: 'Ni²⁺' },
  { formula: 'Co',           charge: 2, label: 'Co²⁺' },
  { formula: 'Pb',           charge: 2, label: 'Pb²⁺' },
  { formula: 'Cr',           charge: 2, label: 'Cr²⁺' },
  { formula: 'Al',           charge: 3, label: 'Al³⁺' },
  { formula: 'Cr',           charge: 3, label: 'Cr³⁺' },
  { formula: 'Fe',           charge: 3, label: 'Fe³⁺' },
  { formula: '[Cu(NH₃)₄]',   charge: 2, label: '[Cu(NH₃)₄]²⁺' },
  { formula: '[Zn(NH₃)₄]',   charge: 2, label: '[Zn(NH₃)₄]²⁺' },
  { formula: '[Ni(NH₃)₆]',   charge: 2, label: '[Ni(NH₃)₆]²⁺' },
  { formula: '[Ag(NH₃)₂]',   charge: 1, label: '[Ag(NH₃)₂]⁺' },
]

export const ANIONS: Ion[] = [
  { formula: 'OH',           charge: -1, label: 'OH⁻' },
  { formula: 'F',            charge: -1, label: 'F⁻' },
  { formula: 'Cl',           charge: -1, label: 'Cl⁻' },
  { formula: 'Br',           charge: -1, label: 'Br⁻' },
  { formula: 'I',            charge: -1, label: 'I⁻' },
  { formula: 'NO₃',          charge: -1, label: 'NO₃⁻' },
  { formula: 'NO₂',          charge: -1, label: 'NO₂⁻' },
  { formula: 'HCO₃',         charge: -1, label: 'HCO₃⁻' },
  { formula: 'HSO₄',         charge: -1, label: 'HSO₄⁻' },
  { formula: 'H₂PO₄',        charge: -1, label: 'H₂PO₄⁻' },
  { formula: 'H₂PO₂',        charge: -1, label: 'H₂PO₂⁻' },
  { formula: 'MnO₄',         charge: -1, label: 'MnO₄⁻' },
  { formula: 'ClO',          charge: -1, label: 'ClO⁻' },
  { formula: 'ClO₃',         charge: -1, label: 'ClO₃⁻' },
  { formula: 'BrO',          charge: -1, label: 'BrO⁻' },
  { formula: 'BrO₃',         charge: -1, label: 'BrO₃⁻' },
  { formula: 'IO',           charge: -1, label: 'IO⁻' },
  { formula: 'IO₃',          charge: -1, label: 'IO₃⁻' },
  { formula: 'AlO₂',         charge: -1, label: 'AlO₂⁻' },
  { formula: 'CrO₂',         charge: -1, label: 'CrO₂⁻' },
  { formula: 'FeO₂',         charge: -1, label: 'FeO₂⁻' },
  { formula: '[Al(OH)₄]',    charge: -1, label: '[Al(OH)₄]⁻' },
  { formula: '[Cr(OH)₄]',    charge: -1, label: '[Cr(OH)₄]⁻' },
  { formula: 'S',            charge: -2, label: 'S²⁻' },
  { formula: 'SO₄',          charge: -2, label: 'SO₄²⁻' },
  { formula: 'SO₃',          charge: -2, label: 'SO₃²⁻' },
  { formula: 'CO₃',          charge: -2, label: 'CO₃²⁻' },
  { formula: 'SiO₃',         charge: -2, label: 'SiO₃²⁻' },
  { formula: 'CrO₄',         charge: -2, label: 'CrO₄²⁻' },
  { formula: 'Cr₂O₇',        charge: -2, label: 'Cr₂O₇²⁻' },
  { formula: 'MnO₄',         charge: -2, label: 'MnO₄²⁻' },
  { formula: 'HPO₄',         charge: -2, label: 'HPO₄²⁻' },
  { formula: 'ZnO₂',         charge: -2, label: 'ZnO₂²⁻' },
  { formula: '[Zn(OH)₄]',    charge: -2, label: '[Zn(OH)₄]²⁻' },
  { formula: '[Pb(OH)₄]',    charge: -2, label: '[Pb(OH)₄]²⁻' },
  { formula: 'PO₄',          charge: -3, label: 'PO₄³⁻' },
]

/** Ацетат пишут не как все: CH₃COONa и (CH₃COO)₂Ca — анион идёт первым */
const ACETATE: Ion = { formula: 'CH₃COO', charge: -1, label: 'CH₃COO⁻' }

// ── Порождение канонической записи формулы ────────────────────────────────────

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/** Нужны ли скобки вокруг иона, если его больше одного: OH → (OH)₂, Cl → Cl₂ */
function needsBrackets(ion: Ion): boolean {
  if (ion.formula.startsWith('[')) return false
  // Многоатомный ион: больше одного заглавного символа
  return (ion.formula.match(/[A-Z]/g) ?? []).length > 1
}

function writePart(ion: Ion, count: number): string {
  if (count === 1) return ion.formula
  return needsBrackets(ion) ? `(${ion.formula})${toSubscripts(String(count))}` : ion.formula + toSubscripts(String(count))
}

export interface SaltComposition {
  cation: Ion
  anion: Ion
  cationCount: number
  anionCount: number
}

function composition(cation: Ion, anion: Ion): SaltComposition {
  const charge = Math.abs(anion.charge) * cation.charge / gcd(cation.charge, Math.abs(anion.charge))
  return {
    cation,
    anion,
    cationCount: charge / cation.charge,
    anionCount: charge / Math.abs(anion.charge),
  }
}

function canonicalFormula(comp: SaltComposition): string {
  if (comp.anion === ACETATE) {
    // CH₃COONa, но (CH₃COO)₂Ca
    return writePart(comp.anion, comp.anionCount) + writePart(comp.cation, comp.cationCount)
  }
  return writePart(comp.cation, comp.cationCount) + writePart(comp.anion, comp.anionCount)
}

/** Справочник «формула соли или основания → ионный состав» */
export const IONIC_COMPOUNDS: Record<string, SaltComposition> = (() => {
  const map: Record<string, SaltComposition> = {}
  for (const cation of CATIONS) {
    for (const anion of [...ANIONS, ACETATE]) {
      if (cation.formula === 'H' && anion.formula === 'OH') continue // это вода
      const comp = composition(cation, anion)
      const formula = canonicalFormula(comp)
      // Первое попадание выигрывает: MnO₄⁻ встречается раньше MnO₄²⁻,
      // а KMnO₄ — это именно перманганат
      if (!(formula in map)) map[formula] = comp
    }
  }
  return map
})()

// ── Растворимость ─────────────────────────────────────────────────────────────

export type Solubility = 'soluble' | 'slightly' | 'insoluble'

const ALKALI_METALS = ['Li', 'Na', 'K']
const ALKALINE_EARTH = ['Ca', 'Sr', 'Ba']

/**
 * Таблица растворимости в том виде, в каком её учат: не список из трёхсот
 * клеток, а правила с исключениями.
 */
export function solubility(comp: SaltComposition): Solubility {
  const c = comp.cation.formula
  const a = comp.anion.formula

  // Все соли щелочных металлов и аммония растворимы
  if (ALKALI_METALS.includes(c) || c === 'NH₄' || c === 'H') return 'soluble'
  // Комплексные катионы существуют только в растворе
  if (c.startsWith('[')) return 'soluble'
  // Нитраты и ацетаты растворимы все
  if (a === 'NO₃' || a === 'NO₂' || a === 'CH₃COO' || a === 'ClO₃' || a === 'HCO₃') return 'soluble'

  switch (a) {
    case 'OH':
      if (ALKALINE_EARTH.includes(c)) return c === 'Ca' ? 'slightly' : 'soluble'
      return 'insoluble'
    case 'Cl':
    case 'Br':
      if (c === 'Ag') return 'insoluble'
      if (c === 'Pb') return 'slightly'
      return 'soluble'
    case 'I':
      if (c === 'Ag' || c === 'Pb') return 'insoluble'
      return 'soluble'
    case 'F':
      if (ALKALINE_EARTH.includes(c) || c === 'Mg' || c === 'Pb') return 'insoluble'
      return 'soluble'
    case 'SO₄':
      if (c === 'Ba' || c === 'Sr' || c === 'Pb') return 'insoluble'
      if (c === 'Ca' || c === 'Ag') return 'slightly'
      return 'soluble'
    case 'S':
      if (ALKALINE_EARTH.includes(c)) return 'soluble'
      return 'insoluble'
    case 'CO₃':
    case 'SiO₃':
    case 'PO₄':
    case 'SO₃':
    case 'CrO₄':
      return 'insoluble'
    default:
      return 'soluble'
  }
}

// ── Классификация веществ ─────────────────────────────────────────────────────

export type SubstanceClass =
  | 'металл' | 'неметалл'
  | 'оксид основный' | 'оксид кислотный' | 'оксид амфотерный' | 'оксид несолеобразующий'
  | 'кислота' | 'щёлочь' | 'основание нерастворимое' | 'гидроксид амфотерный'
  | 'соль' | 'вода' | 'пероксид' | 'ион' | 'прочее'

const METALS = [
  'Li', 'Na', 'K', 'Rb', 'Cs', 'Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Al', 'Zn', 'Fe', 'Cu',
  'Ag', 'Cr', 'Mn', 'Ni', 'Co', 'Pb', 'Sn', 'Hg', 'Au', 'Pt',
]
const AMPHOTERIC = ['Al', 'Zn', 'Cr', 'Be', 'Pb', 'Sn']

/** Сильные кислоты — в ионных уравнениях расписываются на ионы */
export const STRONG_ACIDS = ['HCl', 'HBr', 'HI', 'HNO₃', 'H₂SO₄', 'HClO₄', 'HMnO₄']

/** Кислоты вообще: формула → основность */
export const ACIDS: Record<string, number> = {
  HF: 1, HCl: 1, HBr: 1, HI: 1, 'HNO₃': 1, 'HNO₂': 1, 'CH₃COOH': 1,
  'H₂S': 2, 'H₂SO₄': 2, 'H₂SO₃': 2, 'H₂CO₃': 2, 'H₂SiO₃': 2, 'H₂CrO₄': 2,
  'H₃PO₄': 3,
}

const NON_SALT_OXIDES = ['CO', 'NO', 'N₂O', 'SiO']
const PEROXIDES = ['H₂O₂', 'Na₂O₂', 'K₂O₂', 'BaO₂']
/** Оксиды металлов в высокой степени окисления ведут себя как кислотные */
const ACIDIC_METAL_OXIDES = ['CrO₃', 'Mn₂O₇', 'V₂O₅']
/** Оксиды, амфотерность которых не следует из списка амфотерных металлов */
const EXTRA_AMPHOTERIC_OXIDES = ['MnO₂']

/**
 * Определяет класс вещества по формуле. Нужно заданиям 7 и 8: там весь вопрос
 * в том, кто с кем реагирует, а это определяется классами.
 */
export function classify(formula: string): SubstanceClass {
  // Ион, а не вещество: в таблице так записаны сокращённые уравнения ОВР
  if (/[⁺⁻]$/.test(formula)) return 'ион'
  if (formula === 'H₂O') return 'вода'
  if (PEROXIDES.includes(formula)) return 'пероксид'
  if (formula in ACIDS) return 'кислота'

  const elements: string[] = formula.match(/[A-Z][a-z]?/g) ?? []
  const distinct = new Set(elements)

  // Простое вещество: один элемент
  if (distinct.size === 1) {
    const el = elements[0]
    return METALS.includes(el) ? 'металл' : 'неметалл'
  }

  // Оксид: элемент + кислород
  if (distinct.size === 2 && distinct.has('O') && !formula.includes('OH')) {
    if (NON_SALT_OXIDES.includes(formula)) return 'оксид несолеобразующий'
    if (ACIDIC_METAL_OXIDES.includes(formula)) return 'оксид кислотный'
    if (EXTRA_AMPHOTERIC_OXIDES.includes(formula)) return 'оксид амфотерный'
    const other = elements.find((e) => e !== 'O')!
    if (!METALS.includes(other)) return 'оксид кислотный'
    return AMPHOTERIC.includes(other) ? 'оксид амфотерный' : 'оксид основный'
  }

  const comp = IONIC_COMPOUNDS[formula]
  if (comp) {
    if (comp.anion.formula === 'OH') {
      if (AMPHOTERIC.includes(comp.cation.formula)) return 'гидроксид амфотерный'
      const sol = solubility(comp)
      return sol === 'insoluble' ? 'основание нерастворимое' : 'щёлочь'
    }
    return 'соль'
  }

  return 'прочее'
}

/**
 * Расписывается ли вещество на ионы в растворе. Это и есть главное правило
 * ионных уравнений: сильный электролит — на ионы, всё остальное — молекулой.
 */
export function dissociates(formula: string, isPrecipitateOrGas: boolean): boolean {
  if (isPrecipitateOrGas) return false
  if (formula === 'H₂O') return false
  if (STRONG_ACIDS.includes(formula)) return true
  if (formula in ACIDS) return false // слабые кислоты остаются молекулами

  const comp = IONIC_COMPOUNDS[formula]
  if (!comp) return false
  if (comp.anion.formula === 'OH') {
    // Щёлочи диссоциируют, нерастворимые и амфотерные гидроксиды — нет
    return !AMPHOTERIC.includes(comp.cation.formula) && solubility(comp) !== 'insoluble'
  }
  return solubility(comp) === 'soluble'
}

export function ionsOf(formula: string): SaltComposition | null {
  return IONIC_COMPOUNDS[formula] ?? null
}
