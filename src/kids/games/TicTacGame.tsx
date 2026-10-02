import { useState, useMemo } from 'react'
import { TicTacGame as Game } from '../types'
import { blitzQuestions } from './BlitzGame'
import { KButton, sfx, shuffle, useTeams, TEAM_COLORS, KFONT } from '../kit'

const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

/**
 * Химические крестики-нолики. Каждая клетка — вопрос из пройденных уроков.
 * Ответила команда верно — клетка её, нет — клетка свободна, ход переходит.
 * Побеждает тот, кто первым соберёт три в ряд.
 */
export function TicTacGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const names = teams.enabled ? teams.names : ['Крестики', 'Нолики'] as [string, string]
  const pool = useMemo(() => shuffle(blitzQuestions({ kind: 'blitz', sections: game.sections, seconds: 0 })).map((q) => {
    const order = shuffle(q.options.map((_, i) => i))
    return { text: q.text, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) }
  }), [game])
  const [qi, setQi] = useState(0)
  const [cells, setCells] = useState<Array<0 | 1 | null>>(Array(9).fill(null))
  // Свой счётчик хода нужен, когда команды не включены: тогда играют «крестики» и «нолики»
  const [localTurn, setLocalTurn] = useState<0 | 1>(0)
  const turn = teams.enabled ? teams.turn : localTurn
  const [open, setOpen] = useState<number | null>(null)
  const [result, setResult] = useState<'right' | 'wrong' | null>(null)

  const winner = LINES.map((l) => l.map((i) => cells[i])).find((v) => v[0] !== null && v[0] === v[1] && v[1] === v[2])?.[0] ?? null
  const full = cells.every((c) => c !== null)
  const over = winner !== null || full

  const pass = () => { if (teams.enabled) teams.pass(); else setLocalTurn((t) => (t === 0 ? 1 : 0)) }

  const answer = (i: number) => {
    if (result || open === null) return
    const q = pool[qi % pool.length]
    if (i === q.answer) {
      sfx.right()
      setCells(cells.map((c, k) => (k === open ? turn : c)))
      setResult('right')
      teams.award(1)
    } else {
      sfx.wrong()
      setResult('wrong')
    }
  }

  const close = () => {
    setOpen(null)
    setResult(null)
    setQi(qi + 1)
    pass()
  }

  const q = pool[qi % pool.length]
  const mark = (c: 0 | 1) => (c === 0 ? '✕' : '◯')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      {!over && (
        <div style={{ fontSize: 26, fontWeight: 700, color: TEAM_COLORS[turn] }}>
          Ход: {mark(turn)} «{names[turn]}» — выберите клетку
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: 480 }}>
        {cells.map((c, i) => (
          <button key={i} disabled={c !== null || over || open !== null} onClick={() => { sfx.flip(); setOpen(i) }} style={{
            aspectRatio: '1', borderRadius: 22, fontFamily: KFONT, fontSize: 96, fontWeight: 700, cursor: c === null && !over ? 'pointer' : 'default',
            border: `4px solid ${open === i ? '#FFB300' : c !== null ? TEAM_COLORS[c] : '#CFD8DC'}`,
            background: c !== null ? `${TEAM_COLORS[c]}18` : open === i ? '#FFF8E1' : 'white', color: c !== null ? TEAM_COLORS[c] : '#ECEFF1',
          }}>
            {c !== null ? mark(c) : '?'}
          </button>
        ))}
      </div>

      {open !== null && q && (
        <div className="kids-pop" style={{ width: '100%', maxWidth: 1000, background: 'white', borderRadius: 26, padding: 26, boxShadow: '0 10px 30px rgba(38,50,56,0.14)' }}>
          <div style={{ fontSize: 29, fontWeight: 700, color: '#263238', textAlign: 'center' }}>{q.text}</div>
          <div style={{ display: 'grid', gap: 12, marginTop: 16, gridTemplateColumns: `repeat(${Math.min(q.options.length, 4)}, minmax(0, 1fr))` }}>
            {q.options.map((o, i) => (
              <button key={i} onClick={() => answer(i)} style={{
                fontFamily: KFONT, fontSize: 22, fontWeight: 700, padding: '14px 12px', borderRadius: 18, cursor: result ? 'default' : 'pointer', minHeight: 70,
                border: `4px solid ${result && i === q.answer ? '#43A047' : '#CFD8DC'}`, background: result && i === q.answer ? '#E8F5E9' : 'white', color: '#37474F',
              }}>{o}</button>
            ))}
          </div>
          {result && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: result === 'right' ? '#2E7D32' : '#E65100' }}>
                {result === 'right' ? `Клетка достаётся «${names[turn]}»!` : 'Неверно — клетка остаётся свободной.'}
              </span>
              <KButton color="#3949AB" onClick={close}>Ход другой команды →</KButton>
            </div>
          )}
        </div>
      )}

      {over && (
        <div className="kids-pop" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: winner !== null ? TEAM_COLORS[winner] : '#455A64' }}>
            {winner !== null ? `🏆 Победа «${names[winner]}»!` : 'Ничья — поле заполнено!'}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <KButton ghost color="#78909C" onClick={() => { setCells(Array(9).fill(null)); setQi(qi + 1) }}>Ещё партия</KButton>
            <KButton big color="#43A047" onClick={() => onFinish(3)}>Дальше →</KButton>
          </div>
        </div>
      )}
    </div>
  )
}
