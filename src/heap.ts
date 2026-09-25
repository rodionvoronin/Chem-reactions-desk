// ── Горка: как выглядит сухая смесь до и после реакции ────────────────────────
//
// Вид не хранится в правилах, а выводится из уравнения — как газы и ионы.
// До поджига горка пёстрая: крупинки каждого насыпанного вещества своего
// цвета. После реакции — масса продукта (шлак), а если в продуктах есть
// металл, у основания лежит его королёк.

import { REAGENT_MAP, SERVICE_TOKENS, Burn, matchReactions, getReactionDescription } from './reactions'
import { parseEquation } from './chem/formula'

/** Цвета продуктов, которых нет среди реагентов, и те, что отличаются от склянки */
const PRODUCT_COLOR: Record<string, string> = {
  // Металлы и простые вещества — цвет королька
  Fe: '#78909C', Cu: '#C77C48', Cr: '#B0BEC5', Mn: '#9E9E9E', Pb: '#78909C',
  Zn: '#B0BEC5', Sn: '#CFD8DC', Ag: '#E0E0E0', Si: '#607D8B', C: '#212121',
  // Оксиды и соли — цвет шлака
  'Al₂O₃': '#F5F5F5', MgO: '#FAFAFA', CaO: '#F5F5F5', 'Na₂O₂': '#FFF59D',
  'P₂O₅': '#FAFAFA', ZnO: '#FAFAFA', 'SnO₂': '#F5F5F5', PbO: '#FBC02D', CuO: '#263238',
  'Fe₃O₄': '#263238', 'Cr₂O₃': '#2E7D32', ZnS: '#FAFAFA', MgS: '#F5F5F5', PbS: '#212121',
  'Ag₂S': '#212121', SnS: '#5D4037', FeS: '#37474F', 'Cu₂S': '#212121', 'Al₂S₃': '#E0E0E0',
  'Mg₂Si': '#546E7A', 'AlI₃': '#FFF8E1', 'ZnI₂': '#FFF8E1', 'MgI₂': '#FFF8E1',
  // Обезвоженный медный купорос белый, хотя в склянке он синий
  'CuSO₄': '#F5F5F5', 'K₂MnO₄': '#1B5E20', 'KNO₂': '#FFFDE7', KCl: '#FAFAFA',
}

const METALS = new Set(['Fe', 'Cu', 'Cr', 'Mn', 'Pb', 'Zn', 'Sn', 'Ag', 'Si', 'Al', 'Mg', 'Na', 'K', 'Ca', 'Ba'])

/** Формула из подписи реагента → цвет склянки */
const LABEL_COLOR = new Map<string, string>(
  Object.values(REAGENT_MAP).map((r) => [r.label.replace(/\s*\(.*\)$/, ''), r.color]),
)

function colorOfFormula(formula: string): string | undefined {
  return PRODUCT_COLOR[formula] ?? LABEL_COLOR.get(formula)
}

export interface HeapVisual {
  /** Цвета крупинок до реакции: по одному на каждую насыпанную порцию */
  grains: string[]
  /** Реакция на горке прошла */
  reacted: boolean
  /** Цвет массы после реакции */
  slag: string
  /** Цвет королька металла, если металл восстановился */
  bead: string | null
  /** Характер реакции: вспышка, свечение, «вулкан» */
  burn: Burn | null
}

export function heapVisual(contents: string[]): HeapVisual {
  const portions = contents.filter((id) => !SERVICE_TOKENS.has(id))
  const grains = portions.map((id) => REAGENT_MAP[id]?.color ?? '#BDBDBD')
  const description = getReactionDescription(contents, true, 'plate') ?? ''
  const effects = matchReactions(contents, true, 'plate')

  // Берём уравнения сработавших правил — «заметки» без стрелки не в счёт
  const equations = description.split('  ·  ').map(parseEquation).filter((e) => e !== null)
  if (equations.length === 0) {
    return { grains, reacted: false, slag: grains[0] ?? '#BDBDBD', bead: null, burn: null }
  }

  // Без поджига и без явной пометки — спокойное свечение
  const heated = contents.includes('heat') || contents.includes('H2O_drop') || contents.includes('air')
  const burn = effects.burn ?? (heated ? 'glow' : null)

  let metal: string | null = null
  let slag: string | null = null
  for (const eq of equations) {
    const before = new Set(eq.left.map((t) => t.formula))
    for (const term of eq.right) {
      if (term.phase === 'gas' || term.formula === 'H₂O') continue
      // Металл, которого не было среди исходных, восстановился
      if (METALS.has(term.formula) && !before.has(term.formula)) {
        metal ??= colorOfFormula(term.formula) ?? '#9E9E9E'
      } else if (!slag && term.formula !== 'C') {
        // Сажа (Mg + CO₂) — не масса горки, она видна дымом
        slag = colorOfFormula(term.formula) ?? null
      }
    }
  }
  // Королёк — примета термита: металл плавится и стекает вниз под шлак.
  // При восстановлении углём или прокаливании металл остаётся порошком,
  // и цвет всей горки — это его цвет
  const bead = burn === 'flash' ? metal : null
  if (metal && !bead) slag = metal
  slag ??= effects.precipitate?.color ?? grains[0] ?? '#BDBDBD'

  return { grains, reacted: true, slag, bead, burn }
}
