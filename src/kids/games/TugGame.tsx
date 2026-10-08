import { useEffect, useMemo, useState } from 'react'
import { TugGame as Game } from '../types'
import { blitzQuestions } from './BlitzGame'
import { KButton, sfx, shuffle, useTeams, KFONT, TEAM_COLORS, Confetti } from '../kit'

/** На сколько шагов нужно перетянуть канат, чтобы победить */
const WIN = 5
/** Сколько секунд сторона «стоит», если ответила неверно */
const FREEZE = 2

/**
 * «Перетягивание каната». Доска делится пополам: у каждой команды свой
 * вопрос и свои кнопки, отвечают одновременно. Верный ответ тянет канат
 * на шаг к себе, неверный на пару секунд «замораживает» сторону — поэтому
 * угадывать наугад невыгодно. Вопросы — из игр пройденных уроков.
 */
export function TugGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const names = teams.enabled ? teams.names : ['Левая команда', 'Правая команда'] as [string, string]
  const pool = useMemo(() => shuffle(blitzQuestions({ kind: 'blitz', sections: game.sections, seconds: 0 })).map((q) => {
    const order = shuffle(q.options.map((_, i) => i))
    return { text: q.text, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) }
  }), [game])
  // Стороны берут вопросы через один, чтобы у соседей не было одного и того же
  const [qi, setQi] = useState<[number, number]>([0, 1])
  const [rope, setRope] = useState(0)
  const [frozen, setFrozen] = useState<[number, number]>([0, 0])
  const [flash, setFlash] = useState<[string, string]>(['', ''])
  const winner = rope <= -WIN ? 0 : rope >= WIN ? 1 : null

  useEffect(() => {
    if (!frozen[0] && !frozen[1]) return
    const id = setTimeout(() => setFrozen(([a, b]) => [Math.max(0, a - 1), Math.max(0, b - 1)]), 1000)
    return () => clearTimeout(id)
  }, [frozen])

  const answer = (side: 0 | 1, i: number) => {
    if (winner !== null || frozen[side]) return
    const q = pool[qi[side] % pool.length]
    const ok = i === q.answer
    setFlash((f) => (side === 0 ? [ok ? 'ok' : 'bad', f[1]] : [f[0], ok ? 'ok' : 'bad']))
    setTimeout(() => setFlash((f) => (side === 0 ? ['', f[1]] : [f[0], ''])), 450)
    if (ok) {
      sfx.right()
      setRope((r) => r + (side === 0 ? -1 : 1))
      setQi(([a, b]) => (side === 0 ? [a + 2, b] : [a, b + 2]))
    } else {
      sfx.wrong()
      setFrozen((f) => (side === 0 ? [FREEZE, f[1]] : [f[0], FREEZE]))
      setQi(([a, b]) => (side === 0 ? [a + 2, b] : [a, b + 2]))
    }
  }

  useEffect(() => { if (winner !== null) sfx.win() }, [winner])

  const restart = () => { setRope(0); setFrozen([0, 0]); setQi(([a, b]) => [a + 2, b + 2]) }

  const renderSide = (side: 0 | 1) => {
    const q = pool[qi[side] % pool.length]
    const color = TEAM_COLORS[side]
    const cold = frozen[side] > 0
    return (
      <div style={{
        flex: 1, minWidth: 0, background: 'white', borderRadius: 26, padding: 20, border: `5px solid ${color}`,
        boxShadow: flash[side] === 'ok' ? `0 0 0 8px ${color}44` : '0 8px 24px rgba(38,50,56,0.10)',
        opacity: cold ? 0.55 : 1, transition: 'box-shadow 0.2s, opacity 0.2s', display: 'flex', flexDirection: 'column', gap: 14,
      }} className={flash[side] === 'bad' ? 'kids-shake' : undefined}>
        <div style={{ fontSize: 22, fontWeight: 700, color }}>{names[side]}</div>
        <div style={{ fontSize: 25, fontWeight: 700, color: '#263238', lineHeight: 1.3, minHeight: 100 }}>{cold ? `❄️ Заморозка: ${frozen[side]} с` : q.text}</div>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
          {q.options.map((o, i) => (
            <button key={`${qi[side]}-${i}`} onClick={() => answer(side, i)} disabled={cold || winner !== null} style={{
              fontFamily: KFONT, fontSize: 20, fontWeight: 700, minHeight: 74, borderRadius: 16, padding: '8px 10px',
              border: `3px solid ${color}55`, background: 'white', color: '#37474F', cursor: cold ? 'default' : 'pointer',
            }}>{o}</button>
          ))}
        </div>
      </div>
    )
  }

  // Канат: узел в центре сдвигается к победителю
  const shift = (rope / WIN) * 42

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {winner !== null && <Confetti />}
      <div style={{ position: 'relative', height: 90 }}>
        <div style={{ position: 'absolute', left: '4%', right: '4%', top: 40, height: 12, borderRadius: 6, background: 'repeating-linear-gradient(90deg, #A1887F 0 14px, #8D6E63 14px 28px)' }} />
        <div style={{ position: 'absolute', left: '8%', top: 6, bottom: 6, width: 6, background: TEAM_COLORS[0], borderRadius: 3 }} />
        <div style={{ position: 'absolute', right: '8%', top: 6, bottom: 6, width: 6, background: TEAM_COLORS[1], borderRadius: 3 }} />
        <div style={{ position: 'absolute', left: '50%', top: 6, bottom: 6, width: 2, background: '#B0BEC5' }} />
        <div style={{
          position: 'absolute', top: 24, left: `calc(50% + ${shift}% - 22px)`, width: 44, height: 44, borderRadius: '50%',
          background: '#FFCA28', border: '4px solid #F57F17', transition: 'left 0.35s ease-out', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>🪢</div>
      </div>

      {winner === null ? (
        <div style={{ display: 'flex', gap: 22 }}>
          {renderSide(0)}
          {renderSide(1)}
        </div>
      ) : (
        <div className="kids-pop" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: TEAM_COLORS[winner] }}>🏆 Канат у команды «{names[winner]}»!</div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <KButton ghost color="#78909C" onClick={restart}>Реванш</KButton>
            <KButton big color="#43A047" onClick={() => onFinish(3)}>Дальше →</KButton>
          </div>
        </div>
      )}
    </div>
  )
}
