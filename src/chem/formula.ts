// ── Разбор химических формул и уравнений ──────────────────────────────────────
//
// В таблице реакций уравнения хранятся строками вида
//   'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl'
// Для песочницы этого достаточно — она показывает строку как есть. Но заданиям
// ЕГЭ 8, 9, 29, 30 и 31 нужны продукты, ионы и степени окисления по отдельности,
// поэтому строку разбираем в структуру. Разбираем, а не дублируем данные руками:
// иначе при правке химии уравнение и его «машинная копия» разъедутся.

const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉'
const SUPERSCRIPTS = '⁰¹²³⁴⁵⁶⁷⁸⁹'

/** «Fe₂O₃» → «Fe2O3» */
export function toAsciiDigits(s: string): string {
  return s.replace(/[₀-₉]/g, (c) => String(SUBSCRIPTS.indexOf(c)))
}

/** «Fe2O3» → «Fe₂O₃» — обратное преобразование для показа ученику */
export function toSubscripts(s: string): string {
  return s.replace(/\d/g, (d) => SUBSCRIPTS[+d])
}

export interface ParsedFormula {
  /** Число атомов каждого элемента */
  counts: Record<string, number>
  /** Заряд иона: 0 для молекул, +2 для Fe²⁺, −2 для SO₄²⁻ */
  charge: number
}

/**
 * Отрезает от формулы верхний индекс заряда: «SO₄²⁻» → { body: 'SO₄', charge: -2 }.
 * Знак стоит после величины, как принято в химии; одиночный «⁺» значит +1.
 */
function splitCharge(formula: string): { body: string; charge: number } {
  // Перечисляем надстрочные цифры поимённо: в Юникоде ¹²³ лежат отдельно
  // от ⁰⁴⁵⁶⁷⁸⁹, поэтому диапазон [⁰-⁹] молча теряет заряды +1, +2 и +3
  const m = formula.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/)
  if (!m) return { body: formula, charge: 0 }
  const digits = m[1].replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => String(SUPERSCRIPTS.indexOf(c)))
  const size = digits === '' ? 1 : +digits
  return { body: formula.slice(0, formula.length - m[0].length), charge: m[2] === '⁺' ? size : -size }
}

/**
 * Разбирает формулу в число атомов по элементам. Понимает вложенные скобки
 * обоих видов — Ca(OH)₂ и Na[Al(OH)₄] — и кристаллогидраты через «·».
 * Возвращает null, если строка формулой не является.
 */
export function parseFormula(input: string): ParsedFormula | null {
  const { body, charge } = splitCharge(input.trim())
  const counts: Record<string, number> = {}
  let failed = false

  // Кристаллогидрат: CuSO₄·5H₂O — части складываются с учётом множителя
  for (const part of body.split('·')) {
    const m = part.match(/^(\d*)(.*)$/)
    const multiplier = m && m[1] ? +m[1] : 1
    const sub = parsePart(toAsciiDigits(m ? m[2] : part))
    if (!sub) { failed = true; break }
    for (const [el, n] of Object.entries(sub)) counts[el] = (counts[el] ?? 0) + n * multiplier
  }

  if (failed || Object.keys(counts).length === 0) return null
  return { counts, charge }
}

/** Рекурсивный спуск по формуле без заряда и уже в ASCII-цифрах. */
function parsePart(s: string): Record<string, number> | null {
  let i = 0
  const parse = (depth: number): Record<string, number> | null => {
    const acc: Record<string, number> = {}
    while (i < s.length) {
      const c = s[i]

      if (c === '(' || c === '[') {
        i++
        const inner = parse(depth + 1)
        if (!inner) return null
        const close = s[i]
        if (close !== ')' && close !== ']') return null
        i++
        const n = readNumber()
        for (const [el, k] of Object.entries(inner)) acc[el] = (acc[el] ?? 0) + k * n
        continue
      }

      if (c === ')' || c === ']') {
        if (depth === 0) return null
        return acc
      }

      if (/[A-Z]/.test(c)) {
        let el = c
        i++
        while (i < s.length && /[a-z]/.test(s[i])) { el += s[i]; i++ }
        const n = readNumber()
        acc[el] = (acc[el] ?? 0) + n
        continue
      }

      // Всё прочее — не формула: пробелы, кириллица, знаки состояния
      return null
    }
    return depth === 0 ? acc : null
  }

  const readNumber = (): number => {
    let digits = ''
    while (i < s.length && /\d/.test(s[i])) { digits += s[i]; i++ }
    return digits === '' ? 1 : +digits
  }

  const out = parse(0)
  return out && Object.keys(out).length > 0 ? out : null
}

// ── Уравнения ─────────────────────────────────────────────────────────────────

export type Phase = 'precipitate' | 'gas' | 'none'

export interface Term {
  coefficient: number
  /** Формула как в уравнении, без коэффициента и знаков ↓↑ */
  formula: string
  phase: Phase
}

export interface ParsedEquation {
  left: Term[]
  right: Term[]
  /** Уравнение записано в ионном виде (есть заряды) */
  ionic: boolean
}

/**
 * Убирает пояснения на русском: они всегда в скобках и всегда содержат
 * кириллицу, а в формулах кириллицы не бывает — признак надёжный.
 * Так отсекаются и «(конц)», и «(качественная реакция на Cl⁻)».
 */
export function stripNotes(description: string): string {
  // Хвостовое пояснение всегда отделено двумя пробелами и может содержать
  // вложенные скобки: «… + 3NaCl  (избыток NaOH — осадок Al(OH)₃ растворяется)».
  // По вложенности его не отрезать, зато по двойному пробелу — надёжно:
  // внутри формул его не бывает.
  const tail = description.search(/\s{2,}\(/)
  let out = tail >= 0 ? description.slice(0, tail) : description
  // Условия, приписанные прямо к формуле: H₂SO₄(конц, горяч)
  out = out.replace(/\([^()]*\)/g, (group) => (/[А-Яа-яЁё]/.test(group) ? '' : group))
  return out.replace(/;.*$/, '').trim()
}

function parseTerm(raw: string): Term | null {
  let s = raw.trim()
  if (s === '') return null

  let phase: Phase = 'none'
  if (s.includes('↓')) phase = 'precipitate'
  else if (s.includes('↑')) phase = 'gas'
  s = s.replace(/[↓↑]/g, '').trim()

  const m = s.match(/^(\d+)(.+)$/)
  const coefficient = m ? +m[1] : 1
  const formula = (m ? m[2] : s).trim()
  if (formula === '') return null
  return { coefficient, formula, phase }
}

/**
 * Разбирает описание реакции в структуру. Возвращает null для записей,
 * которые уравнениями не являются: «Cu + HCl — реакция не идёт»,
 * пассивация, подписи индикаторов.
 */
export function parseEquation(description: string): ParsedEquation | null {
  const body = stripNotes(description)
  if (!body.includes('→')) return null

  const [lhs, rhs] = body.split('→')
  const split = (side: string) => side.split('+').map(parseTerm)
  const left = split(lhs)
  const right = split(rhs)
  if (left.some((t) => t === null) || right.some((t) => t === null)) return null
  if (left.length === 0 || right.length === 0) return null

  const terms = [...left, ...right] as Term[]
  return {
    left: left as Term[],
    right: right as Term[],
    ionic: terms.some((t) => splitCharge(t.formula).charge !== 0),
  }
}

// ── Проверка баланса ──────────────────────────────────────────────────────────

export interface BalanceReport {
  balanced: boolean
  /** Элементы, которых не хватает: положительное — избыток слева */
  elementDiff: Record<string, number>
  chargeDiff: number
  /** Формулы, которые не удалось разобрать */
  unparsed: string[]
}

function sideTotals(terms: Term[]) {
  const counts: Record<string, number> = {}
  const unparsed: string[] = []
  let charge = 0
  for (const term of terms) {
    const parsed = parseFormula(term.formula)
    if (!parsed) { unparsed.push(term.formula); continue }
    charge += parsed.charge * term.coefficient
    for (const [el, n] of Object.entries(parsed.counts)) {
      counts[el] = (counts[el] ?? 0) + n * term.coefficient
    }
  }
  return { counts, charge, unparsed }
}

/**
 * Сверяет число атомов каждого элемента и суммарный заряд слева и справа.
 * Это и есть автоматическая проверка правильности уравнения: коэффициент,
 * поставленный неверно, всплывает сразу.
 */
export function checkBalance(equation: ParsedEquation): BalanceReport {
  const l = sideTotals(equation.left)
  const r = sideTotals(equation.right)
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
