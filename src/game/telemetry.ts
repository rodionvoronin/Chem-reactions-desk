// ── Логирование ───────────────────────────────────────────────────────────────
// Минимум, из которого считаются метрики пилота: доля решённых с первой попытки,
// избыточность (фактические шаги ÷ оптимальные), доля дошедших до конца сессии.
// Пока пишем в localStorage; если на странице подключена Яндекс.Метрика,
// событие уходит и туда как цель.

const KEY = 'chem-desk.events.v1'
const LIMIT = 500

export type EventName =
  | 'task_started'
  | 'reagent_added'
  | 'hint_used'
  | 'task_finished'
  | 'reaction_discovered'

export interface LoggedEvent {
  name: EventName
  at: number
  payload: Record<string, string | number | boolean>
}

declare global {
  interface Window {
    ym?: (id: number, action: string, target: string, params?: unknown) => void
    /** Счётчик Метрики задаётся в index.html при развёртывании пилота */
    ymCounterId?: number
  }
}

export function logEvent(name: EventName, payload: Record<string, string | number | boolean> = {}) {
  const event: LoggedEvent = { name, at: Date.now(), payload }
  try {
    const raw = localStorage.getItem(KEY)
    const list = raw ? (JSON.parse(raw) as LoggedEvent[]) : []
    list.push(event)
    localStorage.setItem(KEY, JSON.stringify(list.slice(-LIMIT)))
  } catch { /* нет места или приватный режим — логи не критичны */ }

  if (typeof window !== 'undefined' && window.ym && window.ymCounterId) {
    window.ym(window.ymCounterId, 'reachGoal', name, payload)
  }
}

export function getEvents(): LoggedEvent[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LoggedEvent[]) : []
  } catch {
    return []
  }
}

export function clearEvents() {
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
}
