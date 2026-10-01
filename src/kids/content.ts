// ── Курс «Юный химик» ─────────────────────────────────────────────────────────
//
// Карта повторяет календарно-тематическое планирование спецкурса 2026/2027:
// семь разделов, 31 урок, у каждого урока — станции. Содержание разложено по
// файлам разделов в course/, здесь только сборка и справочники.
//
// Проверка `npm run check:kids` сверяет содержание с химией: простые и
// сложные вещества — по разбору формулы, металлы — по карточкам элементов,
// молекулы — по числу атомов на рисунке, уравнения — по балансу атомов.

import { Station, Section, Lesson } from './types'
import { S1_STATIONS, SECTION_1 } from './course/s1'
import { S2_STATIONS, SECTION_2 } from './course/s2'
import { S3_STATIONS, SECTION_3, BUILD_TARGETS } from './course/s3'
import { S4_STATIONS, SECTION_4 } from './course/s4'
import { S5_STATIONS, SECTION_5 } from './course/s5'
import { S6_STATIONS, SECTION_6 } from './course/s6'
import { S7_STATIONS, SECTION_7 } from './course/s7'

export const SECTIONS: Section[] = [SECTION_1, SECTION_2, SECTION_3, SECTION_4, SECTION_5, SECTION_6, SECTION_7]

export const STATIONS: Station[] = [
  ...S1_STATIONS, ...S2_STATIONS, ...S3_STATIONS, ...S4_STATIONS,
  ...S5_STATIONS, ...S6_STATIONS, ...S7_STATIONS,
]

export const STATION_MAP: Record<string, Station> = Object.fromEntries(STATIONS.map((s) => [s.id, s]))

export interface StationPlace {
  section: Section
  lesson: Lesson
  /** Подпись вида «2.4» — раздел и урок, как в планировании */
  code: string
}

/** Где станция стоит в планировании */
export const PLACE: Record<string, StationPlace> = Object.fromEntries(
  SECTIONS.flatMap((section) => section.lessons.flatMap((lesson) => lesson.stations.map((id) => [
    id, { section, lesson, code: `${section.n}.${lesson.n}` },
  ]))),
)

/** Все станции в порядке курса — для кнопки «следующая станция» */
export const COURSE_ORDER: string[] = SECTIONS.flatMap((s) => s.lessons.flatMap((l) => l.stations))

/** Учебный год курса: сентябрь–декабрь — первый год, январь–май — второй */
const COURSE_YEAR = 2026

export function lessonDate(lesson: Lesson): Date {
  const [d, m] = lesson.date.split('.').map(Number)
  return new Date(m >= 8 ? COURSE_YEAR : COURSE_YEAR + 1, m - 1, d)
}

/** Ближайшее занятие: сегодняшнее или следующее по календарю */
export function nextLesson(today = new Date()): { section: Section; lesson: Lesson } | null {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  for (const section of SECTIONS) {
    for (const lesson of section.lessons) {
      if (lessonDate(lesson) >= start) return { section, lesson }
    }
  }
  return null
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
