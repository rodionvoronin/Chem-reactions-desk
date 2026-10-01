// ── Банк игр ──────────────────────────────────────────────────────────────────
//
// Готовые игры по темам курса. Уроки-путешествия берут их отсюда как шаги
// закрепления: game('bodies') — основная игра темы, game('bodies', 'made-of') —
// дополнительная. Содержание игр живёт в одном месте, сколько бы уроков его
// ни использовало.

import { Game, Station } from '../types'
import { S1_STATIONS } from './s1'
import { S2_STATIONS, TWENTY } from './s2'
import { S3_STATIONS, BUILD_TARGETS } from './s3'
import { S4_STATIONS } from './s4'
import { S5_STATIONS } from './s5'
import { S6_STATIONS } from './s6'
import { S7_STATIONS } from './s7'

export { BUILD_TARGETS, TWENTY }

export const TOPICS: Station[] = [
  ...S1_STATIONS, ...S2_STATIONS, ...S3_STATIONS, ...S4_STATIONS,
  ...S5_STATIONS, ...S6_STATIONS, ...S7_STATIONS,
]

const TOPIC_MAP: Record<string, Station> = Object.fromEntries(TOPICS.map((t) => [t.id, t]))

/** Игра темы банка; без уровня — основная */
export function game(topic: string, level?: string): Game {
  const t = TOPIC_MAP[topic]
  if (!t) throw new Error(`В банке нет темы ${topic}`)
  const l = level ? t.levels.find((x) => x.id === level) : t.levels[0]
  if (!l) throw new Error(`В теме ${topic} нет уровня ${level}`)
  return l.game
}
