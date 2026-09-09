/**
 * Проверка правил режима заданий: засчитывание ответа, звёзды, достаточность
 * доказательства и код результата. Запуск: `npm run check:logic`.
 */

import { TASK_MAP } from '../src/game/bank'
import { startSession } from '../src/game/session'
import { checkAnswer, gradeStars, trace, isProofSufficient } from '../src/game/engine'
import {
  encodeResults, decodeResults, Progress, buildBaseline, encodeBaseline, decodeBaseline,
  classComparison,
} from '../src/game/progress'
import { attemptVerdict, classVerdict } from '../src/components/AttemptChart'
import { Action } from '../src/game/types'

let failed = 0
const ok = (name: string, cond: boolean, extra = '') => {
  console.log(`${cond ? '  ok  ' : '  FAIL'} ${name}${extra ? '   ' + extra : ''}`)
  if (!cond) failed++
}

const act = (reagentId: string, tubeIndex = 0, step = 1): Action =>
  ({ reagentId, tubeIndex, step, at: Date.now() })

// ── T1: определи неизвестное ────────────────────────────────────────────────
{
  const task = TASK_MAP['fe-1']
  const s = startSession(task)
  const actions = [act('NaOH')]
  const good = checkAnswer(task, {
    picked: ['FeCl3'], actions, tubeContents: [['FeCl3', 'NaOH']], assignment: s.assignment,
  })
  ok('fe-1 верный ответ засчитан', good.correct)
  ok('fe-1 три звезды за оптимум', gradeStars(task, 1, 0, true) === 3)
  ok('fe-1 две звезды за лишний шаг', gradeStars(task, 2, 0, true) === 2)
  ok('fe-1 одна звезда за превышение бюджета', gradeStars(task, 9, 0, true) === 1)
  ok('fe-1 подсказка снимает третью звезду', gradeStars(task, 1, 1, true) === 2)
  const bad = checkAnswer(task, {
    picked: ['CuSO4'], actions, tubeContents: [['FeCl3', 'NaOH']], assignment: s.assignment,
  })
  ok('fe-1 неверный ответ не засчитан', !bad.correct)
  ok('fe-1 разбор описывает признак',
    trace(['FeCl3'], task.solution)[0].observation.includes('красно-бурый'),
    trace(['FeCl3'], task.solution)[0].observation)
}

// ── T3: различи пару, с проверкой достаточности доказательства ──────────────
{
  const task = TASK_MAP['fe-3']
  const s = { ...startSession(task), assignment: ['FeSO4', 'Fe2SO43'] }

  const proved = checkAnswer(task, {
    picked: ['FeSO4', 'Fe2SO43'], actions: [act('NaOH')],
    tubeContents: [], assignment: s.assignment,
  })
  ok('fe-3 доказанный ответ засчитан', proved.correct)

  const guessed = checkAnswer(task, {
    picked: ['FeSO4', 'Fe2SO43'], actions: [act('BaCl2')],
    tubeContents: [], assignment: s.assignment,
  })
  ok('fe-3 угаданный ответ отклонён', !guessed.correct, guessed.reason.slice(0, 40))

  const swapped = checkAnswer(task, {
    picked: ['Fe2SO43', 'FeSO4'], actions: [act('NaOH')],
    tubeContents: [], assignment: s.assignment,
  })
  ok('fe-3 перепутанные пробирки не засчитаны', !swapped.correct)
  ok('BaCl2 не различает сульфаты железа', !isProofSufficient(['FeSO4', 'Fe2SO43'], [act('BaCl2')]))
  ok('NaOH различает сульфаты железа', isProofSufficient(['FeSO4', 'Fe2SO43'], [act('NaOH')]))
}

// ── T2: добейся признака ────────────────────────────────────────────────────
{
  const task = TASK_MAP['cu-4']
  const s = startSession(task)
  const hit = checkAnswer(task, {
    picked: [], actions: [], tubeContents: [['Cu_s', 'HNO3_conc']], assignment: s.assignment,
  })
  ok('cu-4 бурый газ засчитан', hit.correct)
  const miss = checkAnswer(task, {
    picked: [], actions: [], tubeContents: [['Cu_s', 'HNO3_dilut']], assignment: s.assignment,
  })
  ok('cu-4 бесцветный NO не засчитан', !miss.correct)
}

// ── T5 и T6 ─────────────────────────────────────────────────────────────────
{
  const flame = TASK_MAP['fl-2']
  const s = startSession(flame)
  ok('fl-2 медь засчитана',
    checkAnswer(flame, { picked: ['Cu'], actions: [], tubeContents: [], assignment: s.assignment }).correct)
  ok('fl-2 барий не засчитан',
    !checkAnswer(flame, { picked: ['Ba'], actions: [], tubeContents: [], assignment: s.assignment }).correct)

  const dry = TASK_MAP['dr-2']
  ok('dr-2 прокаливание даёт кислород и осадок',
    trace(['KMnO4'], ['heat'], true)[0].observation.includes('O₂'),
    trace(['KMnO4'], ['heat'], true)[0].observation)
}

// ── Код результата ──────────────────────────────────────────────────────────
{
  const progress: Progress = {
    name: 'Иванов, 9А',
    journal: ['A → B', 'C → D'],
    results: { 'fe-1': { stars: 3, spent: 1, hintsUsed: 0, duration: 42000, attempts: 1, history: [1] } },
  }
  const decoded = decodeResults(encodeResults(progress))
  ok('код результата разбирается обратно', decoded !== null)
  ok('имя с кириллицей уцелело', decoded?.name === 'Иванов, 9А', decoded?.name)
  ok('строка результата на месте', decoded?.rows[0].taskId === 'fe-1' && decoded?.rows[0].stars === 3)
  ok('битый код не роняет разбор', decodeResults('мусор') === null)
}

// ── Гистограмма экономности ─────────────────────────────────────────────────
{
  // Разбор не имеет права хвалить за улучшение, которого не было
  const worse = attemptVerdict(3, [4, 6], 6, true)
  ok('ухудшение не выдаётся за прогресс',
    !worse.includes('Лучше прежнего') && worse.includes('лучший'), worse)

  const better = attemptVerdict(3, [6, 4], 4, true)
  ok('улучшение названо числом', better.includes('было 6, стало 4'), better)

  const perfect = attemptVerdict(3, [5, 3], 3, true)
  ok('оптимум назван оптимумом', perfect.startsWith('Оптимум'), perfect)

  const firstTry = attemptVerdict(2, [2], 2, true)
  ok('оптимум с первой попытки не ссылается на прошлое',
    firstTry === 'Оптимум — короче эту задачу не решить.', firstTry)

  const failedAttempt = attemptVerdict(3, [4], 7, false)
  ok('незачёт не портит лучший результат',
    failedAttempt.includes('не засчитана') && failedAttempt.includes('4'), failedAttempt)

  const noSolution = attemptVerdict(3, [], 5, false)
  ok('без решения гистограмма пуста', noSolution.includes('пока пусто'), noSolution)
}

// ── Ориентир по классу ──────────────────────────────────────────────────────
{
  const student = (name: string, taskId: string, best: number): Progress => ({
    name, journal: [],
    results: {
      [taskId]: {
        stars: 3, spent: best, hintsUsed: 0, duration: 1000, attempts: 1, history: [best + 2, best],
      },
    },
  })

  const codes = [
    encodeResults(student('А', 'fe-1', 1)),
    encodeResults(student('Б', 'fe-1', 3)),
    encodeResults(student('В', 'fe-1', 5)),
  ]
  const decoded = codes.map((c) => decodeResults(c)!)
  ok('лучший ход доехал в коде', decoded[0].rows[0].best === 1, String(decoded[0].rows[0].best))

  const baseline = buildBaseline(decoded)
  ok('в ориентире собраны лучшие ходы всех троих',
    JSON.stringify(baseline['fe-1']) === '[1,3,5]', JSON.stringify(baseline['fe-1']))

  const roundtrip = decodeBaseline(encodeBaseline(baseline))
  ok('код класса разбирается обратно',
    JSON.stringify(roundtrip) === JSON.stringify(baseline))
  ok('чужой код классом не считается', decodeBaseline('CRD1-мусор') === null)
  ok('пустой ориентир не выдаётся за данные', decodeBaseline(encodeBaseline({})) === null)

  // Имён в ориентире быть не должно: это ориентир, а не список кто как решил
  ok('в ориентире только задачи и числа',
    Object.values(baseline).every((runs) => runs.every((n) => typeof n === 'number'))
    && !JSON.stringify(baseline).includes('А'))

  const withBaseline: Progress = { name: 'Я', journal: [], results: {}, baseline }
  ok('сравнение считает тех, кто длиннее',
    classComparison(withBaseline, 'fe-1', 3)?.longer === 1)
  ok('без ориентира сравнения нет',
    classComparison({ name: '', journal: [], results: {} }, 'fe-1', 3) === null)

  // Формулировки не имеют права приукрашивать
  ok('худший результат назван прямо',
    classVerdict(0, 12, 8).includes('есть решения короче'), classVerdict(0, 12, 8))
  ok('лучший результат назван лучшим',
    classVerdict(12, 12, 1).includes('чем у всех'), classVerdict(12, 12, 1))
  ok('склонение по числу учеников',
    classVerdict(1, 12, 4).includes('1 ученика из 12'), classVerdict(1, 12, 4))
  ok('без класса фраза пустая', classVerdict(0, 0, 4) === '')
}

console.log(failed === 0 ? '\nВсё сходится.' : `\nПровалов: ${failed}`)
process.exit(failed === 0 ? 0 : 1)
