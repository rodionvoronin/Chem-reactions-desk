// Металлы и цвета их пламени. Раньше здесь же жило окно палитры;
// теперь список рисует ReagentDock, а файл остался справочником.

export interface FlameMetal {
  id: string
  symbol: string
  name: string
  color: string
}

export const FLAME_METALS: FlameMetal[] = [
  // Щелочные и щёлочноземельные металлы — цвета точно по изображению
  { id: 'Li', symbol: 'Li⁺',     name: 'Литий',    color: '#CC1C22' }, // насыщенный багрово-красный
  { id: 'Na', symbol: 'Na⁺',     name: 'Натрий',   color: '#E88A00' }, // янтарно-оранжевый
  { id: 'K',  symbol: 'K⁺',      name: 'Калий',    color: '#8336A5' }, // фиолетово-пурпурный
  { id: 'Rb', symbol: 'Rb⁺',     name: 'Рубидий',  color: '#B85078' }, // тёмно-розово-малиновый (мов)
  { id: 'Cs', symbol: 'Cs⁺',     name: 'Цезий',    color: '#9B7DC8' }, // светло-лавандово-лиловый
  { id: 'Ca', symbol: 'Ca²⁺',    name: 'Кальций',  color: '#E85520' }, // кирпично-оранжевый
  { id: 'Sr', symbol: 'Sr²⁺',    name: 'Стронций', color: '#D82020' }, // ярко-красный (алый)
  { id: 'Ba', symbol: 'Ba²⁺',    name: 'Барий',    color: '#AACC28' }, // жёлто-зелёный (лайм)
  { id: 'Ra', symbol: 'Ra²⁺',    name: 'Радий',    color: '#880D10' }, // тёмно-тёмно-красный (бордо)
  // Другие металлы
  { id: 'Cu', symbol: 'Cu²⁺',    name: 'Медь',     color: '#28A040' }, // изумрудно-зелёный
  { id: 'Fe', symbol: 'Fe²⁺/³⁺', name: 'Железо',   color: '#E89500' }, // золотисто-жёлтый
  { id: 'B',  symbol: 'B³⁺',     name: 'Бор',      color: '#4EAA3A' }, // ярко-зелёный (чуть светлее Cu)
  { id: 'In', symbol: 'In³⁺',    name: 'Индий',    color: '#2C55AC' }, // синий (индиго)
  { id: 'Pb', symbol: 'Pb²⁺',    name: 'Свинец',   color: '#7ABFDF' }, // бледно-голубой
  { id: 'As', symbol: 'As³⁺',    name: 'Мышьяк',   color: '#C0DCED' }, // очень бледно-голубой
  { id: 'Sb', symbol: 'Sb³⁺',    name: 'Сурьма',   color: '#AECAAB' }, // бледно-серо-зелёный
  { id: 'Se', symbol: 'Se⁴⁺',    name: 'Селен',    color: '#8BB8C5' }, // светло-бирюзово-синий
  { id: 'Zn', symbol: 'Zn²⁺',    name: 'Цинк',     color: '#CCDEE5' }, // почти белый, очень бледный
]

/** Проверяет, светлый ли цвет: по нему выбирают тёмный или светлый текст */
export
function isLight(hex: string): boolean {
  const m = hex.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/)
  if (!m) return true
  const lum = (parseInt(m[1], 16) * 299 + parseInt(m[2], 16) * 587 + parseInt(m[3], 16) * 114) / 1000
  return lum > 145
}
