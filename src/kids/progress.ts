// ── Прогресс «Юного химика» ───────────────────────────────────────────────────
//
// Хранится отдельно от прогресса лаборатории: на интерактивной доске за одним
// браузером занимается весь класс, и учитель сбрасывает его перед новой группой,
// не трогая собственные задачи и журнал.

const KEY = 'crd-kids-v2'

export interface KidsProgress {
  /** Пройденные уроки */
  done: string[]
  /** На каком шаге остановились в уроке — чтобы продолжить с того же места */
  at: Record<string, number>
  /** Открытые карточки элементов — знаки */
  cards: string[]
  /** Команды на доске; null — играем без команд */
  teams: [string, string] | null
  /** Секунд на ход команды; 0 — без таймера */
  timer: number
  sound: boolean
  /** Лучший счёт в блице по ключу набора разделов */
  blitz: Record<string, number>
}

const EMPTY: KidsProgress = { done: [], at: {}, cards: [], teams: null, timer: 0, sound: true, blitz: {} }

function load(): KidsProgress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    return { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    return EMPTY
  }
}

let state: KidsProgress = load()
const listeners = new Set<() => void>()

function save(next: KidsProgress) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* приватный режим */ }
  listeners.forEach((l) => l())
}

export function getKids(): KidsProgress {
  return state
}

export function subscribeKids(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function rememberStep(lessonId: string, step: number) {
  if (state.at[lessonId] === step) return
  save({ ...state, at: { ...state.at, [lessonId]: step } })
}

/** Урок пройден: открываем карточки. Возвращает знаки, открытые впервые. */
export function finishLesson(lessonId: string, reward: string[]): string[] {
  const fresh = reward.filter((s) => !state.cards.includes(s))
  const { [lessonId]: _, ...at } = state.at
  save({
    ...state,
    at,
    done: state.done.includes(lessonId) ? state.done : [...state.done, lessonId],
    cards: [...state.cards, ...fresh],
  })
  return fresh
}

export function recordBlitz(key: string, score: number): boolean {
  const best = state.blitz[key] ?? 0
  if (score <= best) return false
  save({ ...state, blitz: { ...state.blitz, [key]: score } })
  return true
}

export function setTeams(teams: [string, string] | null) {
  save({ ...state, teams })
}

export function setTimer(timer: number) {
  save({ ...state, timer })
}

export function setSound(sound: boolean) {
  save({ ...state, sound })
}

/** Новая группа у доски: уроки, карточки и рекорды обнуляются, настройки остаются */
export function resetKids() {
  save({ ...EMPTY, teams: state.teams, timer: state.timer, sound: state.sound })
}

/** Звёзды по числу ошибок: без ошибок — три, немного — две */
export function starsByMistakes(mistakes: number, total: number): 1 | 2 | 3 {
  if (mistakes === 0) return 3
  if (mistakes <= Math.max(1, Math.round(total * 0.2))) return 2
  return 1
}
