// ── Курс «Юный химик» ─────────────────────────────────────────────────────────
//
// Экспедиция в мир веществ: 29 уроков-путешествий, каждый — сценарий занятия
// на час-полтора. Порядок тем следует пропедевтическому курсу (ориентир —
// календарный план спецкурса), но уроки не привязаны к датам: учитель идёт
// в своём темпе. Игры для закрепления берутся из банка (bank/).
//
// Проверка `npm run check:kids` сверяет содержание с химией и следит за
// устройством уроков: обложка в начале, итог в конце, разумная длительность.

import { Lesson, Section, Game } from './types'
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
  return lesson.steps.reduce((n, s) => n + s.min, 0)
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
