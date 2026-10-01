import { useState, useRef, CSSProperties } from 'react'
import { ChartGame as Game, ChartSeries } from '../types'
import { QuizGame } from './QuizGame'
import { fmt } from '../molecule'
import { useIsNarrow } from '../../useViewport'

/** Значение ряда при температуре t — линейно между точками таблицы */
function valueAt(s: ChartSeries, t: number): number {
  const pts = s.points
  for (let i = 1; i < pts.length; i++) {
    const [t0, v0] = pts[i - 1]
    const [t1, v1] = pts[i]
    if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0)
  }
  return pts[pts.length - 1][1]
}

/**
 * График растворимости. Температуру выбирают ползунком или пальцем прямо по
 * графику — вертикальная линия показывает, сколько граммов каждого вещества
 * растворится. Для тех, кому удобнее числа, есть таблица.
 */
export function ChartGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const narrow = useIsNarrow()
  const [t, setT] = useState(20)
  const [table, setTable] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const W = 900
  const H = 440
  // Справа место под подписи линий: «Калийная селитра» — самая длинная
  const pad = { l: 64, r: 200, t: 20, b: 52 }
  const maxY = 500
  const x = (v: number) => pad.l + (v / 100) * (W - pad.l - pad.r)
  const y = (v: number) => H - pad.b - (v / maxY) * (H - pad.t - pad.b)

  const fromPointer = (clientX: number) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const vx = ((clientX - rect.left) / rect.width) * W
    const temp = Math.round(((vx - pad.l) / (W - pad.l - pad.r)) * 100)
    setT(Math.max(0, Math.min(100, temp)))
  }

  // Подписи у концов линий не должны налезать друг на друга
  const ends = game.series.map((s) => ({ s, yy: y(s.points[s.points.length - 1][1]) })).sort((a, b) => a.yy - b.yy)
  for (let i = 1; i < ends.length; i++) if (ends[i].yy - ends[i - 1].yy < 24) ends[i].yy = ends[i - 1].yy + 24

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#fcfcfb', borderRadius: 26, padding: narrow ? 12 : 20, boxShadow: '0 8px 24px rgba(38,50,56,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 6 }}>
          <div style={{ fontSize: narrow ? 19 : 24, fontWeight: 700, color: '#0b0b0b' }}>Растворимость в 100 г воды</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 16, color: '#52514e' }}>
            {game.series.map((s) => (
              <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 18, height: 3, borderRadius: 2, background: s.color }} /> {s.name}
              </span>
            ))}
          </div>
          <button
            onClick={() => setTable(!table)}
            style={{
              marginLeft: 'auto', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, color: '#52514e',
              border: '2px solid #CFD8DC', background: 'white', borderRadius: 999, padding: '6px 14px', cursor: 'pointer',
            }}
          >
            {table ? 'График' : 'Таблица'}
          </button>
        </div>

        {table ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 19, color: '#0b0b0b' }}>
            <thead>
              <tr>
                <th style={th}>Температура, °C</th>
                {game.series.map((s) => <th key={s.name} style={th}>{s.name}, г</th>)}
              </tr>
            </thead>
            <tbody>
              {game.series[0].points.map(([temp], i) => (
                <tr key={temp}>
                  <td style={td}>{temp}</td>
                  {game.series.map((s) => <td key={s.name} style={td}>{fmt(s.points[i][1])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: 'auto', touchAction: 'none', cursor: 'crosshair', display: 'block' }}
            onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); fromPointer(e.clientX) }}
            onPointerMove={(e) => { if (e.buttons || e.pointerType === 'mouse') fromPointer(e.clientX) }}
          >
            {/* Сетка и оси — тихие, чтобы не спорить с линиями */}
            {[0, 100, 200, 300, 400, 500].map((v) => (
              <g key={v}>
                <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#E8E8E6" strokeWidth={1} />
                <text x={pad.l - 10} y={y(v)} textAnchor="end" dominantBaseline="central" fontSize={15} fill="#52514e">{v}</text>
              </g>
            ))}
            {[0, 20, 40, 60, 80, 100].map((v) => (
              <text key={v} x={x(v)} y={H - pad.b + 24} textAnchor="middle" fontSize={15} fill="#52514e">{v}</text>
            ))}
            <text x={(pad.l + W - pad.r) / 2} y={H - 6} textAnchor="middle" fontSize={15} fill="#52514e">температура, °C</text>
            <text x={16} y={pad.t + (H - pad.t - pad.b) / 2} textAnchor="middle" fontSize={15} fill="#52514e" transform={`rotate(-90 16 ${pad.t + (H - pad.t - pad.b) / 2})`}>граммов</text>

            {game.series.map((s) => (
              <g key={s.name}>
                <polyline
                  points={s.points.map(([a, b]) => `${x(a)},${y(b)}`).join(' ')}
                  fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
                />
                {s.points.map(([a, b]) => (
                  <circle key={a} cx={x(a)} cy={y(b)} r={4.5} fill={s.color} stroke="#fcfcfb" strokeWidth={2} />
                ))}
              </g>
            ))}
            {ends.map(({ s, yy }) => (
              <text key={s.name} x={W - pad.r + 12} y={yy} dominantBaseline="central" fontSize={16} fontWeight={700} fill="#0b0b0b">
                {s.name}
              </text>
            ))}

            {/* Перекрестье выбранной температуры */}
            <line x1={x(t)} x2={x(t)} y1={pad.t} y2={H - pad.b} stroke="#0b0b0b" strokeWidth={1.5} strokeDasharray="5 5" />
            {game.series.map((s) => (
              <circle key={s.name} cx={x(t)} cy={y(valueAt(s, t))} r={7} fill={s.color} stroke="#fcfcfb" strokeWidth={2.5} />
            ))}
          </svg>
        )}

        {/* Показания при выбранной температуре */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginTop: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 20, fontWeight: 700, color: '#0b0b0b', flex: '1 1 300px' }}>
            🌡️ {t} °C
            <input
              type="range" min={0} max={100} step={1} value={t}
              onChange={(e) => setT(+e.target.value)}
              style={{ flex: 1, height: 32, accentColor: '#0b0b0b' }}
            />
          </label>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {game.series.map((s) => (
              <span key={s.name} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 18, color: '#0b0b0b',
                background: 'white', border: '1px solid #E8E8E6', borderRadius: 12, padding: '6px 12px',
              }}>
                <span style={{ width: 12, height: 12, borderRadius: 6, background: s.color }} />
                {s.name}: <b>{fmt(Math.round(valueAt(s, t)))} г</b>
              </span>
            ))}
          </div>
        </div>
      </div>

      <QuizGame game={{ kind: 'quiz', questions: game.questions }} onFinish={onFinish} />
    </div>
  )
}

const th: CSSProperties = { textAlign: 'left', padding: '8px 10px', borderBottom: '2px solid #E8E8E6', color: '#52514e', fontSize: 16 }
const td: CSSProperties = { padding: '8px 10px', borderBottom: '1px solid #F0F0EE' }
