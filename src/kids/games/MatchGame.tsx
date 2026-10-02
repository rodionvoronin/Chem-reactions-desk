import { useState, useMemo } from 'react'
import { MatchGame as Game } from '../types'
import { Feedback, KButton, sfx, shuffle, useTeams, KFONT } from '../kit'
import { starsByMistakes } from '../progress'

const PAIR_COLORS = ['#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#E53935', '#00ACC1', '#6D4C41', '#C0CA33']

/**
 * Соедини пары: нажмите слева, затем справа. Совпало — пара окрашивается
 * своим цветом, нет — карточки вздрагивают и ход переходит.
 */
export function MatchGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const left = useMemo(() => shuffle(game.pairs.map((_, i) => i)), [game])
  const right = useMemo(() => shuffle(game.pairs.map((_, i) => i)), [game])
  const [pick, setPick] = useState<number | null>(null)
  const [matched, setMatched] = useState<number[]>([])
  const [wrong, setWrong] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const done = matched.length === game.pairs.length

  const choose = (r: number) => {
    if (pick === null || matched.includes(r)) return
    if (r === pick) {
      sfx.right()
      setMatched([...matched, r])
      setPick(null)
      teams.award(1)
      teams.pass()
    } else {
      sfx.wrong()
      setWrong(r)
      setMistakes((m) => m + 1)
      setTimeout(() => setWrong(null), 500)
      setPick(null)
      teams.pass()
    }
  }

  const color = (i: number) => PAIR_COLORS[matched.indexOf(i) % PAIR_COLORS.length]

  const card = (text: string, i: number, side: 'l' | 'r') => {
    const isMatched = matched.includes(i)
    const isPick = side === 'l' && pick === i
    const isWrong = side === 'r' && wrong === i
    return (
      <button
        key={`${side}${i}`}
        onClick={() => { if (side === 'l' && !isMatched) { sfx.flip(); setPick(i) } else if (side === 'r') choose(i) }}
        className={isWrong ? 'kids-shake' : undefined}
        style={{
          fontFamily: KFONT, fontSize: 21, fontWeight: 700, minHeight: 78, padding: '10px 14px',
          borderRadius: 18, cursor: isMatched ? 'default' : 'pointer', textAlign: 'center',
          border: `4px solid ${isMatched ? color(i) : isPick ? '#3949AB' : isWrong ? '#EF9A9A' : '#CFD8DC'}`,
          background: isMatched ? `${color(i)}22` : isPick ? '#E8EAF6' : 'white',
          color: '#263238', transform: isPick ? 'scale(1.03)' : 'none', transition: 'all 0.15s',
        }}
      >
        {side === 'l' && game.pairs[i].emoji ? `${game.pairs[i].emoji} ` : ''}{text}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ textAlign: 'center', fontSize: 19, color: '#78909C', fontWeight: 700 }}>
        {pick === null ? 'Нажмите карточку слева, потом её пару справа' : 'Теперь — пару справа'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{left.map((i) => card(game.pairs[i].left, i, 'l'))}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{right.map((i) => card(game.pairs[i].right, i, 'r'))}</div>
      </div>
      {done && (
        <Feedback kind="right" title="Все пары найдены!" text={game.note}
          action={<KButton big color="#43A047" onClick={() => onFinish(starsByMistakes(mistakes, game.pairs.length))}>Готово!</KButton>} />
      )}
      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
        Пар: {matched.length} из {game.pairs.length} · ошибок: {mistakes}
      </div>
    </div>
  )
}
