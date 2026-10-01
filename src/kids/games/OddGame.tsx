import { useState } from 'react'
import { OddGame as Game } from '../types'
import { Feedback, KButton, sfx, useTeams, KFONT } from '../kit'
import { starsByMistakes } from '../progress'
import { useIsNarrow } from '../../useViewport'

/** Найди лишнее: из четырёх одно не подходит — какое и почему? */
export function OddGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const narrow = useIsNarrow()
  const [index, setIndex] = useState(0)
  const [wrong, setWrong] = useState<number[]>([])
  const [solved, setSolved] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const round = game.rounds[index]

  const pick = (i: number) => {
    if (solved || wrong.includes(i)) return
    if (i === round.odd) {
      sfx.right()
      setSolved(true)
      teams.award(1)
    } else {
      sfx.wrong()
      setWrong([...wrong, i])
      setMistakes((m) => m + 1)
      teams.pass()
    }
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.rounds.length) { onFinish(starsByMistakes(mistakes, game.rounds.length)); return }
    setIndex(index + 1)
    setWrong([])
    setSolved(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ textAlign: 'center', fontSize: narrow ? 20 : 26, fontWeight: 700, color: '#263238' }}>🔍 Что здесь лишнее?</div>
      <div key={index} style={{ display: 'grid', gap: 16, gridTemplateColumns: narrow ? '1fr 1fr' : `repeat(${round.items.length}, minmax(0, 1fr))` }}>
        {round.items.map((it, i) => {
          const isOdd = solved && i === round.odd
          const isWrong = wrong.includes(i)
          return (
            <button key={i} onClick={() => pick(i)} className={isWrong ? 'kids-shake' : 'kids-pop'} style={{
              fontFamily: KFONT, cursor: 'pointer', borderRadius: 24, padding: '18px 10px', minHeight: narrow ? 130 : 180,
              border: `4px solid ${isOdd ? '#E53935' : isWrong ? '#FFCC80' : '#CFD8DC'}`,
              background: isOdd ? '#FFEBEE' : 'white', opacity: solved && !isOdd ? 0.55 : 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              textDecoration: isOdd ? 'line-through' : 'none',
            }}>
              {it.emoji && <span style={{ fontSize: narrow ? 46 : 64, lineHeight: 1 }}>{it.emoji}</span>}
              <span style={{ fontSize: narrow ? 18 : 23, fontWeight: 700, color: '#263238' }}>{it.label}</span>
            </button>
          )
        })}
      </div>
      {solved && (
        <Feedback kind="right" title="Верно!" text={round.why}
          action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.rounds.length ? 'Готово!' : 'Дальше →'}</KButton>} />
      )}
      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>Раунд {index + 1} из {game.rounds.length}</div>
    </div>
  )
}
