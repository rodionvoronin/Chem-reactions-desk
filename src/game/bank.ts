// ── Банк заданий ──────────────────────────────────────────────────────────────
// Условия и палитры собраны руками, эталонные признаки — нет: их считает движок
// по полю solution. Скрипт scripts/check-tasks.mjs прогоняет весь банк через
// движок и падает, если задача перестала решаться после правки химии.

import { Task, Topic } from './types'

export const TOPICS: Topic[] = [
  { id: 'cations-fe',   title: 'Катионы железа',        subtitle: 'Fe²⁺ и Fe³⁺ — самая частая пара на экзамене' },
  { id: 'cations-amph', title: 'Амфотерные катионы',    subtitle: 'Al³⁺, Zn²⁺, Cr³⁺ и избыток щёлочи' },
  { id: 'cations-2',    title: 'Группа II',             subtitle: 'Ca²⁺ и Ba²⁺ — оба дают белые осадки' },
  { id: 'cations-cu',   title: 'Медь, серебро, свинец', subtitle: 'Окрашенные катионы и «золотой дождь»' },
  { id: 'anions',       title: 'Анионы',                subtitle: 'Галогениды, карбонат, сульфат, сульфит, сульфид' },
  { id: 'nh4',          title: 'Катион аммония',        subtitle: 'Газ с резким запахом' },
  { id: 'redox',        title: 'ОВР и газы',            subtitle: 'Обратные задачи: добейся признака' },
  { id: 'flame',        title: 'Окрашивание пламени',   subtitle: 'Разминка на полминуты' },
  { id: 'dry',          title: 'Сухой режим',           subtitle: 'Термическое разложение — для сильных' },
  { id: 'chains',       title: 'Цепочки превращений',   subtitle: 'Выделить продукт и продолжить с ним' },
]

export const TASKS: Task[] = [
  // ── Катионы железа ─────────────────────────────────────────────────────────
  {
    id: 'fe-1', type: 'identify', difficulty: 1, topic: 'cations-fe',
    title: 'Соль трёхвалентного железа',
    prompt: 'В пробирке — раствор одной из четырёх солей. Определите какой.',
    hidden: ['FeCl3'],
    palette: ['NaOH', 'HCl', 'BaCl2', 'AgNO3', 'KI'],
    budget: 3, solution: ['NaOH'],
    options: ['FeCl3', 'CuSO4', 'AlCl3', 'ZnSO4'], answer: ['FeCl3'],
    hints: [
      { cost: 1, text: 'Щёлочь осаждает гидроксид, и его цвет у каждого катиона свой.' },
      { cost: 1, text: 'Красно-бурый осадок Fe(OH)₃ ни с чем не спутать.' },
    ],
  },
  {
    id: 'fe-2', type: 'identify', difficulty: 1, topic: 'cations-fe',
    title: 'Соль двухвалентного железа',
    prompt: 'Определите вещество в пробирке. Цвет самого раствора уже кое-что подсказывает.',
    hidden: ['FeSO4'],
    palette: ['NaOH', 'NH3', 'BaCl2', 'KI', 'HCl'],
    budget: 3, solution: ['NaOH'],
    options: ['FeSO4', 'FeCl3', 'CuSO4', 'MgCl2'], answer: ['FeSO4'],
    hints: [
      { cost: 1, text: 'Начните со щёлочи: гидроксиды Fe²⁺ и Fe³⁺ различаются цветом.' },
      { cost: 1, text: 'Fe(OH)₂ — серо-зелёный, Fe(OH)₃ — красно-бурый.' },
    ],
  },
  {
    id: 'fe-3', type: 'distinguish', difficulty: 2, topic: 'cations-fe',
    title: 'Fe²⁺ или Fe³⁺',
    prompt: 'В двух пробирках FeSO₄ и Fe₂(SO₄)₃. Одним реагентом докажите, где что. '
          + 'Разный цвет самих растворов доказательством не считается — как и реагент, '
          + 'дающий в обеих пробирках одинаковый признак.',
    hidden: ['FeSO4', 'Fe2SO43'],
    palette: ['NaOH', 'KI', 'BaCl2', 'HCl', 'NH3'],
    budget: 4, solution: ['NaOH'],
    answer: ['FeSO4', 'Fe2SO43'],
    hints: [
      { cost: 1, text: 'BaCl₂ осадит сульфат-ион в обеих пробирках — доказательства не выйдет.' },
      { cost: 1, text: 'Доказывает тот реагент, что даёт разные осадки: Fe(OH)₂ серо-зелёный, '
                    + 'Fe(OH)₃ красно-бурый.' },
    ],
  },
  {
    id: 'fe-4', type: 'identify', difficulty: 2, topic: 'cations-fe',
    title: 'Катион и анион сразу',
    prompt: 'Определите соль. Одного реагента не хватит: нужно установить и катион, и анион.',
    hidden: ['FeSO4'],
    palette: ['NaOH', 'BaCl2', 'AgNO3', 'KI', 'HCl'],
    budget: 5, solution: ['NaOH', 'BaCl2'],
    options: ['FeSO4', 'FeCl2', 'Fe2SO43', 'FeCl3'], answer: ['FeSO4'],
    hints: [
      { cost: 1, text: 'Сначала степень окисления железа, затем анион.' },
      { cost: 2, text: 'BaCl₂ даёт нерастворимый BaSO₄ — так отличают сульфат от хлорида.' },
    ],
  },
  {
    id: 'fe-5', type: 'achieve', difficulty: 1, topic: 'cations-fe',
    title: 'Красно-бурый осадок',
    prompt: 'Получите в пробирке красно-бурый осадок.',
    hidden: [],
    palette: ['FeCl3', 'FeSO4', 'CuSO4', 'NaOH', 'HCl', 'BaCl2'],
    budget: 4, solution: ['FeCl3', 'NaOH'],
    answer: [], target: { precipitateLabel: 'красно-бурый осадок' },
    hints: [
      { cost: 1, text: 'Красно-бурый — это Fe(OH)₃.' },
      { cost: 1, text: 'Нужна соль железа(III) и щёлочь.' },
    ],
  },

  // ── Амфотерные катионы ─────────────────────────────────────────────────────
  {
    id: 'am-1', type: 'distinguish', difficulty: 2, topic: 'cations-amph',
    title: 'Al³⁺ или Zn²⁺',
    prompt: 'В пробирках AlCl₃ и ZnSO₄. Оба дают белый осадок со щёлочью и оба амфотерны. '
          + 'Найдите реагент, который ведёт себя с ними по-разному.',
    hidden: ['AlCl3', 'ZnSO4'],
    palette: ['NaOH', 'NH3', 'Na2S', 'BaCl2', 'HCl'],
    budget: 4, solution: ['NH3'],
    answer: ['AlCl3', 'ZnSO4'],
    hints: [
      { cost: 1, text: 'Избыток NaOH растворит оба гидроксида — это не доказательство.' },
      { cost: 1, text: 'Аммиак образует комплекс только с цинком: [Zn(NH₃)₄]²⁺.' },
    ],
  },
  {
    id: 'am-2', type: 'identify', difficulty: 2, topic: 'cations-amph',
    title: 'Осадок, который не растворяется',
    prompt: 'Определите вещество. Все кандидаты дают осадок со щёлочью — важно, что будет дальше.',
    hidden: ['MgCl2'],
    palette: ['NaOH', 'NH3', 'AgNO3', 'HCl'],
    budget: 5, solution: ['NaOH', 'NaOH'],
    options: ['MgCl2', 'AlCl3', 'ZnSO4', 'CrCl3'], answer: ['MgCl2'],
    hints: [
      { cost: 1, text: 'Прилейте щёлочь дважды: избыток растворяет амфотерные гидроксиды.' },
      { cost: 1, text: 'Mg(OH)₂ в избытке щёлочи не растворяется — магний не амфотерен.' },
    ],
  },
  {
    id: 'am-3', type: 'identify', difficulty: 2, topic: 'cations-amph',
    title: 'Сульфат цинка среди похожих',
    prompt: 'Определите вещество в пробирке.',
    hidden: ['ZnSO4'],
    palette: ['NaOH', 'NH3', 'BaCl2', 'Na2S', 'HCl'],
    budget: 5, solution: ['NH3', 'BaCl2'],
    options: ['ZnSO4', 'Al2SO43', 'MgCl2', 'CuSO4'], answer: ['ZnSO4'],
    hints: [
      { cost: 1, text: 'Аммиак — не просто щёлочь: с цинком и медью он даёт комплексы.' },
      { cost: 1, text: 'С Al³⁺ аммиак осаждает Al(OH)₃, с Zn²⁺ осадка не остаётся — '
                    + 'но так цинк ещё не отличить от магния. Нужен второй шаг по аниону.' },
    ],
  },
  {
    id: 'am-4', type: 'identify', difficulty: 3, topic: 'cations-amph',
    title: 'Зелёный раствор',
    prompt: 'Раствор окрашен. Определите катион — цвета осадков у кандидатов близки.',
    hidden: ['CrCl3'],
    palette: ['NaOH', 'NH3', 'H2O2', 'HCl', 'BaCl2'],
    budget: 5, solution: ['NaOH', 'NaOH'],
    options: ['CrCl3', 'NiSO4', 'FeSO4', 'CuSO4'], answer: ['CrCl3'],
    hints: [
      { cost: 1, text: 'Cr(OH)₃ и Fe(OH)₂ одинаково серо-зелёные — по первому осадку не различить.' },
      { cost: 2, text: 'Cr(OH)₃ амфотерен и растворяется в избытке щёлочи, Fe(OH)₂ — нет.' },
    ],
  },

  // ── Группа II ──────────────────────────────────────────────────────────────
  {
    id: 'g2-1', type: 'distinguish', difficulty: 2, topic: 'cations-2',
    title: 'Ca²⁺ или Ba²⁺',
    prompt: 'В пробирках CaCl₂ и BaCl₂. Сульфаты и карбонаты обоих нерастворимы — '
          + 'ищите реагент, который их разводит.',
    hidden: ['CaCl2', 'BaCl2'],
    palette: ['NaOH', 'Na2SO4', 'Na2CO3', 'K2CrO4', 'HCl'],
    budget: 4, solution: ['NaOH'],
    answer: ['CaCl2', 'BaCl2'],
    hints: [
      { cost: 1, text: 'Na₂SO₄ и Na₂CO₃ осадят оба катиона — доказательства не будет.' },
      { cost: 1, text: 'Ca(OH)₂ малорастворим и выпадает, Ba(OH)₂ растворим и осадка не даёт.' },
    ],
  },
  {
    id: 'g2-2', type: 'identify', difficulty: 2, topic: 'cations-2',
    title: 'Хлорид бария',
    prompt: 'Определите вещество. Порядок реагентов здесь важнее их количества.',
    hidden: ['BaCl2'],
    palette: ['NaOH', 'Na2SO4', 'AgNO3', 'HCl'],
    budget: 5, solution: ['NaOH', 'Na2SO4'],
    options: ['BaCl2', 'CaCl2', 'NaCl', 'MgCl2'], answer: ['BaCl2'],
    hints: [
      { cost: 1, text: 'Сначала щёлочь — она отсеет кальций и магний.' },
      { cost: 1, text: 'Затем сульфат: у бария выпадет BaSO₄.' },
    ],
  },

  // ── Медь, серебро, свинец ──────────────────────────────────────────────────
  {
    id: 'cu-1', type: 'identify', difficulty: 1, topic: 'cations-cu',
    title: 'Голубой осадок',
    prompt: 'Определите вещество в пробирке.',
    hidden: ['CuSO4'],
    palette: ['NaOH', 'NH3', 'BaCl2', 'KI'],
    budget: 3, solution: ['NaOH'],
    options: ['CuSO4', 'FeSO4', 'ZnSO4', 'NiSO4'], answer: ['CuSO4'],
    hints: [
      { cost: 1, text: 'Щёлочь осадит гидроксид — сравните цвет.' },
      { cost: 1, text: 'Cu(OH)₂ — голубой, Ni(OH)₂ — яблочно-зелёный.' },
    ],
  },
  {
    id: 'cu-2', type: 'identify', difficulty: 2, topic: 'cations-cu',
    title: 'Золотой дождь',
    prompt: 'Определите вещество. Один из реагентов даёт с ним эффектный осадок.',
    hidden: ['PbNO32'],
    palette: ['KI', 'NaOH', 'Na2S', 'HCl'],
    budget: 3, solution: ['KI'],
    options: ['PbNO32', 'AgNO3', 'ZnSO4', 'CaCl2'], answer: ['PbNO32'],
    hints: [
      { cost: 1, text: 'Иодид-ион осаждает не всякий катион.' },
      { cost: 1, text: 'PbI₂ — золотисто-жёлтые кристаллы, AgI — просто жёлтый осадок.' },
    ],
  },
  {
    id: 'cu-3', type: 'achieve', difficulty: 1, topic: 'cations-cu',
    title: 'Чёрный осадок',
    prompt: 'Получите чёрный осадок сульфида.',
    hidden: [],
    palette: ['CuSO4', 'ZnSO4', 'Na2S', 'NaOH', 'HCl', 'BaCl2'],
    budget: 4, solution: ['CuSO4', 'Na2S'],
    answer: [], target: { precipitateLabel: 'чёрный осадок' },
    hints: [
      { cost: 1, text: 'ZnS белый, а вот сульфид меди — чёрный.' },
      { cost: 1, text: 'Соль меди(II) плюс сульфид натрия.' },
    ],
  },
  {
    id: 'cu-4', type: 'achieve', difficulty: 2, topic: 'cations-cu',
    title: 'Бурый газ',
    prompt: 'Добейтесь выделения бурого газа.',
    hidden: [],
    palette: ['Cu_s', 'Zn_s', 'HNO3_conc', 'HNO3_dilut', 'HCl', 'NaOH'],
    budget: 4, solution: ['Cu_s', 'HNO3_conc'],
    answer: [], target: { gasFormula: 'NO₂' },
    hints: [
      { cost: 1, text: 'Бурый газ — это NO₂; с разбавленной HNO₃ выделяется бесцветный NO.' },
      { cost: 1, text: 'Медь и концентрированная азотная кислота.' },
    ],
  },

  // ── Анионы ─────────────────────────────────────────────────────────────────
  {
    id: 'an-1', type: 'identify', difficulty: 1, topic: 'anions',
    title: 'Карбонат',
    prompt: 'Определите соль натрия в пробирке.',
    hidden: ['Na2CO3'],
    palette: ['HCl', 'BaCl2', 'AgNO3'],
    budget: 3, solution: ['HCl'],
    options: ['Na2CO3', 'Na2SO4', 'NaCl', 'Na2SiO3'], answer: ['Na2CO3'],
    hints: [
      { cost: 1, text: 'Сильная кислота вытесняет слабую — смотрите, не пойдёт ли газ.' },
      { cost: 1, text: 'Карбонат даёт CO₂, силикат — студенистый осадок H₂SiO₃.' },
    ],
  },
  {
    id: 'an-2', type: 'identify', difficulty: 2, topic: 'anions',
    title: 'Какой именно газ',
    prompt: 'Все кандидаты, кроме одного, дают с кислотой газ. Определите вещество по тому, какой это газ.',
    hidden: ['Na2SO3'],
    palette: ['HCl', 'BaCl2', 'KMnO4'],
    budget: 4, solution: ['HCl'],
    options: ['Na2SO3', 'Na2CO3', 'Na2S', 'NaHCO3'], answer: ['Na2SO3'],
    hints: [
      { cost: 1, text: 'Подпись газа в панели наблюдений называет и формулу, и запах.' },
      { cost: 1, text: 'Сульфит даёт SO₂ с резким запахом, сульфид — H₂S, карбонат — CO₂.' },
    ],
  },
  {
    id: 'an-3', type: 'distinguish', difficulty: 2, topic: 'anions',
    title: 'Хлорид или бромид',
    prompt: 'В пробирках NaCl и KBr. Докажите, где что.',
    hidden: ['NaCl', 'KBr'],
    palette: ['AgNO3', 'Cl2', 'HCl', 'BaCl2'],
    budget: 4, solution: ['AgNO3'],
    answer: ['NaCl', 'KBr'],
    hints: [
      { cost: 1, text: 'Нитрат серебра осаждает оба галогенида, но осадки разного цвета.' },
      { cost: 1, text: 'AgCl белый, AgBr бледно-жёлтый.' },
    ],
  },
  {
    id: 'an-4', type: 'identify', difficulty: 2, topic: 'anions',
    title: 'Галогенид',
    prompt: 'Определите соль. Кандидаты отличаются только галогеном.',
    hidden: ['KI'],
    palette: ['AgNO3', 'Cl2', 'H2O2', 'HCl'],
    budget: 3, solution: ['AgNO3'],
    options: ['KI', 'KBr', 'NaCl', 'NaF'], answer: ['KI'],
    hints: [
      { cost: 1, text: 'Ряд AgCl → AgBr → AgI: от белого к жёлтому.' },
      { cost: 1, text: 'AgF растворим, поэтому фторид осадка вообще не даёт.' },
    ],
  },
  {
    id: 'an-5', type: 'identify', difficulty: 3, topic: 'anions',
    title: 'Сульфат среди солей серы',
    prompt: 'Определите вещество. Три кандидата из четырёх выдают себя газом.',
    hidden: ['Na2SO4'],
    palette: ['HCl', 'BaCl2', 'AgNO3', 'KMnO4'],
    budget: 5, solution: ['HCl', 'BaCl2'],
    options: ['Na2SO4', 'Na2SO3', 'Na2CO3', 'Na2S'], answer: ['Na2SO4'],
    hints: [
      { cost: 1, text: 'Сначала кислота: сульфат — единственный, кто не даст газа.' },
      { cost: 1, text: 'Затем подтвердите сульфат-ион барием.' },
    ],
  },
  {
    id: 'an-6', type: 'achieve', difficulty: 1, topic: 'anions',
    title: 'Запах тухлых яиц',
    prompt: 'Добейтесь выделения сероводорода.',
    hidden: [],
    palette: ['Na2S', 'Na2SO3', 'Na2CO3', 'HCl', 'NaOH', 'BaCl2'],
    budget: 4, solution: ['Na2S', 'HCl'],
    answer: [], target: { gasFormula: 'H₂S' },
    hints: [
      { cost: 1, text: 'H₂S вытесняют из сульфида сильной кислотой.' },
      { cost: 1, text: 'Na₂S и HCl.' },
    ],
  },

  // ── Катион аммония ─────────────────────────────────────────────────────────
  {
    id: 'nh-1', type: 'identify', difficulty: 1, topic: 'nh4',
    title: 'Соль аммония',
    prompt: 'Определите вещество. Три кандидата со щёлочью не реагируют вовсе.',
    hidden: ['NH4Cl'],
    palette: ['NaOH', 'AgNO3', 'BaCl2'],
    budget: 3, solution: ['NaOH'],
    options: ['NH4Cl', 'NaCl', 'KCl', 'MgCl2'], answer: ['NH4Cl'],
    hints: [
      { cost: 1, text: 'Качественная реакция на NH₄⁺ — щёлочь.' },
      { cost: 1, text: 'Выделяется аммиак: бесцветный газ с резким запахом.' },
    ],
  },
  {
    id: 'nh-2', type: 'distinguish', difficulty: 2, topic: 'nh4',
    title: 'Хлорид или нитрат аммония',
    prompt: 'В пробирках NH₄Cl и NH₄NO₃. Катион у них общий — доказывать придётся по аниону.',
    hidden: ['NH4Cl', 'NH4NO3'],
    palette: ['NaOH', 'AgNO3', 'BaCl2', 'HCl'],
    budget: 4, solution: ['AgNO3'],
    answer: ['NH4Cl', 'NH4NO3'],
    hints: [
      { cost: 1, text: 'Щёлочь даст аммиак в обеих пробирках — это не доказательство.' },
      { cost: 1, text: 'Нитрат серебра осадит хлорид-ион; с нитратом ничего не произойдёт.' },
    ],
  },

  // ── ОВР и газы ─────────────────────────────────────────────────────────────
  {
    id: 'rx-1', type: 'achieve', difficulty: 2, topic: 'redox',
    title: 'Бурый осадок MnO₂',
    prompt: 'Получите бурый осадок диоксида марганца.',
    hidden: [],
    palette: ['KMnO4', 'Na2SO3', 'FeSO4', 'NaOH', 'HCl', 'BaCl2'],
    budget: 4, solution: ['KMnO4', 'Na2SO3'],
    answer: [], target: { precipitateLabel: 'бурый осадок' },
    hints: [
      { cost: 1, text: 'MnO₂ выпадает, когда перманганат восстанавливают в нейтральной среде.' },
      { cost: 1, text: 'KMnO₄ и восстановитель — сульфит или соль железа(II).' },
    ],
  },
  {
    id: 'rx-2', type: 'achieve', difficulty: 1, topic: 'redox',
    title: 'Выделение водорода',
    prompt: 'Добейтесь выделения водорода.',
    hidden: [],
    palette: ['Zn_s', 'Cu_s', 'HCl', 'NaOH', 'CuSO4'],
    budget: 4, solution: ['Zn_s', 'HCl'],
    answer: [], target: { gasFormula: 'H₂' },
    hints: [
      { cost: 1, text: 'Медь стоит после водорода в ряду активности — кислотой её не растворить.' },
      { cost: 1, text: 'Цинк и соляная кислота. Цинк амфотерен, со щёлочью тоже даст H₂.' },
    ],
  },
  {
    id: 'rx-3', type: 'achieve', difficulty: 3, topic: 'redox',
    title: 'Из хрома(III) в хромат',
    prompt: 'В пробирке зелёный раствор CrCl₃. Переведите хром в степень окисления +6 — '
          + 'раствор должен стать ярко-жёлтым.',
    hidden: [], start: ['CrCl3'],
    palette: ['NaOH', 'H2O2', 'HCl', 'KI'],
    budget: 4, solution: ['NaOH', 'H2O2'],
    answer: [], target: { liquidColor: 'rgba(255,210,0,0.72)' },
    hints: [
      { cost: 1, text: 'Cr³⁺ окисляют в щелочной среде — сначала создайте её.' },
      { cost: 2, text: 'Избыток NaOH, затем пероксид водорода: получится жёлтый Na₂CrO₄.' },
    ],
  },

  // ── Окрашивание пламени ────────────────────────────────────────────────────
  {
    id: 'fl-1', type: 'flame', difficulty: 1, topic: 'flame',
    title: 'Жёлто-оранжевое пламя',
    prompt: 'Образец внесли в пламя горелки. Определите металл по окраске.',
    hidden: [], palette: [], budget: 2, solution: [],
    options: ['Na', 'K', 'Cu', 'Ca'], answer: ['Na'], flameMetal: 'Na',
    hints: [{ cost: 1, text: 'Самая узнаваемая окраска в аналитике — янтарно-оранжевая.' }],
  },
  {
    id: 'fl-2', type: 'flame', difficulty: 1, topic: 'flame',
    title: 'Зелёное пламя',
    prompt: 'Определите металл по окраске пламени. Два кандидата дают зелёные оттенки.',
    hidden: [], palette: [], budget: 2, solution: [],
    options: ['Cu', 'Ba', 'K', 'Fe'], answer: ['Cu'], flameMetal: 'Cu',
    hints: [{ cost: 1, text: 'У меди пламя изумрудное, у бария — жёлто-зелёное, светлее.' }],
  },
  {
    id: 'fl-3', type: 'flame', difficulty: 2, topic: 'flame',
    title: 'Жёлто-зелёное пламя',
    prompt: 'Определите металл. Отличайте оттенок от изумрудного.',
    hidden: [], palette: [], budget: 2, solution: [],
    options: ['Ba', 'Cu', 'B', 'Ca'], answer: ['Ba'], flameMetal: 'Ba',
    hints: [{ cost: 1, text: 'Барий даёт лаймовый, желтее меди и бора.' }],
  },
  {
    id: 'fl-4', type: 'flame', difficulty: 2, topic: 'flame',
    title: 'Фиолетовое пламя',
    prompt: 'Определите металл по окраске пламени.',
    hidden: [], palette: [], budget: 2, solution: [],
    options: ['K', 'Li', 'Sr', 'In'], answer: ['K'], flameMetal: 'K',
    hints: [{ cost: 1, text: 'Литий и стронций дают красные тона, индий — синий.' }],
  },

  // ── Сухой режим ────────────────────────────────────────────────────────────
  {
    id: 'dr-1', type: 'dry', difficulty: 2, topic: 'dry',
    title: 'Что разлагается при прокаливании',
    prompt: 'В пробирке сухое вещество. Прокалите его и определите, что это.',
    hidden: ['CaCO3'], dry: true,
    palette: ['heat'],
    budget: 3, solution: ['heat'],
    options: ['CaCO3', 'NaCl', 'CaO', 'CaSO4'], answer: ['CaCO3'],
    hints: [
      { cost: 1, text: 'Из четырёх кандидатов при нагревании разлагается только один.' },
      { cost: 1, text: 'Карбонат кальция отдаёт CO₂ и превращается в известь.' },
    ],
  },
  {
    id: 'dr-2', type: 'dry', difficulty: 3, topic: 'dry',
    title: 'Кислород и осадок',
    prompt: 'Сухое вещество при нагревании даёт газ. Определите его по тому, что осталось в пробирке.',
    hidden: ['KMnO4'], dry: true,
    palette: ['heat'],
    budget: 2, solution: ['heat'],
    options: ['KMnO4', 'KNO3', 'KClO3', 'NaCl'], answer: ['KMnO4'],
    hints: [
      { cost: 1, text: 'Три кандидата дают кислород — разница в твёрдом остатке.' },
      { cost: 1, text: 'Только перманганат оставляет тёмно-бурый MnO₂.' },
    ],
  },
  {
    id: 'dr-3', type: 'dry', difficulty: 3, topic: 'dry',
    title: 'Возгонка',
    prompt: 'Прокалите образец и определите вещество по выделяющемуся газу.',
    hidden: ['NH4Cl'], dry: true,
    palette: ['heat'],
    budget: 2, solution: ['heat'],
    options: ['NH4Cl', 'KNO3', 'CaCO3', 'NaCl'], answer: ['NH4Cl'],
    hints: [
      { cost: 1, text: 'Кандидаты дают три разных газа и один — ничего.' },
      { cost: 1, text: 'Хлорид аммония возгоняется: NH₃ и HCl снова соединяются на холодной стенке.' },
    ],
  },

  // ── Цепочки превращений ─────────────────────────────────────────────────────
  // Задание 9 ЕГЭ на бумаге спрашивает, чем перевести одно вещество в другое.
  // Здесь то же самое делают руками: осадок нужно выделить и продолжить
  // работать с ним, как в настоящем анализе. Целевого вещества в палитре нет —
  // иначе цепочка решалась бы одним приливанием.
  {
    id: 'ch-1', type: 'achieve', difficulty: 2, topic: 'chains',
    title: 'Из сульфата меди — хлорид',
    prompt: 'В пробирке раствор CuSO₄. Получите в ней хлорид меди(II). '
          + 'Прилить готовый CuCl₂ нельзя — его нет на полке.',
    hidden: [], start: ['CuSO4'],
    palette: ['NaOH', 'HCl', 'H2SO4_dilut', 'BaCl2'],
    budget: 5, solution: ['NaOH', 'isolate', 'HCl'],
    answer: [], target: { substance: 'CuCl₂' },
    hints: [
      { cost: 1, text: 'Сульфат-ион нужно убрать. Через какое нерастворимое соединение меди это сделать?' },
      { cost: 1, text: 'Осадите Cu(OH)₂ щёлочью, выделите его и растворите в соляной кислоте.' },
    ],
  },
  {
    id: 'ch-2', type: 'achieve', difficulty: 2, topic: 'chains',
    title: 'Из хлорида железа — сульфат',
    prompt: 'В пробирке раствор FeCl₃. Получите сульфат железа(III).',
    hidden: [], start: ['FeCl3'],
    palette: ['NaOH', 'H2SO4_dilut', 'HCl', 'AgNO3'],
    budget: 5, solution: ['NaOH', 'isolate', 'H2SO4_dilut'],
    answer: [], target: { substance: 'Fe₂(SO₄)₃' },
    hints: [
      { cost: 1, text: 'Хлорид-ион уйдёт вместе с раствором, если железо перевести в осадок.' },
      { cost: 1, text: 'Fe(OH)₃ отфильтруйте и растворите в серной кислоте.' },
    ],
  },
  {
    id: 'ch-3', type: 'achieve', difficulty: 3, topic: 'chains',
    title: 'Через амфотерный гидроксид',
    prompt: 'В пробирке раствор AlCl₃. Получите сульфат алюминия. '
          + 'Осторожно: гидроксид алюминия растворяется в избытке щёлочи.',
    hidden: [], start: ['AlCl3'],
    palette: ['NaOH', 'H2SO4_dilut', 'HCl', 'Na2CO3'],
    budget: 5, solution: ['NaOH', 'isolate', 'H2SO4_dilut'],
    answer: [], target: { substance: 'Al₂(SO₄)₃' },
    hints: [
      { cost: 1, text: 'Щёлочи нужно ровно столько, чтобы выпал осадок, — избыток его растворит.' },
      { cost: 2, text: 'Al(OH)₃ выделите и растворите в серной кислоте: он амфотерен и с кислотой реагирует.' },
    ],
  },
  {
    id: 'ch-4', type: 'achieve', difficulty: 2, topic: 'chains',
    title: 'Из сульфата цинка — хлорид',
    prompt: 'В пробирке раствор ZnSO₄. Получите хлорид цинка.',
    hidden: [], start: ['ZnSO4'],
    palette: ['NaOH', 'HCl', 'BaCl2', 'Na2S'],
    budget: 5, solution: ['NaOH', 'isolate', 'HCl'],
    answer: [], target: { substance: 'ZnCl₂' },
    hints: [
      { cost: 1, text: 'Тот же приём, что с медью: осадить гидроксид и растворить его в кислоте.' },
    ],
  },
]

export const TASK_MAP: Record<string, Task> = Object.fromEntries(TASKS.map((t) => [t.id, t]))

export function tasksOfTopic(topicId: string): Task[] {
  return TASKS.filter((t) => t.topic === topicId)
}
