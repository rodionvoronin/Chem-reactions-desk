import { useState, useMemo } from 'react'
import { OrderGame as Game } from '../types'
import { Feedback, KButton, sfx, shuffle, useTeams, KFONT } from '../kit'
import { starsByMistakes } from '../progress'

/**
 * По порядку: шаги перепутаны, класс нажимает их в правильной
 * последовательности. Верный шаг переезжает в «ленту» слева.
 */
export function OrderGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const pool = useMemo(() => {
    // Перемешиваем, но не оставляем исходный порядок — иначе играть нечего
    let s = shuffle(game.steps.map((_, i) => i))
    while (s.every((v, i) => v === i) && s.length > 1) s = shuffle(s)
    return s
  }, [game])
  const [placed, setPlaced] = useState<number[]>([])
  const [wrong, setWrong] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const done = placed.length === game.steps.length

  const tap = (i: number) => {
    if (placed.includes(i)) return
    if (i === placed.length) {
      sfx.right()
      setPlaced([...placed, i])
      teams.award(1)
      teams.pass()
    } else {
      sfx.wrong()
      setWrong(i)
      setMistakes((m) => m + 1)
      setTimeout(() => setWrong(null), 500)
      teams.pass()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ textAlign: 'center', fontSize: 26, fontWeight: 700, color: '#263238' }}>{game.prompt}</div>
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: '#E8F5E9', borderRadius: 24, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#2E7D32', letterSpacing: 1 }}>ПРАВИЛЬНЫЙ ПОРЯДОК</div>
          {placed.map((i) => (
            <div key={i} className="kids-pop" style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'white', borderRadius: 16, padding: '10px 14px', fontSize: 21, fontWeight: 600, color: '#263238' }}>
              <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: '#43A047', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{i + 1}</span>
              {game.steps[i]}
            </div>
          ))}
          {/* Пока список пуст, подсказка стоит посередине панели, а не в углу */}
          {!done && placed.length === 0 && <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#81C784', fontWeight: 600 }}>Что идёт первым?</div>}
          {!done && placed.length > 0 && <div style={{ fontSize: 17, color: '#81C784', fontWeight: 600 }}>Что идёт дальше?</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pool.filter((i) => !placed.includes(i)).map((i) => (
            <button key={i} onClick={() => tap(i)} className={wrong === i ? 'kids-shake' : undefined} style={{
              fontFamily: KFONT, fontSize: 21, fontWeight: 600, padding: '14px 18px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
              border: `4px solid ${wrong === i ? '#EF9A9A' : '#CFD8DC'}`, background: wrong === i ? '#FFEBEE' : 'white', color: '#263238',
            }}>
              {game.steps[i]}
            </button>
          ))}
        </div>
      </div>
      {done && (
        <Feedback kind="right" title="Порядок верный!" text={game.note}
          action={<KButton big color="#43A047" onClick={() => onFinish(starsByMistakes(mistakes, game.steps.length))}>Готово!</KButton>} />
      )}
    </div>
  )
}
