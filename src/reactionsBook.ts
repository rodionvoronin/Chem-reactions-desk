// ── Реакции из пособия Н. С. Крысанова «Химия непереходных элементов
//    в олимпиадных задачах» (МЦНМО, 2024) ─────────────────────────────────────
//
// В базу берём только то, что можно поставить на лабораторном столе:
// смешать растворы, внести твёрдое вещество, прокалить в пробирке. Реакции
// в жидком аммиаке, при высоком давлении и с газообразным фтором остались
// в книге — песочница их не воспроизводит, и в журнале они были бы враньём.
//
// Уравнения — единственный источник правды, как и в основной таблице:
// продукты, ионы и степени окисления из них разбираются автоматически,
// а баланс атомов проверяет `npm run check:chem`.
//
// Сюда вынесено отдельно, чтобы было видно, откуда реакции пришли; для
// песочницы и заданий это обычная часть REACTION_TABLE.

import type { ReactionRule } from './reactions'

/** Раствор после реакции остался бесцветным */
const CLEAR = 'rgba(200,200,200,0.10)'
const IODINE = 'rgba(110,45,0,0.55)'
const PERMANGANATE = 'rgba(156,39,176,0.60)'

export const BOOK_REACTIONS: ReactionRule[] = [
  // ── Окраска растворов новых реагентов ─────────────────────────────────────
  { inputs: ['K3FeCN6'],  effects: { liquidColor: 'rgba(255,193,7,0.45)' },   description: '' },
  { inputs: ['K4FeCN6'],  effects: { liquidColor: 'rgba(255,241,118,0.30)' }, description: '' },
  { inputs: ['Na3CoNO26'], effects: { liquidColor: 'rgba(230,120,30,0.50)' }, description: '' },

  // ══ Гр. I — качественные реакции на Li⁺, Na⁺, K⁺ (гл. 9.6) ═══════════════
  // Литий образует малорастворимые соли с небольшими анионами
  {
    inputs: ['LiCl', 'Na2CO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: '2LiCl + Na₂CO₃ → Li₂CO₃↓ + 2NaCl',
  },
  {
    inputs: ['LiCl', 'NaF'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'LiCl + NaF → LiF↓ + NaCl',
  },
  {
    inputs: ['LiCl', 'Na3PO4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: '3LiCl + Na₃PO₄ → Li₃PO₄↓ + 3NaCl',
  },
  // Натрий — с анионом среднего размера
  {
    inputs: ['NaCl', 'KSbOH6'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'NaCl + K[Sb(OH)₆] → Na[Sb(OH)₆]↓ + KCl',
  },
  {
    inputs: ['NaNO3', 'KSbOH6'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'NaNO₃ + K[Sb(OH)₆] → Na[Sb(OH)₆]↓ + KNO₃',
  },
  {
    inputs: ['KCl', 'KSbOH6'],
    effects: { liquidColor: CLEAR },
    description: 'KCl + K[Sb(OH)₆] — осадка нет: гексагидроксоантимонат калия растворим',
  },
  // Калий, рубидий, цезий — с крупными анионами
  {
    inputs: ['KCl', 'NaClO4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'KCl + NaClO₄ → KClO₄↓ + NaCl',
  },
  {
    inputs: ['KNO3', 'NaClO4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'KNO₃ + NaClO₄ → KClO₄↓ + NaNO₃',
  },
  {
    inputs: ['NaCl', 'NaClO4'],
    effects: { liquidColor: CLEAR },
    description: 'NaCl + NaClO₄ — осадка нет: перхлорат натрия растворим, в отличие от KClO₄',
  },
  {
    inputs: ['KCl', 'Na3CoNO26'],
    effects: { liquidColor: 'rgba(230,120,30,0.30)', precipitate: { color: '#F9A825' } },
    description: '2KCl + Na₃[Co(NO₂)₆] → K₂Na[Co(NO₂)₆]↓ + 2NaCl',
  },
  {
    inputs: ['KNO3', 'Na3CoNO26'],
    effects: { liquidColor: 'rgba(230,120,30,0.30)', precipitate: { color: '#F9A825' } },
    description: '2KNO₃ + Na₃[Co(NO₂)₆] → K₂Na[Co(NO₂)₆]↓ + 2NaNO₃',
  },
  {
    inputs: ['NaCl', 'Na3CoNO26'],
    effects: { liquidColor: 'rgba(230,120,30,0.50)' },
    description: 'NaCl + Na₃[Co(NO₂)₆] — осадка нет: реактив осаждает только K⁺, Rb⁺, Cs⁺ и NH₄⁺',
  },

  // ══ Гр. II — магний, стронций (гл. 10) ═════════════════════════════════
  {
    inputs: ['SrCl2', 'Na2SO4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'SrCl₂ + Na₂SO₄ → SrSO₄↓ + 2NaCl',
  },
  {
    inputs: ['SrCl2', 'H2SO4_dilut'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'SrCl₂ + H₂SO₄ → SrSO₄↓ + 2HCl',
  },
  {
    inputs: ['SrCl2', 'Na2CO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'SrCl₂ + Na₂CO₃ → SrCO₃↓ + 2NaCl',
  },
  {
    inputs: ['SrCl2', 'NaF'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'SrCl₂ + 2NaF → SrF₂↓ + 2NaCl',
  },
  {
    inputs: ['SrCl2', 'AgNO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'SrCl₂ + 2AgNO₃ → 2AgCl↓ + Sr(NO₃)₂',
  },
  // Магний-аммоний-фосфат — классическое обнаружение Mg²⁺
  {
    inputs: ['MgCl2', 'Na2HPO4', 'NH3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'MgCl₂ + Na₂HPO₄ + NH₃ → MgNH₄PO₄↓ + 2NaCl',
  },
  {
    inputs: ['CaCl2', 'Na2HPO4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'CaCl₂ + Na₂HPO₄ → CaHPO₄↓ + 2NaCl',
  },
  {
    inputs: ['BaCl2', 'Na2HPO4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'BaCl₂ + Na₂HPO₄ → BaHPO₄↓ + 2NaCl',
  },
  // Магний растворяется в растворах солей аммония — они слабокислые
  {
    inputs: ['Mg_s', 'NH4Cl'],
    effects: { gas: true },
    description: 'Mg + 2NH₄Cl → MgCl₂ + 2NH₃↑ + H₂↑',
  },

  // ══ Гр. III — бор (гл. 11.1) ══════════════════════════════════════════
  {
    inputs: ['phenolphthalein', 'Na2B4O7'],
    effects: { liquidColor: 'rgba(233,30,140,0.34)' },
    description: 'Фенолфталеин — индикатор: бура гидролизуется, среда слабощелочная (pH ≈ 9)',
  },
  {
    inputs: ['Na2B4O7', 'H2SO4_dilut'],
    effects: { liquidColor: CLEAR },
    description: 'Na₂B₄O₇ + H₂SO₄ + 5H₂O → 4H₃BO₃ + Na₂SO₄',
  },
  {
    inputs: ['Na2B4O7', 'HCl'],
    effects: { liquidColor: CLEAR },
    description: 'Na₂B₄O₇ + 2HCl + 5H₂O → 4H₃BO₃ + 2NaCl',
  },

  // ══ Гр. IV — олово и свинец (гл. 12.4–12.5) ═════════════════════════════
  {
    inputs: ['Sn_s', 'HCl'],
    effects: { gas: true },
    description: 'Sn + 2HCl → SnCl₂ + H₂↑',
  },
  {
    inputs: ['SnCl2', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'SnCl₂ + 2NaOH → Sn(OH)₂↓ + 2NaCl',
  },
  {
    inputs: ['SnCl2', 'NaOH', 'NaOH'],
    effects: { liquidColor: CLEAR },
    description: 'SnCl₂ + 3NaOH → Na[Sn(OH)₃] + 2NaCl  (избыток NaOH — осадок Sn(OH)₂ растворяется)',
  },
  {
    inputs: ['SnCl2', 'Na2S'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: 'SnCl₂ + Na₂S → SnS↓ + 2NaCl',
  },
  // Двухвалентное олово — сильный восстановитель
  {
    inputs: ['SnCl2', 'FeCl3'],
    effects: { liquidColor: 'rgba(100,160,100,0.30)' },
    description: 'SnCl₂ + 2FeCl₃ → SnCl₄ + 2FeCl₂  (Окислитель: Fe³⁺ → Fe²⁺, Восстановитель: Sn²⁺ → Sn⁴⁺)',
  },
  {
    inputs: ['SnCl2', 'I2', 'HCl'],
    effects: { liquidColor: CLEAR },
    description: 'SnCl₂ + I₂ + 2HCl → SnCl₄ + 2HI  (иод обесцвечивается; Окислитель: I⁰ → I⁻, Восстановитель: Sn²⁺ → Sn⁴⁺)',
  },
  {
    inputs: ['SnCl2', 'HgCl2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'SnCl₂ + 2HgCl₂ → Hg₂Cl₂↓ + SnCl₄  (Окислитель: Hg²⁺ → Hg⁺, Восстановитель: Sn²⁺ → Sn⁴⁺)',
  },
  {
    inputs: ['SnCl2', 'SnCl2', 'HgCl2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#212121' } },
    description: 'SnCl₂ + HgCl₂ → Hg↓ + SnCl₄  (избыток SnCl₂ — белый осадок чернеет; Окислитель: Hg²⁺ → Hg⁰, Восстановитель: Sn²⁺ → Sn⁴⁺)',
  },
  // Свинец: в соляной кислоте мешает плёнка PbCl₂, в азотной растворяется
  {
    inputs: ['Pb_s', 'HCl'],
    effects: {},
    description: 'Pb + HCl — реакция почти не идёт: поверхность покрывается малорастворимым PbCl₂',
  },
  {
    inputs: ['Pb_s', 'HNO3_dilut'],
    effects: { gas: true },
    description: '3Pb + 8HNO₃ → 3Pb(NO₃)₂ + 2NO↑ + 4H₂O',
  },
  {
    inputs: ['Pb_s', 'HNO3_conc'],
    effects: {},
    description: 'Pb + HNO₃ (конц) — пассивация: свинец покрывается плёнкой и не растворяется',
  },
  // Pb⁴⁺ — сильнейший окислитель (эффект инертной 6s²-пары)
  {
    inputs: ['PbO2', 'HCl'],
    effects: { gas: true, precipitate: { color: '#C5D0DA' } },
    description: 'PbO₂ + 4HCl → PbCl₂↓ + Cl₂↑ + 2H₂O  (Окислитель: Pb⁴⁺ → Pb²⁺, Восстановитель: Cl⁻ → Cl⁰)',
  },
  {
    inputs: ['PbO2', 'MnSO4', 'HNO3_conc'],
    effects: { liquidColor: PERMANGANATE, precipitate: { color: '#C5D0DA' } },
    description: '5PbO₂ + 2MnSO₄ + 6HNO₃ → 2HMnO₄ + 2PbSO₄↓ + 3Pb(NO₃)₂ + 2H₂O  (раствор становится фиолетовым; Окислитель: Pb⁴⁺ → Pb²⁺, Восстановитель: Mn²⁺ → Mn⁷⁺)',
  },
  {
    inputs: ['PbO2', 'heat'],
    effects: { precipitate: { color: '#E65100' }, gas: true },
    description: '3PbO₂ → Pb₃O₄ + O₂↑  (образуется оранжевый сурик)',
  },
  {
    inputs: ['PbNO32', 'NaClO', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: 'Pb(NO₃)₂ + NaClO + 2NaOH → PbO₂↓ + NaCl + 2NaNO₃ + H₂O  (Окислитель: Cl⁺ → Cl⁻, Восстановитель: Pb²⁺ → Pb⁴⁺)',
  },
  // Чёрный PbS белеет под действием пероксида — так реставрируют свинцовые белила
  {
    inputs: ['PbNO32', 'Na2S', 'H2O2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'Pb(NO₃)₂ + Na₂S + 4H₂O₂ → PbSO₄↓ + 2NaNO₃ + 4H₂O  (чёрный PbS белеет; Окислитель: O⁻ → O²⁻, Восстановитель: S²⁻ → S⁶⁺)',
  },
  // Кремниевая кислота вытесняется даже солью аммония
  {
    inputs: ['Na2SiO3', 'NH4Cl'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' }, gas: true },
    description: 'Na₂SiO₃ + 2NH₄Cl → H₂SiO₃↓ + 2NaCl + 2NH₃↑',
  },

  // ══ Гр. V — нитриты, фосфаты, сурьма, висмут (гл. 13) ════════════════════
  // Нитрит — и окислитель, и восстановитель
  {
    inputs: ['NaNO2', 'KI', 'H2SO4_dilut'],
    effects: { liquidColor: IODINE, gas: true },
    description: '2NaNO₂ + 2KI + 2H₂SO₄ → I₂ + 2NO↑ + K₂SO₄ + Na₂SO₄ + 2H₂O  (Окислитель: N³⁺ → N²⁺, Восстановитель: I⁻ → I⁰)',
  },
  {
    inputs: ['NaNO2', 'KMnO4', 'H2SO4_dilut'],
    effects: { liquidColor: CLEAR },
    description: '5NaNO₂ + 2KMnO₄ + 3H₂SO₄ → 5NaNO₃ + 2MnSO₄ + K₂SO₄ + 3H₂O  (раствор обесцвечивается; Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: N³⁺ → N⁵⁺)',
  },
  {
    inputs: ['NaNO2', 'H2SO4_dilut'],
    effects: { gas: true },
    description: '2NaNO₂ + H₂SO₄ → Na₂SO₄ + NO↑ + NO₂↑ + H₂O  (азотистая кислота разлагается, над раствором бурый газ)',
  },
  {
    inputs: ['NaNO2', 'NH4Cl', 'heat'],
    effects: { gas: true },
    description: 'NaNO₂ + NH₄Cl → N₂↑ + NaCl + 2H₂O  (лабораторный способ получения азота)',
  },
  {
    inputs: ['NaNO2', 'H2O2'],
    effects: { liquidColor: CLEAR },
    description: 'NaNO₂ + H₂O₂ → NaNO₃ + H₂O  (Окислитель: O⁻ → O²⁻, Восстановитель: N³⁺ → N⁵⁺)',
  },
  {
    inputs: ['Na2HPO4', 'AgNO3'],
    effects: { precipitate: { color: '#F9A825' } },
    description: 'Na₂HPO₄ + 3AgNO₃ → Ag₃PO₄↓ + 2NaNO₃ + HNO₃',
  },
  // Сурьма: оранжевый сульфид растворяется в избытке сульфида — он кислотный
  {
    inputs: ['SbCl3', 'Na2S'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#FF6F00' } },
    description: '2SbCl₃ + 3Na₂S → Sb₂S₃↓ + 6NaCl',
  },
  {
    inputs: ['SbCl3', 'Na2S', 'Na2S'],
    effects: { liquidColor: 'rgba(255,224,130,0.25)' },
    description: 'SbCl₃ + 3Na₂S → Na₃SbS₃ + 3NaCl  (избыток Na₂S — оранжевый осадок растворяется в тиоантимонит)',
  },
  {
    inputs: ['SbCl3', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'SbCl₃ + 3NaOH → Sb(OH)₃↓ + 3NaCl',
  },
  {
    inputs: ['SbCl3', 'NaOH', 'NaOH'],
    effects: { liquidColor: CLEAR },
    description: 'SbCl₃ + 4NaOH → Na[Sb(OH)₄] + 3NaCl  (избыток NaOH — осадок растворяется: гидроксид амфотерен)',
  },
  // Висмут: гидроксид не амфотерен, иодид растворяется в избытке иодида
  {
    inputs: ['BiNO33', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'Bi(NO₃)₃ + 3NaOH → Bi(OH)₃↓ + 3NaNO₃',
  },
  {
    inputs: ['BiNO33', 'NaOH', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'Bi(OH)₃ + NaOH — осадок не растворяется: гидроксид висмута проявляет только основные свойства',
  },
  {
    inputs: ['BiNO33', 'KI'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#3E2723' } },
    description: 'Bi(NO₃)₃ + 3KI → BiI₃↓ + 3KNO₃',
  },
  {
    inputs: ['BiNO33', 'KI', 'KI'],
    effects: { liquidColor: 'rgba(255,143,0,0.55)' },
    description: 'Bi(NO₃)₃ + 4KI → K[BiI₄] + 3KNO₃  (избыток KI — чёрный осадок растворяется, раствор оранжевый)',
  },
  {
    inputs: ['BiNO33', 'Na2S'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#3E2723' } },
    description: '2Bi(NO₃)₃ + 3Na₂S → Bi₂S₃↓ + 6NaNO₃',
  },
  {
    inputs: ['BiNO33', 'Na2S', 'Na2S'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#3E2723' } },
    description: 'Bi₂S₃ + Na₂S — осадок не растворяется: сульфид висмута основный, тиосолей не образует',
  },
  // Станнит восстанавливает висмут до металла — черный осадок
  {
    inputs: ['BiNO33', 'SnCl2', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#212121' } },
    description: '2Bi(NO₃)₃ + 3SnCl₂ + 18NaOH → 2Bi↓ + 3Na₂[Sn(OH)₆] + 6NaNO₃ + 6NaCl  (Окислитель: Bi³⁺ → Bi⁰, Восстановитель: Sn²⁺ → Sn⁴⁺)',
  },
  // Висмутат — окислитель сильнее перманганата
  {
    inputs: ['NaBiO3', 'MnSO4', 'HNO3_conc'],
    effects: { liquidColor: PERMANGANATE },
    description: '5NaBiO₃ + 2MnSO₄ + 16HNO₃ → 2NaMnO₄ + 5Bi(NO₃)₃ + NaNO₃ + 2NaHSO₄ + 7H₂O  (раствор становится фиолетовым; Окислитель: Bi⁵⁺ → Bi³⁺, Восстановитель: Mn²⁺ → Mn⁷⁺)',
  },
  {
    inputs: ['NaBiO3', 'HCl'],
    effects: { gas: true },
    description: 'NaBiO₃ + 6HCl → BiCl₃ + Cl₂↑ + NaCl + 3H₂O  (Окислитель: Bi⁵⁺ → Bi³⁺, Восстановитель: Cl⁻ → Cl⁰)',
  },

  // ══ Гр. VI — тиосульфат (гл. 14.2) ══════════════════════════════════════
  {
    inputs: ['Na2S2O3', 'HCl'],
    effects: { liquidColor: 'rgba(255,245,157,0.35)', precipitate: { color: '#FFF59D' }, gas: true },
    description: 'Na₂S₂O₃ + 2HCl → 2NaCl + S↓ + SO₂↑ + H₂O  (раствор мутнеет от серы)',
  },
  {
    inputs: ['Na2S2O3', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(255,245,157,0.35)', precipitate: { color: '#FFF59D' }, gas: true },
    description: 'Na₂S₂O₃ + H₂SO₄ → Na₂SO₄ + S↓ + SO₂↑ + H₂O  (раствор мутнеет от серы)',
  },
  {
    inputs: ['Na2S2O3', 'I2'],
    effects: { liquidColor: CLEAR },
    description: '2Na₂S₂O₃ + I₂ → Na₂S₄O₆ + 2NaI  (иод обесцвечивается — основа иодометрии)',
  },
  {
    inputs: ['Na2S2O3', 'Cl2'],
    effects: { liquidColor: CLEAR },
    description: 'Na₂S₂O₃ + 4Cl₂ + 5H₂O → 2NaHSO₄ + 8HCl  (Окислитель: Cl⁰ → Cl⁻, Восстановитель: S²⁺ → S⁶⁺)',
  },
  {
    inputs: ['Na2S2O3', 'FeCl3'],
    effects: { liquidColor: 'rgba(100,160,100,0.25)' },
    description: '2FeCl₃ + 2Na₂S₂O₃ → 2FeCl₂ + Na₂S₄O₆ + 2NaCl  (раствор светлеет: Fe³⁺ восстанавливается до Fe²⁺)',
  },
  // Тиосульфат растворяет галогениды серебра — так работает фотографический фиксаж
  {
    inputs: ['KBr', 'AgNO3', 'Na2S2O3'],
    effects: { liquidColor: CLEAR },
    description: 'KBr + AgNO₃ + 2Na₂S₂O₃ → Na₃[Ag(S₂O₃)₂] + NaBr + KNO₃  (осадок AgBr растворяется)',
  },
  {
    inputs: ['Na2S2O3', 'heat'],
    effects: { precipitate: { color: '#F9A825' } },
    description: '4Na₂S₂O₃ → 3Na₂SO₄ + Na₂S₅  (при прокаливании тиосульфат диспропорционирует)',
  },
  {
    inputs: ['S_s', 'Na2SO3', 'heat'],
    effects: { liquidColor: CLEAR },
    description: 'S + Na₂SO₃ → Na₂S₂O₃  (сера растворяется в кипящем растворе сульфита)',
  },

  // ══ Гр. VII — гипохлорит, иодат, полииодид (гл. 15) ══════════════════════
  {
    inputs: ['NaClO', 'HCl'],
    effects: { gas: true },
    description: 'NaClO + 2HCl → NaCl + Cl₂↑ + H₂O  (конпропорционирование: Cl⁺ и Cl⁻ переходят в Cl⁰)',
  },
  {
    inputs: ['NaClO', 'KI'],
    effects: { liquidColor: IODINE },
    description: 'NaClO + 2KI + H₂O → NaCl + I₂ + 2KOH  (Окислитель: Cl⁺ → Cl⁻, Восстановитель: I⁻ → I⁰)',
  },
  {
    inputs: ['NaClO', 'MnSO4', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: 'MnSO₄ + NaClO + 2NaOH → MnO₂↓ + NaCl + Na₂SO₄ + H₂O  (Окислитель: Cl⁺ → Cl⁻, Восстановитель: Mn²⁺ → Mn⁴⁺)',
  },
  {
    inputs: ['NaClO', 'heat'],
    effects: { liquidColor: CLEAR },
    description: '3NaClO → 2NaCl + NaClO₃  (гипохлорит диспропорционирует при нагревании)',
  },
  {
    inputs: ['KIO3', 'KI', 'H2SO4_dilut'],
    effects: { liquidColor: IODINE },
    description: 'KIO₃ + 5KI + 3H₂SO₄ → 3I₂ + 3K₂SO₄ + 3H₂O  (Окислитель: I⁵⁺ → I⁰, Восстановитель: I⁻ → I⁰)',
  },
  {
    inputs: ['KIO3', 'Na2SO3', 'H2SO4_dilut'],
    effects: { liquidColor: IODINE },
    description: '2KIO₃ + 5Na₂SO₃ + H₂SO₄ → I₂ + 5Na₂SO₄ + K₂SO₄ + H₂O  (Окислитель: I⁵⁺ → I⁰, Восстановитель: S⁴⁺ → S⁶⁺)',
  },
  {
    inputs: ['KI', 'I2'],
    effects: { liquidColor: 'rgba(120,50,0,0.70)' },
    description: 'KI + I₂ → K[I₃]  (иод растворяется в иодиде — раствор тёмно-бурый)',
  },

  // ══ Хром — дихромат аммония («вулкан») ══════════════════════════════════
  {
    inputs: ['NH42Cr2O7', 'heat'],
    effects: { precipitate: { color: '#1B5E20' }, gas: true },
    description: '(NH₄)₂Cr₂O₇ → Cr₂O₃ + N₂↑ + 4H₂O  («вулкан»: оранжевые кристаллы превращаются в зелёный пепел)',
  },

  // ══ Марганец ═══════════════════════════════════════════════════════════
  {
    inputs: ['MnSO4', 'H2O2', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: 'MnSO₄ + H₂O₂ + 2NaOH → MnO₂↓ + Na₂SO₄ + 2H₂O  (Окислитель: O⁻ → O²⁻, Восстановитель: Mn²⁺ → Mn⁴⁺)',
  },
  {
    inputs: ['MnSO4', 'Na2CO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F8BBD0' } },
    description: 'MnSO₄ + Na₂CO₃ → MnCO₃↓ + Na₂SO₄',
  },

  // ══ Железо — роданид и гексацианоферраты ════════════════════════════════
  {
    inputs: ['FeCl3', 'KSCN'],
    effects: { liquidColor: 'rgba(183,28,28,0.78)' },
    description: 'FeCl₃ + 3KSCN → Fe(SCN)₃ + 3KCl  (кроваво-красный раствор — проба на Fe³⁺)',
  },
  {
    inputs: ['Fe2SO43', 'KSCN'],
    effects: { liquidColor: 'rgba(183,28,28,0.78)' },
    description: 'Fe₂(SO₄)₃ + 6KSCN → 2Fe(SCN)₃ + 3K₂SO₄  (кроваво-красный раствор — проба на Fe³⁺)',
  },
  {
    inputs: ['FeSO4', 'KSCN'],
    effects: { liquidColor: 'rgba(100,160,100,0.30)' },
    description: 'FeSO₄ + KSCN — красной окраски нет: роданид окрашивается только с Fe³⁺',
  },
  {
    inputs: ['FeCl2', 'KSCN'],
    effects: { liquidColor: 'rgba(100,160,100,0.30)' },
    description: 'FeCl₂ + KSCN — красной окраски нет: роданид окрашивается только с Fe³⁺',
  },
  {
    inputs: ['FeCl3', 'K4FeCN6'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#1A237E' } },
    description: '4FeCl₃ + 3K₄[Fe(CN)₆] → Fe₄[Fe(CN)₆]₃↓ + 12KCl  (берлинская лазурь — проба на Fe³⁺)',
  },
  {
    inputs: ['Fe2SO43', 'K4FeCN6'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#1A237E' } },
    description: '2Fe₂(SO₄)₃ + 3K₄[Fe(CN)₆] → Fe₄[Fe(CN)₆]₃↓ + 6K₂SO₄  (берлинская лазурь — проба на Fe³⁺)',
  },
  {
    inputs: ['FeSO4', 'K3FeCN6'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#1A237E' } },
    description: '3FeSO₄ + 2K₃[Fe(CN)₆] → Fe₃[Fe(CN)₆]₂↓ + 3K₂SO₄  (турнбулева синь — проба на Fe²⁺)',
  },
  {
    inputs: ['FeCl2', 'K3FeCN6'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#1A237E' } },
    description: '3FeCl₂ + 2K₃[Fe(CN)₆] → Fe₃[Fe(CN)₆]₂↓ + 6KCl  (турнбулева синь — проба на Fe²⁺)',
  },
  {
    inputs: ['FeCl3', 'K3FeCN6'],
    effects: { liquidColor: 'rgba(121,85,72,0.45)' },
    description: 'FeCl₃ + K₃[Fe(CN)₆] — осадка нет, раствор только буреет: красная кровяная соль — реактив на Fe²⁺',
  },
  {
    inputs: ['FeSO4', 'K4FeCN6'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#90CAF9' } },
    description: 'FeSO₄ + K₄[Fe(CN)₆] → K₂Fe[Fe(CN)₆]↓ + K₂SO₄  (белый осадок, на воздухе быстро синеет)',
  },

  // ══ Кобальт и никель — окисление гидроксидов ═══════════════════════════
  {
    inputs: ['CoCl2', 'NaOH', 'H2O2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#5D4037' } },
    description: '2CoCl₂ + 4NaOH + H₂O₂ → 2Co(OH)₃↓ + 4NaCl  (Окислитель: O⁻ → O²⁻, Восстановитель: Co²⁺ → Co³⁺)',
  },
  {
    inputs: ['CoCl2', 'KSCN'],
    effects: { liquidColor: 'rgba(21,101,192,0.40)' },
    description: 'CoCl₂ + 4KSCN → K₂[Co(SCN)₄] + 2KCl  (розовый раствор синеет)',
  },
  {
    inputs: ['NiSO4', 'NaOH', 'Br2'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#212121' } },
    description: '2NiSO₄ + 6NaOH + Br₂ → 2NiO(OH)↓ + 2NaBr + 2Na₂SO₄ + 2H₂O  (Окислитель: Br⁰ → Br⁻, Восстановитель: Ni²⁺ → Ni³⁺)',
  },
  {
    inputs: ['NiSO4', 'NaOH', 'NaClO'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#212121' } },
    description: '2NiSO₄ + 4NaOH + NaClO → 2NiO(OH)↓ + NaCl + 2Na₂SO₄ + H₂O  (Окислитель: Cl⁺ → Cl⁻, Восстановитель: Ni²⁺ → Ni³⁺)',
  },

  // ══ Медь, серебро, цинк — гексацианоферраты и роданиды ═════════════════
  {
    inputs: ['CuSO4', 'K4FeCN6'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#6D4C41' } },
    description: '2CuSO₄ + K₄[Fe(CN)₆] → Cu₂[Fe(CN)₆]↓ + 2K₂SO₄  (красно-бурый осадок — проба на Cu²⁺)',
  },
  {
    inputs: ['ZnSO4', 'K4FeCN6'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: '2ZnSO₄ + K₄[Fe(CN)₆] → Zn₂[Fe(CN)₆]↓ + 2K₂SO₄',
  },
  {
    inputs: ['AgNO3', 'K4FeCN6'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: '4AgNO₃ + K₄[Fe(CN)₆] → Ag₄[Fe(CN)₆]↓ + 4KNO₃',
  },
  {
    inputs: ['AgNO3', 'KSCN'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'AgNO₃ + KSCN → AgSCN↓ + KNO₃',
  },

  // ══ Кадмий ═════════════════════════════════════════════════════════════
  {
    inputs: ['CdSO4', 'Na2S'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F9A825' } },
    description: 'CdSO₄ + Na₂S → CdS↓ + Na₂SO₄  (жёлтый сульфид — проба на Cd²⁺)',
  },
  {
    inputs: ['CdSO4', 'H2S_aq'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F9A825' } },
    description: 'CdSO₄ + H₂S → CdS↓ + H₂SO₄',
  },
  {
    inputs: ['CdSO4', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'CdSO₄ + 2NaOH → Cd(OH)₂↓ + Na₂SO₄',
  },
  {
    inputs: ['CdSO4', 'NaOH', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'Cd(OH)₂ + NaOH — осадок не растворяется: в отличие от Zn(OH)₂, гидроксид кадмия не амфотерен',
  },
  {
    inputs: ['CdSO4', 'NH3'],
    effects: { liquidColor: CLEAR },
    description: 'CdSO₄ + 4NH₃ → [Cd(NH₃)₄]SO₄  (белый осадок растворяется в избытке аммиака)',
  },
  {
    inputs: ['CdSO4', 'Na2CO3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#B0BEC5' } },
    description: 'CdSO₄ + Na₂CO₃ → CdCO₃↓ + Na₂SO₄',
  },
  {
    inputs: ['Zn_s', 'CdSO4'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#9E9E9E' } },
    description: 'Zn + CdSO₄ → ZnSO₄ + Cd↓  (Окислитель: Cd²⁺ → Cd⁰, Восстановитель: Zn⁰ → Zn²⁺)',
  },

  // ══ Ртуть ══════════════════════════════════════════════════════════════
  {
    inputs: ['HgCl2', 'NaOH'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#F9A825' } },
    description: 'HgCl₂ + 2NaOH → HgO↓ + 2NaCl + H₂O  (жёлтый оксид — гидроксид ртути неустойчив)',
  },
  {
    inputs: ['HgCl2', 'KI'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#D32F2F' } },
    description: 'HgCl₂ + 2KI → HgI₂↓ + 2KCl',
  },
  {
    inputs: ['HgCl2', 'KI', 'KI'],
    effects: { liquidColor: 'rgba(255,241,118,0.20)' },
    description: 'HgCl₂ + 4KI → K₂[HgI₄] + 2KCl  (избыток KI — красный осадок растворяется)',
  },
  {
    inputs: ['HgCl2', 'Na2S'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#212121' } },
    description: 'HgCl₂ + Na₂S → HgS↓ + 2NaCl',
  },
  {
    inputs: ['HgCl2', 'NH3'],
    effects: { liquidColor: CLEAR, precipitate: { color: '#C5D0DA' } },
    description: 'HgCl₂ + 2NH₃ → HgNH₂Cl↓ + NH₄Cl',
  },
  {
    inputs: ['Cu_s', 'HgCl2'],
    effects: { liquidColor: 'rgba(38,166,154,0.25)', precipitate: { color: '#9E9E9E' } },
    description: 'Cu + HgCl₂ → CuCl₂ + Hg↓  (медь покрывается серебристой амальгамой)',
  },
]
