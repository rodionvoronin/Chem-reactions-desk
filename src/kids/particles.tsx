// ── Рисунки из частиц ─────────────────────────────────────────────────────────
//
// Картинка «под микроскопом» строится по формулам, а не рисуется руками:
// молекула O₂ — два одинаковых красных кружка, H₂O — красный и два белых.
// Поэтому по рисунку честно видно то, о чём спрашивают: из одного элемента
// частица или из разных, одно вещество в сосуде или несколько, стоят ли
// частицы строем или летают врассыпную.

import { useMemo } from 'react'
import { MicroScene } from './types'
import { countsOf, elementOrder } from './molecule'
import { atomColor, shade } from './kit'

interface Atom { el: string; x: number; y: number; r: number }

const radius = (el: string) => (el === 'H' ? 0.55 : ['Na', 'K', 'Ca', 'Fe', 'Cu', 'Zn', 'Mg', 'Al', 'Ag', 'Au', 'Hg', 'I', 'Cl', 'S'].includes(el) ? 0.95 : 0.8)

/** Атомы молекулы в условных единицах вокруг точки (0, 0) */
export function moleculeAtoms(formula: string): Atom[] {
  const counts = countsOf(formula)
  const order = elementOrder(formula).filter((e, i, all) => all.indexOf(e) === i)
  const list = order.flatMap((el) => Array.from({ length: counts[el] ?? 0 }, () => el))
  if (list.length === 0) return []
  if (list.length === 1) return [{ el: list[0], x: 0, y: 0, r: radius(list[0]) }]
  const gap = (a: string, b: string) => (radius(a) + radius(b)) * 0.82

  // Молекула из одинаковых атомов: пара, «уголок» или кольцо
  if (new Set(list).size === 1) {
    const el = list[0]
    const d = gap(el, el)
    if (list.length === 2) return [{ el, x: -d / 2, y: 0, r: radius(el) }, { el, x: d / 2, y: 0, r: radius(el) }]
    if (list.length === 3) {
      const a = (117 / 2) * Math.PI / 180
      return [
        { el, x: 0, y: -d * Math.cos(a) / 2, r: radius(el) },
        { el, x: -d * Math.sin(a), y: d * Math.cos(a) / 2, r: radius(el) },
        { el, x: d * Math.sin(a), y: d * Math.cos(a) / 2, r: radius(el) },
      ]
    }
    const R = d / (2 * Math.sin(Math.PI / list.length))
    return list.map((e, i) => ({ el: e, x: R * Math.cos((2 * Math.PI * i) / list.length), y: R * Math.sin((2 * Math.PI * i) / list.length), r: radius(e) }))
  }

  if (list.length === 2) {
    const d = gap(list[0], list[1])
    return [{ el: list[0], x: -d / 2, y: 0, r: radius(list[0]) }, { el: list[1], x: d / 2, y: 0, r: radius(list[1]) }]
  }

  // Центральный атом — тот, которого в молекуле один и который не водород
  const center = order.find((e) => counts[e] === 1 && e !== 'H') ?? order.find((e) => e !== 'H') ?? order[0]
  const outer = [...list]
  outer.splice(outer.indexOf(center), 1)
  const atoms: Atom[] = [{ el: center, x: 0, y: 0, r: radius(center) }]
  const linear = formula.replace(/[₂2]/g, '2') === 'CO2'
  let angles: number[]
  if (outer.length === 2) angles = linear ? [180, 0] : [180 - 37.5, 37.5].map((a) => a + 180)
  else if (outer.length === 3) angles = [270, 30, 150]
  else if (outer.length === 4) angles = [0, 90, 180, 270]
  else angles = outer.map((_, i) => (360 * i) / outer.length - 90)
  outer.forEach((el, i) => {
    const t = (angles[i] * Math.PI) / 180
    const d = gap(center, el)
    atoms.push({ el, x: d * Math.cos(t), y: d * Math.sin(t), r: radius(el) })
  })
  return atoms
}

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

function hash(text: string): number {
  let h = 2166136261
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return h >>> 0
}

const W = 30
const H = 21

interface Unit { atoms: Atom[]; x: number; y: number; rot: number }

/**
 * Твёрдое тело из атомов разных элементов (NaCl) рисуется решёткой, где
 * атомы чередуются, а не россыпью «пар»: так устроен настоящий кристалл.
 */
function ionicLattice(formula: string): string[] | null {
  const c = countsOf(formula)
  const els = Object.keys(c)
  return els.length === 2 && c[els[0]] === 1 && c[els[1]] === 1 ? els : null
}

export function layoutScene(scene: MicroScene, seedText: string): Unit[] {
  const rand = rng(hash(seedText))
  let units: Array<{ atoms: Atom[]; pair?: string[] }> = []
  for (const p of scene.parts) {
    const lattice = scene.state === 'solid' ? ionicLattice(p.formula) : null
    for (let i = 0; i < p.n; i++) {
      if (lattice) units.push({ atoms: [], pair: lattice })
      else units.push({ atoms: moleculeAtoms(p.formula) })
    }
  }
  const span = (u: { atoms: Atom[] }) => Math.max(1, ...u.atoms.map((a) => Math.hypot(a.x, a.y) + a.r))

  if (scene.state === 'solid') {
    // Решётка у дна: ионные пары раскладываются на чередующиеся атомы
    const pair = units.find((u) => u.pair)?.pair
    const count = pair ? units.length * 2 : units.length
    const cellSpan = pair ? Math.max(radius(pair[0]), radius(pair[1])) : Math.max(...units.map(span))
    const step = cellSpan * 2 + 0.15
    const cols = Math.max(1, Math.min(Math.floor((W - 2) / step), Math.ceil(Math.sqrt(count * 1.6))))
    const x0 = (W - (cols - 1) * step) / 2
    const y0 = H - 1.4 - cellSpan
    return Array.from({ length: count }, (_, k) => {
      const r = Math.floor(k / cols)
      const c = k % cols
      // В ионном кристалле соседи по строке и столбцу — атомы разных элементов
      const atoms = pair
        ? [{ el: pair[(r + c) % 2], x: 0, y: 0, r: radius(pair[(r + c) % 2]) }]
        : units[k].atoms
      return { atoms, x: x0 + c * step, y: y0 - r * step, rot: 0 }
    })
  }

  units = [...units].sort(() => rand() - 0.5)
  const out: Unit[] = []
  // Жидкость — частицы вплотную в нижней части сосуда, газ — по всему сосуду
  const minGap = scene.state === 'liquid' ? 1.02 : 1.9
  const top = scene.state === 'liquid' ? H * (1 - Math.min(0.8, 0.12 + units.length * 0.045)) : 1
  for (const u of units) {
    const R = span(u)
    let best: { x: number; y: number } | null = null
    let bestScore = -1
    for (let t = 0; t < 400; t++) {
      const x = R + 0.5 + rand() * (W - 2 * R - 1)
      const y = Math.max(top, R + 0.5) + rand() * (H - R - 0.5 - Math.max(top, R + 0.5))
      const d = Math.min(99, ...out.map((o) => Math.hypot(o.x - x, o.y - y) - span(o) - R))
      if (d >= minGap - 1) { best = { x, y }; break }
      if (d > bestScore) { bestScore = d; best = { x, y } }
    }
    out.push({ atoms: u.atoms, x: best!.x, y: best!.y, rot: rand() * 360 })
  }
  return out
}

/** Сосуд с частицами. size — ширина рисунка в пикселях */
export function SceneView({ scene, seed, size = 460, label }: { scene: MicroScene; seed: string; size?: number; label?: string }) {
  const units = useMemo(() => layoutScene(scene, seed), [scene, seed])
  const k = size / W
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={H * k} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <rect x={0.2} y={0.2} width={W - 0.4} height={H - 0.4} rx={2.2} fill="#F7FBFF" stroke="#B0BEC5" strokeWidth={0.25}
          strokeDasharray={scene.state === 'gas' ? '0.8 0.6' : undefined} />
        {units.map((u, i) => (
          <g key={i} transform={`translate(${u.x} ${u.y}) rotate(${u.rot})`}>
            {u.atoms.map((a, j) => (
              <g key={j}>
                <circle cx={a.x} cy={a.y} r={a.r} fill={atomColor(a.el)} stroke={shade(atomColor(a.el), 0.6)} strokeWidth={0.12} />
                <circle cx={a.x - a.r * 0.32} cy={a.y - a.r * 0.32} r={a.r * 0.28} fill="white" opacity={0.35} />
              </g>
            ))}
          </g>
        ))}
      </svg>
      {label && <div style={{ fontSize: 18, fontWeight: 700, color: '#78909C' }}>{label}</div>}
    </div>
  )
}

/** Подпись-легенда: какой цвет у какого элемента на рисунке */
export function Legend({ scenes }: { scenes: MicroScene[] }) {
  const els = [...new Set(scenes.flatMap((s) => s.parts.flatMap((p) => elementOrder(p.formula))))]
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
      {els.map((el) => (
        <span key={el} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 700, color: '#455A64' }}>
          <span style={{ width: 20, height: 20, borderRadius: 10, background: atomColor(el), border: `2px solid ${shade(atomColor(el), 0.6)}` }} />
          {el}
        </span>
      ))}
    </div>
  )
}
