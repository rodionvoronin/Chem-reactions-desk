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

  // ══ Задание 6 ЕГЭ — простые вещества ══════════════════════════════════════
  // Щелочные и щёлочноземельные металлы
  { id: 'Na_s',    label: 'Na',        color: '#CFD8DC' },
  { id: 'K_s',     label: 'K',         color: '#B0BEC5' },
  { id: 'Ca_s',    label: 'Ca',        color: '#E0E0E0' },
  // Переходные металлы
  { id: 'Cr_s',    label: 'Cr',        color: '#90A4AE' },
  { id: 'Ag_s',    label: 'Ag',        color: '#C0C0C0' },
  // Неметаллы
  { id: 'P_s',     label: 'P',         color: '#FF7043' },
  { id: 'Si_s',    label: 'Si',        color: '#546E7A' },

  // ══ Задание 6 — оксиды ════════════════════════════════════════════════════
  { id: 'SO3',     label: 'SO₃',       color: '#ECEFF1' },
  { id: 'Cr2O3',   label: 'Cr₂O₃',     color: '#2E7D32' },
  { id: 'MgO',     label: 'MgO',       color: '#FAFAFA' },
  { id: 'BaO',     label: 'BaO',       color: '#F5F5F5' },
  { id: 'FeO',     label: 'FeO',       color: '#37474F' },

  // ══ Задание 7 — основания и амфотерные гидроксиды (тв.) ═══════════════════
  { id: 'AlOH3',   label: 'Al(OH)₃',   color: '#ECEFF1' },
  { id: 'ZnOH2',   label: 'Zn(OH)₂',   color: '#F5F5F5' },
  { id: 'CrOH3',   label: 'Cr(OH)₃',   color: '#78909C' },
  { id: 'CuOH2',   label: 'Cu(OH)₂',   color: '#4FC3F7' },
  { id: 'FeOH3',   label: 'Fe(OH)₃',   color: '#BF360C' },

  // ══ Задание 7 — щёлочи ════════════════════════════════════════════════════
  { id: 'KOH',     label: 'KOH',       color: '#CFD8DC' },
  { id: 'BaOH2',   label: 'Ba(OH)₂',   color: '#E8EAF6' },

  // ══ Задание 7 — кислоты ═══════════════════════════════════════════════════
  { id: 'H3PO4',   label: 'H₃PO₄',     color: '#E1F5FE' },
  { id: 'H2S_aq',  label: 'H₂S (р-р)', color: '#F0F4C3' },
  { id: 'CH3COOH', label: 'CH₃COOH',   color: '#FFF3E0' },

  // ══ Задание 7 — соли (средние, кислые, аммония) ══════════════════════════
  { id: 'NH4Cl',   label: 'NH₄Cl',     color: '#E8F5E9' },
  { id: 'NH42SO4', label: '(NH₄)₂SO₄', color: '#E0F2F1' },
  { id: 'KNO3',    label: 'KNO₃',      color: '#FFFDE7' },
  { id: 'K2CO3',   label: 'K₂CO₃',     color: '#E1F5FE' },
  { id: 'NaCl',    label: 'NaCl',      color: '#FAFAFA' },
  { id: 'NaHSO4',  label: 'NaHSO₄',    color: '#FFECB3' },

  // ══ Бинарные соединения — гидролизуются водой необратимо ══════════════════
  { id: 'Al2S3',   label: 'Al₂S₃',     color: '#8D6E63' },
  { id: 'Al4C3',   label: 'Al₄C₃',     color: '#795548' },
  { id: 'CaC2',    label: 'CaC₂',      color: '#9E9E9E' },
  { id: 'Mg3N2',   label: 'Mg₃N₂',     color: '#C5E1A5' },
  { id: 'Ca3P2',   label: 'Ca₃P₂',     color: '#BCAAA4' },
  { id: 'Na2O2',   label: 'Na₂O₂',     color: '#FFF9C4' },

  // ══ Хром — хроматы и оксид(VI) ════════════════════════════════════════════
  { id: 'Cr2SO43', label: 'Cr₂(SO₄)₃', color: '#66BB6A' },
  { id: 'K2CrO4',  label: 'K₂CrO₄',    color: '#FDD835' },
  { id: 'CrO3',    label: 'CrO₃',      color: '#C62828' },

  // ══ Соли (растворы) ═══════════════════════════════════════════════════════
  { id: 'Al2SO43', label: 'Al₂(SO₄)₃', color: '#ECEFF1' },
  { id: 'MgCl2',   label: 'MgCl₂',     color: '#F5F5F5' },
  { id: 'CuCl2',   label: 'CuCl₂',     color: '#26A69A' },
  { id: 'Fe2SO43', label: 'Fe₂(SO₄)₃', color: '#A1887F' },
  { id: 'MnSO4',   label: 'MnSO₄',     color: '#F8BBD0' },
  { id: 'KBr',     label: 'KBr',       color: '#EFEBE9' },
  { id: 'NaNO3',   label: 'NaNO₃',     color: '#FFFDE7' },
  { id: 'CuNO32',  label: 'Cu(NO₃)₂',  color: '#1E88E5' },
  { id: 'NH4NO3',  label: 'NH₄NO₃',    color: '#F1F8E9' },
  { id: 'KClO3',   label: 'KClO₃',     color: '#FAFAFA' },

  // ══ Нерастворимые соли (тв.) ══════════════════════════════════════════════
  { id: 'FeS',     label: 'FeS',       color: '#37474F' },
  { id: 'BaCO3',   label: 'BaCO₃',     color: '#FAFAFA' },
  { id: 'MgCO3',   label: 'MgCO₃',     color: '#F5F5F5' },
  { id: 'CaSO4',   label: 'CaSO₄',     color: '#ECEFF1' },

  // ══ Оксиды ════════════════════════════════════════════════════════════════
  { id: 'CO',      label: 'CO',        color: '#B0BEC5' },
  { id: 'Cu2O',    label: 'Cu₂O',      color: '#D84315' },
  { id: 'Fe3O4',   label: 'Fe₃O₄',     color: '#263238' },

  // ══ Металл ════════════════════════════════════════════════════════════════
  { id: 'Ba_s',    label: 'Ba',        color: '#CFD8DC' },

  // ══ Бромиды металлов ══════════════════════════════════════════════════════
  { id: 'NaBr',    label: 'NaBr',      color: '#FAFAFA' },
  { id: 'AlBr3',   label: 'AlBr₃',     color: '#ECEFF1' },
  { id: 'CrBr3',   label: 'CrBr₃',     color: '#66BB6A' },
  { id: 'FeBr3',   label: 'FeBr₃',     color: '#8D6E63' },
  { id: 'FeBr2',   label: 'FeBr₂',     color: '#A5D6A7' },
  { id: 'MgBr2',   label: 'MgBr₂',     color: '#F5F5F5' },
  { id: 'BaBr2',   label: 'BaBr₂',     color: '#EFEBE9' },
  { id: 'ZnBr2',   label: 'ZnBr₂',     color: '#E0E0E0' },
  { id: 'CuBr2',   label: 'CuBr₂',     color: '#26A69A' },

  // ══ Иодиды металлов ═══════════════════════════════════════════════════════
  { id: 'NaI',     label: 'NaI',       color: '#FFFDE7' },
  { id: 'AlI3',    label: 'AlI₃',      color: '#F5F5F5' },
  { id: 'MgI2',    label: 'MgI₂',      color: '#FAFAFA' },
  { id: 'BaI2',    label: 'BaI₂',      color: '#EFEBE9' },
  { id: 'ZnI2',    label: 'ZnI₂',      color: '#E0E0E0' },

  // ══ Фториды ═══════════════════════════════════════════════════════════════
  { id: 'NaF',     label: 'NaF',       color: '#E3F2FD' },
  { id: 'CaF2',    label: 'CaF₂',      color: '#ECEFF1' },
  { id: 'HF',      label: 'HF',        color: '#E1F5FE' },

  // ══ Дополнительные хлориды ════════════════════════════════════════════════
  { id: 'KCl',     label: 'KCl',       color: '#FAFAFA' },
  { id: 'ZnCl2',   label: 'ZnCl₂',     color: '#E0E0E0' },
  { id: 'MnCl2',   label: 'MnCl₂',     color: '#F8BBD0' },
  { id: 'NiCl2',   label: 'NiCl₂',     color: '#A5D6A7' },
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
  { id: 'mg1', label: 'I',    fullLabel: 'Гр. I — Na, K',       reagentIds: ['Na2CO3', 'NaHCO3', 'Na2SO4', 'K2CO3', 'NaCl', 'KCl', 'NaHSO4', 'KNO3', 'NaNO3'] },
  { id: 'mg2', label: 'II',   fullLabel: 'Гр. II — Mg, Ca, Ba', reagentIds: ['CaCl2', 'BaCl2', 'CaOH2', 'BaOH2', 'MgCl2', 'MgBr2', 'MgI2', 'BaBr2', 'BaI2', 'CaF2'] },
  { id: 'mg3', label: 'III',  fullLabel: 'Гр. III — Al',        reagentIds: ['AlCl3', 'Al2SO43', 'AlBr3', 'AlI3'] },
  { id: 'mg4', label: 'IV',   fullLabel: 'Гр. IV — Si',         reagentIds: ['Na2SiO3'] },
  { id: 'mg5', label: 'V',    fullLabel: 'Гр. V — N, P',        reagentIds: ['HNO3_dilut', 'HNO3_conc', 'Na3PO4', 'H3PO4', 'NH4Cl', 'NH42SO4', 'NH4NO3'] },
  { id: 'mg6', label: 'VI',   fullLabel: 'Гр. VI — S',          reagentIds: ['H2SO4_dilut', 'H2SO4_conc', 'Na2S', 'Na2SO3', 'H2S_aq'] },
  { id: 'mg7', label: 'VII',  fullLabel: 'Гр. VII — Галогены',  reagentIds: ['HCl', 'HF', 'KI', 'NaI', 'KBr', 'NaBr', 'NaF', 'Cl2', 'Br2', 'I2', 'KClO3'] },
]

export const TRANSITION_GROUPS: ReagentGroup[] = [
  { id: 'tfe', label: 'Fe',    fullLabel: 'Fe, Co, Ni',           reagentIds: ['FeCl3', 'FeCl2', 'FeSO4', 'Fe2SO43', 'FeBr3', 'FeBr2', 'CoCl2', 'NiSO4', 'NiCl2'] },
  { id: 'tcu', label: 'Cu/Ag', fullLabel: 'Cu, Ag',              reagentIds: ['CuSO4', 'CuCl2', 'CuBr2', 'CuNO32', 'AgNO3'] },
  { id: 'tcr', label: 'Cr/Mn', fullLabel: 'Cr, Mn',              reagentIds: ['CrCl3', 'CrBr3', 'Cr2SO43', 'K2Cr2O7', 'K2CrO4', 'KMnO4', 'MnSO4', 'MnCl2'] },
  { id: 'tzn', label: 'Zn/Pb', fullLabel: 'Zn, Pb',              reagentIds: ['ZnSO4', 'ZnCl2', 'ZnBr2', 'ZnI2', 'PbNO32'] },
]

// ── Common reagent sections ───────────────────────────────────────────────────

export const COMMON_SECTIONS: Array<{ label: string; ids: string[] }> = [
  { label: 'СРЕДА',          ids: ['NaOH', 'KOH', 'HCl', 'NH3', 'CH3COOH'] },
  { label: 'ОКИСЛИТЕЛИ',     ids: ['KMnO4', 'K2Cr2O7', 'H2O2'] },
  { label: 'ВОССТАНОВИТЕЛИ', ids: ['KI', 'Na2S'] },
  { label: 'ГАЗЫ',           ids: ['SO2', 'CO2', 'SO3'] },
  { label: 'ИНДИКАТОРЫ',     ids: ['phenolphthalein'] },
]

// ── Reaction engine ───────────────────────────────────────────────────────────

export interface ReactionEffects {
  liquidColor?: string
  precipitate?: { color: string }
  gas?: boolean
  /** Какой именно газ выделяется — определяет цвет пузырьков */
  gasInfo?: GasInfo
}

// ── Газы и их окраска ─────────────────────────────────────────────────────────

export interface GasInfo {
  formula: string
  label: string
  /** Заливка пузырька */
  fill: string
  /** Обводка пузырька */
  stroke: string
}

/**
 * Реальные цвета газов. Окрашены только NO₂ (бурый) и Cl₂ (жёлто-зелёный) —
 * остальные бесцветны и рисуются как прозрачные пузырьки со светлой обводкой.
 */
const COLORLESS: Pick<GasInfo, 'fill' | 'stroke'> = {
  fill:   'rgba(245, 250, 255, 0.72)',
  stroke: 'rgba(120, 170, 215, 0.60)',
}

const GAS_TABLE: Record<string, GasInfo> = {
  // ── Окрашенные ──
  NO2: {
    formula: 'NO₂', label: 'бурый газ (NO₂)',
    fill: 'rgba(216, 90, 30, 0.88)', stroke: 'rgba(150, 45, 10, 0.85)',
  },
  Cl2: {
    formula: 'Cl₂', label: 'жёлто-зелёный газ (Cl₂)',
    fill: 'rgba(200, 215, 70, 0.85)', stroke: 'rgba(130, 150, 25, 0.85)',
  },
  // ── Бесцветные ──
  CO2: { formula: 'CO₂', label: 'бесцветный газ (CO₂)',                       ...COLORLESS },
  SO2: { formula: 'SO₂', label: 'бесцветный газ с резким запахом (SO₂)',      ...COLORLESS },
  H2:  { formula: 'H₂',  label: 'бесцветный газ (H₂)',                        ...COLORLESS },
  O2:  { formula: 'O₂',  label: 'бесцветный газ (O₂)',                        ...COLORLESS },
  H2S: { formula: 'H₂S', label: 'бесцветный газ с запахом тухлых яиц (H₂S)',  ...COLORLESS },
  N2O: { formula: 'N₂O', label: 'бесцветный газ (N₂O)',                       ...COLORLESS },
  NO:  { formula: 'NO',  label: 'бесцветный газ (NO), буреет на воздухе',     ...COLORLESS },
  NH3: { formula: 'NH₃', label: 'бесцветный газ с резким запахом (NH₃)',     ...COLORLESS },
  PH3: { formula: 'PH₃', label: 'бесцветный ядовитый газ (PH₃)',             ...COLORLESS },
  HCl: { formula: 'HCl', label: 'бесцветный газ, дымит на воздухе (HCl)',    ...COLORLESS },
  CO:  { formula: 'CO',  label: 'бесцветный ядовитый газ (CO)',              ...COLORLESS },
  CH4: { formula: 'CH₄', label: 'бесцветный газ без запаха (CH₄)',          ...COLORLESS },
  C2H2:{ formula: 'C₂H₂', label: 'бесцветный газ (C₂H₂, ацетилен)',         ...COLORLESS },
  N2:  { formula: 'N₂',  label: 'бесцветный газ (N₂)',                      ...COLORLESS },
  SiH4:{ formula: 'SiH₄', label: 'бесцветный газ (SiH₄, силан)',            ...COLORLESS },
  HF:  { formula: 'HF',  label: 'бесцветный газ (HF), разъедает стекло',    ...COLORLESS },
  SiF4:{ formula: 'SiF₄', label: 'бесцветный газ (SiF₄)',                   ...COLORLESS },
  HBr: { formula: 'HBr', label: 'бесцветный газ, дымит на воздухе (HBr)',   ...COLORLESS },
  HI:  { formula: 'HI',  label: 'бесцветный газ, дымит на воздухе (HI)',    ...COLORLESS },
}

const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉'

/** Приводит формулу с юникод-индексами к обычному виду: "NO₂" → "NO2" */
function normalizeFormula(s: string): string {
  return s.replace(/[₀-₉]/g, (c) => String(SUBSCRIPTS.indexOf(c)))
}

/**
 * Достаёт газы прямо из уравнения реакции — по символу ↑ после формулы.
 * Так цвет пузырьков не нужно дублировать в каждом правиле, и новые
 * реакции получают его автоматически.
 */
function extractGases(description: string): GasInfo[] {
  const found: GasInfo[] = []
  for (const m of description.matchAll(/([A-Za-z][A-Za-z0-9₀-₉]*)↑/g)) {
    const info = GAS_TABLE[normalizeFormula(m[1])]
    if (info && !found.some((g) => g.formula === info.formula)) found.push(info)
  }
  return found
}

/** Если газов несколько, показываем окрашенный — он определяет вид пузырьков. */
function pickGas(gases: GasInfo[]): GasInfo | undefined {
  if (gases.length === 0) return undefined
  return gases.find((g) => g.fill !== COLORLESS.fill) ?? gases[0]
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

  // ══════════════════════════════════════════════════════════════════════════════
  // ── КАЧЕСТВЕННЫЕ РЕАКЦИИ НА АНИОНЫ (задание 31 ЕГЭ) ──────────────────────
  // ══════════════════════════════════════════════════════════════════════════════

  // ── Ag⁺ + Cl⁻ → AgCl↓ (белый творожистый) ────────────────────────────────
  { inputs: ['AgNO3', 'AlCl3'], effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } }, description: '3AgNO₃ + AlCl₃ → 3AgCl↓ + Al(NO₃)₃  (качественная реакция на Cl⁻)' },
  { inputs: ['AgNO3', 'FeCl3'], effects: { liquidColor: 'rgba(141,110,99,0.40)', precipitate: { color: '#B0BEC5' } }, description: '3AgNO₃ + FeCl₃ → 3AgCl↓ + Fe(NO₃)₃  (качественная реакция на Cl⁻)' },
  { inputs: ['AgNO3', 'FeCl2'], effects: { liquidColor: 'rgba(100,160,100,0.28)', precipitate: { color: '#B0BEC5' } }, description: '2AgNO₃ + FeCl₂ → 2AgCl↓ + Fe(NO₃)₂  (качественная реакция на Cl⁻)' },
  { inputs: ['AgNO3', 'CoCl2'], effects: { liquidColor: 'rgba(240,98,146,0.35)', precipitate: { color: '#B0BEC5' } }, description: '2AgNO₃ + CoCl₂ → 2AgCl↓ + Co(NO₃)₂  (качественная реакция на Cl⁻)' },
  { inputs: ['AgNO3', 'CrCl3'], effects: { liquidColor: 'rgba(27,94,32,0.45)', precipitate: { color: '#B0BEC5' } }, description: '3AgNO₃ + CrCl₃ → 3AgCl↓ + Cr(NO₃)₃  (качественная реакция на Cl⁻)' },

  // ── Ba²⁺ + SO₄²⁻ → BaSO₄↓ (белый, нерастворим в кислотах) ────────────────
  { inputs: ['BaCl2', 'FeSO4'], effects: { liquidColor: 'rgba(100,160,100,0.28)', precipitate: { color: '#C5D0DA' } }, description: 'BaCl₂ + FeSO₄ → BaSO₄↓ + FeCl₂  (качественная реакция на SO₄²⁻)' },
  { inputs: ['BaCl2', 'NiSO4'], effects: { liquidColor: 'rgba(100,200,100,0.30)', precipitate: { color: '#C5D0DA' } }, description: 'BaCl₂ + NiSO₄ → BaSO₄↓ + NiCl₂  (качественная реакция на SO₄²⁻)' },
  { inputs: ['BaCl2', 'CuSO4'], effects: { liquidColor: 'rgba(30,136,229,0.26)', precipitate: { color: '#C5D0DA' } }, description: 'BaCl₂ + CuSO₄ → BaSO₄↓ + CuCl₂  (качественная реакция на SO₄²⁻)' },
  { inputs: ['BaCl2', 'ZnSO4'], effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } }, description: 'BaCl₂ + ZnSO₄ → BaSO₄↓ + ZnCl₂  (качественная реакция на SO₄²⁻)' },

  // ── Ca²⁺ + SO₄²⁻ → CaSO₄↓ (малорастворим) ────────────────────────────────
  { inputs: ['CaCl2', 'FeSO4'],       effects: { liquidColor: 'rgba(100,160,100,0.28)', precipitate: { color: '#C5D0DA' } }, description: 'CaCl₂ + FeSO₄ → CaSO₄↓ + FeCl₂' },
  { inputs: ['CaCl2', 'CuSO4'],       effects: { liquidColor: 'rgba(30,136,229,0.26)', precipitate: { color: '#C5D0DA' } }, description: 'CaCl₂ + CuSO₄ → CaSO₄↓ + CuCl₂' },
  { inputs: ['CaCl2', 'ZnSO4'],       effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } }, description: 'CaCl₂ + ZnSO₄ → CaSO₄↓ + ZnCl₂' },
  { inputs: ['CaCl2', 'NiSO4'],       effects: { liquidColor: 'rgba(100,200,100,0.30)', precipitate: { color: '#C5D0DA' } }, description: 'CaCl₂ + NiSO₄ → CaSO₄↓ + NiCl₂' },
  { inputs: ['CaCl2', 'H2SO4_dilut'], effects: { precipitate: { color: '#C5D0DA' } }, description: 'CaCl₂ + H₂SO₄ → CaSO₄↓ + 2HCl' },
  { inputs: ['CaCl2', 'H2SO4_conc'],  effects: { precipitate: { color: '#C5D0DA' } }, description: 'CaCl₂ + H₂SO₄ → CaSO₄↓ + 2HCl' },

  // ── Иодиды: AgI и PbI₂ ────────────────────────────────────────────────────
  {
    inputs: ['AgNO3', 'KI'],
    effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#F9A825' } },
    description: 'AgNO₃ + KI → AgI↓ + KNO₃  (качественная реакция на I⁻ — жёлтый осадок)',
  },
  {
    inputs: ['PbNO32', 'KI'],
    effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#FFC107' } },
    description: 'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃  («золотой дождь» — золотисто-жёлтые кристаллы)',
  },
  {
    inputs: ['CuSO4', 'KI'],
    effects: { liquidColor: 'rgba(120,60,0,0.50)', precipitate: { color: '#ECEFF1' } },
    description: '2CuSO₄ + 4KI → 2CuI↓ + I₂ + 2K₂SO₄  (Окислитель: Cu²⁺ → Cu⁺, Восстановитель: I⁻ → I₂)',
  },

  // ── Pb²⁺ + Cl⁻ → PbCl₂↓ ──────────────────────────────────────────────────
  { inputs: ['PbNO32', 'CaCl2'], effects: { precipitate: { color: '#B0BEC5' } }, description: 'Pb(NO₃)₂ + CaCl₂ → PbCl₂↓ + Ca(NO₃)₂' },
  { inputs: ['PbNO32', 'BaCl2'], effects: { precipitate: { color: '#B0BEC5' } }, description: 'Pb(NO₃)₂ + BaCl₂ → PbCl₂↓ + Ba(NO₃)₂' },

  // ── Ag⁺ + SO₄²⁻ → Ag₂SO₄↓ (малорастворим) ────────────────────────────────
  { inputs: ['AgNO3', 'H2SO4_dilut'], effects: { precipitate: { color: '#FFF9C4' } }, description: '2AgNO₃ + H₂SO₄ → Ag₂SO₄↓ + 2HNO₃' },
  { inputs: ['AgNO3', 'H2SO4_conc'],  effects: { precipitate: { color: '#FFF9C4' } }, description: '2AgNO₃ + H₂SO₄ → Ag₂SO₄↓ + 2HNO₃' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Ca(OH)₂ КАК ЩЁЛОЧЬ — осаждение гидроксидов ───────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  { inputs: ['CuSO4', 'CaOH2'],  effects: { liquidColor: 'rgba(129,212,250,0.18)', precipitate: { color: '#4FC3F7' } }, description: 'CuSO₄ + Ca(OH)₂ → Cu(OH)₂↓ + CaSO₄↓' },
  { inputs: ['FeCl3', 'CaOH2'],  effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#BF360C' } }, description: '2FeCl₃ + 3Ca(OH)₂ → 2Fe(OH)₃↓ + 3CaCl₂' },
  { inputs: ['FeCl2', 'CaOH2'],  effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#78909C' } }, description: 'FeCl₂ + Ca(OH)₂ → Fe(OH)₂↓ + CaCl₂' },
  { inputs: ['FeSO4', 'CaOH2'],  effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#78909C' } }, description: 'FeSO₄ + Ca(OH)₂ → Fe(OH)₂↓ + CaSO₄↓' },
  { inputs: ['AlCl3', 'CaOH2'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } }, description: '2AlCl₃ + 3Ca(OH)₂ → 2Al(OH)₃↓ + 3CaCl₂' },
  { inputs: ['CrCl3', 'CaOH2'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' } }, description: '2CrCl₃ + 3Ca(OH)₂ → 2Cr(OH)₃↓ + 3CaCl₂' },
  { inputs: ['ZnSO4', 'CaOH2'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } }, description: 'ZnSO₄ + Ca(OH)₂ → Zn(OH)₂↓ + CaSO₄↓' },
  { inputs: ['NiSO4', 'CaOH2'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#9CCC65' } }, description: 'NiSO₄ + Ca(OH)₂ → Ni(OH)₂↓ + CaSO₄↓' },
  { inputs: ['CoCl2', 'CaOH2'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#80DEEA' } }, description: 'CoCl₂ + Ca(OH)₂ → Co(OH)₂↓ + CaCl₂' },
  { inputs: ['PbNO32', 'CaOH2'], effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } }, description: 'Pb(NO₃)₂ + Ca(OH)₂ → Pb(OH)₂↓ + Ca(NO₃)₂' },
  { inputs: ['AgNO3', 'CaOH2'],  effects: { liquidColor: 'rgba(80,80,80,0.10)', precipitate: { color: '#37474F' } }, description: '2AgNO₃ + Ca(OH)₂ → Ag₂O↓ + H₂O + Ca(NO₃)₂' },

  // ── Аммиак с оставшимися катионами ────────────────────────────────────────
  { inputs: ['CrCl3', 'NH3'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' } }, description: 'CrCl₃ + 3NH₃ + 3H₂O → Cr(OH)₃↓ + 3NH₄Cl  (в избытке NH₃ не растворяется)' },
  { inputs: ['PbNO32', 'NH3'], effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } }, description: 'Pb(NO₃)₂ + 2NH₃ + 2H₂O → Pb(OH)₂↓ + 2NH₄NO₃' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ДВОЙНОЙ (ВЗАИМНЫЙ) ГИДРОЛИЗ — классика задания 31 ────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    inputs: ['Na2S', 'AlCl3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' }, gas: true },
    description: '2AlCl₃ + 3Na₂S + 6H₂O → 2Al(OH)₃↓ + 3H₂S↑ + 6NaCl  (двойной гидролиз — сульфид алюминия в растворе не существует)',
  },
  {
    inputs: ['Na2S', 'CrCl3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' }, gas: true },
    description: '2CrCl₃ + 3Na₂S + 6H₂O → 2Cr(OH)₃↓ + 3H₂S↑ + 6NaCl  (двойной гидролиз)',
  },
  {
    inputs: ['NaHCO3', 'FeCl3'],
    effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#BF360C' }, gas: true },
    description: 'FeCl₃ + 3NaHCO₃ → Fe(OH)₃↓ + 3CO₂↑ + 3NaCl  (двойной гидролиз)',
  },
  {
    inputs: ['NaHCO3', 'CrCl3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' }, gas: true },
    description: 'CrCl₃ + 3NaHCO₃ → Cr(OH)₃↓ + 3CO₂↑ + 3NaCl  (двойной гидролиз)',
  },
  {
    inputs: ['Na2SO3', 'AlCl3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' }, gas: true },
    description: '2AlCl₃ + 3Na₂SO₃ + 3H₂O → 2Al(OH)₃↓ + 3SO₂↑ + 6NaCl  (двойной гидролиз)',
  },
  {
    inputs: ['Na2SO3', 'CrCl3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' }, gas: true },
    description: '2CrCl₃ + 3Na₂SO₃ + 3H₂O → 2Cr(OH)₃↓ + 3SO₂↑ + 6NaCl  (двойной гидролиз)',
  },

  // ── Сульфиды железа ───────────────────────────────────────────────────────
  { inputs: ['Na2S', 'FeCl2'], effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#212121' } }, description: 'FeCl₂ + Na₂S → FeS↓ + 2NaCl  (чёрный осадок)' },
  { inputs: ['Na2S', 'FeSO4'], effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#212121' } }, description: 'FeSO₄ + Na₂S → FeS↓ + Na₂SO₄  (чёрный осадок)' },

  // ── Силикаты тяжёлых металлов (нерастворимы) ─────────────────────────────
  { inputs: ['Na2SiO3', 'CuSO4'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#4DB6AC' } }, description: 'Na₂SiO₃ + CuSO₄ → CuSiO₃↓ + Na₂SO₄  (голубовато-зелёный осадок)' },
  { inputs: ['Na2SiO3', 'FeCl3'],  effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#BF360C' } }, description: '2FeCl₃ + 3Na₂SiO₃ + 6H₂O → 2Fe(OH)₃↓ + 3H₂SiO₃↓ + 6NaCl  (двойной гидролиз)' },
  { inputs: ['Na2SiO3', 'CoCl2'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#F8BBD0' } }, description: 'Na₂SiO₃ + CoCl₂ → CoSiO₃↓ + 2NaCl' },
  { inputs: ['Na2SiO3', 'NiSO4'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#A5D6A7' } }, description: 'Na₂SiO₃ + NiSO₄ → NiSiO₃↓ + Na₂SO₄' },
  { inputs: ['Na2SiO3', 'ZnSO4'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } }, description: 'Na₂SiO₃ + ZnSO₄ → ZnSiO₃↓ + Na₂SO₄' },
  { inputs: ['Na2SiO3', 'PbNO32'], effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } }, description: 'Na₂SiO₃ + Pb(NO₃)₂ → PbSiO₃↓ + 2NaNO₃' },
  { inputs: ['Na2SiO3', 'AgNO3'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#FFF59D' } }, description: 'Na₂SiO₃ + 2AgNO₃ → Ag₂SiO₃↓ + 2NaNO₃' },

  // ── Фосфаты остальных катионов ───────────────────────────────────────────
  { inputs: ['Na3PO4', 'AlCl3'], effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#C5D0DA' } }, description: 'AlCl₃ + Na₃PO₄ → AlPO₄↓ + 3NaCl' },
  { inputs: ['Na3PO4', 'FeCl2'], effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' } }, description: '3FeCl₂ + 2Na₃PO₄ → Fe₃(PO₄)₂↓ + 6NaCl' },
  { inputs: ['Na3PO4', 'CoCl2'], effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#F8BBD0' } }, description: '3CoCl₂ + 2Na₃PO₄ → Co₃(PO₄)₂↓ + 6NaCl' },
  { inputs: ['Na3PO4', 'CrCl3'], effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' } }, description: 'CrCl₃ + Na₃PO₄ → CrPO₄↓ + 3NaCl' },

  // ── Сульфиты остальных катионов ──────────────────────────────────────────
  { inputs: ['Na2SO3', 'CaCl2'],  effects: { precipitate: { color: '#C5D0DA' } }, description: 'Na₂SO₃ + CaCl₂ → CaSO₃↓ + 2NaCl' },
  { inputs: ['Na2SO3', 'AgNO3'],  effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#FFF9C4' } }, description: 'Na₂SO₃ + 2AgNO₃ → Ag₂SO₃↓ + 2NaNO₃' },
  { inputs: ['Na2SO3', 'PbNO32'], effects: { precipitate: { color: '#C5D0DA' } }, description: 'Na₂SO₃ + Pb(NO₃)₂ → PbSO₃↓ + 2NaNO₃' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Вытеснение слабых кислот из солей ────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    inputs: ['SO2', 'Na2CO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: 'SO₂ + Na₂CO₃ → Na₂SO₃ + CO₂↑  (H₂SO₃ сильнее H₂CO₃ и вытесняет её)',
  },
  {
    inputs: ['SO2', 'Na2SiO3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } },
    description: 'SO₂ + Na₂SiO₃ + H₂O → H₂SiO₃↓ + Na₂SO₃',
  },
  { inputs: ['SO2', 'NH3'], effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'SO₂ + 2NH₃ + H₂O → (NH₄)₂SO₃' },
  { inputs: ['CO2', 'NH3'], effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'CO₂ + 2NH₃ + H₂O → (NH₄)₂CO₃' },

  // ── Пропущенные варианты кислот ──────────────────────────────────────────
  { inputs: ['Na3PO4', 'H2SO4_dilut'], effects: {}, description: '2Na₃PO₄ + 3H₂SO₄ → 2H₃PO₄ + 3Na₂SO₄' },
  { inputs: ['Na3PO4', 'HNO3_dilut'],  effects: {}, description: 'Na₃PO₄ + 3HNO₃ → H₃PO₄ + 3NaNO₃' },
  {
    inputs: ['Na2S', 'HNO3_conc'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#F9A825' }, gas: true },
    description: 'Na₂S + 4HNO₃(конц) → S↓ + 2NO₂↑ + 2NaNO₃ + 2H₂O  (Окислитель: N⁵⁺ → N⁴⁺, Восстановитель: S²⁻ → S⁰)',
  },
  {
    inputs: ['KI', 'HNO3_conc'],
    effects: { liquidColor: 'rgba(110,45,0,0.72)', gas: true },
    description: '2KI + 4HNO₃(конц) → I₂ + 2NO₂↑ + 2KNO₃ + 2H₂O  (Окислитель: N⁵⁺ → N⁴⁺, Восстановитель: I⁻ → I₂)',
  },

  // ── Кислая соль + щёлочь ─────────────────────────────────────────────────
  {
    inputs: ['NaHCO3', 'NaOH'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)' },
    description: 'NaHCO₃ + NaOH → Na₂CO₃ + H₂O  (кислая соль переходит в среднюю)',
  },
  {
    inputs: ['NaHCO3', 'CaOH2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } },
    description: 'Ca(OH)₂ + 2NaHCO₃ → CaCO₃↓ + Na₂CO₃ + 2H₂O  (устранение временной жёсткости воды)',
  },
  {
    inputs: ['Na2SiO3', 'CaOH2'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } },
    description: 'Na₂SiO₃ + Ca(OH)₂ → CaSiO₃↓ + 2NaOH',
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ЗАДАНИЕ 6: ПРОСТЫЕ ВЕЩЕСТВА — ЩЕЛОЧНЫЕ И ЩЁЛОЧНОЗЕМЕЛЬНЫЕ МЕТАЛЛЫ ────
  //    В пробирке вода, поэтому активные металлы реагируют сразу
  // ══════════════════════════════════════════════════════════════════════════════
  {
    inputs: ['Na_s'],
    effects: { liquidColor: 'rgba(220,240,220,0.14)', gas: true },
    description: '2Na + 2H₂O → 2NaOH + H₂↑  (бурно, металл плавится в шарик)',
  },
  {
    inputs: ['K_s'],
    effects: { liquidColor: 'rgba(220,240,220,0.14)', gas: true },
    description: '2K + 2H₂O → 2KOH + H₂↑  (очень бурно, водород воспламеняется)',
  },
  {
    inputs: ['Ca_s'],
    effects: { liquidColor: 'rgba(220,240,220,0.12)', gas: true },
    description: 'Ca + 2H₂O → Ca(OH)₂ + H₂↑',
  },
  // Щелочной металл + вода даёт щёлочь → она осаждает гидроксиды из солей
  { inputs: ['Na_s', 'CuSO4'],  effects: { liquidColor: 'rgba(129,212,250,0.20)', precipitate: { color: '#4FC3F7' }, gas: true }, description: '2Na + 2H₂O → 2NaOH + H₂↑;  CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄' },
  { inputs: ['Na_s', 'FeCl3'],  effects: { liquidColor: 'rgba(200,200,200,0.12)', precipitate: { color: '#BF360C' }, gas: true }, description: '2Na + 2H₂O → 2NaOH + H₂↑;  FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl' },
  { inputs: ['Na_s', 'AlCl3'],  effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' }, gas: true }, description: '2Na + 2H₂O → 2NaOH + H₂↑;  AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl' },
  { inputs: ['Na_s', 'phenolphthalein'], effects: { liquidColor: 'rgba(233,30,140,0.50)', gas: true }, description: '2Na + 2H₂O → 2NaOH + H₂↑;  среда стала щелочной — индикатор малиновый' },
  { inputs: ['K_s',  'phenolphthalein'], effects: { liquidColor: 'rgba(233,30,140,0.50)', gas: true }, description: '2K + 2H₂O → 2KOH + H₂↑;  среда стала щелочной — индикатор малиновый' },
  { inputs: ['Ca_s', 'phenolphthalein'], effects: { liquidColor: 'rgba(233,30,140,0.45)', gas: true }, description: 'Ca + 2H₂O → Ca(OH)₂ + H₂↑;  индикатор малиновый' },
  // С кислотами — ещё энергичнее
  { inputs: ['Na_s', 'HCl'],          effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2Na + 2HCl → 2NaCl + H₂↑' },
  { inputs: ['K_s',  'HCl'],          effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2K + 2HCl → 2KCl + H₂↑' },
  { inputs: ['Ca_s', 'HCl'],          effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: 'Ca + 2HCl → CaCl₂ + H₂↑' },
  { inputs: ['Na_s', 'H2SO4_dilut'],  effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2Na + H₂SO₄ → Na₂SO₄ + H₂↑' },
  { inputs: ['Ca_s', 'H2SO4_dilut'],  effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' }, gas: true }, description: 'Ca + H₂SO₄ → CaSO₄↓ + H₂↑' },
  // С неметаллами
  { inputs: ['Na_s', 'Cl2'],          effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: '2Na + Cl₂ → 2NaCl  (натрий горит в хлоре)' },
  { inputs: ['Na_s', 'S_s', 'heat'],  effects: { liquidColor: 'rgba(200,220,200,0.10)' }, description: '2Na + S → Na₂S  (нагревание)' },
  { inputs: ['Ca_s', 'S_s', 'heat'],  effects: { precipitate: { color: '#F5F5F5' } },     description: 'Ca + S → CaS  (нагревание)' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ХРОМ и СЕРЕБРО ───────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  { inputs: ['Cr_s', 'HCl'],                 effects: { liquidColor: 'rgba(100,150,200,0.35)', gas: true }, description: 'Cr + 2HCl → CrCl₂ + H₂↑  (без доступа воздуха; на воздухе Cr²⁺ → Cr³⁺)' },
  { inputs: ['Cr_s', 'H2SO4_dilut'],         effects: { liquidColor: 'rgba(100,150,200,0.35)', gas: true }, description: 'Cr + H₂SO₄(разб) → CrSO₄ + H₂↑' },
  { inputs: ['Cr_s', 'HNO3_conc'],           effects: {}, description: 'Cr + HNO₃(конц, хол.) — пассивация  (плёнка Cr₂O₃ защищает металл)' },
  { inputs: ['Cr_s', 'H2SO4_conc'],          effects: {}, description: 'Cr + H₂SO₄(конц, хол.) — пассивация' },
  { inputs: ['Cr_s', 'Cl2'],                 effects: { liquidColor: 'rgba(27,94,32,0.50)' }, description: '2Cr + 3Cl₂ → 2CrCl₃  (при нагревании)' },
  { inputs: ['Cr_s', 'CuSO4'],               effects: { liquidColor: 'rgba(27,94,32,0.40)', precipitate: { color: '#B87333' } }, description: '2Cr + 3CuSO₄ → Cr₂(SO₄)₃ + 3Cu↓' },
  { inputs: ['Ag_s', 'HNO3_dilut'],          effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '3Ag + 4HNO₃(разб) → 3AgNO₃ + NO↑ + 2H₂O' },
  { inputs: ['Ag_s', 'HNO3_conc'],           effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: 'Ag + 2HNO₃(конц) → AgNO₃ + NO₂↑ + H₂O' },
  { inputs: ['Ag_s', 'H2SO4_conc', 'heat'],  effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#FFF9C4' }, gas: true }, description: '2Ag + 2H₂SO₄(конц, горяч) → Ag₂SO₄↓ + SO₂↑ + 2H₂O' },
  { inputs: ['Ag_s', 'HCl'],                 effects: {}, description: 'Ag + HCl — реакция не идёт  (Ag стоит после H в ряду активности)' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ФОСФОР и КРЕМНИЙ ─────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  { inputs: ['P_s', 'HNO3_conc', 'heat'], effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: 'P + 5HNO₃(конц) → H₃PO₄ + 5NO₂↑ + H₂O  (Окислитель: N⁵⁺ → N⁴⁺, Восстановитель: P⁰ → P⁵⁺)' },
  { inputs: ['P_s', 'HNO3_dilut', 'heat'], effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '3P + 5HNO₃(разб) + 2H₂O → 3H₃PO₄ + 5NO↑  (Окислитель: N⁵⁺ → N²⁺, Восстановитель: P⁰ → P⁵⁺)' },
  { inputs: ['P_s', 'NaOH', 'heat'],      effects: { liquidColor: 'rgba(200,220,200,0.10)', gas: true }, description: '4P + 3NaOH + 3H₂O → PH₃↑ + 3NaH₂PO₂  (диспропорционирование фосфора)' },
  { inputs: ['P_s', 'Cl2'],               effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: '2P + 5Cl₂ → 2PCl₅  (фосфор горит в хлоре)' },
  { inputs: ['P_s', 'S_s', 'heat'],       effects: { precipitate: { color: '#FDD835' } }, description: '2P + 3S → P₂S₃  (нагревание)' },
  { inputs: ['Si_s', 'NaOH'],             effects: { liquidColor: 'rgba(200,220,200,0.10)', gas: true }, description: 'Si + 2NaOH + H₂O → Na₂SiO₃ + 2H₂↑  (кремний растворяется в щёлочи)' },
  { inputs: ['Si_s', 'KOH'],              effects: { liquidColor: 'rgba(200,220,200,0.10)', gas: true }, description: 'Si + 2KOH + H₂O → K₂SiO₃ + 2H₂↑' },
  { inputs: ['Si_s', 'Mg_s', 'heat'],     effects: { precipitate: { color: '#8D6E63' } }, description: 'Si + 2Mg → Mg₂Si  (силицид магния, нагревание)' },
  { inputs: ['Si_s', 'Cl2', 'heat'],      effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'Si + 2Cl₂ → SiCl₄  (нагревание)' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ЗАДАНИЕ 6: ОКСИДЫ — кислотные, основные, амфотерные ──────────────────
  // ══════════════════════════════════════════════════════════════════════════════

  // ── SO₃ — кислотный оксид ────────────────────────────────────────────────
  { inputs: ['SO3'],           effects: { liquidColor: 'rgba(255,200,150,0.14)' }, description: 'SO₃ + H₂O → H₂SO₄  (бурно, с разогревом)' },
  { inputs: ['SO3', 'NaOH'],   effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'SO₃ + 2NaOH → Na₂SO₄ + H₂O' },
  { inputs: ['SO3', 'KOH'],    effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'SO₃ + 2KOH → K₂SO₄ + H₂O' },
  { inputs: ['SO3', 'CaOH2'],  effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'SO₃ + Ca(OH)₂ → CaSO₄↓ + H₂O' },
  { inputs: ['SO3', 'BaOH2'],  effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'SO₃ + Ba(OH)₂ → BaSO₄↓ + H₂O' },
  { inputs: ['SO3', 'BaCl2'],  effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'SO₃ + H₂O → H₂SO₄;  BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl' },
  { inputs: ['SO3', 'CaO'],    effects: { precipitate: { color: '#C5D0DA' } }, description: 'CaO + SO₃ → CaSO₄' },
  { inputs: ['SO3', 'Na2O'],   effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'Na₂O + SO₃ → Na₂SO₄' },

  // ── Cr₂O₃ — амфотерный оксид ─────────────────────────────────────────────
  { inputs: ['Cr2O3'],                    effects: { precipitate: { color: '#2E7D32' } }, description: '' },
  { inputs: ['Cr2O3', 'NaOH', 'heat'],    effects: { liquidColor: 'rgba(30,100,30,0.35)' }, description: 'Cr₂O₃ + 2NaOH → 2NaCrO₂ + H₂O  (сплавление — амфотерность)' },
  { inputs: ['Cr2O3', 'KOH', 'heat'],     effects: { liquidColor: 'rgba(30,100,30,0.35)' }, description: 'Cr₂O₃ + 2KOH → 2KCrO₂ + H₂O  (сплавление)' },
  { inputs: ['Cr2O3', 'HCl', 'heat'],     effects: { liquidColor: 'rgba(27,94,32,0.50)' }, description: 'Cr₂O₃ + 6HCl → 2CrCl₃ + 3H₂O  (при нагревании)' },
  { inputs: ['Cr2O3', 'H2SO4_dilut', 'heat'], effects: { liquidColor: 'rgba(27,94,32,0.45)' }, description: 'Cr₂O₃ + 3H₂SO₄ → Cr₂(SO₄)₃ + 3H₂O  (при нагревании)' },
  { inputs: ['Cr2O3', 'Al_s', 'heat'],    effects: { precipitate: { color: '#90A4AE' } }, description: 'Cr₂O₃ + 2Al → 2Cr + Al₂O₃  (алюмотермия)' },
  { inputs: ['Cr2O3', 'Na2CO3', 'heat'],  effects: { liquidColor: 'rgba(30,100,30,0.30)', gas: true }, description: 'Cr₂O₃ + Na₂CO₃ → 2NaCrO₂ + CO₂↑  (сплавление)' },

  // ── MgO, BaO, FeO — основные оксиды ──────────────────────────────────────
  { inputs: ['MgO'],                 effects: { precipitate: { color: '#FAFAFA' } }, description: '' },
  { inputs: ['MgO', 'HCl'],          effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'MgO + 2HCl → MgCl₂ + H₂O' },
  { inputs: ['MgO', 'H2SO4_dilut'],  effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'MgO + H₂SO₄ → MgSO₄ + H₂O' },
  { inputs: ['MgO', 'HNO3_dilut'],   effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'MgO + 2HNO₃ → Mg(NO₃)₂ + H₂O' },
  { inputs: ['MgO', 'SiO2', 'heat'], effects: { precipitate: { color: '#ECEFF1' } }, description: 'MgO + SiO₂ → MgSiO₃  (сплавление)' },
  { inputs: ['BaO'],                 effects: { liquidColor: 'rgba(220,240,220,0.12)' }, description: 'BaO + H₂O → Ba(OH)₂  (растворяется, среда щелочная)' },
  { inputs: ['BaO', 'HCl'],          effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'BaO + 2HCl → BaCl₂ + H₂O' },
  { inputs: ['BaO', 'H2SO4_dilut'],  effects: { precipitate: { color: '#C5D0DA' } }, description: 'BaO + H₂SO₄ → BaSO₄↓ + H₂O' },
  { inputs: ['BaO', 'CO2'],          effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#C5D0DA' } }, description: 'BaO + CO₂ → BaCO₃↓' },
  { inputs: ['BaO', 'SO2'],          effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#C5D0DA' } }, description: 'BaO + SO₂ → BaSO₃↓' },
  { inputs: ['FeO'],                 effects: { precipitate: { color: '#37474F' } }, description: '' },
  { inputs: ['FeO', 'HCl'],          effects: { liquidColor: 'rgba(100,160,100,0.30)' }, description: 'FeO + 2HCl → FeCl₂ + H₂O' },
  { inputs: ['FeO', 'H2SO4_dilut'],  effects: { liquidColor: 'rgba(100,160,100,0.30)' }, description: 'FeO + H₂SO₄ → FeSO₄ + H₂O' },
  { inputs: ['FeO', 'HNO3_dilut'],   effects: { liquidColor: 'rgba(141,110,99,0.42)', gas: true }, description: '3FeO + 10HNO₃(разб) → 3Fe(NO₃)₃ + NO↑ + 5H₂O  (Fe²⁺ окисляется до Fe³⁺)' },
  { inputs: ['FeO', 'C_s', 'heat'],  effects: { precipitate: { color: '#546E7A' }, gas: true }, description: 'FeO + C → Fe + CO↑  (восстановление углеродом)' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ЗАДАНИЕ 7: АМФОТЕРНЫЕ ГИДРОКСИДЫ ─────────────────────────────────────
  //    Реагируют и с кислотами, и со щелочами — главный признак амфотерности
  // ══════════════════════════════════════════════════════════════════════════════

  // ── Al(OH)₃ ──────────────────────────────────────────────────────────────
  { inputs: ['AlOH3'],                  effects: { precipitate: { color: '#B0BEC5' } }, description: '' },
  { inputs: ['AlOH3', 'HCl'],           effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O  (как основание)' },
  { inputs: ['AlOH3', 'H2SO4_dilut'],   effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: '2Al(OH)₃ + 3H₂SO₄ → Al₂(SO₄)₃ + 6H₂O  (как основание)' },
  { inputs: ['AlOH3', 'HNO3_dilut'],    effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'Al(OH)₃ + 3HNO₃ → Al(NO₃)₃ + 3H₂O  (как основание)' },
  { inputs: ['AlOH3', 'NaOH'],          effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'Al(OH)₃ + NaOH → Na[Al(OH)₄]  (как кислота — амфотерность)' },
  { inputs: ['AlOH3', 'KOH'],           effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'Al(OH)₃ + KOH → K[Al(OH)₄]  (как кислота — амфотерность)' },
  { inputs: ['AlOH3', 'heat'],          effects: { precipitate: { color: '#ECEFF1' } }, description: '2Al(OH)₃ → Al₂O₃ + 3H₂O  (разложение при нагревании)' },

  // ── Zn(OH)₂ ──────────────────────────────────────────────────────────────
  { inputs: ['ZnOH2'],                  effects: { precipitate: { color: '#B0BEC5' } }, description: '' },
  { inputs: ['ZnOH2', 'HCl'],           effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'Zn(OH)₂ + 2HCl → ZnCl₂ + 2H₂O  (как основание)' },
  { inputs: ['ZnOH2', 'H2SO4_dilut'],   effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'Zn(OH)₂ + H₂SO₄ → ZnSO₄ + 2H₂O  (как основание)' },
  { inputs: ['ZnOH2', 'NaOH'],          effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'Zn(OH)₂ + 2NaOH → Na₂[Zn(OH)₄]  (как кислота — амфотерность)' },
  { inputs: ['ZnOH2', 'KOH'],           effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'Zn(OH)₂ + 2KOH → K₂[Zn(OH)₄]  (как кислота — амфотерность)' },
  { inputs: ['ZnOH2', 'NH3'],           effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'Zn(OH)₂ + 4NH₃ → [Zn(NH₃)₄](OH)₂  (растворяется в избытке аммиака)' },
  { inputs: ['ZnOH2', 'heat'],          effects: { precipitate: { color: '#F5F5F5' } }, description: 'Zn(OH)₂ → ZnO + H₂O  (разложение при нагревании)' },

  // ── Cr(OH)₃ ──────────────────────────────────────────────────────────────
  { inputs: ['CrOH3'],                  effects: { precipitate: { color: '#78909C' } }, description: '' },
  { inputs: ['CrOH3', 'HCl'],           effects: { liquidColor: 'rgba(27,94,32,0.45)' }, description: 'Cr(OH)₃ + 3HCl → CrCl₃ + 3H₂O  (как основание)' },
  { inputs: ['CrOH3', 'H2SO4_dilut'],   effects: { liquidColor: 'rgba(27,94,32,0.45)' }, description: '2Cr(OH)₃ + 3H₂SO₄ → Cr₂(SO₄)₃ + 6H₂O  (как основание)' },
  { inputs: ['CrOH3', 'NaOH'],          effects: { liquidColor: 'rgba(30,100,30,0.38)' }, description: 'Cr(OH)₃ + NaOH → Na[Cr(OH)₄]  (как кислота — амфотерность, изумрудный раствор)' },
  { inputs: ['CrOH3', 'KOH'],           effects: { liquidColor: 'rgba(30,100,30,0.38)' }, description: 'Cr(OH)₃ + KOH → K[Cr(OH)₄]  (как кислота — амфотерность)' },
  { inputs: ['CrOH3', 'NaOH', 'H2O2'],  effects: { liquidColor: 'rgba(255,210,0,0.72)' }, description: '2Cr(OH)₃ + 3H₂O₂ + 4NaOH → 2Na₂CrO₄ + 8H₂O  (Восстановитель: Cr³⁺ → Cr⁶⁺)' },
  { inputs: ['CrOH3', 'heat'],          effects: { precipitate: { color: '#2E7D32' } }, description: '2Cr(OH)₃ → Cr₂O₃ + 3H₂O  (разложение при нагревании)' },

  // ── Cu(OH)₂ и Fe(OH)₃ — нерастворимые основания ──────────────────────────
  { inputs: ['CuOH2'],                  effects: { precipitate: { color: '#4FC3F7' } }, description: '' },
  { inputs: ['CuOH2', 'HCl'],           effects: { liquidColor: 'rgba(30,136,229,0.28)' }, description: 'Cu(OH)₂ + 2HCl → CuCl₂ + 2H₂O' },
  { inputs: ['CuOH2', 'H2SO4_dilut'],   effects: { liquidColor: 'rgba(30,136,229,0.28)' }, description: 'Cu(OH)₂ + H₂SO₄ → CuSO₄ + 2H₂O' },
  { inputs: ['CuOH2', 'HNO3_dilut'],    effects: { liquidColor: 'rgba(30,136,229,0.28)' }, description: 'Cu(OH)₂ + 2HNO₃ → Cu(NO₃)₂ + 2H₂O' },
  { inputs: ['CuOH2', 'NH3'],           effects: { liquidColor: 'rgba(40,53,147,0.72)' }, description: 'Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄](OH)₂  (ярко-синий раствор — качественная реакция)' },
  { inputs: ['CuOH2', 'heat'],          effects: { precipitate: { color: '#212121' } }, description: 'Cu(OH)₂ → CuO + H₂O  (голубой осадок чернеет при нагревании)' },
  { inputs: ['FeOH3'],                  effects: { precipitate: { color: '#BF360C' } }, description: '' },
  { inputs: ['FeOH3', 'HCl'],           effects: { liquidColor: 'rgba(141,110,99,0.45)' }, description: 'Fe(OH)₃ + 3HCl → FeCl₃ + 3H₂O' },
  { inputs: ['FeOH3', 'H2SO4_dilut'],   effects: { liquidColor: 'rgba(141,110,99,0.40)' }, description: '2Fe(OH)₃ + 3H₂SO₄ → Fe₂(SO₄)₃ + 6H₂O' },
  { inputs: ['FeOH3', 'HNO3_dilut'],    effects: { liquidColor: 'rgba(141,110,99,0.40)' }, description: 'Fe(OH)₃ + 3HNO₃ → Fe(NO₃)₃ + 3H₂O' },
  { inputs: ['FeOH3', 'heat'],          effects: { precipitate: { color: '#BF360C' } }, description: '2Fe(OH)₃ → Fe₂O₃ + 3H₂O  (разложение при нагревании)' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ЗАДАНИЕ 7: ЩЁЛОЧИ KOH и Ba(OH)₂ ──────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════

  // KOH — полный аналог NaOH
  { inputs: ['KOH', 'phenolphthalein'], effects: { liquidColor: 'rgba(233,30,140,0.55)' }, description: 'Фенолфталеин — индикатор щелочной среды (KOH)' },
  { inputs: ['CuSO4', 'KOH'],  effects: { liquidColor: 'rgba(129,212,250,0.22)', precipitate: { color: '#4FC3F7' } }, description: 'CuSO₄ + 2KOH → Cu(OH)₂↓ + K₂SO₄' },
  { inputs: ['FeCl3', 'KOH'],  effects: { liquidColor: 'rgba(200,200,200,0.15)', precipitate: { color: '#BF360C' } }, description: 'FeCl₃ + 3KOH → Fe(OH)₃↓ + 3KCl' },
  { inputs: ['FeCl2', 'KOH'],  effects: { liquidColor: 'rgba(200,200,200,0.15)', precipitate: { color: '#78909C' } }, description: 'FeCl₂ + 2KOH → Fe(OH)₂↓ + 2KCl' },
  { inputs: ['FeSO4', 'KOH'],  effects: { liquidColor: 'rgba(200,200,200,0.15)', precipitate: { color: '#78909C' } }, description: 'FeSO₄ + 2KOH → Fe(OH)₂↓ + K₂SO₄' },
  { inputs: ['AlCl3', 'KOH'],  effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } }, description: 'AlCl₃ + 3KOH → Al(OH)₃↓ + 3KCl' },
  { inputs: ['ZnSO4', 'KOH'],  effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } }, description: 'ZnSO₄ + 2KOH → Zn(OH)₂↓ + K₂SO₄' },
  { inputs: ['CrCl3', 'KOH'],  effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#78909C' } }, description: 'CrCl₃ + 3KOH → Cr(OH)₃↓ + 3KCl' },
  { inputs: ['CoCl2', 'KOH'],  effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#80DEEA' } }, description: 'CoCl₂ + 2KOH → Co(OH)₂↓ + 2KCl' },
  { inputs: ['NiSO4', 'KOH'],  effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#9CCC65' } }, description: 'NiSO₄ + 2KOH → Ni(OH)₂↓ + K₂SO₄' },
  { inputs: ['PbNO32', 'KOH'], effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } }, description: 'Pb(NO₃)₂ + 2KOH → Pb(OH)₂↓ + 2KNO₃' },
  { inputs: ['AlCl3', 'KOH', 'KOH'],  effects: { liquidColor: 'rgba(200,200,200,0.08)' }, description: 'AlCl₃ + 4KOH → K[Al(OH)₄] + 3KCl  (избыток щёлочи — осадок растворяется)' },
  { inputs: ['ZnSO4', 'KOH', 'KOH'],  effects: { liquidColor: 'rgba(200,200,200,0.08)' }, description: 'ZnSO₄ + 4KOH → K₂[Zn(OH)₄] + K₂SO₄  (избыток щёлочи — осадок растворяется)' },
  { inputs: ['KOH', 'HCl'],           effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'KOH + HCl → KCl + H₂O  (нейтрализация)' },
  { inputs: ['KOH', 'H2SO4_dilut'],   effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: '2KOH + H₂SO₄ → K₂SO₄ + 2H₂O  (нейтрализация)' },
  { inputs: ['KOH', 'HNO3_dilut'],    effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'KOH + HNO₃ → KNO₃ + H₂O  (нейтрализация)' },
  { inputs: ['KOH', 'CO2'],           effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'CO₂ + 2KOH → K₂CO₃ + H₂O' },
  { inputs: ['KOH', 'SO2'],           effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'SO₂ + 2KOH → K₂SO₃ + H₂O' },
  { inputs: ['KOH', 'Cl2'],           effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'Cl₂ + 2KOH → KCl + KClO + H₂O  (на холоду)' },
  { inputs: ['KOH', 'Zn_s'],          effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true }, description: 'Zn + 2KOH + 2H₂O → K₂[Zn(OH)₄] + H₂↑' },
  { inputs: ['KOH', 'Al_s'],          effects: { liquidColor: 'rgba(200,200,200,0.08)', gas: true }, description: '2Al + 2KOH + 6H₂O → 2K[Al(OH)₄] + 3H₂↑' },

  // Ba(OH)₂ — сильное основание, даёт нерастворимые соли бария
  { inputs: ['BaOH2', 'phenolphthalein'], effects: { liquidColor: 'rgba(233,30,140,0.55)' }, description: 'Фенолфталеин — индикатор щелочной среды (Ba(OH)₂)' },
  { inputs: ['BaOH2', 'H2SO4_dilut'],  effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'Ba(OH)₂ + H₂SO₄ → BaSO₄↓ + 2H₂O  (нейтрализация с осадком)' },
  { inputs: ['BaOH2', 'H2SO4_conc'],   effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'Ba(OH)₂ + H₂SO₄ → BaSO₄↓ + 2H₂O' },
  { inputs: ['BaOH2', 'HCl'],          effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'Ba(OH)₂ + 2HCl → BaCl₂ + 2H₂O' },
  { inputs: ['BaOH2', 'HNO3_dilut'],   effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'Ba(OH)₂ + 2HNO₃ → Ba(NO₃)₂ + 2H₂O' },
  { inputs: ['BaOH2', 'CO2'],          effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'CO₂ + Ba(OH)₂ → BaCO₃↓ + H₂O  (баритовая вода мутнеет)' },
  { inputs: ['BaOH2', 'SO2'],          effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'SO₂ + Ba(OH)₂ → BaSO₃↓ + H₂O' },
  { inputs: ['BaOH2', 'Na2SO4'],       effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'Ba(OH)₂ + Na₂SO₄ → BaSO₄↓ + 2NaOH' },
  { inputs: ['BaOH2', 'Na2CO3'],       effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'Ba(OH)₂ + Na₂CO₃ → BaCO₃↓ + 2NaOH' },
  { inputs: ['BaOH2', 'Na2SO3'],       effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'Ba(OH)₂ + Na₂SO₃ → BaSO₃↓ + 2NaOH' },
  { inputs: ['BaOH2', 'Na3PO4'],       effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: '3Ba(OH)₂ + 2Na₃PO₄ → Ba₃(PO₄)₂↓ + 6NaOH' },
  { inputs: ['BaOH2', 'CuSO4'],        effects: { liquidColor: 'rgba(129,212,250,0.18)', precipitate: { color: '#4FC3F7' } }, description: 'CuSO₄ + Ba(OH)₂ → Cu(OH)₂↓ + BaSO₄↓  (выпадают сразу два осадка)' },
  { inputs: ['BaOH2', 'NH4Cl'],        effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true }, description: 'Ba(OH)₂ + 2NH₄Cl → BaCl₂ + 2NH₃↑ + 2H₂O' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ЗАДАНИЕ 7: КИСЛОТЫ H₃PO₄, H₂S, CH₃COOH ──────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════

  // H₃PO₄ — трёхосновная кислота средней силы
  { inputs: ['H3PO4', 'NaOH'],    effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'H₃PO₄ + 3NaOH → Na₃PO₄ + 3H₂O' },
  { inputs: ['H3PO4', 'KOH'],     effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'H₃PO₄ + 3KOH → K₃PO₄ + 3H₂O' },
  { inputs: ['H3PO4', 'CaOH2'],   effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: '2H₃PO₄ + 3Ca(OH)₂ → Ca₃(PO₄)₂↓ + 6H₂O' },
  { inputs: ['H3PO4', 'BaOH2'],   effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: '2H₃PO₄ + 3Ba(OH)₂ → Ba₃(PO₄)₂↓ + 6H₂O' },
  { inputs: ['H3PO4', 'AgNO3'],   effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#F9A825' } }, description: 'H₃PO₄ + 3AgNO₃ → Ag₃PO₄↓ + 3HNO₃  (жёлтый осадок)' },
  { inputs: ['H3PO4', 'Na2CO3'],  effects: { gas: true }, description: '2H₃PO₄ + 3Na₂CO₃ → 2Na₃PO₄ + 3H₂O + 3CO₂↑  (более сильная кислота вытесняет слабую)' },
  { inputs: ['H3PO4', 'Mg_s'],    effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2H₃PO₄ + 3Mg → Mg₃(PO₄)₂ + 3H₂↑' },
  { inputs: ['H3PO4', 'Zn_s'],    effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2H₃PO₄ + 3Zn → Zn₃(PO₄)₂ + 3H₂↑' },
  { inputs: ['H3PO4', 'CuO'],     effects: { liquidColor: 'rgba(30,136,229,0.24)' }, description: '2H₃PO₄ + 3CuO → Cu₃(PO₄)₂ + 3H₂O' },

  // H₂S — сероводородная кислота: осаждает сульфиды, легко окисляется
  { inputs: ['H2S_aq', 'CuSO4'],   effects: { liquidColor: 'rgba(30,30,30,0.45)', precipitate: { color: '#212121' } }, description: 'CuSO₄ + H₂S → CuS↓ + H₂SO₄  (чёрный осадок, идёт даже в кислой среде)' },
  { inputs: ['H2S_aq', 'PbNO32'],  effects: { liquidColor: 'rgba(20,20,20,0.50)', precipitate: { color: '#212121' } }, description: 'Pb(NO₃)₂ + H₂S → PbS↓ + 2HNO₃  (качественная реакция на H₂S)' },
  { inputs: ['H2S_aq', 'AgNO3'],   effects: { liquidColor: 'rgba(30,30,30,0.35)', precipitate: { color: '#1A1A1A' } }, description: '2AgNO₃ + H₂S → Ag₂S↓ + 2HNO₃' },
  { inputs: ['H2S_aq', 'NaOH'],    effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'H₂S + 2NaOH → Na₂S + 2H₂O' },
  { inputs: ['H2S_aq', 'KOH'],     effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'H₂S + 2KOH → K₂S + 2H₂O' },
  { inputs: ['H2S_aq', 'Cl2'],     effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#FDD835' } }, description: 'H₂S + Cl₂ → S↓ + 2HCl  (Окислитель: Cl₂ → 2Cl⁻, Восстановитель: S²⁻ → S⁰)' },
  { inputs: ['H2S_aq', 'Br2'],     effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#FDD835' } }, description: 'H₂S + Br₂ → S↓ + 2HBr  (бромная вода обесцвечивается)' },
  { inputs: ['H2S_aq', 'H2O2'],    effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#FDD835' } }, description: 'H₂S + H₂O₂ → S↓ + 2H₂O' },
  { inputs: ['H2S_aq', 'KMnO4'],   effects: { liquidColor: 'rgba(180,160,50,0.22)', precipitate: { color: '#FDD835' } }, description: '2KMnO₄ + 5H₂S + 3H₂SO₄ → 2MnSO₄ + 5S↓ + K₂SO₄ + 8H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺)' },
  { inputs: ['H2S_aq', 'SO2'],     effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#FDD835' } }, description: '2H₂S + SO₂ → 3S↓ + 2H₂O  (сопропорционирование: S²⁻ + S⁴⁺ → S⁰)' },
  { inputs: ['H2S_aq', 'FeCl3'],   effects: { liquidColor: 'rgba(100,160,100,0.28)', precipitate: { color: '#FDD835' } }, description: '2FeCl₃ + H₂S → 2FeCl₂ + S↓ + 2HCl  (Окислитель: Fe³⁺ → Fe²⁺)' },

  // CH₃COOH — слабая кислота
  { inputs: ['CH3COOH', 'NaOH'],    effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'CH₃COOH + NaOH → CH₃COONa + H₂O' },
  { inputs: ['CH3COOH', 'KOH'],     effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'CH₃COOH + KOH → CH₃COOK + H₂O' },
  { inputs: ['CH3COOH', 'Na2CO3'],  effects: { gas: true }, description: '2CH₃COOH + Na₂CO₃ → 2CH₃COONa + H₂O + CO₂↑' },
  { inputs: ['CH3COOH', 'NaHCO3'],  effects: { gas: true }, description: 'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑' },
  { inputs: ['CH3COOH', 'CaCO3'],   effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + H₂O + CO₂↑' },
  { inputs: ['CH3COOH', 'Mg_s'],    effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2CH₃COOH + Mg → (CH₃COO)₂Mg + H₂↑' },
  { inputs: ['CH3COOH', 'Zn_s'],    effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2CH₃COOH + Zn → (CH₃COO)₂Zn + H₂↑' },
  { inputs: ['CH3COOH', 'CuOH2'],   effects: { liquidColor: 'rgba(30,136,229,0.24)' }, description: '2CH₃COOH + Cu(OH)₂ → (CH₃COO)₂Cu + 2H₂O' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ЗАДАНИЕ 7: СОЛИ АММОНИЯ, КИСЛЫЕ И СРЕДНИЕ СОЛИ ──────────────────────
  // ══════════════════════════════════════════════════════════════════════════════

  // Соли аммония + щёлочь → NH₃↑ (качественная реакция на NH₄⁺)
  { inputs: ['NH4Cl', 'NaOH'],           effects: { liquidColor: 'rgba(200,220,200,0.08)', gas: true }, description: 'NH₄Cl + NaOH → NaCl + NH₃↑ + H₂O  (качественная реакция на NH₄⁺ — резкий запах)' },
  { inputs: ['NH4Cl', 'KOH'],            effects: { liquidColor: 'rgba(200,220,200,0.08)', gas: true }, description: 'NH₄Cl + KOH → KCl + NH₃↑ + H₂O  (качественная реакция на NH₄⁺)' },
  { inputs: ['NH4Cl', 'CaOH2'],          effects: { liquidColor: 'rgba(200,220,200,0.08)', gas: true }, description: '2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2NH₃↑ + 2H₂O' },
  { inputs: ['NH42SO4', 'NaOH'],         effects: { liquidColor: 'rgba(200,220,200,0.08)', gas: true }, description: '(NH₄)₂SO₄ + 2NaOH → Na₂SO₄ + 2NH₃↑ + 2H₂O  (качественная реакция на NH₄⁺)' },
  { inputs: ['NH42SO4', 'KOH'],          effects: { liquidColor: 'rgba(200,220,200,0.08)', gas: true }, description: '(NH₄)₂SO₄ + 2KOH → K₂SO₄ + 2NH₃↑ + 2H₂O' },
  { inputs: ['NH42SO4', 'BaCl2'],        effects: { precipitate: { color: '#C5D0DA' } }, description: '(NH₄)₂SO₄ + BaCl₂ → BaSO₄↓ + 2NH₄Cl' },
  { inputs: ['NH4Cl', 'AgNO3'],          effects: { precipitate: { color: '#B0BEC5' } }, description: 'NH₄Cl + AgNO₃ → AgCl↓ + NH₄NO₃' },
  { inputs: ['NH4Cl', 'heat'],           effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true }, description: 'NH₄Cl → NH₃↑ + HCl↑  (возгонка: разлагается и снова соединяется на холодной стенке)' },

  // KNO₃ — нитрат, разложение при нагревании
  { inputs: ['KNO3', 'heat'],            effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true }, description: '2KNO₃ → 2KNO₂ + O₂↑  (разложение нитрата активного металла)' },
  { inputs: ['KNO3', 'H2SO4_conc'],      effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'KNO₃ + H₂SO₄(конц) → KHSO₄ + HNO₃  (получение азотной кислоты)' },
  { inputs: ['KNO3', 'Cu_s', 'H2SO4_dilut'], effects: { liquidColor: 'rgba(30,136,229,0.32)', gas: true }, description: '3Cu + 8KNO₃ + 4H₂SO₄ → 3Cu(NO₃)₂ + 2NO↑ + 4K₂SO₄ + 4H₂O  (нитрат в кислой среде окисляет медь)' },

  // K₂CO₃ — карбонат калия, аналог Na₂CO₃
  { inputs: ['K2CO3', 'HCl'],            effects: { gas: true }, description: 'K₂CO₃ + 2HCl → 2KCl + H₂O + CO₂↑' },
  { inputs: ['K2CO3', 'H2SO4_dilut'],    effects: { gas: true }, description: 'K₂CO₃ + H₂SO₄ → K₂SO₄ + H₂O + CO₂↑' },
  { inputs: ['K2CO3', 'HNO3_dilut'],     effects: { gas: true }, description: 'K₂CO₃ + 2HNO₃ → 2KNO₃ + H₂O + CO₂↑' },
  { inputs: ['K2CO3', 'CaCl2'],          effects: { precipitate: { color: '#C5D0DA' } }, description: 'K₂CO₃ + CaCl₂ → CaCO₃↓ + 2KCl' },
  { inputs: ['K2CO3', 'BaCl2'],          effects: { precipitate: { color: '#C5D0DA' } }, description: 'K₂CO₃ + BaCl₂ → BaCO₃↓ + 2KCl' },
  { inputs: ['K2CO3', 'CaOH2'],          effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' } }, description: 'K₂CO₃ + Ca(OH)₂ → CaCO₃↓ + 2KOH' },
  { inputs: ['K2CO3', 'CuSO4'],          effects: { liquidColor: 'rgba(38,166,154,0.15)', precipitate: { color: '#26A69A' }, gas: true }, description: '2CuSO₄ + 2K₂CO₃ + H₂O → (CuOH)₂CO₃↓ + 2K₂SO₄ + CO₂↑  (двойной гидролиз)' },
  { inputs: ['K2CO3', 'AlCl3'],          effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' }, gas: true }, description: '2AlCl₃ + 3K₂CO₃ + 3H₂O → 2Al(OH)₃↓ + 3CO₂↑ + 6KCl  (двойной гидролиз)' },
  { inputs: ['K2CO3', 'CH3COOH'],        effects: { gas: true }, description: '2CH₃COOH + K₂CO₃ → 2CH₃COOK + H₂O + CO₂↑' },

  // NaCl — качественная реакция на хлорид и получение HCl
  { inputs: ['NaCl', 'AgNO3'],           effects: { precipitate: { color: '#B0BEC5' } }, description: 'NaCl + AgNO₃ → AgCl↓ + NaNO₃  (качественная реакция на Cl⁻)' },
  { inputs: ['NaCl', 'PbNO32'],          effects: { precipitate: { color: '#B0BEC5' } }, description: '2NaCl + Pb(NO₃)₂ → PbCl₂↓ + 2NaNO₃' },
  { inputs: ['NaCl', 'H2SO4_conc'],      effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true }, description: '2NaCl + H₂SO₄(конц) → Na₂SO₄ + 2HCl↑  (получение хлороводорода)' },
  { inputs: ['NaCl', 'H2SO4_conc', 'MnO2', 'heat'], effects: { liquidColor: 'rgba(185,215,55,0.25)', gas: true }, description: '2NaCl + 2H₂SO₄ + MnO₂ → Cl₂↑ + MnSO₄ + Na₂SO₄ + 2H₂O  (лабораторное получение хлора)' },

  // NaHSO₄ — кислая соль, в растворе ведёт себя как кислота
  { inputs: ['NaHSO4', 'NaOH'],          effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'NaHSO₄ + NaOH → Na₂SO₄ + H₂O  (кислая соль нейтрализуется щёлочью)' },
  { inputs: ['NaHSO4', 'KOH'],           effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'NaHSO₄ + KOH → NaKSO₄ + H₂O' },
  { inputs: ['NaHSO4', 'Na2CO3'],        effects: { gas: true }, description: '2NaHSO₄ + Na₂CO₃ → 2Na₂SO₄ + H₂O + CO₂↑  (ведёт себя как кислота)' },
  { inputs: ['NaHSO4', 'NaHCO3'],        effects: { gas: true }, description: 'NaHSO₄ + NaHCO₃ → Na₂SO₄ + H₂O + CO₂↑' },
  { inputs: ['NaHSO4', 'BaCl2'],         effects: { precipitate: { color: '#C5D0DA' } }, description: '2NaHSO₄ + BaCl₂ → BaSO₄↓ + Na₂SO₄ + 2HCl' },
  { inputs: ['NaHSO4', 'Zn_s'],          effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2NaHSO₄ + Zn → ZnSO₄ + Na₂SO₄ + H₂↑' },
  { inputs: ['NaHSO4', 'Mg_s'],          effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2NaHSO₄ + Mg → MgSO₄ + Na₂SO₄ + H₂↑' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── НЕОБРАТИМЫЙ ГИДРОЛИЗ БИНАРНЫХ СОЕДИНЕНИЙ (задание 32) ────────────────
  //    В пробирке вода, поэтому реакция идёт сразу при добавлении вещества
  // ══════════════════════════════════════════════════════════════════════════════
  {
    inputs: ['Al2S3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' }, gas: true },
    description: 'Al₂S₃ + 6H₂O → 2Al(OH)₃↓ + 3H₂S↑  (необратимый гидролиз — в растворе Al₂S₃ не существует)',
  },
  {
    inputs: ['Al4C3'],
    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' }, gas: true },
    description: 'Al₄C₃ + 12H₂O → 4Al(OH)₃↓ + 3CH₄↑  (необратимый гидролиз карбида алюминия)',
  },
  {
    inputs: ['CaC2'],
    effects: { liquidColor: 'rgba(220,240,220,0.12)', gas: true },
    description: 'CaC₂ + 2H₂O → Ca(OH)₂ + C₂H₂↑  (получение ацетилена)',
  },
  {
    inputs: ['Mg3N2'],
    effects: { liquidColor: 'rgba(200,220,200,0.10)', precipitate: { color: '#FAFAFA' }, gas: true },
    description: 'Mg₃N₂ + 6H₂O → 3Mg(OH)₂↓ + 2NH₃↑  (необратимый гидролиз нитрида магния)',
  },
  {
    inputs: ['Ca3P2'],
    effects: { liquidColor: 'rgba(220,240,220,0.12)', gas: true },
    description: 'Ca₃P₂ + 6H₂O → 3Ca(OH)₂ + 2PH₃↑  (необратимый гидролиз фосфида кальция)',
  },
  {
    inputs: ['Na2O2'],
    effects: { liquidColor: 'rgba(220,240,220,0.14)', gas: true },
    description: '2Na₂O₂ + 2H₂O → 4NaOH + O₂↑  (пероксид натрия разлагается водой)',
  },
  { inputs: ['Na2O2', 'CO2'],  effects: { liquidColor: 'rgba(200,220,200,0.10)', gas: true }, description: '2Na₂O₂ + 2CO₂ → 2Na₂CO₃ + O₂↑  (регенерация воздуха в подводных лодках)' },
  { inputs: ['Na2O2', 'HCl'],  effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: '2Na₂O₂ + 4HCl → 4NaCl + 2H₂O + O₂↑' },
  { inputs: ['Al2S3', 'HCl'],  effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: 'Al₂S₃ + 6HCl → 2AlCl₃ + 3H₂S↑' },
  { inputs: ['CaC2', 'HCl'],   effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: 'CaC₂ + 2HCl → CaCl₂ + C₂H₂↑' },
  { inputs: ['Al4C3', 'HCl'],  effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: 'Al₄C₃ + 12HCl → 4AlCl₃ + 3CH₄↑' },
  { inputs: ['Mg3N2', 'HCl'],  effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'Mg₃N₂ + 8HCl → 3MgCl₂ + 2NH₄Cl' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ХРОМ: переход хромат ↔ дихромат, Cr₂(SO₄)₃, CrO₃ ────────────────────
  // ══════════════════════════════════════════════════════════════════════════════

  // Хромат (жёлтый) ⇄ дихромат (оранжевый) — зависит от среды
  { inputs: ['K2CrO4'],                 effects: { liquidColor: 'rgba(255,214,0,0.62)' }, description: '' },
  { inputs: ['K2CrO4', 'H2SO4_dilut'],  effects: { liquidColor: 'rgba(245,127,23,0.58)' }, description: '2K₂CrO₄ + H₂SO₄ → K₂Cr₂O₇ + K₂SO₄ + H₂O  (в кислой среде жёлтый хромат → оранжевый дихромат)' },
  { inputs: ['K2CrO4', 'HCl'],          effects: { liquidColor: 'rgba(245,127,23,0.58)' }, description: '2K₂CrO₄ + 2HCl → K₂Cr₂O₇ + 2KCl + H₂O  (жёлтый → оранжевый)' },
  { inputs: ['K2CrO4', 'BaCl2'],        effects: { liquidColor: 'rgba(255,214,0,0.30)', precipitate: { color: '#FDD835' } }, description: 'K₂CrO₄ + BaCl₂ → BaCrO₄↓ + 2KCl  (жёлтый осадок)' },
  { inputs: ['K2CrO4', 'PbNO32'],       effects: { liquidColor: 'rgba(255,214,0,0.25)', precipitate: { color: '#FFC107' } }, description: 'K₂CrO₄ + Pb(NO₃)₂ → PbCrO₄↓ + 2KNO₃  (жёлтый крон)' },
  { inputs: ['K2CrO4', 'AgNO3'],        effects: { liquidColor: 'rgba(255,214,0,0.25)', precipitate: { color: '#BF360C' } }, description: 'K₂CrO₄ + 2AgNO₃ → Ag₂CrO₄↓ + 2KNO₃  (кирпично-красный осадок)' },
  { inputs: ['K2CrO4', 'KI', 'H2SO4_dilut'], effects: { liquidColor: 'rgba(80,50,0,0.70)' }, description: '2K₂CrO₄ + 6KI + 8H₂SO₄ → Cr₂(SO₄)₃ + 3I₂ + 5K₂SO₄ + 8H₂O  (Окислитель: Cr⁶⁺ → Cr³⁺)' },

  // Cr₂(SO₄)₃ — соль хрома(III), ведёт себя как CrCl₃
  { inputs: ['Cr2SO43'],                effects: { liquidColor: 'rgba(27,94,32,0.50)' }, description: '' },
  { inputs: ['Cr2SO43', 'NaOH'],        effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#78909C' } }, description: 'Cr₂(SO₄)₃ + 6NaOH → 2Cr(OH)₃↓ + 3Na₂SO₄' },
  { inputs: ['Cr2SO43', 'KOH'],         effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#78909C' } }, description: 'Cr₂(SO₄)₃ + 6KOH → 2Cr(OH)₃↓ + 3K₂SO₄' },
  { inputs: ['Cr2SO43', 'NaOH', 'NaOH'], effects: { liquidColor: 'rgba(30,100,30,0.38)' }, description: 'Cr₂(SO₄)₃ + 8NaOH → 2Na[Cr(OH)₄] + 3Na₂SO₄  (избыток щёлочи — осадок растворяется)' },
  { inputs: ['Cr2SO43', 'NaOH', 'H2O2'], effects: { liquidColor: 'rgba(255,210,0,0.72)' }, description: 'Cr₂(SO₄)₃ + 3H₂O₂ + 10NaOH → 2Na₂CrO₄ + 3Na₂SO₄ + 8H₂O  (Восстановитель: Cr³⁺ → Cr⁶⁺)' },
  { inputs: ['Cr2SO43', 'NH3'],         effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' } }, description: 'Cr₂(SO₄)₃ + 6NH₃ + 6H₂O → 2Cr(OH)₃↓ + 3(NH₄)₂SO₄' },
  { inputs: ['Cr2SO43', 'BaCl2'],       effects: { liquidColor: 'rgba(27,94,32,0.40)', precipitate: { color: '#C5D0DA' } }, description: 'Cr₂(SO₄)₃ + 3BaCl₂ → 3BaSO₄↓ + 2CrCl₃' },
  { inputs: ['Cr2SO43', 'Na2CO3'],      effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#78909C' }, gas: true }, description: 'Cr₂(SO₄)₃ + 3Na₂CO₃ + 3H₂O → 2Cr(OH)₃↓ + 3CO₂↑ + 3Na₂SO₄  (двойной гидролиз)' },
  { inputs: ['Cr2SO43', 'Na2S'],        effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' }, gas: true }, description: 'Cr₂(SO₄)₃ + 3Na₂S + 6H₂O → 2Cr(OH)₃↓ + 3H₂S↑ + 3Na₂SO₄  (двойной гидролиз)' },
  { inputs: ['Cr2SO43', 'KMnO4', 'H2SO4_dilut'], effects: { liquidColor: 'rgba(245,127,23,0.58)' }, description: '10Cr³⁺ + 6MnO₄⁻ + 11H₂O → 5Cr₂O₇²⁻ + 6Mn²⁺ + 22H⁺  (Восстановитель: Cr³⁺ → Cr⁶⁺)' },

  // CrO₃ — кислотный оксид хрома(VI), сильнейший окислитель
  { inputs: ['CrO3'],                   effects: { liquidColor: 'rgba(245,127,23,0.55)' }, description: 'CrO₃ + H₂O → H₂CrO₄  (хромовая кислота)' },
  { inputs: ['CrO3', 'NaOH'],           effects: { liquidColor: 'rgba(255,214,0,0.62)' }, description: 'CrO₃ + 2NaOH → Na₂CrO₄ + H₂O  (жёлтый хромат)' },
  { inputs: ['CrO3', 'KOH'],            effects: { liquidColor: 'rgba(255,214,0,0.62)' }, description: 'CrO₃ + 2KOH → K₂CrO₄ + H₂O' },
  { inputs: ['CrO3', 'heat'],           effects: { precipitate: { color: '#2E7D32' }, gas: true }, description: '4CrO₃ → 2Cr₂O₃ + 3O₂↑  (разложение при нагревании)' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── РАЗЛОЖЕНИЕ НИТРАТОВ ПРИ НАГРЕВАНИИ ───────────────────────────────────
  //    Продукт зависит от положения металла в ряду активности
  // ══════════════════════════════════════════════════════════════════════════════
  {
    inputs: ['NaNO3', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: '2NaNO₃ → 2NaNO₂ + O₂↑  (металл до Mg: нитрат → нитрит + O₂)',
  },
  {
    inputs: ['CuNO32', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#212121' }, gas: true },
    description: '2Cu(NO₃)₂ → 2CuO↓ + 4NO₂↑ + O₂↑  (металл от Mg до Cu: оксид + NO₂ + O₂)',
  },
  {
    inputs: ['AgNO3', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C0C0C0' }, gas: true },
    description: '2AgNO₃ → 2Ag↓ + 2NO₂↑ + O₂↑  (металл после Cu: свободный металл + NO₂ + O₂)',
  },
  {
    inputs: ['NH4NO3', 'heat'],
    effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true },
    description: 'NH₄NO₃ → N₂O↑ + 2H₂O  (разложение нитрата аммония)',
  },
  { inputs: ['PbNO32', 'heat'], effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#FDD835' }, gas: true }, description: '2Pb(NO₃)₂ → 2PbO↓ + 4NO₂↑ + O₂↑' },
  { inputs: ['NH4NO3', 'NaOH'], effects: { liquidColor: 'rgba(200,220,200,0.08)', gas: true }, description: 'NH₄NO₃ + NaOH → NaNO₃ + NH₃↑ + H₂O  (качественная реакция на NH₄⁺)' },
  { inputs: ['NaNO3', 'Cu_s', 'H2SO4_dilut'], effects: { liquidColor: 'rgba(30,136,229,0.32)', gas: true }, description: '3Cu + 8NaNO₃ + 4H₂SO₄ → 3Cu(NO₃)₂ + 2NO↑ + 4Na₂SO₄ + 4H₂O' },
  { inputs: ['NaNO3', 'H2SO4_conc'], effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'NaNO₃ + H₂SO₄(конц) → NaHSO₄ + HNO₃  (получение азотной кислоты)' },

  // ── KClO₃ — бертолетова соль ─────────────────────────────────────────────
  { inputs: ['KClO3', 'heat'],              effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true }, description: '2KClO₃ → 2KCl + 3O₂↑  (разложение с катализатором MnO₂)' },
  { inputs: ['KClO3', 'MnO2', 'heat'],      effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true }, description: '2KClO₃ → 2KCl + 3O₂↑  (MnO₂ — катализатор, лабораторное получение кислорода)' },
  { inputs: ['KClO3', 'HCl'],               effects: { liquidColor: 'rgba(185,215,55,0.25)', gas: true }, description: 'KClO₃ + 6HCl → KCl + 3Cl₂↑ + 3H₂O  (сопропорционирование: Cl⁵⁺ + Cl⁻ → Cl₂)' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── СОЛИ: Cu(NO₃)₂, CuCl₂, MgCl₂, Al₂(SO₄)₃, Fe₂(SO₄)₃, MnSO₄, KBr ──────
  // ══════════════════════════════════════════════════════════════════════════════

  // Cu(NO₃)₂ и CuCl₂ — как CuSO₄
  { inputs: ['CuNO32'],           effects: { liquidColor: 'rgba(30,136,229,0.28)' }, description: '' },
  { inputs: ['CuNO32', 'NaOH'],   effects: { liquidColor: 'rgba(129,212,250,0.22)', precipitate: { color: '#4FC3F7' } }, description: 'Cu(NO₃)₂ + 2NaOH → Cu(OH)₂↓ + 2NaNO₃' },
  { inputs: ['CuNO32', 'KOH'],    effects: { liquidColor: 'rgba(129,212,250,0.22)', precipitate: { color: '#4FC3F7' } }, description: 'Cu(NO₃)₂ + 2KOH → Cu(OH)₂↓ + 2KNO₃' },
  { inputs: ['CuNO32', 'NH3'],    effects: { liquidColor: 'rgba(40,53,147,0.72)' }, description: 'Cu(NO₃)₂ + 4NH₃ → [Cu(NH₃)₄](NO₃)₂  (ярко-синий раствор)' },
  { inputs: ['CuNO32', 'Na2S'],   effects: { liquidColor: 'rgba(30,30,30,0.50)', precipitate: { color: '#212121' } }, description: 'Cu(NO₃)₂ + Na₂S → CuS↓ + 2NaNO₃' },
  { inputs: ['CuNO32', 'Fe_s'],   effects: { liquidColor: 'rgba(100,160,100,0.30)', precipitate: { color: '#B87333' } }, description: 'Fe + Cu(NO₃)₂ → Fe(NO₃)₂ + Cu↓' },
  { inputs: ['CuNO32', 'Zn_s'],   effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B87333' } }, description: 'Zn + Cu(NO₃)₂ → Zn(NO₃)₂ + Cu↓' },
  { inputs: ['CuCl2'],            effects: { liquidColor: 'rgba(38,166,154,0.35)' }, description: '' },
  { inputs: ['CuCl2', 'NaOH'],    effects: { liquidColor: 'rgba(129,212,250,0.22)', precipitate: { color: '#4FC3F7' } }, description: 'CuCl₂ + 2NaOH → Cu(OH)₂↓ + 2NaCl' },
  { inputs: ['CuCl2', 'AgNO3'],   effects: { liquidColor: 'rgba(30,136,229,0.26)', precipitate: { color: '#B0BEC5' } }, description: 'CuCl₂ + 2AgNO₃ → 2AgCl↓ + Cu(NO₃)₂' },
  { inputs: ['CuCl2', 'Na2S'],    effects: { liquidColor: 'rgba(30,30,30,0.50)', precipitate: { color: '#212121' } }, description: 'CuCl₂ + Na₂S → CuS↓ + 2NaCl' },
  { inputs: ['CuCl2', 'NH3'],     effects: { liquidColor: 'rgba(40,53,147,0.72)' }, description: 'CuCl₂ + 4NH₃ → [Cu(NH₃)₄]Cl₂' },
  { inputs: ['CuCl2', 'Fe_s'],    effects: { liquidColor: 'rgba(100,160,100,0.30)', precipitate: { color: '#B87333' } }, description: 'Fe + CuCl₂ → FeCl₂ + Cu↓' },

  // MgCl₂ и MgSO₄-подобные
  { inputs: ['MgCl2', 'NaOH'],    effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#FAFAFA' } }, description: 'MgCl₂ + 2NaOH → Mg(OH)₂↓ + 2NaCl  (белый осадок)' },
  { inputs: ['MgCl2', 'KOH'],     effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#FAFAFA' } }, description: 'MgCl₂ + 2KOH → Mg(OH)₂↓ + 2KCl' },
  { inputs: ['MgCl2', 'Na2CO3'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#F5F5F5' } }, description: 'MgCl₂ + Na₂CO₃ → MgCO₃↓ + 2NaCl' },
  { inputs: ['MgCl2', 'Na3PO4'],  effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#FAFAFA' } }, description: '3MgCl₂ + 2Na₃PO₄ → Mg₃(PO₄)₂↓ + 6NaCl' },
  { inputs: ['MgCl2', 'AgNO3'],   effects: { precipitate: { color: '#B0BEC5' } }, description: 'MgCl₂ + 2AgNO₃ → 2AgCl↓ + Mg(NO₃)₂' },

  // Al₂(SO₄)₃ — как AlCl₃
  { inputs: ['Al2SO43', 'NaOH'],           effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } }, description: 'Al₂(SO₄)₃ + 6NaOH → 2Al(OH)₃↓ + 3Na₂SO₄' },
  { inputs: ['Al2SO43', 'NaOH', 'NaOH'],   effects: { liquidColor: 'rgba(200,200,200,0.08)' }, description: 'Al₂(SO₄)₃ + 8NaOH → 2Na[Al(OH)₄] + 3Na₂SO₄  (избыток щёлочи)' },
  { inputs: ['Al2SO43', 'NH3'],            effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' } }, description: 'Al₂(SO₄)₃ + 6NH₃ + 6H₂O → 2Al(OH)₃↓ + 3(NH₄)₂SO₄' },
  { inputs: ['Al2SO43', 'BaCl2'],          effects: { precipitate: { color: '#C5D0DA' } }, description: 'Al₂(SO₄)₃ + 3BaCl₂ → 3BaSO₄↓ + 2AlCl₃' },
  { inputs: ['Al2SO43', 'Na2CO3'],         effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' }, gas: true }, description: 'Al₂(SO₄)₃ + 3Na₂CO₃ + 3H₂O → 2Al(OH)₃↓ + 3CO₂↑ + 3Na₂SO₄  (двойной гидролиз)' },
  { inputs: ['Al2SO43', 'Na2S'],           effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' }, gas: true }, description: 'Al₂(SO₄)₃ + 3Na₂S + 6H₂O → 2Al(OH)₃↓ + 3H₂S↑ + 3Na₂SO₄  (двойной гидролиз)' },

  // Fe₂(SO₄)₃ — соль железа(III)
  { inputs: ['Fe2SO43'],           effects: { liquidColor: 'rgba(141,110,99,0.45)' }, description: '' },
  { inputs: ['Fe2SO43', 'NaOH'],   effects: { liquidColor: 'rgba(200,200,200,0.12)', precipitate: { color: '#BF360C' } }, description: 'Fe₂(SO₄)₃ + 6NaOH → 2Fe(OH)₃↓ + 3Na₂SO₄' },
  { inputs: ['Fe2SO43', 'KI'],     effects: { liquidColor: 'rgba(120,60,0,0.55)' }, description: 'Fe₂(SO₄)₃ + 2KI → 2FeSO₄ + I₂ + K₂SO₄  (Окислитель: Fe³⁺ → Fe²⁺)' },
  { inputs: ['Fe2SO43', 'Na2S'],   effects: { liquidColor: 'rgba(100,160,100,0.30)', precipitate: { color: '#FDD835' } }, description: 'Fe₂(SO₄)₃ + Na₂S → 2FeSO₄ + S↓ + Na₂SO₄  (Окислитель: Fe³⁺ → Fe²⁺)' },
  { inputs: ['Fe2SO43', 'BaCl2'],  effects: { liquidColor: 'rgba(141,110,99,0.35)', precipitate: { color: '#C5D0DA' } }, description: 'Fe₂(SO₄)₃ + 3BaCl₂ → 3BaSO₄↓ + 2FeCl₃' },
  { inputs: ['Fe2SO43', 'Fe_s'],   effects: { liquidColor: 'rgba(100,160,100,0.32)' }, description: 'Fe₂(SO₄)₃ + Fe → 3FeSO₄  (Fe восстанавливает Fe³⁺ → Fe²⁺)' },
  { inputs: ['Fe2SO43', 'Cu_s'],   effects: { liquidColor: 'rgba(100,160,100,0.28)' }, description: 'Fe₂(SO₄)₃ + Cu → 2FeSO₄ + CuSO₄  (медь растворяется)' },

  // MnSO₄ — соль марганца(II)
  { inputs: ['MnSO4'],             effects: { liquidColor: 'rgba(248,187,208,0.30)' }, description: '' },
  { inputs: ['MnSO4', 'NaOH'],     effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#FAFAFA' } }, description: 'MnSO₄ + 2NaOH → Mn(OH)₂↓ + Na₂SO₄  (белый осадок, буреет на воздухе)' },
  { inputs: ['MnSO4', 'Na2S'],     effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#F8BBD0' } }, description: 'MnSO₄ + Na₂S → MnS↓ + Na₂SO₄  (телесно-розовый осадок)' },
  { inputs: ['MnSO4', 'BaCl2'],    effects: { liquidColor: 'rgba(248,187,208,0.25)', precipitate: { color: '#C5D0DA' } }, description: 'MnSO₄ + BaCl₂ → BaSO₄↓ + MnCl₂' },
  { inputs: ['MnSO4', 'KMnO4'],    effects: { liquidColor: 'rgba(180,160,80,0.25)', precipitate: { color: '#5D4037' } }, description: '3MnSO₄ + 2KMnO₄ + 2H₂O → 5MnO₂↓ + K₂SO₄ + 2H₂SO₄  (сопропорционирование: Mn²⁺ + Mn⁷⁺ → Mn⁴⁺)' },

  // KBr — бромид, вытеснение галогенов
  { inputs: ['KBr', 'Cl2'],          effects: { liquidColor: 'rgba(150,50,0,0.65)' }, description: '2KBr + Cl₂ → 2KCl + Br₂  (Окислитель: Cl₂ → 2Cl⁻, Восстановитель: Br⁻ → Br₂)' },
  { inputs: ['KBr', 'AgNO3'],        effects: { precipitate: { color: '#FFF59D' } }, description: 'KBr + AgNO₃ → AgBr↓ + KNO₃  (качественная реакция на Br⁻ — светло-жёлтый осадок)' },
  { inputs: ['KBr', 'PbNO32'],       effects: { precipitate: { color: '#FFF9C4' } }, description: '2KBr + Pb(NO₃)₂ → PbBr₂↓ + 2KNO₃' },
  { inputs: ['KBr', 'H2SO4_conc'],   effects: { liquidColor: 'rgba(150,50,0,0.60)', gas: true }, description: '2KBr + 2H₂SO₄(конц) → Br₂ + SO₂↑ + K₂SO₄ + 2H₂O  (Окислитель: S⁶⁺ → S⁴⁺, Восстановитель: Br⁻ → Br₂)' },
  { inputs: ['KBr', 'KMnO4', 'H2SO4_dilut'], effects: { liquidColor: 'rgba(150,50,0,0.62)' }, description: '10KBr + 2KMnO₄ + 8H₂SO₄ → 5Br₂ + 2MnSO₄ + 6K₂SO₄ + 8H₂O  (Окислитель: Mn⁷⁺ → Mn²⁺)' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── НЕРАСТВОРИМЫЕ СОЛИ И ОКСИДЫ CO, Cu₂O, Fe₃O₄ ─────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  { inputs: ['FeS'],                effects: { precipitate: { color: '#37474F' } }, description: '' },
  { inputs: ['FeS', 'HCl'],         effects: { liquidColor: 'rgba(100,160,100,0.30)', gas: true }, description: 'FeS + 2HCl → FeCl₂ + H₂S↑  (лабораторное получение сероводорода)' },
  { inputs: ['FeS', 'H2SO4_dilut'], effects: { liquidColor: 'rgba(100,160,100,0.30)', gas: true }, description: 'FeS + H₂SO₄ → FeSO₄ + H₂S↑' },
  { inputs: ['BaCO3'],              effects: { precipitate: { color: '#FAFAFA' } }, description: '' },
  { inputs: ['BaCO3', 'HCl'],       effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: 'BaCO₃ + 2HCl → BaCl₂ + H₂O + CO₂↑' },
  { inputs: ['BaCO3', 'heat'],      effects: { precipitate: { color: '#F5F5F5' }, gas: true }, description: 'BaCO₃ → BaO + CO₂↑  (термическое разложение)' },
  { inputs: ['MgCO3'],              effects: { precipitate: { color: '#F5F5F5' } }, description: '' },
  { inputs: ['MgCO3', 'HCl'],       effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: 'MgCO₃ + 2HCl → MgCl₂ + H₂O + CO₂↑' },
  { inputs: ['MgCO3', 'heat'],      effects: { precipitate: { color: '#FAFAFA' }, gas: true }, description: 'MgCO₃ → MgO + CO₂↑  (термическое разложение)' },
  { inputs: ['CaSO4'],              effects: { precipitate: { color: '#ECEFF1' } }, description: '' },
  { inputs: ['CaSO4', 'Na2CO3'],    effects: { precipitate: { color: '#C5D0DA' } }, description: 'CaSO₄ + Na₂CO₃ → CaCO₃↓ + Na₂SO₄  (перевод в более нерастворимую соль)' },

  // CO — угарный газ, восстановитель при нагревании
  { inputs: ['CO', 'CuO', 'heat'],    effects: { precipitate: { color: '#B87333' }, gas: true }, description: 'CuO + CO → Cu + CO₂↑  (восстановление оксида угарным газом)' },
  { inputs: ['CO', 'Fe2O3', 'heat'],  effects: { precipitate: { color: '#546E7A' }, gas: true }, description: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂↑  (доменный процесс)' },
  { inputs: ['CO', 'Fe3O4', 'heat'],  effects: { precipitate: { color: '#546E7A' }, gas: true }, description: 'Fe₃O₄ + 4CO → 3Fe + 4CO₂↑' },

  // Cu₂O и Fe₃O₄
  { inputs: ['Cu2O'],                 effects: { precipitate: { color: '#D84315' } }, description: '' },
  { inputs: ['Cu2O', 'H2SO4_dilut'],  effects: { liquidColor: 'rgba(30,136,229,0.28)', precipitate: { color: '#B87333' } }, description: 'Cu₂O + H₂SO₄ → CuSO₄ + Cu↓ + H₂O  (диспропорционирование: Cu⁺ → Cu⁰ + Cu²⁺)' },
  { inputs: ['Cu2O', 'HNO3_dilut'],   effects: { liquidColor: 'rgba(30,136,229,0.32)', gas: true }, description: '3Cu₂O + 14HNO₃ → 6Cu(NO₃)₂ + 2NO↑ + 7H₂O' },
  { inputs: ['Fe3O4'],                effects: { precipitate: { color: '#263238' } }, description: '' },
  { inputs: ['Fe3O4', 'HCl'],         effects: { liquidColor: 'rgba(141,110,99,0.45)' }, description: 'Fe₃O₄ + 8HCl → FeCl₂ + 2FeCl₃ + 4H₂O  (смешанный оксид даёт две соли)' },
  { inputs: ['Fe3O4', 'Al_s', 'heat'], effects: { precipitate: { color: '#546E7A' } }, description: '3Fe₃O₄ + 8Al → 9Fe + 4Al₂O₃  (термит)' },

  // ── Барий как металл ─────────────────────────────────────────────────────
  { inputs: ['Ba_s'],               effects: { liquidColor: 'rgba(220,240,220,0.14)', gas: true }, description: 'Ba + 2H₂O → Ba(OH)₂ + H₂↑' },
  { inputs: ['Ba_s', 'HCl'],        effects: { liquidColor: 'rgba(200,200,200,0.06)', gas: true }, description: 'Ba + 2HCl → BaCl₂ + H₂↑' },
  { inputs: ['Ba_s', 'H2SO4_dilut'], effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' }, gas: true }, description: 'Ba + H₂SO₄ → BaSO₄↓ + H₂↑' },
  { inputs: ['Ba_s', 'phenolphthalein'], effects: { liquidColor: 'rgba(233,30,140,0.50)', gas: true }, description: 'Ba + 2H₂O → Ba(OH)₂ + H₂↑;  индикатор малиновый' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ГАЛОГЕНИДЫ: качественные реакции с AgNO₃ ─────────────────────────────
  //    AgCl белый · AgBr светло-жёлтый · AgI жёлтый · AgF растворим
  // ══════════════════════════════════════════════════════════════════════════════
  { inputs: ['NaBr', 'AgNO3'],   effects: { precipitate: { color: '#FFF59D' } }, description: 'NaBr + AgNO₃ → AgBr↓ + NaNO₃  (светло-жёлтый осадок — качественная реакция на Br⁻)' },
  { inputs: ['AlBr3', 'AgNO3'],  effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#FFF59D' } }, description: 'AlBr₃ + 3AgNO₃ → 3AgBr↓ + Al(NO₃)₃' },
  { inputs: ['CrBr3', 'AgNO3'],  effects: { liquidColor: 'rgba(27,94,32,0.42)', precipitate: { color: '#FFF59D' } }, description: 'CrBr₃ + 3AgNO₃ → 3AgBr↓ + Cr(NO₃)₃' },
  { inputs: ['FeBr3', 'AgNO3'],  effects: { liquidColor: 'rgba(141,110,99,0.40)', precipitate: { color: '#FFF59D' } }, description: 'FeBr₃ + 3AgNO₃ → 3AgBr↓ + Fe(NO₃)₃' },
  { inputs: ['FeBr2', 'AgNO3'],  effects: { liquidColor: 'rgba(100,160,100,0.28)', precipitate: { color: '#FFF59D' } }, description: 'FeBr₂ + 2AgNO₃ → 2AgBr↓ + Fe(NO₃)₂' },
  { inputs: ['MgBr2', 'AgNO3'],  effects: { precipitate: { color: '#FFF59D' } }, description: 'MgBr₂ + 2AgNO₃ → 2AgBr↓ + Mg(NO₃)₂' },
  { inputs: ['BaBr2', 'AgNO3'],  effects: { precipitate: { color: '#FFF59D' } }, description: 'BaBr₂ + 2AgNO₃ → 2AgBr↓ + Ba(NO₃)₂' },
  { inputs: ['ZnBr2', 'AgNO3'],  effects: { precipitate: { color: '#FFF59D' } }, description: 'ZnBr₂ + 2AgNO₃ → 2AgBr↓ + Zn(NO₃)₂' },
  { inputs: ['CuBr2', 'AgNO3'],  effects: { liquidColor: 'rgba(30,136,229,0.26)', precipitate: { color: '#FFF59D' } }, description: 'CuBr₂ + 2AgNO₃ → 2AgBr↓ + Cu(NO₃)₂' },
  { inputs: ['NaI', 'AgNO3'],    effects: { precipitate: { color: '#F9A825' } }, description: 'NaI + AgNO₃ → AgI↓ + NaNO₃  (жёлтый осадок — качественная реакция на I⁻)' },
  { inputs: ['AlI3', 'AgNO3'],   effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#F9A825' } }, description: 'AlI₃ + 3AgNO₃ → 3AgI↓ + Al(NO₃)₃' },
  { inputs: ['MgI2', 'AgNO3'],   effects: { precipitate: { color: '#F9A825' } }, description: 'MgI₂ + 2AgNO₃ → 2AgI↓ + Mg(NO₃)₂' },
  { inputs: ['BaI2', 'AgNO3'],   effects: { precipitate: { color: '#F9A825' } }, description: 'BaI₂ + 2AgNO₃ → 2AgI↓ + Ba(NO₃)₂' },
  { inputs: ['ZnI2', 'AgNO3'],   effects: { precipitate: { color: '#F9A825' } }, description: 'ZnI₂ + 2AgNO₃ → 2AgI↓ + Zn(NO₃)₂' },
  { inputs: ['KCl', 'AgNO3'],    effects: { precipitate: { color: '#B0BEC5' } }, description: 'KCl + AgNO₃ → AgCl↓ + KNO₃  (белый творожистый осадок)' },
  { inputs: ['ZnCl2', 'AgNO3'],  effects: { precipitate: { color: '#B0BEC5' } }, description: 'ZnCl₂ + 2AgNO₃ → 2AgCl↓ + Zn(NO₃)₂' },
  { inputs: ['MnCl2', 'AgNO3'],  effects: { liquidColor: 'rgba(248,187,208,0.25)', precipitate: { color: '#B0BEC5' } }, description: 'MnCl₂ + 2AgNO₃ → 2AgCl↓ + Mn(NO₃)₂' },
  { inputs: ['NiCl2', 'AgNO3'],  effects: { liquidColor: 'rgba(100,200,100,0.30)', precipitate: { color: '#B0BEC5' } }, description: 'NiCl₂ + 2AgNO₃ → 2AgCl↓ + Ni(NO₃)₂' },
  // Фторид — осадка НЕТ, AgF растворим (важное отличие)
  { inputs: ['NaF', 'AgNO3'],    effects: {}, description: 'NaF + AgNO₃ — осадок не выпадает: AgF растворим  (отличие F⁻ от остальных галогенидов)' },

  // ── Pb²⁺ + галогенид ─────────────────────────────────────────────────────
  { inputs: ['NaI', 'PbNO32'],   effects: { precipitate: { color: '#FFC107' } }, description: '2NaI + Pb(NO₃)₂ → PbI₂↓ + 2NaNO₃  («золотой дождь»)' },
  { inputs: ['NaBr', 'PbNO32'],  effects: { precipitate: { color: '#FFF9C4' } }, description: '2NaBr + Pb(NO₃)₂ → PbBr₂↓ + 2NaNO₃' },
  { inputs: ['KCl', 'PbNO32'],   effects: { precipitate: { color: '#B0BEC5' } }, description: '2KCl + Pb(NO₃)₂ → PbCl₂↓ + 2KNO₃' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ВЫТЕСНЕНИЕ ГАЛОГЕНОВ: Cl₂ > Br₂ > I₂ ────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  { inputs: ['NaBr', 'Cl2'],   effects: { liquidColor: 'rgba(150,50,0,0.65)' }, description: '2NaBr + Cl₂ → 2NaCl + Br₂  (Окислитель: Cl₂ → 2Cl⁻, Восстановитель: Br⁻ → Br₂)' },
  { inputs: ['MgBr2', 'Cl2'],  effects: { liquidColor: 'rgba(150,50,0,0.65)' }, description: 'MgBr₂ + Cl₂ → MgCl₂ + Br₂' },
  { inputs: ['BaBr2', 'Cl2'],  effects: { liquidColor: 'rgba(150,50,0,0.65)' }, description: 'BaBr₂ + Cl₂ → BaCl₂ + Br₂' },
  { inputs: ['ZnBr2', 'Cl2'],  effects: { liquidColor: 'rgba(150,50,0,0.65)' }, description: 'ZnBr₂ + Cl₂ → ZnCl₂ + Br₂' },
  { inputs: ['AlBr3', 'Cl2'],  effects: { liquidColor: 'rgba(150,50,0,0.62)' }, description: '2AlBr₃ + 3Cl₂ → 2AlCl₃ + 3Br₂' },
  { inputs: ['NaI', 'Cl2'],    effects: { liquidColor: 'rgba(110,45,0,0.78)' }, description: '2NaI + Cl₂ → 2NaCl + I₂  (бурый раствор йода)' },
  { inputs: ['NaI', 'Br2'],    effects: { liquidColor: 'rgba(110,45,0,0.78)' }, description: '2NaI + Br₂ → 2NaBr + I₂  (Окислитель: Br₂ → 2Br⁻, Восстановитель: I⁻ → I₂)' },
  { inputs: ['MgI2', 'Cl2'],   effects: { liquidColor: 'rgba(110,45,0,0.78)' }, description: 'MgI₂ + Cl₂ → MgCl₂ + I₂' },
  { inputs: ['MgI2', 'Br2'],   effects: { liquidColor: 'rgba(110,45,0,0.78)' }, description: 'MgI₂ + Br₂ → MgBr₂ + I₂' },
  { inputs: ['BaI2', 'Cl2'],   effects: { liquidColor: 'rgba(110,45,0,0.78)' }, description: 'BaI₂ + Cl₂ → BaCl₂ + I₂' },
  { inputs: ['ZnI2', 'Cl2'],   effects: { liquidColor: 'rgba(110,45,0,0.78)' }, description: 'ZnI₂ + Cl₂ → ZnCl₂ + I₂' },
  { inputs: ['AlI3', 'Cl2'],   effects: { liquidColor: 'rgba(110,45,0,0.75)' }, description: '2AlI₃ + 3Cl₂ → 2AlCl₃ + 3I₂' },
  // Обратное вытеснение невозможно
  { inputs: ['KCl', 'Br2'],    effects: {}, description: 'KCl + Br₂ — реакция не идёт: бром слабее хлора и не вытесняет его' },
  { inputs: ['NaBr', 'I2'],    effects: {}, description: 'NaBr + I₂ — реакция не идёт: йод слабее брома' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ГАЛОГЕНИДЫ + КОНЦ. H₂SO₄: глубина восстановления серы растёт ────────
  //    Cl⁻ → HCl (не окисляется) · Br⁻ → Br₂ + SO₂ · I⁻ → I₂ + H₂S
  // ══════════════════════════════════════════════════════════════════════════════
  { inputs: ['KCl', 'H2SO4_conc'],   effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true }, description: '2KCl + H₂SO₄(конц) → K₂SO₄ + 2HCl↑  (хлорид-ион не окисляется)' },
  { inputs: ['NaBr', 'H2SO4_conc'],  effects: { liquidColor: 'rgba(150,50,0,0.60)', gas: true }, description: '2NaBr + 2H₂SO₄(конц) → Br₂ + SO₂↑ + Na₂SO₄ + 2H₂O  (Окислитель: S⁶⁺ → S⁴⁺)' },
  { inputs: ['MgBr2', 'H2SO4_conc'], effects: { liquidColor: 'rgba(150,50,0,0.60)', gas: true }, description: 'MgBr₂ + 2H₂SO₄(конц) → Br₂ + SO₂↑ + MgSO₄ + 2H₂O' },
  { inputs: ['NaI', 'H2SO4_conc'],   effects: { liquidColor: 'rgba(110,45,0,0.72)', gas: true }, description: '8NaI + 5H₂SO₄(конц) → 4I₂ + H₂S↑ + 4Na₂SO₄ + 4H₂O  (Окислитель: S⁶⁺ → S²⁻ — самая глубокая степень)' },
  { inputs: ['MgI2', 'H2SO4_conc'],  effects: { liquidColor: 'rgba(110,45,0,0.72)', gas: true }, description: '8MgI₂ + 9H₂SO₄(конц) → 8I₂ + H₂S↑ + 8MgSO₄ + 8H₂O' },
  // Фторид — получение плавиковой кислоты
  { inputs: ['CaF2'],                    effects: { precipitate: { color: '#ECEFF1' } }, description: '' },
  { inputs: ['CaF2', 'H2SO4_conc'],      effects: { liquidColor: 'rgba(200,200,200,0.05)', precipitate: { color: '#C5D0DA' }, gas: true }, description: 'CaF₂ + H₂SO₄(конц) → CaSO₄↓ + 2HF↑  (получение плавиковой кислоты)' },
  { inputs: ['NaF', 'H2SO4_conc'],       effects: { liquidColor: 'rgba(200,200,200,0.05)', gas: true }, description: '2NaF + H₂SO₄(конц) → Na₂SO₄ + 2HF↑' },
  { inputs: ['HF', 'SiO2'],              effects: { liquidColor: 'rgba(200,200,200,0.06)' }, description: 'SiO₂ + 4HF → SiF₄↑ + 2H₂O  (плавиковая кислота растворяет стекло)' },
  { inputs: ['HF', 'NaOH'],              effects: { liquidColor: 'rgba(200,200,200,0.05)' }, description: 'HF + NaOH → NaF + H₂O' },
  { inputs: ['HF', 'CaCl2'],             effects: { precipitate: { color: '#ECEFF1' } }, description: '2HF + CaCl₂ → CaF₂↓ + 2HCl' },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── ГИДРОЛИЗ И ОСАЖДЕНИЕ: AlBr₃, CrBr₃, FeBr₃ и прочие ──────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  { inputs: ['AlBr3'],                   effects: { liquidColor: 'rgba(236,239,241,0.10)' }, description: '' },
  { inputs: ['AlBr3', 'NaOH'],           effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } }, description: 'AlBr₃ + 3NaOH → Al(OH)₃↓ + 3NaBr' },
  { inputs: ['AlBr3', 'NaOH', 'NaOH'],   effects: { liquidColor: 'rgba(200,200,200,0.08)' }, description: 'AlBr₃ + 4NaOH → Na[Al(OH)₄] + 3NaBr  (избыток щёлочи — осадок растворяется)' },
  { inputs: ['AlBr3', 'NH3'],            effects: { liquidColor: 'rgba(200,200,200,0.06)', precipitate: { color: '#B0BEC5' } }, description: 'AlBr₃ + 3NH₃ + 3H₂O → Al(OH)₃↓ + 3NH₄Br' },
  { inputs: ['AlBr3', 'Na2CO3'],         effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' }, gas: true }, description: '2AlBr₃ + 3Na₂CO₃ + 3H₂O → 2Al(OH)₃↓ + 3CO₂↑ + 6NaBr  (двойной гидролиз)' },
  { inputs: ['AlBr3', 'Na2S'],           effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#B0BEC5' }, gas: true }, description: '2AlBr₃ + 3Na₂S + 6H₂O → 2Al(OH)₃↓ + 3H₂S↑ + 6NaBr  (двойной гидролиз)' },

  { inputs: ['CrBr3'],                   effects: { liquidColor: 'rgba(27,94,32,0.50)' }, description: '' },
  { inputs: ['CrBr3', 'NaOH'],           effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#78909C' } }, description: 'CrBr₃ + 3NaOH → Cr(OH)₃↓ + 3NaBr' },
  { inputs: ['CrBr3', 'NaOH', 'NaOH'],   effects: { liquidColor: 'rgba(30,100,30,0.38)' }, description: 'CrBr₃ + 4NaOH → Na[Cr(OH)₄] + 3NaBr  (избыток щёлочи)' },
  { inputs: ['CrBr3', 'NaOH', 'H2O2'],   effects: { liquidColor: 'rgba(255,210,0,0.72)' }, description: '2CrBr₃ + 3H₂O₂ + 10NaOH → 2Na₂CrO₄ + 6NaBr + 8H₂O  (Восстановитель: Cr³⁺ → Cr⁶⁺)' },
  { inputs: ['CrBr3', 'NH3'],            effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' } }, description: 'CrBr₃ + 3NH₃ + 3H₂O → Cr(OH)₃↓ + 3NH₄Br' },
  { inputs: ['CrBr3', 'Na2S'],           effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#78909C' }, gas: true }, description: '2CrBr₃ + 3Na₂S + 6H₂O → 2Cr(OH)₃↓ + 3H₂S↑ + 6NaBr  (двойной гидролиз)' },
  { inputs: ['CrBr3', 'Cl2', 'NaOH'],    effects: { liquidColor: 'rgba(255,210,0,0.72)' }, description: '2CrBr₃ + 3Cl₂ + 16NaOH → 2Na₂CrO₄ + 6NaCl + 6NaBr + 8H₂O' },

  { inputs: ['FeBr3'],                   effects: { liquidColor: 'rgba(141,110,99,0.48)' }, description: '' },
  { inputs: ['FeBr3', 'NaOH'],           effects: { liquidColor: 'rgba(200,200,200,0.12)', precipitate: { color: '#BF360C' } }, description: 'FeBr₃ + 3NaOH → Fe(OH)₃↓ + 3NaBr' },
  { inputs: ['FeBr3', 'KI'],             effects: { liquidColor: 'rgba(120,60,0,0.55)' }, description: '2FeBr₃ + 2KI → 2FeBr₂ + I₂ + 2KBr  (Окислитель: Fe³⁺ → Fe²⁺)' },
  { inputs: ['FeBr3', 'NaI'],            effects: { liquidColor: 'rgba(120,60,0,0.55)' }, description: '2FeBr₃ + 2NaI → 2FeBr₂ + I₂ + 2NaBr  (поэтому FeI₃ не существует)' },
  { inputs: ['FeBr3', 'Na2S'],           effects: { liquidColor: 'rgba(100,160,100,0.30)', precipitate: { color: '#FDD835' } }, description: '2FeBr₃ + Na₂S → 2FeBr₂ + S↓ + 2NaBr  (Окислитель: Fe³⁺ → Fe²⁺)' },
  { inputs: ['FeBr2'],                   effects: { liquidColor: 'rgba(100,160,100,0.32)' }, description: '' },
  { inputs: ['FeBr2', 'NaOH'],           effects: { liquidColor: 'rgba(200,200,200,0.12)', precipitate: { color: '#78909C' } }, description: 'FeBr₂ + 2NaOH → Fe(OH)₂↓ + 2NaBr' },
  { inputs: ['FeBr2', 'Cl2'],            effects: { liquidColor: 'rgba(150,100,20,0.52)' }, description: '6FeBr₂ + 3Cl₂ → 4FeBr₃ + 2FeCl₃  (Окислитель: Cl₂, Восстановитель: Fe²⁺ → Fe³⁺)' },
  { inputs: ['FeBr2', 'Br2'],            effects: { liquidColor: 'rgba(141,110,99,0.48)' }, description: '2FeBr₂ + Br₂ → 2FeBr₃  (Окислитель: Br₂, Восстановитель: Fe²⁺ → Fe³⁺)' },

  // ── ZnBr₂, ZnI₂, ZnCl₂ — амфотерный цинк ────────────────────────────────
  { inputs: ['ZnCl2', 'NaOH'],           effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } }, description: 'ZnCl₂ + 2NaOH → Zn(OH)₂↓ + 2NaCl' },
  { inputs: ['ZnCl2', 'NaOH', 'NaOH'],   effects: { liquidColor: 'rgba(200,200,200,0.08)' }, description: 'ZnCl₂ + 4NaOH → Na₂[Zn(OH)₄] + 2NaCl  (избыток щёлочи)' },
  { inputs: ['ZnCl2', 'NH3'],            effects: { liquidColor: 'rgba(200,200,200,0.08)' }, description: 'ZnCl₂ + 4NH₃ → [Zn(NH₃)₄]Cl₂' },
  { inputs: ['ZnCl2', 'Na2S'],           effects: { precipitate: { color: '#B0BEC5' } }, description: 'ZnCl₂ + Na₂S → ZnS↓ + 2NaCl' },
  { inputs: ['ZnBr2', 'NaOH'],           effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#B0BEC5' } }, description: 'ZnBr₂ + 2NaOH → Zn(OH)₂↓ + 2NaBr' },
  { inputs: ['ZnBr2', 'NaOH', 'NaOH'],   effects: { liquidColor: 'rgba(200,200,200,0.08)' }, description: 'ZnBr₂ + 4NaOH → Na₂[Zn(OH)₄] + 2NaBr  (избыток щёлочи)' },

  // ── MnCl₂, NiCl₂, CuBr₂, MgBr₂, BaBr₂, BaI₂ ─────────────────────────────
  { inputs: ['MnCl2', 'NaOH'],   effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#FAFAFA' } }, description: 'MnCl₂ + 2NaOH → Mn(OH)₂↓ + 2NaCl  (белый осадок, буреет на воздухе)' },
  { inputs: ['MnCl2', 'Na2S'],   effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#F8BBD0' } }, description: 'MnCl₂ + Na₂S → MnS↓ + 2NaCl  (телесно-розовый осадок)' },
  { inputs: ['MnCl2', 'KMnO4'],  effects: { liquidColor: 'rgba(180,160,80,0.25)', precipitate: { color: '#5D4037' } }, description: '3MnCl₂ + 2KMnO₄ + 2H₂O → 5MnO₂↓ + 2KCl + 4HCl  (сопропорционирование)' },
  { inputs: ['NiCl2', 'NaOH'],   effects: { liquidColor: 'rgba(200,200,200,0.10)', precipitate: { color: '#9CCC65' } }, description: 'NiCl₂ + 2NaOH → Ni(OH)₂↓ + 2NaCl' },
  { inputs: ['NiCl2', 'NH3'],    effects: { liquidColor: 'rgba(94,53,177,0.55)' }, description: 'NiCl₂ + 6NH₃ → [Ni(NH₃)₆]Cl₂  (сине-фиолетовый раствор)' },
  { inputs: ['NiCl2', 'Na2S'],   effects: { liquidColor: 'rgba(20,20,20,0.50)', precipitate: { color: '#1B5E20' } }, description: 'NiCl₂ + Na₂S → NiS↓ + 2NaCl' },
  { inputs: ['CuBr2', 'NaOH'],   effects: { liquidColor: 'rgba(129,212,250,0.22)', precipitate: { color: '#4FC3F7' } }, description: 'CuBr₂ + 2NaOH → Cu(OH)₂↓ + 2NaBr' },
  { inputs: ['CuBr2', 'NH3'],    effects: { liquidColor: 'rgba(40,53,147,0.72)' }, description: 'CuBr₂ + 4NH₃ → [Cu(NH₃)₄]Br₂' },
  { inputs: ['CuBr2', 'Na2S'],   effects: { liquidColor: 'rgba(30,30,30,0.50)', precipitate: { color: '#212121' } }, description: 'CuBr₂ + Na₂S → CuS↓ + 2NaBr' },
  { inputs: ['CuBr2', 'Fe_s'],   effects: { liquidColor: 'rgba(100,160,100,0.30)', precipitate: { color: '#B87333' } }, description: 'Fe + CuBr₂ → FeBr₂ + Cu↓' },
  { inputs: ['MgBr2', 'NaOH'],   effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#FAFAFA' } }, description: 'MgBr₂ + 2NaOH → Mg(OH)₂↓ + 2NaBr' },
  { inputs: ['MgBr2', 'Na2CO3'], effects: { liquidColor: 'rgba(200,200,200,0.08)', precipitate: { color: '#F5F5F5' } }, description: 'MgBr₂ + Na₂CO₃ → MgCO₃↓ + 2NaBr' },
  { inputs: ['BaBr2', 'Na2SO4'], effects: { precipitate: { color: '#C5D0DA' } }, description: 'BaBr₂ + Na₂SO₄ → BaSO₄↓ + 2NaBr' },
  { inputs: ['BaBr2', 'H2SO4_dilut'], effects: { precipitate: { color: '#C5D0DA' } }, description: 'BaBr₂ + H₂SO₄ → BaSO₄↓ + 2HBr' },
  { inputs: ['BaBr2', 'Na2CO3'], effects: { precipitate: { color: '#C5D0DA' } }, description: 'BaBr₂ + Na₂CO₃ → BaCO₃↓ + 2NaBr' },
  { inputs: ['BaI2', 'Na2SO4'],  effects: { precipitate: { color: '#C5D0DA' } }, description: 'BaI₂ + Na₂SO₄ → BaSO₄↓ + 2NaI' },
  { inputs: ['BaI2', 'H2SO4_dilut'], effects: { precipitate: { color: '#C5D0DA' } }, description: 'BaI₂ + H₂SO₄ → BaSO₄↓ + 2HI' },

  // ── Иодиды как восстановители ────────────────────────────────────────────
  { inputs: ['NaI', 'FeCl3'],            effects: { liquidColor: 'rgba(120,60,0,0.55)' }, description: '2FeCl₃ + 2NaI → 2FeCl₂ + I₂ + 2NaCl  (Окислитель: Fe³⁺ → Fe²⁺)' },
  { inputs: ['NaI', 'H2O2'],             effects: { liquidColor: 'rgba(110,45,0,0.72)' }, description: 'H₂O₂ + 2NaI → I₂ + 2NaOH  (Окислитель: O⁻¹ → O²⁻)' },
  { inputs: ['NaI', 'KMnO4', 'H2SO4_dilut'], effects: { liquidColor: 'rgba(100,50,0,0.80)' }, description: '10NaI + 2KMnO₄ + 8H₂SO₄ → 5I₂ + 2MnSO₄ + 5Na₂SO₄ + K₂SO₄ + 8H₂O' },
  { inputs: ['NaI', 'CuSO4'],            effects: { liquidColor: 'rgba(120,60,0,0.50)', precipitate: { color: '#ECEFF1' } }, description: '2CuSO₄ + 4NaI → 2CuI↓ + I₂ + 2Na₂SO₄  (Окислитель: Cu²⁺ → Cu⁺)' },
  { inputs: ['NaBr', 'KMnO4', 'H2SO4_dilut'], effects: { liquidColor: 'rgba(150,50,0,0.62)' }, description: '10NaBr + 2KMnO₄ + 8H₂SO₄ → 5Br₂ + 2MnSO₄ + 5Na₂SO₄ + K₂SO₄ + 8H₂O' },

  // ── KMnO₄ + Fe²⁺ в нейтральной среде ─────────────────────────────────────
  {
    inputs: ['KMnO4', 'FeSO4'],
    effects: { liquidColor: 'rgba(180,160,80,0.20)', precipitate: { color: '#5D4037' } },
    description: '3Fe²⁺ + MnO₄⁻ + 2H₂O → 3Fe³⁺ + MnO₂↓ + 4OH⁻  (нейтральная среда: Mn⁷⁺ → Mn⁴⁺, Fe²⁺ → Fe³⁺)',
  },
  {
    inputs: ['KMnO4', 'FeCl2'],
    effects: { liquidColor: 'rgba(180,160,80,0.20)', precipitate: { color: '#5D4037' } },
    description: '3Fe²⁺ + MnO₄⁻ + 2H₂O → 3Fe³⁺ + MnO₂↓ + 4OH⁻  (нейтральная среда: Mn⁷⁺ → Mn⁴⁺, Fe²⁺ → Fe³⁺)',
  },
]

// ── Сухой режим ───────────────────────────────────────────────────────────────

/**
 * Вещества, которые в пробирке существуют как твёрдые или газообразные.
 * Остальные реагенты считаются растворами: без воды их в пробирке нет,
 * значит и реакции ионного обмена между ними идти не могут.
 */
const SOLID_OR_GAS = new Set([
  // Металлы
  'Fe_s', 'Cu_s', 'Zn_s', 'Al_s', 'Mg_s', 'Na_s', 'K_s', 'Ca_s', 'Ba_s', 'Cr_s', 'Ag_s',
  // Неметаллы
  'S_s', 'C_s', 'P_s', 'Si_s',
  // Оксиды
  'CuO', 'Cu2O', 'Fe2O3', 'FeO', 'Fe3O4', 'Al2O3', 'ZnO', 'CaO', 'Na2O',
  'MgO', 'BaO', 'Cr2O3', 'MnO2', 'SiO2', 'P2O5', 'CrO3',
  // Гидроксиды
  'AlOH3', 'ZnOH2', 'CrOH3', 'CuOH2', 'FeOH3',
  // Бинарные и нерастворимые соли
  'Al2S3', 'Al4C3', 'CaC2', 'Mg3N2', 'Ca3P2', 'Na2O2',
  'CaCO3', 'BaCO3', 'MgCO3', 'CaSO4', 'FeS', 'CaF2',
  // Газы
  'SO2', 'CO2', 'SO3', 'CO', 'Cl2',
])

/**
 * Есть ли вода среди исходных веществ уравнения. Ищем H₂O слева от стрелки,
 * исключая пероксид H₂O₂ (в нём H₂O — лишь часть формулы).
 */
function needsWater(description: string): boolean {
  const left = description.split('→')[0]
  return /H₂O(?!₂)/.test(left)
}

/**
 * Может ли реакция идти в сухой пробирке.
 * Нельзя, если по уравнению нужна вода. Иначе — можно, когда это
 * прокаливание (есть токен heat) либо все реагенты твёрдые или газообразные.
 */
function canRunDry(rule: ReactionRule): boolean {
  if (needsWater(rule.description)) return false
  if (rule.inputs.includes('heat')) return true
  return rule.inputs.every((id) => id === 'heat' || SOLID_OR_GAS.has(id))
}

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

export function matchReactions(contents: string[], isDry = false): ReactionEffects {
  const usable = isDry ? REACTION_TABLE.filter(canRunDry) : REACTION_TABLE
  const matched = usable.filter((r) => ruleMatches(r.inputs, contents))
  const maximal = matched.filter((r) => !isSubsumed(r, matched))
  const out: ReactionEffects = {}
  const colors: string[] = []
  const gases: GasInfo[] = []
  for (const rule of maximal) {
    if (rule.effects.liquidColor !== undefined) colors.push(rule.effects.liquidColor)
    if (rule.effects.precipitate !== undefined) out.precipitate = rule.effects.precipitate
    if (rule.effects.gas !== undefined) out.gas = rule.effects.gas
    // Газ определяем по уравнению сработавшего правила
    if (rule.effects.gas) {
      for (const g of extractGases(rule.description)) {
        if (!gases.some((x) => x.formula === g.formula)) gases.push(g)
      }
    }
  }
  // Смешиваем цвета всех активных компонентов
  if (colors.length > 0) out.liquidColor = blendColors(colors)
  if (out.gas) out.gasInfo = pickGas(gases)
  return out
}

export function getReactionDescription(contents: string[], isDry = false): string | null {
  const usable = isDry ? REACTION_TABLE.filter(canRunDry) : REACTION_TABLE
  const fired = usable.filter((r) => r.description && ruleMatches(r.inputs, contents))
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
  '#FFC107': 'золотисто-жёлтый осадок (PbI₂ — «золотой дождь»)',
  '#4DB6AC': 'голубовато-зелёный осадок (CuSiO₃)',
  '#FFF9C4': 'светло-жёлтый осадок',
  '#ECEFF1': 'белый осадок (CuI↓)',
}

export function getPrecipitateLabel(color: string): string {
  return PRECIPITATE_LABELS[color] ?? 'осадок'
}
