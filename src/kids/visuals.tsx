// ── Схемы и живые модели для шагов урока ──────────────────────────────────────

import { useState } from 'react'
import { Visual, ElementCard } from './types'
import { StatesSim, DiffusionSim } from './games/SimGame'
import { VesselView } from './games/Vessel'
import { makeVessel, addTo, kidName } from './lab'
import { MoleculeView } from './games/BuildGame'
import { BUILD_TARGETS } from './bank'
import { CARD_MAP, elementOf, cardColor } from './elements'
import { KFONT, sfx } from './kit'

export function VisualView({ visual }: { visual: Visual }) {
  switch (visual.type) {
    case 'emoji':
      return (
        <div style={{ fontSize: 'clamp(48px, 7vw, 110px)', textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.25 }}>
          {visual.value}
        </div>
      )
    case 'sim':
      return visual.sim === 'states' ? <StatesSim /> : <DiffusionSim temps={visual.beakers ?? [20]} />
    case 'air': return <AirGrid />
    case 'ph': return <PhScale />
    case 'fire': return <FireTriangle />
    case 'zoom': return <ZoomWater />
    case 'molecules':
      return (
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {visual.ids.map((id) => {
            const t = BUILD_TARGETS.find((x) => x.id === id)!
            return (
              <div key={id} style={{ textAlign: 'center' }}>
                <MoleculeView target={t} unit={46} />
                <div style={{ fontSize: 30, fontWeight: 700, color: '#283593' }}>{t.formula}</div>
                <div style={{ fontSize: 17, color: '#78909C' }}>{t.name}</div>
              </div>
            )
          })}
        </div>
      )
    case 'elements':
      return (
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {visual.symbols.map((s) => <ElementCardView key={s} card={CARD_MAP[s]} size="md" />)}
        </div>
      )
    case 'cell': return <CellAnatomy symbol={visual.symbol} />
    case 'tube': return <TubeVisual contents={visual.contents} heap={visual.heap} label={visual.label} />
  }
}

/**
 * Пробирка, нарисованная движком реакций: состав задаётся, а вид — осадок,
 * цвет, пузырьки — считает тот же движок, что и на лабораторном столе.
 */
function TubeVisual({ contents, heap, label }: { contents: string[]; heap?: boolean; label?: string }) {
  const tube = addTo(makeVessel('visual-' + contents.join('-'), contents.slice(0, 1), heap), contents.slice(1))
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <VesselView tube={tube} label={label ?? contents.filter((c) => c !== 'heat' && c !== 'air').map(kidName).join(' + ')} height={280} />
    </div>
  )
}

// ── Карточка элемента ─────────────────────────────────────────────────────────

/** Карточка элемента: как клетка таблицы Менделеева, только крупная и цветная */
export function ElementCardView({ card, size }: { card: ElementCard; size: 'sm' | 'md' | 'lg' | 'fill' }) {
  const el = elementOf(card.symbol)
  const { bg, fg } = cardColor(card)
  const w = size === 'sm' ? 130 : size === 'md' ? 170 : size === 'lg' ? 240 : undefined
  const k = size === 'sm' ? 0.75 : size === 'lg' ? 1.4 : 1
  return (
    <div style={{
      width: w ?? '100%', aspectRatio: '3 / 4', borderRadius: 22 * k, position: 'relative',
      background: `linear-gradient(160deg, white 0%, ${bg} 100%)`, border: `${Math.max(3, 4 * k)}px solid ${fg}`,
      boxShadow: `0 ${6 * k}px 0 ${fg}55`, padding: 12 * k,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: KFONT, color: fg,
    }}>
      <div style={{ position: 'absolute', top: 10 * k, left: 12 * k, fontSize: 18 * k, fontWeight: 700 }}>{el.z}</div>
      <div style={{ position: 'absolute', top: 8 * k, right: 10 * k, fontSize: 24 * k }}>{card.emoji}</div>
      <div style={{ fontSize: 66 * k, fontWeight: 700, lineHeight: 1.05 }}>{card.symbol}</div>
      <div style={{ fontSize: 17 * k, fontWeight: 700, color: '#37474F' }}>{el.name}</div>
      <div style={{ fontSize: 14 * k, color: '#78909C' }}>«{card.say}»</div>
      <div style={{ fontSize: 12 * k, color: '#90A4AE', marginTop: 4 * k }}>{el.mass}</div>
    </div>
  )
}

/** Клетка таблицы с подписанными частями */
function CellAnatomy({ symbol }: { symbol: string }) {
  const el = elementOf(symbol)
  const tag = (text: string, color: string) => (
    <div style={{ fontSize: 20, fontWeight: 700, color, whiteSpace: 'nowrap' }}>{text}</div>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
      {/* Подписи слева и справа стоят на уровне своих частей клетки */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: 250, justifyContent: 'space-between', padding: '12px 0 120px' }}>
        {tag('порядковый номер →', '#E65100')}
        {tag('знак элемента →', '#1565C0')}
      </div>
      <div style={{
        position: 'relative', width: 210, height: 250, borderRadius: 20, border: '5px solid #6D4C41', background: '#FFF8E1',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: KFONT,
      }}>
        <div style={{ position: 'absolute', top: 10, left: 16, fontSize: 30, fontWeight: 700, color: '#E65100' }}>{el.z}</div>
        <div style={{ fontSize: 96, fontWeight: 700, color: '#1565C0', lineHeight: 1 }}>{el.symbol}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#37474F', marginTop: 6 }}>{el.name}</div>
        <div style={{ fontSize: 22, color: '#2E7D32', fontWeight: 700, marginTop: 4 }}>{el.mass}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', height: 250, justifyContent: 'flex-end', gap: 14, paddingBottom: 30 }}>
        {tag('← название', '#37474F')}
        {tag('← относительная атомная масса', '#2E7D32')}
      </div>
    </div>
  )
}

// ── Воздух и индикатор ────────────────────────────────────────────────────────

/** Сто частиц воздуха: 78 азота, 21 кислорода и одна — всё остальное */
export function AirGrid() {
  const cells = [
    ...Array.from({ length: 78 }, () => '#90CAF9'),
    ...Array.from({ length: 21 }, () => '#EF5350'),
    '#FFCA28',
  ]
  return (
    <div style={{ maxWidth: 460, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 5 }}>
        {cells.map((c, i) => (
          <div key={i} style={{ aspectRatio: '1', borderRadius: '50%', background: c, boxShadow: 'inset -3px -3px 6px rgba(0,0,0,0.15)' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 12, fontSize: 19, color: '#37474F', justifyContent: 'center' }}>
        <span><b style={{ color: '#1E88E5' }}>●</b> азот — 78</span>
        <span><b style={{ color: '#E53935' }}>●</b> кислород — 21</span>
        <span><b style={{ color: '#F9A825' }}>●</b> аргон и другие — 1</span>
      </div>
    </div>
  )
}

/** Цвета капустного индикатора от кислой среды к щелочной */
export function PhScale() {
  const steps = [
    { color: '#E91E63', label: 'лимон, уксус' },
    { color: '#F06292', label: 'кефир, яблоко' },
    { color: '#7E57C2', label: 'вода' },
    { color: '#26A69A', label: 'сода' },
    { color: '#43A047', label: 'мыло' },
    { color: '#FDD835', label: 'сильные щёлочи' },
  ]
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ display: 'flex', borderRadius: 16, overflow: 'hidden', height: 70 }}>
        {steps.map((s) => <div key={s.color} style={{ flex: 1, background: s.color }} />)}
      </div>
      <div style={{ display: 'flex', fontSize: 16, color: '#455A64', marginTop: 6 }}>
        {steps.map((s) => <div key={s.color} style={{ flex: 1, textAlign: 'center', padding: '0 2px' }}>{s.label}</div>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 19, fontWeight: 700, marginTop: 8 }}>
        <span style={{ color: '#E91E63' }}>← кислая</span>
        <span style={{ color: '#7E57C2' }}>нейтральная</span>
        <span style={{ color: '#2E7D32' }}>щелочная →</span>
      </div>
    </div>
  )
}

// ── Треугольник огня ──────────────────────────────────────────────────────────

const SIDES = [
  { id: 'fuel', label: 'Горючее', emoji: '🪵', how: 'Убрали дрова — огню нечем «питаться».' },
  { id: 'oxygen', label: 'Кислород', emoji: '🫧', how: 'Накрыли крышкой — кончился кислород.' },
  { id: 'heat', label: 'Нагрев', emoji: '🌡️', how: 'Залили водой — остыло ниже температуры воспламенения.' },
] as const

/** Нажимайте на стороны: пламя горит, только пока на месте все три */
function FireTriangle() {
  const [off, setOff] = useState<string | null>(null)
  const burning = off === null
  const side = SIDES.find((s) => s.id === off)
  return (
    <div style={{ display: 'flex', gap: 30, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 300 270" style={{ width: 300, maxWidth: '100%' }}>
        {[
          { id: 'fuel', x1: 40, y1: 240, x2: 260, y2: 240 },
          { id: 'oxygen', x1: 40, y1: 240, x2: 150, y2: 40 },
          { id: 'heat', x1: 150, y1: 40, x2: 260, y2: 240 },
        ].map((l) => (
          <line key={l.id} {...l} stroke={off === l.id ? '#E0E0E0' : '#E65100'} strokeWidth={14} strokeLinecap="round"
            strokeDasharray={off === l.id ? '4 20' : undefined} style={{ transition: 'stroke 0.3s' }} />
        ))}
        <text x="150" y="200" textAnchor="middle" fontSize={burning ? 90 : 70} style={{ transition: 'font-size 0.3s' }}>
          {burning ? '🔥' : '💨'}
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 280 }}>
        {SIDES.map((s) => (
          <button
            key={s.id}
            onClick={() => { sfx.pop(); setOff(off === s.id ? null : s.id) }}
            style={{
              fontFamily: KFONT, fontSize: 22, fontWeight: 700, padding: '14px 18px', borderRadius: 16, cursor: 'pointer',
              border: `3px solid ${off === s.id ? '#B0BEC5' : '#E65100'}`,
              background: off === s.id ? '#ECEFF1' : '#FFF3E0', color: off === s.id ? '#90A4AE' : '#BF360C',
              textDecoration: off === s.id ? 'line-through' : 'none', textAlign: 'left',
            }}
          >
            {s.emoji} {s.label}
          </button>
        ))}
        <div style={{ fontSize: 19, fontWeight: 700, color: burning ? '#E65100' : '#1565C0', minHeight: 54, maxWidth: 320 }}>
          {burning ? 'Все три на месте — огонь горит.' : `Огонь погас! ${side?.how}`}
        </div>
      </div>
    </div>
  )
}

// ── Приближаем каплю ──────────────────────────────────────────────────────────

const ZOOM_LEVELS = [
  { scale: '× 1', label: 'Капля воды на ладони', note: 'Около 5 мм. Прозрачная и сплошная.' },
  { scale: '× 100', label: 'Под лупой и микроскопом', note: 'Всё ещё сплошная — ни зёрнышка.' },
  { scale: '× 10 000', label: 'В самый сильный световой микроскоп', note: 'Видны разве что бактерии, а вода — по-прежнему сплошная.' },
  { scale: '× 10 000 000', label: 'Молекулы воды', note: 'Наконец-то! Вода — это множество движущихся молекул H₂O с промежутками между ними.' },
]

function ZoomWater() {
  const [level, setLevel] = useState(0)
  const z = ZOOM_LEVELS[level]
  const h2o = BUILD_TARGETS.find((t) => t.id === 'h2o')!
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 340, height: 340, borderRadius: '50%', overflow: 'hidden',
        border: '10px solid #455A64', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', position: 'relative',
        background: level === 0 ? '#FFFFFF' : '#BBDEFB', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {level === 0 && <div style={{ fontSize: 120 }}>💧</div>}
        {(level === 1 || level === 2) && (
          <div style={{ width: '100%', height: '100%', background: `radial-gradient(circle at 40% 35%, #E3F2FD, #64B5F6)` }}>
            {level === 2 && <div style={{ position: 'absolute', left: '60%', top: '30%', fontSize: 30 }}>🦠</div>}
          </div>
        )}
        {level === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, transform: 'scale(0.62)' }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="kids-pop" style={{ animationDelay: `${i * 0.06}s` }}>
                {/* Поворот — на внутреннем блоке: анимация появления сама задаёт transform */}
                <div style={{ transform: `rotate(${(i * 47) % 360}deg)` }}><MoleculeView target={h2o} unit={28} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#283593' }}>{z.scale}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#263238' }}>{z.label}</div>
      <div style={{ fontSize: 19, color: '#546E7A', maxWidth: 520, textAlign: 'center' }}>{z.note}</div>
      <input
        type="range" min={0} max={ZOOM_LEVELS.length - 1} step={1} value={level}
        onChange={(e) => { sfx.flip(); setLevel(+e.target.value) }}
        style={{ width: 'min(520px, 90%)', height: 36, accentColor: '#3949AB' }}
        aria-label="Увеличение"
      />
    </div>
  )
}

