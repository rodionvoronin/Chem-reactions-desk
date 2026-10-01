import { TestTube, TubeState } from '../../components/TestTube'
import { Heap } from '../../components/Heap'
import { KFONT } from '../kit'

/**
 * Сосуд на доске: пробирка или горка лабораторного стола, но без формул —
 * подпись даёт урок. Пока идёт приливание, над сосудом падает капля
 * с эмодзи реактива: класс видит, что именно и куда добавили.
 */
export function VesselView({ tube, label, height, pouring, active = false, burst = false, onClick }: {
  tube: TubeState
  label: string
  height: number
  /** Эмодзи реактива, который сейчас льётся в этот сосуд */
  pouring?: string | null
  active?: boolean
  /** Реакция только что прошла — ореол вокруг сосуда, чтобы класс увидел, где */
  burst?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '8px 12px 12px', borderRadius: 22, cursor: onClick ? 'pointer' : 'default',
        background: active ? 'rgba(57,73,171,0.08)' : 'transparent',
        border: `3px solid ${active ? '#3949AB' : 'transparent'}`, transition: 'all 0.2s',
      }}
    >
      {burst && (
        <div key={tube.contents.length} className="kids-burst" style={{
          position: 'absolute', left: '50%', top: '45%', width: 40, height: 40, borderRadius: '50%', pointerEvents: 'none',
          border: '6px solid rgba(255,193,7,0.85)', boxShadow: '0 0 40px rgba(255,193,7,0.8)', zIndex: 2,
        }} />
      )}
      {pouring && (
        <div key={pouring + tube.contents.length} className="kids-drop" style={{
          position: 'absolute', top: -10, left: '50%', fontSize: 46, zIndex: 3, pointerEvents: 'none',
        }}>
          {pouring}
        </div>
      )}
      {tube.vessel === 'heap'
        ? <Heap tube={tube} index={0} selected={false} onSelect={() => {}} height={height} bare />
        : <TestTube tube={tube} index={0} selected={false} onSelect={() => {}} height={height} bare />}
      <div style={{ fontFamily: KFONT, fontSize: 20, fontWeight: 700, color: '#37474F', textAlign: 'center', marginTop: 6, maxWidth: 220, lineHeight: 1.25 }}>
        {label}
      </div>
    </div>
  )
}
