// ── Состояние пробирки по её содержимому ─────────────────────────────────────
//
// Один расчёт на всё приложение: лабораторный стол и опыты «Юного химика»
// показывают одно и то же, потому что спрашивают один и тот же движок.

import { TubeState, createTube, DEFAULT_GAS_FILL, DEFAULT_GAS_STROKE } from './components/TestTube'
import { matchReactions, getReactionDescription, Vessel } from './reactions'

/** Признак посуды для движка: плитка горки, фторопласт или стекло */
export function vesselOf(tube: TubeState): Vessel {
  if (tube.vessel === 'heap') return 'plate'
  return tube.material === 'ptfe' ? 'ptfe' : 'glass'
}

/**
 * Пересчитывает состояние пробирки по её содержимому через движок реакций.
 * Сухой режим передаётся в движок: без воды не идут ни гидролиз, ни обмен
 * между растворами.
 */
export function withReactions(tube: TubeState, contents: string[], isDry = tube.isDry): TubeState {
  const vessel = vesselOf(tube)
  const effects = matchReactions(contents, isDry, vessel)
  const gas = effects.gasInfo
  const base = createTube(tube.id)
  return {
    ...tube,
    contents,
    isDry,
    // Если реакция перестала идти, возвращаем исходный вид пробирки
    liquidColor: effects.liquidColor ?? base.liquidColor,
    hasPrecipitate: effects.precipitate !== undefined,
    precipitateColor: effects.precipitate?.color ?? base.precipitateColor,
    gasActive: effects.gas ?? false,
    gasFill: gas?.fill ?? DEFAULT_GAS_FILL,
    gasStroke: gas?.stroke ?? DEFAULT_GAS_STROKE,
    gasLabel: gas?.label ?? '',
    reactionDesc: getReactionDescription(contents, isDry, vessel) ?? '',
  }
}
