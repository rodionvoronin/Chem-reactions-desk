const FONT = "'Montserrat', system-ui, sans-serif"

// ── Модель пробирки ───────────────────────────────────────────────────────────

export interface TubeState {
  id: string
  contents: string[]
  liquidColor: string
  fillLevel: number
  hasPrecipitate: boolean
  precipitateColor: string
  gasActive: boolean
  reactionDesc: string
  isDry: boolean
}

export function createTube(id: string): TubeState {
  return {
    id,
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

// ── Вспомогательное ───────────────────────────────────────────────────────────

function tubePath(lx: number, rx: number, top: number, straightY: number, cx: number, bottom: number) {
  return (
    `M ${lx} ${top} ` +
    `L ${lx} ${straightY} ` +
    `Q ${lx} ${bottom} ${cx} ${bottom} ` +
    `Q ${rx} ${bottom} ${rx} ${straightY} ` +
    `L ${rx} ${top} Z`
  )
}

/** Превращает идентификатор реагента вида "Na2CO3" в HTML с нижними индексами. */
export function fmtId(id: string): string {
  const SPECIAL: Record<string, string> = {
    phenolphthalein: 'Инд.',
    CaOH2:       'Ca(OH)<sub>2</sub>',
    PbNO32:      'Pb(NO<sub>3</sub>)<sub>2</sub>',
    heat:        '🔥',
    Fe_s: 'Fe', Cu_s: 'Cu', Zn_s: 'Zn', Al_s: 'Al', Mg_s: 'Mg',
    S_s: 'S', C_s: 'C',
    HNO3_dilut:  'HNO<sub>3</sub>(р)',
    HNO3_conc:   'HNO<sub>3</sub>(к)',
    H2SO4_dilut: 'H<sub>2</sub>SO<sub>4</sub>(р)',
    H2SO4_conc:  'H<sub>2</sub>SO<sub>4</sub>(к)',
  }
  return SPECIAL[id] ?? id.replace(/(\d+)/g, '<sub>$1</sub>')
}

// ── Компонент ─────────────────────────────────────────────────────────────────

interface Props {
  tube: TubeState
  index: number
  selected: boolean
  onSelect: () => void
}

const W = 80
const H = 220

export function TestTube({ tube, index, selected, onSelect }: Props) {
  const {
    id, liquidColor, fillLevel, hasPrecipitate,
    precipitateColor, gasActive, contents, isDry,
  } = tube

  const margin = 6
  const cx = W / 2
  const tw = W * 0.58
  const lx = cx - tw / 2
  const rx = cx + tw / 2
  const tubeTop = margin
  const straightY = H - tw / 2 - margin
  const tubeBottom = H - margin

  const fillableH = tubeBottom - tubeTop
  const liquidH = isDry ? 0 : fillableH * Math.max(0, Math.min(1, fillLevel))
  const liquidTopY = tubeBottom - liquidH

  // В сухом режиме осадок — слой твёрдого вещества фиксированной высоты,
  // в водном — пропорционален высоте жидкости
  const precipH = hasPrecipitate
    ? (isDry ? Math.min(fillableH * 0.30, 55) : Math.min(liquidH * 0.38, 45))
    : 0

  const glassStroke = isDry ? '#B0BEC5' : '#90CAF9'
  const glassFill   = isDry ? 'rgba(220,220,220,0.06)' : 'rgba(200,230,255,0.10)'

  const path = tubePath(lx, rx, tubeTop, straightY, cx, tubeBottom)
  const clipId = `clip-${id}`

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
  const GAS_PUFFS = [
    { dx: -11, delay: '0s',    r: 6,  dur: '1.5s' },
    { dx:  +9, delay: '0.5s',  r: 8,  dur: '1.9s' },
    { dx:  -2, delay: '1.1s',  r: 5,  dur: '1.4s' },
    { dx: +15, delay: '0.3s',  r: 7,  dur: '1.7s' },
    { dx:  -7, delay: '0.8s',  r: 9,  dur: '2.0s' },
    { dx: +18, delay: '1.5s',  r: 5,  dur: '1.6s' },
  ]
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
      {/* Формула содержимого над пробиркой */}
      <div
        style={{
          height: 34, minWidth: 84, maxWidth: 150,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT, fontSize: 12, fontWeight: 700,
          color: '#455A64', textAlign: 'center', lineHeight: 1.2,
          overflowWrap: 'anywhere',
        }}
        dangerouslySetInnerHTML={{ __html: labelHtml }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id={clipId}>
            <path d={path} />
          </clipPath>

          <linearGradient id={`gascol-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(200,220,235,0)" />
            <stop offset="40%"  stopColor="rgba(200,220,235,0.55)" />
            <stop offset="100%" stopColor="rgba(200,220,235,0.80)" />
          </linearGradient>

          <style>{`
            @keyframes bubble-${id} {
              0%   { transform: translateY(0) scale(1);   opacity: 0.96; }
              70%  { opacity: 0.65; }
              100% { transform: translateY(-${Math.round(liquidH)}px) scale(0.10); opacity: 0; }
            }
            @keyframes puff-${id} {
              0%   { transform: translateY(0) scale(0.6); opacity: 0.85; }
              50%  { opacity: 0.55; }
              100% { transform: translateY(-60px) scale(2.8); opacity: 0; }
            }
            @keyframes drypuff-${id} {
              0%   { transform: translateY(0) scale(0.4); opacity: 0.90; }
              30%  { opacity: 0.80; }
              70%  { opacity: 0.45; }
              100% { transform: translateY(-130px) scale(3.5); opacity: 0; }
            }
            @keyframes dryspark-${id} {
              0%   { transform: translateY(0) scale(1);   opacity: 0.9; }
              60%  { opacity: 0.6; }
              100% { transform: translateY(-${Math.round(fillableH * 0.55)}px) scale(0.2); opacity: 0; }
            }
            @keyframes precip-${id} {
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

        {/* Мениск */}
        {!isDry && liquidH > 2 && (
          <>
            <line
              x1={lx + 2} y1={liquidTopY + 0.8}
              x2={rx - 2} y2={liquidTopY + 0.8}
              stroke="rgba(80, 150, 210, 0.55)" strokeWidth={1.8}
              strokeLinecap="round" clipPath={`url(#${clipId})`}
            />
            <rect
              x={lx + 2} y={liquidTopY + 1.5}
              width={tw - 4} height={5}
              clipPath={`url(#${clipId})`} fill="rgba(255, 255, 255, 0.12)"
            />
          </>
        )}

        {/* Осадок */}
        {hasPrecipitate && precipH > 0 && (
          <>
            <rect
              x={lx + 1} y={tubeBottom - precipH}
              width={tw - 2} height={precipH}
              fill={precipitateColor} clipPath={`url(#${clipId})`}
              style={{ animation: `precip-${id} 1.1s ease-out forwards` }}
            />
            <line
              x1={lx + 2} y1={tubeBottom - precipH}
              x2={rx - 2} y2={tubeBottom - precipH}
              stroke="rgba(70, 100, 130, 0.50)" strokeWidth={1.5}
              strokeLinecap="round" clipPath={`url(#${clipId})`}
            />
          </>
        )}

        {/* Пузырьки внутри жидкости */}
        {!isDry && BUBBLES.map(({ xf, delay, r, dur }, i) => (
          <circle
            key={i}
            cx={lx + tw * xf} cy={tubeBottom - precipH - 5} r={r}
            fill="rgba(240, 255, 210, 0.95)" stroke="rgba(110, 190, 40, 0.85)"
            strokeWidth={1.2} clipPath={`url(#${clipId})`}
            style={
              gasActive
                ? {
                    animation: `bubble-${id} ${dur} ease-in ${delay} infinite`,
                    transformBox: 'fill-box', transformOrigin: 'center',
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

        {/* Газ — водный режим */}
        {gasActive && !isDry && GAS_PUFFS.map(({ dx, delay, r, dur }, i) => (
          <circle
            key={i}
            cx={cx + dx} cy={tubeTop - 5} r={r}
            fill="rgba(220, 240, 255, 0.80)" stroke="rgba(100, 170, 230, 0.55)"
            strokeWidth={1.2}
            style={{
              animation: `puff-${id} ${dur} ease-out ${delay} infinite`,
              transformBox: 'fill-box', transformOrigin: 'center',
            }}
          />
        ))}

        {/* Газ — сухой режим: столб, искры и крупные клубы */}
        {gasActive && isDry && (
          <>
            <rect
              x={cx - tw * 0.18} y={tubeTop - 80}
              width={tw * 0.36} height={82}
              fill={`url(#gascol-${id})`} style={{ opacity: 0.65 }}
            />
            {DRY_SPARKS.map(({ xf, delay, dur }, i) => (
              <circle
                key={i}
                cx={lx + tw * xf} cy={tubeBottom - precipH - 4} r={3.5}
                fill="rgba(255, 180, 40, 0.92)" stroke="rgba(255, 120, 0, 0.70)"
                strokeWidth={0.8} clipPath={`url(#${clipId})`}
                style={{
                  animation: `dryspark-${id} ${dur} ease-in ${delay} infinite`,
                  transformBox: 'fill-box', transformOrigin: 'center',
                }}
              />
            ))}
            {DRY_GAS_PUFFS.map(({ dx, delay, r, dur }, i) => (
              <circle
                key={i}
                cx={cx + dx} cy={tubeTop - 4} r={r}
                fill="rgba(210, 225, 235, 0.78)" stroke="rgba(150, 175, 200, 0.40)"
                strokeWidth={1.0}
                style={{
                  animation: `drypuff-${id} ${dur} ease-out ${delay} infinite`,
                  transformBox: 'fill-box', transformOrigin: 'center',
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
      </svg>

      {/* Номер пробирки */}
      <div style={{
        marginTop: 6, fontFamily: FONT, fontSize: 11, fontWeight: 600,
        color: selected ? '#1565C0' : '#90A4AE',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {isDry && <span title="Сухой режим">🔬</span>}
        Пробирка {index + 1}
      </div>
    </div>
  )
}
