import { useEffect, useRef, useState } from 'react'
import { SimGame as Game } from '../types'
import { QuizGame } from './QuizGame'
import { KButton, sfx } from '../kit'
import { useIsNarrow } from '../../useViewport'

/**
 * Модель из частиц, а под ней — вопросы. Модель не обязательна для ответа,
 * но именно на неё класс смотрит, когда учитель спрашивает «почему».
 */
export function SimGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {game.sim === 'states' ? <StatesSim /> : <DiffusionSim temps={game.beakers ?? [20]} />}
      <QuizGame game={{ kind: 'quiz', questions: game.questions }} onFinish={onFinish} />
    </div>
  )
}

// ── Общая анимация на canvas ──────────────────────────────────────────────────

function useCanvasLoop(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => void,
  deps: unknown[],
) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Шаг ограничен: если вкладка была в фоне, частицы не должны «телепортироваться»
      const dt = Math.min(3, (now - last) / 16.7)
      last = now
      draw(ctx, w, h, dt)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

// ── Три состояния ─────────────────────────────────────────────────────────────

interface P { x: number; y: number; vx: number; vy: number; bx: number; by: number; ph: number }

export function StatesSim() {
  const narrow = useIsNarrow()
  const panels = [
    { title: 'Твёрдое', note: 'частицы стоят плотно и колеблются на месте', color: '#6D4C41', mode: 'solid' as const },
    { title: 'Жидкое', note: 'частицы рядом, но скользят друг мимо друга', color: '#1E88E5', mode: 'liquid' as const },
    { title: 'Газ', note: 'частицы далеко и летают во все стороны', color: '#90A4AE', mode: 'gas' as const },
  ]
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: narrow ? '1fr' : 'repeat(3, minmax(0, 1fr))' }}>
      {panels.map((p) => (
        <div key={p.mode} style={{ background: 'white', borderRadius: 24, padding: 14, boxShadow: '0 8px 24px rgba(38,50,56,0.1)' }}>
          <StatePanel mode={p.mode} color={p.color} />
          <div style={{ fontSize: 24, fontWeight: 700, color: p.color, marginTop: 10, textAlign: 'center' }}>{p.title}</div>
          <div style={{ fontSize: 16, color: '#78909C', textAlign: 'center' }}>{p.note}</div>
        </div>
      ))}
    </div>
  )
}

function StatePanel({ mode, color }: { mode: 'solid' | 'liquid' | 'gas'; color: string }) {
  const parts = useRef<P[] | null>(null)
  const ref = useCanvasLoop((ctx, w, h, dt) => {
    const r = 9
    if (!parts.current) {
      const list: P[] = []
      if (mode === 'solid') {
        const cols = 8
        const rows = 6
        const gap = 2 * r + 2
        const x0 = (w - (cols - 1) * gap) / 2
        const y0 = h - 14 - (rows - 1) * gap
        for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
          const bx = x0 + j * gap
          const by = y0 + i * gap
          list.push({ x: bx, y: by, vx: 0, vy: 0, bx, by, ph: Math.random() * 6.28 })
        }
      } else {
        const n = mode === 'liquid' ? 42 : 12
        for (let i = 0; i < n; i++) {
          const speed = mode === 'gas' ? 3.2 : 0.8
          const a = Math.random() * 6.28
          list.push({
            x: r + Math.random() * (w - 2 * r),
            y: mode === 'liquid' ? h * 0.45 + Math.random() * (h * 0.55 - r) : r + Math.random() * (h - 2 * r),
            vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, bx: 0, by: 0, ph: 0,
          })
        }
      }
      parts.current = list
    }
    const list = parts.current
    const t = performance.now() / 1000

    if (mode === 'solid') {
      for (const p of list) {
        p.x = p.bx + Math.sin(t * 9 + p.ph) * 1.8
        p.y = p.by + Math.cos(t * 11 + p.ph * 1.3) * 1.8
      }
    } else {
      const top = mode === 'liquid' ? h * 0.42 : r
      for (const p of list) {
        if (mode === 'liquid') {
          p.vx += (Math.random() - 0.5) * 0.35 * dt
          p.vy += ((Math.random() - 0.5) * 0.35 + 0.04) * dt
          const sp = Math.hypot(p.vx, p.vy)
          if (sp > 1.2) { p.vx *= 1.2 / sp; p.vy *= 1.2 / sp }
        }
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.x < r) { p.x = r; p.vx = Math.abs(p.vx) }
        if (p.x > w - r) { p.x = w - r; p.vx = -Math.abs(p.vx) }
        if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy) }
        if (p.y > h - r) { p.y = h - r; p.vy = -Math.abs(p.vy) }
      }
      // Частицы не проходят друг сквозь друга: мягкое расталкивание
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const a = list[i]
        const b = list[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 0.01
        if (d < 2 * r) {
          const push = (2 * r - d) / 2
          a.x -= (dx / d) * push; a.y -= (dy / d) * push
          b.x += (dx / d) * push; b.y += (dy / d) * push
          if (mode === 'gas') { const vx = a.vx; const vy = a.vy; a.vx = b.vx; a.vy = b.vy; b.vx = vx; b.vy = vy }
        }
      }
    }

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#F5F9FC'
    ctx.fillRect(0, 0, w, h)
    for (const p of list) {
      dot(ctx, p.x, p.y, r, color)
      dot(ctx, p.x - r * 0.35, p.y - r * 0.35, r * 0.3, 'rgba(255,255,255,0.55)')
    }
  }, [mode])
  return <canvas ref={ref} style={{ width: '100%', height: 220, borderRadius: 16, display: 'block' }} />
}

// ── Диффузия ──────────────────────────────────────────────────────────────────

export function DiffusionSim({ temps }: { temps: number[] }) {
  const narrow = useIsNarrow()
  const [drop, setDrop] = useState(0)
  const [started, setStarted] = useState<number | null>(null)
  const [now, setNow] = useState(0)

  useEffect(() => {
    if (started === null) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [started])

  const seconds = started === null ? 0 : Math.max(0, Math.floor((now - started) / 1000))

  return (
    <div style={{ background: 'white', borderRadius: 26, padding: 18, boxShadow: '0 8px 24px rgba(38,50,56,0.1)' }}>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: narrow || temps.length === 1 ? '1fr' : `repeat(${temps.length}, minmax(0, 1fr))`, maxWidth: temps.length === 1 ? 520 : undefined, margin: '0 auto' }}>
        {temps.map((t) => (
          <div key={t} style={{ textAlign: 'center' }}>
            <Beaker temp={t} drop={drop} />
            <div style={{ fontSize: 24, fontWeight: 700, color: t >= 50 ? '#E53935' : t <= 15 ? '#1E88E5' : '#546E7A', marginTop: 8 }}>
              {t >= 50 ? '🔥' : t <= 15 ? '🧊' : '🌡️'} {t} °C
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
        <KButton big color="#7B1FA2" onClick={() => { sfx.pop(); setDrop(drop + 1); setStarted(Date.now()); setNow(Date.now()) }}>
          {drop ? 'Капнуть заново' : '💧 Капнуть краску'}
        </KButton>
        {started !== null && (
          <span style={{ fontSize: 22, fontWeight: 700, color: '#78909C' }}>⏱ {seconds} с</span>
        )}
      </div>
    </div>
  )
}

function Beaker({ temp, drop }: { temp: number; drop: number }) {
  const state = useRef<{ water: P[]; dye: P[]; drop: number } | null>(null)
  // Скорость частиц растёт с температурой: так и выглядит «горячее»
  const speed = 0.35 + (temp / 100) * 2.2

  const ref = useCanvasLoop((ctx, w, h, dt) => {
    if (!state.current || state.current.drop !== drop) {
      const water: P[] = Array.from({ length: 110 }, () => ({
        x: Math.random() * w, y: 30 + Math.random() * (h - 40), vx: 0, vy: 0, bx: 0, by: 0, ph: 0,
      }))
      const dye: P[] = drop
        ? Array.from({ length: 160 }, () => ({
          x: w / 2 + (Math.random() - 0.5) * 14, y: 36 + Math.random() * 14, vx: 0, vy: 0, bx: 0, by: 0, ph: 0,
        }))
        : []
      state.current = { water, dye, drop }
    }
    const s = state.current
    const move = (p: P, k: number) => {
      p.x += (Math.random() - 0.5) * speed * 3.4 * k * dt
      p.y += (Math.random() - 0.5) * speed * 3.4 * k * dt
      p.x = Math.min(w - 4, Math.max(4, p.x))
      p.y = Math.min(h - 4, Math.max(30, p.y))
    }
    for (const p of s.water) move(p, 1)
    for (const p of s.dye) move(p, 1)

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#E3F2FD'
    ctx.fillRect(0, 26, w, h - 26)
    for (const p of s.water) dot(ctx, p.x, p.y, 3, 'rgba(30,136,229,0.25)')
    for (const p of s.dye) dot(ctx, p.x, p.y, 3.6, 'rgba(142,36,170,0.85)')
    // Стенки стакана
    ctx.strokeStyle = '#90A4AE'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(3, 6); ctx.lineTo(3, h - 3); ctx.lineTo(w - 3, h - 3); ctx.lineTo(w - 3, 6)
    ctx.stroke()
  }, [drop, speed])

  return <canvas ref={ref} style={{ width: '100%', height: 260, display: 'block' }} />
}
