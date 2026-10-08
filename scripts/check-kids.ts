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
import { countsOf, sameCounts, readFormula, mrOf, solveEquation, splitEquation, sideCounts, AR, splitCoefficient } from '../src/kids/molecule'
import { countQuestion, countAnswer, calcView, GENITIVE } from '../src/kids/generate'
import { blitzQuestions } from '../src/kids/games/BlitzGame'
import { recapQuestions } from '../src/kids/steps'
import { ELEMENTS } from '../src/periodic'
import { Game } from '../src/kids/types'
import { count } from '../src/plural'
import { makeVessel, addTo, signsOf, observation, KID_REAGENTS } from '../src/kids/lab'
import { parseBlanks } from '../src/kids/games/BlanksGame'
import { REAGENT_MAP, SOLID_OR_GAS, HEAP_REAGENTS } from '../src/reactions'
import { buildGrid } from '../src/kids/games/WordSearchGame'
import { cipherOptions } from '../src/kids/generate'
import { tolerance } from '../src/kids/games/EstimateGame'
import { MicroScene } from '../src/kids/types'

/**
 * Реактивы, которые в школе запрещены или спорны даже на экране: соли
 * свинца и ртути ядовиты, соединения хрома(VI) канцерогенны. Курс для 6–7
 * классов обходится без них. Исключение — «вулкан» из дихромата аммония:
 * опыт идёт только на виртуальном столе и слишком красив, чтобы от него
 * отказываться.
 */
const BANNED = new Set(['K2Cr2O7', 'K2CrO4', 'CrO3', 'PbNO32', 'PbO2', 'Pb3O4', 'HgCl2', 'HgNO32'])

/** Реактив существует в движке, у него есть детское название и он годится для школы */
function checkReagent(where: string, id: string) {
  if (id !== 'heat' && id !== 'air' && !REAGENT_MAP[id]) problems.push(`${where}: в движке нет реактива ${id}`)
  if (!KID_REAGENTS[id]) problems.push(`${where}: у реактива ${id} нет названия для доски`)
  if (BANNED.has(id)) problems.push(`${where}: реактив ${id} не для школьного курса`)
}

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

    // Схема или уравнение — по балансу атомов с коэффициентами записи
    if (bins.has('scheme') && bins.has('equation')) {
      for (const it of g.items) {
        const { left, right } = splitEquation(it.big ?? '')
        const side = (terms: string[]) => {
          const parts = terms.map(splitCoefficient)
          return sideCounts(parts.map((x) => x.formula), parts.map((x) => x.k))
        }
        const balanced = !!right && sameCounts(side(left), side(right))
        if (it.bin !== (balanced ? 'equation' : 'scheme')) problems.push(`${where}: «${it.big}» — на самом деле ${balanced ? 'уравнение' : 'схема'}`)
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

  if (g.kind === 'bench') {
    for (const id of g.palette) checkReagent(where, id)
    // Каждую цель можно найти хотя бы одним опытом из палитры
    const found = new Set<string>()
    const solids = g.palette.filter((x) => x !== 'heat')
    for (let i = 0; i < solids.length; i++) {
      if (g.palette.includes('heat') && SOLID_OR_GAS.has(solids[i])) {
        const a = makeVessel('chk', [solids[i], 'air'], true)
        for (const s of signsOf(a, addTo(a, ['heat']))) found.add(s)
      }
      for (let j = 0; j < solids.length; j++) {
        if (i === j) continue
        const a = makeVessel('chk', [solids[i]])
        for (const s of signsOf(a, addTo(a, [solids[j]]))) found.add(s)
      }
    }
    for (const goal of g.goals) if (!found.has(goal)) problems.push(`${where}: признак ${goal} не найти ни одним опытом со стола`)
    for (const key of Object.keys(g.notes ?? {})) {
      const parts = key.split('+')
      if (parts.join('+') !== [...parts].sort().join('+')) problems.push(`${where}: ключ пояснения ${key} не в алфавитном порядке — он не найдётся`)
      if (parts.some((p) => !g.palette.includes(p))) problems.push(`${where}: пояснение ${key} к реактиву не со стола`)
    }
    tasks += g.goals.length
  }

  if (g.kind === 'detective') {
    for (const id of [...g.unknowns, ...g.tests]) checkReagent(where, id)
    // Любые два неизвестных различимы хотя бы одной пробой — иначе дело не раскрыть
    const look = (u: string, t: string) => {
      const a = makeVessel('chk', [u])
      return observation(a, addTo(a, [t])).join(' ')
    }
    for (let i = 0; i < g.unknowns.length; i++) {
      for (let j = i + 1; j < g.unknowns.length; j++) {
        if (!g.tests.some((t) => look(g.unknowns[i], t) !== look(g.unknowns[j], t))) {
          problems.push(`${where}: ${g.unknowns[i]} и ${g.unknowns[j]} не различить ни одной пробой`)
        }
      }
    }
    tasks += g.unknowns.length
  }

  if (g.kind === 'match') {
    if (g.pairs.length < 4) problems.push(`${where}: меньше четырёх пар`)
    if (new Set(g.pairs.map((p) => p.left)).size !== g.pairs.length || new Set(g.pairs.map((p) => p.right)).size !== g.pairs.length) {
      problems.push(`${where}: повторяются карточки пар`)
    }
    tasks += g.pairs.length
  }

  if (g.kind === 'order') {
    if (g.steps.length < 3) problems.push(`${where}: меньше трёх шагов`)
    if (new Set(g.steps).size !== g.steps.length) problems.push(`${where}: шаги повторяются`)
    tasks += 1
  }

  if (g.kind === 'odd') {
    for (const r of g.rounds) {
      if (r.items.length < 3 || r.odd < 0 || r.odd >= r.items.length) problems.push(`${where}: неверный раунд «${r.items.map((i) => i.label).join(', ')}»`)
    }
    tasks += g.rounds.length
  }

  if (g.kind === 'blanks') {
    for (const s of g.sentences) {
      const blanks = parseBlanks(s.text).flatMap((p) => ('blank' in p ? [p.blank] : []))
      if (!blanks.length) problems.push(`${where}: в «${s.text}» нет пропусков`)
      if ((s.extra ?? []).some((x) => blanks.includes(x))) problems.push(`${where}: лишнее слово совпадает с ответом в «${s.text}»`)
    }
    tasks += g.sentences.length
  }

  if (g.kind === 'catch') {
    if (g.good.length < 4 || g.bad.length < 4) problems.push(`${where}: мало пузырей`)
    if (g.good.some((x) => g.bad.includes(x))) problems.push(`${where}: пузырь и нужный, и ненужный одновременно`)
    if (g.seconds < 20 || g.seconds > 90) problems.push(`${where}: раунд ${g.seconds} с — слишком коротко или долго`)
    tasks += 1
  }

  if (g.kind === 'anagram') {
    for (const w of g.words) {
      if (!/^[а-яё]{4,12}$/i.test(w.word)) problems.push(`${where}: слово «${w.word}» — не 4–12 русских букв`)
      if (new Set(w.word).size < 2) problems.push(`${where}: в «${w.word}» нечего перемешивать`)
    }
    tasks += g.words.length
  }

  if (g.kind === 'tictac') {
    const pool = blitzQuestions({ kind: 'blitz', sections: g.sections, seconds: 0 })
    if (pool.length < 15) problems.push(`${where}: для крестиков-ноликов всего ${pool.length} вопросов`)
    tasks += 9
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

  if (g.kind === 'truefalse') {
    if (g.statements.length < 4) problems.push(`${where}: меньше четырёх утверждений`)
    if (!g.statements.some((x) => x.truth) || !g.statements.some((x) => !x.truth)) problems.push(`${where}: все утверждения верные или все ложные — угадывается без мысли`)
    for (const x of g.statements) if (!x.note.trim()) problems.push(`${where}: у «${x.text}» нет пояснения`)
    tasks += g.statements.length
  }

  if (g.kind === 'letters') {
    for (const w of g.words) {
      if (!/^[а-яё]{3,12}$/i.test(w.word)) problems.push(`${where}: слово «${w.word}» — не 3–12 русских букв`)
      if (/ё/i.test(w.word)) problems.push(`${where}: в «${w.word}» буква ё — на клавиатуре игры её нет`)
    }
    if (new Set(g.words.map((w) => w.word)).size !== g.words.length) problems.push(`${where}: слова повторяются`)
    tasks += g.words.length
  }

  if (g.kind === 'wordsearch') {
    for (const w of g.words) {
      if (!/^[а-я]{3,}$/i.test(w)) problems.push(`${where}: «${w}» — не русское слово без ё`)
      if (w.length > g.size) problems.push(`${where}: «${w}» длиннее стороны сетки`)
    }
    if (new Set(g.words).size !== g.words.length) problems.push(`${where}: слова повторяются`)
    if (!buildGrid(g.words, g.size)) problems.push(`${where}: слова не раскладываются по сетке ${g.size}×${g.size}`)
    tasks += g.words.length
  }

  if (g.kind === 'micro') {
    const bins = new Set(g.bins.map((b) => b.id))
    const species = (sc: MicroScene) => sc.parts.map((x) => x.formula)
    const atoms = (sc: MicroScene) => {
      const out: Record<string, number> = {}
      for (const x of sc.parts) for (const [el, n] of Object.entries(countsOf(x.formula))) out[el] = (out[el] ?? 0) + n * x.n
      return out
    }
    const simple = (f: string) => Object.keys(countsOf(f)).length === 1
    g.rounds.forEach((r, k) => {
      const at = `${where}, рисунок ${k + 1}`
      if (!bins.has(r.bin)) problems.push(`${at}: нет корзины ${r.bin}`)
      for (const sc of [r, ...(r.after ? [r.after] : [])]) {
        for (const x of sc.parts) {
          if (!Object.keys(countsOf(x.formula)).length) problems.push(`${at}: не разбирается формула ${x.formula}`)
          if (x.n < 1 || x.n > 30) problems.push(`${at}: ${x.n} частиц ${x.formula} — не нарисовать`)
        }
      }
      // Что можно вывести из рисунка, сверяем с ответом
      if (bins.has('simple') && bins.has('complex') && !r.after) {
        const sp = species(r)
        const want = sp.length > 1 ? 'mixture' : simple(sp[0]) ? 'simple' : 'complex'
        if (want !== r.bin) problems.push(`${at}: на рисунке ${want}, а ответ ${r.bin}`)
      }
      if (bins.has('pure') && bins.has('mixture') && !r.after) {
        const want = species(r).length > 1 ? 'mixture' : 'pure'
        if (want !== r.bin) problems.push(`${at}: на рисунке ${want}, а ответ ${r.bin}`)
      }
      if (bins.has('atoms') && bins.has('molecules') && !r.after) {
        const sp = species(r)
        const sizes = sp.map((f) => Object.values(countsOf(f)).reduce((a, b) => a + b, 0))
        const want = sizes.every((n) => n === 1) ? 'atoms' : sizes.every((n) => n > 1) ? 'molecules' : '?'
        if (want !== r.bin) problems.push(`${at}: на рисунке ${want}, а ответ ${r.bin}`)
      }
      if (bins.has('solid') && bins.has('liquid') && bins.has('gas') && r.state !== r.bin) problems.push(`${at}: частицы стоят как ${r.state}, а ответ ${r.bin}`)
      // Корзины-формулы: на рисунке должно быть ровно это вещество
      if (g.bins.every((b) => Object.keys(countsOf(b.id)).length > 0) && !r.after) {
        if (species(r).length !== 1 || species(r)[0] !== r.bin) problems.push(`${at}: на рисунке ${species(r).join(' + ')}, а ответ ${r.bin}`)
      }
      if (r.after) {
        // Атомы при превращении не исчезают и не появляются
        const changed = species(r).sort().join() !== species(r.after).sort().join()
        if (changed && !sameCounts(atoms(r), atoms(r.after))) problems.push(`${at}: атомов «до» и «после» не поровну`)
        if (bins.has('phys') && bins.has('chem') && r.bin !== (changed ? 'chem' : 'phys')) problems.push(`${at}: на рисунке ${changed ? 'новые вещества' : 'те же вещества'}, а ответ ${r.bin}`)
        if (bins.has('combination')) {
          const a = species(r)
          const b = species(r.after)
          const kind = a.length >= 2 && b.length === 1 ? 'combination'
            : a.length === 1 && b.length >= 2 ? 'decomposition'
            : a.length === 2 && b.length === 2 && a.filter(simple).length === 1 && b.filter(simple).length === 1 ? 'substitution'
            : a.length === 2 && b.length === 2 && !a.some(simple) && !b.some(simple) ? 'exchange' : '?'
          if (kind !== r.bin) problems.push(`${at}: по рисунку это ${kind}, а ответ ${r.bin}`)
        }
      }
      if (!r.note.trim()) problems.push(`${at}: нет пояснения`)
    })
    tasks += g.rounds.length
  }

  if (g.kind === 'timeline') {
    if (g.events.length < 5) problems.push(`${where}: меньше пяти событий`)
    if (new Set(g.events.map((e) => e.year)).size !== g.events.length) problems.push(`${where}: у событий совпадают годы — порядок неоднозначен`)
    if (new Set(g.events.map((e) => e.text)).size !== g.events.length) problems.push(`${where}: события повторяются`)
    for (const e of g.events) {
      if (/^\d{3,4}$/.test(e.when) && Number(e.when) !== e.year) problems.push(`${where}: у «${e.text}» подпись ${e.when}, а год ${e.year}`)
    }
    tasks += g.events.length - 1
  }

  if (g.kind === 'jeopardy') {
    if (g.topics.length < 3) problems.push(`${where}: меньше трёх тем`)
    for (const t of g.topics) {
      if (t.questions.length < 3) problems.push(`${where}: в теме «${t.title}» меньше трёх вопросов`)
      for (const q of t.questions) {
        if (q.options) {
          if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) problems.push(`${where}: ответ на «${q.text}» за пределами вариантов`)
          if (new Set(q.options).size !== q.options.length) problems.push(`${where}: варианты «${q.text}» повторяются`)
        } else if (typeof q.answer !== 'string' || !q.answer.trim()) problems.push(`${where}: у устного вопроса «${q.text}» нет ответа`)
      }
      tasks += t.questions.length
    }
  }

  if (g.kind === 'tug') {
    const pool = blitzQuestions({ kind: 'blitz', sections: g.sections, seconds: 0 })
    if (pool.length < 24) problems.push(`${where}: для каната всего ${pool.length} вопросов`)
    tasks += 10
  }

  if (g.kind === 'estimate') {
    for (const q of g.questions) {
      if (q.answer < q.min || q.answer > q.max) problems.push(`${where}: ответ «${q.text}» за пределами шкалы`)
      const k = (q.answer - q.min) / q.step
      if (Math.abs(k - Math.round(k)) > 1e-6) problems.push(`${where}: ответ «${q.text}» не попадает на деление шкалы`)
      // Если допуск съедает полшкалы, угадывать нечего
      if (tolerance(q) * 4 > q.max - q.min) problems.push(`${where}: шкала «${q.text}» слишком грубая`)
      if (!q.note.trim()) problems.push(`${where}: у «${q.text}» нет пояснения`)
    }
    tasks += g.questions.length
  }

  if (g.kind === 'cipher') {
    for (const w of g.words) {
      for (const sym of w.symbols) {
        if (!ELEMENTS.some((e) => e.symbol === sym)) { problems.push(`${where}: нет элемента ${sym}`); continue }
        const o = cipherOptions(sym)
        if (o.length !== 4 || new Set(o).size !== 4) problems.push(`${where}: для ${sym} не набираются четыре разных варианта`)
      }
      if (w.symbols.length < 2) problems.push(`${where}: слишком короткий шифр «${w.answer}»`)
    }
    tasks += g.words.reduce((n, w) => n + w.symbols.length, 0)
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
  const active = s.filter((x) => ['discuss', 'predict', 'demo', 'explain', 'cards', 'story'].includes(x.kind)).length
  if (active < 3) problems.push(`${where}: почти одни игры — урок превратился в викторину`)
  // Не одни викторины: механики должны чередоваться
  const kinds = s.flatMap((x) => (x.kind === 'game' ? [x.game.kind] : []))
  if (kinds.filter((k) => k === 'quiz').length > 1) problems.push(`${where}: больше одной викторины «вопрос — ответ»`)
  if (new Set(kinds).size < 2) problems.push(`${where}: все игры урока одной механики`)
  if (new Set(kinds).size !== kinds.length) problems.push(`${where}: механика повторяется внутри урока — ${kinds.filter((k, i) => kinds.indexOf(k) !== i).join(', ')}`)
  const minutes = lessonMinutes(lesson)
  const [lo, hi] = lesson.size === 'big' ? [75, 95] : [35, 50]
  if (minutes < lo || minutes > hi) problems.push(`${where}: по оценке ${minutes} мин, а ${lesson.size === 'big' ? 'большой урок — это занятие, 75–95 мин' : 'короткий урок — ползанятия, 35–50 мин'}`)
  if (lesson.size === 'big' && kinds.length < 4) problems.push(`${where}: в большом уроке меньше четырёх игр`)

  // Чередование механик: у соседних уроков не больше двух общих игр,
  // и в каждом уроке есть игра, которой не было в трёх предыдущих
  const prev = LESSONS.slice(Math.max(0, i - 3), i).map((l) => new Set(l.steps.flatMap((x) => (x.kind === 'game' ? [x.game.kind] : []))))
  if (prev.length) {
    const shared = kinds.filter((k) => prev[prev.length - 1].has(k))
    if (shared.length > 2) problems.push(`${where}: с предыдущим уроком общие механики ${shared.join(', ')} — класс заскучает`)
    if (i >= 3 && !kinds.some((k) => prev.every((p) => !p.has(k)))) problems.push(`${where}: ни одной механики, которой не было в трёх предыдущих уроках`)
  }

  s.forEach((step, j) => {
    const at = `${where}, шаг ${j + 1}`
    if (step.min !== undefined && step.min <= 0) problems.push(`${at}: время шага должно быть больше нуля`)
    if (step.kind === 'predict') {
      if (step.answer < 0 || step.answer >= step.options.length) problems.push(`${at}: ответ за пределами вариантов`)
      if (new Set(step.options).size !== step.options.length) problems.push(`${at}: варианты повторяются`)
    }
    if (step.kind === 'cover' && step.goals.length < 2) problems.push(`${at}: у урока меньше двух целей`)
    if (step.kind === 'recap') {
      // Повторение собирается из игр прошлых уроков — их должно хватить на раунд
      if (i === 0) problems.push(`${at}: в первом уроке повторять нечего`)
      else if (recapQuestions(lesson).length < 5) problems.push(`${at}: для повторения всего ${recapQuestions(lesson).length} вопросов`)
    }
    if (step.kind === 'break' && step.moves.length < 3) problems.push(`${at}: в физкультминутке меньше трёх движений`)
    if (step.kind === 'cards' && step.cards.length < 3) problems.push(`${at}: меньше трёх карточек`)
    if (step.kind === 'game') checkGame(at, step.game)
    if (step.kind === 'demo') {
      // Опыт прогоняется через движок целиком: каждое действие должно что-то
      // показать, иначе пояснение «что произошло» рассказывало бы о невидимом
      const tubes = step.vessels.map((v, k) => {
        for (const id of v.start) checkReagent(at, id)
        if (v.heap && v.start.some((id) => id !== 'air' && !HEAP_REAGENTS.has(id))) problems.push(`${at}: на плитку положили то, что на плитку не кладут`)
        // Под подписью место на две строки: длиннее — обрежется на доске
        if (v.label.length > 24) problems.push(`${at}: подпись сосуда «${v.label}» длиннее 24 знаков — не влезет в две строки`)
        return makeVessel(`chk-${k}`, v.start, v.heap)
      })
      step.actions.forEach((a) => {
        const what = `${at}, действие «${a.label}»`
        if (!tubes[a.to]) { problems.push(`${what}: нет сосуда ${a.to}`); return }
        for (const id of a.add) checkReagent(what, id)
        if (a.predict && (a.predict.answer < 0 || a.predict.answer >= a.predict.options.length)) problems.push(`${what}: ответ прогноза за пределами вариантов`)
        const before = tubes[a.to]
        const after = addTo(before, a.add)
        const lines = observation(before, after)
        const nothing = lines.includes('Видимых изменений нет.') || lines.includes('Пока ничего не происходит.')
        if (nothing && !a.still) problems.push(`${what}: движок не показывает никаких изменений`)
        if (!nothing && a.still) problems.push(`${what}: помечено «без изменений», а движок показывает реакцию`)
        tubes[a.to] = after
      })
    }
    const visual = 'visual' in step ? step.visual : undefined
    if (visual?.type === 'tube') {
      for (const id of visual.contents) checkReagent(at, id)
      if ((visual.label ?? '').length > 24) problems.push(`${at}: подпись пробирки «${visual.label}» длиннее 24 знаков`)
    }
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

// Ни одна механика не должна заполонить курс
{
  const usage = new Map<string, number>()
  for (const l of LESSONS) for (const k of new Set(l.steps.flatMap((x) => (x.kind === 'game' ? [x.game.kind] : [])))) usage.set(k, (usage.get(k) ?? 0) + 1)
  for (const [k, n] of usage) if (n > Math.ceil(LESSONS.length * 0.32)) problems.push(`механика ${k} встречается в ${n} уроках из ${LESSONS.length} — приестся`)
}

// Каждая карточка должна где-то выдаваться, иначе коллекцию не собрать
for (const c of CARDS) {
  if (!elementOf(c.symbol)) problems.push(`карточка ${c.symbol}: нет такого элемента в таблице`)
  if (!rewarded.has(c.symbol)) problems.push(`карточка ${c.symbol}: не выдаётся ни в одном уроке`)
  if (c.clues.some((x) => !x.trim())) problems.push(`карточка ${c.symbol}: пустая подсказка`)
}

for (const m of KNOWN_MOLECULES) {
  if (!Object.keys(countsOf(m.formula)).length) problems.push(`известная молекула ${m.formula} не разбирается`)
}

// Спирт в заданиях для шестиклассников не нужен: опыты и примеры обходятся
// без него. Спиртовка — лабораторный прибор, её упоминать можно.
{
  const text = JSON.stringify([SECTIONS, TOPICS, CARDS])
  for (const m of text.matchAll(/[^"]{0,40}спирт(?!овк)[^"]{0,40}/gi)) problems.push(`в тексте курса упомянут спирт: «${m[0]}»`)
}

if (problems.length) {
  console.error(`check:kids — найдено проблем: ${problems.length}`)
  for (const p of problems) console.error('  · ' + p)
  process.exit(1)
}

const total = LESSONS.reduce((n, l) => n + lessonMinutes(l), 0)
const sessions = LESSONS.reduce((n, l) => n + (l.size === 'big' ? 1 : 0.5), 0)
console.log(
  `check:kids — ${count(LESSONS.length, 'урок', 'урока', 'уроков')} в ${count(SECTIONS.length, 'разделе', 'разделах', 'разделах')}, `
  + `${count(steps, 'шаг', 'шага', 'шагов')}, ${sessions} занятий по полтора часа (${Math.round(total / 60)} ч по оценке), `
  + `${count(tasks, 'задание', 'задания', 'заданий')} в играх, ${count(CARDS.length, 'элемент', 'элемента', 'элементов')} в коллекции: всё сходится`,
)
