import { useState } from 'react'
import { MicroGame as Game } from '../types'
import { Feedback, KButton, sfx, useTeams, KFONT, shade } from '../kit'
import { starsByMistakes } from '../progress'
import { SceneView, Legend } from '../particles'

/**
 * «Под микроскопом»: рисунок из частиц и несколько вариантов ответа.
 * Смотреть приходится на сами частицы — сколько в них разных цветов, сколько
 * разных частиц в сосуде, как они стоят. Так понятия «простое вещество»,
 * «смесь», «газ» привязываются к модели, а не к заученному списку.
 */
export function MicroGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const [index, setIndex] = useState(0)
  const [wrong, setWrong] = useState<string[]>([])
  const [solved, setSolved] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const round = game.rounds[index]

  const pick = (id: string) => {
    if (solved || wrong.includes(id)) return
    if (id === round.bin) { sfx.right(); setSolved(true); teams.award(1) }
    else { sfx.wrong(); setWrong([...wrong, id]); setMistakes((m) => m + 1); teams.pass() }
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.rounds.length) { onFinish(starsByMistakes(mistakes, game.rounds.length)); return }
    setIndex(index + 1)
    setWrong([])
    setSolved(false)
  }

  const scenes = round.after ? [round, round.after] : [round]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      <div key={index} className="kids-pop" style={{
        display: 'flex', alignItems: 'center', gap: 24, background: 'white', borderRadius: 28, padding: '18px 26px',
        boxShadow: '0 10px 30px rgba(38,50,56,0.12)',
      }}>
        <SceneView scene={round} seed={`${index}-a`} size={round.after ? 430 : 620} label={round.after ? 'Было' : undefined} />
        {round.after && (
          <>
            <div style={{ fontSize: 60, color: '#90A4AE' }}>➜</div>
            <SceneView scene={round.after} seed={`${index}-b`} size={430} label="Стало" />
          </>
        )}
      </div>
      <Legend scenes={scenes} />

      <div style={{ display: 'grid', gap: 14, width: '100%', gridTemplateColumns: `repeat(${game.bins.length}, minmax(0, 1fr))` }}>
        {game.bins.map((b) => {
          const isRight = solved && b.id === round.bin
          const isWrong = wrong.includes(b.id)
          return (
            <button key={b.id} onClick={() => pick(b.id)} className={isWrong ? 'kids-shake' : undefined} style={{
              fontFamily: KFONT, cursor: solved || isWrong ? 'default' : 'pointer', borderRadius: 22, padding: '14px 12px', minHeight: 96,
              border: `4px solid ${isRight ? '#43A047' : isWrong ? '#FFAB91' : b.color}`,
              background: isRight ? '#E8F5E9' : isWrong ? '#FBE9E7' : 'white',
              opacity: solved && !isRight ? 0.45 : 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 34 }}>{b.emoji}</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: shade(b.color, 0.6) }}>{b.title}</span>
              {b.subtitle && <span style={{ fontSize: 15, color: '#78909C' }}>{b.subtitle}</span>}
            </button>
          )
        })}
      </div>

      {solved && (
        <div style={{ width: '100%' }}>
          <Feedback kind="right" title="Верно!" text={round.note}
            action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.rounds.length ? 'Готово!' : 'Дальше →'}</KButton>} />
        </div>
      )}
      <div style={{ fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>Рисунок {index + 1} из {game.rounds.length}</div>
    </div>
  )
}
