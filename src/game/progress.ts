// ── Прогресс ученика ──────────────────────────────────────────────────────────
// Всё живёт в localStorage: до пилота аккаунты не нужны, хватает имени.
// Синхронизация с сервером появится вместе с кабинетом преподавателя.

import { ALL_EQUATIONS } from '../reactions'
import { Attempt } from './types'
import { TASKS } from './bank'

const KEY = 'chem-desk.progress.v1'

export interface TaskResult {
  stars: 0 | 1 | 2 | 3
  spent: number
  hintsUsed: number
  duration: number
  attempts: number
}

export interface Progress {
  name: string
  /** Уравнения, которые ученик уже видел — лабораторный журнал */
  journal: string[]
  /** Лучший результат по каждой задаче */
  results: Record<string, TaskResult>
}

const EMPTY: Progress = { name: '', journal: [], results: {} }

// ── Уровни допуска ────────────────────────────────────────────────────────────

export interface Level {
  title: string
  needSolved: number
  needJournal: number
  unlocks: string
}

/**
 * Прогрессия в терминах лабораторной иерархии. Уровень открывает новые типы и
 * сложности заданий; палитра песочницы от него не зависит — песочница остаётся
 * полной с первой минуты, иначе мы отберём у неё то, ради чего её и открывают.
 */
export const LEVELS: Level[] = [
  { title: 'Стажёр',   needSolved: 0,  needJournal: 0,  unlocks: 'базовые задания' },
  { title: 'Лаборант', needSolved: 3,  needJournal: 10, unlocks: 'задания уровня ЕГЭ' },
  { title: 'Аналитик', needSolved: 10, needJournal: 35, unlocks: 'олимпиадные задания и сухой режим' },
  { title: 'Эксперт',  needSolved: 20, needJournal: 80, unlocks: 'весь банк заданий' },
]

export function levelIndex(p: Progress): number {
  const solved = solvedCount(p)
  let idx = 0
  LEVELS.forEach((l, i) => {
    if (solved >= l.needSolved && p.journal.length >= l.needJournal) idx = i
  })
  return idx
}

/** Максимальная сложность, доступная на текущем уровне допуска. */
export function maxDifficulty(p: Progress): number {
  return Math.min(3, levelIndex(p) + 1)
}

export function solvedCount(p: Progress): number {
  return Object.values(p.results).filter((r) => r.stars > 0).length
}

export function starsCount(p: Progress): number {
  return Object.values(p.results).reduce((s, r) => s + r.stars, 0)
}

export const TOTAL_EQUATIONS = ALL_EQUATIONS.length
export const TOTAL_STARS = TASKS.length * 3

// ── Хранилище ─────────────────────────────────────────────────────────────────

let state: Progress = load()
const listeners = new Set<() => void>()

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      name: parsed.name ?? '',
      journal: Array.isArray(parsed.journal) ? parsed.journal : [],
      results: parsed.results ?? {},
    }
  } catch {
    return { ...EMPTY }
  }
}

function commit(next: Progress) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* приватный режим — работаем без сохранения */ }
  listeners.forEach((fn) => fn())
}

export function getProgress(): Progress {
  return state
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

export function setName(name: string) {
  commit({ ...state, name })
}

/**
 * Кладёт в журнал уравнения, которые ученик увидел впервые.
 * Возвращает только новые — их показывает всплывающая карточка «новая запись».
 */
export function recordEquations(equations: string[]): string[] {
  const known = new Set(state.journal)
  const fresh = equations.filter((e) => e && !known.has(e))
  if (fresh.length === 0) return []
  commit({ ...state, journal: [...state.journal, ...fresh] })
  return fresh
}

export function recordAttempt(a: Attempt) {
  const prev = state.results[a.taskId]
  const next: TaskResult = {
    stars: Math.max(prev?.stars ?? 0, a.stars) as 0 | 1 | 2 | 3,
    spent: prev && prev.stars >= a.stars ? prev.spent : a.spent,
    hintsUsed: prev && prev.stars >= a.stars ? prev.hintsUsed : a.hintsUsed,
    duration: prev && prev.stars >= a.stars ? prev.duration : a.finishedAt - a.startedAt,
    attempts: (prev?.attempts ?? 0) + 1,
  }
  commit({ ...state, results: { ...state.results, [a.taskId]: next } })
}

export function resetProgress() {
  commit({ ...EMPTY })
}

// ── Код результата для преподавателя ──────────────────────────────────────────

export interface ResultRow {
  name: string
  taskId: string
  stars: number
  spent: number
  hints: number
  seconds: number
  attempts: number
}

/**
 * Кодирует сводку в строку, которую ученик показывает преподавателю.
 * Бэкенда нет, поэтому переносим данные так — на статике это уже позволяет
 * провести пилот с замером.
 */
export function encodeResults(p: Progress): string {
  const payload = {
    n: p.name,
    j: p.journal.length,
    r: Object.entries(p.results).map(([id, r]) => [
      id, r.stars, r.spent, r.hintsUsed, Math.round(r.duration / 1000), r.attempts,
    ]),
  }
  return 'CRD1-' + btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
}

export interface DecodedResult {
  name: string
  journal: number
  rows: ResultRow[]
}

export function decodeResults(code: string): DecodedResult | null {
  try {
    const body = code.trim().replace(/^CRD1-/, '')
    const json = decodeURIComponent(escape(atob(body)))
    const p = JSON.parse(json) as { n: string; j: number; r: [string, number, number, number, number, number][] }
    if (!Array.isArray(p.r)) return null
    return {
      name: p.n,
      journal: p.j,
      rows: p.r.map(([taskId, stars, spent, hints, seconds, attempts]) => ({
        name: p.n, taskId, stars, spent, hints, seconds, attempts,
      })),
    }
  } catch {
    return null
  }
}
