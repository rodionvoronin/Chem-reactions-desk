// ── Проверка названий на спойлер ──────────────────────────────────────────────
//
// Заголовок задачи виден в списке до того, как ученик возьмётся за пробирку.
// Если он называет ответ — «Соль трёхвалентного железа», «Хлорид бария», —
// задача решается чтением списка, а не анализом. Здесь собраны корни слов,
// по которым такое название распознаётся машинно: правило должно держаться
// само, а не памятью автора банка.

import { REAGENT_MAP } from '../reactions'
import { observe, describeObservation } from './engine'
import { FLAME_METALS } from '../components/FlameColorsPalette'
import { Task, Topic } from './types'

/** Русские корни для элементов-катионов */
const CATION_ROOTS: Record<string, string[]> = {
  Fe: ['желез'], Cu: ['медь', 'меди', 'медн'], Zn: ['цинк'], Al: ['алюмин'],
  Cr: ['хром'], Mg: ['магни'], Ca: ['кальци'], Ba: ['бари'], Sr: ['стронци'],
  Na: ['натри'], K: ['кали'], Li: ['лити'], Pb: ['свинц', 'свинец'],
  Ag: ['серебр'], Ni: ['никел'], Co: ['кобальт'], Mn: ['марганц', 'марганец'],
}

/** Корни для анионов — по формуле кислотного остатка */
const ANION_ROOTS: Array<[string, string[]]> = [
  ['CO₃', ['карбонат']], ['HCO₃', ['гидрокарбонат']],
  ['SO₄', ['сульфат']], ['SO₃', ['сульфит']], ['S', ['сульфид']],
  ['NO₃', ['нитрат']], ['NO₂', ['нитрит']],
  ['SiO₃', ['силикат']], ['PO₄', ['фосфат']],
  ['MnO₄', ['перманганат']], ['CrO₄', ['хромат']], ['Cr₂O₇', ['дихромат']],
  ['Cl', ['хлорид']], ['Br', ['бромид']], ['I', ['иодид', 'йодид']], ['F', ['фторид']],
  ['OH', ['гидроксид']],
]

/** Слова, описывающие окраску пламени каждого металла */
const FLAME_COLOR_WORDS: Record<string, string[]> = {
  Na: ['жёлт', 'желт', 'оранж'],
  K: ['фиолет', 'сирен'],
  Cu: ['зелён', 'зелен', 'изумруд', 'голуб'],
  Ba: ['зелён', 'зелен'],
  Ca: ['кирпич', 'оранж'],
  Li: ['малин', 'красн'],
  Sr: ['кармин', 'красн'],
  B: ['зелён', 'зелен'],
  In: ['син'],
  Rb: ['фиолет', 'красн'],
  Cs: ['голуб', 'син'],
}

/** Названия, которые ученик видит до решения, ответ раскрывать не должны */
const CHECKED_TYPES: Task['type'][] = ['identify', 'dry', 'flame']

/**
 * Возвращает корни, которых не должно быть в названии задачи. Пусто — значит,
 * тип задачи проверять не нужно: у «добейся признака» и «различи пару» цель
 * названа в условии, и повторить её в заголовке правильно.
 */
export function forbiddenRoots(task: Task): string[] {
  if (!CHECKED_TYPES.includes(task.type)) return []
  const roots = new Set<string>()

  if (task.type === 'flame') {
    const metal = FLAME_METALS.find((m) => m.id === task.flameMetal)
    if (metal) {
      // Название металла и цвет его пламени — это и есть ответ
      roots.add(metal.name.toLowerCase().replace(/[ийь]$/, ''))
      for (const word of FLAME_COLOR_WORDS[metal.symbol.replace(/[⁺¹²³⁴]/g, '')] ?? []) roots.add(word)
    }
    return [...roots]
  }

  for (const root of substanceRoots(task.answer[0])) roots.add(root)
  return [...roots]
}

/** Русские корни и формула вещества — по ним его узнают в тексте */
export function substanceRoots(reagentId: string): string[] {
  const formula = REAGENT_MAP[reagentId]?.label.replace(/\s*\(.*\)$/, '') ?? ''
  if (!formula) return []
  // Формула целиком — на случай названия вида «Определите FeCl₃»
  const roots = new Set<string>([formula.toLowerCase()])

  for (const element of formula.match(/[A-Z][a-z]?/g) ?? []) {
    for (const root of CATION_ROOTS[element] ?? []) roots.add(root)
  }
  // Аммоний в формуле виден как NH₄
  if (formula.includes('NH₄')) roots.add('аммони')
  for (const [tail, words] of ANION_ROOTS) {
    if (formula.includes(tail)) for (const word of words) roots.add(word)
  }
  return [...roots]
}

/** Катион вещества — по нему тема узнаёт «своё» вещество */
function cationSymbol(reagentId: string): string | null {
  const formula = REAGENT_MAP[reagentId]?.label.replace(/\s*\(.*\)$/, '') ?? ''
  if (formula.startsWith('NH₄')) return 'NH₄'
  return formula.match(/^[A-Z][a-z]?/)?.[0] ?? null
}

/**
 * Относится ли вещество к теме — по её названию и подзаголовку.
 * Регистр важен: корни слов ищем в нижнем, а символы элементов — в исходном,
 * иначе «Cr³⁺» в подзаголовке не найдётся.
 */
function belongsToTopic(reagentId: string, topic: Topic): boolean {
  const text = `${topic.title} ${topic.subtitle}`
  const lower = text.toLowerCase()
  if (substanceRoots(reagentId).some((root) => root.length > 3 && lower.includes(root))) return true
  const symbol = cationSymbol(reagentId)
  // Подзаголовки тем пишут ионы формулами: «Ca²⁺ и Ba²⁺»
  return symbol !== null
    && new RegExp(`(^|[^A-Za-zА-Яа-я])${symbol}([^a-z]|$)`).test(text)
}

/**
 * Тема тоже способна выдать ответ. Если из перечня к теме относится ровно
 * одно вещество — и это ответ, — задача решается чтением заголовка темы.
 * Обратный случай не лучше: когда ответ единственный, кто к теме не
 * относится, срабатывает правило «ищи белую ворону».
 */
export function topicSpoiler(task: Task, topic: Topic): string | null {
  if (!CHECKED_TYPES.includes(task.type) || task.type === 'flame') return null
  const options = task.options ?? []
  if (options.length < 3) return null

  const ours = options.filter((id) => belongsToTopic(id, topic))
  if (ours.length === 0) return null

  if (ours.length === 1 && ours[0] === task.answer[0]) {
    return 'из перечня к теме относится только ответ'
  }
  if (ours.length === options.length - 1 && !ours.includes(task.answer[0])) {
    return 'ответ — единственный, кто к теме не относится'
  }
  return null
}

/**
 * Признак, которым ответ отличается от всех дистракторов. Считает его движок:
 * прогоняет эталонный ход по ответу и по каждому дистрактору и берёт слова,
 * которые встречаются только у ответа. Назвать такое слово в заголовке —
 * всё равно что напечатать решение рядом с условием.
 */
function distinguishingWords(task: Task): string[] {
  if (task.type !== 'identify' && task.type !== 'dry') return []
  const options = task.options ?? []
  if (options.length === 0) return []
  const isDry = task.dry === true

  const wordsOf = (substance: string): Set<string> => {
    const out = new Set<string>()
    const acc = [substance]
    for (const step of task.solution) {
      acc.push(step)
      for (const word of describeObservation(observe(acc, isDry)).toLowerCase().split(/[^а-яёa-z₀-₉]+/)) {
        if (word.length >= 5) out.add(word.slice(0, 5))
      }
    }
    return out
  }

  const answer = wordsOf(task.answer[0])
  for (const option of options) {
    if (option === task.answer[0]) continue
    for (const word of wordsOf(option)) answer.delete(word)
  }
  return [...answer]
}

/** Какие запретные корни встретились в названии задачи */
export function spoilersInTitle(task: Task): string[] {
  const title = task.title.toLowerCase()
  const byName = forbiddenRoots(task).filter((root) => title.includes(root))
  const bySign = distinguishingWords(task).filter((root) => title.includes(root))
  return [...new Set([...byName, ...bySign])]
}
