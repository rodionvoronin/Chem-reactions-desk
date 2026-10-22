import { useMemo, useState } from 'react'
import { JeopardyGame as Game } from '../types'
import { KButton, sfx, useTeams, KFONT, TEAM_COLORS, Feedback } from '../kit'

const PRICE = (row: number) => (row + 1) * 100

/**
 * «Своя игра». Темы по столбцам, вопросы по цене: чем дороже, тем труднее.
 * Команда выбирает клетку, отвечает — и получает её цену. Ошибка не отнимает
 * очков (это повторение, а не телевикторина), но ход переходит. Вопросы бывают
 * с вариантами и устные: устный ответ открывает учитель и сам решает, засчитать ли.
 *
 * В табло спрятаны два сюрприза, как в телеигре: «Кот в мешке» — вопрос
 * достаётся команде-сопернику, и «Ставка ×2» — цена вопроса удваивается.
 * Где они лежат, не видно, пока клетку не откроют.
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
  /** Клетки-сюрпризы: не на самой дешёвой ступени и не в одной клетке */
  const specials = useMemo(() => {
    const cells = game.topics.flatMap((t, ti) => t.questions.map((_, r) => ({ ti, r }))).filter((c) => c.r > 0)
    const shuffled = cells.sort(() => Math.random() - 0.5)
    return { cat: shuffled[0] ? `${shuffled[0].ti}:${shuffled[0].r}` : '', double: shuffled[1] ? `${shuffled[1].ti}:${shuffled[1].r}` : '' }
  }, [game])
  const [splash, setSplash] = useState<'cat' | 'double' | null>(null)

  const q = open ? game.topics[open.t].questions[open.r] : null
  const openId = open ? `${open.t}:${open.r}` : ''
  const price = open ? PRICE(open.r) * (openId === specials.double ? 2 : 1) : 0

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

  const openCell = (t: number, r: number) => {
    const id = `${t}:${r}`
    setOpen({ t, r })
    if (id === specials.cat) { sfx.win(); setSplash('cat') }
    else if (id === specials.double) { sfx.win(); setSplash('double') }
    else sfx.flip()
  }

  const acceptSplash = () => {
    // Кота в мешке отдают соперникам: отвечать будет другая команда
    if (splash === 'cat') teams.pass()
    setSplash(null)
  }

  if (open && splash) {
    return (
      <div className="kids-pop" style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', padding: '30px 0' }}>
        <div className="kids-float" style={{ fontSize: 150, lineHeight: 1 }}>{splash === 'cat' ? '🐱' : '⭐'}</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: '#4527A0' }}>{splash === 'cat' ? 'Кот в мешке!' : 'Ставка ×2!'}</div>
        <div style={{ fontSize: 26, color: '#455A64', textAlign: 'center', maxWidth: 900 }}>
          {splash === 'cat'
            ? (teams.enabled ? `Этот вопрос достаётся команде «${teams.names[teams.turn === 0 ? 1 : 0]}». Отвечать им!` : 'Этот вопрос задаёт другая половина класса!')
            : `Вопрос стоит вдвое дороже: ${price} очков.`}
        </div>
        <KButton big color="#5E35B1" onClick={acceptSplash}>Принять вопрос</KButton>
      </div>
    )
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
            <button key={`${ti}:${r}`} disabled={!exists || gone} onClick={() => openCell(ti, r)} style={{
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
