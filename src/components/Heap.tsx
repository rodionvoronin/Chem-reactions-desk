// ── Горка на огнеупорной плитке ───────────────────────────────────────────────
//
// Третья посуда стола рядом с пробиркой и горелкой. Сухие порошки насыпают
// горкой и поджигают: термит, горение магния, сплавление с серой. В пробирке
// такие реакции не видны, а здесь видно само превращение — вспышка, искры,
// раскалённая масса остывает, у основания остаётся королёк металла.
//
// Состояние — та же TubeState (vessel: 'heap', всегда сухая), реакции идут
// через общий движок. Вид после реакции считает src/heap.ts по уравнению.

import { useMemo } from 'react'
import { TubeState, formatContents } from './TestTube'
import { heapVisual } from '../heap'

const FONT = "'Montserrat', system-ui, sans-serif"

interface Props {
  tube: TubeState
  /** Номер среди горок стола */
  index: number
  selected: boolean
  onSelect: () => void
  /** Высота пробирки на столе — горка подстраивается под неё */
  height: number
}

/** Детерминированный генератор: крупинки не прыгают при каждом рендере */
function random(seed: number) {
  let t = seed
  return () => {
    t = (t + 0x6D2B79F5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function averageColor(colors: string[]): string {
  const rgb = colors
    .map((c) => c.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => [1, 2, 3].map((i) => parseInt(m[i], 16)))
  if (rgb.length === 0) return '#BDBDBD'
  const mean = [0, 1, 2].map((i) => Math.round(rgb.reduce((s, c) => s + c[i], 0) / rgb.length))
  return `rgb(${mean.join(',')})`
}

export function Heap({ tube, index, selected, onSelect, height }: Props) {
  const { id, contents, gasActive, gasFill, gasStroke } = tube
  const visual = useMemo(() => heapVisual(contents), [contents])

  const H = Math.round(height * 0.74)
  const W = Math.round(height * 0.8)
  const k = H / 300
  const cx = W / 2
  const tileH = 14 * k
  const base = H - tileH - 2
  const portions = visual.grains.length
  const pw = W * 0.72
  const ph = portions === 0 ? 0 : Math.min(H * 0.42, H * (0.12 + 0.07 * portions))
  const mound = `M ${cx - pw / 2} ${base} Q ${cx} ${base - 2 * ph} ${cx + pw / 2} ${base} Z`
  const heated = contents.includes('heat')

  // Ключ анимации: меняется при каждом новом действии — вспышка играет заново
  const runKey = contents.join('|')

  const grains = useMemo(() => {
    const rnd = random(portions * 7919 + 17)
    const count = Math.min(90, 26 + portions * 16)
    return Array.from({ length: count }, (_, j) => {
      const x = rnd() * 2 - 1
      const h = ph * (1 - x * x)
      return {
        x: cx + x * pw / 2 * 0.94,
        y: base - 2 - rnd() * Math.max(0, h - 4),
        r: (1.6 + rnd() * 1.8) * k,
        color: visual.grains[j % Math.max(1, portions)],
      }
    })
  }, [portions, ph, pw, cx, base, k, visual.grains])

  const sparks = useMemo(() => {
    const rnd = random(4242 + portions)
    return Array.from({ length: 18 }, (_, i) => {
      const angle = Math.PI * (0.08 + 0.84 * rnd())
      const dist = (70 + rnd() * 90) * k
      return {
        dx: Math.cos(angle) * dist * (i % 2 ? 1 : -1),
        dy: -Math.sin(angle) * dist,
        delay: rnd() * 0.5,
        dur: 0.7 + rnd() * 0.6,
        r: (1.4 + rnd() * 1.6) * k,
      }
    })
  }, [portions, k])

  const burn = visual.reacted ? visual.burn : null
  const peakY = base - ph

  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        cursor: 'pointer', userSelect: 'none',
        padding: '10px 6px 8px', borderRadius: 14,
        background: selected ? 'rgba(33,150,243,0.09)' : 'transparent',
        border: selected ? '2px solid #42A5F5' : '2px solid transparent',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <div
        style={{
          minHeight: 38, width: W + 22,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6,
          fontFamily: FONT, fontSize: Math.round(Math.min(17, 13 * (height / 300))), fontWeight: 700,
          color: '#37474F', textAlign: 'center', lineHeight: 1.35, overflowWrap: 'break-word',
        }}
        dangerouslySetInnerHTML={{ __html: formatContents(tube) }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id={`mound-${id}`}><path d={mound} /></clipPath>
          <radialGradient id={`flash-${id}`}>
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
            <stop offset="30%" stopColor="#FFF59D" stopOpacity={0.95} />
            <stop offset="60%" stopColor="#FFB300" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#FF6D00" stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`heat-${id}`} cx="50%" cy="85%" r="70%">
            <stop offset="0%" stopColor="#FFF176" stopOpacity={0.95} />
            <stop offset="45%" stopColor="#FF6D00" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#BF360C" stopOpacity={0.55} />
          </radialGradient>
          <radialGradient id={`bead-${id}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
            <stop offset="35%" stopColor={visual.bead ?? '#9E9E9E'} />
            <stop offset="100%" stopColor="#263238" />
          </radialGradient>
          <style>{`
            @keyframes heapflash-${id} {
              0%   { transform: scale(0.2); opacity: 0; }
              12%  { transform: scale(1);   opacity: 1; }
              100% { transform: scale(1.5); opacity: 0; }
            }
            @keyframes heapcool-${id} {
              0%   { opacity: 0.95; }
              100% { opacity: 0; }
            }
            @keyframes heapfade-${id} {
              0%   { opacity: 0; }
              100% { opacity: 1; }
            }
            @keyframes heapswell-${id} {
              0%   { transform: scale(0.55, 0.45); }
              100% { transform: scale(1.15, 1.35); }
            }
            @keyframes heapsmoke-${id} {
              0%   { transform: translateY(0) scale(0.5); opacity: 0.9; }
              60%  { opacity: 0.5; }
              100% { transform: translateY(-${Math.round(150 * k)}px) scale(3); opacity: 0; }
            }
            ${sparks.map((s, i) => `
            @keyframes heapspark-${id}-${i} {
              0%   { transform: translate(0, 0); opacity: 1; }
              100% { transform: translate(${s.dx.toFixed(1)}px, ${s.dy.toFixed(1)}px); opacity: 0; }
            }`).join('')}
          `}</style>
        </defs>

        {/* Огнеупорная плитка */}
        <ellipse cx={cx} cy={base + 1} rx={W * 0.47} ry={6 * k} fill="#CFD8DC" />
        <rect x={cx - W * 0.47} y={base} width={W * 0.94} height={tileH} rx={3 * k}
          fill="#ECEFF1" stroke="#B0BEC5" strokeWidth={1.5} />
        <line x1={cx - W * 0.45} y1={base + 2} x2={cx + W * 0.45} y2={base + 2}
          stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} />

        {portions > 0 && (
          <g key={runKey}>
            {/* Горка до реакции: пёстрая смесь крупинок */}
            <g style={visual.reacted
              ? { animation: `heapcool-${id} 0.9s ease-in forwards` }
              : undefined}>
              <path d={mound} fill={averageColor(visual.grains)} />
              <g clipPath={`url(#mound-${id})`}>
                {grains.map((g, i) => <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={g.color} />)}
              </g>
              <path d={mound} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={1} />
            </g>

            {/* После реакции: масса продукта */}
            {visual.reacted && (
              <g style={{
                transformBox: 'fill-box', transformOrigin: '50% 100%',
                animation: burn === 'volcano'
                  ? `heapswell-${id} 2.6s ease-out forwards, heapfade-${id} 0.6s ease-out forwards`
                  : `heapfade-${id} 1s ease-out 0.35s both`,
              }}>
                <path d={mound} fill={visual.slag} />
                <g clipPath={`url(#mound-${id})`}>
                  {grains.filter((_, i) => i % 3 === 0).map((g, i) => (
                    <circle key={i} cx={g.x} cy={g.y} r={g.r} fill="rgba(0,0,0,0.10)" />
                  ))}
                </g>
                <path d={mound} fill="none" stroke="rgba(0,0,0,0.20)" strokeWidth={1} />
              </g>
            )}

            {/* Королёк металла у основания */}
            {visual.reacted && visual.bead && (
              <ellipse
                cx={cx} cy={base - 5 * k} rx={pw * 0.15} ry={7 * k}
                fill={`url(#bead-${id})`} stroke="rgba(0,0,0,0.35)" strokeWidth={1}
                style={{ animation: `heapfade-${id} 0.8s ease-out 1.2s both` }}
              />
            )}

            {/* Раскалённая масса остывает */}
            {burn && (
              <path d={mound} fill={`url(#heat-${id})`}
                style={{ animation: `heapcool-${id} ${burn === 'flash' ? 4.5 : 3.5}s ease-in 0.2s both` }} />
            )}

            {/* Вспышка */}
            {burn === 'flash' && (
              <circle cx={cx} cy={peakY} r={W * 0.55} fill={`url(#flash-${id})`}
                style={{
                  transformBox: 'fill-box', transformOrigin: 'center',
                  animation: `heapflash-${id} 1.9s ease-out forwards`, mixBlendMode: 'screen',
                }} />
            )}

            {/* Искры: у вспышки — во все стороны, у «вулкана» и свечения — редкие */}
            {burn && sparks.slice(0, burn === 'glow' ? 6 : sparks.length).map((s, i) => (
              <circle key={i} cx={cx + (i % 5 - 2) * 4 * k} cy={peakY} r={s.r}
                fill={i % 3 ? '#FFD54F' : '#FFFFFF'} stroke="#FF8F00" strokeWidth={0.6}
                style={{
                  animation: `heapspark-${id}-${i} ${s.dur}s ease-out ${s.delay}s ${burn === 'glow' ? 2 : 3} both`,
                }} />
            ))}

            {/* Газ, дым, пары иода */}
            {gasActive && [0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx={cx + (i - 2) * 9 * k} cy={peakY - 4} r={(10 + (i % 3) * 5) * k}
                fill={gasFill} stroke={gasStroke} strokeWidth={1}
                style={{
                  transformBox: 'fill-box', transformOrigin: 'center',
                  animation: `heapsmoke-${id} ${2 + (i % 3) * 0.4}s ease-out ${0.3 + i * 0.35}s 4 both`,
                }} />
            ))}
          </g>
        )}

        {portions === 0 && (
          <text x={cx} y={base - 14 * k} textAnchor="middle" fontFamily={FONT}
            fontSize={12 * k} fill="#B0BEC5">
            насыпьте порошки
          </text>
        )}
      </svg>

      <div style={{
        marginTop: 8, fontFamily: FONT, fontSize: 12.5, fontWeight: 600,
        color: selected ? '#1565C0' : '#90A4AE', display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {heated && <span title="Подожжена">🔥</span>}
        Горка {index + 1}
      </div>
    </div>
  )
}
