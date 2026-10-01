/**
 * Проверка режима «Юный химик»: `npm run check:kids`.
 *
 * Содержание для шестиклассников пишется руками, и ошибку в нём ребёнок
 * запомнит как правило. Поэтому всё, что можно вывести из химии, сверяется
 * с ней: простое ли вещество — по разбору формулы, металл ли — по карточке
 * элемента, молекула конструктора — по числу атомов на рисунке, уравнение —
 * по балансу атомов. Уроки проверяются как сценарии занятий.
 */

import { SECTIONS, LESSONS, KNOWN_MOLECULES, lessonMinutes } from '../src/kids/content'
import { TOPICS, BUILD_TARGETS } from '../src/kids/bank'
import { CARDS, CARD_MAP, elementOf } from '../src/kids/elements'
import { ATOM_COLORS } from '../src/kids/kit'
import { countsOf, sameCounts, readFormula, mrOf, solveEquation, splitEquation, AR, splitCoefficient } from '../src/kids/molecule'
import { countQuestion, countAnswer, calcView, GENITIVE } from '../src/kids/generate'
import { blitzQuestions } from '../src/kids/games/BlitzGame'
import { ELEMENTS } from '../src/periodic'
import { Game } from '../src/kids/types'
import { count } from '../src/plural'

const problems: string[] = []
const ids = new Set<string>()
const rewarded = new Map<string, string>()
let tasks = 0

function checkQuestions(where: string, qs: { id: string; text: string; options: { label: string }[]; answer: number }[]) {
  const qids = new Set<string>()
  for (const q of qs) {
    if (qids.has(q.id)) problems.push(`${where}: вопрос ${q.id} повторяется`)
    qids.add(q.id)
    if (q.answer < 0 || q.answer >= q.options.length) problems.push(`${where}: ответ на «${q.text}» за пределами вариантов`)
    if (new Set(q.options.map((o) => o.label)).size !== q.options.length) problems.push(`${where}: варианты «${q.text}» повторяются`)
  }
  tasks += qs.length
}

function checkGame(where: string, g: Game) {
  if (g.kind === 'sort') {
    const bins = new Set(g.bins.map((b) => b.id))
    const itemIds = new Set<string>()
    for (const it of g.items) {
      if (!bins.has(it.bin)) problems.push(`${where}: «${it.label}» лежит в несуществующей корзине ${it.bin}`)
      if (itemIds.has(it.id)) problems.push(`${where}: карточка ${it.id} повторяется`)
      itemIds.add(it.id)
      if (!it.note.trim()) problems.push(`${where}: у «${it.label}» нет пояснения`)
      if (!it.emoji && !it.big && !it.swatch) problems.push(`${where}: у «${it.label}» нет картинки`)
    }
    for (const b of g.bins) {
      if (!g.items.some((it) => it.bin === b.id)) problems.push(`${where}: корзина «${b.title}» пустая`)
    }
    tasks += g.items.length

    // Простое вещество — один элемент в формуле
    if (bins.has('simple') && bins.has('complex')) {
      for (const it of g.items) {
        const n = Object.keys(countsOf(it.big ?? '')).length
        if (n === 0) { problems.push(`${where}: не разбирается формула «${it.big}»`); continue }
        if (it.bin !== (n === 1 ? 'simple' : 'complex')) problems.push(`${where}: ${it.big} — на самом деле ${n === 1 ? 'простое' : 'сложное'}`)
      }
    }

    // Металлы — по карточкам элементов, названия — по таблице
    if (bins.has('metal') && bins.has('nonmetal')) {
      for (const it of g.items) {
        const card = CARD_MAP[it.big ?? '']
        if (!card) { problems.push(`${where}: для ${it.big} нет карточки элемента`); continue }
        if ((it.bin === 'metal') !== card.metal) problems.push(`${where}: ${it.big} отнесён не туда`)
        if (elementOf(card.symbol).name !== it.label) {
          problems.push(`${where}: ${it.big} подписан «${it.label}», а в таблице — «${elementOf(card.symbol).name}»`)
        }
      }
    }
  }

  if (g.kind === 'quiz' || g.kind === 'sim' || g.kind === 'chart') checkQuestions(where, g.questions)

  if (g.kind === 'chart') {
    for (const s of g.series) {
      for (let i = 1; i < s.points.length; i++) {
        if (s.points[i][0] <= s.points[i - 1][0]) problems.push(`${where}: точки ряда «${s.name}» идут не по возрастанию температуры`)
      }
      if (s.points[0][0] !== 0 || s.points[s.points.length - 1][0] !== 100) problems.push(`${where}: ряд «${s.name}» не покрывает 0–100 °C`)
    }
    if (new Set(g.series.map((s) => s.points.map((p) => p[0]).join())).size !== 1) problems.push(`${where}: у рядов разные температуры — таблица не сложится`)
  }

  if (g.kind === 'memory' || g.kind === 'riddle') {
    const need = g.kind === 'memory' ? g.pairs : Math.max(g.rounds, 4)
    if (g.pool.length < need) problems.push(`${where}: в наборе ${g.pool.length} элементов, а нужно не меньше ${need}`)
    for (const sym of g.pool) if (!CARD_MAP[sym]) problems.push(`${where}: нет карточки ${sym}`)
    tasks += g.kind === 'memory' ? g.pairs : g.rounds
  }

  if (g.kind === 'build') {
    for (const t of g.targets) {
      const need = countsOf(t.formula)
      if (!Object.keys(need).length) { problems.push(`${where}: не разбирается формула ${t.formula}`); continue }
      for (const el of Object.keys(need)) {
        if (!g.atoms.includes(el)) problems.push(`${where}: для ${t.formula} нет атомов ${el} в коробке`)
      }
      const drawn: Record<string, number> = {}
      for (const a of t.layout) drawn[a.el] = (drawn[a.el] ?? 0) + 1
      if (!sameCounts(need, drawn)) problems.push(`${where}: рисунок ${t.formula} не совпадает с формулой`)
      for (const [a, b] of t.bonds) {
        if (!t.layout[a] || !t.layout[b]) problems.push(`${where}: связь ${a}–${b} в ${t.formula} ведёт в никуда`)
      }
      if (readFormula(t.formula).includes('undefined')) problems.push(`${where}: не читается ${t.formula}`)
    }
    for (const el of g.atoms) if (!ATOM_COLORS[el]) problems.push(`${where}: у атома ${el} нет цвета`)
    tasks += g.targets.length
  }

  if (g.kind === 'lab') {
    const subs = new Set(g.substances.map((x) => x.id))
    const seen = new Set<string>()
    for (const m of g.mixes) {
      for (const id of m.pair) if (!subs.has(id)) problems.push(`${where}: в опыте нет вещества ${id}`)
      const key = [...m.pair].sort().join('+')
      if (seen.has(key)) problems.push(`${where}: опыт ${key} описан дважды`)
      seen.add(key)
    }
    for (const sign of ['gas', 'precipitate', 'color', 'light'] as const) {
      if (!g.mixes.some((m) => m.sign === sign)) problems.push(`${where}: нет опыта с признаком ${sign} — станцию не пройти`)
    }
    tasks += 4
  }

  if (g.kind === 'table') {
    for (const t of g.tasks) {
      if (!ELEMENTS.some((e) => e.symbol === t.symbol)) problems.push(`${where}: в таблице нет элемента ${t.symbol}`)
    }
    if (new Set(g.tasks.map((t) => t.symbol)).size !== g.tasks.length) problems.push(`${where}: элемент ищут дважды`)
    tasks += g.tasks.length
  }

  if (g.kind === 'count') {
    for (const it of g.items) {
      const { formula } = splitCoefficient(it.expr)
      if (!Object.keys(countsOf(formula)).length) problems.push(`${where}: не разбирается ${it.expr}`)
      if (it.el && !countsOf(formula)[it.el]) problems.push(`${where}: в ${it.expr} нет атомов ${it.el}`)
      if (it.el && !GENITIVE[it.el]) problems.push(`${where}: нет падежной формы для ${it.el}`)
      const q = countQuestion(it)
      if (q.options[q.answer].label !== String(countAnswer(it))) problems.push(`${where}: в вопросе про ${it.expr} верный вариант не совпал с ответом`)
    }
    checkQuestions(where, g.items.map(countQuestion))
  }

  if (g.kind === 'calc') {
    for (const t of g.tasks) {
      if (t.type === 'mr' || t.type === 'fraction') {
        for (const el of Object.keys(countsOf(t.formula))) {
          if (AR[el] === undefined) { problems.push(`${where}: нет школьной массы для ${el} (${t.formula})`); continue }
          // Школьная масса не должна расходиться с таблицей больше чем на округление
          const real = parseFloat(elementOf(el).mass.replace(',', '.'))
          if (Math.abs(real - AR[el]) > 0.6) problems.push(`${where}: Ar(${el}) = ${AR[el]}, а в таблице ${real}`)
        }
        if (Number.isNaN(mrOf(t.formula))) problems.push(`${where}: не считается Mr(${t.formula})`)
        if (t.type === 'fraction' && (!countsOf(t.formula)[t.el] || !GENITIVE[t.el])) problems.push(`${where}: в ${t.formula} нет ${t.el} или его падежной формы`)
      }
      const v = calcView(t)
      if (!v.accepts(v.answer)) problems.push(`${where}: задача «${v.prompt}» не принимает собственный ответ`)
      if (v.answer <= 0 || !Number.isFinite(v.answer)) problems.push(`${where}: странный ответ в «${v.prompt}»`)
    }
    tasks += g.tasks.length
  }

  if (g.kind === 'scale') {
    if (new Set(g.cases.map((c) => c.answer)).size < 3) problems.push(`${where}: в опытах на весах встречаются не все три исхода`)
    tasks += g.cases.length
  }

  if (g.kind === 'balance') {
    for (const eq of g.equations) {
      const { left, right } = splitEquation(eq)
      const els = (side: string[]) => new Set(side.flatMap((f) => Object.keys(countsOf(f))))
      const l = els(left)
      const r = els(right)
      if ([...l].some((e) => !r.has(e)) || [...r].some((e) => !l.has(e))) problems.push(`${where}: в ${eq} элементы слева и справа разные`)
      else if (!solveEquation(eq)) problems.push(`${where}: ${eq} не уравнивается коэффициентами до 8`)
    }
    tasks += g.equations.length
  }

  if (g.kind === 'blitz') {
    const pool = blitzQuestions(g)
    if (pool.length < 30) problems.push(`${where}: в блице всего ${pool.length} вопросов — за раунд они начнут повторяться`)
    for (const n of g.sections) if (!SECTIONS.some((s) => s.n === n)) problems.push(`${where}: нет раздела ${n}`)
  }
}

// Игры банка проверяем все, даже те, что пока не стоят ни в одном уроке
for (const t of TOPICS) {
  for (const level of t.levels) checkGame(`банк «${t.title}», уровень «${level.title}»`, level.game)
}

// Уроки: устройство сценария, длительность, шаги
const BUILD_IDS = new Set(BUILD_TARGETS.map((t) => t.id))
const lessonIds = new Set<string>()
let steps = 0
LESSONS.forEach((lesson, i) => {
  const where = `урок ${lesson.n} «${lesson.title}»`
  if (lessonIds.has(lesson.id)) problems.push(`${where}: повторяющийся идентификатор`)
  lessonIds.add(lesson.id)
  if (lesson.n !== i + 1) problems.push(`${where}: сквозная нумерация уроков сбита`)

  const s = lesson.steps
  steps += s.length
  if (s[0]?.kind !== 'cover') problems.push(`${where}: урок должен начинаться с обложки`)
  if (s[s.length - 1]?.kind !== 'finish') problems.push(`${where}: урок должен заканчиваться итогом`)
  if (s.filter((x) => x.kind === 'cover' || x.kind === 'finish').length !== 2) problems.push(`${where}: обложка и итог — ровно по одному`)
  if (!s.some((x) => x.kind === 'notebook')) problems.push(`${where}: нет записи в тетрадь`)
  if (!s.some((x) => x.kind === 'game')) problems.push(`${where}: нет ни одной игры`)
  // Урок — это занятие, а не викторина: в нём должно быть что-то кроме игр
  const active = s.filter((x) => ['discuss', 'predict', 'experiment', 'explain', 'cards', 'story'].includes(x.kind)).length
  if (active < 3) problems.push(`${where}: почти одни игры — урок превратился в викторину`)
  const minutes = lessonMinutes(lesson)
  if (minutes < 55 || minutes > 95) problems.push(`${where}: по сценарию ${minutes} мин, а занятие длится час-полтора`)

  s.forEach((step, j) => {
    const at = `${where}, шаг ${j + 1}`
    if (step.min <= 0) problems.push(`${at}: не указано время`)
    if (step.kind === 'predict') {
      if (step.answer < 0 || step.answer >= step.options.length) problems.push(`${at}: ответ за пределами вариантов`)
      if (new Set(step.options).size !== step.options.length) problems.push(`${at}: варианты повторяются`)
    }
    if (step.kind === 'cover' && step.goals.length < 2) problems.push(`${at}: у урока меньше двух целей`)
    if (step.kind === 'cards' && step.cards.length < 3) problems.push(`${at}: меньше трёх карточек`)
    if (step.kind === 'experiment' && (step.steps.length < 2 || !step.need.length)) problems.push(`${at}: опыт без списка или хода`)
    if (step.kind === 'game') checkGame(at, step.game)
    const visual = 'visual' in step ? step.visual : undefined
    if (visual?.type === 'molecules') for (const id of visual.ids) if (!BUILD_IDS.has(id)) problems.push(`${at}: нет модели молекулы ${id}`)
    if (visual?.type === 'elements') for (const sym of visual.symbols) if (!CARD_MAP[sym]) problems.push(`${at}: нет карточки ${sym}`)
    if (visual?.type === 'cell' && !ELEMENTS.some((e) => e.symbol === visual.symbol)) problems.push(`${at}: нет элемента ${visual.symbol}`)
  })

  for (const sym of lesson.reward) {
    if (!CARD_MAP[sym]) problems.push(`${where}: награда ${sym} — нет такой карточки`)
    if (rewarded.has(sym)) problems.push(`${where}: карточка ${sym} уже выдаётся в уроке «${rewarded.get(sym)}»`)
    rewarded.set(sym, lesson.title)
  }
})

// Каждая карточка должна где-то выдаваться, иначе коллекцию не собрать
for (const c of CARDS) {
  if (!elementOf(c.symbol)) problems.push(`карточка ${c.symbol}: нет такого элемента в таблице`)
  if (!rewarded.has(c.symbol)) problems.push(`карточка ${c.symbol}: не выдаётся ни в одном уроке`)
  if (c.clues.some((x) => !x.trim())) problems.push(`карточка ${c.symbol}: пустая подсказка`)
}

for (const m of KNOWN_MOLECULES) {
  if (!Object.keys(countsOf(m.formula)).length) problems.push(`известная молекула ${m.formula} не разбирается`)
}

if (problems.length) {
  console.error(`check:kids — найдено проблем: ${problems.length}`)
  for (const p of problems) console.error('  · ' + p)
  process.exit(1)
}

const total = LESSONS.reduce((n, l) => n + lessonMinutes(l), 0)
console.log(
  `check:kids — ${count(LESSONS.length, 'урок', 'урока', 'уроков')} в ${count(SECTIONS.length, 'разделе', 'разделах', 'разделах')}, `
  + `${count(steps, 'шаг', 'шага', 'шагов')}, ${Math.round(total / 60)} ч по сценарию, `
  + `${count(tasks, 'задание', 'задания', 'заданий')} в играх, ${count(CARDS.length, 'элемент', 'элемента', 'элементов')} в коллекции: всё сходится`,
)
