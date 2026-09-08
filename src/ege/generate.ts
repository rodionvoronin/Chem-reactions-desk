// ── Генератор заданий ЕГЭ из базы реакций ─────────────────────────────────────
//
// Условия не хранятся списком, а собираются из таблицы реакций. Отсюда главное
// требование к генератору: перечень веществ должен допускать ровно один верный
// ответ. Поэтому каждый набор дистракторов проверяется перебором всех пар —
// если подходит вторая пара, набор отбрасывается.

import { renderIonic } from '../chem/ionic'
import { describeRedox, formatState } from '../chem/oxidation'
import {
  PAIR_REACTIONS, Reaction, SUBSTANCES, TRANSITIONS, reactionCount,
  isExchange, isRedox, reactionOf, stepsFrom,
} from './graph'
import { ChainItem, ChooseItem, DebriefBlock, EgeItem, EgeNumber, MatchItem } from './types'

// ── Случайность ───────────────────────────────────────────────────────────────

export type Random = () => number

/** Генератор с seed — чтобы проверочный скрипт получал те же задания */
export function seeded(seed: number): Random {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(list: T[], rnd: Random): T {
  return list[Math.floor(rnd() * list.length)]
}

function shuffle<T>(list: T[], rnd: Random): T[] {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const ALL_IDS = Object.keys(SUBSTANCES)

/**
 * Сколько реакций должно быть известно про вещество, чтобы брать его
 * в дистракторы. Про хорошо изученное веществo база знает многое, поэтому
 * отсутствие реакции у него — скорее химия, чем пробел в таблице.
 */
const WELL_COVERED = 6

function distractorPool(exclude: string[], rnd: Random): string[] {
  const candidates = ALL_IDS.filter((id) => !exclude.includes(id))
  const covered = candidates.filter((id) => reactionCount(id) >= WELL_COVERED)
  return shuffle(covered.length >= 6 ? covered : candidates, rnd)
}

/**
 * Как вещество названо в задании. Берём подпись с уточнением концентрации:
 * разбавленная и концентрированная H₂SO₄ ведут себя по-разному, и без
 * пометки два разных вещества в перечне выглядели бы одинаково.
 */
function formula(id: string): string {
  return SUBSTANCES[id]?.label ?? id
}

/**
 * Добирает дистракторы так, чтобы условию удовлетворяла ровно одна пара.
 * `fits` — признак, по которому задание считается решённым.
 */
function buildOptions(
  answer: string[],
  count: number,
  fits: (a: string, b: string) => boolean,
  rnd: Random,
): string[] | null {
  const options = [...answer]
  const pool = distractorPool(answer, rnd)

  for (const candidate of pool) {
    if (options.length >= count) break
    // Кандидат не должен образовать вторую подходящую пару ни с кем из набора
    if (options.some((other) => fits(candidate, other))) continue
    options.push(candidate)
  }
  if (options.length < count) return null

  // Контрольная проверка: подходящая пара в наборе ровно одна
  let good = 0
  for (let i = 0; i < options.length; i++) {
    for (let j = i + 1; j < options.length; j++) {
      if (fits(options[i], options[j])) good++
    }
  }
  return good === 1 ? shuffle(options, rnd) : null
}

// ── Разборы ───────────────────────────────────────────────────────────────────

function ionicDebrief(reaction: Reaction): DebriefBlock[] {
  const blocks: DebriefBlock[] = [
    { title: 'Молекулярное уравнение', lines: [reaction.molecular] },
  ]
  if (reaction.ionic.short) {
    blocks.push({ title: 'Полное ионное уравнение', lines: [renderIonic(reaction.ionic.full)] })
    blocks.push({ title: 'Сокращённое ионное уравнение', lines: [renderIonic(reaction.ionic.short)] })
  }
  return blocks
}

function redoxDebrief(reaction: Reaction): DebriefBlock[] {
  const { oxidizer, reducer } = reaction.redox
  const balance: string[] = []
  if (reducer) {
    balance.push(`${formatState(reducer.element, reducer.from)} − ${reducer.electrons}e⁻ → `
      + `${formatState(reducer.element, reducer.to)}   восстановитель, окисляется`)
  }
  if (oxidizer) {
    balance.push(`${formatState(oxidizer.element, oxidizer.from)} + ${-oxidizer.electrons}e⁻ → `
      + `${formatState(oxidizer.element, oxidizer.to)}   окислитель, восстанавливается`)
  }
  return [
    { title: 'Уравнение реакции', lines: [reaction.molecular] },
    { title: 'Электронный баланс', lines: balance },
    { title: 'Вывод', lines: [describeRedox(reaction.redox)] },
  ]
}

// ── Задание 6: свойства простых веществ ───────────────────────────────────────

/**
 * «Выберите два вещества, каждое из которых вступает в реакцию с …».
 * Опирается на реакции простых веществ — металлов и неметаллов.
 */
function generate6(rnd: Random): EgeItem | null {
  const simple = ALL_IDS.filter((id) => {
    const cls = SUBSTANCES[id].class
    return cls === 'металл' || cls === 'неметалл'
  })
  const reagentId = pick(simple, rnd)
  const partners = PAIR_REACTIONS
    .filter((r) => r.reagents.includes(reagentId))
    .map((r) => r.reagents.find((x) => x !== reagentId)!)
  const unique = [...new Set(partners)]
  if (unique.length < 2) return null

  const answer = shuffle(unique, rnd).slice(0, 2)
  // Условие требует не пару, а каждое из двух веществ по отдельности,
  // поэтому дистракторы — те, что с загаданным веществом не реагируют
  const distractors = distractorPool([reagentId, ...unique], rnd).slice(0, 3)
  if (distractors.length < 3) return null

  const reaction1 = reactionOf(reagentId, answer[0])!
  const reaction2 = reactionOf(reagentId, answer[1])!

  return {
    kind: 'choose',
    task: 6,
    title: 'Задание 6',
    prompt: `Из предложенного перечня выберите два вещества, каждое из которых вступает `
          + `в реакцию с ${formula(reagentId)}.`,
    options: shuffle([...answer, ...distractors], rnd),
    answer,
    debrief: [
      { title: 'Реакции идут', lines: [reaction1.molecular, reaction2.molecular] },
      {
        title: 'Не реагируют',
        lines: distractors.map((id) => `${formula(reagentId)} + ${formula(id)} — реакция не идёт`),
      },
    ],
  }
}

// ── Задание 9: цепочка превращений ────────────────────────────────────────────

function generate9(rnd: Random): EgeItem | null {
  // Щелочные металлы дают вырожденные цепочки — берём остальные элементы
  const starts = TRANSITIONS.filter((t) => t.element !== 'Na' && t.element !== 'K')
  const first = pick(starts, rnd)
  const seconds = stepsFrom(first.to).filter(
    (t) => t.element === first.element && t.to !== first.from && t.reagent !== first.reagent,
  )
  if (seconds.length === 0) return null
  const second = pick(seconds, rnd)

  const answer = [first.reagent, second.reagent]
  const fitsFirst = (id: string) => stepsFrom(first.from).some((t) => t.reagent === id && t.to === first.to)
  const fitsSecond = (id: string) => stepsFrom(second.from).some((t) => t.reagent === id && t.to === second.to)

  const distractors = distractorPool(answer, rnd)
    .filter((id) => !fitsFirst(id) && !fitsSecond(id))
    .slice(0, 3)
  if (distractors.length < 3) return null

  return {
    kind: 'chain',
    task: 9,
    title: 'Задание 9',
    prompt: 'Задана схема превращений. Определите вещества X и Y.',
    chain: [formula(first.from), formula(first.to), formula(second.to)],
    options: shuffle([...answer, ...distractors], rnd),
    answer,
    debrief: [
      { title: 'Первое превращение (X)', lines: [first.reaction.molecular] },
      { title: 'Второе превращение (Y)', lines: [second.reaction.molecular] },
    ],
  }
}

// ── Задание 29: окислительно-восстановительные реакции ────────────────────────

function generate29(rnd: Random): EgeItem | null {
  const candidates = PAIR_REACTIONS.filter(
    (r) => isRedox(r) && r.redox.oxidizer !== null && r.redox.reducer !== null && !r.heated,
  )
  const reaction = pick(candidates, rnd)
  const answer = reaction.reagents

  const fits = (a: string, b: string): boolean => {
    const found = reactionOf(a, b)
    return found !== null && isRedox(found)
  }
  const options = buildOptions(answer, 5, fits, rnd)
  if (!options) return null

  return {
    kind: 'choose',
    task: 29,
    title: 'Задание 29',
    prompt: 'Из предложенного перечня выберите два вещества, между которыми возможна '
          + 'окислительно-восстановительная реакция.',
    options,
    answer,
    debrief: redoxDebrief(reaction),
  }
}

// ── Задание 30: реакции ионного обмена ────────────────────────────────────────

function exchangeCandidates(): Reaction[] {
  return PAIR_REACTIONS.filter((r) => isExchange(r) && r.ionic.short !== null && !r.heated)
}

function generate30(rnd: Random): EgeItem | null {
  const reaction = pick(exchangeCandidates(), rnd)
  const answer = reaction.reagents

  const fits = (a: string, b: string): boolean => {
    const found = reactionOf(a, b)
    return found !== null && isExchange(found) && found.ionic.short !== null
  }
  const options = buildOptions(answer, 5, fits, rnd)
  if (!options) return null

  return {
    kind: 'choose',
    task: 30,
    title: 'Задание 30',
    prompt: 'Из предложенного перечня выберите два вещества, между которыми возможна '
          + 'реакция ионного обмена. Запишите молекулярное, полное и сокращённое ионные уравнения.',
    options,
    answer,
    debrief: ionicDebrief(reaction),
  }
}

/**
 * Обратный ход к заданию 30: дано сокращённое ионное уравнение, назвать вещества.
 * В КИМ такая формулировка встречается среди заданий на свойства солей.
 */
function generateIonicRiddle(rnd: Random): EgeItem | null {
  const reaction = pick(exchangeCandidates(), rnd)
  const answer = reaction.reagents
  const target = renderIonic(reaction.ionic.short!)

  const fits = (a: string, b: string): boolean => {
    const found = reactionOf(a, b)
    return found !== null && found.ionic.short !== null && renderIonic(found.ionic.short) === target
  }
  const options = buildOptions(answer, 5, fits, rnd)
  if (!options) return null

  return {
    kind: 'choose',
    task: 30,
    title: 'Задание 30',
    prompt: 'Из предложенного перечня выберите два вещества, взаимодействие которых '
          + 'описывается приведённым сокращённым ионным уравнением.',
    given: target,
    options,
    answer,
    debrief: ionicDebrief(reaction),
  }
}

// ── Задание 7: с чем реагирует вещество ───────────────────────────────────────

function generate7(rnd: Random): EgeItem | null {
  const interesting = ALL_IDS.filter((id) => {
    const cls = SUBSTANCES[id].class
    return cls !== 'прочее' && cls !== 'ион'
  })

  const rows: Array<{ id: string; partners: string[] }> = []
  for (const id of shuffle(interesting, rnd)) {
    if (rows.length >= 4) break
    const partners = PAIR_REACTIONS
      .filter((r) => r.reagents.includes(id) && !r.heated)
      .map((r) => r.reagents.find((x) => x !== id)!)
    const unique = [...new Set(partners)]
    if (unique.length < 3) continue
    if (rows.some((row) => row.id === id)) continue
    rows.push({ id, partners: shuffle(unique, rnd).slice(0, 3) })
  }
  if (rows.length < 4) return null

  // Набор реагентов подходит ровно одному веществу, иначе соответствие неоднозначно
  const unique = rows.every((row) =>
    rows.filter((other) => row.partners.every((p) => reactionOf(other.id, p) !== null)).length === 1)
  if (!unique) return null

  // Пятый набор-дистрактор: тройка, не подходящая никому
  const decoy = shuffle(ALL_IDS, rnd).slice(0, 3)
  if (rows.some((row) => decoy.every((p) => reactionOf(row.id, p) !== null))) return null

  const right = shuffle([...rows.map((r) => r.partners), decoy], rnd)
  return {
    kind: 'match',
    task: 7,
    title: 'Задание 7',
    prompt: 'Установите соответствие между веществом и реагентами, с каждым из которых '
          + 'оно может взаимодействовать.',
    leftTitle: 'ВЕЩЕСТВО',
    rightTitle: 'РЕАГЕНТЫ',
    left: rows.map((r) => formula(r.id)),
    right: right.map((set) => set.map(formula).join(', ')),
    answer: rows.map((row) => right.findIndex((set) => set === row.partners)),
    debrief: rows.map((row) => ({
      title: formula(row.id),
      lines: row.partners.map((p) => reactionOf(row.id, p)!.molecular),
    })),
  }
}

// ── Задание 8: исходные вещества и продукты ───────────────────────────────────

function generate8(rnd: Random): EgeItem | null {
  const pool = PAIR_REACTIONS.filter((r) => r.products.length >= 2)
  const chosen: Reaction[] = []
  for (const reaction of shuffle(pool, rnd)) {
    if (chosen.length >= 4) break
    const products = reaction.products.join(' + ')
    if (chosen.some((c) => c.products.join(' + ') === products)) continue
    chosen.push(reaction)
  }
  if (chosen.length < 4) return null

  const decoy = pick(pool.filter((r) => !chosen.includes(r)), rnd)
  if (chosen.some((c) => c.products.join(' + ') === decoy.products.join(' + '))) return null

  const productSets = shuffle([...chosen.map((r) => r.products), decoy.products], rnd)
  return {
    kind: 'match',
    task: 8,
    title: 'Задание 8',
    prompt: 'Установите соответствие между исходными веществами и продуктами реакции.',
    leftTitle: 'ИСХОДНЫЕ ВЕЩЕСТВА',
    rightTitle: 'ПРОДУКТЫ',
    left: chosen.map((r) => r.reagents.map(formula).join(' + ') + (r.heated ? ' (t°)' : '')),
    right: productSets.map((set) => set.join(' + ')),
    answer: chosen.map((r) => productSets.findIndex((set) => set === r.products)),
    debrief: chosen.map((r) => ({ title: r.reagents.map(formula).join(' + '), lines: [r.molecular] })),
  }
}

// ── Точка входа ───────────────────────────────────────────────────────────────

type Generator = (rnd: Random) => EgeItem | null

const GENERATORS: Record<EgeNumber, Generator[]> = {
  6: [generate6],
  7: [generate7],
  8: [generate8],
  9: [generate9],
  29: [generate29],
  30: [generate30, generateIonicRiddle],
}

/**
 * Собирает задание указанного номера. Генератор может вернуть null, если
 * подобрать однозначный перечень не удалось, — тогда пробуем ещё раз
 * с другой реакцией.
 */
export function generateItem(task: EgeNumber, rnd: Random = Math.random): EgeItem | null {
  const variants = GENERATORS[task]
  for (let attempt = 0; attempt < 60; attempt++) {
    const item = pick(variants, rnd)(rnd)
    if (item) return item
  }
  return null
}
