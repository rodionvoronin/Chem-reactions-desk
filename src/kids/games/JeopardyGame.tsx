import { useState } from 'react'
import { JeopardyGame as Game } from '../types'
import { KButton, sfx, useTeams, KFONT, TEAM_COLORS, Feedback } from '../kit'

const PRICE = (row: number) => (row + 1) * 100

/**
 * «Своя игра». Темы по столбцам, вопросы по цене: чем дороже, тем труднее.
 * Команда выбирает клетку, отвечает — и получает её цену. Ошибка не отнимает
 * очков (это повторение, а не телевикторина), но ход переходит. Вопросы бывают
 * с вариантами и устные: устный ответ открывает учитель и сам решает, засчитать ли.
 */
export function JeopardyGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const rows = Math.max(...game.topics.map((t) => t.questions.length))
  const [used, setUsed] = useState<string[]>([])
  const [open, setOpen] = useState<{ t: number; r: number } | null>(null)
  const [pick, setPick] = useState<number | null>(null)
  const [shown, setShown] = useState(false)
  const [verdict, setVerdict] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [asked, setAsked] = useState(0)
  const total = game.topics.reduce((n, t) => n + t.questions.length, 0)

  const q = open ? game.topics[open.t].questions[open.r] : null
  const price = open ? PRICE(open.r) : 0

  const judge = (ok: boolean) => {
    setVerdict(ok)
    if (ok) { sfx.right(); teams.award(price); setScore((s) => s + 1) } else { sfx.wrong(); teams.award(0) }
  }

  const choose = (i: number) => {
    if (!q || verdict !== null) return
    setPick(i)
    judge(i === q.answer)
  }

  const close = () => {
    if (!open) return
    const id = `${open.t}:${open.r}`
    const usedNext = [...used, id]
    setUsed(usedNext)
    setAsked((a) => a + 1)
    setOpen(null); setPick(null); setShown(false); setVerdict(null)
    teams.pass()
    if (usedNext.length >= total) finish(asked + 1)
  }

  /** Звёзды — по доле верных ответов среди сыгранных вопросов */
  const finish = (played = asked) => {
    const share = played ? score / played : 0
    onFinish(share >= 0.8 ? 3 : share >= 0.5 ? 2 : 1)
  }

  if (q && open) {
    const answerText = typeof q.answer === 'number' && q.options ? q.options[q.answer] : String(q.answer)
    return (
      <div className="kids-pop" style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#6A1B9A' }}>
          {game.topics[open.t].emoji} {game.topics[open.t].title} · {price}
          {teams.enabled && <span style={{ color: TEAM_COLORS[teams.turn] }}> · отвечает «{teams.names[teams.turn]}»</span>}
        </div>
        <div style={{
          width: '100%', background: 'linear-gradient(150deg, #311B92, #4527A0)', color: 'white', borderRadius: 28,
          padding: '40px 36px', fontSize: 34, fontWeight: 700, lineHeight: 1.35, textAlign: 'center', minHeight: 180,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {q.text}
        </div>
        {q.options ? (
          <div style={{ display: 'grid', gap: 14, width: '100%', gridTemplateColumns: `repeat(${Math.min(q.options.length, 4)}, minmax(0, 1fr))` }}>
            {q.options.map((o, i) => {
              const right = verdict !== null && i === q.answer
              const wrong = pick === i && i !== q.answer
              return (
                <button key={i} onClick={() => choose(i)} style={{
                  fontFamily: KFONT, fontSize: 24, fontWeight: 700, minHeight: 90, borderRadius: 20, cursor: verdict === null ? 'pointer' : 'default',
                  border: `4px solid ${right ? '#43A047' : wrong ? '#EF9A9A' : '#D1C4E9'}`,
                  background: right ? '#E8F5E9' : wrong ? '#FFEBEE' : 'white', color: '#37474F',
                  opacity: verdict !== null && !right && !wrong ? 0.5 : 1,
                }}>{o}</button>
              )
            })}
          </div>
        ) : !shown ? (
          <KButton big color="#5E35B1" onClick={() => { sfx.pop(); setShown(true) }}>Показать ответ</KButton>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#2E7D32' }}>Ответ: {answerText}</div>
            {verdict === null && (
              <div style={{ display: 'flex', gap: 14 }}>
                <KButton big color="#43A047" onClick={() => judge(true)}>Ответили верно (+{price})</KButton>
                <KButton big ghost color="#E53935" onClick={() => judge(false)}>Не ответили</KButton>
              </div>
            )}
          </div>
        )}
        {verdict !== null && (
          <div style={{ width: '100%' }}>
            <Feedback kind={verdict ? 'right' : 'wrong'} title={verdict ? `Верно! +${price}` : `Правильный ответ: ${answerText}`} text={q.note}
              action={<KButton big color="#5E35B1" onClick={close}>К табло →</KButton>} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <div style={{ display: 'grid', gap: 10, width: '100%', gridTemplateColumns: `repeat(${game.topics.length}, minmax(0, 1fr))` }}>
        {game.topics.map((t) => (
          <div key={t.title} style={{
            background: '#4527A0', color: 'white', borderRadius: 16, padding: '12px 8px', textAlign: 'center',
            fontSize: 19, fontWeight: 700, minHeight: 84, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 30 }}>{t.emoji}</span>{t.title}
          </div>
        ))}
        {Array.from({ length: rows }, (_, r) => game.topics.map((t, ti) => {
          const exists = r < t.questions.length
          const gone = used.includes(`${ti}:${r}`)
          return (
            <button key={`${ti}:${r}`} disabled={!exists || gone} onClick={() => { sfx.flip(); setOpen({ t: ti, r }) }} style={{
              fontFamily: KFONT, height: 86, borderRadius: 16, fontSize: 34, fontWeight: 700, cursor: exists && !gone ? 'pointer' : 'default',
              border: 'none', background: gone || !exists ? '#EDE7F6' : 'linear-gradient(160deg, #7E57C2, #5E35B1)',
              color: gone || !exists ? '#D1C4E9' : '#FFD54F', boxShadow: gone || !exists ? 'none' : '0 5px 0 #4527A0',
            }}>
              {exists && !gone ? PRICE(r) : ''}
            </button>
          )
        }))}
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ fontSize: 18, color: '#90A4AE', fontWeight: 700 }}>Сыграно {used.length} из {total}</span>
        <KButton ghost color="#78909C" onClick={() => finish()}>Закончить игру</KButton>
      </div>
    </div>
  )
}
