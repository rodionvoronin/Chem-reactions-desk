// ── Сессия решения задачи ─────────────────────────────────────────────────────

import { Task } from './types'

export interface Session {
  task: Task
  /** Что реально лежит в пробирках: порядок перемешан, чтобы нельзя было угадать */
  assignment: string[]
  /** Варианты ответа в перемешанном порядке */
  options: string[]
  startedAt: number
  /** Номер попытки — вторую попытку после разбора считаем отдельно */
  attempt: number
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function startSession(task: Task, attempt = 1): Session {
  return {
    task,
    assignment: shuffle(task.hidden),
    // Для «различи пару» вариантами служит сама загаданная пара
    options: shuffle(task.options ?? task.hidden),
    startedAt: Date.now(),
    attempt,
  }
}

/** Подпись пробирки в режиме заданий: состав скрыт, номер виден. */
export function sampleLabel(index: number, total: number): string {
  return total > 1 ? `Образец ${index + 1}` : 'Образец'
}
