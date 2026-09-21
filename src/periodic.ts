// ── Периодическая система: данные и связь с реагентами стола ──────────────────
//
// Таблица — второй способ найти реагент: не «по аналитической группе», а по
// элементу. Нажали на Fe — видите всё железо, что есть на столе. Какие
// соединения относятся к элементу, не записано руками, а выводится из формул
// реагентов: добавили реагент в справочник — он сам появился у своих элементов.

import { REAGENT_MAP, REACTION_TABLE } from './reactions'
import { parseFormula } from './chem/formula'
import { classify } from './chem/substances'

export type Block = 's' | 'p' | 'd' | 'f'

export interface Element {
  z: number
  symbol: string
  name: string
  /** Атомная масса; для радиоактивных — массовое число в квадратных скобках */
  mass: string
  /** Характерные степени окисления, как на школьной таблице */
  states: string[]
  period: number
  /** Группа 1–18; у лантаноидов и актиноидов — null, они в отдельных рядах */
  group: number | null
  block: Block
  /** Ряд под таблицей: 'La' — лантаноиды, 'Ac' — актиноиды */
  series: 'La' | 'Ac' | null
  radioactive: boolean
}

// Номер, символ, название, масса, степени окисления («-» — неизвестны)
const RAW = `
1 H Водород 1,008 -1,+1
2 He Гелий 4,003 0
3 Li Литий 6,94 +1
4 Be Бериллий 9,012 +2
5 B Бор 10,81 +3
6 C Углерод 12,011 -4,-2,0,+2,+4
7 N Азот 14,007 -3,-2,-1,+1,+2,+3,+4,+5
8 O Кислород 15,999 -2,-1,+2
9 F Фтор 18,998 -1
10 Ne Неон 20,180 0
11 Na Натрий 22,990 +1
12 Mg Магний 24,305 +2
13 Al Алюминий 26,982 +3
14 Si Кремний 28,085 -4,+2,+4
15 P Фосфор 30,974 -3,+1,+3,+5
16 S Сера 32,06 -2,+2,+4,+6
17 Cl Хлор 35,45 -1,+1,+3,+4,+5,+7
18 Ar Аргон 39,948 0
19 K Калий 39,098 +1
20 Ca Кальций 40,078 +2
21 Sc Скандий 44,956 +3
22 Ti Титан 47,867 +2,+3,+4
23 V Ванадий 50,942 +2,+3,+4,+5
24 Cr Хром 51,996 +2,+3,+6
25 Mn Марганец 54,938 +2,+3,+4,+6,+7
26 Fe Железо 55,845 +2,+3,+6
27 Co Кобальт 58,933 +2,+3
28 Ni Никель 58,693 +2,+3
29 Cu Медь 63,546 +1,+2
30 Zn Цинк 65,38 +2
31 Ga Галлий 69,723 +1,+3
32 Ge Германий 72,630 +2,+4
33 As Мышьяк 74,922 -3,+3,+5
34 Se Селен 78,971 -2,+2,+4,+6
35 Br Бром 79,904 -1,+1,+3,+5,+7
36 Kr Криптон 83,798 0,+2
37 Rb Рубидий 85,468 +1
38 Sr Стронций 87,62 +2
39 Y Иттрий 88,906 +3
40 Zr Цирконий 91,224 +4
41 Nb Ниобий 92,906 +3,+5
42 Mo Молибден 95,94 +2,+3,+4,+5,+6
43 Tc Технеций [97] +4,+6,+7
44 Ru Рутений 101,07 +2,+3,+4,+6,+8
45 Rh Родий 102,906 +3,+4,+6
46 Pd Палладий 106,42 +2,+4
47 Ag Серебро 107,868 +1,+2,+3
48 Cd Кадмий 112,414 +2
49 In Индий 114,818 +1,+3
50 Sn Олово 118,710 +2,+4
51 Sb Сурьма 121,760 -3,+3,+5
52 Te Теллур 127,60 -2,+2,+4,+6
53 I Иод 126,904 -1,+1,+3,+5,+7
54 Xe Ксенон 131,293 0,+2,+4,+6,+8
55 Cs Цезий 132,905 +1
56 Ba Барий 137,327 +2
57 La Лантан 138,906 +3
58 Ce Церий 140,116 +3,+4
59 Pr Празеодим 140,908 +3,+4
60 Nd Неодим 144,242 +3
61 Pm Прометий [145] +3
62 Sm Самарий 150,36 +2,+3
63 Eu Европий 151,964 +2,+3
64 Gd Гадолиний 157,25 +3
65 Tb Тербий 158,925 +3,+4
66 Dy Диспрозий 162,500 +3
67 Ho Гольмий 164,930 +3
68 Er Эрбий 167,259 +3
69 Tm Тулий 168,934 +3
70 Yb Иттербий 173,045 +2,+3
71 Lu Лютеций 174,967 +3
72 Hf Гафний 178,486 +4
73 Ta Тантал 180,948 +5
74 W Вольфрам 183,84 +4,+6
75 Re Рений 186,207 +4,+6,+7
76 Os Осмий 190,23 +4,+8
77 Ir Иридий 192,217 +3,+4,+6
78 Pt Платина 195,084 +2,+4
79 Au Золото 196,967 +1,+3
80 Hg Ртуть 200,592 +1,+2
81 Tl Таллий 204,383 +1,+3
82 Pb Свинец 207,2 +2,+4
83 Bi Висмут 208,980 +3,+5
84 Po Полоний [209] +2,+4
85 At Астат [210] -1,+1
86 Rn Радон [222] 0,+2
87 Fr Франций [223] +1
88 Ra Радий [226] +2
89 Ac Актиний [227] +3
90 Th Торий 232,038 +4
91 Pa Протактиний 231,036 +4,+5
92 U Уран 238,029 +3,+4,+6
93 Np Нептуний [237] +3,+4,+5,+6,+7
94 Pu Плутоний [244] +3,+4,+5,+6
95 Am Америций [243] +3
96 Cm Кюрий [247] +3
97 Bk Берклий [247] +3,+4
98 Cf Калифорний [251] +3
99 Es Эйнштейний [252] +3
100 Fm Фермий [257] +3
101 Md Менделевий [258] +3
102 No Нобелий [259] +2,+3
103 Lr Лоуренсий [266] +3
104 Rf Резерфордий [267] +4
105 Db Дубний [268] +5
106 Sg Сиборгий [269] +6
107 Bh Борий [270] +7
108 Hs Хассий [277] +8
109 Mt Мейтнерий [278] -
110 Ds Дармштадтий [281] -
111 Rg Рентгений [282] -
112 Cn Коперниций [285] +2
113 Nh Нихоний [286] -
114 Fl Флеровий [289] -
115 Mc Московий [290] -
116 Lv Ливерморий [293] -
117 Ts Теннессин [294] -
118 Og Оганесон [294] -
`

/** Последний номер каждого периода */
const PERIOD_ENDS = [2, 10, 18, 36, 54, 86, 118]

function place(z: number): Pick<Element, 'period' | 'group' | 'block' | 'series'> {
  const period = PERIOD_ENDS.findIndex((end) => z <= end) + 1
  const start = period === 1 ? 1 : PERIOD_ENDS[period - 2] + 1
  const i = z - start

  let group: number | null
  let series: Element['series'] = null
  if (period === 1) group = z === 1 ? 1 : 18
  else if (period <= 3) group = i < 2 ? i + 1 : i + 11
  else if (period <= 5) group = i + 1
  else if (i < 3) group = i + 1
  else if (i <= 16) { group = null; series = period === 6 ? 'La' : 'Ac' }
  else group = i - 13

  let block: Block
  if (group === null) block = 'f'
  else if (group <= 2 || z === 2) block = 's'
  else if (group <= 12) block = 'd'
  else block = 'p'
  return { period, group, block, series }
}

export const ELEMENTS: Element[] = RAW.trim().split('\n').map((line) => {
  const [z, symbol, name, mass, states] = line.trim().split(/\s+/)
  const n = +z
  return {
    z: n, symbol, name, mass,
    states: states === '-' ? [] : states.split(','),
    ...place(n),
    radioactive: n === 43 || n === 61 || n >= 84,
  }
})

// ── Соединения элемента на столе ──────────────────────────────────────────────

export interface CompoundGroup {
  label: string
  ids: string[]
}

/** Порядок разделов в карточке элемента — от простого вещества к солям */
const CLASS_ORDER = [
  'Простое вещество', 'Оксиды и пероксиды', 'Гидроксиды', 'Кислоты', 'Соли',
  'Комплексные соединения', 'Другие',
]

/** Металлы p-блока: по положению в таблице их от неметаллов не отличить */
const P_METALS = ['Al', 'Ga', 'In', 'Tl', 'Sn', 'Pb', 'Sb', 'Bi', 'Po']

function sectionOf(formula: string): string {
  const cls = classify(formula)
  if (cls === 'металл' || cls === 'неметалл') return 'Простое вещество'
  if (cls.startsWith('оксид') || cls === 'пероксид') return 'Оксиды и пероксиды'
  if (cls === 'щёлочь' || cls === 'основание нерастворимое' || cls === 'гидроксид амфотерный') return 'Гидроксиды'
  if (cls === 'кислота') return 'Кислоты'
  if (cls === 'соль') return 'Соли'
  if (formula.includes('[')) return 'Комплексные соединения'
  // Справочник ионов знает не все анионы (S₂O₃²⁻, ClO₄⁻, B₄O₇²⁻), поэтому
  // тиосульфат или бура иначе попали бы в «другие». Начинается с металла
  // или аммония — значит соль
  const first = formula.match(/^\(?([A-Z][a-z]?)/)?.[1] ?? ''
  if (formula.startsWith('(NH₄') || formula.startsWith('NH₄') || isMetal(first)) return 'Соли'
  return 'Другие'
}

function isMetal(symbol: string): boolean {
  const el = ELEMENTS.find((e) => e.symbol === symbol)
  if (!el) return false
  return el.block === 'd' || el.block === 'f' || (el.block === 's' && symbol !== 'H' && symbol !== 'He')
    || P_METALS.includes(symbol)
}

/** Формула из подписи реагента: «H₂SO₄ (разб)» → «H₂SO₄» */
function formulaOfLabel(label: string): string {
  return label.replace(/\s*\([а-яё-]+\)$/i, '')
}

/** Для каждого реагента — его формула и элементы; подписи без формулы пропускаем */
const REAGENT_ELEMENTS: Array<{ id: string; formula: string; elements: Set<string> }> =
  Object.values(REAGENT_MAP).flatMap((r) => {
    const formula = formulaOfLabel(r.label)
    const parsed = parseFormula(formula)
    if (!parsed || Object.keys(parsed.counts).length === 0) return []
    return [{ id: r.id, formula, elements: new Set(Object.keys(parsed.counts)) }]
  })

/** Скобки при сортировке не учитываем: (NH₄)₂SO₄ стоит рядом с NH₄Cl */
function sortKey(formula: string): string {
  return formula.replace(/[()[\]]/g, '')
}

const byElement = new Map<string, CompoundGroup[]>()
for (const el of ELEMENTS) {
  const sections = new Map<string, string[]>()
  const own = REAGENT_ELEMENTS
    .filter((r) => r.elements.has(el.symbol))
    .sort((a, b) => sortKey(a.formula).localeCompare(sortKey(b.formula)))
  for (const r of own) {
    const label = sectionOf(r.formula)
    if (!sections.has(label)) sections.set(label, [])
    sections.get(label)!.push(r.id)
  }
  byElement.set(el.symbol, CLASS_ORDER.filter((l) => sections.has(l)).map((label) => ({
    label, ids: sections.get(label)!,
  })))
}

/** Соединения элемента, разложенные по классам */
export function compoundsOf(symbol: string): CompoundGroup[] {
  return byElement.get(symbol) ?? []
}

/** Сколько правил таблицы реакций затрагивают соединения элемента */
export function reactionCountOf(symbol: string): number {
  const ids = new Set(compoundsOf(symbol).flatMap((g) => g.ids))
  return REACTION_TABLE.filter(
    (rule) => rule.description.includes('→') && rule.inputs.some((id) => ids.has(id)),
  ).length
}
