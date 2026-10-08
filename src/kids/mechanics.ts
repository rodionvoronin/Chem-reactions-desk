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

/** Название механики и правило одной строкой — для первого знакомства с игрой */
export const GAME_INFO: Record<Game['kind'], { name: string; emoji: string; rule: string }> = {
  sort: { name: 'Сортировка', emoji: '🗂️', rule: 'Отправьте каждую карточку в нужную корзину.' },
  quiz: { name: 'Викторина', emoji: '❓', rule: 'Выберите верный ответ из нескольких.' },
  memory: { name: 'Мемори', emoji: '🃏', rule: 'Открывайте по две карточки и ищите пары.' },
  build: { name: 'Конструктор молекул', emoji: '⚛️', rule: 'Собирайте молекулу из атомов по формуле.' },
  bench: { name: 'Стол с реактивами', emoji: '🧪', rule: 'Смешивайте реактивы сами и ищите признаки реакций.' },
  detective: { name: 'Лаборатория-детектив', emoji: '🕵️', rule: 'Проведите пробы и узнайте, что в склянках без этикеток.' },
  match: { name: 'Соедини пары', emoji: '🔗', rule: 'Соедините карточку слева с карточкой справа.' },
  order: { name: 'По порядку', emoji: '🔢', rule: 'Нажимайте шаги в правильном порядке.' },
  odd: { name: 'Найди лишнее', emoji: '🔍', rule: 'Из четырёх одно не подходит. Какое и почему?' },
  blanks: { name: 'Вставь слово', emoji: '✏️', rule: 'Поставьте пропущенные слова на свои места.' },
  catch: { name: 'Лови!', emoji: '🫧', rule: 'Ловите только нужные пузыри, пока не кончилось время.' },
  anagram: { name: 'Анаграмма', emoji: '🔤', rule: 'Соберите слово из перепутанных букв.' },
  tictac: { name: 'Крестики-нолики', emoji: '⭕', rule: 'Ответьте на вопрос в клетке — и клетка ваша. Три в ряд — победа.' },
  riddle: { name: 'Загадки элементов', emoji: '🕵️', rule: 'Подсказки открываются по одной. Угадайте элемент как можно раньше.' },
  sim: { name: 'Живая модель', emoji: '🔬', rule: 'Понаблюдайте за частицами и ответьте на вопросы.' },
  table: { name: 'Охота по таблице', emoji: '🗂️', rule: 'Найдите клетку элемента в таблице Менделеева.' },
  count: { name: 'Считаем атомы', emoji: '🧮', rule: 'Сколько молекул и атомов в записи?' },
  calc: { name: 'Расчёты', emoji: '🔢', rule: 'Посчитайте и наберите ответ на клавиатуре.' },
  chart: { name: 'График', emoji: '📈', rule: 'Двигайте ползунок температуры и отвечайте по графику.' },
  scale: { name: 'Весы', emoji: '⚖️', rule: 'Предскажите, куда наклонятся весы после опыта.' },
  balance: { name: 'Уравниваем', emoji: '🟰', rule: 'Ставьте коэффициенты, пока атомов слева и справа не станет поровну.' },
  blitz: { name: 'Блиц', emoji: '⚡', rule: 'Как можно больше верных ответов, пока идёт время.' },
  truefalse: { name: 'Верю — не верю', emoji: '🤔', rule: 'Верите утверждению или нет? Проголосуйте, а потом проверьте.' },
  letters: { name: 'Поле чудес', emoji: '🎡', rule: 'Называйте буквы по одной и угадайте слово целиком.' },
  wordsearch: { name: 'Филворд', emoji: '🔠', rule: 'Найдите слова в сетке: нажмите на первую и на последнюю букву слова.' },
  micro: { name: 'Под микроскопом', emoji: '🔬', rule: 'Рассмотрите частицы и скажите, что нарисовано.' },
  timeline: { name: 'Лента времени', emoji: '📜', rule: 'Ставьте каждое открытие на ленту: раньше или позже уже лежащих.' },
  jeopardy: { name: 'Своя игра', emoji: '🎯', rule: 'Выбирайте тему и цену вопроса. Чем дороже, тем труднее.' },
  tug: { name: 'Перетягивание каната', emoji: '🪢', rule: 'Две команды отвечают одновременно. Верный ответ тянет канат к себе.' },
  estimate: { name: 'Ближе всех', emoji: '🎯', rule: 'Поставьте ответ на шкале. Побеждает тот, кто ближе.' },
  cipher: { name: 'Шифр Менделеева', emoji: '🔐', rule: 'Найдите знаки элементов по номерам и прочитайте слово.' },
}
