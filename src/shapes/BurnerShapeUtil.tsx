import { HTMLContainer, Rectangle2d, RecordProps, ShapeUtil, T, TLResizeInfo, TLShape, resizeBox } from 'tldraw'

export const BURNER_TYPE = 'burner' as const

declare module 'tldraw' {
  interface TLGlobalShapePropsMap {
    [BURNER_TYPE]: {
      w: number
      h: number
      flameColor: string
      metalLabel: string
      metalId: string
    }
  }
}

export type BurnerShape = TLShape<typeof BURNER_TYPE>

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Shape util ────────────────────────────────────────────────────────────────

export class BurnerShapeUtil extends ShapeUtil<BurnerShape> {
  static override type = BURNER_TYPE

  static override props: RecordProps<BurnerShape> = {
    w: T.number,
    h: T.number,
    flameColor: T.string,
    metalLabel: T.string,
    metalId: T.string,
  }

  getDefaultProps(): BurnerShape['props'] {
    return {
      w: 88,
      h: 190,
      flameColor: '',
      metalLabel: '',
      metalId: '',
    }
  }

  override canResize() { return true }

  override onResize(shape: BurnerShape, info: TLResizeInfo<BurnerShape>) {
    return resizeBox(shape, info)
  }

  getGeometry(shape: BurnerShape) {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true })
  }

  component(shape: BurnerShape) {
    const { w, h, flameColor, metalLabel } = shape.props
    const safeId = shape.id.replace(/[^a-zA-Z0-9]/g, '_')
    const cx = w / 2
    const hasFlame = flameColor !== ''

    // Пропорции горелки Бунзена
    const baseH = 20
    const baseW = w * 0.84
    const stemW = Math.max(11, w * 0.155)
    const stemTopY = h * 0.44       // вершина трубки (основание пламени)
    const stemBotY = h - baseH - 4
    const collarH = 13
    const collarW = stemW + 8
    const collarY = stemTopY + (stemBotY - stemTopY) * 0.52 - collarH / 2

    // Пламя
    const fw = w * 0.37             // полуширина внешнего пламени
    const fh = h * 0.52             // высота пламени

    const outerPath = flamePath(fw, fh)
    const innerPath = innerFlamePath(fw * 0.50, fh * 0.80)

    // Цвета пламени
    const c1 = hasFlame ? flameColor : '#1E88E5'
    const c2 = hasFlame ? lighten(flameColor, 0.55) : '#90CAF9'
    const c3 = hasFlame ? darken(flameColor, 0.28) : '#1565C0'
    const cInner = hasFlame ? lighten(flameColor, 0.80) : '#E3F2FD'

    return (
      <HTMLContainer id={shape.id} style={{ pointerEvents: 'none', overflow: 'visible' }}>
        <svg
          width={w} height={h}
          viewBox={`0 0 ${w} ${h}`}
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* Градиент внешнего пламени — снизу вверх */}
            <linearGradient
              id={`fg-${safeId}`}
              x1="0" y1="0" x2="0" y2={-fh}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"   stopColor={c2}  stopOpacity="0.82" />
              <stop offset="42%"  stopColor={c1}  stopOpacity="0.94" />
              <stop offset="100%" stopColor={c1}  stopOpacity="0.25" />
            </linearGradient>

            {/* Градиент внутреннего сердечника */}
            <linearGradient
              id={`fi-${safeId}`}
              x1="0" y1="0" x2="0" y2={-fh * 0.80}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"   stopColor="rgba(255,240,180,0.95)" />
              <stop offset="55%"  stopColor={cInner} stopOpacity="0.90" />
              <stop offset="100%" stopColor={cInner} stopOpacity="0.20" />
            </linearGradient>

            {/* Свечение пламени */}
            <filter id={`glow-${safeId}`} x="-50%" y="-30%" width="200%" height="170%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <style>{`
              @keyframes flicker-${safeId} {
                0%   { transform: scaleX(1.000) translateY(0px)   skewX(0deg); }
                15%  { transform: scaleX(0.955) translateY(1.5px)  skewX(-1.8deg); }
                32%  { transform: scaleX(1.045) translateY(-1px)  skewX(1.2deg); }
                50%  { transform: scaleX(0.965) translateY(0px)   skewX(2.0deg); }
                68%  { transform: scaleX(1.030) translateY(1px)   skewX(-1.0deg); }
                85%  { transform: scaleX(0.975) translateY(-1.5px) skewX(0.6deg); }
                100% { transform: scaleX(1.000) translateY(0px)   skewX(0deg); }
              }
              @keyframes flicker2-${safeId} {
                0%   { transform: scaleX(1.00) scaleY(1.00); }
                30%  { transform: scaleX(0.90) scaleY(1.06); }
                60%  { transform: scaleX(1.08) scaleY(0.95); }
                100% { transform: scaleX(1.00) scaleY(1.00); }
              }
            `}</style>
          </defs>

          {/* ── Корпус горелки ── */}

          {/* Нижняя плита */}
          <rect
            x={cx - baseW / 2} y={h - baseH}
            width={baseW} height={baseH}
            rx={5} fill="#616161"
          />
          <rect
            x={cx - baseW / 2} y={h - 9}
            width={baseW} height={9}
            rx={4} fill="#424242"
          />

          {/* Вертикальная трубка */}
          <rect
            x={cx - stemW / 2} y={stemTopY}
            width={stemW} height={stemBotY - stemTopY}
            rx={stemW / 2} fill="#757575"
          />
          {/* Блик на трубке */}
          <rect
            x={cx - stemW / 2 + 2} y={stemTopY + 6}
            width={stemW * 0.28} height={stemBotY - stemTopY - 16}
            rx={2} fill="rgba(255,255,255,0.18)"
          />

          {/* Воздушный вентиль */}
          <rect
            x={cx - collarW / 2} y={collarY}
            width={collarW} height={collarH}
            rx={3} fill="#5E5E5E"
          />
          <rect
            x={cx - collarW / 2} y={collarY + collarH - 5}
            width={collarW} height={5}
            rx={2} fill="#424242"
          />

          {/* Кольцо-ободок горлышка */}
          <ellipse cx={cx} cy={stemTopY} rx={stemW / 2 + 3} ry={4.5} fill="#9E9E9E" />
          <ellipse cx={cx} cy={stemTopY} rx={stemW / 2} ry={2.5} fill="#BDBDBD" />

          {/* ── Пламя ── */}

          {/* Маленький синий ореол у основания (всегда) */}
          <ellipse cx={cx} cy={stemTopY - 2} rx={stemW * 0.75} ry={5} fill="#42A5F5" opacity={0.45} />

          {/* Основное цветное пламя */}
          {hasFlame && (
            // ВАЖНО: SVG-атрибут transform и CSS-анимация с transform нельзя смешивать
            // на одном элементе — CSS перекрывает атрибут. Разделяем на два <g>:
            // внешний — только SVG-позиционирование, внутренний — только CSS-анимация.
            <g transform={`translate(${cx}, ${stemTopY})`} filter={`url(#glow-${safeId})`}>
              {/* Анимированная обёртка — без SVG transform, только CSS */}
              <g
                style={{
                  animation: `flicker-${safeId} 1.15s ease-in-out infinite`,
                  transformOrigin: '0px 0px',
                }}
              >
                {/* Внешнее пламя */}
                <path d={outerPath} fill={`url(#fg-${safeId})`} />

                {/* Внутренний светлый сердечник */}
                <g
                  style={{
                    animation: `flicker2-${safeId} 0.65s ease-in-out infinite`,
                    transformOrigin: '0px 0px',
                  }}
                >
                  <path d={innerPath} fill={`url(#fi-${safeId})`} opacity={0.82} />
                </g>
              </g>
            </g>
          )}
        </svg>

        {/* Подпись иона под горелкой */}
        {metalLabel && (
          <div
            style={{
              position: 'absolute',
              top: h + 10,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#fff',
              borderRadius: 7,
              padding: '5px 14px',
              fontSize: 13,
              fontWeight: 600,
              color: '#333',
              whiteSpace: 'nowrap',
              fontFamily: "'Montserrat', system-ui, sans-serif",
              boxShadow: '0 1px 8px rgba(0,0,0,0.14)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <span
              style={{
                width: 11, height: 11, borderRadius: '50%',
                background: flameColor, display: 'inline-block',
                border: '1px solid rgba(0,0,0,0.18)', flexShrink: 0,
              }}
            />
            {metalLabel}
          </div>
        )}
      </HTMLContainer>
    )
  }

  getIndicatorPath(shape: BurnerShape) {
    const path = new Path2D()
    path.rect(0, 0, shape.props.w, shape.props.h)
    return path
  }
}
