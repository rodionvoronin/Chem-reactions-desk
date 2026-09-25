// ── Дымящие хлориды и травление стекла ────────────────────────────────────────
//
// Эти реакции раньше не попадали на стол: TiCl₄ и VCl₄ дымят от влаги воздуха,
// а плавиковая кислота разъедает саму пробирку. И то и другое теперь можно
// показать честно — через материал посуды и действие «на воздух».
//
// Служебные токены посуды: 'glass' — стеклянная пробирка, 'ptfe' —
// фторопластовая, 'plate' — плитка для горки. Один из них всегда добавлен
// к содержимому, поэтому правило может потребовать конкретную посуду: так
// травление стекла идёт только там, где стекло есть.
//
// Гидролиз записан двумя правилами: в воде (мокрая пробирка) и от влаги
// воздуха (сухая пробирка + «🌬 На воздух»). Второе помечено dryOnly:
// в мокрой пробирке хлорид уже разложился водой.

import type { ReactionRule } from './reactions'

const CLEAR = 'rgba(200,200,200,0.10)'
const IODINE = 'rgba(110,45,0,0.55)'
/** Белый дым хлороводорода и оксида — то, ради чего эти опыты и ставят */
const FUMES = { gas: true, gasId: 'SMOKE' as const }

export const VESSEL_REACTIONS: ReactionRule[] = [
  // ══ Тетрахлорид титана: дымит на воздухе ══════════════════════════════════
  {
    inputs: ['TiCl4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' }, gas: true },
    description: 'TiCl₄ + 2H₂O → TiO₂↓ + 4HCl↑  (в воде гидролиз идёт бурно, раствор мутнеет)',
  },
  {
    inputs: ['TiCl4', 'air'],
    effects: { precipitate: { color: '#FAFAFA' }, ...FUMES },
    dryOnly: true,
    description: 'TiCl₄ + 2H₂O → TiO₂↓ + 4HCl↑  (жидкость дымит от влаги воздуха — белый туман TiO₂ и HCl)',
  },
  {
    inputs: ['TiCl4', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' } },
    description: 'TiCl₄ + 4NaOH → TiO(OH)₂↓ + 4NaCl + H₂O',
  },
  {
    inputs: ['TiCl4', 'TiO2', 'heat'],
    effects: { precipitate: { color: '#FAFAFA' } },
    dryOnly: true,
    description: 'TiCl₄ + TiO₂ → 2TiOCl₂  (сплавление хлорида с оксидом)',
  },

  // ══ Тетрахлорид ванадия: красно-бурая дымящая жидкость ════════════════════
  {
    inputs: ['VCl4'],
    effects: { liquidColor: 'rgba(21,101,192,0.55)', gas: true },
    description: 'VCl₄ + H₂O → VOCl₂ + 2HCl↑  (бурая жидкость гидролизуется до синего ванадила)',
  },
  {
    inputs: ['VCl4', 'air'],
    effects: { ...FUMES },
    dryOnly: true,
    description: 'VCl₄ + H₂O → VOCl₂ + 2HCl↑  (жидкость дымит на влажном воздухе)',
  },
  {
    inputs: ['VCl4', 'heat'],
    effects: { gas: true, burn: 'glow' },
    dryOnly: true,
    description: '2VCl₄ → 2VCl₃ + Cl₂↑  (при нагревании хлорид ванадия(IV) отщепляет хлор)',
  },
  {
    inputs: ['VCl4', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#90A4AE' } },
    description: 'VCl₄ + 4NaOH → VO(OH)₂↓ + 4NaCl + H₂O',
  },

  // ══ Хлориды кремния, олова и сурьмы ═══════════════════════════════════════
  {
    inputs: ['SiCl4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' }, gas: true },
    description: 'SiCl₄ + 2H₂O → SiO₂↓ + 4HCl↑  (кремниевая кислота выпадает студнем)',
  },
  {
    inputs: ['SiCl4', 'air'],
    effects: { precipitate: { color: '#FAFAFA' }, ...FUMES },
    dryOnly: true,
    description: 'SiCl₄ + 2H₂O → SiO₂↓ + 4HCl↑  (на воздухе жидкость дымит)',
  },
  {
    inputs: ['SnCl4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' }, gas: true },
    description: 'SnCl₄ + 2H₂O → SnO₂↓ + 4HCl↑',
  },
  {
    inputs: ['SnCl4', 'air'],
    effects: { precipitate: { color: '#FAFAFA' }, ...FUMES },
    dryOnly: true,
    description: 'SnCl₄ + 2H₂O → SnO₂↓ + 4HCl↑  (дымящая жидкость Либавия)',
  },
  {
    inputs: ['SnCl4', 'Na2S'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FFC107' } },
    description: 'SnCl₄ + 2Na₂S → SnS₂↓ + 4NaCl  («сусальное золото» — золотисто-жёлтый осадок)',
  },
  {
    inputs: ['SnCl4', 'Sn_s'],
    effects: { liquidColor: CLEAR },
    description: 'SnCl₄ + Sn → 2SnCl₂  (олово восстанавливает свой же высший хлорид)',
  },
  {
    inputs: ['SbCl5'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' }, gas: true },
    description: 'SbCl₅ + H₂O → SbOCl₃ + 2HCl↑  (гидролиз до оксохлорида сурьмы)',
  },
  {
    inputs: ['SbCl5', 'air'],
    effects: { precipitate: { color: '#FAFAFA' }, ...FUMES },
    dryOnly: true,
    description: 'SbCl₅ + H₂O → SbOCl₃ + 2HCl↑  (жёлтая жидкость дымит на воздухе)',
  },
  {
    inputs: ['SbCl5', 'KI'],
    effects: { liquidColor: IODINE },
    description: 'SbCl₅ + 2KI → SbCl₃ + I₂ + 2KCl  (сурьма(V) окисляет иодид)',
  },
  {
    inputs: ['SbCl5', 'heat'],
    effects: { gas: true, burn: 'glow' },
    dryOnly: true,
    description: 'SbCl₅ → SbCl₃ + Cl₂↑  (при нагревании отщепляется хлор)',
  },

  // ══ Плавиковая кислота разъедает стекло ═══════════════════════════════════
  {
    inputs: ['HF', 'glass'],
    effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true },
    description: 'SiO₂ + 4HF → SiF₄↑ + 2H₂O  (плавиковая кислота растворяет само стекло: пробирка мутнеет)',
  },
  {
    inputs: ['HF', 'TiO2'],
    effects: { liquidColor: CLEAR },
    description: 'TiO₂ + 6HF → H₂[TiF₆] + 2H₂O  (диоксид титана растворяется только в плавиковой кислоте)',
  },
  {
    inputs: ['HF', 'SiO2', 'NaF'],
    effects: { liquidColor: CLEAR },
    description: 'SiO₂ + 4HF + 2NaF → Na₂[SiF₆] + 2H₂O  (гексафторосиликат натрия)',
  },
  {
    inputs: ['HF', 'CaCO3'],
    effects: { precipitate: { color: '#ECEFF1' }, gas: true },
    description: 'CaCO₃ + 2HF → CaF₂↓ + CO₂↑ + H₂O',
  },
  {
    inputs: ['HF', 'Al2O3'],
    effects: { liquidColor: CLEAR },
    description: 'Al₂O₃ + 6HF → 2AlF₃ + 3H₂O',
  },
  {
    inputs: ['HF', 'Na2CO3'],
    effects: { liquidColor: CLEAR, gas: true },
    description: '2HF + Na₂CO₃ → 2NaF + CO₂↑ + H₂O',
  },
  {
    inputs: ['HF', 'KOH'],
    effects: { liquidColor: CLEAR },
    description: 'HF + KOH → KF + H₂O',
  },
]
