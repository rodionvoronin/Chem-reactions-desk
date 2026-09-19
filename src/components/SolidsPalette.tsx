// Список твёрдых веществ для палитры. Раньше здесь же жило окно палитры;
// теперь списки рисует ReagentDock, а файл остался справочником разделов.

// ── Секции твёрдых веществ ────────────────────────────────────────────────────

export const SOLID_SECTIONS: Array<{ label: string; ids: string[] }> = [
  {
    label: 'АКТИВНЫЕ МЕТАЛЛЫ',
    ids: ['Na_s', 'K_s', 'Ca_s', 'Ba_s', 'Mg_s', 'Al_s'],
  },
  {
    label: 'МЕТАЛЛЫ',
    ids: ['Fe_s', 'Cu_s', 'Zn_s', 'Cr_s', 'Ag_s'],
  },
  {
    label: 'НЕМЕТАЛЛЫ',
    ids: ['S_s', 'C_s', 'P_s', 'Si_s'],
  },
  {
    label: 'ОКСИДЫ МЕТАЛЛОВ',
    ids: ['CuO', 'Cu2O', 'Fe2O3', 'FeO', 'Fe3O4', 'Al2O3', 'ZnO', 'CaO', 'Na2O', 'MgO', 'BaO', 'Cr2O3', 'MnO2'],
  },
  {
    label: 'КИСЛОТНЫЕ ОКСИДЫ',
    ids: ['SiO2', 'P2O5', 'CrO3', 'CO'],
  },
  {
    label: 'ГИДРОКСИДЫ',
    ids: ['AlOH3', 'ZnOH2', 'CrOH3', 'CuOH2', 'FeOH3'],
  },
  {
    label: 'БИНАРНЫЕ (гидролиз)',
    ids: ['Al2S3', 'Al4C3', 'CaC2', 'Mg3N2', 'Ca3P2', 'Na2O2'],
  },
  {
    label: 'СОЛИ (тв.)',
    ids: ['CaCO3', 'BaCO3', 'MgCO3', 'CaSO4', 'FeS'],
  },
]
