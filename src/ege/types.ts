// ── Задания ЕГЭ, собираемые из базы реакций ───────────────────────────────────

export type EgeNumber = 6 | 7 | 8 | 9 | 29 | 30

export interface DebriefBlock {
  title: string
  lines: string[]
}

interface Base {
  task: EgeNumber
  /** Заголовок задания в списке */
  title: string
  prompt: string
  debrief: DebriefBlock[]
}

/** Задания 6, 29, 30: «выберите два вещества из перечня» */
export interface ChooseItem extends Base {
  kind: 'choose'
  /** Что дано под условием: сокращённое ионное уравнение или признак */
  given?: string
  /** Идентификаторы веществ в перечне */
  options: string[]
  /** Два правильных вещества; порядок не важен */
  answer: string[]
}

/** Задание 9: цепочка превращений, найти X и Y */
export interface ChainItem extends Base {
  kind: 'chain'
  /** Формулы веществ цепочки — между ними стоят пропуски */
  chain: string[]
  options: string[]
  /** Реагенты по пропускам; порядок важен */
  answer: string[]
}

/** Задания 7 и 8: установить соответствие */
export interface MatchItem extends Base {
  kind: 'match'
  leftTitle: string
  rightTitle: string
  left: string[]
  right: string[]
  /** Для каждой строки слева — индекс варианта справа */
  answer: number[]
}

export type EgeItem = ChooseItem | ChainItem | MatchItem

export const EGE_TASKS: Array<{ number: EgeNumber; title: string; subtitle: string }> = [
  { number: 6,  title: 'Задание 6',  subtitle: 'Химические свойства простых веществ' },
  { number: 7,  title: 'Задание 7',  subtitle: 'Свойства оксидов, гидроксидов и солей' },
  { number: 8,  title: 'Задание 8',  subtitle: 'Исходные вещества и продукты реакции' },
  { number: 9,  title: 'Задание 9',  subtitle: 'Взаимосвязь неорганических веществ' },
  { number: 29, title: 'Задание 29', subtitle: 'Окислительно-восстановительные реакции' },
  { number: 30, title: 'Задание 30', subtitle: 'Реакции ионного обмена' },
]
