// ── Реакции «на горке»: сухие смеси на огнеупорной плитке ─────────────────────
//
// Термит, горение порошков на воздухе, сплавление с серой, восстановление
// углём, реакция иода с металлами от капли воды. В пробирке такое не
// показать — нужна открытая горка, над которой видна вспышка, а под ней
// остаётся королёк металла и шлак.
//
// Все правила здесь dryOnly: в растворе порошки не горят. Вид горки после
// реакции (королёк, шлак, дым) выводится из уравнения — см. src/heap.ts;
// здесь указано только, как идёт реакция: вспышкой или спокойным свечением.
//
// Служебные токены: 'heat' — поджечь (запал или горелка), 'air' — горение
// на воздухе, 'H2O_drop' — капля воды как инициатор.

import type { ReactionRule } from './reactions'

const heap = (
  inputs: string[], description: string, burn: 'flash' | 'glow', extra: Partial<ReactionRule['effects']> = {},
): ReactionRule => ({
  inputs, description, dryOnly: true, effects: { burn, ...extra },
})

export const HEAP_REACTIONS: ReactionRule[] = [
  // ══ Алюминотермия ═════════════════════════════════════════════════════════
  heap(['CuO', 'Al_s', 'heat'], '3CuO + 2Al → 3Cu + Al₂O₃  (алюминотермия: смесь сгорает со вспышкой, остаётся королёк меди)', 'flash'),
  heap(['Cu2O', 'Al_s', 'heat'], '3Cu₂O + 2Al → 6Cu + Al₂O₃  (алюминотермия)', 'flash'),
  heap(['FeO', 'Al_s', 'heat'], '3FeO + 2Al → 3Fe + Al₂O₃  (алюминотермия)', 'flash'),
  heap(['MnO2', 'Al_s', 'heat'], '3MnO₂ + 4Al → 3Mn + 2Al₂O₃  (алюминотермия — так получают марганец)', 'flash'),
  heap(['CrO3', 'Al_s', 'heat'], 'CrO₃ + 2Al → Cr + Al₂O₃  (бурная вспышка: CrO₃ — сильный окислитель)', 'flash'),
  heap(['SiO2', 'Al_s', 'heat'], '3SiO₂ + 4Al → 3Si + 2Al₂O₃  (идёт при сильном нагреве)', 'flash'),
  heap(['ZnO', 'Al_s', 'heat'], '3ZnO + 2Al → 3Zn + Al₂O₃', 'flash'),
  heap(['PbO2', 'Al_s', 'heat'], '3PbO₂ + 4Al → 3Pb + 2Al₂O₃  (бурная вспышка)', 'flash'),
  heap(['Pb3O4', 'Al_s', 'heat'], '3Pb₃O₄ + 8Al → 9Pb + 4Al₂O₃', 'flash'),

  // ══ Магнийтермия ══════════════════════════════════════════════════════════
  heap(['SiO2', 'Mg_s', 'heat'], 'SiO₂ + 2Mg → Si + 2MgO  (магнийтермия: ослепительная вспышка)', 'flash'),
  heap(['SiO2', 'Mg_s', 'Mg_s', 'heat'], 'SiO₂ + 4Mg → Mg₂Si + 2MgO  (избыток магния — образуется силицид)', 'flash'),
  heap(['CuO', 'Mg_s', 'heat'], 'CuO + Mg → Cu + MgO', 'flash'),
  heap(['Fe2O3', 'Mg_s', 'heat'], 'Fe₂O₃ + 3Mg → 2Fe + 3MgO', 'flash'),
  heap(['ZnO', 'Mg_s', 'heat'], 'ZnO + Mg → Zn + MgO', 'flash'),
  heap(['Cr2O3', 'Mg_s', 'heat'], 'Cr₂O₃ + 3Mg → 2Cr + 3MgO', 'flash'),
  heap(['Mg_s', 'CO2', 'heat'], '2Mg + CO₂ → 2MgO + C  (магний горит в углекислом газе — белый оксид с чёрной сажей)', 'flash', { gasId: 'SOOT' }),

  // ══ Горение порошков на воздухе ═══════════════════════════════════════════
  heap(['Mg_s', 'air', 'heat'], '2Mg + O₂ → 2MgO  (ослепительно-белое пламя, белый дым)', 'flash', { gasId: 'SMOKE' }),
  heap(['Al_s', 'air', 'heat'], '4Al + 3O₂ → 2Al₂O₃  (порошок алюминия сгорает яркими искрами)', 'flash', { gasId: 'SMOKE' }),
  heap(['Fe_s', 'air', 'heat'], '3Fe + 2O₂ → Fe₃O₄  (железные опилки сгорают снопом искр)', 'flash'),
  heap(['Na_s', 'air', 'heat'], '2Na + O₂ → Na₂O₂  (натрий горит жёлтым пламенем)', 'flash', { gasId: 'SMOKE' }),
  heap(['Ca_s', 'air', 'heat'], '2Ca + O₂ → 2CaO  (кирпично-красное пламя)', 'flash', { gasId: 'SMOKE' }),
  heap(['P_s', 'air', 'heat'], '4P + 5O₂ → 2P₂O₅  (густой белый дым)', 'flash', { gasId: 'SMOKE' }),
  heap(['Cu_s', 'air', 'heat'], '2Cu + O₂ → 2CuO  (медь чернеет при прокаливании)', 'glow'),
  heap(['Zn_s', 'air', 'heat'], '2Zn + O₂ → 2ZnO  (оксид жёлтый в горячем виде, белеет при остывании)', 'glow'),
  heap(['Sn_s', 'air', 'heat'], 'Sn + O₂ → SnO₂', 'glow'),
  heap(['Pb_s', 'air', 'heat'], '2Pb + O₂ → 2PbO  (жёлтый глёт)', 'glow'),
  heap(['S_s', 'air', 'heat'], 'S + O₂ → SO₂↑  (сера плавится и горит синим пламенем)', 'glow', { gas: true }),
  heap(['C_s', 'air', 'heat'], 'C + O₂ → CO₂↑  (уголь тлеет)', 'glow', { gas: true }),

  // ══ Сплавление металлов с серой ═══════════════════════════════════════════
  heap(['Zn_s', 'S_s', 'heat'], 'Zn + S → ZnS  (смесь вспыхивает зелёно-голубым пламенем)', 'flash', { gasId: 'SMOKE' }),
  heap(['Mg_s', 'S_s', 'heat'], 'Mg + S → MgS  (яркая вспышка)', 'flash'),
  heap(['Pb_s', 'S_s', 'heat'], 'Pb + S → PbS', 'glow'),
  heap(['Ag_s', 'S_s', 'heat'], '2Ag + S → Ag₂S', 'glow'),
  heap(['Sn_s', 'S_s', 'heat'], 'Sn + S → SnS', 'glow'),

  // ══ Восстановление углём ══════════════════════════════════════════════════
  heap(['PbO2', 'C_s', 'heat'], 'PbO₂ + C → Pb + CO₂↑', 'glow', { gas: true }),
  heap(['Cu2O', 'C_s', 'heat'], '2Cu₂O + C → 4Cu + CO₂↑', 'glow', { gas: true }),
  heap(['Fe3O4', 'C_s', 'heat'], 'Fe₃O₄ + 2C → 3Fe + 2CO₂↑', 'glow', { gas: true }),
  heap(['ZnO', 'C_s', 'heat'], 'ZnO + C → Zn + CO↑', 'glow', { gas: true }),

  // ══ Иод с металлами: капля воды как катализатор ══════════════════════════
  heap(['Al_s', 'I2', 'H2O_drop'], '2Al + 3I₂ → 2AlI₃  (от капли воды смесь вспыхивает, поднимаются фиолетовые пары иода)', 'flash', { gasId: 'I2' }),
  heap(['Zn_s', 'I2', 'H2O_drop'], 'Zn + I₂ → ZnI₂  (смесь разогревается, выделяются фиолетовые пары)', 'glow', { gasId: 'I2' }),
  heap(['Mg_s', 'I2', 'H2O_drop'], 'Mg + I₂ → MgI₂  (вспышка и фиолетовые пары иода)', 'flash', { gasId: 'I2' }),

  // ══ Прокаливание кристаллов ═══════════════════════════════════════════════
  heap(['CuSO4', 'heat'], 'CuSO₄·5H₂O → CuSO₄ + 5H₂O  (синий медный купорос белеет — теряет кристаллизационную воду)', 'glow'),
]
