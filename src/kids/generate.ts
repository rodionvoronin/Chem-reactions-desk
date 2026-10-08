// ── Вопросы, которые собираются из данных ─────────────────────────────────────
//
// Верный ответ здесь никогда не пишется руками: он считается из формулы или
// берётся из станции. Неверные варианты — типичные ошибки школьника: забыть
// коэффициент, забыть индекс, сложить вместо умножения.

import { QuizQuestion, CountItem, Game, CalcTask } from './types'
import { countsOf, splitCoefficient, mrOf, mrSteps, fractionOf, fmt, AR } from './molecule'
import { CARDS, elementOf } from './elements'
import { shuffle } from './kit'
import { plural } from '../plural'
import { ELEMENTS } from '../periodic'

/** Родительный падеж названий элементов — «атомов кислорода» */
export const GENITIVE: Record<string, string> = {
  H: 'водорода', O: 'кислорода', C: 'углерода', N: 'азота', Cl: 'хлора', S: 'серы',
  Al: 'алюминия', Fe: 'железа', Na: 'натрия', Ca: 'кальция', Cu: 'меди', Mg: 'магния', P: 'фосфора',
}

function numberOptions(answer: number, wrong: number[]): { options: { label: string }[]; answer: number } {
  const pool = [...new Set(wrong.filter((x) => x > 0 && x !== answer))]
  for (let d = 1; pool.length < 3; d++) {
    if (!pool.includes(answer + d)) pool.push(answer + d)
    if (pool.length < 3 && answer - d > 0 && !pool.includes(answer - d)) pool.push(answer - d)
  }
  const values = [answer, ...pool.slice(0, 3)].sort((a, b) => a - b)
  return { options: values.map((v) => ({ label: String(v) })), answer: values.indexOf(answer) }
}

export function countAnswer(item: CountItem): number {
  const { k, formula } = splitCoefficient(item.expr)
  return item.el ? k * (countsOf(formula)[item.el] ?? 0) : k
}

export function countQuestion(item: CountItem): QuizQuestion {
  const { k, formula } = splitCoefficient(item.expr)
  if (!item.el) {
    const atoms = Object.values(countsOf(formula)).reduce((a, b) => a + b, 0)
    const o = numberOptions(k, [atoms, k * atoms, k + 1])
    return {
      id: `count-${item.expr}`, emoji: '🧮',
      text: `Сколько молекул в записи ${item.expr}?`,
      ...o,
      note: `Число молекул показывает коэффициент — большая цифра перед формулой: ${k}.`,
    }
  }
  const n = countsOf(formula)[item.el] ?? 0
  const o = numberOptions(k * n, [n, k, k + n])
  const gen = GENITIVE[item.el] ?? item.el
  return {
    id: `count-${item.expr}-${item.el}`, emoji: '🧮',
    text: `Сколько атомов ${gen} в записи ${item.expr}?`,
    ...o,
    note: k === 1
      ? `Коэффициента нет — молекула одна. Индекс у ${item.el} — ${n}, значит, атомов ${gen} ${n}.`
      : `${k} ${plural(k, 'молекула', 'молекулы', 'молекул')}, в каждой ${n} ${plural(n, 'атом', 'атома', 'атомов')} ${gen}: ${k} · ${n} = ${k * n}.`,
  }
}

/**
 * Варианты для номера: верный знак и соседи по таблице — элементы с номером
 * на один-два больше или меньше. Ошибиться можно, только если не посмотреть
 * в таблицу внимательно, а не потому что варианты наугад.
 */
export function cipherOptions(symbol: string): string[] {
  const z = elementOf(symbol).z
  const near = [z - 1, z + 1, z - 2, z + 2, z + 3]
    .map((n) => ELEMENTS.find((e) => e.z === n)?.symbol)
    .filter((s): s is string => !!s)
  return [symbol, ...near.slice(0, 3)]
}

// ── Блиц ──────────────────────────────────────────────────────────────────────

export interface BlitzQuestion {
  text: string
  options: string[]
  answer: number
}

/** Быстрые вопросы из одной игры: короткие формулировки, не больше четырёх вариантов */
function fromGame(game: Game): BlitzQuestion[] {
  switch (game.kind) {
    case 'sort':
      // Карточки с цветным образцом в блиц не берём: без картинки их не решить
      return game.items.filter((it) => !it.swatch).map((it) => ({
        text: `${it.big ? it.big + ' — ' : ''}${it.label}`,
        options: game.bins.map((b) => b.title),
        answer: game.bins.findIndex((b) => b.id === it.bin),
      }))
    case 'quiz':
    case 'sim':
    case 'chart':
      return game.questions
        .filter((q) => q.options.length <= 4 && q.text.length <= 110)
        .map((q) => ({ text: q.text, options: q.options.map((o) => o.label), answer: q.answer }))
    case 'count':
      return game.items.map((it) => {
        const q = countQuestion(it)
        return { text: q.text, options: q.options.map((o) => o.label), answer: q.answer }
      })
    case 'match':
      // «Гвоздь — из чего?»: правильный ответ и три чужих правых карточки
      return game.pairs.map((p) => {
        const others = shuffle(game.pairs.filter((x) => x !== p)).slice(0, 3).map((x) => x.right)
        const opts = shuffle([p.right, ...others])
        return { text: `${p.left} → ?`, options: opts, answer: opts.indexOf(p.right) }
      })
    case 'odd':
      return game.rounds.map((r) => ({ text: 'Что здесь лишнее?', options: r.items.map((i) => i.label), answer: r.odd }))
        .filter((q, i, all) => all.findIndex((x) => x.options.join() === q.options.join()) === i)
        .map((q) => ({ ...q, text: `Что лишнее: ${q.options.join(', ')}?` }))
    case 'memory':
      return game.pool.map((s) => {
        const others = shuffle(game.pool.filter((x) => x !== s)).slice(0, 3)
        const opts = shuffle([s, ...others])
        return game.face === 'say'
          ? { text: `Как читается знак ${s}?`, options: opts.map((x) => CARDS.find((c) => c.symbol === x)!.say), answer: opts.indexOf(s) }
          : { text: `Какой элемент обозначают знаком ${s}?`, options: opts.map((x) => elementOf(x).name), answer: opts.indexOf(s) }
      })
    case 'truefalse':
      return game.statements.filter((s) => s.text.length <= 110).map((s) => ({
        text: `Верно ли: «${s.text}»?`, options: ['Верно', 'Неверно'], answer: s.truth ? 0 : 1,
      }))
    case 'jeopardy':
      return game.topics.flatMap((t) => t.questions)
        .filter((q) => q.options && typeof q.answer === 'number' && q.options.length <= 4 && q.text.length <= 110)
        .map((q) => ({ text: q.text, options: q.options!, answer: q.answer as number }))
    case 'cipher':
      return game.words.flatMap((w) => w.symbols).map((s) => {
        const opts = shuffle(cipherOptions(s))
        return { text: `Какой знак у элемента № ${elementOf(s).z}?`, options: opts, answer: opts.indexOf(s) }
      })
    case 'letters':
      // Подсказка — вопрос, слова той же игры — варианты ответа
      if (game.words.length < 3) return []
      return game.words.map((w) => {
        const opts = shuffle([w.word, ...shuffle(game.words.filter((x) => x !== w)).slice(0, 3).map((x) => x.word)])
        return { text: w.hint, options: opts, answer: opts.indexOf(w.word) }
      })
    default:
      return []
  }
}

/** Набор вопросов блица из игр уроков; повторы формулировок отбрасываются */
export function blitzPool(games: Game[]): BlitzQuestion[] {
  const seen = new Set<string>()
  const out: BlitzQuestion[] = []
  for (const g of games) {
    for (const q of fromGame(g)) {
      if (seen.has(q.text) || q.answer < 0) continue
      seen.add(q.text)
      out.push(q)
    }
  }
  return out
}

// ── Расчётные задачи ──────────────────────────────────────────────────────────

const SOLUTE_GEN: Record<string, string> = { соль: 'соли', сахар: 'сахара' }

export interface CalcView {
  prompt: string
  /** Что вводим: «Mr(H₂O) =», «ω(O) =» */
  lhs: string
  unit: string
  answer: number
  /** Принят ли ответ: долю можно дать округлённой до целого или с десятыми */
  accepts: (x: number) => boolean
  hint: string
  solution: string
}

export function calcView(task: CalcTask): CalcView {
  switch (task.type) {
    case 'mr':
      return {
        prompt: `Вычислите относительную молекулярную массу ${task.formula}`,
        lhs: `Mr(${task.formula}) =`, unit: '',
        answer: mrOf(task.formula), accepts: (x) => Math.abs(x - mrOf(task.formula)) < 0.01,
        hint: 'Сложите атомные массы всех атомов. Не забудьте умножить на индексы!',
        solution: `Mr(${task.formula}) = ${mrSteps(task.formula)}`,
      }
    case 'fraction': {
      const n = countsOf(task.formula)[task.el]
      const mr = mrOf(task.formula)
      const exact = fractionOf(task.formula, task.el)
      return {
        prompt: `Какова массовая доля ${GENITIVE[task.el] ?? task.el} в ${task.formula}? Округлите до целого процента.`,
        lhs: `ω(${task.el}) =`, unit: '%',
        answer: Math.round(exact),
        accepts: (x) => Math.round(x) === Math.round(exact) || Math.abs(x - exact) < 0.11,
        hint: `Сначала найдите Mr(${task.formula}) = ${mrSteps(task.formula)}. Потом разделите массу ${GENITIVE[task.el] ?? task.el} на Mr.`,
        solution: `ω(${task.el}) = ${n > 1 ? `${n} · ` : ''}${fmt(AR[task.el])} / ${fmt(mr)} · 100 % ≈ ${fmt(exact)} %`,
      }
    }
    case 'w-solution': {
      const total = task.mSolute + task.mWater
      const w = Math.round((task.mSolute / total) * 1000) / 10
      return {
        prompt: `В ${task.mWater} г воды растворили ${task.mSolute} г ${SOLUTE_GEN[task.solute]}. Какова массовая доля ${SOLUTE_GEN[task.solute]} в растворе?`,
        lhs: `ω(${SOLUTE_GEN[task.solute]}) =`, unit: '%',
        answer: w, accepts: (x) => Math.abs(x - w) < 0.01,
        hint: `Масса раствора — это вода и ${task.solute} вместе: ${task.mWater} + ${task.mSolute}.`,
        solution: `m(раствора) = ${task.mWater} + ${task.mSolute} = ${total} г; ω = ${task.mSolute} / ${total} · 100 % = ${fmt(w)} %`,
      }
    }
    case 'm-solute': {
      const m = (task.mSolution * task.percent) / 100
      return {
        prompt: `Нужно приготовить ${task.mSolution} г раствора, в котором ${task.percent} % ${SOLUTE_GEN[task.solute]}. Сколько граммов ${SOLUTE_GEN[task.solute]} взять?`,
        lhs: `m(${SOLUTE_GEN[task.solute]}) =`, unit: 'г',
        answer: m, accepts: (x) => Math.abs(x - m) < 0.01,
        hint: `${task.percent} % — это ${task.percent} сотых массы раствора.`,
        solution: `m(${SOLUTE_GEN[task.solute]}) = ${task.mSolution} · ${task.percent} / 100 = ${fmt(m)} г`,
      }
    }
    case 'm-water': {
      const m = (task.mSolution * task.percent) / 100
      return {
        prompt: `Нужно приготовить ${task.mSolution} г раствора, в котором ${task.percent} % ${SOLUTE_GEN[task.solute]}. Сколько граммов воды взять?`,
        lhs: 'm(воды) =', unit: 'г',
        answer: task.mSolution - m, accepts: (x) => Math.abs(x - (task.mSolution - m)) < 0.01,
        hint: `Сначала найдите, сколько нужно ${SOLUTE_GEN[task.solute]}, а остальное — вода.`,
        solution: `m(${SOLUTE_GEN[task.solute]}) = ${task.mSolution} · ${task.percent} / 100 = ${fmt(m)} г; m(воды) = ${task.mSolution} − ${fmt(m)} = ${fmt(task.mSolution - m)} г`,
      }
    }
  }
}
