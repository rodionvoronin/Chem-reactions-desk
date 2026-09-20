// ── Склонение по числу ────────────────────────────────────────────────────────
//
// «751 реакций» и «1 задачи» — самая частая ошибка в интерфейсе, где число
// подставляется в готовую фразу. Правило русского языка тут не «один или
// много», а три формы, и зависят они от последних двух цифр. Держим его
// в одном месте: раньше та же функция жила в трёх файлах копиями.

/** Форма слова для числа: 1 реакция, 2 реакции, 5 реакций */
export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n)
  // 11–14 — исключение: «11 реакций», а не «11 реакция»
  const lastTwo = abs % 100
  if (lastTwo >= 11 && lastTwo <= 14) return many
  const last = abs % 10
  if (last === 1) return one
  if (last >= 2 && last <= 4) return few
  return many
}

/** Число вместе со словом: «751 реакция» */
export function count(n: number, one: string, few: string, many: string): string {
  return `${n} ${plural(n, one, few, many)}`
}
