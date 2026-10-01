import { useState, useEffect, useMemo, useRef } from 'react'
import { BlitzGame as Game } from '../types'
import { STATIONS, PLACE } from '../content'
import { blitzPool, BlitzQuestion } from '../generate'
import { KButton, sfx, shuffle, useTeams, TEAM_COLORS, StarRow } from '../kit'
import { recordBlitz, getKids } from '../progress'
import { count } from '../../plural'
import { useIsNarrow } from '../../useViewport'

export function blitzKey(game: Game): string {
  return `${game.sections.length ? game.sections.join(',') : 'all'}:${game.seconds}`
}

/** Вопросы блица по разделам; станции-блицы в набор не входят */
export function blitzQuestions(game: Game): BlitzQuestion[] {
  const stations = STATIONS.filter((s) => (
    !s.levels.some((l) => l.game.kind === 'blitz')
    && (game.sections.length === 0 || game.sections.includes(PLACE[s.id]?.section.n))
  ))
  return blitzPool(stations)
}

function blitzStars(score: number, seconds: number): 1 | 2 | 3 {
  if (score >= seconds / 6) return 3
  if (score >= seconds / 10) return 2
  return 1
}

/**
 * Блиц: вопросы подряд, время идёт. Ответил — сразу следующий вопрос, без
 * пояснений: это повторение, а не первое знакомство. С командами каждая
 * играет свой раунд на одном и том же наборе тем.
 */
export function BlitzGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const narrow = useIsNarrow()
  const pool = useMemo(() => blitzQuestions(game), [game])
  const rounds = teams.enabled ? 2 : 1
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'ready' | 'run' | 'between' | 'done'>('ready')
  const [queue, setQueue] = useState<BlitzQuestion[]>([])
  const [qi, setQi] = useState(0)
  const [left, setLeft] = useState(game.seconds)
  const [scores, setScores] = useState<number[]>([])
  const [flash, setFlash] = useState<{ pick: number; ok: boolean } | null>(null)
  const [record, setRecord] = useState(false)
  const busy = useRef(false)
  /** Команда, которая начала блиц: по ней подписываем раунды, даже когда ход уже передан */
  const first = useRef(teams.turn)

  const start = (r: number) => {
    sfx.pop()
    setQueue(shuffle(pool).map((q) => {
      // Варианты тоже перемешиваем, иначе ответ запоминается по месту
      const order = shuffle(q.options.map((_, i) => i))
      return { text: q.text, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) }
    }))
    setQi(0)
    setLeft(game.seconds)
    setScores((s) => [...s.slice(0, r), 0])
    setRound(r)
    setPhase('run')
  }

  useEffect(() => {
    if (phase !== 'run') return
    if (left <= 0) {
      sfx.win()
      if (round + 1 < rounds) {
        setPhase('between')
      } else {
        setPhase('done')
        const best = Math.max(...scores)
        setRecord(recordBlitz(blitzKey(game), best))
      }
      return
    }
    const id = setTimeout(() => setLeft((x) => x - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, left])

  const answer = (i: number) => {
    if (busy.current || phase !== 'run') return
    const q = queue[qi % queue.length]
    const ok = i === q.answer
    busy.current = true
    setFlash({ pick: i, ok })
    if (ok) {
      sfx.right()
      setScores((s) => s.map((v, r) => (r === round ? v + 1 : v)))
      teams.award(1)
    } else {
      sfx.wrong()
    }
    setTimeout(() => {
      setFlash(null)
      setQi((x) => x + 1)
      busy.current = false
    }, ok ? 350 : 800)
  }

  const teamName = (r: number) => (teams.enabled ? teams.names[(first.current + r) % 2] : '')
  const teamColor = (r: number) => (teams.enabled ? TEAM_COLORS[(first.current + r) % 2] : '#F4511E')

  if (pool.length < 4) {
    return <div style={{ fontSize: 22, color: '#78909C' }}>В выбранных разделах пока мало вопросов для блица.</div>
  }

  if (phase === 'ready' || phase === 'between') {
    const prev = phase === 'between' ? scores[round] : null
    return (
      <div className="kids-pop" style={{ background: 'white', borderRadius: 30, padding: narrow ? 22 : 40, textAlign: 'center', boxShadow: '0 10px 30px rgba(38,50,56,0.12)' }}>
        {prev !== null && (
          <div style={{ fontSize: 24, color: '#546E7A', marginBottom: 18 }}>
            Команда «{teamName(round)}»: <b style={{ color: teamColor(round) }}>{count(prev, 'верный ответ', 'верных ответа', 'верных ответов')}</b>
          </div>
        )}
        <div style={{ fontSize: 80 }} className="kids-float">⚡</div>
        <div style={{ fontSize: narrow ? 26 : 38, fontWeight: 700, color: '#263238', marginTop: 10 }}>
          {teams.enabled ? `Раунд команды «${teamName(phase === 'between' ? round + 1 : 0)}»` : 'Готовы?'}
        </div>
        <div style={{ fontSize: 21, color: '#78909C', marginTop: 10 }}>
          {game.seconds} секунд · вопросов в наборе: {pool.length}
          {getKids().blitz[blitzKey(game)] ? ` · рекорд: ${getKids().blitz[blitzKey(game)]}` : ''}
        </div>
        <div style={{ marginTop: 26 }}>
          <KButton big color={teamColor(phase === 'between' ? round + 1 : 0)} onClick={() => {
            if (phase === 'between') { teams.pass(); start(round + 1) } else start(0)
          }}>
            Старт!
          </KButton>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const best = Math.max(...scores)
    const winner = scores.length === 2 && scores[0] !== scores[1] ? (scores[0] > scores[1] ? 0 : 1) : null
    return (
      <div className="kids-pop" style={{ background: 'white', borderRadius: 30, padding: narrow ? 22 : 40, textAlign: 'center', boxShadow: '0 10px 30px rgba(38,50,56,0.12)' }}>
        <div style={{ fontSize: 70 }}>🏁</div>
        {scores.map((s, r) => (
          <div key={r} style={{ fontSize: narrow ? 22 : 30, fontWeight: 700, color: teamColor(r), marginTop: 8 }}>
            {teams.enabled ? `«${teamName(r)}»: ` : 'Результат: '}{count(s, 'верный ответ', 'верных ответа', 'верных ответов')}
          </div>
        ))}
        {teams.enabled && (
          <div style={{ fontSize: 24, fontWeight: 700, color: '#455A64', marginTop: 14 }}>
            {winner === null ? 'Ничья!' : `Победила команда «${teamName(winner)}»! 🎉`}
          </div>
        )}
        {record && <div style={{ fontSize: 22, fontWeight: 700, color: '#F9A825', marginTop: 10 }}>🏆 Новый рекорд!</div>}
        <div style={{ marginTop: 16 }}><StarRow value={blitzStars(best, game.seconds)} size={56} /></div>
        <div style={{ marginTop: 22 }}>
          <KButton big color="#43A047" onClick={() => onFinish(blitzStars(best, game.seconds))}>Дальше →</KButton>
        </div>
      </div>
    )
  }

  const q = queue[qi % queue.length]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1, height: 18, borderRadius: 9, background: '#ECEFF1', overflow: 'hidden' }}>
          <div style={{
            width: `${(left / game.seconds) * 100}%`, height: '100%',
            background: left <= 10 ? '#E53935' : teamColor(round), transition: 'width 1s linear, background 0.3s',
          }} />
        </div>
        <div className={left <= 10 ? 'kids-pulse' : undefined} style={{ fontSize: 30, fontWeight: 700, color: left <= 10 ? '#E53935' : '#455A64', minWidth: 70, textAlign: 'right' }}>
          {left} с
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, color: teamColor(round) }}>⚡ {scores[round] ?? 0}</div>
      </div>

      <div key={qi} className="kids-pop" style={{
        background: 'white', borderRadius: 28, padding: narrow ? '22px 18px' : '34px 30px', textAlign: 'center',
        fontSize: narrow ? 26 : 38, fontWeight: 700, color: '#263238', boxShadow: '0 10px 30px rgba(38,50,56,0.12)', lineHeight: 1.3,
      }}>
        {q.text}
      </div>

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: `repeat(${narrow ? 1 : Math.min(q.options.length, 4) === 3 ? 3 : 2}, minmax(0, 1fr))` }}>
        {q.options.map((o, i) => {
          const isPick = flash?.pick === i
          const isAnswer = flash && !flash.ok && i === q.answer
          return (
            <button
              key={i}
              onClick={() => answer(i)}
              style={{
                fontFamily: 'inherit', cursor: 'pointer', borderRadius: 22, padding: '18px 14px', minHeight: 84,
                fontSize: narrow ? 21 : 26, fontWeight: 700, color: '#37474F',
                border: `4px solid ${isPick ? (flash!.ok ? '#43A047' : '#E53935') : isAnswer ? '#43A047' : '#CFD8DC'}`,
                background: isPick ? (flash!.ok ? '#E8F5E9' : '#FFEBEE') : isAnswer ? '#E8F5E9' : 'white',
                transition: 'background 0.15s',
              }}
            >
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}
