// ── Reagent data ──────────────────────────────────────────────────────────────

export interface ReagentInfo {
  id: string
  label: string
  color: string
}

const ALL_REAGENTS: ReagentInfo[] = [
  // Типичные / Common
  { id: 'NaOH',            label: 'NaOH',           color: '#CFD8DC' },
  { id: 'HCl',             label: 'HCl',            color: '#B0BEC5' },
  { id: 'H2SO4_dilut',           label: 'H₂SO₄ (разб)',   color: '#FFE0B2' },
  { id: 'H2SO4_conc',            label: 'H₂SO₄ (конц)',   color: '#FF8F00' },
  { id: 'NH3',             label: 'NH₃',            color: '#DCEDC8' },
  { id: 'KMnO4',           label: 'KMnO₄',          color: '#7B1FA2' },
  { id: 'K2Cr2O7',         label: 'K₂Cr₂O₇',        color: '#FF8F00' },
  { id: 'KI',              label: 'KI',              color: '#FFF9C4' },
  { id: 'Na2S',            label: 'Na₂S',            color: '#C8E6C9' },
  { id: 'phenolphthalein', label: 'Фенолфталеин',    color: '#F8BBD0' },
  // Группа I
  { id: 'Na2CO3',          label: 'Na₂CO₃',          color: '#E1F5FE' },
  { id: 'NaHCO3',          label: 'NaHCO₃',          color: '#E3F2FD' },
  { id: 'Na2SO4',          label: 'Na₂SO₄',          color: '#E8EAF6' },
  // Группа II
  { id: 'CaCl2',           label: 'CaCl₂',           color: '#F3E5F5' },
  { id: 'BaCl2',           label: 'BaCl₂',           color: '#EDE7F6' },
  { id: 'CaOH2',           label: 'Ca(OH)₂',         color: '#E8F5E9' },
  // Группа III
  { id: 'AlCl3',           label: 'AlCl₃',           color: '#ECEFF1' },
  // Группа IV
  { id: 'Na2SiO3',         label: 'Na₂SiO₃',         color: '#E8EAF6' },
  // Группа V
  { id: 'Na3PO4',          label: 'Na₃PO₄',          color: '#E3F2FD' },
  // Группа VI
  { id: 'Na2SO3',          label: 'Na₂SO₃',          color: '#F9FBE7' },
  // Железо, Кобальт, Никель
  { id: 'FeCl3',           label: 'FeCl₃',           color: '#8D6E63' },
  { id: 'FeCl2',           label: 'FeCl₂',           color: '#A5D6A7' },
  { id: 'FeSO4',           label: 'FeSO₄',           color: '#C8E6C9' },
  { id: 'CoCl2',           label: 'CoCl₂',           color: '#F8BBD0' },
  { id: 'NiSO4',           label: 'NiSO₄',           color: '#A5D6A7' },
  // Медь, Серебро
  { id: 'CuSO4',           label: 'CuSO₄',           color: '#1E88E5' },
  { id: 'AgNO3',           label: 'AgNO₃',           color: '#EEEEEE' },
  // Хром, Марганец
  { id: 'CrCl3',           label: 'CrCl₃',           color: '#66BB6A' },
  // Цинк, Свинец
  { id: 'ZnSO4',           label: 'ZnSO₄',           color: '#E0E0E0' },
  { id: 'PbNO32',          label: 'Pb(NO₃)₂',        color: '#EFEBE9' },
  // Галогены (молекулярные)
  { id: 'Br2',             label: 'Br₂',             color: '#8B3103' },
  { id: 'Cl2',             label: 'Cl₂',             color: '#B8CC40' },
  { id: 'I2',              label: 'I₂',              color: '#5C2A00' },
  // Кислоты и окислители
  { id: 'HNO3_dilut',            label: 'HNO₃ (разб)',    color: '#FFCCBC' },
  { id: 'HNO3_conc',             label: 'HNO₃ (конц)',    color: '#FF7043' },
  { id: 'H2O2',            label: 'H₂O₂',            color: '#B3E5FC' },
  // Газы / кислотные оксиды
  { id: 'SO2',             label: 'SO₂',             color: '#CDDC39' },
  { id: 'CO2',             label: 'CO₂',             color: '#90A4AE' },

  // ── Твёрдые вещества ──────────────────────────────────────────────────────
  // Металлы
  { id: 'Fe_s',   label: 'Fe',      color: '#78909C' },
  { id: 'Cu_s',   label: 'Cu',      color: '#B87333' },
  { id: 'Zn_s',   label: 'Zn',      color: '#B0C4BE' },
  { id: 'Al_s',   label: 'Al',      color: '#CFD8DC' },
  { id: 'Mg_s',   label: 'Mg',      color: '#E0E0E0' },
  // Оксиды металлов
  { id: 'CuO',    label: 'CuO',     color: '#263238' },
  { id: 'Fe2O3',  label: 'Fe₂O₃',   color: '#BF360C' },
  { id: 'Al2O3',  label: 'Al₂O₃',   color: '#ECEFF1' },
  { id: 'ZnO',    label: 'ZnO',     color: '#F5F5F5' },
  { id: 'CaO',    label: 'CaO',     color: '#FFF8E1' },
  { id: 'Na2O',   label: 'Na₂O',    color: '#E8EAF6' },
  { id: 'MnO2',   label: 'MnO₂',    color: '#37474F' },
  // Кислотные оксиды
  { id: 'SiO2',   label: 'SiO₂',    color: '#ECEFF1' },
  { id: 'P2O5',   label: 'P₂O₅',    color: '#FFF9C4' },
  // Прочие нерастворимые / твёрдые
  { id: 'CaCO3',  label: 'CaCO₃',   color: '#F5F5F5' },
  { id: 'S_s',    label: 'S',       color: '#FDD835' },
  { id: 'C_s',    label: 'C',       color: '#424242' },
  // Специальный токен — нагревание
  { id: 'heat',   label: '🔥 Нагрев', color: '#FF5722' },
]

export const REAGENT_MAP: Record<string, ReagentInfo> = Object.fromEntries(
  ALL_REAGENTS.map((r) => [r.id, r])
)

// ── Group classification ──────────────────────────────────────────────────────

export interface ReagentGroup {
  id: string
  label: string
  fullLabel: string
  reagentIds: string[]
}

export const MAIN_GROUPS: ReagentGroup[] = [
  { id: 'mg1', label: 'I',    fullLabel: 'Гр. I — Na, K',       reagentIds: ['Na2CO3', 'NaHCO3', 'Na2SO4'] },
  { id: 'mg2', label: 'II',   fullLabel: 'Гр. II — Ca, Ba',     reagentIds: ['CaCl2', 'BaCl2', 'CaOH2'] },
  { id: 'mg3', label: 'III',  fullLabel: 'Гр. III — Al',        reagentIds: ['AlCl3'] },
  { id: 'mg4', label: 'IV',   fullLabel: 'Гр. IV — Si',         reagentIds: ['Na2SiO3'] },
  { id: 'mg5', label: 'V',    fullLabel: 'Гр. V — N, P',        reagentIds: ['HNO3_dilut', 'HNO3_conc', 'Na3PO4'] },
  { id: 'mg6', label: 'VI',   fullLabel: 'Гр. VI — S',          reagentIds: ['H2SO4_dilut', 'H2SO4_conc', 'Na2S', 'Na2SO3'] },
  { id: 'mg7', label: 'VII',  fullLabel: 'Гр. VII — Галогены',  reagentIds: ['HCl', 'KI', 'Cl2', 'Br2', 'I2'] },
]

export const TRANSITION_GROUPS: ReagentGroup[] = [
  { id: 'tfe', label: 'Fe',    fullLabel: 'Fe, Co, Ni',           reagentIds: ['FeCl3', 'FeCl2', 'FeSO4', 'CoCl2', 'NiSO4'] },
  { id: 'tcu', label: 'Cu/Ag', fullLabel: 'Cu, Ag',              reagentIds: ['CuSO4', 'AgNO3'] },
  { id: 'tcr', label: 'Cr/Mn', fullLabel: 'Cr, Mn',              reagentIds: ['CrCl3', 'K2Cr2O7', 'KMnO4'] },
  { id: 'tzn', label: 'Zn/Pb', fullLabel: 'Zn, Pb',              reagentIds: ['ZnSO4', 'PbNO32'] },
]

// ── Common reagent sections ───────────────────────────────────────────────────

export const COMMON_SECTIONS: Array<{ label: string; ids: string[] }> = [
  { label: 'СРЕДА',          ids: ['NaOH', 'HCl', 'NH3'] },
  { label: 'ОКИСЛИТЕЛИ',     ids: ['KMnO4', 'K2Cr2O7', 'H2O2'] },
  { label: 'ВОССТАНОВИТЕЛИ', ids: ['KI', 'Na2S'] },
  { label: 'ГАЗЫ',           ids: ['SO2', 'CO2'] },
  { label: 'ИНДИКАТОРЫ',     ids: ['phenolphthalein'] },
]

// ── Reaction engine ───────────────────────────────────────────────────────────

export interface ReactionEffects {
  liquidColor?: string
  precipitate?: { color: string }
  gas?: boolean
}

interface ReactionRule {
  inputs: string[]
  effects: ReactionEffects
  description: string
}

const REACTION_TABLE: ReactionRule[] = [
  // ── Окраска раствора при добавлении одного реагента ───────────────────────
  { inputs: ['CuSO4'],   effects: { liquidColor: 'rgba(30,136,229,0.28)' },   description: '' },
  { inputs: ['FeCl3'],   effects: { liquidColor: 'rgba(141,110,99,0.48)' },   description: '' },
  { inputs: ['FeCl2'],   effects: { liquidColor: 'rgba(100,160,100,0.32)' },  description: '' },
  { inputs: ['FeSO4'],   effects: { liquidColor: 'rgba(100,160,100,0.32)' },  description: '' },
  { inputs: ['KMnO4'],   effects: { liquidColor: 'rgba(156,39,176,0.60)' },   description: '' },
  { inputs: ['K2Cr2O7'], effects: { liquidColor: 'rgba(245,127,23,0.52)' },   description: '' },
  { inputs: ['CoCl2'],   effects: { liquidColor: 'rgba(240,98,146,0.42)' },   description: '' },
  { inputs: ['NiSO4'],   effects: { liquidColor: 'rgba(100,200,100,0.35)' },  description: '' },
  { inputs: ['CrCl3'],   effects: { liquidColor: 'rgba(27,94,32,0.55)' },     description: '' },
  // Молекулярные галогены
  { inputs: ['Br2'],     effects: { liquidColor: 'rgba(150,50,0,0.72)' },     description: '' },
  { inputs: ['Cl2'],     effects: { liquidColor: 'rgba(185,215,55,0.28)' },   description: '' },
  { inputs: ['I2'],      effects: { liquidColor: 'rgba(110,45,0,0.60)' },     description: '' },
  // Газы (слабоокрашенные растворы)
  { inputs: ['SO2'],     effects: { liquidColor: 'rgba(240,245,200,0.15)' },  description: '' },

  // ── Реакции с NaOH (осаждение гидроксидов) ───────────────────────────────
  {
    inputs: ['CuSO4', 'NaOH'],
    effects: { liquidColor: 'rgba(129,212,250,0.22)', precipitate: { color: '#4FC3F7' } },
    description: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
  },
  {
    inputs: ['FeCl3', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.15)', precipitate: { color: '#BF360C' } },
    description: 'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',
  },
  {
    inputs: ['FeCl2', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.15)', precipitate: { color: '#78909C' } },
    description: 'FeCl₂ + 2NaOH → Fe(OH)₂↓ + 2NaCl',
  },
  {
    inputs: ['FeSO4', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.15)', precipitate: { color: '#78909C' } },
    description: 'FeSO₄ + 2NaOH → Fe(OH)₂↓ + Na₂SO₄',
  },
  {
    inputs: ['AgNO3', 'NaOH'],
    effects: { liquidColor: 'rgba(80,80,80,0.12)', precipitate: { color: '#37474F' } },
    description: '2AgNO₃ + 2NaOH → Ag₂O↓ + H₂O + 2NaNO₃',
  },
  {
    inputs: ['K2Cr2O7', 'NaOH'],
    effects: { liquidColor: 'rgba(255,214,0,0.62)' },
    description: 'K₂Cr₂O₇ + 2NaOH → K₂CrO₄ + Na₂CrO₄ + H₂O',
  },
  {
    inputs: ['AlCl3', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } },
    description: 'AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl',
  },
  {
    inputs: ['CoCl2', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#80DEEA' } },
    description: 'CoCl₂ + 2NaOH → Co(OH)₂↓ + 2NaCl',
  },
  {
    inputs: ['NiSO4', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#9CCC65' } },
    description: 'NiSO₄ + 2NaOH → Ni(OH)₂↓ + Na₂SO₄',
  },
  {
    inputs: ['ZnSO4', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } },
    description: 'ZnSO₄ + 2NaOH → Zn(OH)₂↓ + Na₂SO₄',
  },
  {
    inputs: ['CrCl3', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#78909C' } },
    description: 'CrCl₃ + 3NaOH → Cr(OH)₃↓ + 3NaCl',
  },
  {
    inputs: ['PbNO32', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } },
    description: 'Pb(NO₃)₂ + 2NaOH → Pb(OH)₂↓ + 2NaNO₃',
  },

  // ── Растворение амфотерных гидроксидов в избытке NaOH ─────────────────────
  // inputs содержит NaOH дважды = пользователь добавил NaOH второй раз (избыток)
  {
    inputs: ['AlCl3', 'NaOH', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'AlCl₃ + 4NaOH → Na[Al(OH)₄] + 3NaCl  (избыток NaOH — осадок Al(OH)₃ растворяется)',
  },
  {
    inputs: ['ZnSO4', 'NaOH', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'ZnSO₄ + 4NaOH → Na₂[Zn(OH)₄] + Na₂SO₄  (избыток NaOH — осадок Zn(OH)₂ растворяется)',
  },
  {
    inputs: ['CrCl3', 'NaOH', 'NaOH'],
    effects: { liquidColor: 'rgba(30,100,30,0.38)' },
    description: 'CrCl₃ + 4NaOH → Na[Cr(OH)₄] + 3NaCl  (избыток NaOH — осадок Cr(OH)₃ растворяется)',
  },
  {
    // H₂O₂ в щелочной среде окисляет Cr³⁺ → Cr⁶⁺ (CrO₄²⁻, ярко-жёлтый)
    inputs: ['CrCl3', 'NaOH', 'H2O2'],
    effects: { liquidColor: 'rgba(255,210,0,0.72)' },
    description: '2CrCl₃ + 3H₂O₂ + 10NaOH → 2Na₂CrO₄ + 6NaCl + 8H₂O  (Окислитель: O⁻¹ → O²⁻, Восстановитель: Cr³⁺ → Cr⁶⁺)',
  },
  {
    // Тот же эффект через хромит-ион (избыток NaOH); subsumes правило амфотерного растворения
    inputs: ['CrCl3', 'NaOH', 'NaOH', 'H2O2'],
    effects: { liquidColor: 'rgba(255,210,0,0.72)' },
    description: '2Na[Cr(OH)₄] + 3H₂O₂ + 2NaOH → 2Na₂CrO₄ + 6H₂O  (Окислитель: O⁻¹ → O²⁻, Восстановитель: Cr³⁺ → Cr⁶⁺)',
  },
  {
    inputs: ['PbNO32', 'NaOH', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'Pb(NO₃)₂ + 4NaOH → Na₂[Pb(OH)₄] + 2NaNO₃  (избыток NaOH — осадок Pb(OH)₂ растворяется)',
  },

  // ── Реакции с HCl ─────────────────────────────────────────────────────────
  {
    inputs: ['Na2CO3', 'HCl'],
    effects: { gas: true },
    description: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',
  },
  {
    inputs: ['NaHCO3', 'HCl'],
    effects: { gas: true },
    description: 'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑',
  },
  {
    inputs: ['AgNO3', 'HCl'],
    effects: { precipitate: { color: '#B0BEC5' } },
    description: 'AgNO₃ + HCl → AgCl↓ + HNO₃',
  },
  {
    inputs: ['KMnO4', 'HCl'],
    effects: { gas: true, liquidColor: 'rgba(190,190,190,0.25)' },
    description: '2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂↑ + 8H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: Cl⁻ → Cl₂)',
  },
  {
    inputs: ['Na2S', 'HCl'],
    effects: { gas: true },
    description: 'Na₂S + 2HCl → 2NaCl + H₂S↑',
  },
  {
    inputs: ['CaOH2', 'HCl'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)' },
    description: 'Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O',
  },
  {
    inputs: ['Na2SiO3', 'HCl'],
    effects: { precipitate: { color: '#B0BEC5' } },
    description: 'Na₂SiO₃ + 2HCl → H₂SiO₃↓ + 2NaCl',
  },
  {
    inputs: ['Na2SO3', 'HCl'],
    effects: { gas: true },
    description: 'Na₂SO₃ + 2HCl → 2NaCl + H₂O + SO₂↑',
  },
  {
    inputs: ['PbNO32', 'HCl'],
    effects: { precipitate: { color: '#B0BEC5' } },
    description: 'Pb(NO₃)₂ + 2HCl → PbCl₂↓ + 2HNO₃',
  },
  {
    inputs: ['Na3PO4', 'HCl'],
    effects: {},
    description: 'Na₃PO₄ + 3HCl → 3NaCl + H₃PO₄',
  },

  // ── Реакции с H2SO4 ───────────────────────────────────────────────────────
  {
    inputs: ['Na2CO3', 'H2SO4_dilut'],
    effects: { gas: true },
    description: 'Na₂CO₃ + H₂SO₄ → Na₂SO₄ + H₂O + CO₂↑',
  },
  {
    inputs: ['NaHCO3', 'H2SO4_dilut'],
    effects: { gas: true },
    description: '2NaHCO₃ + H₂SO₄ → Na₂SO₄ + 2H₂O + 2CO₂↑',
  },
  {
    inputs: ['BaCl2', 'H2SO4_dilut'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl',
  },
  {
    inputs: ['Na2S', 'H2SO4_dilut'],
    effects: { gas: true },
    description: 'Na₂S + H₂SO₄ → Na₂SO₄ + H₂S↑',
  },
  {
    inputs: ['Na2SiO3', 'H2SO4_dilut'],
    effects: { precipitate: { color: '#B0BEC5' } },
    description: 'Na₂SiO₃ + H₂SO₄ → H₂SiO₃↓ + Na₂SO₄',
  },
  {
    inputs: ['Na2SO3', 'H2SO4_dilut'],
    effects: { gas: true },
    description: 'Na₂SO₃ + H₂SO₄ → Na₂SO₄ + H₂O + SO₂↑',
  },
  {
    inputs: ['PbNO32', 'H2SO4_dilut'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'Pb(NO₃)₂ + H₂SO₄ → PbSO₄↓ + 2HNO₃',
  },

  // ── Реакции с Na2CO3 (осаждение и двойной гидролиз) ──────────────────────
  {
    inputs: ['FeCl3', 'Na2CO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.15)', precipitate: { color: '#BF360C' }, gas: true },
    description: '2FeCl₃ + 3Na₂CO₃ + 3H₂O → 2Fe(OH)₃↓ + 3CO₂↑ + 6NaCl  (двойной гидролиз)',
  },
  {
    inputs: ['CuSO4', 'Na2CO3'],
    effects: { liquidColor: 'rgba(38,166,154,0.15)', precipitate: { color: '#26A69A' }, gas: true },
    description: '2CuSO₄ + 2Na₂CO₃ + H₂O → (CuOH)₂CO₃↓ + 2Na₂SO₄ + CO₂↑  (двойной гидролиз)',
  },
  {
    inputs: ['AlCl3', 'Na2CO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' }, gas: true },
    description: '2AlCl₃ + 3Na₂CO₃ + 3H₂O → 2Al(OH)₃↓ + 3CO₂↑ + 6NaCl  (двойной гидролиз)',
  },
  {
    inputs: ['CrCl3', 'Na2CO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#78909C' }, gas: true },
    description: '2CrCl₃ + 3Na₂CO₃ + 3H₂O → 2Cr(OH)₃↓ + 3CO₂↑ + 6NaCl  (двойной гидролиз)',
  },
  {
    inputs: ['CaCl2', 'Na2CO3'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl',
  },
  {
    inputs: ['BaCl2', 'Na2CO3'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'BaCl₂ + Na₂CO₃ → BaCO₃↓ + 2NaCl',
  },
  {
    inputs: ['AgNO3', 'Na2CO3'],
    effects: { precipitate: { color: '#FFF59D' } },
    description: '2AgNO₃ + Na₂CO₃ → Ag₂CO₃↓ + 2NaNO₃',
  },
  {
    inputs: ['NiSO4', 'Na2CO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#A5D6A7' } },
    description: 'NiSO₄ + Na₂CO₃ → NiCO₃↓ + Na₂SO₄',
  },
  {
    inputs: ['CoCl2', 'Na2CO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#F8BBD0' } },
    description: 'CoCl₂ + Na₂CO₃ → CoCO₃↓ + 2NaCl',
  },
  {
    inputs: ['ZnSO4', 'Na2CO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } },
    description: 'ZnSO₄ + Na₂CO₃ → ZnCO₃↓ + Na₂SO₄',
  },

  // ── Реакции с Na2SO4 ──────────────────────────────────────────────────────
  {
    inputs: ['BaCl2', 'Na2SO4'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',
  },
  {
    inputs: ['PbNO32', 'Na2SO4'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'Pb(NO₃)₂ + Na₂SO₄ → PbSO₄↓ + 2NaNO₃',
  },

  // ── Реакции с Na₃PO₄ ─────────────────────────────────────────────────────
  {
    inputs: ['Na3PO4', 'AgNO3'],
    effects: { precipitate: { color: '#F9A825' } },
    description: '3AgNO₃ + Na₃PO₄ → Ag₃PO₄↓ + 3NaNO₃',
  },
  {
    inputs: ['Na3PO4', 'CaCl2'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: '3CaCl₂ + 2Na₃PO₄ → Ca₃(PO₄)₂↓ + 6NaCl',
  },
  {
    inputs: ['Na3PO4', 'BaCl2'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: '3BaCl₂ + 2Na₃PO₄ → Ba₃(PO₄)₂↓ + 6NaCl',
  },
  {
    inputs: ['Na3PO4', 'FeCl3'],
    effects: { liquidColor: 'rgba(200,200,200,0.15)', precipitate: { color: '#F9A825' } },
    description: 'FeCl₃ + Na₃PO₄ → FePO₄↓ + 3NaCl',
  },

  // ── Реакции с Na₂SO₃ ─────────────────────────────────────────────────────
  {
    inputs: ['Na2SO3', 'BaCl2'],
    effects: { precipitate: { color: '#B0BEC5' } },
    description: 'Na₂SO₃ + BaCl₂ → BaSO₃↓ + 2NaCl',
  },
  {
    inputs: ['Na2SO3', 'KMnO4'],
    effects: { liquidColor: 'rgba(180,160,80,0.25)', precipitate: { color: '#5D4037' } },
    description: '2KMnO₄ + 3Na₂SO₃ + H₂O → 2MnO₂↓ + 3Na₂SO₄ + 2KOH  (Окислитель: Mn⁷⁺ → Mn⁴⁺, Восстановитель: S⁴⁺ → S⁶⁺)',
  },
  {
    inputs: ['Na2SO3', 'KMnO4', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(180,160,80,0.18)' },
    description: '5Na₂SO₃ + 2KMnO₄ + 3H₂SO₄ → 5Na₂SO₄ + 2MnSO₄ + K₂SO₄ + 3H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: S⁴⁺ → S⁶⁺)',
  },
  {
    inputs: ['Na2SO3', 'K2Cr2O7'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#78909C' } },
    description: 'K₂Cr₂O₇ + 3Na₂SO₃ + 4H₂O → 2Cr(OH)₃↓ + 3Na₂SO₄ + 2KOH  (нейтральная среда: Cr⁶⁺ → Cr³⁺ в виде осадка гидроксида)',
  },
  {
    inputs: ['Na2SO3', 'K2Cr2O7', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(60,120,60,0.52)' },
    description: 'K₂Cr₂O₇ + 3Na₂SO₃ + 4H₂SO₄ → Cr₂(SO₄)₃ + 3Na₂SO₄ + K₂SO₄ + 4H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: S⁴⁺ → S⁶⁺)',
  },

  // K₂Cr₂O₇ + FeCl₂ в кислой среде (HCl)
  {
    inputs: ['K2Cr2O7', 'FeCl2', 'HCl'],
    // Продукты: CrCl₃ (тёмно-зелёный) + FeCl₃ (жёлто-бурый) → оливково-бурый
    effects: { liquidColor: 'rgba(100,90,22,0.55)' },
    description: 'K₂Cr₂O₇ + 6FeCl₂ + 14HCl → 2CrCl₃ + 6FeCl₃ + 2KCl + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: Fe²⁺ → Fe³⁺)',
  },

  // ── Реакции с Na₂S (осаждение сульфидов) ────────────────────────────────
  {
    inputs: ['CuSO4', 'Na2S'],
    effects: { liquidColor: 'rgba(30,30,30,0.55)', precipitate: { color: '#212121' } },
    description: 'CuSO₄ + Na₂S → CuS↓ + Na₂SO₄',
  },
  {
    inputs: ['AgNO3', 'Na2S'],
    effects: { liquidColor: 'rgba(30,30,30,0.35)', precipitate: { color: '#1A1A1A' } },
    description: '2AgNO₃ + Na₂S → Ag₂S↓ + 2NaNO₃',
  },
  {
    inputs: ['FeCl3', 'Na2S'],
    effects: { liquidColor: 'rgba(100,160,100,0.30)', precipitate: { color: '#F9A825' } },
    description: '2FeCl₃ + Na₂S → 2FeCl₂ + S↓ + 2NaCl  (Окислитель: Fe³⁺ → Fe²⁺, Восстановитель: S²⁻ → S⁰)',
  },
  {
    inputs: ['KMnO4', 'Na2S'],
    effects: { liquidColor: 'rgba(180,160,50,0.25)', precipitate: { color: '#8D6E2E' } },
    description: '2KMnO₄ + 3Na₂S + 4H₂O → 2MnO₂↓ + 3S↓ + 6NaOH + 2KOH  (Окислитель: Mn⁷⁺ → Mn⁴⁺, Восстановитель: S²⁻ → S⁰)',
  },
  {
    inputs: ['KMnO4', 'Na2S', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(180,160,50,0.20)', precipitate: { color: '#F9A825' } },
    description: '2KMnO₄ + 5Na₂S + 8H₂SO₄ → 2MnSO₄ + 5S↓ + 5Na₂SO₄ + K₂SO₄ + 8H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: S²⁻ → S⁰)',
  },
  {
    inputs: ['PbNO32', 'Na2S'],
    effects: { liquidColor: 'rgba(20,20,20,0.60)', precipitate: { color: '#212121' } },
    description: 'Pb(NO₃)₂ + Na₂S → PbS↓ + 2NaNO₃',
  },
  {
    inputs: ['CoCl2', 'Na2S'],
    effects: { liquidColor: 'rgba(20,20,20,0.55)', precipitate: { color: '#1A237E' } },
    description: 'CoCl₂ + Na₂S → CoS↓ + 2NaCl',
  },
  {
    inputs: ['NiSO4', 'Na2S'],
    effects: { liquidColor: 'rgba(20,20,20,0.55)', precipitate: { color: '#1B5E20' } },
    description: 'NiSO₄ + Na₂S → NiS↓ + Na₂SO₄',
  },
  {
    inputs: ['ZnSO4', 'Na2S'],
    effects: { precipitate: { color: '#B0BEC5' } },
    description: 'ZnSO₄ + Na₂S → ZnS↓ + Na₂SO₄',
  },

  // ── Реакции с KI ─────────────────────────────────────────────────────────
  {
    inputs: ['FeCl3', 'KI'],
    effects: { liquidColor: 'rgba(120,60,0,0.55)' },
    description: '2FeCl₃ + 2KI → 2FeCl₂ + I₂ + 2KCl  (Окислитель: Fe³⁺ → Fe²⁺, Восстановитель: I⁻ → I₂)',
  },
  {
    inputs: ['KMnO4', 'KI'],
    effects: { liquidColor: 'rgba(140,70,10,0.75)', precipitate: { color: '#5D4037' } },
    description: '2KMnO₄ + 6KI + 4H₂O → 2MnO₂↓ + 3I₂ + 8KOH  (Окислитель: Mn⁷⁺ → Mn⁴⁺, Восстановитель: I⁻ → I₂)',
  },
  {
    inputs: ['KMnO4', 'KI', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(100,50,0,0.80)' },
    description: '2KMnO₄ + 10KI + 8H₂SO₄ → 6K₂SO₄ + 2MnSO₄ + 5I₂ + 8H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: I⁻ → I₂)',
  },

  // ── Реакции с NH₃ ─────────────────────────────────────────────────────────
  {
    inputs: ['CuSO4', 'NH3'],
    effects: { liquidColor: 'rgba(40,53,147,0.72)' },
    description: 'CuSO₄ + 4NH₃ → [Cu(NH₃)₄]SO₄',
  },
  {
    inputs: ['NiSO4', 'NH3'],
    effects: { liquidColor: 'rgba(94,53,177,0.55)' },
    description: 'NiSO₄ + 6NH₃ → [Ni(NH₃)₆]SO₄',
  },
  {
    inputs: ['AgNO3', 'NH3'],
    effects: { liquidColor: 'rgba(200,200,200,0.12)' },
    description: 'AgNO₃ + 2NH₃ → [Ag(NH₃)₂]NO₃',
  },
  {
    inputs: ['ZnSO4', 'NH3'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)' },
    description: 'ZnSO₄ + 4NH₃ → [Zn(NH₃)₄]SO₄',
  },

  // ── Индикатор фенолфталеин ────────────────────────────────────────────────
  {
    inputs: ['phenolphthalein', 'NaOH'],
    effects: { liquidColor: 'rgba(233,30,140,0.55)' },
    description: 'Фенолфталеин — индикатор щелочной среды (NaOH)',
  },
  {
    inputs: ['phenolphthalein', 'CaOH2'],
    effects: { liquidColor: 'rgba(233,30,140,0.55)' },
    description: 'Фенолфталеин — индикатор щелочной среды (Ca(OH)₂)',
  },
  {
    inputs: ['phenolphthalein', 'NH3'],
    effects: { liquidColor: 'rgba(233,30,140,0.38)' },
    description: 'Фенолфталеин — индикатор слабощелочной среды (NH₃)',
  },

  // ── Окислительно-восстановительные реакции в кислой среде ────────────────
  {
    // Cr³⁺ → Cr₂O₇²⁻ (оранжевый) под действием KMnO₄ в H₂SO₄
    inputs: ['CrCl3', 'KMnO4', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(245,127,23,0.58)' },
    description: '10Cr³⁺ + 6MnO₄⁻ + 11H₂O → 5Cr₂O₇²⁻ + 6Mn²⁺ + 22H⁺  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: Cr³⁺ → Cr⁶⁺)',
  },

  // ── Реакции брома (Br₂) ───────────────────────────────────────────────────
  {
    inputs: ['Br2', 'KI'],
    // Br₂ вытесняет I₂ — тёмно-бурый раствор
    effects: { liquidColor: 'rgba(110,45,0,0.78)' },
    description: 'Br₂ + 2KI → 2KBr + I₂  (Окислитель: Br₂ → 2Br⁻, Восстановитель: 2I⁻ → I₂)',
  },
  {
    inputs: ['Br2', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Br₂ + 2NaOH → NaBr + NaBrO + H₂O',
  },
  {
    inputs: ['Br2', 'Na2S'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#F9A825' } },
    description: 'Br₂ + Na₂S → 2NaBr + S↓  (Окислитель: Br₂ → 2Br⁻, Восстановитель: S²⁻ → S⁰)',
  },
  {
    inputs: ['Br2', 'FeSO4'],
    effects: { liquidColor: 'rgba(150,100,20,0.52)' },
    description: '2Fe²⁺ + Br₂ → 2Fe³⁺ + 2Br⁻  (Окислитель: Br₂ → 2Br⁻, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['Br2', 'FeCl2'],
    effects: { liquidColor: 'rgba(150,100,20,0.52)' },
    description: '2Fe²⁺ + Br₂ → 2Fe³⁺ + 2Br⁻  (Окислитель: Br₂ → 2Br⁻, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['Br2', 'Na2SO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Br₂ + Na₂SO₃ + H₂O → Na₂SO₄ + 2HBr  (Окислитель: Br₂ → 2Br⁻, Восстановитель: S⁴⁺ → S⁶⁺)',
  },

  // ── Реакции хлора (Cl₂) ───────────────────────────────────────────────────
  {
    inputs: ['Cl2', 'KI'],
    effects: { liquidColor: 'rgba(110,45,0,0.78)' },
    description: 'Cl₂ + 2KI → 2KCl + I₂  (Окислитель: Cl₂ → 2Cl⁻, Восстановитель: 2I⁻ → I₂)',
  },
  {
    inputs: ['Cl2', 'NaOH'],
    // Хлорная вода + NaOH → NaCl + NaClO (отбеливатель, обесцвечивание)
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Cl₂ + 2NaOH → NaCl + NaClO + H₂O',
  },
  {
    inputs: ['Cl2', 'Na2S'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#F9A825' } },
    description: 'Cl₂ + Na₂S → 2NaCl + S↓  (Окислитель: Cl₂ → 2Cl⁻, Восстановитель: S²⁻ → S⁰)',
  },
  {
    inputs: ['Cl2', 'FeCl2'],
    // Самый чистый случай: все хлориды
    effects: { liquidColor: 'rgba(150,100,20,0.52)' },
    description: '2FeCl₂ + Cl₂ → 2FeCl₃  (Окислитель: Cl₂ → 2Cl⁻, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['Cl2', 'FeSO4'],
    effects: { liquidColor: 'rgba(150,100,20,0.52)' },
    description: '2Fe²⁺ + Cl₂ → 2Fe³⁺ + 2Cl⁻  (Окислитель: Cl₂ → 2Cl⁻, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['Cl2', 'Na2SO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Cl₂ + Na₂SO₃ + H₂O → Na₂SO₄ + 2HCl  (Окислитель: Cl₂ → 2Cl⁻, Восстановитель: S⁴⁺ → S⁶⁺)',
  },

  // ── Реакции йода (I₂) ────────────────────────────────────────────────────
  {
    inputs: ['I2', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'I₂ + 2NaOH → NaI + NaIO + H₂O',
  },
  {
    inputs: ['I2', 'Na2S'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#F9A825' } },
    description: 'I₂ + Na₂S → 2NaI + S↓  (Окислитель: I₂ → 2I⁻, Восстановитель: S²⁻ → S⁰)',
  },
  {
    inputs: ['I2', 'Na2SO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'I₂ + Na₂SO₃ + H₂O → Na₂SO₄ + 2HI  (Окислитель: I₂ → 2I⁻, Восстановитель: S⁴⁺ → S⁶⁺)',
  },

  // ── Реакции азотной кислоты (HNO₃) ───────────────────────────────────────
  {
    inputs: ['NaOH', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'HNO₃ + NaOH → NaNO₃ + H₂O',
  },
  {
    inputs: ['Na2CO3', 'HNO3_dilut'],
    effects: { gas: true },
    description: 'Na₂CO₃ + 2HNO₃ → 2NaNO₃ + H₂O + CO₂↑',
  },
  {
    inputs: ['NaHCO3', 'HNO3_dilut'],
    effects: { gas: true },
    description: 'NaHCO₃ + HNO₃ → NaNO₃ + H₂O + CO₂↑',
  },
  {
    inputs: ['CaOH2', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Ca(OH)₂ + 2HNO₃ → Ca(NO₃)₂ + 2H₂O',
  },
  {
    inputs: ['Na2SiO3', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } },
    description: 'Na₂SiO₃ + 2HNO₃ → H₂SiO₃↓ + 2NaNO₃',
  },
  {
    inputs: ['Na2SO3', 'HNO3_dilut'],
    // H⁺ вытесняет SO₂ из сульфита (кислотная реакция)
    effects: { gas: true },
    description: 'Na₂SO₃ + 2HNO₃ → 2NaNO₃ + SO₂↑ + H₂O',
  },
  {
    inputs: ['KI', 'HNO3_dilut'],
    // Разбавленная HNO₃ окисляет I⁻ до I₂
    effects: { liquidColor: 'rgba(110,45,0,0.72)', gas: true },
    description: '6KI + 8HNO₃(разб) → 6KNO₃ + 3I₂ + 2NO↑ + 4H₂O  (Окислитель: N⁵⁺ → N²⁺, Восстановитель: I⁻ → I₂)',
  },
  {
    inputs: ['FeCl2', 'HNO3_dilut'],
    // Разбавленная HNO₃ окисляет Fe²⁺ → Fe³⁺, выделяется NO
    effects: { liquidColor: 'rgba(150,100,20,0.52)', gas: true },
    description: '3Fe²⁺ + 4H⁺ + NO₃⁻ → 3Fe³⁺ + NO↑ + 2H₂O  (Окислитель: N⁵⁺ → N²⁺, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['FeSO4', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(150,100,20,0.52)', gas: true },
    description: '3Fe²⁺ + 4H⁺ + NO₃⁻ → 3Fe³⁺ + NO↑ + 2H₂O  (Окислитель: N⁵⁺ → N²⁺, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['Na2S', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#F9A825' }, gas: true },
    description: '3Na₂S + 8HNO₃(разб) → 3S↓ + 6NaNO₃ + 2NO↑ + 4H₂O  (Окислитель: N⁵⁺ → N²⁺, Восстановитель: S²⁻ → S⁰)',
  },

  // ── Реакции пероксида водорода (H₂O₂) ────────────────────────────────────
  {
    inputs: ['H2O2', 'KI'],
    // H₂O₂ окисляет I⁻ → I₂ (тёмно-бурый раствор)
    effects: { liquidColor: 'rgba(110,45,0,0.72)' },
    description: 'H₂O₂ + 2KI → I₂ + 2KOH  (Окислитель: O⁻¹ → O²⁻, Восстановитель: I⁻ → I₂)',
  },
  {
    inputs: ['H2O2', 'KMnO4'],
    // H₂O₂ восстанавливает KMnO₄ → MnO₂↓ + O₂↑ (нейтральная/щелочная среда)
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#5D4037' }, gas: true },
    description: '2KMnO₄ + 3H₂O₂ → 2MnO₂↓ + 3O₂↑ + 2KOH + 2H₂O  (Окислитель: Mn⁷⁺ → Mn⁴⁺, Восстановитель: O⁻¹ → O₂)',
  },
  {
    inputs: ['H2O2', 'KMnO4', 'H2SO4_dilut'],
    // H₂O₂ восстанавливает KMnO₄ → Mn²⁺ (кислотная среда, Mn²⁺ бесцветен)
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: '2KMnO₄ + 5H₂O₂ + 3H₂SO₄ → 2MnSO₄ + K₂SO₄ + 5O₂↑ + 8H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: O⁻¹ → O₂)',
  },
  {
    inputs: ['H2O2', 'FeSO4'],
    // Реакция Фентона: Fe²⁺ → Fe³⁺ (жёлто-бурый раствор)
    effects: { liquidColor: 'rgba(150,100,20,0.52)' },
    description: '2Fe²⁺ + H₂O₂ + 2H⁺ → 2Fe³⁺ + 2H₂O  (Окислитель: O⁻¹ → O²⁻, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['H2O2', 'FeCl2'],
    effects: { liquidColor: 'rgba(150,100,20,0.52)' },
    description: '2Fe²⁺ + H₂O₂ + 2H⁺ → 2Fe³⁺ + 2H₂O  (Окислитель: O⁻¹ → O²⁻, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['H2O2', 'Na2S'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#F9A825' } },
    description: 'H₂O₂ + Na₂S → S↓ + 2NaOH  (Окислитель: O⁻¹ → O²⁻, Восстановитель: S²⁻ → S⁰)',
  },
  {
    inputs: ['H2O2', 'Na2SO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'H₂O₂ + Na₂SO₃ → Na₂SO₄ + H₂O  (Окислитель: O⁻¹ → O²⁻, Восстановитель: S⁴⁺ → S⁶⁺)',
  },

  // ── Реакции сернистого газа (SO₂) ────────────────────────────────────────
  {
    inputs: ['SO2', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'SO₂ + 2NaOH → Na₂SO₃ + H₂O',
  },
  {
    inputs: ['SO2', 'CaOH2'],
    // Классическая реакция определения SO₂ — белый осадок CaSO₃
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } },
    description: 'SO₂ + Ca(OH)₂ → CaSO₃↓ + H₂O',
  },
  {
    inputs: ['SO2', 'KMnO4'],
    // SO₂ обесцвечивает KMnO₄ → MnSO₄ (Mn²⁺ бесцветен)
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: '2KMnO₄ + 5SO₂ + 2H₂O → K₂SO₄ + 2MnSO₄ + 2H₂SO₄  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: S⁴⁺ → S⁶⁺)',
  },
  {
    inputs: ['SO2', 'K2Cr2O7', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(60,120,60,0.52)' },
    description: 'K₂Cr₂O₇ + 3SO₂ + H₂SO₄ → K₂SO₄ + Cr₂(SO₄)₃ + H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: S⁴⁺ → S⁶⁺)',
  },
  {
    inputs: ['SO2', 'BaCl2'],
    // SO₂ + H₂O → H₂SO₃; Ba²⁺ + SO₃²⁻ → BaSO₃↓ (белый)
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } },
    description: 'BaCl₂ + SO₂ + H₂O → BaSO₃↓ + 2HCl',
  },

  // ── Реакции углекислого газа (CO₂) ───────────────────────────────────────
  {
    inputs: ['CO2', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'CO₂ + 2NaOH → Na₂CO₃ + H₂O',
  },
  {
    inputs: ['CO2', 'CaOH2'],
    // Классическая реакция известковой воды — белый осадок CaCO₃
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } },
    description: 'CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O',
  },
  {
    // Избыток CO₂ растворяет CaCO₃ → Ca(HCO₃)₂ (растворим)
    inputs: ['CO2', 'CO2', 'CaOH2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂  (осадок растворяется в избытке CO₂)',
  },
  {
    inputs: ['CO2', 'Na2SiO3'],
    // CO₂ вытесняет H₂SiO₃ из силиката (CO₂ — более сильная кислота, чем H₂SiO₃)
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } },
    description: 'CO₂ + Na₂SiO₃ + H₂O → H₂SiO₃↓ + Na₂CO₃',
  },
  {
    inputs: ['CO2', 'Na2CO3'],
    // Избыток CO₂ переводит карбонат в гидрокарбонат
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'CO₂ + Na₂CO₃ + H₂O → 2NaHCO₃',
  },

  // ── Дополнительные реакции Ca(OH)₂ ──────────────────────────────────────
  {
    inputs: ['CaOH2', 'H2SO4_dilut'],
    // Гипс: CaSO₄ — белый осадок (малорастворим)
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } },
    description: 'Ca(OH)₂ + H₂SO₄ → CaSO₄↓ + 2H₂O',
  },
  {
    inputs: ['CaOH2', 'Na2CO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } },
    description: 'Ca(OH)₂ + Na₂CO₃ → CaCO₃↓ + 2NaOH',
  },
  {
    inputs: ['CaOH2', 'Na2SO4'],
    // CaSO₄ (гипс) малорастворим — выпадает осадок
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } },
    description: 'Ca(OH)₂ + Na₂SO₄ → CaSO₄↓ + 2NaOH',
  },
  {
    inputs: ['CaOH2', 'Na2SO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } },
    description: 'Ca(OH)₂ + Na₂SO₃ → CaSO₃↓ + 2NaOH',
  },
  {
    inputs: ['CaOH2', 'Na3PO4'],
    // Ca₃(PO₄)₂ — нерастворим, белый осадок
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } },
    description: '3Ca(OH)₂ + 2Na₃PO₄ → Ca₃(PO₄)₂↓ + 6NaOH',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ТВЁРДЫЕ ВЕЩЕСТВА — реакции с растворами и нагревание ──────────────────
  // ══════════════════════════════════════════════════════════════════════════════

  // ── Одиночные твёрдые вещества (нерастворимые — показываем как осадок) ─────
  { inputs: ['CuO'],    effects: { precipitate: { color: '#212121' } },             description: '' },
  { inputs: ['Fe2O3'],  effects: { precipitate: { color: '#BF360C' } },             description: '' },
  { inputs: ['Al2O3'],  effects: { precipitate: { color: '#B0BEC5' } },             description: '' },
  { inputs: ['ZnO'],    effects: { precipitate: { color: '#B0BEC5' } },             description: '' },
  { inputs: ['MnO2'],   effects: { precipitate: { color: '#37474F' } },             description: '' },
  { inputs: ['SiO2'],   effects: { precipitate: { color: '#B0BEC5' } },             description: '' },
  { inputs: ['CaCO3'],  effects: { precipitate: { color: '#C5D0DA' } },             description: '' },
  { inputs: ['S_s'],    effects: { precipitate: { color: '#FDD835' } },             description: '' },
  { inputs: ['C_s'],    effects: { precipitate: { color: '#424242' } },             description: '' },
  // CaO и Na₂O реагируют с водой (растворитель в пробирке):
  { inputs: ['CaO'],   effects: { liquidColor: 'rgba(220,240,220,0.10)' },          description: 'CaO + H₂O → Ca(OH)₂' },
  { inputs: ['Na2O'],  effects: { liquidColor: 'rgba(220,240,220,0.12)' },          description: 'Na₂O + H₂O → 2NaOH' },
  // P₂O₅ жадно поглощает воду → H₃PO₄:
  { inputs: ['P2O5'],  effects: { liquidColor: 'rgba(210,210,220,0.10)' },          description: 'P₂O₅ + 3H₂O → 2H₃PO₄' },

  // ══ ЖЕЛЕЗО (Fe) ════════════════════════════════════════════════════════════
  {
    inputs: ['Fe_s', 'HCl'],
    effects: { liquidColor: 'rgba(100,160,100,0.35)', gas: true },
    description: 'Fe + 2HCl → FeCl₂ + H₂↑',
  },
  {
    inputs: ['Fe_s', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(100,160,100,0.32)', gas: true },
    description: 'Fe + H₂SO₄(разб) → FeSO₄ + H₂↑',
  },
  {
    inputs: ['Fe_s', 'H2SO4_conc', 'heat'],
    effects: { liquidColor: 'rgba(141,110,99,0.45)', gas: true },
    description: '2Fe + 6H₂SO₄(конц, горяч) → Fe₂(SO₄)₃ + 3SO₂↑ + 6H₂O',
  },
  {
    inputs: ['Fe_s', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(141,110,99,0.50)', gas: true },
    description: 'Fe + 4HNO₃(разб) → Fe(NO₃)₃ + NO↑ + 2H₂O',
  },
  {
    inputs: ['Fe_s', 'CuSO4'],
    effects: { liquidColor: 'rgba(100,160,100,0.30)', precipitate: { color: '#B87333' } },
    description: 'Fe + CuSO₄ → FeSO₄ + Cu↓',
  },
  {
    inputs: ['Fe_s', 'AgNO3'],
    effects: { liquidColor: 'rgba(100,160,100,0.32)', precipitate: { color: '#C0C0C0' } },
    description: 'Fe + 2AgNO₃ → Fe(NO₃)₂ + 2Ag↓',
  },
  {
    // Избыток AgNO₃ — Fe окисляется до Fe³⁺
    inputs: ['Fe_s', 'AgNO3', 'AgNO3'],
    effects: { liquidColor: 'rgba(141,110,99,0.40)', precipitate: { color: '#C0C0C0' } },
    description: 'Fe + 3AgNO₃(избыток) → Fe(NO₃)₃ + 3Ag↓',
  },
  {
    inputs: ['Fe_s', 'FeCl3'],
    effects: { liquidColor: 'rgba(100,160,100,0.32)' },
    description: 'Fe + 2FeCl₃ → 3FeCl₂  (Fe восстанавливает Fe³⁺ → Fe²⁺)',
  },
  {
    inputs: ['Fe_s', 'Cl2'],
    effects: { liquidColor: 'rgba(141,110,99,0.55)' },
    description: '2Fe + 3Cl₂ → 2FeCl₃  (нагревание, Fe сгорает в Cl₂)',
  },
  // ══ МЕДЬ (Cu) ══════════════════════════════════════════════════════════════
  {
    inputs: ['Cu_s', 'H2SO4_conc', 'heat'],
    effects: { liquidColor: 'rgba(30,136,229,0.28)', gas: true },
    description: 'Cu + 2H₂SO₄(конц, горяч) → CuSO₄ + SO₂↑ + 2H₂O',
  },
  {
    inputs: ['Cu_s', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(30,136,229,0.35)', gas: true },
    description: '3Cu + 8HNO₃(разб) → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O',
  },
  {
    inputs: ['Cu_s', 'AgNO3'],
    effects: { liquidColor: 'rgba(30,136,229,0.28)', precipitate: { color: '#C0C0C0' } },
    description: 'Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag↓',
  },
  {
    inputs: ['Cu_s', 'FeCl3'],
    effects: { liquidColor: 'rgba(100,160,100,0.28)' },
    description: 'Cu + 2FeCl₃ → CuCl₂ + 2FeCl₂  (Cu растворяется в FeCl₃)',
  },
  {
    inputs: ['Cu_s', 'Cl2'],
    effects: { liquidColor: 'rgba(30,136,229,0.28)' },
    description: 'Cu + Cl₂ → CuCl₂',
  },

  // ══ ЦИНК (Zn) ══════════════════════════════════════════════════════════════
  {
    inputs: ['Zn_s', 'HCl'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'Zn + 2HCl → ZnCl₂ + H₂↑',
  },
  {
    inputs: ['Zn_s', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'Zn + H₂SO₄(разб) → ZnSO₄ + H₂↑',
  },
  {
    inputs: ['Zn_s', 'H2SO4_conc', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'Zn + 2H₂SO₄(конц) → ZnSO₄ + SO₂↑ + 2H₂O',
  },
  {
    inputs: ['Zn_s', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'Zn + 2NaOH + 2H₂O → Na₂[Zn(OH)₄] + H₂↑',
  },
  {
    inputs: ['Zn_s', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: '4Zn + 10HNO₃(разб) → 4Zn(NO₃)₂ + N₂O↑ + 5H₂O',
  },
  {
    inputs: ['Zn_s', 'CuSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B87333' } },
    description: 'Zn + CuSO₄ → ZnSO₄ + Cu↓',
  },
  {
    inputs: ['Zn_s', 'AgNO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C0C0C0' } },
    description: 'Zn + 2AgNO₃ → Zn(NO₃)₂ + 2Ag↓',
  },

  // ══ АЛЮМИНИЙ (Al) ══════════════════════════════════════════════════════════
  {
    inputs: ['Al_s', 'HCl'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: '2Al + 6HCl → 2AlCl₃ + 3H₂↑',
  },
  {
    inputs: ['Al_s', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: '2Al + 3H₂SO₄(разб) → Al₂(SO₄)₃ + 3H₂↑',
  },
  {
    inputs: ['Al_s', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: '2Al + 2NaOH + 6H₂O → 2Na[Al(OH)₄] + 3H₂↑  (амфотерность Al)',
  },
  {
    inputs: ['Al_s', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: '8Al + 30HNO₃(разб) → 8Al(NO₃)₃ + 3N₂O↑ + 15H₂O',
  },
  {
    inputs: ['Al_s', 'CuSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B87333' } },
    description: '2Al + 3CuSO₄ → Al₂(SO₄)₃ + 3Cu↓',
  },

  // ══ МАГНИЙ (Mg) ════════════════════════════════════════════════════════════
  {
    inputs: ['Mg_s', 'HCl'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'Mg + 2HCl → MgCl₂ + H₂↑',
  },
  {
    inputs: ['Mg_s', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'Mg + H₂SO₄(разб) → MgSO₄ + H₂↑',
  },
  {
    inputs: ['Mg_s', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: '4Mg + 10HNO₃(разб) → 4Mg(NO₃)₂ + N₂O↑ + 5H₂O',
  },
  {
    inputs: ['Mg_s', 'CuSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B87333' } },
    description: 'Mg + CuSO₄ → MgSO₄ + Cu↓',
  },

  // ══ CuO — оксид меди(II) ═══════════════════════════════════════════════════
  {
    inputs: ['CuO', 'HCl'],
    effects: { liquidColor: 'rgba(30,136,229,0.28)' },
    description: 'CuO + 2HCl → CuCl₂ + H₂O',
  },
  {
    inputs: ['CuO', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(30,136,229,0.28)' },
    description: 'CuO + H₂SO₄ → CuSO₄ + H₂O',
  },
  {
    inputs: ['CuO', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(30,136,229,0.28)' },
    description: 'CuO + 2HNO₃ → Cu(NO₃)₂ + H₂O',
  },
  {
    inputs: ['CuO', 'NH3', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#B87333' } },
    description: '3CuO + 2NH₃ → 3Cu↓ + N₂ + 3H₂O  (нагревание)',
  },
  // Нагревание осадка Cu(OH)₂ → CuO (чёрный)
  {
    inputs: ['CuSO4', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#212121' } },
    description: 'Cu(OH)₂ → CuO↓ + H₂O  (нагревание осадка гидроксида)',
  },

  // ══ Fe₂O₃ — оксид железа(III) ══════════════════════════════════════════════
  {
    inputs: ['Fe2O3', 'HCl'],
    effects: { liquidColor: 'rgba(141,110,99,0.48)' },
    description: 'Fe₂O₃ + 6HCl → 2FeCl₃ + 3H₂O',
  },
  {
    inputs: ['Fe2O3', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(141,110,99,0.40)' },
    description: 'Fe₂O₃ + 3H₂SO₄ → Fe₂(SO₄)₃ + 3H₂O',
  },
  {
    inputs: ['Fe2O3', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(141,110,99,0.40)' },
    description: 'Fe₂O₃ + 6HNO₃ → 2Fe(NO₃)₃ + 3H₂O',
  },
  // Нагревание осадка Fe(OH)₃ → Fe₂O₃
  {
    inputs: ['FeCl3', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#BF360C' } },
    description: '2Fe(OH)₃ → Fe₂O₃↓ + 3H₂O  (нагревание осадка)',
  },
  {
    inputs: ['Fe2O3', 'Na2CO3', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Fe₂O₃ + Na₂CO₃ → 2NaFeO₂ + CO₂↑  (сплавление)',
  },

  // ══ Al₂O₃ — оксид алюминия ══════════════════════════════════════════════════
  {
    inputs: ['Al2O3', 'HCl'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O',
  },
  {
    inputs: ['Al2O3', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'Al₂O₃ + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂O',
  },
  {
    inputs: ['Al2O3', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O  (амфотерность)',
  },
  {
    inputs: ['Al2O3', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'Al₂O₃ + 6HNO₃ → 2Al(NO₃)₃ + 3H₂O',
  },
  // Нагревание Al(OH)₃ → Al₂O₃
  {
    inputs: ['AlCl3', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#B0BEC5' } },
    description: '2Al(OH)₃ → Al₂O₃↓ + 3H₂O  (нагревание осадка)',
  },

  // ══ ZnO — оксид цинка ════════════════════════════════════════════════════════
  {
    inputs: ['ZnO', 'HCl'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'ZnO + 2HCl → ZnCl₂ + H₂O',
  },
  {
    inputs: ['ZnO', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'ZnO + H₂SO₄ → ZnSO₄ + H₂O',
  },
  {
    inputs: ['ZnO', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'ZnO + 2NaOH → Na₂ZnO₂ + H₂O  (амфотерность)',
  },
  {
    inputs: ['ZnO', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'ZnO + 2HNO₃ → Zn(NO₃)₂ + H₂O',
  },

  // ══ CaO — оксид кальция ══════════════════════════════════════════════════════
  {
    inputs: ['CaO', 'HCl'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'CaO + 2HCl → CaCl₂ + H₂O',
  },
  {
    inputs: ['CaO', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } },
    description: 'CaO + H₂SO₄ → CaSO₄↓ + H₂O',
  },
  {
    inputs: ['CaO', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'CaO + 2HNO₃ → Ca(NO₃)₂ + H₂O',
  },
  {
    inputs: ['CaO', 'CO2'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } },
    description: 'CaO + CO₂ → CaCO₃↓',
  },
  {
    inputs: ['CaO', 'SO2'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } },
    description: 'CaO + SO₂ → CaSO₃↓',
  },
  {
    inputs: ['CaO', 'SiO2', 'heat'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'CaO + SiO₂ → CaSiO₃  (сплавление)',
  },

  {
    inputs: ['CaO', 'Na2SiO3', 'heat'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'CaO + Na₂SiO₃ → CaSiO₃ + Na₂O  (сплавление)',
  },

  // ══ Na₂O — оксид натрия ══════════════════════════════════════════════════════
  {
    inputs: ['Na2O', 'HCl'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Na₂O + 2HCl → 2NaCl + H₂O',
  },
  {
    inputs: ['Na2O', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Na₂O + H₂SO₄ → Na₂SO₄ + H₂O',
  },
  {
    inputs: ['Na2O', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Na₂O + 2HNO₃ → 2NaNO₃ + H₂O',
  },
  {
    inputs: ['Na2O', 'CO2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Na₂O + CO₂ → Na₂CO₃',
  },
  {
    inputs: ['Na2O', 'SO2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'Na₂O + SO₂ → Na₂SO₃',
  },
  {
    // Na₂O реагирует с водой → NaOH, который осаждает ионы металлов
    inputs: ['Na2O', 'CuSO4'],
    effects: { liquidColor: 'rgba(129,212,250,0.22)', precipitate: { color: '#4FC3F7' } },
    description: 'Na₂O + H₂O → 2NaOH;  CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
  },
  {
    inputs: ['Na2O', 'FeCl3'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#BF360C' } },
    description: 'Na₂O + H₂O → 2NaOH;  FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',
  },
  {
    inputs: ['Na2O', 'AlCl3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } },
    description: 'Na₂O + H₂O → 2NaOH;  AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl',
  },

  // ══ MnO₂ — диоксид марганца ══════════════════════════════════════════════════
  {
    inputs: ['MnO2', 'HCl', 'heat'],
    effects: { liquidColor: 'rgba(185,215,55,0.25)', gas: true },
    description: 'MnO₂ + 4HCl(конц, горяч) → MnCl₂ + Cl₂↑ + 2H₂O  (Окислитель: Mn⁴⁺ → Mn²⁺)',
  },
  {
    // MnO₂ — катализатор разложения H₂O₂
    inputs: ['MnO2', 'H2O2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: '2H₂O₂ → 2H₂O + O₂↑  (MnO₂ — катализатор)',
  },
  {
    inputs: ['MnO2', 'H2SO4_conc', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: 'MnO₂ + 2H₂SO₄(конц, горяч) → MnSO₄ + SO₂↑ + 2H₂O',
  },
  // (Правило MnO2 + Na2CO3 + KNO3 + heat убрано — KNO₃ нет среди реагентов)

  // ══ SiO₂ — диоксид кремния ═══════════════════════════════════════════════════
  {
    inputs: ['SiO2', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'SiO₂ + 2NaOH → Na₂SiO₃ + H₂O  (нагревание — расплав или горячая конц)',
  },
  {
    inputs: ['SiO2', 'Na2CO3', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'SiO₂ + Na₂CO₃ → Na₂SiO₃ + CO₂↑  (сплавление)',
  },
  {
    inputs: ['SiO2', 'CaO', 'heat'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'SiO₂ + CaO → CaSiO₃  (сплавление)',
  },
  {
    inputs: ['SiO2', 'Na2O', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'SiO₂ + Na₂O → Na₂SiO₃  (сплавление)',
  },

  // ══ P₂O₅ — оксид фосфора(V) ══════════════════════════════════════════════════
  {
    inputs: ['P2O5', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)' },
    description: 'P₂O₅ + 6NaOH → 2Na₃PO₄ + 3H₂O',
  },
  {
    inputs: ['P2O5', 'CaOH2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } },
    description: '3Ca(OH)₂ + P₂O₅ → Ca₃(PO₄)₂↓ + 3H₂O',
  },
  {
    inputs: ['P2O5', 'Na2CO3', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: '3Na₂CO₃ + P₂O₅ → 2Na₃PO₄ + 3CO₂↑  (сплавление — более сильная кислота вытесняет слабую)',
  },
  {
    inputs: ['P2O5', 'CaO', 'heat'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: '3CaO + P₂O₅ → Ca₃(PO₄)₂  (сплавление)',
  },

  // ══ CaCO₃ — карбонат кальция (мел, мрамор) ════════════════════════════════
  {
    inputs: ['CaCO3', 'HCl'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',
  },
  {
    inputs: ['CaCO3', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' }, gas: true },
    description: 'CaCO₃ + H₂SO₄ → CaSO₄↓ + H₂O + CO₂↑  (реакция замедляется — CaSO₄ покрывает CaCO₃)',
  },
  {
    inputs: ['CaCO3', 'HNO3_dilut'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'CaCO₃ + 2HNO₃ → Ca(NO₃)₂ + H₂O + CO₂↑',
  },
  {
    // Разложение при прокаливании
    inputs: ['CaCO3', 'heat'],
    effects: { liquidColor: 'rgba(220,240,220,0.10)', gas: true },
    description: 'CaCO₃ → CaO + CO₂↑  (термическое разложение, >900°C)',
  },
  // ══ S — сера ═════════════════════════════════════════════════════════════════
  {
    inputs: ['S_s', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: '3S + 6NaOH(горяч, конц) → 2Na₂S + Na₂SO₃ + 3H₂O  (диспропорционирование)',
  },
  {
    inputs: ['S_s', 'H2SO4_conc', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: 'S + 2H₂SO₄(конц, горяч) → 3SO₂↑ + 2H₂O',
  },
  {
    inputs: ['S_s', 'Cl2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'S + Cl₂ → SCl₂  (возможна в анг. условиях; S₂Cl₂ — типичный продукт)',
  },
  {
    inputs: ['S_s', 'Fe_s', 'heat'],
    effects: { precipitate: { color: '#212121' } },
    description: 'S + Fe → FeS  (нагревание)',
  },

  // ══ C — углерод (кокс, уголь) ═════════════════════════════════════════════
  {
    inputs: ['C_s', 'H2SO4_conc', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: 'C + 2H₂SO₄(конц, горяч) → CO₂↑ + 2SO₂↑ + 2H₂O',
  },
  {
    inputs: ['C_s', 'HNO3_conc', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: 'C + 4HNO₃(конц, горяч) → CO₂↑ + 4NO₂↑ + 2H₂O',
  },

  // ══ Разложение при нагревании (только heat-правила без доп. реагентов) ═════
  {
    inputs: ['KMnO4', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#37474F' }, gas: true },
    description: '2KMnO₄ → K₂MnO₄ + MnO₂↓ + O₂↑  (нагревание)',
  },
  {
    inputs: ['NaHCO3', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: '2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑  (нагревание, ~50°C)',
  },
  {
    inputs: ['H2O2', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: '2H₂O₂ → 2H₂O + O₂↑  (нагревание или катализ)',
  },
  {
    // Fe(OH)₂ + O₂(воздух) при нагревании → Fe₂O₃ (бурый)
    inputs: ['FeCl2', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#BF360C' } },
    description: '4Fe(OH)₂ + O₂ → 2Fe₂O₃↓ + 4H₂O  (нагревание на воздухе)',
  },
  {
    inputs: ['FeSO4', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#BF360C' } },
    description: '4Fe(OH)₂ + O₂ → 2Fe₂O₃↓ + 4H₂O  (нагревание на воздухе)',
  },
  {
    inputs: ['NiSO4', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#1B5E20' } },
    description: 'Ni(OH)₂ → NiO + H₂O  (нагревание — тёмно-зелёный оксид)',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── КОНЦЕНТРИРОВАННАЯ H₂SO₄ — специфические реакции ──────────────────────
  // ══════════════════════════════════════════════════════════════════════════════

  // Пассивация Fe и Al конц. H₂SO₄ (на холоду — плёнка оксида блокирует реакцию)
  {
    inputs: ['Fe_s', 'H2SO4_conc'],
    effects: {},
    description: 'Fe + H₂SO₄(конц, хол.) — пассивация  (плёнка Fe₂O₃ предотвращает растворение)',
  },
  {
    inputs: ['Al_s', 'H2SO4_conc'],
    effects: {},
    description: 'Al + H₂SO₄(конц, хол.) — пассивация  (плёнка Al₂O₃ предотвращает растворение)',
  },
  // Zn с конц. H₂SO₄ даёт SO₂ (без нагревания):
  {
    inputs: ['Zn_s', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'Zn + 2H₂SO₄(конц) → ZnSO₄ + SO₂↑ + 2H₂O',
  },
  // Al с конц. H₂SO₄ и нагреванием (пассивация снимается):
  {
    inputs: ['Al_s', 'H2SO4_conc', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: '2Al + 6H₂SO₄(конц, горяч) → Al₂(SO₄)₃ + 3SO₂↑ + 6H₂O',
  },
  // Cu + конц. H₂SO₄ без нагрева — не реагирует:
  {
    inputs: ['Cu_s', 'H2SO4_conc'],
    effects: {},
    description: 'Cu + H₂SO₄(конц, хол.) — реакция не идёт (необходимо нагревание)',
  },
  // (Правило ['Cu_s', 'H2SO4_conc', 'heat'] → CuSO4 + SO2 уже добавлено выше)
  // Mg + конц. H₂SO₄:
  {
    inputs: ['Mg_s', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'Mg + 2H₂SO₄(конц) → MgSO₄ + SO₂↑ + 2H₂O  (Mg реагирует с конц H₂SO₄)',
  },

  // ── H₂SO₄(конц) в тех же реакциях, что и разбавленная (нейтрализация, осаждение) ──
  { inputs: ['Na2CO3', 'H2SO4_conc'],   effects: { gas: true },                                       description: 'Na₂CO₃ + H₂SO₄ → Na₂SO₄ + H₂O + CO₂↑' },
  { inputs: ['NaHCO3', 'H2SO4_conc'],  effects: { gas: true },                                       description: 'NaHCO₃ + H₂SO₄ → NaHSO₄ + H₂O + CO₂↑' },
  { inputs: ['BaCl2', 'H2SO4_conc'],   effects: { precipitate: { color: '#C5D0DA' } },               description: 'BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl' },
  {
    inputs: ['Na2S', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#FDD835' }, gas: true },
    description: 'Na₂S + 2H₂SO₄(конц) → S↓ + SO₂↑ + Na₂SO₄ + 2H₂O  (конц. H₂SO₄ окисляет S²⁻, H₂S не выделяется)',
  },
  { inputs: ['Na2SiO3', 'H2SO4_conc'], effects: { precipitate: { color: '#B0BEC5' } },               description: 'Na₂SiO₃ + H₂SO₄ → H₂SiO₃↓ + Na₂SO₄' },
  { inputs: ['Na2SO3', 'H2SO4_conc'],  effects: { gas: true },                                       description: 'Na₂SO₃ + H₂SO₄ → Na₂SO₄ + H₂O + SO₂↑' },
  { inputs: ['PbNO32', 'H2SO4_conc'],  effects: { precipitate: { color: '#C5D0DA' } },               description: 'Pb(NO₃)₂ + H₂SO₄ → PbSO₄↓ + 2HNO₃' },
  { inputs: ['CaOH2', 'H2SO4_conc'],   effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'Ca(OH)₂ + H₂SO₄ → CaSO₄↓ + 2H₂O' },
  { inputs: ['CuO', 'H2SO4_conc'],     effects: { liquidColor: 'rgba(30,136,229,0.28)' },            description: 'CuO + H₂SO₄ → CuSO₄ + H₂O' },
  { inputs: ['Fe2O3', 'H2SO4_conc'],   effects: { liquidColor: 'rgba(141,110,99,0.40)' },            description: 'Fe₂O₃ + 3H₂SO₄ → Fe₂(SO₄)₃ + 3H₂O' },
  { inputs: ['Al2O3', 'H2SO4_conc'],   effects: { liquidColor: 'rgba(200,200,200,0.08)' },           description: 'Al₂O₃ + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂O' },
  { inputs: ['ZnO', 'H2SO4_conc'],     effects: { liquidColor: 'rgba(200,200,200,0.08)' },           description: 'ZnO + H₂SO₄ → ZnSO₄ + H₂O' },
  { inputs: ['CaO', 'H2SO4_conc'],     effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'CaO + H₂SO₄ → CaSO₄↓ + H₂O' },
  { inputs: ['CaCO3', 'H2SO4_conc'],   effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' }, gas: true }, description: 'CaCO₃ + H₂SO₄ → CaSO₄↓ + H₂O + CO₂↑' },
  { inputs: ['Na3PO4', 'H2SO4_conc'],  effects: {},                                                  description: 'Na₃PO₄ + H₂SO₄ → Na₂HPO₄ + Na₂SO₄' },
  // OX реакции в H₂SO₄(конц) — среда та же, что и в разбавленной:
  {
    inputs: ['Na2SO3', 'KMnO4', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(180,160,80,0.18)' },
    description: '5Na₂SO₃ + 2KMnO₄ + 3H₂SO₄ → 5Na₂SO₄ + 2MnSO₄ + K₂SO₄ + 3H₂O',
  },
  {
    inputs: ['Na2SO3', 'K2Cr2O7', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(60,120,60,0.52)' },
    description: 'K₂Cr₂O₇ + 3Na₂SO₃ + 4H₂SO₄ → Cr₂(SO₄)₃ + 3Na₂SO₄ + K₂SO₄ + 4H₂O',
  },
  {
    inputs: ['KMnO4', 'KI', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(100,50,0,0.80)' },
    description: '2KMnO₄ + 10KI + 8H₂SO₄ → 6K₂SO₄ + 2MnSO₄ + 5I₂ + 8H₂O',
  },
  {
    inputs: ['H2O2', 'KMnO4', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: '2KMnO₄ + 5H₂O₂ + 3H₂SO₄ → 2MnSO₄ + K₂SO₄ + 5O₂↑ + 8H₂O',
  },
  {
    inputs: ['SO2', 'K2Cr2O7', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(60,120,60,0.52)' },
    description: 'K₂Cr₂O₇ + 3SO₂ + H₂SO₄ → K₂SO₄ + Cr₂(SO₄)₃ + H₂O',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── КОНЦЕНТРИРОВАННАЯ HNO₃ — специфические реакции ────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════

  // Пассивация Fe и Al конц. HNO₃:
  {
    inputs: ['Fe_s', 'HNO3_conc'],
    effects: {},
    description: 'Fe + HNO₃(конц, хол.) — пассивация  (плёнка Fe₂O₃ защищает металл)',
  },
  {
    inputs: ['Al_s', 'HNO3_conc'],
    effects: {},
    description: 'Al + HNO₃(конц, хол.) — пассивация  (плёнка Al₂O₃ защищает металл)',
  },
  // Cu + HNO₃(конц) → NO₂ (не NO как при разбавленной):
  {
    inputs: ['Cu_s', 'HNO3_conc'],
    effects: { liquidColor: 'rgba(30,136,229,0.35)', gas: true },
    description: 'Cu + 4HNO₃(конц) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O  (конц → NO₂, разб → NO)',
  },
  // Zn + HNO₃(конц) → NO₂:
  {
    inputs: ['Zn_s', 'HNO3_conc'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'Zn + 4HNO₃(конц) → Zn(NO₃)₂ + 2NO₂↑ + 2H₂O',
  },
  // Mg + HNO₃(конц) → NO₂:
  {
    inputs: ['Mg_s', 'HNO3_conc'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true },
    description: 'Mg + 4HNO₃(конц) → Mg(NO₃)₂ + 2NO₂↑ + 2H₂O',
  },
  // S + HNO₃(конц, горяч) → H₂SO₄ + NO₂:
  {
    inputs: ['S_s', 'HNO3_conc', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: 'S + 6HNO₃(конц, горяч) → H₂SO₄ + 6NO₂↑ + 2H₂O',
  },
  // Fe + HNO₃(конц, горяч) — пассивация снимается, реакция идёт:
  {
    inputs: ['Fe_s', 'HNO3_conc', 'heat'],
    effects: { liquidColor: 'rgba(141,110,99,0.48)', gas: true },
    description: 'Fe + 4HNO₃(конц, горяч) → Fe(NO₃)₃ + NO₂↑ + 2H₂O  (при нагреве пассивация снимается)',
  },
  // ── HNO₃(конц) в реакциях, где результат совпадает с разбавленной ──────────
  { inputs: ['NaOH', 'HNO3_conc'],      effects: { liquidColor: 'rgba(200,200,200,0.05)' },          description: 'HNO₃ + NaOH → NaNO₃ + H₂O' },
  { inputs: ['Na2CO3', 'HNO3_conc'],    effects: { gas: true },                                       description: 'Na₂CO₃ + 2HNO₃ → 2NaNO₃ + H₂O + CO₂↑' },
  { inputs: ['NaHCO3', 'HNO3_conc'],   effects: { gas: true },                                       description: 'NaHCO₃ + HNO₃ → NaNO₃ + H₂O + CO₂↑' },
  { inputs: ['CaOH2', 'HNO3_conc'],    effects: { liquidColor: 'rgba(200,200,200,0.05)' },           description: 'Ca(OH)₂ + 2HNO₃ → Ca(NO₃)₂ + 2H₂O' },
  { inputs: ['Na2SiO3', 'HNO3_conc'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } }, description: 'Na₂SiO₃ + 2HNO₃ → H₂SiO₃↓ + 2NaNO₃' },
  { inputs: ['Na2SO3', 'HNO3_conc'],   effects: { gas: true },                                       description: 'Na₂SO₃ + 2HNO₃ → 2NaNO₃ + SO₂↑ + H₂O' },
  { inputs: ['CuO', 'HNO3_conc'],      effects: { liquidColor: 'rgba(30,136,229,0.28)' },            description: 'CuO + 2HNO₃ → Cu(NO₃)₂ + H₂O' },
  { inputs: ['Fe2O3', 'HNO3_conc'],    effects: { liquidColor: 'rgba(141,110,99,0.40)' },            description: 'Fe₂O₃ + 6HNO₃ → 2Fe(NO₃)₃ + 3H₂O' },
  { inputs: ['Al2O3', 'HNO3_conc'],    effects: { liquidColor: 'rgba(200,200,200,0.08)' },           description: 'Al₂O₃ + 6HNO₃ → 2Al(NO₃)₃ + 3H₂O' },
  { inputs: ['ZnO', 'HNO3_conc'],      effects: { liquidColor: 'rgba(200,200,200,0.08)' },           description: 'ZnO + 2HNO₃ → Zn(NO₃)₂ + H₂O' },
  { inputs: ['CaO', 'HNO3_conc'],      effects: { liquidColor: 'rgba(200,200,200,0.08)' },           description: 'CaO + 2HNO₃ → Ca(NO₃)₂ + H₂O' },
  { inputs: ['Na2O', 'HNO3_conc'],     effects: { liquidColor: 'rgba(200,200,200,0.05)' },           description: 'Na₂O + 2HNO₃ → 2NaNO₃ + H₂O' },
  { inputs: ['CaCO3', 'HNO3_conc'],    effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true }, description: 'CaCO₃ + 2HNO₃ → Ca(NO₃)₂ + H₂O + CO₂↑' },
  { inputs: ['Na3PO4', 'HNO3_conc'],   effects: {},                                                   description: 'Na₃PO₄ + 3HNO₃ → H₃PO₄ + 3NaNO₃' },
  // FeCl₂ и FeSO₄ с конц HNO₃ — окисление Fe²⁺ → Fe³⁺ + NO₂:
  {
    inputs: ['FeCl2', 'HNO3_conc'],
    effects: { liquidColor: 'rgba(150,100,20,0.52)', gas: true },
    description: '3Fe²⁺ + 4H⁺ + NO₃⁻ → 3Fe³⁺ + NO↑ + 2H₂O  (при конц — NO₂↑, логика та же)',
  },
  {
    inputs: ['FeSO4', 'HNO3_conc'],
    effects: { liquidColor: 'rgba(150,100,20,0.52)', gas: true },
    description: '3Fe²⁺ + 4H⁺ + NO₃⁻ → 3Fe³⁺ + NO₂↑ + 2H₂O  (конц HNO₃)',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ДОПОЛНИТЕЛЬНЫЕ РЕАКЦИИ — пробелы, выявленные при проверке ─────────────
  // ══════════════════════════════════════════════════════════════════════════════

  // ── KMnO₄ как окислитель с Fe²⁺ (классика ЕГЭ) ──────────────────────────
  {
    inputs: ['KMnO4', 'FeSO4', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(150,100,20,0.45)' },
    description: '10FeSO₄ + 2KMnO₄ + 8H₂SO₄ → 5Fe₂(SO₄)₃ + 2MnSO₄ + K₂SO₄ + 8H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['KMnO4', 'FeCl2', 'HCl'],
    effects: { liquidColor: 'rgba(150,100,20,0.45)' },
    description: '10FeCl₂ + 2KMnO₄ + 16HCl → 10FeCl₃ + 2MnCl₂ + 2KCl + 8H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['KMnO4', 'FeSO4', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(150,100,20,0.45)' },
    description: '10FeSO₄ + 2KMnO₄ + 8H₂SO₄ → 5Fe₂(SO₄)₃ + 2MnSO₄ + K₂SO₄ + 8H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['KMnO4', 'FeCl2', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(150,100,20,0.45)' },
    description: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺, Восстановитель: Fe²⁺ → Fe³⁺)',
  },

  // ── K₂Cr₂O₇ как окислитель ───────────────────────────────────────────────
  {
    inputs: ['K2Cr2O7', 'KI', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(80,50,0,0.72)' },
    description: 'K₂Cr₂O₇ + 6KI + 7H₂SO₄ → Cr₂(SO₄)₃ + 3I₂ + 4K₂SO₄ + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: I⁻ → I₂)',
  },
  {
    inputs: ['K2Cr2O7', 'KI', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(80,50,0,0.72)' },
    description: 'K₂Cr₂O₇ + 6KI + 7H₂SO₄ → Cr₂(SO₄)₃ + 3I₂ + 4K₂SO₄ + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: I⁻ → I₂)',
  },
  {
    inputs: ['K2Cr2O7', 'Na2S', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(60,120,60,0.40)', precipitate: { color: '#F9A825' } },
    description: 'K₂Cr₂O₇ + 3Na₂S + 7H₂SO₄ → Cr₂(SO₄)₃ + 3S↓ + 3Na₂SO₄ + K₂SO₄ + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: S²⁻ → S⁰)',
  },
  {
    inputs: ['K2Cr2O7', 'HCl'],
    effects: { liquidColor: 'rgba(60,120,60,0.55)', gas: true },
    description: 'K₂Cr₂O₇ + 14HCl → 2KCl + 2CrCl₃ + 3Cl₂↑ + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: Cl⁻ → Cl₂)',
  },
  {
    inputs: ['K2Cr2O7', 'FeCl2', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(100,90,22,0.55)' },
    description: 'K₂Cr₂O₇ + 6FeCl₂ + 14H₂SO₄ → 2CrCl₃ + 6FeCl₃ + K₂SO₄ + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['K2Cr2O7', 'FeSO4', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(100,90,22,0.55)' },
    description: 'K₂Cr₂O₇ + 6FeSO₄ + 7H₂SO₄ → Cr₂(SO₄)₃ + 3Fe₂(SO₄)₃ + K₂SO₄ + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: Fe²⁺ → Fe³⁺)',
  },

  // ── FeCl₃ + Na₂SO₃ (ОВР: Fe³⁺ → Fe²⁺) ──────────────────────────────────
  {
    inputs: ['FeCl3', 'Na2SO3'],
    effects: { liquidColor: 'rgba(100,160,100,0.30)' },
    description: '2FeCl₃ + Na₂SO₃ + H₂O → 2FeCl₂ + Na₂SO₄ + 2HCl  (Окислитель: Fe³⁺ → Fe²⁺, Восстановитель: S⁴⁺ → S⁶⁺)',
  },

  // ── NH₃ осаждает гидроксиды ────────────────────────────────────────────────
  {
    inputs: ['AlCl3', 'NH3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#B0BEC5' } },
    description: 'AlCl₃ + 3NH₃ + 3H₂O → Al(OH)₃↓ + 3NH₄Cl',
  },
  {
    inputs: ['FeCl3', 'NH3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#BF360C' } },
    description: 'FeCl₃ + 3NH₃ + 3H₂O → Fe(OH)₃↓ + 3NH₄Cl',
  },
  {
    inputs: ['FeCl2', 'NH3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#78909C' } },
    description: 'FeCl₂ + 2NH₃ + 2H₂O → Fe(OH)₂↓ + 2NH₄Cl',
  },
  {
    inputs: ['FeSO4', 'NH3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#78909C' } },
    description: 'FeSO₄ + 2NH₃ + 2H₂O → Fe(OH)₂↓ + (NH₄)₂SO₄',
  },
  {
    inputs: ['CoCl2', 'NH3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#80DEEA' } },
    description: 'CoCl₂ + 2NH₃ + 2H₂O → Co(OH)₂↓ + 2NH₄Cl',
  },

  // ── AlCl₃ + NaHCO₃ (двойной гидролиз) ────────────────────────────────────
  {
    inputs: ['AlCl3', 'NaHCO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#B0BEC5' }, gas: true },
    description: 'AlCl₃ + 3NaHCO₃ → Al(OH)₃↓ + 3NaCl + 3CO₂↑  (двойной гидролиз)',
  },

  // ── Fe²⁺ + Na₂CO₃ → FeCO₃↓ ───────────────────────────────────────────────
  {
    inputs: ['FeCl2', 'Na2CO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } },
    description: 'FeCl₂ + Na₂CO₃ → FeCO₃↓ + 2NaCl  (белый осадок сидерита)',
  },
  {
    inputs: ['FeSO4', 'Na2CO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } },
    description: 'FeSO₄ + Na₂CO₃ → FeCO₃↓ + Na₂SO₄  (белый осадок сидерита)',
  },

  // ── Pb²⁺ + Na₂CO₃ → PbCO₃↓ ───────────────────────────────────────────────
  {
    inputs: ['PbNO32', 'Na2CO3'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'Pb(NO₃)₂ + Na₂CO₃ → PbCO₃↓ + 2NaNO₃',
  },

  // ── AgNO₃ + Cl⁻ (из CaCl₂, BaCl₂) → AgCl↓ ─────────────────────────────
  {
    inputs: ['AgNO3', 'CaCl2'],
    effects: { precipitate: { color: '#B0BEC5' } },
    description: '2AgNO₃ + CaCl₂ → 2AgCl↓ + Ca(NO₃)₂',
  },
  {
    inputs: ['AgNO3', 'BaCl2'],
    effects: { precipitate: { color: '#B0BEC5' } },
    description: '2AgNO₃ + BaCl₂ → 2AgCl↓ + Ba(NO₃)₂',
  },
  {
    inputs: ['AgNO3', 'Na2SO4'],
    effects: { precipitate: { color: '#FFF9C4' } },
    description: '2AgNO₃ + Na₂SO₄ → Ag₂SO₄↓ + 2NaNO₃  (светло-жёлтый осадок)',
  },

  // ── Ca²⁺ + SO₄²⁻ → CaSO₄↓ ────────────────────────────────────────────────
  {
    inputs: ['CaCl2', 'Na2SO4'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'CaCl₂ + Na₂SO₄ → CaSO₄↓ + 2NaCl',
  },
  {
    inputs: ['CaCl2', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } },
    description: 'CaCl₂ + 2NaOH → Ca(OH)₂↓ + 2NaCl',
  },

  // ── Na₂SiO₃ + Ca²⁺/Ba²⁺ → осадок силиката ────────────────────────────────
  {
    inputs: ['Na2SiO3', 'CaCl2'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'Na₂SiO₃ + CaCl₂ → CaSiO₃↓ + 2NaCl',
  },
  {
    inputs: ['Na2SiO3', 'BaCl2'],
    effects: { precipitate: { color: '#C5D0DA' } },
    description: 'Na₂SiO₃ + BaCl₂ → BaSiO₃↓ + 2NaCl',
  },

  // ── Na₃PO₄ + другие металлы → нерастворимые фосфаты ─────────────────────
  {
    inputs: ['Na3PO4', 'CuSO4'],
    effects: { liquidColor: 'rgba(129,212,250,0.15)', precipitate: { color: '#90CAF9' } },
    description: '3CuSO₄ + 2Na₃PO₄ → Cu₃(PO₄)₂↓ + 3Na₂SO₄  (светло-голубой осадок)',
  },
  {
    inputs: ['Na3PO4', 'FeSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' } },
    description: '3FeSO₄ + 2Na₃PO₄ → Fe₃(PO₄)₂↓ + 3Na₂SO₄',
  },
  {
    inputs: ['Na3PO4', 'ZnSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } },
    description: '3ZnSO₄ + 2Na₃PO₄ → Zn₃(PO₄)₂↓ + 3Na₂SO₄',
  },
  {
    inputs: ['Na3PO4', 'NiSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#A5D6A7' } },
    description: '3NiSO₄ + 2Na₃PO₄ → Ni₃(PO₄)₂↓ + 3Na₂SO₄  (светло-зелёный осадок)',
  },
  {
    inputs: ['Na3PO4', 'PbNO32'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } },
    description: '3Pb(NO₃)₂ + 2Na₃PO₄ → Pb₃(PO₄)₂↓ + 6NaNO₃',
  },

  // ── SO₂ + Na₂S → S↓ ──────────────────────────────────────────────────────
  {
    inputs: ['SO2', 'Na2S'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#FDD835' } },
    description: '2Na₂S + 3SO₂ → 2Na₂SO₃ + 3S↓  (сопропорционирование: S⁴⁺ + S²⁻ → S⁰)',
  },

  // ══ Вытеснение металлов (Mg, Al, Zn → Fe, Zn, Ag) ══════════════════════
  {
    inputs: ['Mg_s', 'AgNO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C0C0C0' } },
    description: 'Mg + 2AgNO₃ → Mg(NO₃)₂ + 2Ag↓',
  },
  {
    inputs: ['Al_s', 'AgNO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C0C0C0' } },
    description: 'Al + 3AgNO₃ → Al(NO₃)₃ + 3Ag↓',
  },
  {
    // Mg вытесняет Fe из раствора соли
    inputs: ['Mg_s', 'FeSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#546E7A' } },
    description: 'Mg + FeSO₄ → MgSO₄ + Fe↓',
  },
  {
    inputs: ['Mg_s', 'FeCl2'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#546E7A' } },
    description: 'Mg + FeCl₂ → MgCl₂ + Fe↓',
  },
  {
    inputs: ['Mg_s', 'ZnSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0C4BE' } },
    description: 'Mg + ZnSO₄ → MgSO₄ + Zn↓',
  },
  {
    inputs: ['Zn_s', 'FeSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#546E7A' } },
    description: 'Zn + FeSO₄ → ZnSO₄ + Fe↓',
  },
  {
    inputs: ['Zn_s', 'FeCl2'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#546E7A' } },
    description: 'Zn + FeCl₂ → ZnCl₂ + Fe↓',
  },
  {
    inputs: ['Al_s', 'FeSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#546E7A' } },
    description: '2Al + 3FeSO₄ → Al₂(SO₄)₃ + 3Fe↓',
  },
  {
    inputs: ['Al_s', 'FeCl2'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#546E7A' } },
    description: '2Al + 3FeCl₂ → 2AlCl₃ + 3Fe↓',
  },
  {
    inputs: ['Al_s', 'ZnSO4'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0C4BE' } },
    description: '2Al + 3ZnSO₄ → Al₂(SO₄)₃ + 3Zn↓',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── KMnO₄ в ЩЕЛОЧНОЙ среде → манганат K₂MnO₄ (тёмно-зелёный) ─────────────
  //    Третья среда перманганата — обязательна для ЕГЭ (задание 30)
  // ══════════════════════════════════════════════════════════════════════════════
  {
    inputs: ['KMnO4', 'Na2SO3', 'NaOH'],
    effects: { liquidColor: 'rgba(0,150,70,0.60)' },
    description: '2KMnO₄ + Na₂SO₃ + 2NaOH → K₂MnO₄ + Na₂MnO₄ + Na₂SO₄ + H₂O  (щелочная среда: Mn⁷⁺ → Mn⁶⁺, зелёный манганат)',
  },
  {
    inputs: ['KMnO4', 'KI', 'NaOH'],
    effects: { liquidColor: 'rgba(0,150,70,0.60)' },
    description: '6KMnO₄ + KI + 6NaOH → 3K₂MnO₄ + 3Na₂MnO₄ + KIO₃ + 3H₂O  (щелочная среда: Mn⁷⁺ → Mn⁶⁺, зелёный манганат)',
  },
  {
    inputs: ['KMnO4', 'Na2S', 'NaOH'],
    effects: { liquidColor: 'rgba(0,150,70,0.60)', precipitate: { color: '#FDD835' } },
    description: '2KMnO₄ + Na₂S + 2NaOH → 2Na₂MnO₄ + S↓ + 2KOH  (щелочная среда: Mn⁷⁺ → Mn⁶⁺)',
  },
  {
    inputs: ['KMnO4', 'H2O2', 'NaOH'],
    effects: { liquidColor: 'rgba(0,150,70,0.60)', gas: true },
    description: '2KMnO₄ + H₂O₂ + 2NaOH → K₂MnO₄ + Na₂MnO₄ + O₂↑ + 2H₂O  (щелочная среда: Mn⁷⁺ → Mn⁶⁺)',
  },
  {
    inputs: ['KMnO4', 'FeSO4', 'NaOH'],
    effects: { liquidColor: 'rgba(0,150,70,0.50)', precipitate: { color: '#BF360C' } },
    description: 'KMnO₄ + FeSO₄ + 4NaOH → Na₂MnO₄ + Fe(OH)₃↓ + Na₂SO₄ + KOH  (щелочная среда: Mn⁷⁺ → Mn⁶⁺, Fe²⁺ → Fe³⁺)',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Окисление Cr³⁺ → CrO₄²⁻ галогенами в щелочной среде ──────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    inputs: ['CrCl3', 'Cl2', 'NaOH'],
    effects: { liquidColor: 'rgba(255,210,0,0.72)' },
    description: '2CrCl₃ + 3Cl₂ + 16NaOH → 2Na₂CrO₄ + 12NaCl + 8H₂O  (Окислитель: Cl₂ → 2Cl⁻, Восстановитель: Cr³⁺ → Cr⁶⁺)',
  },
  {
    inputs: ['CrCl3', 'Br2', 'NaOH'],
    effects: { liquidColor: 'rgba(255,210,0,0.72)' },
    description: '2CrCl₃ + 3Br₂ + 16NaOH → 2Na₂CrO₄ + 6NaBr + 6NaCl + 8H₂O  (Окислитель: Br₂ → 2Br⁻, Восстановитель: Cr³⁺ → Cr⁶⁺)',
  },
  {
    inputs: ['CrCl3', 'H2O2', 'NaOH', 'NaOH'],
    effects: { liquidColor: 'rgba(255,210,0,0.72)' },
    description: '2Na[Cr(OH)₄] + 3H₂O₂ + 2NaOH → 2Na₂CrO₄ + 8H₂O  (избыток щёлочи: Cr³⁺ → Cr⁶⁺)',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Диспропорционирование галогенов в ГОРЯЧЕЙ щёлочи → галогенат ─────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    inputs: ['Cl2', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: '3Cl₂ + 6NaOH(горяч) → 5NaCl + NaClO₃ + 3H₂O  (горячая щёлочь → хлорат, холодная → гипохлорит)',
  },
  {
    inputs: ['Br2', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: '3Br₂ + 6NaOH(горяч) → 5NaBr + NaBrO₃ + 3H₂O  (горячая щёлочь → бромат)',
  },
  {
    inputs: ['I2', 'NaOH', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: '3I₂ + 6NaOH(горяч) → 5NaI + NaIO₃ + 3H₂O  (горячая щёлочь → йодат)',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── SO₂ как восстановитель (обесцвечивание галогенной воды) ──────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    inputs: ['SO2', 'Cl2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'SO₂ + Cl₂ + 2H₂O → H₂SO₄ + 2HCl  (Окислитель: Cl₂ → 2Cl⁻, Восстановитель: S⁴⁺ → S⁶⁺; хлорная вода обесцвечивается)',
  },
  {
    inputs: ['SO2', 'Br2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'SO₂ + Br₂ + 2H₂O → H₂SO₄ + 2HBr  (Окислитель: Br₂ → 2Br⁻, Восстановитель: S⁴⁺ → S⁶⁺; бромная вода обесцвечивается)',
  },
  {
    inputs: ['SO2', 'I2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'SO₂ + I₂ + 2H₂O → H₂SO₄ + 2HI  (Окислитель: I₂ → 2I⁻, Восстановитель: S⁴⁺ → S⁶⁺)',
  },
  {
    inputs: ['SO2', 'H2O2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'SO₂ + H₂O₂ → H₂SO₄  (Окислитель: O⁻¹ → O²⁻, Восстановитель: S⁴⁺ → S⁶⁺)',
  },
  {
    inputs: ['SO2', 'FeCl3'],
    effects: { liquidColor: 'rgba(100,160,100,0.30)' },
    description: '2FeCl₃ + SO₂ + 2H₂O → 2FeCl₂ + H₂SO₄ + 2HCl  (Окислитель: Fe³⁺ → Fe²⁺, Восстановитель: S⁴⁺ → S⁶⁺)',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Концентрированная H₂SO₄ как окислитель галогенидов ───────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    inputs: ['KI', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(110,45,0,0.72)', gas: true },
    description: '8KI + 5H₂SO₄(конц) → 4I₂ + H₂S↑ + 4K₂SO₄ + 4H₂O  (Окислитель: S⁶⁺ → S²⁻, Восстановитель: I⁻ → I₂)',
  },

  // ── K₂Cr₂O₇ + H₂O₂ в кислой среде (H₂O₂ как восстановитель) ────────────
  {
    inputs: ['K2Cr2O7', 'H2O2', 'H2SO4_dilut'],
    effects: { liquidColor: 'rgba(60,120,60,0.52)', gas: true },
    description: 'K₂Cr₂O₇ + 3H₂O₂ + 4H₂SO₄ → Cr₂(SO₄)₃ + 3O₂↑ + K₂SO₄ + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: O⁻¹ → O₂)',
  },
  {
    inputs: ['K2Cr2O7', 'H2O2', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(60,120,60,0.52)', gas: true },
    description: 'K₂Cr₂O₇ + 3H₂O₂ + 4H₂SO₄ → Cr₂(SO₄)₃ + 3O₂↑ + K₂SO₄ + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: O⁻¹ → O₂)',
  },
  {
    inputs: ['K2Cr2O7', 'Na2S', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(60,120,60,0.40)', precipitate: { color: '#F9A825' } },
    description: 'K₂Cr₂O₇ + 3Na₂S + 7H₂SO₄ → Cr₂(SO₄)₃ + 3S↓ + 3Na₂SO₄ + K₂SO₄ + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: S²⁻ → S⁰)',
  },
  {
    inputs: ['K2Cr2O7', 'FeSO4', 'H2SO4_conc'],
    effects: { liquidColor: 'rgba(100,90,22,0.55)' },
    description: 'K₂Cr₂O₇ + 6FeSO₄ + 7H₂SO₄ → Cr₂(SO₄)₃ + 3Fe₂(SO₄)₃ + K₂SO₄ + 7H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺, Восстановитель: Fe²⁺ → Fe³⁺)',
  },

  // ── Металлы, НЕ вытесняющие водород из кислот (справочно) ─────────────────
  {
    inputs: ['Cu_s', 'HCl'],
    effects: {},
    description: 'Cu + HCl — реакция не идёт  (Cu стоит после H в ряду активности)',
  },
  {
    inputs: ['Cu_s', 'H2SO4_dilut'],
    effects: {},
    description: 'Cu + H₂SO₄(разб) — реакция не идёт  (Cu стоит после H в ряду активности)',
  },
]

// Считает количество вхождений каждого элемента (для поддержки дублирующих реагентов)
function countOccurrences(arr: string[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const s of arr) m.set(s, (m.get(s) ?? 0) + 1)
  return m
}

// Правило срабатывает, если contents содержит каждый реагент не менее нужного числа раз
function ruleMatches(ruleInputs: string[], contents: string[]): boolean {
  const required = countOccurrences(ruleInputs)
  const available = countOccurrences(contents)
  for (const [id, cnt] of required) {
    if ((available.get(id) ?? 0) < cnt) return false
  }
  return true
}

// Правило A вытесняется правилом B, если B требует строго больше реагентов (мультисет-надмножество)
function isSubsumed(rule: ReactionRule, others: ReactionRule[]): boolean {
  const ruleReq = countOccurrences(rule.inputs)
  return others.some((other) => {
    if (other === rule) return false
    if (other.inputs.length <= rule.inputs.length) return false
    const otherReq = countOccurrences(other.inputs)
    for (const [id, cnt] of ruleReq) {
      if ((otherReq.get(id) ?? 0) < cnt) return false
    }
    return true
  })
}

function parseRgba(color: string): [number, number, number, number] | null {
  const m = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/)
  if (!m) return null
  return [+m[1], +m[2], +m[3], m[4] !== undefined ? +m[4] : 1]
}

function blendColors(colors: string[]): string {
  const parsed = colors.map(parseRgba).filter((c): c is [number, number, number, number] => c !== null)
  if (parsed.length === 0) return colors[0]
  if (parsed.length === 1) return colors[0]
  const n = parsed.length
  const r = Math.round(parsed.reduce((s, c) => s + c[0], 0) / n)
  const g = Math.round(parsed.reduce((s, c) => s + c[1], 0) / n)
  const b = Math.round(parsed.reduce((s, c) => s + c[2], 0) / n)
  // Слегка поднимаем непрозрачность смеси — смешанный раствор насыщеннее
  const a = Math.min(1, (parsed.reduce((s, c) => s + c[3], 0) / n) * 1.2)
  return `rgba(${r},${g},${b},${a.toFixed(2)})`
}

export function matchReactions(contents: string[]): ReactionEffects {
  const matched = REACTION_TABLE.filter((r) => ruleMatches(r.inputs, contents))
  const maximal = matched.filter((r) => !isSubsumed(r, matched))
  const out: ReactionEffects = {}
  const colors: string[] = []
  for (const rule of maximal) {
    if (rule.effects.liquidColor !== undefined) colors.push(rule.effects.liquidColor)
    if (rule.effects.precipitate !== undefined) out.precipitate = rule.effects.precipitate
    if (rule.effects.gas !== undefined) out.gas = rule.effects.gas
  }
  // Смешиваем цвета всех активных компонентов
  if (colors.length > 0) out.liquidColor = blendColors(colors)
  return out
}

export function getReactionDescription(contents: string[]): string | null {
  const fired = REACTION_TABLE.filter((r) => r.description && ruleMatches(r.inputs, contents))
  const maximal = fired.filter((r) => !isSubsumed(r, fired))
  return maximal.length > 0 ? maximal.map((r) => r.description).join('  ·  ') : null
}

// ── Подписи цвета осадков ─────────────────────────────────────────────────────

const PRECIPITATE_LABELS: Record<string, string> = {
  '#4FC3F7': 'голубой осадок',
  '#BF360C': 'красно-бурый осадок',
  '#78909C': 'серо-зелёный осадок',
  '#37474F': 'тёмно-бурый осадок',
  '#B0BEC5': 'белый осадок',
  '#C5D0DA': 'белый нерастворимый осадок',
  '#80DEEA': 'голубовато-розовый осадок',
  '#9CCC65': 'яблочно-зелёный осадок',
  '#26A69A': 'зелёный осадок (малахит)',
  '#FFF59D': 'бледно-жёлтый осадок',
  '#A5D6A7': 'светло-зелёный осадок',
  '#F8BBD0': 'розовый осадок',
  '#F9A825': 'жёлтый осадок',
  '#5D4037': 'бурый осадок',
  '#8D6E2E': 'бурый + жёлтый осадок',
  '#212121': 'чёрный осадок',
  '#1A1A1A': 'чёрный осадок',
  '#1A237E': 'тёмно-синий осадок',
  '#1B5E20': 'тёмно-зелёный осадок',
  // Металлы и твёрдые вещества
  '#B87333': 'красный осадок (Cu↓)',
  '#C0C0C0': 'серебристый осадок (Ag↓)',
  '#FDD835': 'жёлтый осадок (S↓)',
  '#424242': 'чёрный осадок (C / FeS)',
  '#263238': 'чёрный осадок (CuO)',
  // Дополнительные
  '#546E7A': 'тёмно-серый осадок (Fe↓)',
  '#B0C4BE': 'серебристый осадок (Zn↓)',
  '#90CAF9': 'светло-голубой осадок (Cu₃(PO₄)₂)',
}

export function getPrecipitateLabel(color: string): string {
  return PRECIPITATE_LABELS[color] ?? 'осадок'
}
