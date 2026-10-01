import { useState, useSyncExternalStore, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import { STATIONS, STATION_MAP, SECTIONS, PLACE, COURSE_ORDER, nextLesson, lessonDate } from './content'
import { CARDS, CARD_MAP, elementOf, cardColor } from './elements'
import { Station, ElementCard, Game, Lesson, Section, BlitzGame as BlitzSpec } from './types'
import {
  getKids, subscribeKids, finishLevel, levelKey, setTeams, setTimer, setSound, resetKids, KidsProgress,
} from './progress'
import {
  KFONT, KButton, TeamBar, TeamsProvider, Teams, useTeams, TurnTimer, StarRow, Confetti, KIDS_CSS, sfx, TEAM_COLORS, shade,
} from './kit'
import { AirGrid, PhScale } from './visuals'
import { SortGame } from './games/SortGame'
import { QuizGame } from './games/QuizGame'
import { MemoryGame } from './games/MemoryGame'
import { BuildGame } from './games/BuildGame'
import { LabGame } from './games/LabGame'
import { RiddleGame } from './games/RiddleGame'
import { SimGame } from './games/SimGame'
import { TableGame } from './games/TableGame'
import { CountGame } from './games/CountGame'
import { CalcGame } from './games/CalcGame'
import { ChartGame } from './games/ChartGame'
import { ScaleGame } from './games/ScaleGame'
import { BalanceGame } from './games/BalanceGame'
import { BlitzGame } from './games/BlitzGame'
import { count } from '../plural'
import { useIsNarrow } from '../useViewport'

type View =
  | { kind: 'map' }
  | { kind: 'station'; id: string; level: number }
  | { kind: 'cards' }
  | { kind: 'blitz'; spec: BlitzSpec }

/**
 * «Юный химик» — режим для 6–7 классов на интерактивной доске. Карта повторяет
 * календарно-тематическое планирование: разделы, уроки с датами и домашними
 * заданиями, у каждого урока — станции-игры. На станции учитель читает
 * вступление, класс играет, в конце — правило в тетрадь и карточки элементов.
 */
export function KidsScreen({ onBack }: { onBack: () => void }) {
  const progress = useSyncExternalStore(subscribeKids, getKids)
  const [view, setView] = useState<View>({ kind: 'map' })
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
      <div data-kids-scroll style={{
        position: 'fixed', inset: 0, overflowY: 'auto', fontFamily: KFONT,
        background: 'linear-gradient(180deg, #FFF8E1 0%, #E3F2FD 55%, #EDE7F6 100%)',
      }}>
        {view.kind === 'map' && (
          <MapView
            progress={progress}
            onBack={onBack}
            onOpen={(id) => setView({ kind: 'station', id, level: 0 })}
            onCards={() => setView({ kind: 'cards' })}
            onBlitz={(spec) => setView({ kind: 'blitz', spec })}
            onResetScores={resetScores}
          />
        )}
        {view.kind === 'station' && (
          <StationView
            key={`${view.id}/${view.level}`}
            station={STATION_MAP[view.id]}
            initialLevel={view.level}
            progress={progress}
            onMap={() => setView({ kind: 'map' })}
            onOpen={(id, level = 0) => setView({ kind: 'station', id, level })}
          />
        )}
        {view.kind === 'blitz' && (
          <BlitzView spec={view.spec} onMap={() => setView({ kind: 'map' })} />
        )}
        {view.kind === 'cards' && (
          <CardsView progress={progress} onBack={() => setView({ kind: 'map' })} />
        )}
      </div>
    </TeamsProvider>
  )
}

function scrollTop() {
  document.querySelector('[data-kids-scroll]')?.scrollTo({ top: 0 })
}

// ── Карта курса ───────────────────────────────────────────────────────────────

function MapView({ progress, onBack, onOpen, onCards, onBlitz, onResetScores }: {
  progress: KidsProgress
  onBack: () => void
  onOpen: (id: string) => void
  onCards: () => void
  onBlitz: (spec: BlitzSpec) => void
  onResetScores: () => void
}) {
  const narrow = useIsNarrow()
  const upcoming = nextLesson()
  const totalStars = STATIONS.reduce((n, s) => n + (progress.stars[s.id] ?? 0), 0)
  const [blitzOpen, setBlitzOpen] = useState(false)

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: narrow ? '14px 16px 40px' : '24px 32px 50px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <button onClick={onBack} style={linkStyle}>← В лабораторию</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => setSound(!progress.sound)} style={chipStyle}>
            {progress.sound ? '🔊 Звук' : '🔇 Без звука'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap', marginTop: 10 }}>
        <div className="kids-float" style={{ fontSize: narrow ? 60 : 84 }}>🧑‍🔬</div>
        <div style={{ flex: '1 1 360px' }}>
          <h1 style={{ margin: 0, fontSize: narrow ? 34 : 50, fontWeight: 700, color: '#263238', letterSpacing: -0.5 }}>
            Юный химик
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: narrow ? 17 : 21, color: '#546E7A', lineHeight: 1.45 }}>
            Спецкурс по химии, 6–7 класс, 2026/2027. Семь разделов и {count(STATIONS.length, 'станция', 'станции', 'станций')}-игр по календарному плану.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <BigChip onClick={() => setBlitzOpen(true)} top="ВИКТОРИНА НА СКОРОСТЬ" main="⚡ Блиц" from="#EC407A" to="#AB47BC" shadow="#6A1B9A" />
          <BigChip onClick={onCards} top="КОЛЛЕКЦИЯ ЭЛЕМЕНТОВ" main={`🃏 ${progress.cards.length} / ${CARDS.length}`} from="#FFB300" to="#FB8C00" shadow="#E65100" />
        </div>
      </div>

      <TeamsSetup progress={progress} onResetScores={onResetScores} />

      {upcoming && <UpcomingLesson section={upcoming.section} lesson={upcoming.lesson} progress={progress} onOpen={onOpen} onCards={onCards} />}

      {/* Быстрый переход к разделу */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 22 }}>
        {SECTIONS.map((s) => (
          <button
            key={s.n}
            onClick={() => document.getElementById(`kids-section-${s.n}`)?.scrollIntoView({ behavior: 'smooth' })}
            style={{ ...chipStyle, fontSize: 15 }}
          >
            {s.n}. {s.title}
          </button>
        ))}
      </div>

      {SECTIONS.map((section) => (
        <SectionBlock key={section.n} section={section} progress={progress} onOpen={onOpen} onCards={onCards} upcoming={upcoming?.lesson ?? null} />
      ))}

      <div style={{ marginTop: 26, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', fontSize: 15, color: '#78909C' }}>
        <span>Звёзд за основные уровни: <b style={{ color: '#FB8C00' }}>{totalStars} / {STATIONS.length * 3}</b></span>
        <button
          onClick={() => {
            if (window.confirm('Начать заново для новой группы? Звёзды, карточки и рекорды будут сброшены.')) {
              resetKids()
              onResetScores()
            }
          }}
          style={{ ...linkStyle, fontSize: 15 }}
        >
          Сбросить прогресс для новой группы
        </button>
      </div>

      {blitzOpen && <BlitzSetup onClose={() => setBlitzOpen(false)} onStart={(spec) => { setBlitzOpen(false); onBlitz(spec) }} />}
    </div>
  )
}

function BigChip({ onClick, top, main, from, to, shadow }: {
  onClick: () => void; top: string; main: string; from: string; to: string; shadow: string
}) {
  return (
    <button onClick={onClick} style={{
      fontFamily: KFONT, cursor: 'pointer', border: 'none', borderRadius: 22,
      background: `linear-gradient(135deg, ${from}, ${to})`, color: 'white',
      padding: '14px 24px', boxShadow: `0 6px 0 ${shadow}`, textAlign: 'left',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>{top}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{main}</div>
    </button>
  )
}

function UpcomingLesson({ section, lesson, progress, onOpen, onCards }: {
  section: Section; lesson: Lesson; progress: KidsProgress; onOpen: (id: string) => void; onCards: () => void
}) {
  const narrow = useIsNarrow()
  const today = lessonDate(lesson).toDateString() === new Date().toDateString()
  return (
    <div className="kids-pop" style={{
      marginTop: 20, borderRadius: 28, padding: narrow ? 18 : '22px 28px',
      background: 'linear-gradient(120deg, #1E88E5 0%, #3949AB 100%)', color: 'white',
      boxShadow: '0 10px 30px rgba(57,73,171,0.3)',
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1, opacity: 0.85 }}>
        {today ? 'СЕГОДНЯ НА ЗАНЯТИИ' : 'БЛИЖАЙШЕЕ ЗАНЯТИЕ'} · {lesson.date} · РАЗДЕЛ {section.n}, УРОК {lesson.n}
      </div>
      <div style={{ fontSize: narrow ? 22 : 30, fontWeight: 700, marginTop: 6, lineHeight: 1.25 }}>{lesson.title}</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        {lesson.stations.map((id) => {
          const s = STATION_MAP[id]
          return (
            <button key={id} onClick={() => { sfx.pop(); onOpen(id) }} style={{
              fontFamily: KFONT, cursor: 'pointer', border: 'none', borderRadius: 18, padding: '12px 20px',
              background: 'white', color: '#283593', fontSize: 20, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 5px 0 rgba(0,0,0,0.2)',
            }}>
              <span style={{ fontSize: 28 }}>{s.emoji}</span> {s.title} →
              {(progress.stars[id] ?? 0) > 0 && <StarRow value={progress.stars[id]} size={18} />}
            </button>
          )
        })}
        {lesson.stations.length === 0 && (
          <button onClick={onCards} style={{
            fontFamily: KFONT, cursor: 'pointer', border: 'none', borderRadius: 18, padding: '12px 20px',
            background: 'white', color: '#283593', fontSize: 20, fontWeight: 700,
          }}>
            🃏 Коллекция элементов — материал для сообщений →
          </button>
        )}
      </div>
      <div style={{ marginTop: 14, fontSize: 17, opacity: 0.92 }}>📝 Домашнее задание: {lesson.homework}</div>
    </div>
  )
}

function SectionBlock({ section, progress, onOpen, onCards, upcoming }: {
  section: Section; progress: KidsProgress; onOpen: (id: string) => void; onCards: () => void; upcoming: Lesson | null
}) {
  const narrow = useIsNarrow()
  const hours = section.lessons.reduce((n, l) => n + l.hours, 0)
  return (
    <div id={`kids-section-${section.n}`} style={{ marginTop: 34, scrollMarginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: narrow ? 24 : 32, color: '#263238' }}>Раздел {section.n}. {section.title}</h2>
        <span style={{ fontSize: 16, color: '#90A4AE', fontWeight: 700 }}>{hours} ч</span>
      </div>
      <p style={{ margin: '6px 0 0', fontSize: narrow ? 15 : 17, color: '#78909C' }}>{section.description}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
        {section.lessons.map((lesson) => {
          const isNext = lesson === upcoming
          const past = lessonDate(lesson) < new Date(new Date().toDateString())
          return (
            <div key={lesson.n} style={{
              background: 'white', borderRadius: 24, padding: narrow ? 14 : '16px 20px',
              border: `3px solid ${isNext ? '#3949AB' : 'transparent'}`,
              boxShadow: '0 6px 18px rgba(38,50,56,0.07)',
              display: 'grid', gap: 14, alignItems: 'center',
              gridTemplateColumns: narrow ? '1fr' : '110px minmax(0, 1fr) auto',
            }}>
              <div style={{ display: 'flex', flexDirection: narrow ? 'row' : 'column', gap: narrow ? 10 : 2, alignItems: narrow ? 'baseline' : 'flex-start' }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: past ? '#B0BEC5' : '#3949AB' }}>{lesson.date}</span>
                <span style={{ fontSize: 14, color: '#90A4AE', fontWeight: 700 }}>урок {section.n}.{lesson.n} · {lesson.hours} ч</span>
              </div>
              <div>
                <div style={{ fontSize: narrow ? 17 : 20, fontWeight: 700, color: '#263238', lineHeight: 1.3 }}>{lesson.title}</div>
                <div style={{ fontSize: 15, color: '#78909C', marginTop: 4 }}>📝 {lesson.homework}</div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: narrow ? 'flex-start' : 'flex-end' }}>
                {lesson.stations.map((id) => <StationTile key={id} station={STATION_MAP[id]} progress={progress} onOpen={onOpen} />)}
                {lesson.stations.length === 0 && (
                  <button onClick={onCards} style={{ ...chipStyle, fontSize: 15 }}>🃏 Коллекция для сообщений</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StationTile({ station, progress, onOpen }: { station: Station; progress: KidsProgress; onOpen: (id: string) => void }) {
  const stars = progress.stars[station.id] ?? 0
  const extra = station.levels.length - 1
  return (
    <button
      onClick={() => { sfx.pop(); onOpen(station.id) }}
      style={{
        fontFamily: KFONT, cursor: 'pointer', textAlign: 'left', borderRadius: 20, padding: '10px 14px',
        background: `${station.color}12`, border: `3px solid ${stars ? station.color : `${station.color}55`}`,
        display: 'flex', alignItems: 'center', gap: 12, minWidth: 230,
      }}
    >
      <span style={{
        width: 50, height: 50, borderRadius: '50%', background: 'white', border: `3px solid ${station.color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0,
      }}>
        {station.emoji}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#263238', lineHeight: 1.2 }}>{station.title}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StarRow value={stars} size={17} />
          {extra > 0 && <span style={{ fontSize: 12.5, fontWeight: 700, color: shade(station.color, 0.8) }}>+{count(extra, 'уровень', 'уровня', 'уровней')}</span>}
        </span>
      </span>
    </button>
  )
}

const TIMER_OPTIONS = [0, 20, 30, 60]

function TeamsSetup({ progress, onResetScores }: { progress: KidsProgress; onResetScores: () => void }) {
  const [editing, setEditing] = useState(false)
  const [names, setNames] = useState<[string, string]>(progress.teams ?? ['Атомы', 'Молекулы'])

  if (!editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 18 }}>
        {progress.teams ? (
          <>
            <TeamBar />
            <button onClick={() => setEditing(true)} style={chipStyle}>
              Команды{progress.timer ? ` · ⏱ ${progress.timer} с на ход` : ''}…
            </button>
            <button onClick={onResetScores} style={chipStyle}>Обнулить счёт</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} style={{ ...chipStyle, fontSize: 18, padding: '12px 20px' }}>
            👥 Играть командами
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="kids-pop" style={{
      marginTop: 18, background: 'white', borderRadius: 22, padding: 18,
      display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
      boxShadow: '0 6px 18px rgba(38,50,56,0.08)',
    }}>
      <span style={{ fontSize: 18, fontWeight: 700, color: '#455A64' }}>Команды:</span>
      {[0, 1].map((i) => (
        <input
          key={i}
          value={names[i]}
          onChange={(e) => {
            const next: [string, string] = [...names]
            next[i] = e.target.value
            setNames(next)
          }}
          style={{
            fontFamily: KFONT, fontSize: 19, fontWeight: 700, color: TEAM_COLORS[i],
            border: `3px solid ${TEAM_COLORS[i]}`, borderRadius: 14, padding: '10px 14px', width: 200,
            outline: 'none',
          }}
        />
      ))}
      <span style={{ fontSize: 18, fontWeight: 700, color: '#455A64', marginLeft: 8 }}>Время на ход:</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {TIMER_OPTIONS.map((sec) => (
          <button
            key={sec}
            onClick={() => setTimer(sec)}
            style={{
              ...chipStyle,
              background: progress.timer === sec ? '#3949AB' : 'white',
              color: progress.timer === sec ? 'white' : '#546E7A',
              borderColor: progress.timer === sec ? '#3949AB' : '#CFD8DC',
            }}
          >
            {sec ? `${sec} с` : 'без таймера'}
          </button>
        ))}
      </div>
      <KButton onClick={() => {
        setTeams([names[0].trim() || 'Команда 1', names[1].trim() || 'Команда 2'])
        onResetScores()
        setEditing(false)
      }}>Играем!</KButton>
      {progress.teams && (
        <KButton ghost color="#78909C" onClick={() => { setTeams(null); setEditing(false) }}>Без команд</KButton>
      )}
      <KButton ghost color="#78909C" onClick={() => setEditing(false)}>Отмена</KButton>
    </div>
  )
}

// ── Блиц по выбору учителя ────────────────────────────────────────────────────

function BlitzSetup({ onClose, onStart }: { onClose: () => void; onStart: (spec: BlitzSpec) => void }) {
  const upcoming = nextLesson()
  // По умолчанию — разделы, до которых курс уже дошёл к ближайшему занятию
  const [sections, setSections] = useState<number[]>(() => {
    const upTo = upcoming ? upcoming.section.n : SECTIONS.length
    return SECTIONS.filter((s) => s.n <= upTo).map((s) => s.n)
  })
  const [seconds, setSeconds] = useState(90)
  const toggle = (n: number) => setSections((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n].sort()))

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(38,50,56,0.55)', zIndex: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="kids-pop" style={{
        background: 'white', borderRadius: 30, padding: 28, maxWidth: 820, width: '100%', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#263238' }}>⚡ Блиц — викторина на скорость</div>
        <div style={{ fontSize: 18, color: '#78909C', marginTop: 6 }}>Вопросы собираются со всех станций выбранных разделов.</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#90A4AE', marginTop: 20, letterSpacing: 1 }}>РАЗДЕЛЫ</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {SECTIONS.map((s) => {
            const on = sections.includes(s.n)
            return (
              <button key={s.n} onClick={() => toggle(s.n)} style={{
                ...chipStyle, borderRadius: 16, textAlign: 'left', fontSize: 18,
                background: on ? '#F3E5F5' : 'white', borderColor: on ? '#AB47BC' : '#CFD8DC', color: on ? '#6A1B9A' : '#78909C',
              }}>
                {on ? '☑' : '☐'} {s.n}. {s.title}
              </button>
            )
          })}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#90A4AE', marginTop: 20, letterSpacing: 1 }}>ВРЕМЯ РАУНДА</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {[60, 90, 120].map((s) => (
            <button key={s} onClick={() => setSeconds(s)} style={{
              ...chipStyle, fontSize: 18,
              background: seconds === s ? '#AB47BC' : 'white', color: seconds === s ? 'white' : '#546E7A',
              borderColor: seconds === s ? '#AB47BC' : '#CFD8DC',
            }}>
              {s} с
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <KButton big color="#AB47BC" disabled={sections.length === 0} onClick={() => onStart({ kind: 'blitz', sections, seconds })}>Начать блиц</KButton>
          <KButton ghost color="#78909C" onClick={onClose}>Отмена</KButton>
        </div>
      </div>
    </div>
  )
}

function BlitzView({ spec, onMap }: { spec: BlitzSpec; onMap: () => void }) {
  const narrow = useIsNarrow()
  useEffect(scrollTop, [])
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: narrow ? '12px 16px 40px' : '20px 32px 50px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        <button onClick={onMap} style={linkStyle}>← Карта</button>
        <div style={{ fontSize: narrow ? 20 : 26, fontWeight: 700, color: '#8E24AA' }}>
          ⚡ Блиц: {spec.sections.length === SECTIONS.length
            ? 'весь курс'
            : `${spec.sections.length === 1 ? 'раздел' : 'разделы'} ${spec.sections.join(', ')}`}
        </div>
        <div style={{ marginLeft: 'auto' }}><TeamBar compact /></div>
      </div>
      <BlitzGame game={spec} onFinish={onMap} />
    </div>
  )
}

// ── Станция ───────────────────────────────────────────────────────────────────

function GameView({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  switch (game.kind) {
    case 'sort': return <SortGame game={game} onFinish={onFinish} />
    case 'quiz': return <QuizGame game={game} onFinish={onFinish} />
    case 'memory': return <MemoryGame game={game} onFinish={onFinish} />
    case 'build': return <BuildGame game={game} onFinish={onFinish} />
    case 'lab': return <LabGame game={game} onFinish={onFinish} />
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

function StationView({ station, initialLevel, progress, onMap, onOpen }: {
  station: Station
  initialLevel: number
  progress: KidsProgress
  onMap: () => void
  onOpen: (id: string, level?: number) => void
}) {
  const narrow = useIsNarrow()
  const [level, setLevel] = useState(initialLevel)
  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>(initialLevel > 0 ? 'play' : 'intro')
  const [round, setRound] = useState(0)
  const [stars, setStars] = useState(0)
  const [fresh, setFresh] = useState<string[]>([])
  const place = PLACE[station.id]
  const order = COURSE_ORDER.indexOf(station.id)
  const next = STATION_MAP[COURSE_ORDER[order + 1]]
  const lvl = station.levels[level]
  const isLastInLesson = place && place.lesson.stations[place.lesson.stations.length - 1] === station.id

  const finish = useCallback((s: number) => {
    setStars(s)
    setFresh(finishLevel(levelKey(station.id, level, lvl.id), s, level === 0 ? station.reward : []))
    setPhase('done')
    sfx.win()
  }, [station, level, lvl])

  useEffect(scrollTop, [phase, level])

  // Новая игра — таймер хода с начала, даже если прошлая станция кончилась на паузе
  const teams = useTeams()
  useEffect(() => {
    if (phase === 'play') teams.again()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, level, round])

  const levelStars = (i: number) => progress.stars[levelKey(station.id, i, station.levels[i].id)] ?? 0

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: narrow ? '12px 16px 40px' : '20px 32px 50px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        <button onClick={onMap} style={linkStyle}>← Карта</button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: narrow ? 20 : 26, fontWeight: 700, color: shade(station.color, 0.85),
        }}>
          <span style={{ fontSize: narrow ? 30 : 38 }}>{station.emoji}</span>
          <span>{place ? `${place.code}. ` : ''}{station.title}</span>
          {station.levels.length > 1 && phase !== 'intro' && (
            <span style={{ fontSize: 16, color: '#90A4AE' }}>· {lvl.title}</span>
          )}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {phase === 'play' && lvl.game.kind !== 'blitz' && <TurnTimer key={`${level}-${round}`} />}
          <TeamBar compact />
        </div>
      </div>

      {phase === 'intro' && (
        <div className="kids-pop" style={{
          background: 'white', borderRadius: 32, padding: narrow ? 22 : '36px 44px',
          boxShadow: '0 12px 36px rgba(38,50,56,0.12)', borderTop: `10px solid ${station.color}`,
        }}>
          <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="kids-float" style={{ fontSize: narrow ? 80 : 130, lineHeight: 1 }}>{station.emoji}</div>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1, color: station.color }}>СЕГОДНЯ УЗНАЕМ</div>
              {station.intro.map((p, i) => (
                <p key={i} style={{
                  margin: '14px 0 0', fontSize: narrow ? 20 : 27, lineHeight: 1.45, color: '#263238',
                  fontWeight: i === 0 ? 700 : 500,
                }}>
                  {p}
                </p>
              ))}
              {station.visual && (
                <div style={{ marginTop: 22 }}>
                  {station.visual === 'air' ? <AirGrid /> : <PhScale />}
                </div>
              )}
              <div style={{
                marginTop: 24, padding: '14px 18px', borderRadius: 16, background: `${station.color}12`,
                fontSize: narrow ? 17 : 21, color: '#455A64',
              }}>
                <b>Как играть:</b> {station.howTo}
              </div>
              <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                {station.levels.map((l, i) => (
                  <KButton
                    key={l.id}
                    big={i === 0}
                    ghost={i > 0}
                    color={station.color}
                    onClick={() => { sfx.pop(); setLevel(i); setPhase('play') }}
                  >
                    {i === 0 ? `Начать: ${l.title} →` : l.title}
                    {levelStars(i) > 0 && <span style={{ marginLeft: 8, color: '#FFB300' }}>{'★'.repeat(levelStars(i))}</span>}
                  </KButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === 'play' && (
        <div key={`${level}-${round}`}>
          <GameView game={lvl.game} onFinish={finish} />
        </div>
      )}

      {phase === 'done' && (
        <>
          {stars === 3 && <Confetti />}
          <div className="kids-pop" style={{
            background: 'white', borderRadius: 32, padding: narrow ? 22 : '34px 44px',
            boxShadow: '0 12px 36px rgba(38,50,56,0.12)', textAlign: 'center',
          }}>
            <div style={{ fontSize: narrow ? 30 : 42, fontWeight: 700, color: '#263238' }}>
              {stars === 3 ? 'Блестяще!' : stars === 2 ? 'Отлично!' : 'Станция пройдена!'}
            </div>
            <div style={{ marginTop: 12 }}><StarRow value={stars} size={narrow ? 48 : 70} /></div>
            <FinalScore />

            <div style={{
              margin: '26px auto 0', maxWidth: 900, textAlign: 'left',
              background: '#FFFDE7', border: '3px solid #FFE082', borderRadius: 22, padding: '18px 24px',
            }}>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1, color: '#F9A825' }}>✍️ ЗАПИШИТЕ В ТЕТРАДЬ</div>
              <div style={{ fontSize: narrow ? 20 : 26, fontWeight: 700, color: '#37474F', marginTop: 8, lineHeight: 1.4 }}>
                {station.remember}
              </div>
            </div>

            {isLastInLesson && place.lesson.homework !== '—' && (
              <div style={{
                margin: '14px auto 0', maxWidth: 900, textAlign: 'left',
                background: '#E3F2FD', border: '3px solid #90CAF9', borderRadius: 22, padding: '14px 24px',
              }}>
                <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1, color: '#1E88E5' }}>📝 ДОМАШНЕЕ ЗАДАНИЕ</div>
                <div style={{ fontSize: narrow ? 19 : 23, fontWeight: 600, color: '#37474F', marginTop: 6 }}>{place.lesson.homework}</div>
              </div>
            )}

            {level === 0 && station.reward.length > 0 && (
              <div style={{ marginTop: 26 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#78909C' }}>
                  {fresh.length > 0 ? '🎉 Новые карточки в коллекции!' : 'Карточки этой станции уже в коллекции'}
                </div>
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
                  {station.reward.map((s, i) => (
                    <div key={s} className="kids-star" style={{ animationDelay: `${0.4 + i * 0.25}s` }}>
                      <ElementCardView card={CARD_MAP[s]} size={narrow ? 'sm' : 'md'} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 30 }}>
              <KButton ghost color={station.color} onClick={() => { setRound(round + 1); setPhase('play') }}>Ещё раз</KButton>
              {station.levels.map((l, i) => i !== level && (
                <KButton key={l.id} ghost color={station.color} onClick={() => { setLevel(i); setRound(round + 1); setPhase('play') }}>
                  Уровень «{l.title}»{levelStars(i) ? ` ${'★'.repeat(levelStars(i))}` : ''}
                </KButton>
              ))}
              <KButton ghost color="#78909C" onClick={onMap}>На карту</KButton>
              {next && (
                <KButton big color={next.color} onClick={() => onOpen(next.id)}>
                  {PLACE[next.id].code}. {next.title} →
                </KButton>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function FinalScore() {
  const teams = useTeams()
  if (!teams.enabled) return null
  const [a, b] = teams.scores
  const lead = a === b ? null : a > b ? 0 : 1
  return (
    <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <TeamBar />
      <div style={{ fontSize: 20, fontWeight: 700, color: lead === null ? '#78909C' : TEAM_COLORS[lead] }}>
        {lead === null ? 'Пока ничья!' : `Лидирует команда «${teams.names[lead]}»`}
      </div>
    </div>
  )
}

// ── Коллекция карточек ────────────────────────────────────────────────────────

function CardsView({ progress, onBack }: { progress: KidsProgress; onBack: () => void }) {
  const narrow = useIsNarrow()
  const [open, setOpen] = useState<ElementCard | null>(null)
  const sorted = [...CARDS].sort((a, b) => elementOf(a.symbol).z - elementOf(b.symbol).z)
  const sourceOf = (symbol: string) => STATIONS.find((s) => s.reward.includes(symbol))
  useEffect(scrollTop, [])

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: narrow ? '12px 16px 40px' : '20px 32px 50px' }}>
      <button onClick={onBack} style={linkStyle}>← Карта</button>
      <h1 style={{ margin: '8px 0 0', fontSize: narrow ? 30 : 42, color: '#263238' }}>Коллекция элементов</h1>
      <p style={{ margin: '6px 0 0', fontSize: narrow ? 16 : 20, color: '#546E7A' }}>
        Открыто {progress.cards.length} из {CARDS.length}. Карточки выдаются за основной уровень станций.
        Нажмите на карточку, чтобы узнать об элементе больше, — пригодится для итогового сообщения.
      </p>
      <div style={{ display: 'flex', gap: 18, marginTop: 10, fontSize: 16, color: '#546E7A', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#E65100' }}>■</span> металлы</span>
        <span><span style={{ color: '#0D47A1' }}>■</span> неметаллы</span>
      </div>

      <div style={{
        display: 'grid', gap: 16, marginTop: 20,
        gridTemplateColumns: `repeat(auto-fill, minmax(${narrow ? 120 : 170}px, 1fr))`,
      }}>
        {sorted.map((c) => {
          const has = progress.cards.includes(c.symbol)
          if (!has) {
            const src = sourceOf(c.symbol)
            return (
              <div key={c.symbol} style={{
                borderRadius: 22, background: '#ECEFF1', border: '4px dashed #CFD8DC',
                aspectRatio: '3 / 4', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10, textAlign: 'center',
              }}>
                <div style={{ fontSize: 50, color: '#B0BEC5', fontWeight: 700 }}>?</div>
                {src && <div style={{ fontSize: 13, color: '#90A4AE' }}>станция {PLACE[src.id]?.code}<br />{src.title}</div>}
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
        <div
          onClick={() => setOpen(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(38,50,56,0.55)', zIndex: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} className="kids-pop" style={{
            background: 'white', borderRadius: 32, padding: narrow ? 20 : 34, maxWidth: 820, width: '100%',
            display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <ElementCardView card={open} size="lg" />
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ fontSize: 34, fontWeight: 700, color: '#263238' }}>
                {open.emoji} {elementOf(open.symbol).name}
              </div>
              <div style={{ fontSize: 20, color: '#78909C', marginTop: 4 }}>
                Знак {open.symbol} читается «{open.say}» · {open.metal ? 'металл' : 'неметалл'}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#90A4AE', marginTop: 20, letterSpacing: 1 }}>ГДЕ ВСТРЕЧАЕТСЯ</div>
              <div style={{ fontSize: 21, color: '#37474F', marginTop: 6, lineHeight: 1.45 }}>{open.life}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#90A4AE', marginTop: 18, letterSpacing: 1 }}>А ВЫ ЗНАЛИ?</div>
              <div style={{ fontSize: 21, color: '#37474F', marginTop: 6, lineHeight: 1.45 }}>{open.fact}</div>
              <div style={{ marginTop: 22 }}>
                <KButton onClick={() => setOpen(null)}>Закрыть</KButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Карточка элемента: как клетка таблицы Менделеева, только крупная и цветная */
export function ElementCardView({ card, size }: { card: ElementCard; size: 'sm' | 'md' | 'lg' | 'fill' }) {
  const el = elementOf(card.symbol)
  const { bg, fg } = cardColor(card)
  const w = size === 'sm' ? 130 : size === 'md' ? 170 : size === 'lg' ? 240 : undefined
  const k = size === 'sm' ? 0.75 : size === 'lg' ? 1.4 : 1
  return (
    <div style={{
      width: w ?? '100%', aspectRatio: '3 / 4', borderRadius: 22 * k, position: 'relative',
      background: `linear-gradient(160deg, white 0%, ${bg} 100%)`, border: `${Math.max(3, 4 * k)}px solid ${fg}`,
      boxShadow: `0 ${6 * k}px 0 ${fg}55`, padding: 12 * k,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: KFONT, color: fg,
    }}>
      <div style={{ position: 'absolute', top: 10 * k, left: 12 * k, fontSize: 18 * k, fontWeight: 700 }}>{el.z}</div>
      <div style={{ position: 'absolute', top: 8 * k, right: 10 * k, fontSize: 24 * k }}>{card.emoji}</div>
      <div style={{ fontSize: 66 * k, fontWeight: 700, lineHeight: 1.05 }}>{card.symbol}</div>
      <div style={{ fontSize: 17 * k, fontWeight: 700, color: '#37474F' }}>{el.name}</div>
      <div style={{ fontSize: 14 * k, color: '#78909C' }}>«{card.say}»</div>
      <div style={{ fontSize: 12 * k, color: '#90A4AE', marginTop: 4 * k }}>{el.mass}</div>
    </div>
  )
}

const linkStyle: CSSProperties = {
  border: 'none', background: 'none', cursor: 'pointer', fontFamily: KFONT,
  fontSize: 18, fontWeight: 700, color: '#78909C', padding: '10px 4px', minHeight: 44,
}

const chipStyle: CSSProperties = {
  border: '2px solid #CFD8DC', background: 'white', cursor: 'pointer', fontFamily: KFONT,
  fontSize: 15, fontWeight: 700, color: '#546E7A', padding: '8px 14px', borderRadius: 999, minHeight: 44,
}
