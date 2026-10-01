import { useState } from 'react'
import { QuizGame as Game } from '../types'
import { KButton, Feedback, sfx, useTeams } from '../kit'
import { starsByMistakes } from '../progress'

/**
 * Викторина: вопрос и крупные варианты. Неверный вариант гаснет, но вопрос
 * остаётся — до верного ответа доходят всегда, иначе пояснение не прозвучит.
 */
export function QuizGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const [index, setIndex] = useState(0)
  const [wrong, setWrong] = useState<number[]>([])
  const [solved, setSolved] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const q = game.questions[index]

  const pick = (i: number) => {
    if (solved || wrong.includes(i)) return
    if (i === q.answer) {
      sfx.right()
      setSolved(true)
      teams.award(1)
    } else {
      sfx.wrong()
      setWrong((w) => [...w, i])
      setMistakes((m) => m + 1)
      teams.pass()
    }
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.questions.length) {
      onFinish(starsByMistakes(mistakes, game.questions.length))
      return
    }
    setIndex(index + 1)
    setWrong([])
    setSolved(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div key={q.id} className="kids-pop" style={{
        background: 'white', borderRadius: 28, padding: '28px 30px',
        boxShadow: '0 10px 30px rgba(38,50,56,0.12)',
        display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap',
      }}>
        {q.emoji && <div style={{ fontSize: 92, lineHeight: 1 }}>{q.emoji}</div>}
        <div style={{ flex: '1 1 300px', fontSize: 30, fontWeight: 700, color: '#263238', lineHeight: 1.3 }}>
          {q.text}
        </div>
      </div>

      <div style={{
        display: 'grid', gap: 16,
        gridTemplateColumns: `repeat(auto-fit, minmax(${q.options.length > 2 ? 220 : 300}px, 1fr))`,
      }}>
        {q.options.map((o, i) => {
          const isWrong = wrong.includes(i)
          const isRight = solved && i === q.answer
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              className={isWrong ? 'kids-shake' : undefined}
              style={{
                fontFamily: 'inherit', cursor: solved || isWrong ? 'default' : 'pointer',
                borderRadius: 22, padding: '22px 18px', minHeight: 110,
                fontSize: 26, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
                border: `4px solid ${isRight ? '#43A047' : isWrong ? '#FFAB91' : '#CFD8DC'}`,
                background: isRight ? '#E8F5E9' : isWrong ? '#FBE9E7' : 'white',
                color: isWrong ? '#BCAAA4' : '#37474F',
                opacity: solved && !isRight ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {o.emoji && <span style={{ fontSize: 40 }}>{o.emoji}</span>}
              {o.label}
            </button>
          )
        })}
      </div>

      {solved && (
        <Feedback
          kind="right" title="Верно!" text={q.note}
          action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.questions.length ? 'Готово!' : 'Дальше →'}</KButton>}
        />
      )}
      {!solved && wrong.length > 0 && (
        <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#E65100' }}>
          Не совсем. Попробуйте ещё{teams.enabled ? ` — отвечает команда «${teams.names[teams.turn]}»` : ''}!
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
        Вопрос {index + 1} из {game.questions.length}
      </div>
    </div>
  )
}
