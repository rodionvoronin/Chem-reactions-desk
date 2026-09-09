// ── Модель режима заданий ─────────────────────────────────────────────────────
// Песочница этих типов не знает и работает как раньше: режим заданий —
// отдельный слой поверх того же движка реакций.

export type TaskType =
  | 'identify'     // T1 — определи неизвестное
  | 'achieve'      // T2 — добейся признака
  | 'distinguish'  // T3 — различи пару
  | 'chain'        // T4 — цепочка превращений (этап гранта, задач пока нет)
  | 'flame'        // T5 — окрашивание пламени
  | 'dry'          // T6 — сухой режим

export interface Hint {
  /** Стоимость в единицах бюджета реактивов */
  cost: number
  text: string
}

/**
 * Целевой признак для задач типа «добейся признака» (T2).
 * Сравнивается с тем, что вернул движок для текущей пробирки: осадок — по
 * подписи цвета, газ — по формуле, раствор — по точному цвету из правила.
 */
export interface TargetEffect {
  /** Формула вещества, которое должно оказаться в пробирке */
  substance?: string
  precipitateLabel?: string
  gasFormula?: string
  liquidColor?: string
}

export interface Task {
  id: string
  type: TaskType
  difficulty: 1 | 2 | 3
  topic: string
  title: string
  prompt: string
  /**
   * Загаданные вещества — по пробирке на каждое. Для T3 порядок при выдаче
   * перемешивается, поэтому эталон сверяется с фактической раскладкой.
   * Для T2 список пуст: ученик собирает признак сам.
   */
  hidden: string[]
  /**
   * Открытое стартовое содержимое пробирки — в отличие от hidden, ученик его
   * видит. Нужно для обратных задач вида «получите из Cr³⁺ хромат».
   */
  start?: string[]
  /** Доступные реагенты. Ограничение обязательно: полная палитра = перебор. */
  palette: string[]
  /** Сколько приливаний можно потратить */
  budget: number
  /**
   * Эталонная последовательность реагентов. Из неё считается оптимум,
   * из неё же движок строит разбор после решения — руками ничего не пишем.
   */
  solution: string[]
  /** Варианты ответа: id веществ, для T5 — id металлов из FLAME_METALS */
  options?: string[]
  /** Эталон: id вещества (T1/T6), пара веществ по пробиркам (T3), металл (T5) */
  answer: string[]
  hints: Hint[]
  /** Пробирки выдаются в сухом режиме (T6) */
  dry?: boolean
  /** Признак, которого нужно добиться (T2) */
  target?: TargetEffect
  /** Металл, которым окрашено пламя (T5) */
  flameMetal?: string
}

export interface Action {
  step: number
  reagentId: string
  tubeIndex: number
  at: number
}

export interface Attempt {
  taskId: string
  startedAt: number
  finishedAt: number
  actions: Action[]
  spent: number
  hintsUsed: number
  correct: boolean
  stars: 0 | 1 | 2 | 3
}

export interface Topic {
  id: string
  title: string
  subtitle: string
}
