import { useState } from 'react'
import { QuizGame as Game } from '../types'
import { KButton, Feedback, sfx, useTeams, useStreak, KFONT } from '../kit'
import { starsByMistakes } from '../progress'

const LETTERS = ['А', 'Б', 'В', 'Г', 'Д']

/**
 * Викторина-«лестница». Каждый вопрос — ступенька: ответили с первой
 * попытки — ступенька горит золотом, со второй — серым. На всю игру две
 * подсказки, как в телевикторине: «50 на 50» убирает два неверных варианта,
 * «Помощь класса» — голосование руками. Неверный вариант гаснет, но вопрос
 * остаётся: до верного ответа доходят всегда, иначе пояснение не прозвучит.
 */
export function QuizGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const streak = useStreak()
  const [index, setIndex] = useState(0)
  const [wrong, setWrong] = useState<number[]>([])
  const [solved, setSolved] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  /** Как пройдена каждая ступенька: с первой попытки или нет */
  const [steps, setSteps] = useState<Array<'gold' | 'grey'>>([])
  const [fifty, setFifty] = useState<number[] | null>(null)
  const [usedFifty, setUsedFifty] = useState(false)
  const [usedVote, setUsedVote] = useState(false)
  const [voting, setVoting] = useState(false)
  const q = game.questions[index]
  const total = game.questions.length

  const pick = (i: number) => {
    if (solved || wrong.includes(i) || fifty?.includes(i)) return
    setVoting(false)
    if (i === q.answer) {
      sfx.right()
      setSolved(true)
      setSteps((s) => [...s, wrong.length ? 'grey' : 'gold'])
      if (!wrong.length) streak.hit()
      teams.award(1)
    } else {
      sfx.wrong()
      setWrong((w) => [...w, i])
      setMistakes((m) => m + 1)
      streak.miss()
      teams.pass()
    }
  }

  const useFifty = () => {
    if (usedFifty || solved) return
    sfx.pop()
    // Убираем два неверных варианта из тех, что ещё не погасли
    const pool = q.options.map((_, i) => i).filter((i) => i !== q.answer && !wrong.includes(i))
    setFifty(pool.sort(() => Math.random() - 0.5).slice(0, Math.max(0, Math.min(2, pool.length - 1))))
    setUsedFifty(true)
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= total) {
      onFinish(starsByMistakes(mistakes, total))
      return
    }
    setIndex(index + 1)
    setWrong([])
    setSolved(false)
    setFifty(null)
  }

  return (
    <div style={{ display: 'flex', gap: 26, alignItems: 'flex-start' }}>
      {streak.view}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div key={q.id} className="kids-pop" style={{
          background: 'linear-gradient(150deg, #1A237E, #3949AB)', color: 'white', borderRadius: 28, padding: '28px 30px',
          boxShadow: '0 10px 30px rgba(26,35,126,0.25)', display: 'flex', alignItems: 'center', gap: 26,
        }}>
          {q.emoji && <div style={{ fontSize: 86, lineHeight: 1 }}>{q.emoji}</div>}
          <div style={{ flex: 1, fontSize: 30, fontWeight: 700, lineHeight: 1.3 }}>{q.text}</div>
        </div>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
          {q.options.map((o, i) => {
            const isWrong = wrong.includes(i)
            const gone = fifty?.includes(i)
            const isRight = solved && i === q.answer
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                className={isWrong ? 'kids-shake' : undefined}
                style={{
                  fontFamily: KFONT, cursor: solved || isWrong || gone ? 'default' : 'pointer',
                  borderRadius: 999, padding: '18px 26px', minHeight: 86, fontSize: 24, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
                  border: `4px solid ${isRight ? '#43A047' : isWrong ? '#FFAB91' : '#C5CAE9'}`,
                  background: isRight ? '#E8F5E9' : isWrong ? '#FBE9E7' : 'white',
                  color: isWrong ? '#BCAAA4' : '#37474F',
                  opacity: gone ? 0.15 : solved && !isRight ? 0.5 : 1,
                  visibility: gone && !solved ? 'hidden' : 'visible',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{
                  flexShrink: 0, width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isRight ? '#43A047' : '#FFB300', color: 'white', fontSize: 22,
                }}>{LETTERS[i]}</span>
                {o.emoji && <span style={{ fontSize: 34 }}>{o.emoji}</span>}
                <span>{o.label}</span>
              </button>
            )
          })}
        </div>

        {voting && !solved && (
          <div className="kids-pop" style={{
            textAlign: 'center', fontSize: 26, fontWeight: 700, color: '#4527A0', background: '#EDE7F6',
            borderRadius: 20, padding: '14px 20px',
          }}>
            🙋 Помощь класса: учитель называет варианты по очереди — кто за какой, поднимите руку!
          </div>
        )}

        {solved && (
          <Feedback
            kind="right" title="Верно!" text={q.note}
            action={<KButton big color="#43A047" onClick={next}>{index + 1 >= total ? 'Готово!' : 'Следующая ступенька ↑'}</KButton>}
          />
        )}
        {!solved && wrong.length > 0 && (
          <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#E65100' }}>
            Не совсем. Попробуйте ещё{teams.enabled ? ` — отвечает команда «${teams.names[teams.turn]}»` : ''}!
          </div>
        )}
      </div>

      {/* Лестница и подсказки */}
      <div style={{ width: 210, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={useFifty} disabled={usedFifty || solved} title="Убрать два неверных ответа" style={lifeline(usedFifty)}>50:50</button>
          <button onClick={() => { if (!usedVote && !solved) { sfx.pop(); setUsedVote(true); setVoting(true) } }} disabled={usedVote || solved} title="Голосование класса" style={lifeline(usedVote)}>🙋</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 6 }}>
          {game.questions.map((_, i) => {
            const st = steps[i]
            const now = i === index
            return (
              <div key={i} style={{
                borderRadius: 12, padding: '7px 14px', fontFamily: KFONT, fontWeight: 700, fontSize: 18,
                display: 'flex', justifyContent: 'space-between',
                background: st === 'gold' ? '#FFC107' : st === 'grey' ? '#CFD8DC' : now ? '#3949AB' : 'white',
                color: st === 'gold' ? '#5D4037' : now ? 'white' : '#78909C',
                border: `2px solid ${now ? '#1A237E' : '#E0E6EA'}`,
              }} className={now && !solved ? 'kids-glow' : undefined}>
                <span>{i + 1}</span>
                <span>{st === 'gold' ? '★' : st === 'grey' ? '✓' : `${(i + 1) * 100}`}</span>
              </div>
            )
          })}
        </div>
        <div style={{ fontSize: 14, color: '#90A4AE', textAlign: 'center', lineHeight: 1.3 }}>★ — ответ с первой попытки</div>
      </div>
    </div>
  )
}

function lifeline(used: boolean) {
  return {
    flex: 1, height: 54, borderRadius: 999, fontFamily: KFONT, fontWeight: 700, fontSize: 20,
    cursor: used ? 'default' : 'pointer', border: `3px solid ${used ? '#ECEFF1' : '#7E57C2'}`,
    background: used ? '#F5F5F5' : 'white', color: used ? '#CFD8DC' : '#4527A0',
    textDecoration: used ? 'line-through' : 'none',
  } as const
}
