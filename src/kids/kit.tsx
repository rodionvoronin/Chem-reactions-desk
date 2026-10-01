// ── Общие детали интерфейса «Юного химика» ────────────────────────────────────
//
// Всё крупное: режим рассчитан на интерактивную доску, к которой выходят
// по одному, а читают всем классом с последней парты.

import { createContext, useContext, ReactNode, CSSProperties, useMemo, useEffect, useState } from 'react'
import { getKids } from './progress'

export const KFONT = "'Montserrat', system-ui, sans-serif"

// ── Звуки ─────────────────────────────────────────────────────────────────────
// Синтезируются на лету: никаких файлов, и звук работает без сети.

let ctx: AudioContext | null = null

function tone(freqs: number[], step = 0.09, type: OscillatorType = 'sine', gain = 0.12) {
  if (!getKids().sound) return
  try {
    ctx = ctx ?? new AudioContext()
    const t0 = ctx.currentTime
    freqs.forEach((f, i) => {
      const osc = ctx!.createOscillator()
      const g = ctx!.createGain()
      osc.type = type
      osc.frequency.value = f
      const start = t0 + i * step
      g.gain.setValueAtTime(0, start)
      g.gain.linearRampToValueAtTime(gain, start + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0001, start + step * 1.8)
      osc.connect(g).connect(ctx!.destination)
      osc.start(start)
      osc.stop(start + step * 2)
    })
  } catch { /* браузер без звука */ }
}

export const sfx = {
  right: () => tone([660, 880]),
  wrong: () => tone([220, 180], 0.13, 'triangle', 0.1),
  flip: () => tone([520], 0.05, 'sine', 0.06),
  win: () => tone([523, 659, 784, 1047], 0.12),
  pop: () => tone([400, 600, 800], 0.05, 'sine', 0.08),
}

// ── Команды ───────────────────────────────────────────────────────────────────
// Счёт живёт только в течение урока и в localStorage не попадает: следующий
// урок — новая игра. Ход переходит после каждого ответа, чтобы у доски
// побывали обе команды.

export interface Teams {
  enabled: boolean
  names: [string, string]
  scores: [number, number]
  turn: 0 | 1
  /** Очки текущей команде */
  award: (points: number) => void
  /** Передать ход другой команде */
  pass: () => void
  /** Ход остаётся у той же команды, но таймер начинается заново (пара в «мемори») */
  again: () => void
  /** Секунд на ход; 0 — без таймера */
  timer: number
  /** Меняется при каждой передаче хода — по нему таймер начинает отсчёт заново */
  turnKey: number
  /** Таймер стоит, пока класс читает пояснение после верного ответа */
  paused: boolean
}

const TeamsContext = createContext<Teams>({
  enabled: false, names: ['', ''], scores: [0, 0], turn: 0,
  award: () => {}, pass: () => {}, again: () => {}, timer: 0, turnKey: 0, paused: false,
})

export const TeamsProvider = TeamsContext.Provider
export const useTeams = () => useContext(TeamsContext)

export const TEAM_COLORS: [string, string] = ['#1E88E5', '#E53935']

export function TeamBar({ compact = false }: { compact?: boolean }) {
  const t = useTeams()
  if (!t.enabled) return null
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      {t.names.map((name, i) => {
        const active = t.turn === i
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: compact ? '6px 14px' : '9px 18px', borderRadius: 999,
            background: active ? TEAM_COLORS[i] : 'white',
            color: active ? 'white' : TEAM_COLORS[i],
            border: `3px solid ${TEAM_COLORS[i]}`,
            fontWeight: 700, fontSize: compact ? 15 : 18,
            boxShadow: active ? `0 0 0 5px ${TEAM_COLORS[i]}33` : 'none',
            transition: 'all 0.25s',
          }}>
            {active && <span>👉</span>}
            <span>{name}</span>
            <span style={{
              minWidth: 34, textAlign: 'center', borderRadius: 999, padding: '1px 8px',
              background: active ? 'rgba(255,255,255,0.25)' : `${TEAM_COLORS[i]}18`,
            }}>
              {t.scores[i]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Таймер хода: кольцо с секундами рядом со счётом. Время вышло — ход
 * переходит к другой команде. Показывается только во время игры.
 */
export function TurnTimer() {
  const t = useTeams()
  const [left, setLeft] = useState(t.timer)

  useEffect(() => { setLeft(t.timer) }, [t.turnKey, t.timer])

  useEffect(() => {
    if (!t.enabled || !t.timer || t.paused) return
    if (left <= 0) {
      sfx.wrong()
      t.pass()
      return
    }
    const id = setTimeout(() => setLeft((x) => x - 1), 1000)
    return () => clearTimeout(id)
  }, [left, t.enabled, t.timer, t.paused])

  if (!t.enabled || !t.timer) return null
  const share = Math.max(0, left) / t.timer
  const urgent = left <= 5 && !t.paused
  const color = urgent ? '#E53935' : TEAM_COLORS[t.turn]
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <div title="Время на ход" style={{ position: 'relative', width: 54, height: 54 }}>
      <svg width="54" height="54" viewBox="0 0 54 54" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="27" cy="27" r={r} fill="white" stroke="#ECEFF1" strokeWidth="6" />
        <circle
          cx="27" cy="27" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - share)}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <div className={urgent ? 'kids-pulse' : undefined} style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 700, color: t.paused ? '#B0BEC5' : color,
      }}>
        {t.paused ? '⏸' : Math.max(0, left)}
      </div>
    </div>
  )
}

// ── Кнопки и панели ───────────────────────────────────────────────────────────

export function KButton({ children, onClick, color = '#1565C0', ghost = false, big = false, disabled = false, style }: {
  children: ReactNode
  onClick: () => void
  color?: string
  ghost?: boolean
  big?: boolean
  disabled?: boolean
  style?: CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: KFONT, fontWeight: 700,
        fontSize: big ? 22 : 17,
        padding: big ? '16px 34px' : '12px 22px',
        minHeight: big ? 64 : 52,
        borderRadius: 16, cursor: disabled ? 'default' : 'pointer',
        border: ghost ? `3px solid ${color}` : 'none',
        background: ghost ? 'white' : color,
        color: ghost ? color : 'white',
        opacity: disabled ? 0.45 : 1,
        boxShadow: ghost || disabled ? 'none' : `0 5px 0 ${shade(color)}`,
        transition: 'transform 0.08s',
        ...style,
      }}
      onPointerDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(3px)' }}
      onPointerUp={(e) => { e.currentTarget.style.transform = 'none' }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = 'none' }}
    >
      {children}
    </button>
  )
}

/** Тёмный оттенок цвета — для «объёмной» тени кнопки */
export function shade(hex: string, k = 0.72): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 255) * k)
  const g = Math.round(((n >> 8) & 255) * k)
  const b = Math.round((n & 255) * k)
  return `rgb(${r},${g},${b})`
}

/** Плашка-пояснение после ответа: зелёная — верно, оранжевая — подумать ещё */
export function Feedback({ kind, title, text, action }: {
  kind: 'right' | 'wrong' | 'info'
  title: string
  text?: string
  action?: ReactNode
}) {
  const palette = {
    right: { bg: '#E8F5E9', border: '#66BB6A', fg: '#1B5E20' },
    wrong: { bg: '#FFF3E0', border: '#FFA726', fg: '#BF360C' },
    info: { bg: '#E3F2FD', border: '#42A5F5', fg: '#0D47A1' },
  }[kind]
  return (
    <div className="kids-pop" style={{
      background: palette.bg, border: `3px solid ${palette.border}`, borderRadius: 20,
      padding: '16px 22px', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap',
    }}>
      <div style={{ flex: '1 1 320px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: palette.fg }}>{title}</div>
        {text && <div style={{ fontSize: 19, color: '#37474F', marginTop: 6, lineHeight: 1.45 }}>{text}</div>}
      </div>
      {action}
    </div>
  )
}

export function StarRow({ value, size = 40 }: { value: number; size?: number }) {
  return (
    <div style={{ fontSize: size, letterSpacing: 6, lineHeight: 1 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < value ? 'kids-star' : undefined} style={{
          color: i < value ? '#FFB300' : '#E0E0E0',
          display: 'inline-block', animationDelay: `${i * 0.18}s`,
        }}>★</span>
      ))}
    </div>
  )
}

/** Конфетти по завершении станции — чистый CSS, без библиотек */
export function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 2.2 + Math.random() * 1.6,
    color: ['#FFB300', '#E53935', '#1E88E5', '#43A047', '#8E24AA', '#00ACC1'][i % 6],
    size: 8 + Math.random() * 8,
    rot: Math.random() * 360,
  })), [])
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
      {pieces.map((p, i) => (
        <span key={i} className="kids-confetti" style={{
          position: 'absolute', top: -20, left: `${p.left}%`,
          width: p.size, height: p.size * 0.5, background: p.color, borderRadius: 2,
          transform: `rotate(${p.rot}deg)`,
          animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
        }} />
      ))}
    </div>
  )
}

/** Цвета атомов — как в школьных шаростержневых моделях */
export const ATOM_COLORS: Record<string, { fill: string; text: string; r: number }> = {
  H: { fill: '#FFFFFF', text: '#37474F', r: 0.62 },
  O: { fill: '#E53935', text: '#FFFFFF', r: 0.85 },
  C: { fill: '#37474F', text: '#FFFFFF', r: 0.85 },
  N: { fill: '#1E88E5', text: '#FFFFFF', r: 0.85 },
  Cl: { fill: '#43A047', text: '#FFFFFF', r: 0.95 },
  S: { fill: '#FDD835', text: '#37474F', r: 0.95 },
}

export function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Анимации режима — один раз на всё приложение */
export const KIDS_CSS = `
@keyframes kids-pop { 0% { transform: scale(0.85); opacity: 0 } 60% { transform: scale(1.03); opacity: 1 } 100% { transform: scale(1) } }
@keyframes kids-shake { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-14px) } 40% { transform: translateX(12px) } 60% { transform: translateX(-8px) } 80% { transform: translateX(5px) } }
@keyframes kids-star { 0% { transform: scale(0) rotate(-90deg) } 70% { transform: scale(1.3) rotate(10deg) } 100% { transform: scale(1) rotate(0) } }
@keyframes kids-fall { 0% { transform: translateY(0) rotate(0) } 100% { transform: translateY(110vh) rotate(720deg) } }
@keyframes kids-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
@keyframes kids-bubble { 0% { transform: translateY(0) scale(0.6); opacity: 0 } 15% { opacity: 0.9 } 100% { transform: translateY(-190px) scale(1.1); opacity: 0 } }
@keyframes kids-flame { 0%,100% { transform: scaleY(1) scaleX(1) } 50% { transform: scaleY(1.12) scaleX(0.92) } }
@keyframes kids-flash { 0% { opacity: 0 } 15% { opacity: 1 } 100% { opacity: 0 } }
@keyframes kids-settle { 0% { opacity: 0; transform: translateY(-60px) } 100% { opacity: 1; transform: translateY(0) } }
.kids-pop { animation: kids-pop 0.35s ease-out both }
.kids-shake { animation: kids-shake 0.45s ease-in-out }
.kids-star { animation: kids-star 0.5s ease-out both }
.kids-confetti { animation-name: kids-fall; animation-timing-function: linear; animation-fill-mode: both }
.kids-float { animation: kids-float 2.6s ease-in-out infinite }
@keyframes kids-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.25) } }
.kids-pulse { animation: kids-pulse 0.5s ease-in-out infinite }
`
