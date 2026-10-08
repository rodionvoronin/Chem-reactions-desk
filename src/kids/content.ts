// ── Курс «Юный химик» ─────────────────────────────────────────────────────────
//
// Экспедиция в мир веществ на учебный год: 35 уроков, 30 занятий по полтора
// часа. Большой урок занимает всё занятие, короткий — половину. Программа
// идёт по линии «Начал химии» (гл. 1) в объёме для 6 класса; уроки не
// привязаны к датам: учитель идёт в своём темпе. Часть игр берётся из банка.
//
// Проверка `npm run check:kids` сверяет содержание с химией и следит за
// устройством уроков: обложка в начале, итог в конце, разумная длительность.

import { Lesson, Section, Game } from './types'
import { stepMinutes } from './mechanics'
import { BUILD_TARGETS } from './bank'
import { SECTION_1 } from './lessons/s1'
import { SECTION_2 } from './lessons/s2'
import { SECTION_3 } from './lessons/s3'
import { SECTION_4 } from './lessons/s4'
import { SECTION_5 } from './lessons/s5'
import { SECTION_6 } from './lessons/s6'
import { SECTION_7 } from './lessons/s7'

export const SECTIONS: Section[] = [SECTION_1, SECTION_2, SECTION_3, SECTION_4, SECTION_5, SECTION_6, SECTION_7]

export const LESSONS: Lesson[] = SECTIONS.flatMap((s) => s.lessons)

export const LESSON_MAP: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]))

/** Раздел, в котором стоит урок */
export const SECTION_OF: Record<string, Section> = Object.fromEntries(
  SECTIONS.flatMap((s) => s.lessons.map((l) => [l.id, s])),
)

/** Сколько минут длится урок по сценарию */
export function lessonMinutes(lesson: Lesson): number {
  return lesson.steps.reduce((n, s) => n + stepMinutes(s), 0)
}

/**
 * Урок, в котором механика встречается впервые. На этом шаге игра
 * показывает своё правило: дальше класс уже знает, как в неё играть.
 */
export const FIRST_USE: Partial<Record<Game['kind'], string>> = {}
for (const lesson of LESSONS) {
  for (const g of lessonGames(lesson)) FIRST_USE[g.kind] ??= lesson.id
}

/** Игры урока — для блица и проверки */
export function lessonGames(lesson: Lesson): Game[] {
  return lesson.steps.flatMap((s) => (s.kind === 'game' ? [s.game] : []))
}

/**
 * Известные молекулы для конструктора: если собрали не то, что просили, но
 * что-то настоящее, — стоит сказать, что именно. «Вы собрали H₂O₂ — это
 * перекись водорода» учит больше, чем «неверно».
 */
export const KNOWN_MOLECULES: Array<{ formula: string; name: string }> = [
  ...BUILD_TARGETS.map((t) => ({ formula: t.formula, name: t.name.toLowerCase() })),
  { formula: 'H₂O₂', name: 'перекись водорода — ею обрабатывают ранки' },
  { formula: 'CO', name: 'угарный газ — очень ядовитый' },
  { formula: 'N₂', name: 'азот' },
  { formula: 'Cl₂', name: 'хлор — ядовитый жёлто-зелёный газ' },
  { formula: 'H₂S', name: 'сероводород — пахнет тухлыми яйцами' },
  { formula: 'SO₂', name: 'сернистый газ — он пахнет горелой спичкой' },
  { formula: 'NO₂', name: 'бурый газ' },
  { formula: 'N₂O', name: 'веселящий газ' },
]

/** Названия признаков в лаборатории */
export const SIGN_INFO: Record<string, { title: string; emoji: string }> = {
  gas: { title: 'Выделение газа', emoji: '🫧' },
  precipitate: { title: 'Осадок или муть', emoji: '☁️' },
  color: { title: 'Изменение цвета', emoji: '🎨' },
  light: { title: 'Свет и тепло', emoji: '✨' },
}
