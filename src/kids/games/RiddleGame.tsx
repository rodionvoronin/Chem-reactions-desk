import { useState, useMemo } from 'react'
import { RiddleGame as Game } from '../types'
import { CARD_MAP, elementOf, cardColor } from '../elements'
import { count } from '../../plural'
import { KButton, Feedback, sfx, shuffle, useTeams } from '../kit'

/**
 * Загадка от лица элемента. Подсказки открываются по одной, от трудной
 * к лёгкой: угадали с первой — три очка, со второй — два, с третьей — одно.
 */
export function RiddleGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const rounds = useMemo(() => shuffle(game.pool).slice(0, game.rounds).map((symbol) => ({
    symbol,
    options: shuffle([symbol, ...shuffle(game.pool.filter((s) => s !== symbol)).slice(0, 3)]),
  })), [game])
  const [index, setIndex] = useState(0)
  const [clues, setClues] = useState(1)
  const [wrong, setWrong] = useState<string[]>([])
  const [solved, setSolved] = useState(false)
  const [points, setPoints] = useState(0)

  const round = rounds[index]
  const card = CARD_MAP[round.symbol]
  /** Очки за раунд: открытые подсказки и промахи их уменьшают */
  const worth = Math.max(0, 4 - clues - wrong.length)

  const pick = (s: string) => {
    if (solved || wrong.includes(s)) return
    if (s === round.symbol) {
      sfx.right()
      setSolved(true)
      setPoints((p) => p + worth)
      teams.award(worth)
    } else {
      sfx.wrong()
      setWrong((w) => [...w, s])
      // Промах открывает следующую подсказку: так загадка не зависает
      setClues((c) => Math.min(3, c + 1))
      teams.pass()
    }
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= rounds.length) {
      const share = points / (rounds.length * 3)
      onFinish(share >= 0.7 ? 3 : share >= 0.4 ? 2 : 1)
      return
    }
    setIndex(index + 1)
    setClues(1)
    setWrong([])
    setSolved(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{
        background: 'white', borderRadius: 28, padding: '24px 28px',
        boxShadow: '0 10px 30px rgba(38,50,56,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <span style={{ fontSize: 52 }} className="kids-float">{solved ? card.emoji : '❓'}</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#6D4C41' }}>
            {solved ? `Это ${elementOf(card.symbol).name.toLowerCase()}!` : 'Кто я?'}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 700, color: '#FFB300' }}>
            {!solved && `за ответ: ${count(worth, 'очко', 'очка', 'очков')}`}
          </span>
        </div>
        {card.clues.slice(0, solved ? 3 : clues).map((c, i) => (
          <div key={i} className="kids-pop" style={{
            fontSize: 27, color: '#37474F', lineHeight: 1.4, padding: '10px 0',
            borderTop: i ? '2px dashed #ECEFF1' : 'none', fontWeight: 600,
          }}>
            <span style={{ color: '#BCAAA4', marginRight: 10 }}>{i + 1}.</span>{c}
          </div>
        ))}
        {!solved && clues < 3 && (
          <div style={{ marginTop: 12 }}>
            <KButton ghost color="#6D4C41" onClick={() => { sfx.pop(); setClues(clues + 1) }}>
              Ещё подсказка
            </KButton>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        {round.options.map((s) => {
          const c = CARD_MAP[s]
          const { bg, fg } = cardColor(c)
          const isWrong = wrong.includes(s)
          const isRight = solved && s === round.symbol
          return (
            <button
              key={s}
              onClick={() => pick(s)}
              className={isWrong ? 'kids-shake' : undefined}
              style={{
                fontFamily: 'inherit', cursor: 'pointer', borderRadius: 22, padding: '14px 10px',
                border: `4px solid ${isRight ? '#43A047' : isWrong ? '#FFAB91' : fg}`,
                background: isWrong ? '#FBE9E7' : bg,
                opacity: isWrong || (solved && !isRight) ? 0.45 : 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                transform: isRight ? 'scale(1.06)' : 'none', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 58, fontWeight: 700, color: fg, lineHeight: 1.1 }}>{s}</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#37474F' }}>{elementOf(s).name}</span>
            </button>
          )
        })}
      </div>

      {solved && (
        <Feedback
          kind="right" title={`${card.emoji} ${elementOf(card.symbol).name} — «${card.say}»`} text={card.fact}
          action={<KButton big color="#43A047" onClick={next}>{index + 1 >= rounds.length ? 'Готово!' : 'Следующая загадка →'}</KButton>}
        />
      )}

      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
        Загадка {index + 1} из {rounds.length} · очков: {points}
      </div>
    </div>
  )
}
