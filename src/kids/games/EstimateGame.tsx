import { useEffect, useState } from 'react'
import { EstimateGame as Game } from '../types'
import { Feedback, KButton, sfx, useTeams, KFONT, TEAM_COLORS } from '../kit'

/** Насколько можно ошибиться, чтобы ответ считался «попал» */
export function tolerance(q: { min: number; max: number; step: number }): number {
  return Math.max(q.step, (q.max - q.min) * 0.05)
}

const fmt = (x: number) => String(Math.round(x * 100) / 100).replace('.', ',')

/**
 * «Ближе всех». Вопрос с числовым ответом — сколько процентов кислорода
 * в воздухе, при какой температуре кипит вода. Ответ ставят ползунком на
 * шкале. С командами отметку ставит каждая, и очко получает та, что ближе.
 * Без команд ответ засчитывается, если попал в небольшой допуск.
 */
export function EstimateGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const [index, setIndex] = useState(0)
  const q = game.questions[index]
  const mid = (a: number, b: number) => Math.round(((a + b) / 2) / q.step) * q.step
  const [value, setValue] = useState(mid(q.min, q.max))
  const [guesses, setGuesses] = useState<Array<{ team: number; v: number }>>([])
  const [revealed, setRevealed] = useState(false)
  const [hits, setHits] = useState(0)
  const [pending, setPending] = useState<number | null>(null)
  const need = teams.enabled ? 2 : 1

  // Очко достаётся команде, чья отметка ближе; если ход сейчас у другой,
  // передаём ход и начисляем, когда он перейдёт
  useEffect(() => {
    if (pending !== null && teams.turn === pending) { teams.award(1); setPending(null) }
  }, [pending, teams.turn])

  const clamp = (x: number) => Math.min(q.max, Math.max(q.min, Math.round(x / q.step) * q.step))

  const lock = () => {
    sfx.pop()
    const next = [...guesses, { team: teams.turn, v: value }]
    setGuesses(next)
    if (next.length < need) { teams.pass(); setValue(mid(q.min, q.max)); return }
    setRevealed(true)
    const dist = next.map((g) => Math.abs(g.v - q.answer))
    if (teams.enabled) {
      const best = Math.min(...dist)
      const winners = next.filter((_, i) => dist[i] === best)
      sfx.right()
      if (winners.length === 1) {
        if (winners[0].team === teams.turn) teams.award(1)
        else { teams.pass(); setPending(winners[0].team) }
      }
      if (best <= tolerance(q)) setHits((h) => h + 1)
    } else {
      const ok = dist[0] <= tolerance(q)
      if (ok) { sfx.right(); setHits((h) => h + 1) } else sfx.wrong()
    }
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.questions.length) {
      const share = hits / game.questions.length
      onFinish(share >= 0.7 ? 3 : share >= 0.4 ? 2 : 1)
      return
    }
    const nq = game.questions[index + 1]
    setIndex(index + 1)
    setValue(Math.round(((nq.min + nq.max) / 2) / nq.step) * nq.step)
    setGuesses([])
    setRevealed(false)
  }

  const pos = (x: number) => `${((x - q.min) / (q.max - q.min)) * 100}%`
  const color = teams.enabled ? TEAM_COLORS[teams.turn] : '#1E88E5'
  const closest = guesses.length ? guesses.reduce((a, b) => (Math.abs(a.v - q.answer) <= Math.abs(b.v - q.answer) ? a : b)) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
      <div key={index} className="kids-pop" style={{
        background: 'white', borderRadius: 28, padding: '26px 30px', boxShadow: '0 10px 30px rgba(38,50,56,0.12)',
        display: 'flex', alignItems: 'center', gap: 24, width: '100%',
      }}>
        <div style={{ fontSize: 80, lineHeight: 1 }}>{q.emoji ?? '🎯'}</div>
        <div style={{ flex: 1, fontSize: 30, fontWeight: 700, color: '#263238', lineHeight: 1.3 }}>{q.text}</div>
      </div>

      {/* Шкала с отметками */}
      <div style={{ width: '100%', maxWidth: 1080, position: 'relative', height: 120, marginTop: 10 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 56, height: 14, borderRadius: 7, background: 'linear-gradient(90deg, #E3F2FD, #BBDEFB)' }} />
        {guesses.map((g, i) => (
          <div key={i} style={{ position: 'absolute', left: pos(g.v), top: 22, transform: 'translateX(-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: teams.enabled ? TEAM_COLORS[g.team] : '#1E88E5' }}>{fmt(g.v)}</div>
            <div style={{ width: 8, height: 54, margin: '0 auto', borderRadius: 4, background: teams.enabled ? TEAM_COLORS[g.team] : '#1E88E5' }} />
          </div>
        ))}
        {!revealed && (
          <div style={{ position: 'absolute', left: pos(value), top: 0, transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: 30, fontWeight: 700, color }}>{fmt(value)} {q.unit}</div>
            <div style={{ width: 8, height: 60, margin: '0 auto', borderRadius: 4, background: color, opacity: 0.6 }} />
          </div>
        )}
        {revealed && (
          <div className="kids-pop" style={{ position: 'absolute', left: pos(q.answer), top: 70, transform: 'translateX(-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: 30, lineHeight: 1 }}>⭐</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#2E7D32', whiteSpace: 'nowrap' }}>{fmt(q.answer)} {q.unit}</div>
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, top: 76, fontSize: 16, color: '#90A4AE', fontWeight: 700 }}>{fmt(q.min)}</div>
        <div style={{ position: 'absolute', right: 0, top: 76, fontSize: 16, color: '#90A4AE', fontWeight: 700 }}>{fmt(q.max)}</div>
      </div>

      {!revealed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', maxWidth: 1080 }}>
          <KButton ghost color={color} onClick={() => setValue(clamp(value - q.step))}>−</KButton>
          <input type="range" min={q.min} max={q.max} step={q.step} value={value}
            onChange={(e) => setValue(clamp(Number(e.target.value)))}
            style={{ flex: 1, height: 40, accentColor: color, cursor: 'pointer' }} />
          <KButton ghost color={color} onClick={() => setValue(clamp(value + q.step))}>+</KButton>
          <KButton big color={color} onClick={lock}>
            {teams.enabled ? `Ответ «${teams.names[teams.turn]}»` : 'Проверить'}
          </KButton>
        </div>
      )}

      {revealed && (
        <div style={{ width: '100%' }}>
          <Feedback
            kind={closest && Math.abs(closest.v - q.answer) <= tolerance(q) ? 'right' : 'info'}
            title={teams.enabled && closest
              ? (guesses.length === 2 && Math.abs(guesses[0].v - q.answer) === Math.abs(guesses[1].v - q.answer)
                ? `Ответ: ${fmt(q.answer)} ${q.unit}. Ничья!`
                : `Ответ: ${fmt(q.answer)} ${q.unit}. Ближе «${teams.names[closest.team]}»!`)
              : `Ответ: ${fmt(q.answer)} ${q.unit}${closest && Math.abs(closest.v - q.answer) <= tolerance(q) ? ' — попали!' : ''}`}
            text={q.note}
            action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.questions.length ? 'Готово!' : 'Дальше →'}</KButton>}
          />
        </div>
      )}
      <div style={{ fontSize: 16, color: '#90A4AE', fontWeight: 600, fontFamily: KFONT }}>Вопрос {index + 1} из {game.questions.length}</div>
    </div>
  )
}
