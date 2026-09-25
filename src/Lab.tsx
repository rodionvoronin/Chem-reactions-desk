import { useState, useCallback, useEffect, useRef } from 'react'
import {
  TestTube, TubeState, createTube, formatContents,
  DEFAULT_GAS_FILL, DEFAULT_GAS_STROKE,
} from './components/TestTube'
import { Burner, BurnerState, createBurner } from './components/Burner'
import { Heap } from './components/Heap'
import { FLAME_METALS } from './components/FlameColorsPalette'
import { ReagentDock, DOCK_WIDTH, DOCK_COLLAPSED } from './components/ReagentDock'
import { BenchToolbar, TOOLBAR_HEIGHT } from './components/BenchToolbar'
import { TaskPalette } from './components/TaskPalette'
import { TaskHud } from './components/TaskHud'
import { DebriefModal } from './components/DebriefModal'
import { MobilePalettes } from './components/MobilePalettes'
import { BottomSheet, TAB_BAR_HEIGHT } from './components/BottomSheet'
import { useIsNarrow, NARROW_WIDTH } from './useViewport'
import {
  matchReactions, getReactionDescription, getPrecipitateLabel, HEAP_REAGENTS, REAGENT_MAP, Vessel,
} from './reactions'
import { Session, sampleLabel } from './game/session'
import { Action, Attempt } from './game/types'
import { checkAnswer, gradeStars, Verdict, isolatableProduct, ISOLATE } from './game/engine'
import {
  recordAttempt, recordEquations, getProgress, classComparison, countSandboxReaction,
} from './game/progress'
import { logEvent } from './game/telemetry'

const FONT = "'Montserrat', system-ui, sans-serif"

let nextId = 1
const genId = (prefix: string) => `${prefix}${nextId++}`

/**
 * Подбирает высоту пробирки под высоту окна: занимаем максимум доступного
 * места, но не вылезаем за экран на ноутбуках. Из высоты окна вычитается
 * всё, что занято постоянно — панель результата, столешница, подпись
 * состава, номер пробирки и отступы.
 */
const CHROME_H = 180 /* панель результата */ + 14 /* столешница */ + 52 /* панель управления */
                + 38 /* подпись */ + 28 /* номер */ + 18 /* поля слота */ + 20 /* запас */

/**
 * На телефоне занято другое: панель результата компактнее, но снизу добавляется
 * полоса вкладок, а сверху — кнопка возврата.
 */
const NARROW_CHROME_H = 118 /* панель */ + 14 /* столешница */ + 44 /* кнопка меню */
                      + 32 /* подпись */ + 24 /* номер */ + TAB_BAR_HEIGHT + 16 /* запас */

function computeTubeHeight(narrow: boolean): number {
  return narrow
    // Потолок высокий: на телефоне посуда должна занимать стол, а не жаться
    // ко дну. Нижняя граница низкая ради альбомной ориентации, где высоты мало.
    ? Math.max(110, Math.min(480, window.innerHeight - NARROW_CHROME_H))
    // Потолок высокий: на большом мониторе прежние 520 оставляли над
    // посудой до трёхсот пикселей пустоты
    : Math.max(280, Math.min(720, window.innerHeight - CHROME_H))
}

/**
 * Пересчитывает состояние пробирки по её содержимому через движок реакций.
 * Сухой режим передаётся в движок: без воды не идут ни гидролиз, ни обмен
 * между растворами.
 */
/** Признак посуды для движка: плитка горки, фторопласт или стекло */
export function vesselOf(tube: TubeState): Vessel {
  if (tube.vessel === 'heap') return 'plate'
  return tube.material === 'ptfe' ? 'ptfe' : 'glass'
}

function withReactions(tube: TubeState, contents: string[], isDry = tube.isDry): TubeState {
  const vessel = vesselOf(tube)
  const effects = matchReactions(contents, isDry, vessel)
  const gas = effects.gasInfo
  const base = createTube(tube.id)
  return {
    ...tube,
    contents,
    isDry,
    // Если реакция перестала идти, возвращаем исходный вид пробирки
    liquidColor: effects.liquidColor ?? base.liquidColor,
    hasPrecipitate: effects.precipitate !== undefined,
    precipitateColor: effects.precipitate?.color ?? base.precipitateColor,
    gasActive: effects.gas ?? false,
    gasFill: gas?.fill ?? DEFAULT_GAS_FILL,
    gasStroke: gas?.stroke ?? DEFAULT_GAS_STROKE,
    gasLabel: gas?.label ?? '',
    reactionDesc: getReactionDescription(contents, isDry, vessel) ?? '',
  }
}

interface Props {
  /** null — песочница; иначе идёт решение задачи */
  session: Session | null
  onExit: () => void
  onRetry: () => void
  onNext: () => void
  hasNext: boolean
}

export function Lab({ session, onExit, onRetry, onNext, hasNext }: Props) {
  const narrow = useIsNarrow()
  const [tubes, setTubes] = useState<TubeState[]>(() => [createTube(genId('t'))])
  const [burners, setBurners] = useState<BurnerState[]>([])
  const [selectedTubeId, setSelectedTubeId] = useState<string | null>(null)
  const [selectedBurnerId, setSelectedBurnerId] = useState<string | null>(null)
  const [tubeH, setTubeH] = useState(() => computeTubeHeight(window.innerWidth < NARROW_WIDTH))
  /** Открытая вкладка нижней шторки — только на узком экране */
  const [sheetTab, setSheetTab] = useState<string | null>(null)
  /** Свёрнут ли док реагентов — только на десктопе */
  const [dockCollapsed, setDockCollapsed] = useState(false)
  /** Короткое пояснение над столом: например, почему раствор не льют на горку */
  const [notice, setNotice] = useState('')
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timer)
  }, [notice])

  // ── Состояние решения задачи ──────────────────────────────────────────────
  const [spent, setSpent] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [revealedHints, setRevealedHints] = useState(0)
  const [picked, setPicked] = useState<string[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [freshEquations, setFreshEquations] = useState<string[]>([])
  const [debrief, setDebrief] = useState<
    { verdict: Verdict; stars: 0 | 1 | 2 | 3; history: number[]
      classRuns: number[]; classLonger: number } | null>(null)

  // Пересчитываем размер посуды при изменении размера окна
  useEffect(() => {
    const onResize = () => setTubeH(computeTubeHeight(window.innerWidth < NARROW_WIDTH))
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  // ── Раскладка стола под задачу ────────────────────────────────────────────
  const startedRef = useRef<Session | null>(null)
  useEffect(() => {
    setSpent(0); setHintsUsed(0); setRevealedHints(0)
    setPicked([]); setActions([]); setFreshEquations([]); setDebrief(null)
    // На телефоне задачу начинаем с раскрытого условия, песочницу — с чистого стола
    setSheetTab(session ? 'task' : null)

    if (!session) {
      setTubes([createTube(genId('t'))])
      setBurners([])
      setSelectedTubeId(null)
      setSelectedBurnerId(null)
      return
    }

    const { task, assignment } = session
    const isDry = task.dry === true

    if (task.type === 'flame') {
      // Проба уже внесена в пламя: ученику остаётся определить металл
      const metal = FLAME_METALS.find((m) => m.id === task.flameMetal)
      const burner: BurnerState = {
        ...createBurner(genId('b')),
        flameColor: metal?.color ?? '',
        metalLabel: 'Образец',
        metalId: '',
      }
      setTubes([])
      setBurners([burner])
      setSelectedTubeId(null)
      setSelectedBurnerId(burner.id)
    } else {
      const fresh = assignment.length > 0
        ? assignment.map((substance, i) => withReactions(
            {
              ...createTube(genId('t')),
              isDry,
              maskedCount: 1,
              maskLabel: sampleLabel(i, assignment.length),
            },
            [substance], isDry,
          ))
        : [withReactions({ ...createTube(genId('t')), isDry }, task.start ?? [], isDry)]
      setTubes(fresh)
      setBurners([])
      setSelectedTubeId(fresh[0].id)
      setSelectedBurnerId(null)
    }

    // В StrictMode эффект вызывается дважды — метрику это портить не должно
    if (startedRef.current !== session) {
      startedRef.current = session
      logEvent('task_started', {
        taskId: task.id, type: task.type, difficulty: task.difficulty, attempt: session.attempt,
      })
    }
  }, [session])

  const selectedTube = tubes.find((t) => t.id === selectedTubeId) ?? null
  const selectedBurner = burners.find((b) => b.id === selectedBurnerId) ?? null

  /** Номер посуды среди своих: пробирки и горки нумеруются отдельно */
  const numberOf = (tube: TubeState) =>
    tubes.filter((t) => (t.vessel === 'heap') === (tube.vessel === 'heap')).indexOf(tube) + 1
  const heapSelected = selectedTube?.vessel === 'heap'

  const selectionLabel = selectedTube
    ? `${heapSelected ? 'Горка' : 'Пробирка'} ${numberOf(selectedTube)}`
    : selectedBurner
      ? `Горелка ${burners.indexOf(selectedBurner) + 1}`
      : ''

  /**
   * Почему реагент сейчас не прольётся. Пусто, если прольётся: при единственной
   * пробирке стол выбирает её сам, и гасить всю палитру незачем.
   */
  const blockedReason = selectedTube || tubes.length === 1
    ? ''
    : tubes.length === 0
      ? 'На столе нет пробирки — поставьте её кнопкой «+ Пробирка».'
      : 'Выберите пробирку на столе, чтобы прилить в неё реагент.'
  const task = session?.task ?? null

  /** Базовое содержимое пробирки: загаданный образец или открытая заготовка. */
  const tubeBase = useCallback((tube: TubeState): string[] => {
    if (tube.maskedCount) return tube.contents.slice(0, tube.maskedCount)
    return task?.start ?? []
  }, [task])

  /**
   * Записывает в лабораторный журнал уравнения, которые ученик увидел впервые.
   * Работает в обоих режимах: журнал пополняется и в песочнице.
   */
  const discover = useCallback((description: string) => {
    if (!description) return
    // Работа за свободным столом иначе не измерима: там нет «решено»,
    // а для пилота важно, идёт ли ученик к доске сам
    if (!session) countSandboxReaction()
    const fresh = recordEquations(description.split('  ·  '))
    if (fresh.length === 0) return
    setFreshEquations((prev) => [...prev, ...fresh])
    for (const equation of fresh) {
      logEvent('reaction_discovered', { equation, source: session ? 'task' : 'sandbox' })
    }
  }, [session])

  // ── Пробирки ──────────────────────────────────────────────────────────────

  const handleReagentClick = useCallback((reagentId: string) => {
    // Если пробирка на столе одна, выбирать её отдельно бессмысленно:
    // раньше из-за этого вся палитра стояла серой
    const tube = tubes.find((t) => t.id === selectedTubeId)
      ?? (tubes.length === 1 ? tubes[0] : undefined)
    if (!tube) return
    if (tube.id !== selectedTubeId) { setSelectedTubeId(tube.id); setSelectedBurnerId(null) }
    // Горка — не пробирка: раствор на плитку не нальёшь
    if (tube.vessel === 'heap' && !HEAP_REAGENTS.has(reagentId)) {
      setNotice(`${REAGENT_MAP[reagentId]?.label ?? reagentId} — это раствор. На горку насыпают только сухие вещества.`)
      return
    }
    const contents = [...tube.contents, reagentId]
    discover(getReactionDescription(contents, tube.isDry, vesselOf(tube)) ?? '')
    setTubes((prev) => prev.map((t) => (t.id === tube.id ? withReactions(t, contents) : t)))

    if (!session) return
    const tubeIndex = tubes.findIndex((t) => t.id === tube.id)
    const step = actions.length + 1
    setActions((prev) => [...prev, { step, reagentId, tubeIndex, at: Date.now() }])
    setSpent((prev) => prev + 1)
    logEvent('reagent_added', { taskId: session.task.id, reagentId, tubeIndex, step })
  }, [tubes, selectedTubeId, session, actions.length, discover])

  const handleAddTube = useCallback(() => {
    const tube = createTube(genId('t'))
    setTubes((prev) => [...prev, tube])
    setSelectedTubeId(tube.id)
    setSelectedBurnerId(null)
  }, [])

  /** Горка на огнеупорной плитке: для термита, горения порошков, сплавлений */
  const handleAddHeap = useCallback(() => {
    const heap: TubeState = { ...createTube(genId('h')), isDry: true, vessel: 'heap' }
    setTubes((prev) => [...prev, heap])
    setSelectedTubeId(heap.id)
    setSelectedBurnerId(null)
  }, [])

  /** В режиме заданий очистка возвращает свежую порцию того же образца. */
  const handleClearTube = useCallback(() => {
    setTubes((prev) => prev.map((t) => {
      if (t.id !== selectedTubeId) return t
      const blank = {
        ...createTube(t.id), isDry: t.isDry, vessel: t.vessel, material: t.material,
        maskedCount: t.maskedCount, maskLabel: t.maskLabel,
      }
      return session ? withReactions(blank, tubeBase(t), t.isDry) : blank
    }))
  }, [selectedTubeId, session, tubeBase])

  /**
   * Что можно выделить из выбранной пробирки. У пробирки с загаданным
   * образцом выделение недоступно: оно назвало бы вещество вслух и решило
   * задачу за ученика.
   */
  const isolatable = selectedTube && !selectedTube.maskedCount
    ? isolatableProduct(selectedTube.contents, selectedTube.isDry, vesselOf(selectedTube))
    : null

  /** Выделить продукт и продолжить работу уже с ним — так ведут цепочку */
  const handleIsolate = useCallback(() => {
    if (!selectedTube || !isolatable) return
    const id = isolatable
    setTubes((prev) => prev.map((t) => (
      t.id === selectedTube.id
        ? withReactions({ ...createTube(t.id), isDry: t.isDry, vessel: t.vessel, material: t.material }, [id], t.isDry)
        : t
    )))
    if (session) {
      // Выделение — такой же шаг хода, как приливание: оно тоже тратит
      // реактивы и время, и в оптимуме задачи оно учтено
      const index = tubes.findIndex((t) => t.id === selectedTube.id)
      setActions((prev) => [
        ...prev,
        { reagentId: ISOLATE, tubeIndex: index < 0 ? 0 : index, step: prev.length + 1, at: Date.now() },
      ])
      setSpent((n) => n + 1)
    }
  }, [selectedTube, isolatable, session, tubes])

  const handleRemoveTube = useCallback(() => {
    setTubes((prev) => prev.filter((t) => t.id !== selectedTubeId))
    setSelectedTubeId(null)
  }, [selectedTubeId])

  // При смене режима реакции пересчитываются: часть из них без воды не идёт
  const handleSetDry = useCallback((dry: boolean) => {
    const tube = tubes.find((t) => t.id === selectedTubeId)
    if (!tube || tube.isDry === dry || tube.vessel === 'heap') return
    discover(getReactionDescription(tube.contents, dry, vesselOf(tube)) ?? '')
    setTubes((prev) => prev.map((t) => (t.id === tube.id ? withReactions(t, t.contents, dry) : t)))
  }, [tubes, selectedTubeId, discover])

  const handleToggleDry = useCallback(() => {
    const tube = tubes.find((t) => t.id === selectedTubeId)
    if (!tube || tube.vessel === 'heap') return
    // Без воды идут свои реакции — их уравнения тоже попадают в журнал
    discover(getReactionDescription(tube.contents, !tube.isDry, vesselOf(tube)) ?? '')
    setTubes((prev) =>
      prev.map((t) => (t.id === tube.id ? withReactions(t, t.contents, !t.isDry) : t))
    )
  }, [tubes, selectedTubeId, discover])

  /** Материал пробирки меняет набор реакций: во фторопласте стекло не травится */
  const handleSetMaterial = useCallback((material: 'glass' | 'ptfe') => {
    const tube = tubes.find((t) => t.id === selectedTubeId)
    if (!tube || tube.vessel === 'heap' || (tube.material ?? 'glass') === material) return
    const next = { ...tube, material }
    discover(getReactionDescription(tube.contents, tube.isDry, vesselOf(next)) ?? '')
    setTubes((prev) => prev.map((t) => (t.id === tube.id ? withReactions(next, t.contents, t.isDry) : t)))
  }, [tubes, selectedTubeId, discover])

  const selectTube = useCallback((id: string) => {
    setSelectedTubeId(id)
    setSelectedBurnerId(null)
  }, [])

  // ── Горелки ───────────────────────────────────────────────────────────────

  const handleAddBurner = useCallback(() => {
    const burner = createBurner(genId('b'))
    setBurners((prev) => [...prev, burner])
    setSelectedBurnerId(burner.id)
    setSelectedTubeId(null)
  }, [])

  const handleSetFlame = useCallback((color: string, label: string, metalId: string) => {
    setBurners((prev) =>
      prev.map((b) =>
        b.id === selectedBurnerId ? { ...b, flameColor: color, metalLabel: label, metalId } : b
      )
    )
  }, [selectedBurnerId])

  const handleClearFlame = useCallback(() => {
    setBurners((prev) =>
      prev.map((b) =>
        b.id === selectedBurnerId ? { ...b, flameColor: '', metalLabel: '', metalId: '' } : b
      )
    )
  }, [selectedBurnerId])

  const handleRemoveBurner = useCallback(() => {
    setBurners((prev) => prev.filter((b) => b.id !== selectedBurnerId))
    setSelectedBurnerId(null)
  }, [selectedBurnerId])

  const selectBurner = useCallback((id: string) => {
    setSelectedBurnerId(id)
    setSelectedTubeId(null)
  }, [])

  // ── Проверка ответа ───────────────────────────────────────────────────────

  const handleHint = useCallback(() => {
    if (!session) return
    const hint = session.task.hints[revealedHints]
    if (!hint) return
    setRevealedHints((n) => n + 1)
    setHintsUsed((n) => n + 1)
    // Подсказка стоит бюджета: за неё платят реактивами, а не отдельной валютой
    setSpent((n) => n + hint.cost)
    logEvent('hint_used', { taskId: session.task.id, hintIndex: revealedHints })
  }, [session, revealedHints])

  const handleSubmit = useCallback(() => {
    if (!session) return
    const verdict = checkAnswer(session.task, {
      picked,
      actions,
      tubeContents: tubes.map((t) => t.contents),
      assignment: session.assignment,
    })
    const stars = gradeStars(session.task, spent, hintsUsed, verdict.correct)
    const attempt: Attempt = {
      taskId: session.task.id,
      startedAt: session.startedAt,
      finishedAt: Date.now(),
      actions,
      spent,
      hintsUsed,
      correct: verdict.correct,
      stars,
    }
    recordAttempt(attempt)
    logEvent('task_finished', {
      taskId: session.task.id,
      correct: verdict.correct,
      spent,
      hintsUsed,
      stars,
      duration: Math.round((attempt.finishedAt - attempt.startedAt) / 1000),
    })
    // История уже содержит эту попытку: recordAttempt отработал выше
    const after = getProgress()
    const comparison = classComparison(after, session.task.id, spent)
    setDebrief({
      verdict, stars,
      history: after.results[session.task.id]?.history ?? [],
      classRuns: after.baseline?.[session.task.id] ?? [],
      classLonger: comparison?.longer ?? 0,
    })
  }, [session, picked, actions, tubes, spent, hintsUsed])

  const handlePick = useCallback((slot: number, value: string) => {
    setPicked((prev) => {
      const next = [...prev]
      next[slot] = value
      return next
    })
  }, [])

  // ── Разметка ──────────────────────────────────────────────────────────────

  const taskMode = session !== null

  /**
   * Полосы, занятые панелями. Слева — док реагентов или условие задачи,
   * справа — палитра задания; в песочнице справа свободно.
   */
  const leftPad = narrow ? 0 : taskMode ? 328 : (dockCollapsed ? DOCK_COLLAPSED : DOCK_WIDTH)
  const rightPad = narrow ? 0 : taskMode ? 240 : 0

  /**
   * На сколько сдвинуть содержимое влево, чтобы оно встало по центру окна.
   * Центрирование внутри зоны даёт центр остатка между панелями, а он смещён
   * вправо ровно на половину разницы полей — это и видно глазом.
   */
  const centreShift = leftPad - rightPad

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(180deg, #F7FAFC 0%, #EDF2F7 100%)',
      fontFamily: FONT, overflow: 'hidden',
    }}>
      {/* ── Рабочая зона ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        paddingLeft: leftPad,
        paddingRight: rightPad,
        paddingTop: narrow ? 44 : taskMode ? undefined : TOOLBAR_HEIGHT,
        paddingBottom: narrow ? TAB_BAR_HEIGHT : undefined,
      }}>
        {/* Лабораторный стол */}
        <div
          onClick={() => { setSelectedTubeId(null); setSelectedBurnerId(null) }}
          style={{
            flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            overflowX: 'auto', overflowY: 'hidden', paddingBottom: 8, minHeight: 0,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'flex-end', gap: 6,
              // Сверху теперь панель управления, и прежний большой отступ
              // только срезал подпись у подросшей посуды
              padding: narrow ? '10px 12px 0' : '16px 24px 0',
              // Отступ считается частью ряда при центрировании — и посуда
              // встаёт по центру окна, а не по центру остатка между панелями
              marginRight: centreShift,
            }}
          >
            {tubes.map((tube) => (
              tube.vessel === 'heap' ? (
                <Heap
                  key={tube.id}
                  tube={tube}
                  index={numberOf(tube) - 1}
                  selected={tube.id === selectedTubeId}
                  onSelect={() => selectTube(tube.id)}
                  height={tubeH}
                />
              ) : (
                <TestTube
                  key={tube.id}
                  tube={tube}
                  index={numberOf(tube) - 1}
                  selected={tube.id === selectedTubeId}
                  onSelect={() => selectTube(tube.id)}
                  height={tubeH}
                />
              )
            ))}
            {burners.map((burner, i) => (
              <Burner
                key={burner.id}
                burner={burner}
                index={i}
                selected={burner.id === selectedBurnerId}
                onSelect={() => selectBurner(burner.id)}
                height={Math.round(tubeH * 0.86)}
              />
            ))}
            {tubes.length === 0 && burners.length === 0 && (
              <div style={{
                padding: '60px 40px', color: '#B0BEC5', fontSize: 14,
                textAlign: 'center', lineHeight: 1.6,
              }}>
                Стол пуст.<br />Добавьте пробирку, горелку или горку.
              </div>
            )}
          </div>
        </div>

        {/* Пояснение над столом — исчезает само */}
        {notice && (
          <div style={{
            position: 'absolute', left: '50%', top: narrow ? 56 : TOOLBAR_HEIGHT + 14,
            transform: 'translateX(-50%)', zIndex: 460, maxWidth: 'calc(100% - 32px)',
            background: '#FFF8E1', border: '1px solid #FFE082', color: '#8D6E63',
            borderRadius: 10, padding: '9px 14px', fontSize: 13.5, lineHeight: 1.4,
            boxShadow: '0 4px 14px rgba(0,0,0,0.10)',
          }}>
            {notice}
          </div>
        )}

        {/* Столешница */}
        <div style={{
          height: 14, background: 'linear-gradient(180deg, #CFD8DC, #B0BEC5)',
          borderRadius: '4px 4px 0 0', boxShadow: '0 -2px 10px rgba(0,0,0,0.06)', flexShrink: 0,
        }} />

        {/* ── Панель результата ── */}
        <div style={{
          minHeight: narrow ? 96 : 180,
          maxHeight: narrow ? '30vh' : 280,
          overflowY: 'auto', flexShrink: 0,
          background: 'white', borderTop: '1px solid #E0E0E0',
          boxShadow: '0 -3px 14px rgba(0,0,0,0.05)',
          padding: narrow ? '12px 14px 14px' : '20px 28px 24px',
        }}>
        {/* Содержимое по центру и с ограниченной шириной: во всю ширину
            монитора строка уравнения растягивалась на полтора метра текста.
            Отступ справа — тот же приём, что у ряда посуды: без него панель
            встала бы по центру остатка между панелями, а не окна. */}
        <div style={{
          width: '100%',
          maxWidth: narrow ? '100%' : 980 + centreShift,
          paddingRight: centreShift,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}>
          {selectedTube ? (
            <ResultPanel tube={selectedTube} showEquations={!taskMode} compact={narrow} />
          ) : selectedBurner ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 11,
              justifyContent: narrow ? 'flex-start' : 'center',
              color: '#455A64', fontSize: narrow ? 15 : 19,
            }}>
              {selectedBurner.metalLabel ? (
                <>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: selectedBurner.flameColor,
                    border: '1px solid rgba(0,0,0,0.18)', display: 'inline-block', flexShrink: 0,
                  }} />
                  {taskMode
                    ? <>Пламя окрашено. Определите металл по цвету.</>
                    : <>Окрашивание пламени: <b>{selectedBurner.metalLabel}</b></>}
                </>
              ) : (
                <span style={{ color: '#90A4AE', fontSize: narrow ? 13.5 : 16 }}>
                  Горелка выбрана. Выберите ион {narrow ? 'во вкладке «Пламя»' : 'в палитре справа'},
                  чтобы окрасить пламя.
                </span>
              )}
            </div>
          ) : (
            <div style={{
              color: '#B0BEC5', fontSize: narrow ? 13.5 : 17,
              textAlign: narrow ? 'left' : 'center',
            }}>
              Выберите пробирку, горку или горелку, чтобы увидеть результат.
            </div>
          )}
        </div>
        </div>
      </div>

      {/* ── Песочница на десктопе: панель управления сверху, док реагентов слева ── */}
      {!taskMode && !narrow && (
        <>
          <BenchToolbar
            onExit={onExit}
            selectionLabel={selectionLabel}
            tubeSelected={!!selectedTube}
            burnerSelected={!!selectedBurner}
            isDry={selectedTube?.isDry ?? false}
            onToggleDry={handleSetDry}
            onHeat={() => handleReagentClick('heat')}
            onAir={() => handleReagentClick('air')}
            heapSelected={heapSelected}
            onAddHeap={handleAddHeap}
            onDrop={() => handleReagentClick('H2O_drop')}
            material={selectedTube?.material ?? 'glass'}
            onSetMaterial={handleSetMaterial}
            isolatable={isolatable}
            onIsolate={handleIsolate}
            onAddTube={handleAddTube}
            onAddBurner={handleAddBurner}
            onClearTube={handleClearTube}
            onRemoveTube={handleRemoveTube}
            onClearFlame={handleClearFlame}
            onRemoveBurner={handleRemoveBurner}
          />

          <ReagentDock
            onReagentClick={handleReagentClick}
            blockedReason={blockedReason}
            burnerSelected={!!selectedBurner}
            currentMetalId={selectedBurner?.metalId ?? ''}
            onAddBurner={handleAddBurner}
            onSetFlame={handleSetFlame}
            collapsed={dockCollapsed}
            onToggleCollapsed={() => setDockCollapsed((v) => !v)}
          />
        </>
      )}

      {/* ── Палитры песочницы: на телефоне нижняя шторка ── */}
      {!taskMode && narrow && (
        <>
          <TopBar onExit={onExit} exitLabel="← В меню" />
          <MobilePalettes
            onReagentClick={handleReagentClick}
            tubeSelected={!!selectedTube}
            isDry={selectedTube?.isDry ?? false}
            onToggleDry={handleToggleDry}
            onAddTube={handleAddTube}
            heapSelected={heapSelected}
            onAddHeap={handleAddHeap}
            material={selectedTube?.material ?? 'glass'}
            onSetMaterial={handleSetMaterial}
            onClearTube={handleClearTube}
            onRemoveTube={handleRemoveTube}
            isolatable={isolatable}
            onIsolate={handleIsolate}
            burnerSelected={!!selectedBurner}
            currentMetalId={selectedBurner?.metalId ?? ''}
            onAddBurner={handleAddBurner}
            onSetFlame={handleSetFlame}
            onClearFlame={handleClearFlame}
            onRemoveBurner={handleRemoveBurner}
          />
        </>
      )}

      {/* ── Режим заданий: на десктопе две панели по краям стола ── */}
      {session && !narrow && (
        <>
          <TaskHud
            session={session}
            spent={spent}
            hintsUsed={hintsUsed}
            revealedHints={revealedHints}
            picked={picked}
            onPick={handlePick}
            onHint={handleHint}
            onSubmit={handleSubmit}
            onExit={onExit}
          />
          {session.task.type !== 'flame' && (
            <TaskPalette
              reagents={session.task.palette}
              tubeSelected={!!selectedTube}
              overBudget={spent >= session.task.budget}
              onReagentClick={handleReagentClick}
              onClearTube={handleClearTube}
              isolatable={isolatable}
              onIsolate={handleIsolate}
            />
          )}
        </>
      )}

      {/* ── Режим заданий: на телефоне условие и реагенты в шторке ── */}
      {session && narrow && (
        <>
          <TopBar
            onExit={onExit}
            exitLabel="← Выйти"
            status={`Реактивы ${spent} / ${session.task.budget}`}
            alarm={spent > session.task.budget}
          />
          <BottomSheet
            tabs={session.task.type === 'flame'
              ? [{ id: 'task', label: 'Задание', icon: '🎯' }]
              : [{ id: 'task', label: 'Задание', icon: '🎯' }, { id: 'reagents', label: 'Реагенты', icon: '🧪' }]}
            active={sheetTab}
            onSelect={setSheetTab}
          >
            {sheetTab === 'task' && (
              <TaskHud
                layout="sheet"
                session={session}
                spent={spent}
                hintsUsed={hintsUsed}
                revealedHints={revealedHints}
                picked={picked}
                onPick={handlePick}
                onHint={handleHint}
                onSubmit={handleSubmit}
                onExit={onExit}
              />
            )}
            {sheetTab === 'reagents' && (
              <TaskPalette
                layout="sheet"
                reagents={session.task.palette}
                tubeSelected={!!selectedTube}
                overBudget={spent >= session.task.budget}
                onReagentClick={(id) => { handleReagentClick(id); setSheetTab(null) }}
                onClearTube={() => { handleClearTube(); setSheetTab(null) }}
                isolatable={isolatable}
                onIsolate={() => { handleIsolate(); setSheetTab(null) }}
              />
            )}
          </BottomSheet>
        </>
      )}

      {session && debrief && (
        <DebriefModal
          session={session}
          verdict={debrief.verdict}
          stars={debrief.stars}
          history={debrief.history}
          classRuns={debrief.classRuns}
          classLonger={debrief.classLonger}
          spent={spent}
          hintsUsed={hintsUsed}
          actions={actions}
          newEquations={freshEquations}
          hasNext={hasNext}
          onRetry={onRetry}
          onNext={onNext}
          onExit={onExit}
        />
      )}
    </div>
  )
}

// ── Верхняя полоса телефона ───────────────────────────────────────────────────

/**
 * На узком экране выход со стола и счётчик реактивов вынесены наверх: панель
 * задания там свёрнута в шторку, и бюджет иначе не виден.
 */
function TopBar({ onExit, exitLabel, status, alarm }: {
  onExit: () => void
  exitLabel: string
  status?: string
  alarm?: boolean
}) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 44, zIndex: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 12px', background: 'rgba(255,255,255,0.94)',
      borderBottom: '1px solid #ECEFF1', fontFamily: FONT,
      backdropFilter: 'blur(6px)',
    }}>
      <button
        onClick={onExit}
        style={{
          border: 'none', background: 'none', padding: '0 10px', cursor: 'pointer',
          minHeight: 44, display: 'flex', alignItems: 'center', margin: '0 -10px',
          fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#546E7A',
        }}
      >
        {exitLabel}
      </button>
      {status && (
        <span style={{
          fontSize: 12.5, fontWeight: 700,
          color: alarm ? '#E64A19' : '#78909C',
        }}>
          {status}
        </span>
      )}
    </div>
  )
}

// ── Панель результата реакции ─────────────────────────────────────────────────

function ResultPanel({ tube, showEquations, compact }: {
  tube: TubeState
  showEquations: boolean
  /** Узкий экран: те же данные, но более плотной вёрсткой */
  compact: boolean
}) {
  const {
    contents, reactionDesc, hasPrecipitate, precipitateColor,
    gasActive, gasFill, gasStroke, gasLabel,
  } = tube

  if (contents.length === 0) {
    return (
      <div style={{ color: '#B0BEC5', fontSize: compact ? 13.5 : 17 }}>
        {tube.vessel === 'heap'
          ? <>Плитка пуста. Насыпьте сухие вещества — металлы, оксиды, серу — и подожгите горку.</>
          : <>Пробирка пуста. Добавьте реагенты
            {compact ? ' из нижней панели' : showEquations ? ' из палитр слева' : ' из списка справа'}.</>}
      </div>
    )
  }

  // Движок склеивает несколько одновременных реакций через « · »
  const equations = reactionDesc ? reactionDesc.split('  ·  ') : []
  const nothingVisible = !hasPrecipitate && !gasActive && equations.length === 0

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: compact ? 7 : 12,
      alignItems: compact ? 'stretch' : 'center',
    }}>
      {/* Состав */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: compact ? 10 : 12.5, fontWeight: 700, color: '#90A4AE', letterSpacing: 0.8,
        }}>
          СОСТАВ
        </span>
        <span
          style={{ fontSize: compact ? 15 : 24, fontWeight: 700, color: '#37474F' }}
          dangerouslySetInnerHTML={{ __html: formatContents(tube) }}
        />
      </div>

      {/* Уравнения реакций. В режиме заданий уравнение — это и есть ответ,
          поэтому его показывают только в разборе после решения. */}
      {showEquations && (
        equations.length > 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            alignItems: compact ? 'stretch' : 'center', maxWidth: '100%',
          }}>
            {equations.map((eq, i) => (
              <div key={i} style={{
                background: '#E8F5E9', borderLeft: '5px solid #66BB6A', borderRadius: 8,
                padding: compact ? '9px 12px' : '15px 20px',
                fontSize: compact ? 14 : 21, fontWeight: 600, color: '#1B5E20',
                lineHeight: 1.45,
              }}>
                {eq}
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: '#FAFAFA', borderLeft: '5px solid #E0E0E0', borderRadius: 8,
            padding: compact ? '9px 12px' : '15px 20px',
            fontSize: compact ? 13 : 18, color: '#9E9E9E',
          }}>
            Видимых признаков реакции нет.
          </div>
        )
      )}

      {!showEquations && nothingVisible && (
        <div style={{
          background: '#FAFAFA', borderLeft: '5px solid #E0E0E0', borderRadius: 8,
          padding: compact ? '9px 12px' : '15px 20px',
          fontSize: compact ? 13 : 18, color: '#9E9E9E',
        }}>
          Видимых признаков реакции нет.
        </div>
      )}

      {/* Наблюдения */}
      {(hasPrecipitate || gasActive) && (
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          justifyContent: compact ? 'flex-start' : 'center',
        }}>
          {hasPrecipitate && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              background: '#FAFAFA', borderRadius: 22,
              padding: compact ? '6px 12px' : '9px 20px',
              fontSize: compact ? 12.5 : 16.5, color: '#455A64', border: '1px solid #ECEFF1',
            }}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%', background: precipitateColor,
                border: '1px solid rgba(0,0,0,0.18)', flexShrink: 0,
              }} />
              {getPrecipitateLabel(precipitateColor)}
            </span>
          )}
          {gasActive && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              background: '#FAFAFA', borderRadius: 22,
              padding: compact ? '6px 12px' : '9px 20px',
              fontSize: compact ? 12.5 : 16.5, color: '#455A64', border: '1px solid #ECEFF1',
            }}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%',
                background: gasFill, border: `1.5px solid ${gasStroke}`,
                flexShrink: 0,
              }} />
              ↑ {gasLabel || 'выделение газа'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
