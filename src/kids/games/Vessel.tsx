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
    <div data-vessel
      onClick={onClick}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: `8px 12px ${VESSEL_PAD_BOTTOM}px`, borderRadius: 22, cursor: onClick ? 'pointer' : 'default',
        background: active ? 'rgba(57,73,171,0.08)' : 'transparent',
        border: `${VESSEL_BORDER}px solid ${active ? '#3949AB' : 'transparent'}`, transition: 'all 0.2s',
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
      {/* Под подписью всегда место на две строки: иначе сосуд с длинной
          подписью приподнимается над соседями, выровненными по дну */}
      <div data-vessel-label style={{
        fontFamily: KFONT, fontSize: 20, fontWeight: 700, color: '#37474F', textAlign: 'center',
        marginTop: LABEL_GAP, width: 196, lineHeight: '25px', height: LABEL_H,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden',
      }}>
        {label}
      </div>
    </div>
  )
}

const VESSEL_PAD_BOTTOM = 12
const VESSEL_BORDER = 3
const LABEL_H = 50
const LABEL_GAP = 6

/**
 * Сколько пикселей от нижнего края сосуда до дна пробирки. По этому числу
 * стол рисует столешницу так, чтобы сосуды стояли на ней, а подписи целиком
 * лежали ниже линии горизонта.
 */
export const VESSEL_FOOT = VESSEL_BORDER + VESSEL_PAD_BOTTOM + LABEL_H + LABEL_GAP + 6

/**
 * Фон стола под рядом сосудов: светлая стена и столешница. Край столешницы
 * проходит чуть выше дна пробирок — сосуды стоят на столе, а подписи под
 * ними целиком лежат на столешнице, не пересекая линию горизонта.
 * padBottom — нижний отступ стола под подписями.
 */
export function tableBackground(padBottom: number): string {
  const top = padBottom + VESSEL_FOOT + 16
  return `linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 calc(100% - ${top}px), #B0BEC5 calc(100% - ${top}px), #CFD8DC calc(100% - ${top - 4}px), #DCE3E8 100%)`
}
