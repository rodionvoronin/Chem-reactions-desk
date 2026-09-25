// ── Новые элементы: Be, B, Ga, As, Se, Ti, V, Mo, W, Ce, La ───────────────────
//
// По учебнику C. E. Housecroft, A. G. Sharpe «Inorganic Chemistry» (2-е изд.,
// Pearson, 2005). Взяты только опыты, которые ставятся в пробирке или горкой
// на плитке: цветные степени окисления ванадия, пероксокомплекс титана,
// молибденовая и вольфрамовая сини, жёлтый фосфоромолибдат, красный селен,
// сульфиды мышьяка, амфотерность бериллия и галлия, церий(IV) как окислитель.
//
// Фтороводород, фториды и вещества вроде VCl₄ или TiCl₄, которые дымят и
// гидролизуются на воздухе, в набор не попали — им нужна не пробирка.

import type { ReactionRule } from './reactions'

const CLEAR = 'rgba(200,200,200,0.10)'
const IODINE = 'rgba(110,45,0,0.55)'
// Ряд окрасок ванадия: жёлтый V(V) → синий V(IV) → зелёный V(III) → фиолетовый V(II)
const V5 = 'rgba(255,179,0,0.55)'
const V4 = 'rgba(21,101,192,0.55)'
const V3 = 'rgba(46,125,50,0.55)'
const V2 = 'rgba(123,31,162,0.55)'
const MO_BLUE = 'rgba(13,71,161,0.75)'

export const ELEMENT_REACTIONS: ReactionRule[] = [
  // ══ Бериллий: амфотерность, как у алюминия ════════════════════════════════
  {
    inputs: ['BeSO4', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'BeSO₄ + 2NaOH → Be(OH)₂↓ + Na₂SO₄',
  },
  {
    inputs: ['BeSO4', 'NaOH', 'NaOH'],
    effects: { liquidColor: CLEAR },
    description: 'BeSO₄ + 4NaOH → Na₂[Be(OH)₄] + Na₂SO₄  (избыток щёлочи — осадок растворяется: бериллий амфотерен)',
  },
  {
    inputs: ['BeSO4', 'NH3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'BeSO₄ + 2NH₃ + 2H₂O → Be(OH)₂↓ + (NH₄)₂SO₄  (в избытке аммиака осадок не растворяется)',
  },
  {
    inputs: ['BeSO4', 'Na2CO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' }, gas: true },
    description: '2BeSO₄ + 2Na₂CO₃ + H₂O → (BeOH)₂CO₃↓ + 2Na₂SO₄ + CO₂↑  (гидролиз до основного карбоната)',
  },

  // ══ Бор ═══════════════════════════════════════════════════════════════════
  {
    inputs: ['H3BO3', 'NaOH'],
    effects: { liquidColor: CLEAR },
    description: 'H₃BO₃ + NaOH → NaBO₂ + 2H₂O',
  },
  {
    inputs: ['H3BO3', 'heat'],
    effects: { precipitate: { color: '#FAFAFA' } },
    dryOnly: true,
    description: '2H₃BO₃ → B₂O₃ + 3H₂O  (борная кислота обезвоживается в стекловидный оксид)',
  },
  {
    inputs: ['Na2B4O7', 'H3BO3'],
    effects: { liquidColor: CLEAR },
    description: 'Na₂B₄O₇ + 2H₃BO₃ → 2NaBO₂ + 4HBO₂ + H₂O  (бура и борная кислота дают буферный раствор)',
  },

  // ══ Галлий: тоже амфотерный ═══════════════════════════════════════════════
  {
    inputs: ['GaCl3', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'GaCl₃ + 3NaOH → Ga(OH)₃↓ + 3NaCl',
  },
  {
    inputs: ['GaCl3', 'NaOH', 'NaOH'],
    effects: { liquidColor: CLEAR },
    description: 'GaCl₃ + 4NaOH → Na[Ga(OH)₄] + 3NaCl  (избыток щёлочи растворяет осадок)',
  },
  {
    inputs: ['GaCl3', 'NH3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'GaCl₃ + 3NH₃ + 3H₂O → Ga(OH)₃↓ + 3NH₄Cl  (в аммиаке осадок не растворяется — отличие от щёлочи)',
  },
  {
    inputs: ['GaCl3', 'AgNO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'GaCl₃ + 3AgNO₃ → 3AgCl↓ + Ga(NO₃)₃',
  },

  // ══ Мышьяк ════════════════════════════════════════════════════════════════
  {
    inputs: ['Na3AsO4', 'AgNO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#6D4C41' } },
    description: 'Na₃AsO₄ + 3AgNO₃ → Ag₃AsO₄↓ + 3NaNO₃  (шоколадно-бурый осадок — проба на арсенат)',
  },
  {
    inputs: ['Na3AsO3', 'AgNO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F9A825' } },
    description: 'Na₃AsO₃ + 3AgNO₃ → Ag₃AsO₃↓ + 3NaNO₃  (жёлтый осадок — отличие арсенита от арсената)',
  },
  {
    inputs: ['Na3AsO4', 'H2S_aq', 'HCl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F9A825' } },
    description: '2Na₃AsO₄ + 5H₂S + 6HCl → As₂S₃↓ + 2S↓ + 6NaCl + 8H₂O  (жёлтый сульфид мышьяка)',
  },
  {
    inputs: ['Na3AsO3', 'H2S_aq', 'HCl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F9A825' } },
    description: '2Na₃AsO₃ + 3H₂S + 6HCl → As₂S₃↓ + 6NaCl + 6H₂O',
  },
  {
    inputs: ['Na3AsO4', 'KI', 'HCl'],
    effects: { liquidColor: IODINE },
    description: 'Na₃AsO₄ + 2KI + 2HCl → Na₃AsO₃ + I₂ + 2KCl + H₂O  (в кислой среде арсенат окисляет иодид)',
  },
  {
    inputs: ['Na3AsO3', 'I2', 'NaOH'],
    effects: { liquidColor: CLEAR },
    description: 'Na₃AsO₃ + I₂ + 2NaOH → Na₃AsO₄ + 2NaI + H₂O  (в щелочной среде всё наоборот — иод окисляет арсенит)',
  },
  {
    inputs: ['Na3AsO4', 'MgCl2', 'NH4Cl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'Na₃AsO₄ + MgCl₂ + NH₄Cl → MgNH₄AsO₄↓ + 3NaCl  (белый осадок, как у фосфата)',
  },
  {
    inputs: ['Na3AsO4', 'CaCl2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: '2Na₃AsO₄ + 3CaCl₂ → Ca₃(AsO₄)₂↓ + 6NaCl',
  },

  // ══ Селен ═════════════════════════════════════════════════════════════════
  {
    inputs: ['H2SeO3', 'SO2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C62828' } },
    description: 'H₂SeO₃ + 2SO₂ + H₂O → Se↓ + 2H₂SO₄  (выпадает красный аморфный селен)',
  },
  {
    inputs: ['H2SeO3', 'KI', 'HCl'],
    effects: { liquidColor: IODINE, precipitate: { color: '#C62828' } },
    description: 'H₂SeO₃ + 4KI + 4HCl → Se↓ + 2I₂ + 4KCl + 3H₂O',
  },
  {
    inputs: ['H2SeO3', 'SnCl2', 'HCl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C62828' } },
    description: 'H₂SeO₃ + 2SnCl₂ + 4HCl → Se↓ + 2SnCl₄ + 3H₂O',
  },
  {
    inputs: ['H2SeO3', 'H2O2'],
    effects: { liquidColor: CLEAR },
    description: 'H₂SeO₃ + H₂O₂ → H₂SeO₄ + H₂O  (селеновая кислота — окислитель сильнее серной)',
  },
  {
    inputs: ['H2SeO3', 'NaOH'],
    effects: { liquidColor: CLEAR },
    description: 'H₂SeO₃ + 2NaOH → Na₂SeO₃ + 2H₂O',
  },
  {
    inputs: ['H2SeO3', 'Na2S'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FFF59D' } },
    description: 'H₂SeO₃ + 2Na₂S + 4HCl → SeS₂↓ + 4NaCl + 3H₂O  (жёлтый сульфид селена)',
  },

  // ══ Титан ═════════════════════════════════════════════════════════════════
  {
    inputs: ['TiOSO4', 'H2O2'],
    effects: { liquidColor: 'rgba(230,81,0,0.55)' },
    description: 'TiOSO₄ + H₂O₂ → [Ti(O₂)]SO₄ + H₂O  (оранжево-жёлтый пероксокомплекс — проба на титан)',
  },
  {
    inputs: ['TiOSO4', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' } },
    description: 'TiOSO₄ + 2NaOH → TiO(OH)₂↓ + Na₂SO₄  (белая титановая кислота)',
  },
  {
    inputs: ['TiOSO4', 'Zn_s', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(106,27,154,0.50)' },
    description: '2TiOSO₄ + Zn + 2H₂SO₄ → Ti₂(SO₄)₃ + ZnSO₄ + 2H₂O  (цинк восстанавливает титан до фиолетового Ti³⁺)',
  },
  {
    inputs: ['TiCl3', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#4A148C' } },
    description: 'TiCl₃ + 3NaOH → Ti(OH)₃↓ + 3NaCl  (тёмно-фиолетовый осадок)',
  },
  {
    inputs: ['TiCl3', 'air'],
    effects: { liquidColor: CLEAR },
    description: '4TiCl₃ + O₂ + 2H₂O → 4TiOCl₂ + 4HCl  (фиолетовый раствор Ti³⁺ на воздухе обесцвечивается)',
  },
  {
    inputs: ['TiCl3', 'FeCl3'],
    effects: { liquidColor: 'rgba(120,180,120,0.25)' },
    description: 'TiCl₃ + FeCl₃ + H₂O → TiOCl₂ + FeCl₂ + 2HCl  (титан(III) — сильный восстановитель)',
  },
  {
    inputs: ['TiCl3', 'KMnO4'],
    effects: { liquidColor: CLEAR },
    description: '5TiCl₃ + KMnO₄ + H₂O → 5TiOCl₂ + MnCl₂ + KCl + 2HCl  (титанометрия: малиновая окраска исчезает)',
  },
  {
    inputs: ['TiO2', 'H2SO4_conc', 'heat'],
    effects: { liquidColor: CLEAR },
    description: 'TiO₂ + H₂SO₄ → TiOSO₄ + H₂O  (диоксид титана растворяется только в горячей концентрированной кислоте)',
  },
  {
    inputs: ['TiO2', 'NaOH', 'heat'],
    effects: { precipitate: { color: '#FAFAFA' } },
    dryOnly: true,
    description: 'TiO₂ + 2NaOH → Na₂TiO₃ + H₂O  (сплавление со щёлочью)',
  },

  // ══ Ванадий: четыре степени окисления — четыре цвета ══════════════════════
  {
    inputs: ['NH4VO3', 'H2SO4_dilut'],
    effects: { liquidColor: V5 },
    description: '2NH₄VO₃ + 3H₂SO₄ → (VO₂)₂SO₄ + 2NH₄HSO₄ + 2H₂O  (в кислоте ванадат даёт жёлтый диоксованадий(V))',
  },
  {
    inputs: ['NH4VO3', 'Zn_s', 'H2SO4_dilut'],
    effects: { liquidColor: V4 },
    description: '2NH₄VO₃ + Zn + 4H₂SO₄ → 2VOSO₄ + ZnSO₄ + (NH₄)₂SO₄ + 4H₂O  (первая ступень: раствор синеет — V⁴⁺)',
  },
  {
    inputs: ['NH4VO3', 'Zn_s', 'Zn_s', 'H2SO4_dilut'],
    effects: { liquidColor: V3 },
    description: '2NH₄VO₃ + 2Zn + 6H₂SO₄ → V₂(SO₄)₃ + 2ZnSO₄ + (NH₄)₂SO₄ + 6H₂O  (вторая ступень: зелёный V³⁺)',
  },
  {
    inputs: ['NH4VO3', 'Zn_s', 'Zn_s', 'Zn_s', 'H2SO4_dilut'],
    effects: { liquidColor: V2 },
    description: '2NH₄VO₃ + 3Zn + 6H₂SO₄ → 2VSO₄ + 3ZnSO₄ + (NH₄)₂SO₄ + 6H₂O  (третья ступень: фиолетовый V²⁺)',
  },
  {
    inputs: ['NH4VO3', 'NaOH'],
    effects: { liquidColor: CLEAR, gas: true },
    description: 'NH₄VO₃ + 2NaOH → Na₂HVO₄ + NH₃↑ + H₂O  (в щёлочи — бесцветный ванадат)',
    // Аммиак виден по запаху, пузырьков почти нет
  },
  {
    inputs: ['VOSO4', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#90A4AE' } },
    description: 'VOSO₄ + 2NaOH → VO(OH)₂↓ + Na₂SO₄  (серо-синий осадок)',
  },
  {
    inputs: ['VOSO4', 'H2O2'],
    effects: { liquidColor: 'rgba(191,54,12,0.55)' },
    description: 'VOSO₄ + H₂O₂ → [V(O₂)]SO₄ + H₂O  (красно-бурый пероксокомплекс ванадия)',
  },
  {
    inputs: ['V2O5', 'NaOH'],
    effects: { liquidColor: CLEAR },
    description: 'V₂O₅ + 6NaOH → 2Na₃VO₄ + 3H₂O  (оксид ванадия(V) растворяется в щёлочи)',
  },
  {
    inputs: ['V2O5', 'HCl'],
    effects: { liquidColor: V4, gas: true },
    description: 'V₂O₅ + 6HCl → 2VOCl₂ + Cl₂↑ + 3H₂O  (концентрированная соляная кислота восстанавливает ванадий до V⁴⁺)',
  },

  // ══ Молибден и вольфрам ═══════════════════════════════════════════════════
  {
    inputs: ['Na2MoO4', 'H2SO4_dilut'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F9A825' } },
    description: 'Na₂MoO₄ + H₂SO₄ → MoO₃·H₂O↓ + Na₂SO₄  (жёлтая молибденовая кислота)',
  },
  {
    inputs: ['Na2WO4', 'HCl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FFF59D' } },
    description: 'Na₂WO₄ + 2HCl → WO₃·H₂O↓ + 2NaCl  (бледно-жёлтая вольфрамовая кислота)',
  },
  {
    inputs: ['Na2MoO4', 'Zn_s', 'HCl'],
    effects: { liquidColor: MO_BLUE, precipitate: { color: '#0D47A1' } },
    description: '2Na₂MoO₄ + Zn + 6HCl → Mo₂O₅↓ + ZnCl₂ + 4NaCl + 3H₂O  («молибденовая синь» — молибден в промежуточной степени окисления)',
  },
  {
    inputs: ['Na2WO4', 'Zn_s', 'HCl'],
    effects: { liquidColor: MO_BLUE, precipitate: { color: '#0D47A1' } },
    description: '2Na₂WO₄ + Zn + 6HCl → W₂O₅↓ + ZnCl₂ + 4NaCl + 3H₂O  («вольфрамовая синь»)',
  },
  {
    inputs: ['Na2MoO4', 'H2S_aq', 'HCl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: 'Na₂MoO₄ + 3H₂S + 2HCl → MoS₃↓ + 2NaCl + 4H₂O  (бурый сульфид молибдена)',
  },
  {
    inputs: ['Na2MoO4', 'Na3PO4', 'NH4NO3', 'HNO3_conc'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FDD835' } },
    description: 'Na₃PO₄ + 12Na₂MoO₄ + 3NH₄NO₃ + 24HNO₃ → (NH₄)₃[PMo₁₂O₄₀]↓ + 27NaNO₃ + 12H₂O  (жёлтый фосфоромолибдат — проба на фосфат)',
  },
  {
    inputs: ['Na2MoO4', 'BaCl2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' } },
    description: 'Na₂MoO₄ + BaCl₂ → BaMoO₄↓ + 2NaCl',
  },
  {
    inputs: ['Na2WO4', 'BaCl2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' } },
    description: 'Na₂WO₄ + BaCl₂ → BaWO₄↓ + 2NaCl',
  },

  // ══ Церий и лантан ════════════════════════════════════════════════════════
  {
    inputs: ['CeCl3', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' } },
    description: 'CeCl₃ + 3NaOH → Ce(OH)₃↓ + 3NaCl  (белый осадок)',
  },
  {
    inputs: ['CeCl3', 'NaOH', 'air'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FFB300' } },
    description: '4CeCl₃ + 12NaOH + O₂ + 2H₂O → 4Ce(OH)₄↓ + 12NaCl  (на воздухе белый осадок желтеет: церий окисляется до Ce⁴⁺)',
  },
  {
    inputs: ['CeCl3', 'NaOH', 'H2O2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FF8F00' } },
    description: '2CeCl₃ + 6NaOH + H₂O₂ → 2Ce(OH)₄↓ + 6NaCl  (пероксид сразу даёт оранжевый гидроксид церия(IV))',
  },
  {
    inputs: ['CeCl3', 'H2C2O4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' } },
    description: '2CeCl₃ + 3H₂C₂O₄ → Ce₂(C₂O₄)₃↓ + 6HCl  (оксалаты редкоземельных не растворяются даже в кислоте)',
  },
  {
    inputs: ['CeSO42', 'KI'],
    effects: { liquidColor: IODINE },
    description: '2Ce(SO₄)₂ + 2KI → Ce₂(SO₄)₃ + I₂ + K₂SO₄  (жёлтый Ce⁴⁺ — сильный окислитель, E° = +1,72 В)',
  },
  {
    inputs: ['CeSO42', 'FeSO4'],
    effects: { liquidColor: 'rgba(255,193,7,0.35)' },
    description: '2Ce(SO₄)₂ + 2FeSO₄ → Ce₂(SO₄)₃ + Fe₂(SO₄)₃  (цериметрия: жёлтая окраска исчезает)',
  },
  {
    inputs: ['CeSO42', 'H2O2'],
    effects: { liquidColor: CLEAR, gas: true },
    description: '2Ce(SO₄)₂ + H₂O₂ → Ce₂(SO₄)₃ + O₂↑ + H₂SO₄',
  },
  {
    inputs: ['CeSO42', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FFB300' } },
    description: 'Ce(SO₄)₂ + 4NaOH → Ce(OH)₄↓ + 2Na₂SO₄  (жёлтый осадок)',
  },
  {
    inputs: ['LaNO33', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' } },
    description: 'La(NO₃)₃ + 3NaOH → La(OH)₃↓ + 3NaNO₃  (студенистый белый осадок)',
  },
  {
    inputs: ['LaNO33', 'Na2CO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' } },
    description: '2La(NO₃)₃ + 3Na₂CO₃ → La₂(CO₃)₃↓ + 6NaNO₃',
  },
  {
    inputs: ['LaNO33', 'NaF'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' } },
    description: 'La(NO₃)₃ + 3NaF → LaF₃↓ + 3NaNO₃  (фториды РЗЭ нерастворимы — отличие от алюминия)',
  },
  {
    inputs: ['LaNO33', 'H2C2O4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FAFAFA' } },
    description: '2La(NO₃)₃ + 3H₂C₂O₄ → La₂(C₂O₄)₃↓ + 6HNO₃  (оксалат — групповой реактив на редкоземельные)',
  },

  // ══ Пероксид бария: лабораторный источник H₂O₂ ════════════════════════════
  {
    inputs: ['BaO2', 'H2SO4_dilut'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'BaO₂ + H₂SO₄ → BaSO₄↓ + H₂O₂  (классический способ получить пероксид водорода)',
  },
  {
    inputs: ['BaO2', 'HCl'],
    effects: { liquidColor: CLEAR },
    description: 'BaO₂ + 2HCl → BaCl₂ + H₂O₂',
  },
  {
    inputs: ['BaO2', 'heat'],
    effects: { precipitate: { color: '#FAFAFA' }, gas: true, burn: 'glow' },
    dryOnly: true,
    description: '2BaO₂ → 2BaO + O₂↑  (при прокаливании пероксид отдаёт кислород)',
  },

  // ══ Из той же книги — с реактивами, которые уже были на столе ═════════════
  {
    inputs: ['Cl2', 'H2O2'],
    effects: { liquidColor: CLEAR, gas: true },
    description: 'Cl₂ + H₂O₂ → 2HCl + O₂↑  (пероксид водорода восстанавливает хлор)',
  },
  {
    inputs: ['NaF', 'HF'],
    effects: { liquidColor: CLEAR },
    description: 'NaF + HF → Na[HF₂]  (гидродифторид — фтор образует прочную водородную связь)',
  },
  {
    inputs: ['AlOH3', 'HF', 'NaOH'],
    effects: { liquidColor: CLEAR },
    description: 'Al(OH)₃ + 6HF + 3NaOH → Na₃[AlF₆] + 6H₂O  (криолит)',
  },
  {
    inputs: ['CaSO4', 'NH3', 'CO2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'CaSO₄ + 2NH₃ + CO₂ + H₂O → CaCO₃↓ + (NH₄)₂SO₄  (мерзебургский процесс)',
  },
  {
    inputs: ['CaF2', 'SiO2', 'H2SO4_conc', 'heat'],
    effects: { liquidColor: CLEAR, gas: true },
    description: 'SiO₂ + 2H₂SO₄ + 2CaF₂ → SiF₄↑ + 2CaSO₄ + 2H₂O  (так травят стекло)',
  },
  {
    inputs: ['CaO', 'Cl2'],
    effects: { precipitate: { color: '#F5F5F5' } },
    dryOnly: true,
    description: '2CaO + 2Cl₂ → Ca(OCl)₂ + CaCl₂  (хлорная известь)',
  },
]
