// ── Шаги урока ────────────────────────────────────────────────────────────────
//
// Каждый шаг — один экран на доске. Правило оформления одно: на экране
// одна мысль и одно главное действие. Всё второстепенное (подсказки, ответ,
// объяснение опыта) прячется за кнопкой и открывается, когда класс готов.

import { useState, useEffect, useRef, ReactNode, CSSProperties } from 'react'
import { Step, Lesson, Game, Visual } from './types'
import { KButton, sfx, StarRow, Confetti, KFONT } from './kit'
import { VisualView, ElementCardView } from './visuals'
import { CARD_MAP } from './elements'
import { finishLesson } from './progress'
import { lessonMinutes } from './content'
import { SortGame } from './games/SortGame'
import { QuizGame } from './games/QuizGame'
import { MemoryGame } from './games/MemoryGame'
import { BuildGame } from './games/BuildGame'
import { BenchGame } from './games/BenchGame'
import { DetectiveGame } from './games/DetectiveGame'
import { MatchGame } from './games/MatchGame'
import { OrderGame } from './games/OrderGame'
import { OddGame } from './games/OddGame'
import { BlanksGame } from './games/BlanksGame'
import { CatchGame } from './games/CatchGame'
import { AnagramGame } from './games/AnagramGame'
import { TicTacGame } from './games/TicTacGame'
import { DemoStep } from './demo'
import { RiddleGame } from './games/RiddleGame'
import { SimGame } from './games/SimGame'
import { TableGame } from './games/TableGame'
import { CountGame } from './games/CountGame'
import { CalcGame } from './games/CalcGame'
import { ChartGame } from './games/ChartGame'
import { ScaleGame } from './games/ScaleGame'
import { BalanceGame } from './games/BalanceGame'
import { BlitzGame } from './games/BlitzGame'
import { useIsNarrow } from '../useViewport'

export function StepView({ step, lesson }: { step: Step; lesson: Lesson }) {
  switch (step.kind) {
    case 'cover': return <Cover lesson={lesson} goals={step.goals} />
    case 'story': return <Story text={step.text} visual={step.visual} />
    case 'explain': return <Explain title={step.title} points={step.points} visual={step.visual} color={lesson.color} />
    case 'discuss': return <Discuss {...step} />
    case 'predict': return <Predict {...step} />
    case 'cards': return <Cards title={step.title} cards={step.cards} color={lesson.color} />
    case 'demo': return <DemoStep {...step} />
    case 'game': return <GameStep title={step.title} intro={step.intro} game={step.game} />
    case 'notebook': return <Notebook lines={step.lines} />
    case 'finish': return <Finish lesson={lesson} homework={step.homework} />
  }
}

/** Подпись шага над содержимым: тип шага одним словом */
export const STEP_LABEL: Record<Step['kind'], { label: string; emoji: string }> = {
  cover: { label: 'Начало', emoji: '🚩' },
  story: { label: 'Профессор Колба', emoji: '🧑‍🔬' },
  explain: { label: 'Новое знание', emoji: '💡' },
  discuss: { label: 'Обсуждаем', emoji: '💬' },
  predict: { label: 'Предскажи', emoji: '🔮' },
  cards: { label: 'Открытия', emoji: '🃏' },
  demo: { label: 'Опыт', emoji: '🧪' },
  game: { label: 'Игра', emoji: '🎮' },
  notebook: { label: 'В тетрадь', emoji: '✍️' },
  finish: { label: 'Итог', emoji: '🏁' },
}

function Title({ children }: { children: ReactNode }) {
  const narrow = useIsNarrow()
  return <h2 style={{ margin: 0, fontSize: narrow ? 26 : 40, fontWeight: 700, color: '#263238', lineHeight: 1.2, textAlign: 'center' }}>{children}</h2>
}

function Panel({ children, style, reveal = false }: { children: ReactNode; style?: CSSProperties; reveal?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  // Ответ и объяснение открываются по кнопке и часто оказываются ниже края доски
  useEffect(() => {
    if (reveal) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [reveal])
  return (
    <div ref={ref} className="kids-pop" style={{
      background: 'white', borderRadius: 28, padding: 'clamp(18px, 3vw, 34px)',
      boxShadow: '0 10px 30px rgba(38,50,56,0.10)', ...style,
    }}>
      {children}
    </div>
  )
}

// ── Обложка ───────────────────────────────────────────────────────────────────

function Cover({ lesson, goals }: { lesson: Lesson; goals: string[] }) {
  const narrow = useIsNarrow()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, textAlign: 'center' }}>
      <div className="kids-float" style={{ fontSize: narrow ? 90 : 150, lineHeight: 1 }}>{lesson.emoji}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: lesson.color, letterSpacing: 1 }}>УРОК {lesson.n}</div>
      <h1 style={{ margin: 0, fontSize: narrow ? 34 : 60, fontWeight: 700, color: '#263238', lineHeight: 1.1 }}>{lesson.title}</h1>
      <div style={{ fontSize: narrow ? 19 : 26, color: '#546E7A' }}>{lesson.tagline}</div>
      <Panel style={{ textAlign: 'left', maxWidth: 760, width: '100%', marginTop: 8 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: lesson.color, letterSpacing: 1, marginBottom: 10 }}>СЕГОДНЯ УЗНАЕМ</div>
        {goals.map((g) => (
          <div key={g} style={{ display: 'flex', gap: 14, alignItems: 'baseline', fontSize: narrow ? 20 : 26, color: '#263238', padding: '6px 0' }}>
            <span style={{ color: lesson.color }}>●</span>{g}
          </div>
        ))}
      </Panel>
      <div style={{ fontSize: 16, color: '#90A4AE' }}>≈ {lessonMinutes(lesson)} минут · {lesson.steps.length} шагов</div>
    </div>
  )
}

// ── Рассказ проводника ────────────────────────────────────────────────────────

function Story({ text, visual }: { text: string[]; visual?: Visual }) {
  const narrow = useIsNarrow()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start', maxWidth: 1000, width: '100%' }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div className="kids-float" style={{ fontSize: narrow ? 64 : 100, lineHeight: 1 }}>🧑‍🔬</div>
          {!narrow && <div style={{ fontSize: 15, fontWeight: 700, color: '#78909C', marginTop: 6 }}>Профессор Колба</div>}
        </div>
        <Panel style={{ flex: 1, position: 'relative', borderTopLeftRadius: 6 }}>
          {text.map((t, i) => (
            <p key={i} style={{ margin: i ? '16px 0 0' : 0, fontSize: narrow ? 21 : 30, lineHeight: 1.45, color: '#263238', fontWeight: i === 0 ? 700 : 500 }}>
              {t}
            </p>
          ))}
        </Panel>
      </div>
      {visual && <VisualView visual={visual} />}
    </div>
  )
}

// ── Объяснение ────────────────────────────────────────────────────────────────

/** Схемы, которым нужна вся ширина экрана; остальные встают сбоку от текста */
const WIDE: Visual['type'][] = ['sim', 'molecules', 'fire', 'zoom', 'elements', 'cell']

function Explain({ title, points, visual, color }: { title: string; points: string[]; visual?: Visual; color: string }) {
  const narrow = useIsNarrow()
  const side = visual && !WIDE.includes(visual.type) && !narrow
  const list = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
      {points.map((p, i) => (
        <div key={i} className="kids-pop" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', animationDelay: `${i * 0.08}s` }}>
          <span style={{
            flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: color, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700,
          }}>{i + 1}</span>
          <span style={{ fontSize: narrow ? 20 : 27, lineHeight: 1.4, color: '#263238', paddingTop: 4 }}>{p}</span>
        </div>
      ))}
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      <Title>{title}</Title>
      {side ? (
        <div style={{ display: 'flex', gap: 34, alignItems: 'center' }}>
          <Panel style={{ flex: 1.3 }}>{list}</Panel>
          <div style={{ flex: 1 }}><VisualView visual={visual!} /></div>
        </div>
      ) : (
        <>
          <Panel>{list}</Panel>
          {visual && <VisualView visual={visual} />}
        </>
      )}
    </div>
  )
}

// ── Обсуждение ────────────────────────────────────────────────────────────────

function Discuss({ question, emoji, hints = [], answer }: { question: string; emoji?: string; hints?: string[]; answer: string }) {
  const narrow = useIsNarrow()
  const [shownHints, setShownHints] = useState(0)
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ fontSize: narrow ? 64 : 100 }} className="kids-float">{emoji ?? '💬'}</div>
      <Title>{question}</Title>
      <div style={{ fontSize: 19, color: '#90A4AE', fontWeight: 700 }}>Обсудите в парах или всем классом</div>
      {hints.slice(0, shownHints).map((h) => (
        <div key={h} className="kids-pop" style={{ fontSize: narrow ? 19 : 24, color: '#5D4037', background: '#FFF8E1', borderRadius: 18, padding: '12px 20px' }}>
          💡 {h}
        </div>
      ))}
      {open && (
        <Panel reveal style={{ borderLeft: '10px solid #43A047', maxWidth: 1000 }}>
          <div style={{ fontSize: narrow ? 20 : 27, lineHeight: 1.45, color: '#263238' }}>{answer}</div>
        </Panel>
      )}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {!open && shownHints < hints.length && (
          <KButton ghost color="#8D6E63" onClick={() => { sfx.pop(); setShownHints(shownHints + 1) }}>Подсказка</KButton>
        )}
        {!open && <KButton color="#43A047" onClick={() => { sfx.right(); setOpen(true) }}>Показать ответ</KButton>}
      </div>
    </div>
  )
}

// ── Предскажи — проверь ───────────────────────────────────────────────────────

function Predict({ question, emoji, options, answer, explain, visual }: {
  question: string; emoji?: string; options: string[]; answer: number; explain: string; visual?: Visual
}) {
  const narrow = useIsNarrow()
  const [pick, setPick] = useState<number | null>(null)
  const done = pick !== null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
      {emoji && <div style={{ fontSize: narrow ? 60 : 90 }}>{emoji}</div>}
      <Title>{question}</Title>
      {!done && <div style={{ fontSize: 19, color: '#90A4AE', fontWeight: 700 }}>Проголосуйте руками, а потом нажмите на вариант большинства</div>}
      <div style={{ display: 'grid', gap: 14, width: '100%', gridTemplateColumns: narrow ? '1fr' : `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o, i) => {
          const right = done && i === answer
          const wrong = done && i === pick && i !== answer
          return (
            <button
              key={o}
              onClick={() => { if (done) return; setPick(i); if (i === answer) sfx.right(); else sfx.wrong() }}
              style={{
                fontFamily: KFONT, fontSize: narrow ? 21 : 26, fontWeight: 700, minHeight: 96, padding: '16px 18px',
                borderRadius: 22, cursor: done ? 'default' : 'pointer',
                border: `4px solid ${right ? '#43A047' : wrong ? '#EF9A9A' : '#CFD8DC'}`,
                background: right ? '#E8F5E9' : wrong ? '#FFEBEE' : 'white',
                color: '#37474F', opacity: done && !right && !wrong ? 0.45 : 1,
              }}
            >
              {right ? '✓ ' : wrong ? '✗ ' : ''}{o}
            </button>
          )
        })}
      </div>
      {done && (
        <>
          <Panel reveal style={{ borderLeft: `10px solid ${pick === answer ? '#43A047' : '#FB8C00'}`, width: '100%' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: pick === answer ? '#2E7D32' : '#E65100', marginBottom: 8 }}>
              {pick === answer ? 'Верно!' : `На самом деле: ${options[answer]}`}
            </div>
            <div style={{ fontSize: narrow ? 20 : 26, lineHeight: 1.45, color: '#263238' }}>{explain}</div>
          </Panel>
          {visual && <VisualView visual={visual} />}
        </>
      )}
    </div>
  )
}

// ── Карточки-открытия ─────────────────────────────────────────────────────────

function Cards({ title, cards, color }: { title: string; cards: Array<{ emoji: string; front: string; back: string }>; color: string }) {
  const narrow = useIsNarrow()
  const [open, setOpen] = useState<number[]>([])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Title>{title}</Title>
      <div style={{ fontSize: 18, color: '#90A4AE', fontWeight: 700, textAlign: 'center' }}>
        Сначала угадайте, потом переверните · открыто {open.length} из {cards.length}
      </div>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: `repeat(auto-fill, minmax(${narrow ? 150 : 260}px, 1fr))` }}>
        {cards.map((c, i) => {
          const shown = open.includes(i)
          return (
            <div key={i} onClick={() => { if (!shown) { sfx.flip(); setOpen([...open, i]) } }}
              style={{ perspective: 900, height: narrow ? 200 : 250, cursor: shown ? 'default' : 'pointer' }}>
              <div style={{
                position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d',
                transition: 'transform 0.5s', transform: shown ? 'rotateY(180deg)' : 'none',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 24,
                  background: `linear-gradient(150deg, ${color}, ${color}CC)`, color: 'white',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16,
                  boxShadow: '0 8px 22px rgba(0,0,0,0.15)',
                }}>
                  <div style={{ fontSize: narrow ? 54 : 72 }}>{c.emoji}</div>
                  <div style={{ fontSize: narrow ? 19 : 25, fontWeight: 700, textAlign: 'center' }}>{c.front}</div>
                </div>
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 24,
                  background: 'white', border: `4px solid ${color}`, padding: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                  fontSize: narrow ? 16 : 20, lineHeight: 1.4, color: '#263238',
                }}>
                  {c.back}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Игра ──────────────────────────────────────────────────────────────────────

export function GameView({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  switch (game.kind) {
    case 'sort': return <SortGame game={game} onFinish={onFinish} />
    case 'quiz': return <QuizGame game={game} onFinish={onFinish} />
    case 'memory': return <MemoryGame game={game} onFinish={onFinish} />
    case 'build': return <BuildGame game={game} onFinish={onFinish} />
    case 'bench': return <BenchGame game={game} onFinish={onFinish} />
    case 'detective': return <DetectiveGame game={game} onFinish={onFinish} />
    case 'match': return <MatchGame game={game} onFinish={onFinish} />
    case 'order': return <OrderGame game={game} onFinish={onFinish} />
    case 'odd': return <OddGame game={game} onFinish={onFinish} />
    case 'blanks': return <BlanksGame game={game} onFinish={onFinish} />
    case 'catch': return <CatchGame game={game} onFinish={onFinish} />
    case 'anagram': return <AnagramGame game={game} onFinish={onFinish} />
    case 'tictac': return <TicTacGame game={game} onFinish={onFinish} />
    case 'riddle': return <RiddleGame game={game} onFinish={onFinish} />
    case 'sim': return <SimGame game={game} onFinish={onFinish} />
    case 'table': return <TableGame game={game} onFinish={onFinish} />
    case 'count': return <CountGame game={game} onFinish={onFinish} />
    case 'calc': return <CalcGame game={game} onFinish={onFinish} />
    case 'chart': return <ChartGame game={game} onFinish={onFinish} />
    case 'scale': return <ScaleGame game={game} onFinish={onFinish} />
    case 'balance': return <BalanceGame game={game} onFinish={onFinish} />
    case 'blitz': return <BlitzGame game={game} onFinish={onFinish} />
  }
}

function GameStep({ title, intro, game }: { title: string; intro?: string; game: Game }) {
  const [round, setRound] = useState(0)
  const [stars, setStars] = useState<number | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ textAlign: 'center' }}>
        <Title>{title}</Title>
        {intro && <div style={{ fontSize: 20, color: '#78909C', marginTop: 8 }}>{intro}</div>}
      </div>
      {stars === null ? (
        <div key={round}><GameView game={game} onFinish={(s) => { sfx.win(); setStars(s) }} /></div>
      ) : (
        <Panel reveal style={{ textAlign: 'center' }}>
          {stars === 3 && <Confetti />}
          <div style={{ fontSize: 40, fontWeight: 700, color: '#263238' }}>{stars === 3 ? 'Блестяще!' : stars === 2 ? 'Отлично!' : 'Готово!'}</div>
          <div style={{ marginTop: 10 }}><StarRow value={stars} size={64} /></div>
          <div style={{ fontSize: 20, color: '#78909C', marginTop: 12 }}>Нажмите «Далее», чтобы продолжить урок</div>
          <div style={{ marginTop: 18 }}>
            <KButton ghost color="#78909C" onClick={() => { setStars(null); setRound(round + 1) }}>Сыграть ещё раз</KButton>
          </div>
        </Panel>
      )}
    </div>
  )
}

// ── Тетрадь ───────────────────────────────────────────────────────────────────

function Notebook({ lines }: { lines: string[] }) {
  const narrow = useIsNarrow()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
      <Title>✍️ Запишите в тетрадь</Title>
      <div className="kids-pop" style={{
        width: '100%', maxWidth: 1000, borderRadius: 18, padding: narrow ? '20px 18px' : '30px 40px 30px 80px',
        background: 'repeating-linear-gradient(#FFFDF5 0px, #FFFDF5 55px, #BBDEFB 56px)', position: 'relative',
        boxShadow: '0 10px 30px rgba(38,50,56,0.12)',
      }}>
        {!narrow && <div style={{ position: 'absolute', left: 56, top: 0, bottom: 0, width: 3, background: '#EF9A9A' }} />}
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: narrow ? 21 : 30, lineHeight: '56px', color: '#1A237E', fontWeight: 600 }}>{l}</div>
        ))}
      </div>
    </div>
  )
}

// ── Итог ──────────────────────────────────────────────────────────────────────

function Finish({ lesson, homework }: { lesson: Lesson; homework: string }) {
  const narrow = useIsNarrow()
  const [fresh, setFresh] = useState<string[]>([])
  const once = useRef(false)
  useEffect(() => {
    if (once.current) return
    once.current = true
    setFresh(finishLesson(lesson.id, lesson.reward))
    sfx.win()
  }, [lesson])
  const goals = lesson.steps.find((s) => s.kind === 'cover')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', textAlign: 'center' }}>
      <Confetti />
      <div style={{ fontSize: narrow ? 70 : 110 }}>🎉</div>
      <h1 style={{ margin: 0, fontSize: narrow ? 32 : 52, color: '#263238' }}>Урок пройден!</h1>
      {goals?.kind === 'cover' && (
        <Panel style={{ textAlign: 'left', maxWidth: 800, width: '100%' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#2E7D32', letterSpacing: 1, marginBottom: 8 }}>СЕГОДНЯ МЫ УЗНАЛИ</div>
          {goals.goals.map((g) => (
            <div key={g} style={{ fontSize: narrow ? 19 : 24, color: '#263238', padding: '4px 0' }}>✅ {g}</div>
          ))}
        </Panel>
      )}
      <Panel style={{ textAlign: 'left', maxWidth: 800, width: '100%', background: '#E3F2FD' }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#1565C0', letterSpacing: 1, marginBottom: 8 }}>📝 ДОМАШНЕЕ ЗАДАНИЕ</div>
        <div style={{ fontSize: narrow ? 19 : 25, color: '#263238', lineHeight: 1.4 }}>{homework}</div>
      </Panel>
      {lesson.reward.length > 0 && (
        <div>
          <div style={{ fontSize: 21, fontWeight: 700, color: '#78909C' }}>
            {fresh.length ? '🎉 Новые карточки в коллекции!' : 'Карточки урока уже в коллекции'}
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginTop: 14 }}>
            {lesson.reward.map((s, i) => (
              <div key={s} className="kids-star" style={{ animationDelay: `${0.3 + i * 0.25}s` }}>
                <ElementCardView card={CARD_MAP[s]} size={narrow ? 'sm' : 'md'} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
