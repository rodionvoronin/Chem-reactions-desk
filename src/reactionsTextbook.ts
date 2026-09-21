// ── Реакции из учебника «Неорганическая химия» (химфак МГУ, 2021) ─────────────
//
// Отобраны только опыты, которые ставятся в пробирке: растворы, осадки,
// нагревание над горелкой, выдерживание на воздухе. Сплавления, газофазные
// реакции, синтезы при сотнях градусов и взрывоопасные смеси (NCl₃, ClO₂,
// CrO₂Cl₂) сюда не попали — на столе их не повторить.
//
// Служебные токены в inputs:
//   'heat' — нагреть пробирку;
//   'air'  — оставить на воздухе (встряхнуть с воздухом): кислород медленно
//            окисляет Fe(OH)₂, Mn(OH)₂, Co(OH)₂, соединения Cu(I), иодид в
//            кислой среде. Без этого действия такие опыты было не поставить.
//
// Уравнения сверены по атомам и зарядам (npm run check:chem). Где в тексте
// учебника коэффициенты потерялись при вёрстке, они восстановлены.

import type { ReactionRule } from './reactions'

const CLEAR = 'rgba(200,200,200,0.10)'
const IODINE = 'rgba(110,45,0,0.55)'
const PERMANGANATE = 'rgba(156,39,176,0.60)'
const MANGANATE = 'rgba(46,125,50,0.62)'
const CHROMATE = 'rgba(255,214,0,0.62)'
const FERRATE = 'rgba(123,31,162,0.60)'
const AMMINE_CU = 'rgba(40,53,147,0.72)'

export const TEXTBOOK_REACTIONS: ReactionRule[] = [
  // ══ Воздух: медленное окисление кислородом ════════════════════════════════
  {
    inputs: ['FeSO4', 'NaOH', 'air'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#BF360C' } },
    description: '4FeSO₄ + 8NaOH + O₂ + 2H₂O → 4Fe(OH)₃↓ + 4Na₂SO₄  (серо-зелёный осадок на воздухе буреет)',
  },
  {
    inputs: ['FeCl2', 'NaOH', 'air'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#BF360C' } },
    description: '4FeCl₂ + 8NaOH + O₂ + 2H₂O → 4Fe(OH)₃↓ + 8NaCl  (серо-зелёный осадок на воздухе буреет)',
  },
  {
    inputs: ['MnSO4', 'NaOH', 'air'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: '4MnSO₄ + 8NaOH + O₂ → 4MnOOH↓ + 4Na₂SO₄ + 2H₂O  (белый осадок Mn(OH)₂ темнеет на воздухе)',
  },
  {
    inputs: ['MnCl2', 'NaOH', 'air'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: '4MnCl₂ + 8NaOH + O₂ → 4MnOOH↓ + 8NaCl + 2H₂O  (белый осадок Mn(OH)₂ темнеет на воздухе)',
  },
  {
    inputs: ['CoCl2', 'NaOH', 'air'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: '4CoCl₂ + 8NaOH + O₂ → 4CoOOH↓ + 8NaCl + 2H₂O  (розовый осадок Co(OH)₂ медленно буреет)',
  },
  {
    inputs: ['CoCl2', 'NH3', 'NH4Cl', 'air'],
    effects: { liquidColor: 'rgba(173,20,87,0.45)' },
    description: '4CoCl₂ + 16NH₃ + 4NH₄Cl + O₂ → 4[Co(NH₃)₅Cl]Cl₂ + 2H₂O  (аммиакат кобальта(II) окисляется воздухом, раствор краснеет)',
  },
  {
    inputs: ['Cu2O', 'NH3'],
    effects: { liquidColor: 'rgba(200,200,200,0.12)' },
    description: 'Cu₂O + 4NH₃ + H₂O → 2[Cu(NH₃)₂]OH  (красный осадок растворяется, раствор бесцветный)',
  },
  {
    inputs: ['Cu2O', 'NH3', 'air'],
    effects: { liquidColor: AMMINE_CU },
    description: '2Cu₂O + 16NH₃ + O₂ + 4H₂O → 4[Cu(NH₃)₄](OH)₂  (бесцветный раствор на воздухе синеет)',
  },
  {
    inputs: ['Cu_s', 'NH3', 'air'],
    effects: { liquidColor: AMMINE_CU },
    description: '2Cu + 8NH₃ + O₂ + 2H₂O → 2[Cu(NH₃)₄](OH)₂  (медь медленно растворяется в аммиаке при доступе воздуха)',
  },
  {
    inputs: ['Cu_s', 'HCl', 'air'],
    effects: { liquidColor: 'rgba(76,175,80,0.30)' },
    description: '2Cu + 4HCl + O₂ → 2CuCl₂ + 2H₂O  (без воздуха медь с соляной кислотой не реагирует)',
  },
  {
    inputs: ['KI', 'HCl', 'air'],
    effects: { liquidColor: IODINE },
    description: '4KI + 4HCl + O₂ → 2I₂ + 4KCl + 2H₂O  (подкисленный раствор иодида желтеет на воздухе)',
  },
  {
    inputs: ['Pb_s', 'CH3COOH', 'air'],
    effects: { liquidColor: CLEAR },
    description: '2Pb + 4CH₃COOH + O₂ → 2Pb(CH₃COO)₂ + 2H₂O  (свинец растворяется в уксусной кислоте только при доступе воздуха)',
  },
  {
    inputs: ['Ag_s', 'H2S_aq', 'air'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#212121' } },
    description: '4Ag + 2H₂S + O₂ → 2Ag₂S↓ + 2H₂O  (серебро чернеет)',
  },

  // ══ Водород и пероксид водорода ═══════════════════════════════════════════
  {
    inputs: ['AgNO3', 'NaOH', 'H2O2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C0C0C0' } },
    description: '2AgNO₃ + 2NaOH + H₂O₂ → 2Ag↓ + O₂↑ + 2NaNO₃ + 2H₂O  (бурый Ag₂O восстанавливается до серебра)',
  },
  {
    inputs: ['Al_s', 'NaOH', 'NaNO3', 'heat'],
    effects: { liquidColor: CLEAR, gas: true },
    description: '8Al + 5NaOH + 3NaNO₃ + 18H₂O → 8Na[Al(OH)₄] + 3NH₃↑  (нитрат восстанавливается до аммиака)',
  },

  // ══ Группа 2 ══════════════════════════════════════════════════════════════
  {
    inputs: ['MgCl2', 'NaHCO3', 'heat'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' }, gas: true },
    description: 'MgCl₂ + 2NaHCO₃ → MgCO₃↓ + CO₂↑ + H₂O + 2NaCl',
  },

  // ══ Группа 13 ═════════════════════════════════════════════════════════════
  {
    inputs: ['Al_s', 'ZnCl2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0C4BE' } },
    description: '2Al + 3ZnCl₂ → 2AlCl₃ + 3Zn↓',
  },

  // ══ Группа 14: олово и свинец ═════════════════════════════════════════════
  {
    inputs: ['Sn_s', 'HNO3_conc'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'Sn + 4HNO₃ → H₂SnO₃↓ + 4NO₂↑ + H₂O  (β-оловянная кислота — белый осадок)',
  },
  {
    inputs: ['Sn_s', 'NaOH', 'heat'],
    effects: { liquidColor: CLEAR, gas: true },
    description: 'Sn + NaOH + 2H₂O → Na[Sn(OH)₃] + H₂↑',
  },
  {
    inputs: ['Pb_s', 'NaOH', 'heat'],
    effects: { liquidColor: CLEAR, gas: true },
    description: 'Pb + 4NaOH + 2H₂O → Na₄[Pb(OH)₆] + H₂↑  (идёт медленно, в концентрированной щёлочи)',
  },
  {
    inputs: ['SnCl2', 'H2S_aq'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: 'SnCl₂ + H₂S → SnS↓ + 2HCl  (бурый осадок)',
  },
  {
    inputs: ['SnCl2', 'SO2', 'HCl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FFF59D' } },
    description: '2SnCl₂ + SO₂ + 8HCl → 2H₂[SnCl₆] + S↓ + 2H₂O',
  },
  {
    inputs: ['PbO2', 'HNO3_dilut', 'heat'],
    effects: { liquidColor: CLEAR, gas: true },
    description: '2PbO₂ + 4HNO₃ → 2Pb(NO₃)₂ + O₂↑ + 2H₂O  (бурый осадок растворяется)',
  },
  {
    inputs: ['Pb3O4', 'HNO3_dilut'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#3E2723' } },
    description: 'Pb₃O₄ + 4HNO₃ → PbO₂↓ + 2Pb(NO₃)₂ + 2H₂O  (сурик — смешанный оксид: Pb(II) уходит в раствор, остаётся бурый PbO₂)',
  },
  {
    inputs: ['Pb3O4', 'HCl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'Pb₃O₄ + 8HCl → 3PbCl₂↓ + Cl₂↑ + 4H₂O',
  },

  // ══ Группа 15: азот и фосфор ══════════════════════════════════════════════
  {
    inputs: ['NH3', 'HNO3_dilut'],
    effects: { liquidColor: CLEAR },
    description: 'NH₃ + HNO₃ → NH₄NO₃',
  },
  {
    inputs: ['NaNO2', 'H2S_aq', 'H2SO4_dilut'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FFF59D' } },
    description: '2NaNO₂ + 3H₂S + H₂SO₄ → Na₂SO₄ + N₂↑ + 3S↓ + 4H₂O',
  },
  {
    inputs: ['HNO3_conc', 'heat'],
    effects: { liquidColor: 'rgba(255,193,7,0.25)' },
    description: '4HNO₃ → 4NO₂↑ + O₂↑ + 2H₂O  (концентрированная кислота желтеет от растворённого NO₂)',
  },
  {
    inputs: ['FeSO4', 'H2SO4_dilut', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(255,193,7,0.30)' },
    description: '6FeSO₄ + 3H₂SO₄ + 2HNO₃ → 3Fe₂(SO₄)₃ + 2NO↑ + 4H₂O',
  },
  {
    inputs: ['FeSO4', 'KNO3', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(93,64,55,0.55)' },
    description: '8FeSO₄ + 2KNO₃ + 4H₂SO₄ → 3Fe₂(SO₄)₃ + K₂SO₄ + 2[Fe(NO)]SO₄ + 4H₂O  («бурое кольцо» — проба на нитрат-ион)',
  },
  {
    inputs: ['FeSO4', 'NaNO3', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(93,64,55,0.55)' },
    description: '8FeSO₄ + 2NaNO₃ + 4H₂SO₄ → 3Fe₂(SO₄)₃ + Na₂SO₄ + 2[Fe(NO)]SO₄ + 4H₂O  («бурое кольцо» — проба на нитрат-ион)',
  },
  {
    inputs: ['Na2HPO4', 'CaCl2', 'NH3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: '2Na₂HPO₄ + 3CaCl₂ + 2NH₃ → Ca₃(PO₄)₂↓ + 2NH₄Cl + 4NaCl',
  },
  {
    inputs: ['Na2HPO4', 'AgNO3', 'NH3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F9A825' } },
    description: 'Na₂HPO₄ + 3AgNO₃ + NH₃ → Ag₃PO₄↓ + NH₄NO₃ + 2NaNO₃',
  },
  {
    inputs: ['P_s', 'Br2'],
    effects: { liquidColor: CLEAR },
    description: '2P + 3Br₂ + 6H₂O → 2H₃PO₃ + 6HBr  (красный фосфор обесцвечивает бромную воду)',
  },
  {
    inputs: ['Zn_s', 'NaNO2', 'NaOH', 'heat'],
    effects: { liquidColor: CLEAR, gas: true },
    description: '3Zn + NaNO₂ + 5NaOH + 5H₂O → 3Na₂[Zn(OH)₄] + NH₃↑',
  },

  // ══ Группа 16: сера ═══════════════════════════════════════════════════════
  {
    inputs: ['H2S_aq', 'I2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FFF59D' } },
    description: 'H₂S + I₂ → 2HI + S↓  (иод обесцвечивается, выпадает сера)',
  },
  {
    inputs: ['MnO2', 'SO2'],
    effects: { liquidColor: 'rgba(248,187,208,0.20)' },
    description: 'MnO₂ + 2SO₂ → MnS₂O₆  (чёрный осадок растворяется в сернистой воде)',
  },
  {
    inputs: ['CuCl2', 'SO2'],
    effects: { liquidColor: 'rgba(200,200,200,0.12)' },
    description: '2CuCl₂ + SO₂ + 2H₂O → 2H[CuCl₂] + H₂SO₄  (зелёный раствор обесцвечивается)',
  },
  {
    inputs: ['CuSO4', 'SO2', 'KSCN'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: '2CuSO₄ + SO₂ + 2KSCN + 2H₂O → 2CuSCN↓ + K₂SO₄ + 2H₂SO₄',
  },
  {
    inputs: ['HgCl2', 'SO2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: '2HgCl₂ + SO₂ + 2H₂O → Hg₂Cl₂↓ + H₂SO₄ + 2HCl',
  },
  {
    inputs: ['NaHSO3', 'I2'],
    effects: { liquidColor: CLEAR },
    description: 'NaHSO₃ + I₂ + H₂O → NaHSO₄ + 2HI  (иод обесцвечивается)',
  },
  {
    inputs: ['NaHSO3', 'CaCl2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'CaCl₂ + 2NaHSO₃ → CaSO₃↓ + SO₂↑ + 2NaCl + H₂O',
  },
  {
    inputs: ['NaHSO3', 'HCl'],
    effects: { liquidColor: CLEAR },
    description: 'NaHSO₃ + HCl → NaCl + SO₂↑ + H₂O',
  },
  {
    inputs: ['K2S2O8', 'KI'],
    effects: { liquidColor: IODINE },
    description: 'K₂S₂O₈ + 2KI → I₂ + 2K₂SO₄',
  },
  {
    inputs: ['K2S2O8', 'MnSO4', 'heat'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: 'K₂S₂O₈ + MnSO₄ + 3H₂O → MnO(OH)₂↓ + K₂SO₄ + 2H₂SO₄  (без катализатора — бурый осадок)',
  },
  {
    inputs: ['K2S2O8', 'MnSO4', 'AgNO3', 'heat'],
    effects: { liquidColor: PERMANGANATE },
    description: '5K₂S₂O₈ + 2MnSO₄ + 8H₂O → 2KMnO₄ + 4K₂SO₄ + 8H₂SO₄  (катализатор Ag⁺ — раствор становится малиновым)',
  },
  {
    inputs: ['K2S2O8', 'Cr2SO43', 'AgNO3', 'heat'],
    effects: { liquidColor: 'rgba(255,111,0,0.58)' },
    description: '3K₂S₂O₈ + Cr₂(SO₄)₃ + 7H₂O → K₂Cr₂O₇ + 2K₂SO₄ + 7H₂SO₄  (катализатор Ag⁺ — зелёный раствор становится оранжевым)',
  },
  {
    inputs: ['K2S2O8', 'AgNO3', 'KOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#212121' } },
    description: 'K₂S₂O₈ + 2AgNO₃ + 4KOH → 2AgO↓ + 2K₂SO₄ + 2KNO₃ + 2H₂O',
  },

  // ══ Группа 17: галогены ═══════════════════════════════════════════════════
  {
    inputs: ['Cl2', 'AgNO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: '3Cl₂ + 5AgNO₃ + 3H₂O → 5AgCl↓ + HClO₃ + 5HNO₃',
  },
  {
    inputs: ['Cl2', 'CaCO3'],
    effects: { liquidColor: CLEAR },
    description: '2Cl₂ + 2CaCO₃ + 2H₂O → 2HClO + CaCl₂ + Ca(HCO₃)₂  (мел растворяется в хлорной воде)',
  },
  {
    inputs: ['MnO2', 'KI', 'H2SO4_dilut'],
    effects: { liquidColor: IODINE },
    description: 'MnO₂ + 2KI + 2H₂SO₄ → I₂ + MnSO₄ + K₂SO₄ + 2H₂O',
  },
  {
    inputs: ['NaClO', 'NH3'],
    effects: { liquidColor: CLEAR },
    description: '3NaClO + 2NH₃ → 3NaCl + N₂↑ + 3H₂O',
  },
  {
    inputs: ['KI', 'NaClO', 'NaClO'],
    effects: { liquidColor: CLEAR },
    description: 'KI + 3NaClO → KIO₃ + 3NaCl  (в избытке гипохлорита бурая окраска иода исчезает)',
  },
  {
    inputs: ['KClO3', 'I2', 'heat'],
    effects: { liquidColor: CLEAR },
    description: '2KClO₃ + I₂ → 2KIO₃ + Cl₂↑  (иод вытесняет хлор из хлората)',
  },

  // ══ Хром ══════════════════════════════════════════════════════════════════
  {
    inputs: ['CrOH3', 'Br2', 'NaOH'],
    effects: { liquidColor: CHROMATE },
    description: '2Cr(OH)₃ + 3Br₂ + 10NaOH → 2Na₂CrO₄ + 6NaBr + 8H₂O',
  },
  {
    inputs: ['K2Cr2O7', 'BaCl2'],
    effects: { liquidColor: 'rgba(255,152,0,0.35)', precipitate: { color: '#FDD835' } },
    description: '2K₂Cr₂O₇ + 2BaCl₂ + H₂O → 2BaCrO₄↓ + 4KCl + H₂Cr₂O₇  (из дихромата выпадает хромат: он менее растворим)',
  },
  {
    inputs: ['K2CrO4', 'H2O2', 'KOH'],
    effects: { liquidColor: 'rgba(136,14,79,0.55)', gas: true },
    description: '2K₂CrO₄ + 9H₂O₂ + 2KOH → 2K₃CrO₈ + O₂↑ + 10H₂O  (при охлаждении — красно-коричневый пероксохромат)',
  },
  {
    inputs: ['K2Cr2O7', 'H2C2O4'],
    effects: { liquidColor: 'rgba(106,27,154,0.45)', gas: true },
    description: 'K₂Cr₂O₇ + 7H₂C₂O₄ → 2K[Cr(C₂O₄)₂(H₂O)₂] + 6CO₂↑ + 3H₂O  (оранжевый раствор становится фиолетовым)',
  },

  // ══ Марганец ══════════════════════════════════════════════════════════════
  {
    inputs: ['KMnO4', 'KOH', 'heat'],
    effects: { liquidColor: MANGANATE, gas: true },
    description: '4KMnO₄ + 4KOH → 4K₂MnO₄ + O₂↑ + 2H₂O  (в концентрированной щёлочи малиновый раствор зеленеет)',
  },
  {
    inputs: ['KMnO4', 'NaOH', 'heat'],
    effects: { liquidColor: MANGANATE, gas: true },
    description: '4KMnO₄ + 4NaOH → 2K₂MnO₄ + 2Na₂MnO₄ + O₂↑ + 2H₂O  (малиновый раствор зеленеет)',
  },
  {
    inputs: ['K2MnO4', 'H2SO4_dilut'],
    effects: { liquidColor: PERMANGANATE, precipitate: { color: '#3E2723' } },
    description: '3K₂MnO₄ + 2H₂SO₄ → 2KMnO₄ + MnO₂↓ + 2K₂SO₄ + 2H₂O  (в кислой среде манганат диспропорционирует)',
  },
  {
    inputs: ['K2MnO4', 'CO2'],
    effects: { liquidColor: PERMANGANATE, precipitate: { color: '#3E2723' } },
    description: '3K₂MnO₄ + 2CO₂ → 2KMnO₄ + MnO₂↓ + 2K₂CO₃',
  },
  {
    inputs: ['K2MnO4', 'Cl2'],
    effects: { liquidColor: PERMANGANATE },
    description: '2K₂MnO₄ + Cl₂ → 2KMnO₄ + 2KCl  (зелёный раствор становится малиновым)',
  },
  {
    inputs: ['K2MnO4', 'CH3COOH'],
    effects: { liquidColor: PERMANGANATE, precipitate: { color: '#3E2723' } },
    description: '3K₂MnO₄ + 4CH₃COOH → 2KMnO₄ + MnO₂↓ + 4CH₃COOK + 2H₂O',
  },
  {
    inputs: ['MnSO4', 'H2O2', 'NH3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: '2MnSO₄ + H₂O₂ + 4NH₃ + 2H₂O → 2MnOOH↓ + 2(NH₄)₂SO₄',
  },
  {
    inputs: ['MnCl2', 'NaHCO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F8BBD0' }, gas: true },
    description: 'MnCl₂ + 2NaHCO₃ → MnCO₃↓ + 2NaCl + CO₂↑ + H₂O',
  },
  {
    inputs: ['MnSO4', 'NaHCO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F8BBD0' }, gas: true },
    description: 'MnSO₄ + 2NaHCO₃ → MnCO₃↓ + Na₂SO₄ + CO₂↑ + H₂O',
  },
  {
    inputs: ['KMnO4', 'H2C2O4', 'H2SO4_dilut'],
    effects: { liquidColor: CLEAR, gas: true },
    description: '2KMnO₄ + 5H₂C₂O₄ + 3H₂SO₄ → 2MnSO₄ + K₂SO₄ + 10CO₂↑ + 8H₂O  (малиновый раствор обесцвечивается)',
  },

  // ══ Железо ════════════════════════════════════════════════════════════════
  {
    inputs: ['FeOH3', 'Br2', 'KOH', 'heat'],
    effects: { liquidColor: FERRATE },
    description: '2Fe(OH)₃ + 3Br₂ + 10KOH → 2K₂FeO₄ + 6KBr + 8H₂O  (феррат — красно-фиолетовый раствор)',
  },
  {
    inputs: ['K4FeCN6', 'Cl2'],
    effects: { liquidColor: 'rgba(255,160,0,0.50)' },
    description: '2K₄[Fe(CN)₆] + Cl₂ → 2K₃[Fe(CN)₆] + 2KCl  (жёлтая кровяная соль переходит в красную)',
  },

  // ══ Медь ══════════════════════════════════════════════════════════════════
  {
    inputs: ['CuOH2', 'NaOH', 'NaOH'],
    effects: { liquidColor: 'rgba(48,63,159,0.55)' },
    description: 'Cu(OH)₂ + 2NaOH → Na₂[Cu(OH)₄]  (в концентрированной щёлочи — сине-фиолетовый раствор)',
  },
  {
    inputs: ['CuSO4', 'NaHCO3'],
    effects: { liquidColor: 'rgba(38,166,154,0.15)', precipitate: { color: '#26A69A' }, gas: true },
    description: '2CuSO₄ + 4NaHCO₃ → (CuOH)₂CO₃↓ + 2Na₂SO₄ + 3CO₂↑ + H₂O',
  },
  {
    inputs: ['Cu2O', 'HCl'],
    effects: { liquidColor: 'rgba(200,200,200,0.12)' },
    description: 'Cu₂O + 4HCl → 2H[CuCl₂] + H₂O  (красный осадок растворяется, раствор бесцветный)',
  },
  {
    inputs: ['CuCl2', 'Cu_s', 'HCl', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.12)' },
    description: 'CuCl₂ + Cu + 2HCl → 2H[CuCl₂]  (при кипячении с медью зелёный раствор обесцвечивается)',
  },

  // ══ Цинк ══════════════════════════════════════════════════════════════════
  {
    inputs: ['Zn_s', 'NH3'],
    effects: { liquidColor: CLEAR, gas: true },
    description: 'Zn + 4NH₃ + 2H₂O → [Zn(NH₃)₄](OH)₂ + H₂↑',
  },

  // ══ Ртуть(I) ══════════════════════════════════════════════════════════════
  {
    inputs: ['Hg2NO32', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#212121' } },
    description: 'Hg₂(NO₃)₂ + 2NaOH → Hg↓ + HgO↓ + 2NaNO₃ + H₂O  (ртуть(I) диспропорционирует — осадок чёрный)',
  },
  {
    inputs: ['Hg2NO32', 'NH3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#212121' } },
    description: 'Hg₂(NO₃)₂ + 2NH₃ → [HgNH₂]NO₃↓ + Hg↓ + NH₄NO₃  (чёрный осадок)',
  },
  {
    inputs: ['Hg2NO32', 'HCl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'Hg₂(NO₃)₂ + 2HCl → Hg₂Cl₂↓ + 2HNO₃  (каломель)',
  },
  {
    inputs: ['Hg2NO32', 'NaCl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'Hg₂(NO₃)₂ + 2NaCl → Hg₂Cl₂↓ + 2NaNO₃',
  },
  {
    inputs: ['Hg2NO32', 'KI'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#AFB42B' } },
    description: 'Hg₂(NO₃)₂ + 2KI → Hg₂I₂↓ + 2KNO₃  (жёлто-зелёный осадок)',
  },
  {
    inputs: ['Hg2NO32', 'Na2S'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#212121' } },
    description: 'Hg₂(NO₃)₂ + Na₂S → HgS↓ + Hg↓ + 2NaNO₃',
  },
  {
    inputs: ['Hg2NO32', 'HNO3_conc'],
    effects: { liquidColor: CLEAR },
    description: 'Hg₂(NO₃)₂ + 4HNO₃ → 2Hg(NO₃)₂ + 2NO₂↑ + 2H₂O',
  },

  // ══ Щавелевая кислота ═════════════════════════════════════════════════════
  {
    inputs: ['H2C2O4', 'CaCl2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'CaCl₂ + H₂C₂O₄ → CaC₂O₄↓ + 2HCl  (оксалат кальция — проба на Ca²⁺)',
  },
  {
    inputs: ['H2C2O4', 'H2SO4_conc', 'heat'],
    effects: { liquidColor: CLEAR },
    description: 'H₂C₂O₄ → CO↑ + CO₂↑ + H₂O  (концентрированная серная кислота отнимает воду)',
  },
]
