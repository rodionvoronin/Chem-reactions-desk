import { useState, useSyncExternalStore, useMemo, useEffect, useCallback, CSSProperties, ReactNode } from 'react'
import { LESSONS, LESSON_MAP, SECTIONS, lessonMinutes } from './content'
import { CARDS, elementOf } from './elements'
import { ElementCard, Lesson, BlitzGame as BlitzSpec } from './types'
import {
  getKids, subscribeKids, rememberStep, setTeams, setTimer, setSound, resetKids, KidsProgress,
} from './progress'
import {
  KFONT, KButton, TeamBar, TeamsProvider, Teams, useTeams, TurnTimer, KIDS_CSS, sfx, TEAM_COLORS,
} from './kit'
import { StepView, STEP_LABEL } from './steps'
import { ElementCardView } from './visuals'
import { BlitzGame } from './games/BlitzGame'

type View =
  | { kind: 'home' }
  | { kind: 'lesson'; id: string }
  | { kind: 'cards' }
  | { kind: 'blitz'; spec: BlitzSpec }

/**
 * «Юный химик» — экспедиция в мир веществ для 6–7 классов на интерактивной
 * доске. Каждый урок — сценарий занятия на час-полтора: учитель листает шаги
 * кнопкой «Далее» (или пультом для презентаций), а класс обсуждает,
 * предсказывает, ставит опыты и играет.
 */
export function KidsScreen({ onBack }: { onBack: () => void }) {
  const progress = useSyncExternalStore(subscribeKids, getKids)
  const [view, setView] = useState<View>({ kind: 'home' })
  const [scores, setScores] = useState<[number, number]>([0, 0])
  const [turn, setTurn] = useState<0 | 1>(0)
  const [turnKey, setTurnKey] = useState(0)
  const [paused, setPaused] = useState(false)

  const teams: Teams = useMemo(() => ({
    enabled: progress.teams !== null,
    names: progress.teams ?? ['', ''],
    scores,
    turn,
    timer: progress.timer,
    turnKey,
    paused,
    award: (points: number) => {
      if (!progress.teams) return
      // Очки получает команда, чей ход сейчас на экране
      if (points > 0) setScores((s) => (turn === 0 ? [s[0] + points, s[1]] : [s[0], s[1] + points]))
      setPaused(true)
    },
    pass: () => {
      if (!progress.teams) return
      setTurn((t) => (t === 0 ? 1 : 0))
      setPaused(false)
      setTurnKey((k) => k + 1)
    },
    again: () => {
      setPaused(false)
      setTurnKey((k) => k + 1)
    },
  }), [progress.teams, progress.timer, scores, turn, turnKey, paused])

  const resetScores = () => { setScores([0, 0]); setTurn(0); setPaused(false); setTurnKey((k) => k + 1) }

  return (
    <TeamsProvider value={teams}>
      <style>{KIDS_CSS}</style>
      <div style={{
        position: 'fixed', inset: 0, fontFamily: KFONT,
        background: 'linear-gradient(180deg, #FFFBF0 0%, #EEF5FC 100%)',
      }}>
        {view.kind === 'home' && (
          <Home
            progress={progress}
            onBack={onBack}
            onOpen={(id) => setView({ kind: 'lesson', id })}
            onCards={() => setView({ kind: 'cards' })}
            onBlitz={(spec) => setView({ kind: 'blitz', spec })}
            onResetScores={resetScores}
          />
        )}
        {view.kind === 'lesson' && (
          <Player
            key={view.id}
            lesson={LESSON_MAP[view.id]}
            start={progress.at[view.id] ?? 0}
            onExit={() => setView({ kind: 'home' })}
            onNext={(id) => setView({ kind: 'lesson', id })}
          />
        )}
        {view.kind === 'blitz' && <BlitzView spec={view.spec} onExit={() => setView({ kind: 'home' })} />}
        {view.kind === 'cards' && <CardsView progress={progress} onBack={() => setView({ kind: 'home' })} />}
      </div>
    </TeamsProvider>
  )
}

/** Прокручиваемая страница с полями — общая для экранов вне урока */
function Page({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '22px 32px 60px' }}>
        {children}
      </div>
    </div>
  )
}

// ── Главный экран: следующий урок и список уроков ─────────────────────────────

function Home({ progress, onBack, onOpen, onCards, onBlitz, onResetScores }: {
  progress: KidsProgress
  onBack: () => void
  onOpen: (id: string) => void
  onCards: () => void
  onBlitz: (spec: BlitzSpec) => void
  onResetScores: () => void
}) {
  const [modal, setModal] = useState<null | 'settings' | 'blitz'>(null)
  const next = LESSONS.find((l) => !progress.done.includes(l.id)) ?? LESSONS[LESSONS.length - 1]
  const resumeAt = progress.at[next.id] ?? 0

  return (
    <Page>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} style={linkStyle}>← Лаборатория</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <IconButton onClick={onCards} title="Коллекция элементов">🃏 {progress.cards.length}/{CARDS.length}</IconButton>
          <IconButton onClick={() => setModal('blitz')} title="Блиц — викторина на скорость">⚡ Блиц</IconButton>
          <IconButton onClick={() => setModal('settings')} title="Настройки">⚙</IconButton>
        </div>
      </div>

      <h1 style={{ margin: '22px 0 4px', fontSize: 46, color: '#263238' }}>Юный химик</h1>
      <div style={{ fontSize: 21, color: '#78909C' }}>Экспедиция в мир веществ · 6–7 класс</div>

      {/* Следующий урок — главное действие экрана */}
      <div
        onClick={() => { sfx.pop(); onOpen(next.id) }}
        style={{
          marginTop: 22, borderRadius: 30, padding: '28px 34px', cursor: 'pointer',
          background: `linear-gradient(120deg, ${next.color} 0%, ${next.color}CC 100%)`, color: 'white',
          display: 'flex', alignItems: 'center', gap: 30, boxShadow: `0 14px 36px ${next.color}55`,
        }}
      >
        <div style={{ fontSize: 100, lineHeight: 1 }}>{next.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1, opacity: 0.85 }}>
            {resumeAt > 0 ? 'ПРОДОЛЖИТЬ УРОК' : 'СЛЕДУЮЩИЙ УРОК'} · {next.n}
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15, marginTop: 4 }}>{next.title}</div>
          <div style={{ fontSize: 20, opacity: 0.92, marginTop: 6 }}>{next.tagline} · ≈ {lessonMinutes(next)} мин</div>
        </div>
        <div style={{ background: 'white', color: next.color, fontWeight: 700, fontSize: 22, borderRadius: 18, padding: '16px 26px', whiteSpace: 'nowrap' }}>
          {resumeAt > 0 ? `С шага ${resumeAt + 1} →` : 'Начать →'}
        </div>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.n} style={{ marginTop: 34 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#90A4AE', letterSpacing: 1 }}>РАЗДЕЛ {section.n}</div>
          <h2 style={{ margin: '2px 0 12px', fontSize: 28, color: '#37474F' }}>{section.title}</h2>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            {section.lessons.map((l) => (
              <LessonRow key={l.id} lesson={l} done={progress.done.includes(l.id)} current={l === next} onOpen={onOpen} />
            ))}
          </div>
        </div>
      ))}

      {modal === 'settings' && <Settings progress={progress} onClose={() => setModal(null)} onResetScores={onResetScores} />}
      {modal === 'blitz' && <BlitzSetup onClose={() => setModal(null)} onStart={(spec) => { setModal(null); onBlitz(spec) }} />}
    </Page>
  )
}

function LessonRow({ lesson, done, current, onOpen }: { lesson: Lesson; done: boolean; current: boolean; onOpen: (id: string) => void }) {
  return (
    <button
      onClick={() => { sfx.pop(); onOpen(lesson.id) }}
      style={{
        fontFamily: KFONT, cursor: 'pointer', textAlign: 'left', borderRadius: 20, padding: '14px 18px',
        background: 'white', border: `3px solid ${current ? lesson.color : 'transparent'}`,
        boxShadow: '0 4px 14px rgba(38,50,56,0.06)', display: 'flex', alignItems: 'center', gap: 14,
      }}
    >
      <span style={{
        flexShrink: 0, width: 46, height: 46, borderRadius: '50%', fontSize: 19, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: done ? '#43A047' : `${lesson.color}18`, color: done ? 'white' : lesson.color,
      }}>
        {done ? '✓' : lesson.n}
      </span>
      <span style={{ fontSize: 30, flexShrink: 0 }}>{lesson.emoji}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 19, fontWeight: 700, color: '#263238', lineHeight: 1.25 }}>{lesson.title}</span>
        <span style={{ display: 'block', fontSize: 15, color: '#90A4AE', marginTop: 2 }}>{lesson.tagline}</span>
      </span>
    </button>
  )
}

function IconButton({ children, onClick, title }: { children: ReactNode; onClick: () => void; title: string }) {
  return (
    <button onClick={onClick} title={title} aria-label={title} style={{
      fontFamily: KFONT, fontSize: 17, fontWeight: 700, color: '#546E7A', background: 'white',
      border: '2px solid #E0E6EA', borderRadius: 14, padding: '8px 14px', minHeight: 46, cursor: 'pointer',
    }}>
      {children}
    </button>
  )
}

// ── Плеер урока ───────────────────────────────────────────────────────────────

/**
 * Урок как презентация: на экране один шаг, внизу «Назад» и «Далее».
 * Стрелки и PageDown/PageUp тоже листают — пульт для презентаций работает
 * без настройки. Шаг запоминается: урок можно продолжить на следующей неделе.
 */
function Player({ lesson, start, onExit, onNext }: {
  lesson: Lesson
  start: number
  onExit: () => void
  onNext: (id: string) => void
}) {
  const [index, setIndex] = useState(Math.min(start, lesson.steps.length - 1))
  const [notes, setNotes] = useState(false)
  const step = lesson.steps[index]
  const last = index === lesson.steps.length - 1
  const nextLesson = LESSONS[LESSONS.indexOf(lesson) + 1]

  const go = useCallback((i: number) => {
    const to = Math.max(0, Math.min(lesson.steps.length - 1, i))
    if (to === index) return
    sfx.flip()
    setIndex(to)
    setNotes(false)
  }, [index, lesson])

  // Новая игра — таймер хода с начала, даже если прошлая кончилась на паузе
  const teams = useTeams()
  useEffect(() => {
    if (step.kind === 'game') teams.again()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    if (step.kind !== 'finish') rememberStep(lesson.id, index)
    document.querySelector('[data-step-scroll]')?.scrollTo({ top: 0 })
  }, [index, lesson, step])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(index + 1) }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(index - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index])

  const label = STEP_LABEL[step.kind]
  const isGame = step.kind === 'game'

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Верх: выход, название, прогресс по шагам */}
      <div style={{ flexShrink: 0, padding: '12px 28px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onExit} style={{ ...linkStyle, fontSize: 22, padding: '4px 8px' }} aria-label="К списку уроков">✕</button>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#546E7A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lesson.emoji} Урок {lesson.n}. {lesson.title}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {isGame && step.game.kind !== 'blitz' && <TurnTimer key={index} />}
            {isGame && <TeamBar compact />}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {lesson.steps.map((s, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              title={`${i + 1}. ${STEP_LABEL[s.kind].label}`}
              aria-label={`Шаг ${i + 1}: ${STEP_LABEL[s.kind].label}`}
              style={{
                flex: s.min, height: 8, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer',
                background: i < index ? lesson.color : i === index ? lesson.color : '#DDE3E8',
                opacity: i < index ? 0.45 : 1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Шаг */}
      <div data-step-scroll style={{ flex: 1, overflowY: 'auto' }}>
        <div key={index} style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 32px 32px' }}>
          <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: lesson.color, letterSpacing: 1, marginBottom: 14 }}>
            {label.emoji} {label.label.toUpperCase()}
          </div>
          <StepView step={step} lesson={lesson} />
        </div>
      </div>

      {/* Низ: навигация */}
      <div style={{
        flexShrink: 0, borderTop: '1px solid #E3E9EE', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
        padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <KButton ghost color="#78909C" disabled={index === 0} onClick={() => go(index - 1)}>← Назад</KButton>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 15, color: '#90A4AE', fontWeight: 600 }}>
          {index + 1} / {lesson.steps.length}
          {` · ≈ ${step.min} мин`}
          {step.note && (
            <button onClick={() => setNotes(!notes)} style={{ ...linkStyle, fontSize: 15, marginLeft: 12, color: notes ? '#3949AB' : '#90A4AE' }}>
              👩‍🏫 Учителю
            </button>
          )}
        </div>
        {last ? (
          <>
            <KButton ghost color="#78909C" onClick={onExit}>К урокам</KButton>
            {nextLesson && <KButton big color={nextLesson.color} onClick={() => onNext(nextLesson.id)}>Урок {nextLesson.n} →</KButton>}
          </>
        ) : (
          <KButton big color={lesson.color} onClick={() => go(index + 1)}>Далее →</KButton>
        )}
      </div>

      {notes && step.note && (
        <div className="kids-pop" style={{
          position: 'absolute', right: 28, bottom: 92, maxWidth: 440, zIndex: 20,
          background: '#283593', color: 'white', borderRadius: 18, padding: '14px 18px', fontSize: 17, lineHeight: 1.45,
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}>
          👩‍🏫 {step.note}
        </div>
      )}
    </div>
  )
}

// ── Настройки ─────────────────────────────────────────────────────────────────

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(38,50,56,0.5)', zIndex: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="kids-pop" style={{
        background: 'white', borderRadius: 28, padding: 28, maxWidth: 680, width: '100%', maxHeight: '90vh', overflowY: 'auto',
      }}>
        {children}
      </div>
    </div>
  )
}

const TIMER_OPTIONS = [0, 20, 30, 60]

function Settings({ progress, onClose, onResetScores }: { progress: KidsProgress; onClose: () => void; onResetScores: () => void }) {
  const [names, setNames] = useState<[string, string]>(progress.teams ?? ['Атомы', 'Молекулы'])
  const on = progress.teams !== null

  return (
    <Modal onClose={onClose}>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#263238' }}>Настройки</div>

      <Section title="Игра командами">
        <Toggle on={on} onChange={(v) => { setTeams(v ? [names[0] || 'Команда 1', names[1] || 'Команда 2'] : null); onResetScores() }}>
          {on ? 'Включена: в играх ход переходит от команды к команде' : 'Выключена'}
        </Toggle>
        {on && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            {[0, 1].map((i) => (
              <input
                key={i}
                value={names[i]}
                onChange={(e) => {
                  const next: [string, string] = [...names]
                  next[i] = e.target.value
                  setNames(next)
                  setTeams([next[0] || 'Команда 1', next[1] || 'Команда 2'])
                }}
                style={{
                  fontFamily: KFONT, fontSize: 19, fontWeight: 700, color: TEAM_COLORS[i],
                  border: `3px solid ${TEAM_COLORS[i]}`, borderRadius: 14, padding: '10px 14px', flex: '1 1 180px', outline: 'none',
                }}
              />
            ))}
          </div>
        )}
        {on && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 16, color: '#78909C', marginBottom: 8 }}>Время на ход</div>
            <Chips options={TIMER_OPTIONS.map((s) => ({ value: s, label: s ? `${s} с` : 'без таймера' }))} value={progress.timer} onChange={setTimer} />
            <div style={{ marginTop: 12 }}><KButton ghost color="#78909C" onClick={onResetScores}>Обнулить счёт</KButton></div>
          </div>
        )}
      </Section>

      <Section title="Звук">
        <Toggle on={progress.sound} onChange={setSound}>{progress.sound ? 'Включён' : 'Выключен'}</Toggle>
      </Section>

      <Section title="Новая группа">
        <div style={{ fontSize: 16, color: '#78909C', marginBottom: 10 }}>Сбросит пройденные уроки, карточки и рекорды блица. Настройки сохранятся.</div>
        <KButton ghost color="#E53935" onClick={() => {
          if (window.confirm('Сбросить прогресс для новой группы?')) { resetKids(); onResetScores() }
        }}>Сбросить прогресс</KButton>
      </Section>

      <div style={{ marginTop: 24, textAlign: 'right' }}><KButton onClick={onClose}>Готово</KButton></div>
    </Modal>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #ECEFF1' }}>
      <div style={{ fontSize: 19, fontWeight: 700, color: '#37474F', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}

function Toggle({ on, onChange, children }: { on: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <button onClick={() => onChange(!on)} style={{ display: 'flex', alignItems: 'center', gap: 14, border: 'none', background: 'none', cursor: 'pointer', fontFamily: KFONT, padding: 0 }}>
      <span style={{ width: 58, height: 32, borderRadius: 16, background: on ? '#43A047' : '#CFD8DC', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 29 : 3, width: 26, height: 26, borderRadius: 13, background: 'white', transition: 'left 0.2s' }} />
      </span>
      <span style={{ fontSize: 17, color: '#455A64', textAlign: 'left' }}>{children}</span>
    </button>
  )
}

function Chips<T>({ options, value, onChange }: { options: Array<{ value: T; label: string }>; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button key={o.label} onClick={() => onChange(o.value)} style={{
            fontFamily: KFONT, fontSize: 16, fontWeight: 700, borderRadius: 999, padding: '8px 16px', cursor: 'pointer', minHeight: 42,
            border: `2px solid ${active ? '#3949AB' : '#CFD8DC'}`, background: active ? '#3949AB' : 'white', color: active ? 'white' : '#546E7A',
          }}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Блиц ──────────────────────────────────────────────────────────────────────

function BlitzSetup({ onClose, onStart }: { onClose: () => void; onStart: (spec: BlitzSpec) => void }) {
  const progress = getKids()
  // По умолчанию — разделы, до которых класс уже дошёл
  const reached = Math.max(1, ...SECTIONS.filter((s) => s.lessons.some((l) => progress.done.includes(l.id))).map((s) => s.n))
  const [sections, setSections] = useState<number[]>(SECTIONS.filter((s) => s.n <= reached).map((s) => s.n))
  const [seconds, setSeconds] = useState(90)
  const toggle = (n: number) => setSections((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n].sort()))

  return (
    <Modal onClose={onClose}>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#263238' }}>⚡ Блиц</div>
      <div style={{ fontSize: 17, color: '#78909C', marginTop: 4 }}>Викторина на скорость по играм выбранных разделов.</div>
      <Section title="Разделы">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SECTIONS.map((s) => (
            <Toggle key={s.n} on={sections.includes(s.n)} onChange={() => toggle(s.n)}>{s.n}. {s.title}</Toggle>
          ))}
        </div>
      </Section>
      <Section title="Время раунда">
        <Chips options={[60, 90, 120].map((s) => ({ value: s, label: `${s} с` }))} value={seconds} onChange={setSeconds} />
      </Section>
      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
        <KButton ghost color="#78909C" onClick={onClose}>Отмена</KButton>
        <KButton color="#AB47BC" disabled={sections.length === 0} onClick={() => onStart({ kind: 'blitz', sections, seconds })}>Начать</KButton>
      </div>
    </Modal>
  )
}

function BlitzView({ spec, onExit }: { spec: BlitzSpec; onExit: () => void }) {
  return (
    <Page>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={onExit} style={{ ...linkStyle, fontSize: 22 }} aria-label="Выйти">✕</button>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#8E24AA' }}>
          ⚡ Блиц · {spec.sections.length === SECTIONS.length ? 'весь курс' : `${spec.sections.length === 1 ? 'раздел' : 'разделы'} ${spec.sections.join(', ')}`}
        </div>
        <div style={{ marginLeft: 'auto' }}><TeamBar compact /></div>
      </div>
      <BlitzGame game={spec} onFinish={onExit} />
    </Page>
  )
}

// ── Коллекция карточек ────────────────────────────────────────────────────────

function CardsView({ progress, onBack }: { progress: KidsProgress; onBack: () => void }) {
  const [open, setOpen] = useState<ElementCard | null>(null)
  const sorted = [...CARDS].sort((a, b) => elementOf(a.symbol).z - elementOf(b.symbol).z)
  const lessonOf = (symbol: string) => LESSONS.find((l) => l.reward.includes(symbol))

  return (
    <Page>
      <button onClick={onBack} style={linkStyle}>← Назад</button>
      <h1 style={{ margin: '8px 0 4px', fontSize: 42, color: '#263238' }}>Коллекция элементов</h1>
      <div style={{ fontSize: 19, color: '#78909C' }}>
        Открыто {progress.cards.length} из {CARDS.length}. Карточки выдаются в конце уроков.
      </div>

      <div style={{ display: 'grid', gap: 16, marginTop: 22, gridTemplateColumns: `repeat(auto-fill, minmax(160px, 1fr))` }}>
        {sorted.map((c) => {
          if (!progress.cards.includes(c.symbol)) {
            const l = lessonOf(c.symbol)
            return (
              <div key={c.symbol} style={{
                borderRadius: 22, background: '#EEF2F5', border: '3px dashed #D5DDE3', aspectRatio: '3 / 4',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, textAlign: 'center',
              }}>
                <div style={{ fontSize: 46, color: '#C3CED6', fontWeight: 700 }}>?</div>
                {l && <div style={{ fontSize: 13, color: '#A0AEB8' }}>урок {l.n}</div>}
              </div>
            )
          }
          return (
            <button key={c.symbol} onClick={() => { sfx.flip(); setOpen(c) }} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
              <ElementCardView card={c} size="fill" />
            </button>
          )
        })}
      </div>

      {open && (
        <Modal onClose={() => setOpen(null)}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <ElementCardView card={open} size="md" />
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#263238' }}>{open.emoji} {elementOf(open.symbol).name}</div>
              <div style={{ fontSize: 18, color: '#78909C', marginTop: 4 }}>
                Знак {open.symbol} читается «{open.say}» · {open.metal ? 'металл' : 'неметалл'}
              </div>
              <div style={{ fontSize: 19, color: '#37474F', marginTop: 16, lineHeight: 1.45 }}>{open.life}</div>
              <div style={{ fontSize: 19, color: '#37474F', marginTop: 12, lineHeight: 1.45 }}>💡 {open.fact}</div>
            </div>
          </div>
          <div style={{ marginTop: 20, textAlign: 'right' }}><KButton onClick={() => setOpen(null)}>Закрыть</KButton></div>
        </Modal>
      )}
    </Page>
  )
}

const linkStyle: CSSProperties = {
  border: 'none', background: 'none', cursor: 'pointer', fontFamily: KFONT,
  fontSize: 17, fontWeight: 700, color: '#78909C', padding: '10px 4px', minHeight: 44,
}
