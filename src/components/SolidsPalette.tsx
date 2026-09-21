// Список твёрдых веществ для палитры. Раньше здесь же жило окно палитры;
// теперь списки рисует ReagentDock, а файл остался справочником разделов.

// ── Секции твёрдых веществ ────────────────────────────────────────────────────

// Внутри раздела — порядок Периодической системы: по группе, затем по периоду
export const SOLID_SECTIONS: Array<{ label: string; ids: string[] }> = [
  { label: 'АКТИВНЫЕ МЕТАЛЛЫ', ids: ['Na_s', 'K_s', 'Mg_s', 'Ca_s', 'Ba_s', 'Al_s'] },
  { label: 'МЕТАЛЛЫ',          ids: ['Cr_s', 'Fe_s', 'Cu_s', 'Zn_s', 'Ag_s', 'Sn_s', 'Pb_s'] },
  { label: 'НЕМЕТАЛЛЫ',        ids: ['C_s', 'Si_s', 'P_s', 'S_s'] },
  {
    label: 'ОКСИДЫ МЕТАЛЛОВ',
    ids: ['Na2O', 'MgO', 'CaO', 'BaO', 'Al2O3', 'Cr2O3', 'MnO2', 'FeO', 'Fe2O3', 'Fe3O4', 'Cu2O', 'CuO', 'ZnO', 'PbO2'],
  },
  { label: 'КИСЛОТНЫЕ ОКСИДЫ', ids: ['CO', 'SiO2', 'P2O5', 'CrO3'] },
  { label: 'ГИДРОКСИДЫ',       ids: ['AlOH3', 'CrOH3', 'FeOH3', 'CuOH2', 'ZnOH2'] },
  { label: 'БИНАРНЫЕ (гидролиз)', ids: ['Na2O2', 'Mg3N2', 'CaC2', 'Ca3P2', 'Al4C3', 'Al2S3'] },
  { label: 'СОЛИ (тв.)',       ids: ['MgCO3', 'CaCO3', 'BaCO3', 'CaSO4', 'FeS', 'NaBiO3'] },
]
