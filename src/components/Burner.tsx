const FONT = "'Montserrat', system-ui, sans-serif"

// ── Модель горелки ────────────────────────────────────────────────────────────

export interface BurnerState {
  id: string
  flameColor: string
  metalLabel: string
  metalId: string
}

export function createBurner(id: string): BurnerState {
  return { id, flameColor: '', metalLabel: '', metalId: '' }
}

// ── Вспомогательное ───────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/)
  if (!m) return null
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
}

function lighten(hex: string, t: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#ffffff'
  return `rgb(${Math.round(rgb[0] + (255 - rgb[0]) * t)},${Math.round(rgb[1] + (255 - rgb[1]) * t)},${Math.round(rgb[2] + (255 - rgb[2]) * t)})`
}

function darken(hex: string, t: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  return `rgb(${Math.round(rgb[0] * (1 - t))},${Math.round(rgb[1] * (1 - t))},${Math.round(rgb[2] * (1 - t))})`
}

/** Внешний контур пламени: fw — полуширина, fh — высота */
function flamePath(fw: number, fh: number): string {
  return (
    `M 0,0 ` +
    `C ${-fw * 0.9},-${fh * 0.22} ${-fw * 1.1},-${fh * 0.50} ${-fw * 0.65},-${fh * 0.78} ` +
    `C ${-fw * 0.30},-${fh * 0.93} ${-fw * 0.08},-${fh} 0,-${fh} ` +
    `C ${fw * 0.08},-${fh} ${fw * 0.30},-${fh * 0.93} ${fw * 0.65},-${fh * 0.78} ` +
    `C ${fw * 1.1},-${fh * 0.50} ${fw * 0.9},-${fh * 0.22} 0,0 Z`
  )
}

/** Внутренний светлый сердечник пламени */
function innerFlamePath(fw: number, fh: number): string {
  return (
    `M 0,0 ` +
    `C ${-fw * 0.38},-${fh * 0.20} ${-fw * 0.44},-${fh * 0.46} ${-fw * 0.22},-${fh * 0.70} ` +
    `C ${-fw * 0.08},-${fh * 0.86} 0,-${fh * 0.90} 0,-${fh * 0.90} ` +
    `C 0,-${fh * 0.90} ${fw * 0.08},-${fh * 0.86} ${fw * 0.22},-${fh * 0.70} ` +
    `C ${fw * 0.44},-${fh * 0.46} ${fw * 0.38},-${fh * 0.20} 0,0 Z`
  )
}

// ── Компонент ─────────────────────────────────────────────────────────────────

interface Props {
  burner: BurnerState
  index: number
  selected: boolean
  onSelect: () => void
  /** Высота горелки в пикселях — задаётся снаружи под размер экрана */
  height: number
}

/** Отношение ширины к высоте — сохраняет пропорции при любом размере */
const ASPECT = 0.457

export function Burner({ burner, index, selected, onSelect, height }: Props) {
  const { id, flameColor, metalLabel } = burner
  const H = height
  const W = Math.round(height * ASPECT)
  const cx = W / 2
  const hasFlame = flameColor !== ''

  // Пропорции горелки Бунзена
  const baseH = 20
  const baseW = W * 0.84
  const stemW = Math.max(11, W * 0.155)
  const stemTopY = H * 0.44        // вершина трубки — основание пламени
  const stemBotY = H - baseH - 4
  const collarH = 13
  const collarW = stemW + 8
  const collarY = stemTopY + (stemBotY - stemTopY) * 0.52 - collarH / 2

  const fw = W * 0.37              // полуширина внешнего пламени
  const fh = H * 0.52              // высота пламени

  const outerPath = flamePath(fw, fh)
  const innerPath = innerFlamePath(fw * 0.50, fh * 0.80)

  const c1 = hasFlame ? flameColor : '#1E88E5'
  const c2 = hasFlame ? lighten(flameColor, 0.55) : '#90CAF9'
  const cInner = hasFlame ? lighten(flameColor, 0.80) : '#E3F2FD'
  // Тёмный оттенок пока не используется в градиенте, но нужен для подписи
  void darken

  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        cursor: 'pointer', userSelect: 'none',
        padding: '10px 6px 8px', borderRadius: 14,
        background: selected ? 'rgba(255,112,67,0.10)' : 'transparent',
        border: selected ? '2px solid #FF8A65' : '2px solid transparent',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {/* Отступ сверху под пламя, чтобы ряд не прыгал */}
      <div style={{ minHeight: 38 }} />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`fg-${id}`} x1="0" y1="0" x2="0" y2={-fh} gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={c2} stopOpacity="0.82" />
            <stop offset="42%"  stopColor={c1} stopOpacity="0.94" />
            <stop offset="100%" stopColor={c1} stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id={`fi-${id}`} x1="0" y1="0" x2="0" y2={-fh * 0.8} gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="rgba(255,240,180,0.95)" />
            <stop offset="55%"  stopColor={cInner} stopOpacity="0.90" />
            <stop offset="100%" stopColor={cInner} stopOpacity="0.20" />
          </linearGradient>

          <filter id={`glow-${id}`} x="-50%" y="-30%" width="200%" height="170%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <style>{`
            @keyframes flicker-${id} {
              0%   { transform: scaleX(1.000) translateY(0px)    skewX(0deg); }
              15%  { transform: scaleX(0.955) translateY(1.5px)  skewX(-1.8deg); }
              32%  { transform: scaleX(1.045) translateY(-1px)   skewX(1.2deg); }
              50%  { transform: scaleX(0.965) translateY(0px)    skewX(2.0deg); }
              68%  { transform: scaleX(1.030) translateY(1px)    skewX(-1.0deg); }
              85%  { transform: scaleX(0.975) translateY(-1.5px) skewX(0.6deg); }
              100% { transform: scaleX(1.000) translateY(0px)    skewX(0deg); }
            }
            @keyframes flicker2-${id} {
              0%   { transform: scaleX(1.00) scaleY(1.00); }
              30%  { transform: scaleX(0.90) scaleY(1.06); }
              60%  { transform: scaleX(1.08) scaleY(0.95); }
              100% { transform: scaleX(1.00) scaleY(1.00); }
            }
          `}</style>
        </defs>

        {/* ── Корпус ── */}
        <rect x={cx - baseW / 2} y={H - baseH} width={baseW} height={baseH} rx={5} fill="#616161" />
        <rect x={cx - baseW / 2} y={H - 9} width={baseW} height={9} rx={4} fill="#424242" />

        <rect
          x={cx - stemW / 2} y={stemTopY}
          width={stemW} height={stemBotY - stemTopY}
          rx={stemW / 2} fill="#757575"
        />
        <rect
          x={cx - stemW / 2 + 2} y={stemTopY + 6}
          width={stemW * 0.28} height={stemBotY - stemTopY - 16}
          rx={2} fill="rgba(255,255,255,0.18)"
        />

        {/* Воздушный вентиль */}
        <rect x={cx - collarW / 2} y={collarY} width={collarW} height={collarH} rx={3} fill="#5E5E5E" />
        <rect x={cx - collarW / 2} y={collarY + collarH - 5} width={collarW} height={5} rx={2} fill="#424242" />

        {/* Ободок горлышка */}
        <ellipse cx={cx} cy={stemTopY} rx={stemW / 2 + 3} ry={4.5} fill="#9E9E9E" />
        <ellipse cx={cx} cy={stemTopY} rx={stemW / 2} ry={2.5} fill="#BDBDBD" />

        {/* Синий ореол у основания — виден всегда */}
        <ellipse cx={cx} cy={stemTopY - 2} rx={stemW * 0.75} ry={5} fill="#42A5F5" opacity={0.45} />

        {/* Пламя. SVG-атрибут transform и CSS-анимацию нельзя смешивать
            на одном элементе — CSS перекроет атрибут. Поэтому два вложенных <g>:
            внешний позиционирует, внутренний анимирует. */}
        {hasFlame && (
          <g transform={`translate(${cx}, ${stemTopY})`} filter={`url(#glow-${id})`}>
            <g style={{ animation: `flicker-${id} 1.15s ease-in-out infinite`, transformOrigin: '0px 0px' }}>
              <path d={outerPath} fill={`url(#fg-${id})`} />
              <g style={{ animation: `flicker2-${id} 0.65s ease-in-out infinite`, transformOrigin: '0px 0px' }}>
                <path d={innerPath} fill={`url(#fi-${id})`} opacity={0.82} />
              </g>
            </g>
          </g>
        )}
      </svg>

      {/* Подпись иона */}
      <div style={{
        marginTop: 8, fontFamily: FONT, fontSize: 12.5, fontWeight: 600,
        color: selected ? '#BF360C' : '#90A4AE',
        display: 'flex', alignItems: 'center', gap: 5,
        minHeight: 18, textAlign: 'center',
      }}>
        {metalLabel ? (
          <>
            <span style={{
              width: 10, height: 10, borderRadius: '50%', background: flameColor,
              border: '1px solid rgba(0,0,0,0.18)', flexShrink: 0, display: 'inline-block',
            }} />
            <span style={{ color: '#37474F' }}>{metalLabel}</span>
          </>
        ) : (
          <>Горелка {index + 1}</>
        )}
      </div>
    </div>
  )
}
