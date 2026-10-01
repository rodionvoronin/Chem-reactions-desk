import { useState } from 'react'
import { ScaleGame as Game, ScaleCase } from '../types'
import { KButton, Feedback, sfx, useTeams } from '../kit'
import { starsByMistakes } from '../progress'
import { useIsNarrow } from '../../useViewport'

const ANSWERS: Array<{ id: ScaleCase['answer']; label: string; emoji: string }> = [
  { id: 'less', label: 'Станет меньше', emoji: '⬇️' },
  { id: 'same', label: 'Не изменится', emoji: '⚖️' },
  { id: 'more', label: 'Станет больше', emoji: '⬆️' },
]

/**
 * Весы Ломоносова: сначала предсказание, потом «опыт» — коромысло наклоняется.
 * Если масса уменьшилась, сосуд на левой чаше становится легче гири справа.
 */
export function ScaleGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const narrow = useIsNarrow()
  const [index, setIndex] = useState(0)
  const [wrong, setWrong] = useState<string[]>([])
  const [solved, setSolved] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const c = game.cases[index]

  const pick = (id: ScaleCase['answer']) => {
    if (solved || wrong.includes(id)) return
    if (id === c.answer) {
      sfx.right()
      setSolved(true)
      teams.award(1)
    } else {
      sfx.wrong()
      setWrong([...wrong, id])
      setMistakes((m) => m + 1)
      teams.pass()
    }
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.cases.length) {
      onFinish(starsByMistakes(mistakes, game.cases.length))
      return
    }
    setIndex(index + 1)
    setWrong([])
    setSolved(false)
  }

  // Наклон коромысла: лёгкая чаша поднимается
  const tilt = !solved ? 0 : c.answer === 'less' ? 9 : c.answer === 'more' ? -9 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: narrow ? '1fr' : 'minmax(0, 1fr) 420px', alignItems: 'center' }}>
        <div key={c.id} className="kids-pop" style={{ background: 'white', borderRadius: 26, padding: '22px 26px', boxShadow: '0 8px 24px rgba(38,50,56,0.1)' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#5D4037' }}>{c.emoji} {c.title}</div>
          <div style={{ fontSize: narrow ? 20 : 25, color: '#263238', lineHeight: 1.45, marginTop: 10 }}>{c.text}</div>
          <div style={{ fontSize: 21, fontWeight: 700, color: '#78909C', marginTop: 14 }}>Что покажут весы после реакции?</div>
        </div>
        <Balance tilt={tilt} emoji={c.emoji} />
      </div>

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {ANSWERS.map((a) => {
          const isWrong = wrong.includes(a.id)
          const isRight = solved && a.id === c.answer
          return (
            <button
              key={a.id}
              onClick={() => pick(a.id)}
              className={isWrong ? 'kids-shake' : undefined}
              style={{
                fontFamily: 'inherit', cursor: 'pointer', borderRadius: 22, padding: '18px 14px', minHeight: 90,
                fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                border: `4px solid ${isRight ? '#43A047' : isWrong ? '#FFAB91' : '#CFD8DC'}`,
                background: isRight ? '#E8F5E9' : isWrong ? '#FBE9E7' : 'white',
                color: isWrong ? '#BCAAA4' : '#37474F', opacity: solved && !isRight ? 0.5 : 1,
              }}
            >
              <span style={{ fontSize: 34 }}>{a.emoji}</span>{a.label}
            </button>
          )
        })}
      </div>

      {solved && (
        <Feedback
          kind="right" title="Верно!" text={c.note}
          action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.cases.length ? 'Готово!' : 'Следующий опыт →'}</KButton>}
        />
      )}

      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
        Опыт {index + 1} из {game.cases.length}
      </div>
    </div>
  )
}

function Balance({ tilt, emoji }: { tilt: number; emoji: string }) {
  const rad = (tilt * Math.PI) / 180
  const arm = 140
  const lx = 210 - arm * Math.cos(rad)
  const rx = 210 + arm * Math.cos(rad)
  // Положительный наклон — левая чаша легче и поднимается
  const leftY = 90 - arm * Math.sin(rad)
  const rightY = 90 + arm * Math.sin(rad)
  return (
    <svg viewBox="0 0 420 300" style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto' }}>
      <rect x="150" y="268" width="120" height="16" rx="8" fill="#8D6E63" />
      <rect x="203" y="96" width="14" height="176" rx="6" fill="#A1887F" />
      <line
        x1={210 - arm} y1={90} x2={210 + arm} y2={90} stroke="#6D4C41" strokeWidth="10" strokeLinecap="round"
        style={{ transformOrigin: '210px 90px', transform: `rotate(${tilt}deg)`, transition: 'transform 0.9s cubic-bezier(.3,1.6,.5,1)' }}
      />
      <circle cx="210" cy="90" r="11" fill="#5D4037" />
      {/* Чаши на подвесах */}
      {[{ x: lx, y: leftY, side: 'L' }, { x: rx, y: rightY, side: 'R' }].map((p) => (
        <g key={p.side} style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: 'transform 0.9s cubic-bezier(.3,1.6,.5,1)' }}>
          <line x1="0" y1="0" x2="-44" y2="80" stroke="#90A4AE" strokeWidth="3" />
          <line x1="0" y1="0" x2="44" y2="80" stroke="#90A4AE" strokeWidth="3" />
          <path d="M -56 80 Q 0 112 56 80 Z" fill="#B0BEC5" />
          {p.side === 'L'
            ? <text x="0" y="66" textAnchor="middle" fontSize="54">{emoji}</text>
            : <g><rect x="-24" y="38" width="48" height="40" rx="8" fill="#546E7A" /><text x="0" y="66" textAnchor="middle" fontSize="18" fontWeight="700" fill="white">гиря</text></g>}
        </g>
      ))}
    </svg>
  )
}
