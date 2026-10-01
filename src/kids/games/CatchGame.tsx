import { useState, useEffect, useRef } from 'react'
import { CatchGame as Game } from '../types'
import { KButton, sfx, useTeams, TEAM_COLORS, StarRow, KFONT } from '../kit'
import { count } from '../../plural'
import { useIsNarrow } from '../../useViewport'

interface Drop { id: number; text: string; good: boolean; x: number; dur: number }

/**
 * Лови! Сверху падают пузыри с надписями — нажимать только те, что подходят.
 * Верный пузырь — очко, неверный — минус очко. Время ограничено.
 * С командами каждая играет свой раунд.
 */
export function CatchGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const narrow = useIsNarrow()
  const rounds = teams.enabled ? 2 : 1
  const first = useRef(teams.turn)
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'ready' | 'run' | 'between' | 'done'>('ready')
  const [drops, setDrops] = useState<Drop[]>([])
  const [scores, setScores] = useState<number[]>([])
  const [left, setLeft] = useState(game.seconds)
  const [flash, setFlash] = useState<{ id: number; good: boolean } | null>(null)
  const seq = useRef(0)

  const teamName = (r: number) => (teams.enabled ? teams.names[(first.current + r) % 2] : '')
  const teamColor = (r: number) => (teams.enabled ? TEAM_COLORS[(first.current + r) % 2] : '#00897B')

  useEffect(() => {
    if (phase !== 'run') return
    if (left <= 0) {
      sfx.win()
      setDrops([])
      setPhase(round + 1 < rounds ? 'between' : 'done')
      return
    }
    const t = setTimeout(() => setLeft((x) => x - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, left]) // eslint-disable-line react-hooks/exhaustive-deps

  // Новый пузырь каждые 0,8 с; доля нужных — около половины
  useEffect(() => {
    if (phase !== 'run') return
    const t = setInterval(() => {
      const good = Math.random() < 0.5
      const list = good ? game.good : game.bad
      const text = list[Math.floor(Math.random() * list.length)]
      const id = seq.current++
      setDrops((d) => [...d.slice(-14), { id, text, good, x: 4 + Math.random() * 78, dur: 4.5 + Math.random() * 2 }])
    }, 800)
    return () => clearInterval(t)
  }, [phase, game])

  const start = (r: number) => {
    sfx.pop()
    setRound(r)
    setScores((s) => [...s.slice(0, r), 0])
    setLeft(game.seconds)
    setDrops([])
    setPhase('run')
  }

  const hit = (d: Drop) => {
    setDrops((all) => all.filter((x) => x.id !== d.id))
    setFlash({ id: d.id, good: d.good })
    setTimeout(() => setFlash(null), 300)
    if (d.good) { sfx.right(); teams.award(1) } else sfx.wrong()
    setScores((s) => s.map((v, i) => (i === round ? Math.max(0, v + (d.good ? 1 : -1)) : v)))
  }

  const stars = (s: number) => (s >= game.seconds / 3 ? 3 : s >= game.seconds / 6 ? 2 : 1)

  if (phase === 'ready' || phase === 'between') {
    const r = phase === 'between' ? round + 1 : 0
    return (
      <div className="kids-pop" style={{ background: 'white', borderRadius: 30, padding: narrow ? 22 : 40, textAlign: 'center', boxShadow: '0 10px 30px rgba(38,50,56,0.12)' }}>
        {phase === 'between' && <div style={{ fontSize: 22, color: '#546E7A', marginBottom: 12 }}>«{teamName(round)}» поймала: <b>{count(scores[round] ?? 0, 'пузырь', 'пузыря', 'пузырей')}</b></div>}
        <div style={{ fontSize: 80 }} className="kids-float">🫧</div>
        <div style={{ fontSize: narrow ? 26 : 38, fontWeight: 700, color: '#263238' }}>{game.prompt}</div>
        <div style={{ fontSize: 20, color: '#78909C', marginTop: 8 }}>Нажимайте только нужные пузыри · {game.seconds} секунд · неверный — минус очко</div>
        {teams.enabled && <div style={{ fontSize: 22, fontWeight: 700, color: teamColor(r), marginTop: 12 }}>Ловит команда «{teamName(r)}»</div>}
        <div style={{ marginTop: 24 }}>
          <KButton big color={teamColor(r)} onClick={() => { if (phase === 'between') teams.pass(); start(r) }}>Старт!</KButton>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const best = Math.max(...scores)
    const winner = scores.length === 2 && scores[0] !== scores[1] ? (scores[0] > scores[1] ? 0 : 1) : null
    return (
      <div className="kids-pop" style={{ background: 'white', borderRadius: 30, padding: narrow ? 22 : 40, textAlign: 'center' }}>
        <div style={{ fontSize: 70 }}>🏁</div>
        {scores.map((s, r) => (
          <div key={r} style={{ fontSize: 28, fontWeight: 700, color: teamColor(r) }}>
            {teams.enabled ? `«${teamName(r)}»: ` : 'Поймано: '}{count(s, 'пузырь', 'пузыря', 'пузырей')}
          </div>
        ))}
        {teams.enabled && <div style={{ fontSize: 22, fontWeight: 700, color: '#455A64', marginTop: 10 }}>{winner === null ? 'Ничья!' : `Победила «${teamName(winner)}»!`}</div>}
        <div style={{ marginTop: 14 }}><StarRow value={stars(best)} size={56} /></div>
        <div style={{ marginTop: 20 }}><KButton big color="#43A047" onClick={() => onFinish(stars(best))}>Дальше →</KButton></div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: narrow ? 18 : 24, fontWeight: 700, color: '#263238' }}>{game.prompt}</div>
        <div style={{ marginLeft: 'auto', fontSize: 28, fontWeight: 700, color: left <= 5 ? '#E53935' : '#455A64' }}>{left} с</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: teamColor(round) }}>🫧 {scores[round] ?? 0}</div>
      </div>
      <div style={{
        position: 'relative', height: narrow ? 460 : 600, borderRadius: 28, overflow: 'hidden',
        background: 'linear-gradient(180deg, #E1F5FE 0%, #B3E5FC 100%)', userSelect: 'none',
      }}>
        {drops.map((d) => (
          <button
            key={d.id}
            onPointerDown={() => hit(d)}
            style={{
              position: 'absolute', top: 0, left: `${d.x}%`, fontFamily: KFONT,
              animation: `kids-fall-item ${d.dur}s linear forwards`,
              fontSize: narrow ? 18 : 24, fontWeight: 700, color: '#0D47A1', cursor: 'pointer',
              padding: narrow ? '14px 16px' : '18px 22px', borderRadius: 999, whiteSpace: 'nowrap',
              border: '3px solid rgba(255,255,255,0.9)',
              background: 'radial-gradient(circle at 30% 30%, #FFFFFF 0%, rgba(255,255,255,0.75) 40%, rgba(129,212,250,0.85) 100%)',
              boxShadow: '0 6px 16px rgba(2,119,189,0.25)',
            }}
          >
            {d.text}
          </button>
        ))}
        {flash && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: flash.good ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.18)' }} />
        )}
      </div>
    </div>
  )
}
