// ── Опыты на доске через движок реакций ───────────────────────────────────────
//
// «Юный химик» не рисует опыты руками: что произойдёт в пробирке, решает тот
// же движок, что и на лабораторном столе. Здесь только детские названия
// реактивов и перевод результата движка на язык наблюдений: «выделяется газ»,
// «выпал голубой осадок», «раствор стал малиновым».

import { createTube, TubeState } from '../components/TestTube'
import { withReactions } from '../tube'
import { matchReactions, getPrecipitateLabel, REAGENT_MAP } from '../reactions'
import { heapVisual } from '../heap'
import { Sign } from './types'

/** Как реактив называется на доске */
export const KID_REAGENTS: Record<string, { name: string; emoji: string }> = {
  NaHCO3: { name: 'Пищевая сода', emoji: '🧁' },
  CH3COOH: { name: 'Уксус', emoji: '🍶' },
  CaOH2: { name: 'Известковая вода', emoji: '🫙' },
  CO2: { name: 'Углекислый газ', emoji: '🌬️' },
  phenolphthalein: { name: 'Фенолфталеин', emoji: '💧' },
  NaOH: { name: 'Раствор щёлочи', emoji: '🧴' },
  HCl: { name: 'Соляная кислота', emoji: '⚗️' },
  CuSO4: { name: 'Медный купорос', emoji: '🔷' },
  FeCl3: { name: 'Хлорное железо', emoji: '🟫' },
  Fe_s: { name: 'Железный гвоздь', emoji: '🔩' },
  Zn_s: { name: 'Цинк', emoji: '🪙' },
  Mg_s: { name: 'Магний', emoji: '🎗️' },
  Cu_s: { name: 'Медная проволока', emoji: '🟠' },
  Al_s: { name: 'Алюминиевый порошок', emoji: '🥫' },
  Na_s: { name: 'Натрий', emoji: '🧈' },
  AgNO3: { name: 'Ляпис (нитрат серебра)', emoji: '🥈' },
  NaCl: { name: 'Поваренная соль', emoji: '🧂' },
  KI: { name: 'Иодид калия', emoji: '🧪' },
  Na2CO3: { name: 'Стиральная сода', emoji: '🧺' },
  CaCO3: { name: 'Мел', emoji: '🩶' },
  S_s: { name: 'Сера', emoji: '🟡' },
  C_s: { name: 'Уголь', emoji: '⚫' },
  P_s: { name: 'Красный фосфор', emoji: '🔴' },
  Fe2O3: { name: 'Оксид железа (ржавчина)', emoji: '🟤' },
  NH42Cr2O7: { name: 'Дихромат аммония', emoji: '🟧' },
  I2: { name: 'Иод', emoji: '🟣' },
  H2O_drop: { name: 'Капля воды', emoji: '💧' },
  H2O2: { name: 'Перекись водорода', emoji: '🩹' },
  MnO2: { name: 'Оксид марганца', emoji: '⬛' },
  heat: { name: 'Нагреть', emoji: '🔥' },
  air: { name: 'Воздух', emoji: '💨' },
}

export function kidName(id: string): string {
  return KID_REAGENTS[id]?.name ?? REAGENT_MAP[id]?.label ?? id
}

export function kidEmoji(id: string): string {
  return KID_REAGENTS[id]?.emoji ?? '🧪'
}

/** Сосуд опыта: пробирка с раствором или горка на огнеупорной плитке */
export function makeVessel(id: string, start: string[], heap = false): TubeState {
  const base = createTube(id)
  const tube: TubeState = heap ? { ...base, vessel: 'heap', isDry: true } : base
  return withReactions(tube, start, heap)
}

export function addTo(tube: TubeState, add: string[]): TubeState {
  return withReactions(tube, [...tube.contents, ...add])
}

/** Признаки реакции, которые видны после добавления */
export function signsOf(before: TubeState, after: TubeState): Sign[] {
  const out: Sign[] = []
  if (after.vessel === 'heap') {
    // На горке реакция видна огнём: вспышка, «вулкан» или тление
    const v = heapVisual(after.contents)
    if (v.reacted && v.burn) out.push('light')
    if (v.reacted && matchReactions(after.contents, true, 'plate').gas) out.push('gas')
    return out
  }
  if (after.gasActive && !before.gasActive) out.push('gas')
  if (after.hasPrecipitate && (!before.hasPrecipitate || before.precipitateColor !== after.precipitateColor)) out.push('precipitate')
  if (after.liquidColor !== before.liquidColor && visibleColorChange(before.liquidColor, after.liquidColor)) out.push('color')
  return out
}

function rgba(c: string): [number, number, number, number] {
  const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?/)
  return m ? [+m[1], +m[2], +m[3], m[4] ? +m[4] : 1] : [255, 255, 255, 0]
}

/**
 * Окрашен ли раствор на глаз. Пустая пробирка в движке слегка голубоватая
 * (так нарисована вода), поэтому порог чуть выше её прозрачности.
 */
export function isTinted(c: string): boolean {
  return rgba(c)[3] >= 0.24
}

/**
 * Заметна ли смена цвета глазом: раствор окрасился, обесцветился или
 * сменил оттенок. Переход «почти прозрачный → почти прозрачный» не в счёт.
 */
function visibleColorChange(a: string, b: string): boolean {
  if (isTinted(a) !== isTinted(b)) return true
  if (!isTinted(a)) return false
  const [r1, g1, b1] = rgba(a)
  const [r2, g2, b2] = rgba(b)
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) > 60
}

/** Название цвета раствора по RGB — грубо, но честно */
export function colorName(c: string): string {
  const [r, g, b, a] = rgba(c)
  if (a < 0.15) return 'бесцветным'
  if (r > 200 && g < 90 && b > 100) return 'малиновым'
  if (b > 180 && r < 120) return 'синим'
  if (g > 140 && r < 140 && b < 140) return 'зелёным'
  if (r > 90 && g < 70 && b < 30) return 'бурым'
  if (r > 200 && g > 150 && b < 100) return 'жёлтым'
  if (r > 180 && g < 140) return 'оранжевым'
  return 'другого цвета'
}

/** «Выделяется дым», но «выделяются пары»: глагол по числу подлежащего */
function released(label: string): string {
  return /^[^ ]*(ые|ие)( |$)|(^| )пары( |$)/.test(label) ? 'Выделяются' : 'Выделяется'
}

/** Что видно после добавления — словами для доски */
export function observation(before: TubeState, after: TubeState): string[] {
  const out: string[] = []
  const signs = signsOf(before, after)
  if (after.vessel === 'heap') {
    const v = heapVisual(after.contents)
    if (v.burn === 'flash') out.push('Ослепительная вспышка — выделяются свет и тепло.')
    else if (v.burn === 'volcano') out.push('Горка вспучивается, как вулкан, летят искры.')
    else if (v.reacted) out.push('Вещество раскаляется и светится.')
    if (signs.includes('gas')) out.push(`${released(after.gasLabel)} ${after.gasLabel || 'газ'}.`)
    if (v.bead) out.push('На дне остаётся капля расплавленного металла.')
    if (!v.reacted) out.push('Пока ничего не происходит.')
    return out
  }
  if (signs.includes('gas')) out.push(`Бурно ${released(after.gasLabel).toLowerCase()} ${after.gasLabel || 'газ'} — пузырьки.`)
  if (signs.includes('precipitate')) out.push(`Выпадает ${precipitateText(after.precipitateColor)}.`)
  if (signs.includes('color')) out.push(isTinted(after.liquidColor) ? `Раствор становится ${colorName(after.liquidColor)}.` : 'Окраска исчезает — раствор бесцветный.')
  if (before.hasPrecipitate && !after.hasPrecipitate) out.push('Твёрдое вещество растворяется — раствор снова прозрачный.')
  if (!out.length) out.push('Видимых изменений нет.')
  return out
}

/** «голубой осадок» — подписи движка уже содержат слово «осадок» */
function precipitateText(color: string): string {
  const label = getPrecipitateLabel(color)
  return label.includes('осадок') ? label : `${label} осадок`
}

/** Уравнение без технических пометок — для любопытных */
export function equationOf(tube: TubeState): string {
  // Пометки «Окислитель: …» — для старших классов; пустые скобки после них убираем
  return tube.reactionDesc.split('  ·  ').filter((d) => d.includes('→'))
    .map((d) => d.replace(/;?\s*(Окислитель|Восстановитель)[^)]*/g, '').replace(/\s*\(\s*\)/g, ''))
    .join('  ·  ')
}
