// ── Механики игр и время шагов ────────────────────────────────────────────────
//
// Время урока раньше писалось руками, и на пилоте класс прошёл за полтора
// часа два с половиной урока, рассчитанных на час с лишним каждый. Теперь
// время считается по объёму шага: сколько карточек в сортировке, сколько
// действий в опыте, сколько строк в тетрадь. Коэффициенты подобраны по
// пилоту: уроки 1, 2 и половина урока 3 — ровно полтора часа.

import { Game, Step } from './types'

/** Темп класса относительно «сырой» оценки — подобран по пилотному занятию */
const PACE = 0.8

/** Минуты на игру без поправки на темп */
function rawGame(g: Game): number {
  switch (g.kind) {
    case 'sort': return 1 + 0.4 * g.items.length
    case 'quiz': return 0.5 + 1 * g.questions.length
    case 'memory': return 1 + 0.7 * g.pairs
    case 'build': return 1 + 1.5 * g.targets.length
    case 'bench': return 3 + 2 * g.goals.length
    case 'detective': return 3 + 2 * g.unknowns.length
    case 'match': return 1 + 0.5 * g.pairs.length
    case 'order': return 2 + 0.4 * g.steps.length
    case 'odd': return 0.5 + 1 * g.rounds.length
    case 'blanks': return 0.5 + 1.2 * g.sentences.length
    case 'catch': return 1.5 + g.seconds / 60
    case 'anagram': return 0.5 + 1 * g.words.length
    case 'tictac': return 10
    case 'riddle': return 1 + 1.5 * g.rounds
    case 'sim': return 2 + 1 * g.questions.length
    case 'table': return 1 + 0.8 * g.tasks.length
    case 'count': return 0.5 + 0.7 * g.items.length
    case 'calc': return 1 + 2 * g.tasks.length
    case 'chart': return 2 + 1.2 * g.questions.length
    case 'scale': return 0.5 + 1.2 * g.cases.length
    case 'balance': return 1 + 1.5 * g.equations.length
    // С командами блиц играется два раунда
    case 'blitz': return 1 + 2 * g.seconds / 60
    case 'truefalse': return 0.5 + 0.9 * g.statements.length
    case 'letters': return 1 + 2.5 * g.words.length
    case 'wordsearch': return 2 + 0.8 * g.words.length
    case 'micro': return 1 + 0.9 * g.rounds.length
    case 'timeline': return 1 + 1 * g.events.length
    case 'jeopardy': return 2 + 1.2 * g.topics.reduce((n, t) => n + t.questions.length, 0)
    case 'tug': return 7
    case 'hotpot': return 9
    case 'estimate': return 0.5 + 1.6 * g.questions.length
    case 'cipher': return 1 + 0.5 * g.words.reduce((n, w) => n + w.symbols.length, 0)
  }
}

/** Живые схемы, с которыми класс возится руками: ползунок, кнопки, треугольник */
const HANDS_ON = ['sim', 'zoom', 'fire', 'air', 'ph']

function rawStep(s: Step): number {
  switch (s.kind) {
    case 'cover': return 1.5
    case 'story': return 1 + 0.6 * s.text.length
    case 'explain': return 1 + 0.7 * s.points.length + (s.visual && HANDS_ON.includes(s.visual.type) ? 2 : 0)
    case 'discuss': return 3 + 0.5 * (s.hints?.length ?? 0)
    case 'predict': return 2.5
    case 'cards': return 1 + 0.7 * s.cards.length
    case 'demo': return 2 + s.actions.reduce((n, a) => n + (a.predict ? 2.5 : 2), 0)
    case 'notebook': return 1 + 1 * s.lines.length
    case 'finish': return 2
    case 'recap': return 6
    case 'break': return 1 + 0.6 * s.moves.length
    case 'game': return rawGame(s.game)
  }
}

/** Сколько минут занимает шаг на занятии */
export function stepMinutes(s: Step): number {
  return s.min ?? Math.max(1, Math.round(rawStep(s) * PACE))
}
