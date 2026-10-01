// ── Режим «Юный химик» для 6–7 классов ────────────────────────────────────────
//
// Отдельный слой поверх приложения: свои станции, свой прогресс, свои мини-игры.
// Движок реакций и банк заданий режим не трогает — школьнику шестого класса
// нужны не катионы, а понятия: тело и вещество, смесь, явление, атом, формула.
//
// Карта повторяет календарно-тематическое планирование спецкурса: разделы →
// уроки → станции. Станция — одна тема, у неё основной уровень и, если нужно,
// дополнительные. Уровень — это игра одного из типов ниже, описанная данными:
// добавить задание значит дописать объект, а не код.

/** Карточка для сортировки по корзинам */
export interface SortItem {
  id: string
  label: string
  emoji?: string
  /** Крупная подпись вместо эмодзи — формула или знак элемента */
  big?: string
  /** Цветной образец вместо картинки — например, цвет индикатора */
  swatch?: string
  bin: string
  /** Пояснение после верного ответа: его читают вслух всем классом */
  note: string
}

export interface SortBin {
  id: string
  title: string
  subtitle?: string
  emoji: string
  color: string
}

export interface SortGame {
  kind: 'sort'
  bins: SortBin[]
  items: SortItem[]
}

export interface QuizOption {
  label: string
  emoji?: string
}

export interface QuizQuestion {
  id: string
  emoji?: string
  text: string
  options: QuizOption[]
  answer: number
  note: string
}

export interface QuizGame {
  kind: 'quiz'
  questions: QuizQuestion[]
}

/** «Мемори»: знак элемента ↔ название или ↔ чтение знака */
export interface MemoryGame {
  kind: 'memory'
  /** Из каких элементов собирать раунд */
  pool: string[]
  /** Сколько пар в раунде */
  pairs: number
  /** Что на второй карточке пары: название («Железо») или чтение («феррум») */
  face?: 'name' | 'say'
}

/** Атом на рисунке молекулы: координаты в условных единицах */
export interface LayoutAtom {
  el: string
  x: number
  y: number
}

export interface BuildTarget {
  id: string
  name: string
  /** Формула с подстрочными индексами: H₂O */
  formula: string
  /** Что это за вещество в жизни */
  note: string
  /** Рисунок молекулы; связи — пары индексов атомов */
  layout: LayoutAtom[]
  bonds: Array<[number, number]>
}

export interface BuildGame {
  kind: 'build'
  /** Атомы, которые лежат в коробке */
  atoms: string[]
  targets: BuildTarget[]
}

/** Признак химической реакции — то, что ищут в мини-лаборатории */
export type Sign = 'gas' | 'precipitate' | 'color' | 'light' | 'none'

export interface LabSubstance {
  id: string
  label: string
  emoji: string
  /** Цвет самой жидкости; у твёрдых и «предметов» — null */
  color: string | null
}

export interface LabMix {
  pair: [string, string]
  sign: Sign
  /** Цвет в стакане после опыта */
  color?: string
  text: string
}

export interface LabGame {
  kind: 'lab'
  substances: LabSubstance[]
  mixes: LabMix[]
}

/** Загадки по карточкам элементов: подсказки открываются по одной */
export interface RiddleGame {
  kind: 'riddle'
  pool: string[]
  rounds: number
}

/**
 * Живая модель из частиц и вопросы к ней. 'states' — частицы в твёрдом,
 * жидком и газе; 'diffusion' — капля краски в стаканах разной температуры.
 */
export interface SimGame {
  kind: 'sim'
  sim: 'states' | 'diffusion'
  /** Для диффузии — стаканы и их температура, °C */
  beakers?: number[]
  questions: QuizQuestion[]
}

/** Охота по таблице Менделеева: найти клетку по номеру, названию или знаку */
export interface TableTask {
  by: 'z' | 'name' | 'symbol'
  symbol: string
}

export interface TableGame {
  kind: 'table'
  tasks: TableTask[]
}

/**
 * «Читаем формулы»: сколько молекул или атомов в записи вида 3CO₂.
 * Верный ответ и неверные варианты считаются из самой записи.
 */
export interface CountItem {
  /** Запись с коэффициентом: '3CO₂' */
  expr: string
  /** Чьи атомы считаем; без него — сколько молекул */
  el?: string
}

export interface CountGame {
  kind: 'count'
  items: CountItem[]
}

/**
 * Расчёты с экранной клавиатурой. Ответ не пишется в данные: он считается
 * по формуле и школьным атомным массам, поэтому опечатка в задаче невозможна.
 */
export type CalcTask =
  | { type: 'mr'; formula: string }
  | { type: 'fraction'; formula: string; el: string }
  /** Массовая доля в растворе по массам вещества и воды */
  | { type: 'w-solution'; solute: string; mSolute: number; mWater: number }
  /** Сколько вещества взять для раствора заданной массы и концентрации */
  | { type: 'm-solute'; solute: string; mSolution: number; percent: number }
  /** Сколько воды взять для того же раствора */
  | { type: 'm-water'; solute: string; mSolution: number; percent: number }

export interface CalcGame {
  kind: 'calc'
  tasks: CalcTask[]
}

/** График растворимости с ползунком температуры и вопросы к нему */
export interface ChartSeries {
  name: string
  color: string
  /** Точки [температура °C, граммов на 100 г воды] */
  points: Array<[number, number]>
}

export interface ChartGame {
  kind: 'chart'
  series: ChartSeries[]
  questions: QuizQuestion[]
}

/** Весы: что станет с массой после реакции */
export interface ScaleCase {
  id: string
  emoji: string
  title: string
  text: string
  answer: 'same' | 'less' | 'more'
  note: string
}

export interface ScaleGame {
  kind: 'scale'
  cases: ScaleCase[]
}

/** Расстановка коэффициентов: «H₂ + O₂ → H₂O» */
export interface BalanceGame {
  kind: 'balance'
  equations: string[]
}

/**
 * Блиц — викторина на скорость. Вопросы не пишутся отдельно, а собираются из
 * станций указанных разделов: сортировки, викторины, знаки элементов, формулы.
 */
export interface BlitzGame {
  kind: 'blitz'
  /** Номера разделов; пусто — весь курс */
  sections: number[]
  seconds: number
}

export type Game =
  | SortGame | QuizGame | MemoryGame | BuildGame | LabGame | RiddleGame
  | SimGame | TableGame | CountGame | CalcGame | ChartGame | ScaleGame | BalanceGame | BlitzGame

// ── Банк игр ──────────────────────────────────────────────────────────────────
// Темы банка — готовые игры с вступлением и правилом. Уроки берут из банка
// игры как отдельные шаги, а тексты темы — как основу для объяснений.

export interface Level {
  id: string
  title: string
  game: Game
}

export interface Station {
  id: string
  title: string
  emoji: string
  color: string
  intro: string[]
  howTo: string
  remember: string
  visual?: 'air' | 'ph'
  levels: Level[]
  reward: string[]
}

// ── Урок-путешествие ──────────────────────────────────────────────────────────
//
// Урок — это сценарий занятия на час-полтора, по которому учитель ведёт класс
// у доски: шаг за шагом, как по слайдам, но каждый шаг живой. Типы шагов
// повторяют ход хорошего урока: завязка, проблема, новое знание, опыт,
// закрепление в игре, запись в тетрадь, итог.

/** Наглядная схема или живая модель внутри шага */
export type Visual =
  | { type: 'emoji'; value: string }
  | { type: 'sim'; sim: 'states' | 'diffusion'; beakers?: number[] }
  | { type: 'air' }
  | { type: 'ph' }
  /** Треугольник огня: убери сторону — пламя погаснет */
  | { type: 'fire' }
  /** Приближаем каплю воды до молекул */
  | { type: 'zoom' }
  /** Модели молекул по id из конструктора */
  | { type: 'molecules'; ids: string[] }
  /** Карточки элементов */
  | { type: 'elements'; symbols: string[] }
  /** Клетка таблицы Менделеева с подписями частей */
  | { type: 'cell'; symbol: string }
  /** Стакан из кухонной лаборатории: цвет и что в нём происходит */
  | { type: 'mix'; color: string; effect: 'gas' | 'precipitate' | 'color' | 'none' }

interface StepBase {
  /** Сколько минут занятия занимает шаг — для учителя */
  min: number
  /** Подсказка учителю: что спросить, на что обратить внимание */
  note?: string
}

export type Step = StepBase & (
  /** Начало урока: о чём он и что узнаем */
  | { kind: 'cover'; goals: string[] }
  /** Реплика проводника — профессора Колбы */
  | { kind: 'story'; text: string[]; visual?: Visual }
  /** Объяснение нового: заголовок, короткие тезисы и схема */
  | { kind: 'explain'; title: string; points: string[]; visual?: Visual }
  /** Вопрос классу для обсуждения; ответ открывается кнопкой */
  | { kind: 'discuss'; question: string; emoji?: string; hints?: string[]; answer: string }
  /** Предскажи — проверь — объясни: класс голосует, потом смотрим, как на самом деле */
  | { kind: 'predict'; question: string; emoji?: string; options: string[]; answer: number; explain: string; visual?: Visual }
  /** Карточки, которые переворачивают по одной */
  | { kind: 'cards'; title: string; cards: Array<{ emoji: string; front: string; back: string }> }
  /** Настоящий опыт с бытовыми веществами — в классе, дома или как демонстрация */
  | {
      kind: 'experiment'; title: string; where: 'class' | 'home' | 'demo'
      need: string[]; steps: string[]; observe: string; explain: string; safety?: string
    }
  /** Игра из банка — закрепление */
  | { kind: 'game'; title: string; intro?: string; game: Game }
  /** Запись в тетрадь */
  | { kind: 'notebook'; lines: string[] }
  /** Итог: что узнали, домашнее задание, карточки элементов */
  | { kind: 'finish'; homework: string }
)

export interface Lesson {
  id: string
  /** Сквозной номер урока */
  n: number
  title: string
  emoji: string
  color: string
  /** Одной фразой — о чём урок, для списка уроков */
  tagline: string
  steps: Step[]
  /** Карточки элементов, которые открываются в конце урока */
  reward: string[]
}

export interface Section {
  n: number
  title: string
  lessons: Lesson[]
}

/** Карточка элемента в коллекции */
export interface ElementCard {
  symbol: string
  /** Как знак читают химики: Fe — «феррум» */
  say: string
  emoji: string
  metal: boolean
  /** Где встречается в жизни */
  life: string
  /** Удивительный факт */
  fact: string
  /** Подсказки для загадки — от трудной к лёгкой */
  clues: [string, string, string]
}
