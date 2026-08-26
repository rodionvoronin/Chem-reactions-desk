import { HTMLContainer, Rectangle2d, RecordProps, ShapeUtil, T, TLResizeInfo, TLShape, resizeBox } from 'tldraw'
import { getPrecipitateLabel } from '../reactions'

export const TEST_TUBE_TYPE = 'test-tube' as const

declare module 'tldraw' {
  interface TLGlobalShapePropsMap {
    [TEST_TUBE_TYPE]: {
      w: number
      h: number
      contents: string[]
      liquidColor: string
      fillLevel: number
      hasPrecipitate: boolean
      precipitateColor: string
      gasActive: boolean
      reactionDesc: string
      isDry: boolean
    }
  }
}

export type TestTubeShape = TLShape<typeof TEST_TUBE_TYPE>

// ── Helpers ───────────────────────────────────────────────────────────────────

function tubePath(lx: number, rx: number, top: number, straightY: number, cx: number, bottom: number) {
  return (
    `M ${lx} ${top} ` +
    `L ${lx} ${straightY} ` +
    `Q ${lx} ${bottom} ${cx} ${bottom} ` +
    `Q ${rx} ${bottom} ${rx} ${straightY} ` +
    `L ${rx} ${top} Z`
  )
}

/** Converts a reagent ID like "Na2CO3" to HTML with <sub> subscripts. */
function fmtId(id: string): string {
  const SPECIAL: Record<string, string> = {
    phenolphthalein: 'Инд.',
    CaOH2:       'Ca(OH)<sub>2</sub>',
    PbNO32:      'Pb(NO<sub>3</sub>)<sub>2</sub>',
    // Специальный токен
    heat:         '🔥',
    // Металлы (без суффикса _s в подписи)
    Fe_s: 'Fe', Cu_s: 'Cu', Zn_s: 'Zn', Al_s: 'Al', Mg_s: 'Mg',
    // Прочие твёрдые без индексов
    S_s: 'S', C_s: 'C',
    // Концентрированные / разбавленные кислоты
    HNO3_dilut:  'HNO<sub>3</sub>(р)',
    HNO3_conc:   'HNO<sub>3</sub>(к)',
    H2SO4_dilut: 'H<sub>2</sub>SO<sub>4</sub>(р)',
    H2SO4_conc:  'H<sub>2</sub>SO<sub>4</sub>(к)',
  }
  return SPECIAL[id] ?? id.replace(/(\d+)/g, '<sub>$1</sub>')
}

// ── Shape util ────────────────────────────────────────────────────────────────

export class TestTubeShapeUtil extends ShapeUtil<TestTubeShape> {
  static override type = TEST_TUBE_TYPE

  static override props: RecordProps<TestTubeShape> = {
    w: T.number,
    h: T.number,
    contents: T.arrayOf(T.string),
    liquidColor: T.string,
    fillLevel: T.number,
    hasPrecipitate: T.boolean,
    precipitateColor: T.string,
    gasActive: T.boolean,
    reactionDesc: T.string,
    isDry: T.boolean,
  }

  getDefaultProps(): TestTubeShape['props'] {
    return {
      w: 80,
      h: 220,
      contents: [],
      liquidColor: 'rgba(200, 230, 255, 0.20)',
      fillLevel: 0.38,
      hasPrecipitate: false,
      precipitateColor: '#1565C0',
      gasActive: false,
      reactionDesc: '',
      isDry: false,
    }
  }

  override canResize() { return true }

  override onResize(shape: TestTubeShape, info: TLResizeInfo<TestTubeShape>) {
    return resizeBox(shape, info)
  }

  getGeometry(shape: TestTubeShape) {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true })
  }

  component(shape: TestTubeShape) {
    const { w, h, liquidColor, fillLevel, hasPrecipitate, precipitateColor, gasActive, contents, reactionDesc, isDry } = shape.props

    const margin = 6
    const cx = w / 2
    const tw = w * 0.58
    const lx = cx - tw / 2
    const rx = cx + tw / 2
    const tubeTop = margin
    const straightY = h - tw / 2 - margin
    const tubeBottom = h - margin

    const fillableH = tubeBottom - tubeTop
    const liquidH = isDry ? 0 : fillableH * Math.max(0, Math.min(1, fillLevel))
    const liquidTopY = tubeBottom - liquidH

    // В сухом режиме осадок — это слой твёрдого вещества на дне (фиксированная высота)
    // В водном режиме осадок пропорционален высоте жидкости
    const precipH = hasPrecipitate
      ? (isDry ? Math.min(fillableH * 0.30, 55) : Math.min(liquidH * 0.38, 45))
      : 0

    // Цвета стекла: синеватое в водном режиме, серое в сухом
    const glassStroke = isDry ? '#B0BEC5' : '#90CAF9'
    const glassFill   = isDry ? 'rgba(220,220,220,0.06)' : 'rgba(200,230,255,0.10)'

    const path = tubePath(lx, rx, tubeTop, straightY, cx, tubeBottom)
    const clipId = `tt-clip-${shape.id}`
    const safeId = shape.id.replace(/[^a-zA-Z0-9]/g, '_')

    const BUBBLES = [
      { xf: 0.15, delay: '0s',    r: 7.0, dur: '1.0s'  },
      { xf: 0.32, delay: '0.4s',  r: 5.0, dur: '1.4s'  },
      { xf: 0.50, delay: '0.8s',  r: 8.5, dur: '0.9s'  },
      { xf: 0.70, delay: '0.2s',  r: 6.0, dur: '1.2s'  },
      { xf: 0.85, delay: '1.0s',  r: 4.5, dur: '1.6s'  },
      { xf: 0.22, delay: '0.6s',  r: 5.5, dur: '1.1s'  },
      { xf: 0.60, delay: '1.3s',  r: 7.0, dur: '1.0s'  },
      { xf: 0.40, delay: '0.3s',  r: 6.0, dur: '1.35s' },
      { xf: 0.55, delay: '1.8s',  r: 4.0, dur: '1.7s'  },
    ]
    // Мелкие пузырьки над горлышком (водный режим)
    const GAS_PUFFS = [
      { dx: -11, delay: '0s',    r: 6,  dur: '1.5s' },
      { dx:  +9, delay: '0.5s',  r: 8,  dur: '1.9s' },
      { dx:  -2, delay: '1.1s',  r: 5,  dur: '1.4s' },
      { dx: +15, delay: '0.3s',  r: 7,  dur: '1.7s' },
      { dx:  -7, delay: '0.8s',  r: 9,  dur: '2.0s' },
      { dx: +18, delay: '1.5s',  r: 5,  dur: '1.6s' },
    ]
    // Крупные клубы дыма/газа для сухого режима (разложение, прокаливание)
    const DRY_GAS_PUFFS = [
      { dx:   0, delay: '0s',    r: 18, dur: '2.1s' },
      { dx:  -9, delay: '0.35s', r: 13, dur: '1.8s' },
      { dx: +11, delay: '0.7s',  r: 22, dur: '2.4s' },
      { dx: -15, delay: '1.1s',  r: 16, dur: '2.0s' },
      { dx:  +6, delay: '0.2s',  r: 20, dur: '2.3s' },
      { dx:  -4, delay: '1.5s',  r: 24, dur: '2.6s' },
      { dx: +17, delay: '0.55s', r: 12, dur: '1.9s' },
      { dx: -20, delay: '1.9s',  r: 17, dur: '2.2s' },
      { dx:  +2, delay: '2.3s',  r: 26, dur: '2.8s' },
    ]
    // Частицы внутри пробирки в сухом режиме (тепловые частицы над слоем вещества)
    const DRY_SPARKS = [
      { xf: 0.20, delay: '0s',    dur: '0.9s'  },
      { xf: 0.45, delay: '0.3s',  dur: '1.1s'  },
      { xf: 0.70, delay: '0.6s',  dur: '0.8s'  },
      { xf: 0.30, delay: '0.9s',  dur: '1.0s'  },
      { xf: 0.60, delay: '0.15s', dur: '0.95s' },
      { xf: 0.80, delay: '1.2s',  dur: '1.2s'  },
    ]

    const labelHtml = contents.map(fmtId).join(' + ')

    return (
      <HTMLContainer id={shape.id} style={{ pointerEvents: 'none', overflow: 'visible' }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <clipPath id={clipId}>
              <path d={path} />
            </clipPath>

            {/* Градиент для вертикального столба газа (сухой режим) */}
            <linearGradient id={`gascolumn-${safeId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(200,220,235,0)" />
              <stop offset="40%"  stopColor="rgba(200,220,235,0.55)" />
              <stop offset="100%" stopColor="rgba(200,220,235,0.80)" />
            </linearGradient>

            <style>{`
              @keyframes bubble-${safeId} {
                0%   { transform: translateY(0) scale(1);   opacity: 0.96; }
                70%  { opacity: 0.65; }
                100% { transform: translateY(-${Math.round(liquidH)}px) scale(0.10);
                       opacity: 0; }
              }
              @keyframes puff-${safeId} {
                0%   { transform: translateY(0) scale(0.6); opacity: 0.85; }
                50%  { opacity: 0.55; }
                100% { transform: translateY(-60px) scale(2.8); opacity: 0; }
              }
              @keyframes drypuff-${safeId} {
                0%   { transform: translateY(0) scale(0.4); opacity: 0.90; }
                30%  { opacity: 0.80; }
                70%  { opacity: 0.45; }
                100% { transform: translateY(-130px) scale(3.5); opacity: 0; }
              }
              @keyframes dryspark-${safeId} {
                0%   { transform: translateY(0) scale(1);   opacity: 0.9; }
                60%  { opacity: 0.6; }
                100% { transform: translateY(-${Math.round(fillableH * 0.55)}px) scale(0.2); opacity: 0; }
              }
              @keyframes glowpulse-${safeId} {
                0%,100% { opacity: 0.40; stroke-width: 1.5px; }
                50%     { opacity: 0.85; stroke-width: 4px;   }
              }
              @keyframes precip-${safeId} {
                0%   { transform: translateY(-28px); opacity: 0; }
                55%  { opacity: 1; }
                100% { transform: translateY(0); opacity: 1; }
              }
            `}</style>
          </defs>

          {/* Жидкость — только в водном режиме */}
          {!isDry && (
            <rect
              x={lx + 1} y={liquidTopY}
              width={tw - 2} height={Math.max(0, liquidH)}
              clipPath={`url(#${clipId})`}
              style={{ fill: liquidColor, transition: 'fill 0.85s ease' }}
            />
          )}

          {/* Мениск — только в водном режиме */}
          {!isDry && liquidH > 2 && (
            <>
              <line
                x1={lx + 2} y1={liquidTopY + 0.8}
                x2={rx - 2} y2={liquidTopY + 0.8}
                stroke="rgba(80, 150, 210, 0.55)"
                strokeWidth={1.8}
                strokeLinecap="round"
                clipPath={`url(#${clipId})`}
              />
              <rect
                x={lx + 2} y={liquidTopY + 1.5}
                width={tw - 4} height={5}
                clipPath={`url(#${clipId})`}
                fill="rgba(255, 255, 255, 0.12)"
              />
            </>
          )}

          {/* Осадок */}
          {hasPrecipitate && precipH > 0 && (
            <>
              <rect
                x={lx + 1} y={tubeBottom - precipH}
                width={tw - 2} height={precipH}
                fill={precipitateColor}
                clipPath={`url(#${clipId})`}
                style={{ animation: `precip-${safeId} 1.1s ease-out forwards` }}
              />
              {/* Граница осадка — видна при любом цвете, в т.ч. белом */}
              <line
                x1={lx + 2} y1={tubeBottom - precipH}
                x2={rx - 2} y2={tubeBottom - precipH}
                stroke="rgba(70, 100, 130, 0.50)"
                strokeWidth={1.5}
                strokeLinecap="round"
                clipPath={`url(#${clipId})`}
              />
            </>
          )}

          {/* Пузырьки газа внутри жидкости — только в водном режиме */}
          {!isDry && BUBBLES.map(({ xf, delay, r, dur }, i) => (
            <circle
              key={i}
              cx={lx + tw * xf}
              cy={tubeBottom - precipH - 5}
              r={r}
              fill="rgba(240, 255, 210, 0.95)"
              stroke="rgba(110, 190, 40, 0.85)"
              strokeWidth={1.2}
              clipPath={`url(#${clipId})`}
              style={
                gasActive
                  ? {
                      animation: `bubble-${safeId} ${dur} ease-in ${delay} infinite`,
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                    }
                  : { display: 'none' }
              }
            />
          ))}

          {/* Стеклянный контур */}
          <path d={path} fill={glassFill} stroke={glassStroke} strokeWidth={2.5} />

          {/* Ободок сверху */}
          <line x1={lx - 4} y1={tubeTop} x2={rx + 4} y2={tubeTop}
            stroke={glassStroke} strokeWidth={3} strokeLinecap="round" />

          {/* ── ГАЗ: водный режим — небольшие пузырьки над горлышком ── */}
          {gasActive && !isDry && GAS_PUFFS.map(({ dx, delay, r, dur }, i) => (
            <circle
              key={i}
              cx={cx + dx}
              cy={tubeTop - 5}
              r={r}
              fill="rgba(220, 240, 255, 0.80)"
              stroke="rgba(100, 170, 230, 0.55)"
              strokeWidth={1.2}
              style={{
                animation: `puff-${safeId} ${dur} ease-out ${delay} infinite`,
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }}
            />
          ))}

          {/* ── ГАЗ: сухой режим — крупные клубы дыма/газа ── */}
          {gasActive && isDry && (
            <>
              {/* Вертикальный столб газа — видимый поток */}
              <rect
                x={cx - tw * 0.18} y={tubeTop - 80}
                width={tw * 0.36} height={82}
                fill={`url(#gascolumn-${safeId})`}
                style={{ opacity: 0.65 }}
              />
              {/* Тепловые частицы внутри пробирки (поднимаются от твёрдого слоя) */}
              {DRY_SPARKS.map(({ xf, delay, dur }, i) => (
                <circle
                  key={i}
                  cx={lx + tw * xf}
                  cy={tubeBottom - precipH - 4}
                  r={3.5}
                  fill="rgba(255, 180, 40, 0.92)"
                  stroke="rgba(255, 120, 0, 0.70)"
                  strokeWidth={0.8}
                  clipPath={`url(#${clipId})`}
                  style={{
                    animation: `dryspark-${safeId} ${dur} ease-in ${delay} infinite`,
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                  }}
                />
              ))}
              {/* Крупные клубы дыма над горлышком */}
              {DRY_GAS_PUFFS.map(({ dx, delay, r, dur }, i) => (
                <circle
                  key={i}
                  cx={cx + dx}
                  cy={tubeTop - 4}
                  r={r}
                  fill="rgba(210, 225, 235, 0.78)"
                  stroke="rgba(150, 175, 200, 0.40)"
                  strokeWidth={1.0}
                  style={{
                    animation: `drypuff-${safeId} ${dur} ease-out ${delay} infinite`,
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                  }}
                />
              ))}
            </>
          )}

          {/* Блик */}
          <line
            x1={lx + tw * 0.2} y1={tubeTop + 8}
            x2={lx + tw * 0.2} y2={straightY - 12}
            stroke="rgba(255,255,255,0.40)" strokeWidth={tw * 0.1}
            strokeLinecap="round" clipPath={`url(#${clipId})`}
          />

          {/* Подпись компонентов над пробиркой — Montserrat, индексы как sub */}
          {contents.length > 0 && (
            <foreignObject x={cx - 120} y={tubeTop - 42} width={240} height={40}>
              <div
                style={{
                  fontFamily: "'Montserrat', system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#444',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  lineHeight: '40px',
                  userSelect: 'none',
                }}
                dangerouslySetInnerHTML={{ __html: labelHtml }}
              />
            </foreignObject>
          )}
        </svg>

        {/* Описание реакции и цвет осадка — вертикальный стек под пробиркой */}
        {(reactionDesc || hasPrecipitate) && (
          <div style={{
            position: 'absolute',
            top: h + 14,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'none',
          }}>
            {reactionDesc && (
              <div style={{
                width: 'max-content',
                background: '#E8F5E9',
                borderRadius: 9,
                padding: '8px 18px',
                fontSize: 15,
                fontWeight: 600,
                color: '#2E7D32',
                whiteSpace: 'nowrap',
                fontFamily: "'Montserrat', system-ui, sans-serif",
                boxShadow: '0 2px 10px rgba(0,0,0,0.13)',
              }}>
                {reactionDesc}
              </div>
            )}
            {hasPrecipitate && (
              <div style={{
                width: 'max-content',
                background: '#FAFAFA',
                borderRadius: 7,
                padding: '5px 14px',
                fontSize: 13,
                fontWeight: 500,
                color: '#555',
                whiteSpace: 'nowrap',
                fontFamily: "'Montserrat', system-ui, sans-serif",
                boxShadow: '0 1px 6px rgba(0,0,0,0.10)',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}>
                <span style={{
                  display: 'inline-block',
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  background: precipitateColor,
                  flexShrink: 0,
                  border: '1px solid rgba(0,0,0,0.18)',
                }} />
                {getPrecipitateLabel(precipitateColor)}
              </div>
            )}
          </div>
        )}
      </HTMLContainer>
    )
  }

  getIndicatorPath(shape: TestTubeShape) {
    const path = new Path2D()
    path.rect(0, 0, shape.props.w, shape.props.h)
    return path
  }
}
