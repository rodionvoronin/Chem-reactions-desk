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
  /** Заливка пузырьков — зависит от того, какой газ выделяется */
  gasFill: string
  /** Обводка пузырьков */
  gasStroke: string
  /** Подпись газа для панели результата */
  gasLabel: string
  reactionDesc: string
  isDry: boolean
}

/** Бесцветный газ — вид пузырьков по умолчанию */
export const DEFAULT_GAS_FILL = 'rgba(245, 250, 255, 0.72)'
export const DEFAULT_GAS_STROKE = 'rgba(120, 170, 215, 0.60)'

export function createTube(id: string): TubeState {
  return {
    id,
    contents: [],
    liquidColor: 'rgba(200, 230, 255, 0.20)',
    fillLevel: 0.38,
    hasPrecipitate: false,
    precipitateColor: '#1565C0',
    gasActive: false,
    gasFill: DEFAULT_GAS_FILL,
    gasStroke: DEFAULT_GAS_STROKE,
    gasLabel: '',
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
    // Простые вещества — без суффикса _s в подписи
    Fe_s: 'Fe', Cu_s: 'Cu', Zn_s: 'Zn', Al_s: 'Al', Mg_s: 'Mg',
    S_s: 'S', C_s: 'C', P_s: 'P', Si_s: 'Si',
    Na_s: 'Na', K_s: 'K', Ca_s: 'Ca', Cr_s: 'Cr', Ag_s: 'Ag',
    // Кислоты с концентрацией
    HNO3_dilut:  'HNO<sub>3</sub>(р)',
    HNO3_conc:   'HNO<sub>3</sub>(к)',
    H2SO4_dilut: 'H<sub>2</sub>SO<sub>4</sub>(р)',
    H2SO4_conc:  'H<sub>2</sub>SO<sub>4</sub>(к)',
    H2S_aq:      'H<sub>2</sub>S',
    // Гидроксиды и соли со скобками
    AlOH3:   'Al(OH)<sub>3</sub>',
    ZnOH2:   'Zn(OH)<sub>2</sub>',
    CrOH3:   'Cr(OH)<sub>3</sub>',
    CuOH2:   'Cu(OH)<sub>2</sub>',
    FeOH3:   'Fe(OH)<sub>3</sub>',
    BaOH2:   'Ba(OH)<sub>2</sub>',
    NH42SO4: '(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>',
    CH3COOH: 'CH<sub>3</sub>COOH',
    Cr2SO43: 'Cr<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub>',
    Al2SO43: 'Al<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub>',
    Fe2SO43: 'Fe<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub>',
    CuNO32:  'Cu(NO<sub>3</sub>)<sub>2</sub>',
    Ba_s:    'Ba',
  }
  return SPECIAL[id] ?? id.replace(/(\d+)/g, '<sub>$1</sub>')
}

// ── Компонент ─────────────────────────────────────────────────────────────────

interface Props {
  tube: TubeState
  index: number
  selected: boolean
  onSelect: () => void
  /** Высота пробирки в пикселях — задаётся снаружи под размер экрана */
  height: number
}

/** Отношение ширины к высоте — сохраняет пропорции пробирки при любом размере */
const ASPECT = 0.373
/** Базовая высота, под которую подобраны абсолютные величины (пузырьки, клубы газа) */
const BASE_H = 300

export function TestTube({ tube, index, selected, onSelect, height }: Props) {
  const {
    id, liquidColor, fillLevel, hasPrecipitate,
    precipitateColor, gasActive, gasFill, gasStroke, contents, isDry,
  } = tube

  const H = height
  const W = Math.round(height * ASPECT)
  // Коэффициент для величин, заданных в пикселях: радиусы пузырьков,
  // высота подъёма газа, толщина осадка. Пропорции самой пробирки
  // считаются от W и H, поэтому масштабируются сами.
  const k = H / BASE_H

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
    ? (isDry ? Math.min(fillableH * 0.30, 76 * k) : Math.min(liquidH * 0.38, 62 * k))
    : 0

  const glassStroke = isDry ? '#B0BEC5' : '#90CAF9'
  const glassFill   = isDry ? 'rgba(220,220,220,0.06)' : 'rgba(200,230,255,0.10)'

  const path = tubePath(lx, rx, tubeTop, straightY, cx, tubeBottom)
  const clipId = `clip-${id}`

  const BUBBLES = [
    { xf: 0.15, delay: '0s',    r: 9.5,  dur: '1.0s'  },
    { xf: 0.32, delay: '0.4s',  r: 6.8,  dur: '1.4s'  },
    { xf: 0.50, delay: '0.8s',  r: 11.5, dur: '0.9s'  },
    { xf: 0.70, delay: '0.2s',  r: 8.0,  dur: '1.2s'  },
    { xf: 0.85, delay: '1.0s',  r: 6.0,  dur: '1.6s'  },
    { xf: 0.22, delay: '0.6s',  r: 7.4,  dur: '1.1s'  },
    { xf: 0.60, delay: '1.3s',  r: 9.5,  dur: '1.0s'  },
    { xf: 0.40, delay: '0.3s',  r: 8.0,  dur: '1.35s' },
    { xf: 0.55, delay: '1.8s',  r: 5.4,  dur: '1.7s'  },
  ]
  const GAS_PUFFS = [
    { dx: -15, delay: '0s',    r: 8,    dur: '1.5s' },
    { dx: +12, delay: '0.5s',  r: 11,   dur: '1.9s' },
    { dx:  -3, delay: '1.1s',  r: 7,    dur: '1.4s' },
    { dx: +20, delay: '0.3s',  r: 9.5,  dur: '1.7s' },
    { dx:  -9, delay: '0.8s',  r: 12,   dur: '2.0s' },
    { dx: +24, delay: '1.5s',  r: 7,    dur: '1.6s' },
  ]
  const DRY_GAS_PUFFS = [
    { dx:   0, delay: '0s',    r: 24, dur: '2.1s' },
    { dx: -12, delay: '0.35s', r: 18, dur: '1.8s' },
    { dx: +15, delay: '0.7s',  r: 30, dur: '2.4s' },
    { dx: -20, delay: '1.1s',  r: 22, dur: '2.0s' },
    { dx:  +8, delay: '0.2s',  r: 27, dur: '2.3s' },
    { dx:  -5, delay: '1.5s',  r: 32, dur: '2.6s' },
    { dx: +23, delay: '0.55s', r: 16, dur: '1.9s' },
    { dx: -27, delay: '1.9s',  r: 23, dur: '2.2s' },
    { dx:  +3, delay: '2.3s',  r: 35, dur: '2.8s' },
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

  /**
   * Размещает пузырёк целиком внутри пробирки. Дно закруглённое, поэтому
   * у самого низа доступная ширина меньше диаметра: считаем полуширину
   * сечения на высоте центра пузырька и вписываем круг в неё.
   *
   * @param xf доля ширины [0..1], @param rBase базовый радиус
   */
  const placeBubble = (xf: number, rBase: number, gap: number) => {
    const R = tw / 2                       // радиус полусферического дна
    const rr = Math.min(rBase * k, tw * 0.14)
    // Не в самой нижней точке: там для крупного пузырька слишком узко.
    // Если есть осадок — поднимаемся над ним.
    const restY = straightY + R * 0.45
    const cyB = Math.min(restY, tubeBottom - precipH - rr - gap)
    // Круг лежит внутри полусферы, если расстояние от её центра
    // (cx, straightY) до центра круга не превышает R - rr
    const maxDist = Math.max(0, R - rr - 1.5)
    const dy = Math.max(0, cyB - straightY)
    const span = dy >= maxDist ? 0 : Math.sqrt(maxDist * maxDist - dy * dy)
    return { cx: cx - span + 2 * span * xf, cy: cyB, r: rr }
  }

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
      {/* Формула содержимого над пробиркой.
          Высота не фиксирована — длинный состав переносится на несколько строк
          и не обрезается; ряд выровнен по низу, поэтому пробирки не разъезжаются. */}
      <div
        style={{
          minHeight: 38, width: W + 22,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          paddingBottom: 6,
          fontFamily: FONT, fontSize: Math.round(Math.min(17, 13 * k)), fontWeight: 700,
          color: '#37474F', textAlign: 'center', lineHeight: 1.35,
          overflowWrap: 'break-word', wordBreak: 'normal', hyphens: 'none',
        }}
        dangerouslySetInnerHTML={{ __html: labelHtml }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id={clipId}>
            <path d={path} />
          </clipPath>

          <linearGradient id={`gascol-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={gasFill} stopOpacity={0} />
            <stop offset="40%"  stopColor={gasFill} stopOpacity={0.55} />
            <stop offset="100%" stopColor={gasFill} stopOpacity={0.85} />
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
              100% { transform: translateY(-${Math.round(82 * k)}px) scale(2.8); opacity: 0; }
            }
            @keyframes drypuff-${id} {
              0%   { transform: translateY(0) scale(0.4); opacity: 0.90; }
              30%  { opacity: 0.80; }
              70%  { opacity: 0.45; }
              100% { transform: translateY(-${Math.round(175 * k)}px) scale(3.5); opacity: 0; }
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
        {!isDry && BUBBLES.map(({ xf, delay, r, dur }, i) => {
          const b = placeBubble(xf, r, 3)
          return (
            <circle
              key={i}
              cx={b.cx} cy={b.cy} r={b.r}
              fill={gasFill} stroke={gasStroke}
              strokeWidth={1.4} clipPath={`url(#${clipId})`}
              style={
                gasActive
                  ? {
                      animation: `bubble-${id} ${dur} ease-in ${delay} infinite`,
                      transformBox: 'fill-box', transformOrigin: 'center',
                    }
                  : { display: 'none' }
              }
            />
          )
        })}

        {/* Стеклянный контур */}
        <path d={path} fill={glassFill} stroke={glassStroke} strokeWidth={2.5} />

        {/* Ободок сверху */}
        <line x1={lx - 4} y1={tubeTop} x2={rx + 4} y2={tubeTop}
          stroke={glassStroke} strokeWidth={3} strokeLinecap="round" />

        {/* Газ — водный режим */}
        {gasActive && !isDry && GAS_PUFFS.map(({ dx, delay, r, dur }, i) => (
          <circle
            key={i}
            cx={cx + dx * k} cy={tubeTop - 5} r={r * k}
            fill={gasFill} stroke={gasStroke}
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
              x={cx - tw * 0.18} y={tubeTop - 110 * k}
              width={tw * 0.36} height={112 * k}
              fill={`url(#gascol-${id})`} style={{ opacity: 0.65 }}
            />
            {DRY_SPARKS.map(({ xf, delay, dur }, i) => {
              const s = placeBubble(xf, 4.5, 2)
              return (
                <circle
                  key={i}
                  cx={s.cx} cy={s.cy} r={s.r}
                  fill="rgba(255, 180, 40, 0.92)" stroke="rgba(255, 120, 0, 0.70)"
                  strokeWidth={0.8} clipPath={`url(#${clipId})`}
                  style={{
                    animation: `dryspark-${id} ${dur} ease-in ${delay} infinite`,
                    transformBox: 'fill-box', transformOrigin: 'center',
                  }}
                />
              )
            })}
            {DRY_GAS_PUFFS.map(({ dx, delay, r, dur }, i) => (
              <circle
                key={i}
                cx={cx + dx * k} cy={tubeTop - 4} r={r * k}
                fill={gasFill} stroke={gasStroke}
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
        marginTop: 8, fontFamily: FONT, fontSize: 12.5, fontWeight: 600,
        color: selected ? '#1565C0' : '#90A4AE',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {isDry && <span title="Сухой режим">🔬</span>}
        Пробирка {index + 1}
      </div>
    </div>
  )
}
