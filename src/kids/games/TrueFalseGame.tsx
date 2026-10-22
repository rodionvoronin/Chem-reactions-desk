import { useState } from 'react'
import { TrueFalseGame as Game } from '../types'
import { Feedback, KButton, sfx, useTeams, useStreak, KFONT, TEAM_COLORS } from '../kit'
import { starsByMistakes } from '../progress'

const STAKES = [1, 2, 3]

/**
 * «Верю — не верю». На экране одно утверждение, у класса два ответа.
 * Командная игра идёт на ставки: команда сама решает, насколько уверена,
 * и ставит от одного до трёх очков. Угадала — получает ставку, ошиблась —
 * теряет. Так приходится не просто нажать кнопку, а обсудить: а точно?
 * Без команд ставок нет — класс голосует руками.
 */
export function TrueFalseGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const streak = useStreak()
  const [index, setIndex] = useState(0)
  const [pick, setPick] = useState<boolean | null>(null)
  const [stake, setStake] = useState(1)
  const [mistakes, setMistakes] = useState(0)
  const st = game.statements[index]
  const done = pick !== null
  const right = done && pick === st.truth

  const answer = (v: boolean) => {
    if (done) return
    setPick(v)
    if (v === st.truth) { sfx.right(); streak.hit(); teams.award(teams.enabled ? stake : 0) }
    else { sfx.wrong(); streak.miss(); setMistakes((m) => m + 1); teams.award(teams.enabled ? -stake : 0) }
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.statements.length) { onFinish(starsByMistakes(mistakes, game.statements.length)); return }
    setIndex(index + 1)
    setPick(null)
    setStake(1)
  }

  const btn = (v: boolean, label: string, emoji: string, color: string) => {
    const chosen = pick === v
    const isTruth = done && v === st.truth
    return (
      <button
        key={String(v)}
        onClick={() => answer(v)}
        className={done && chosen && !isTruth ? 'kids-shake' : undefined}
        style={{
          fontFamily: KFONT, cursor: done ? 'default' : 'pointer', flex: 1, minHeight: 150, borderRadius: 28,
          border: `5px solid ${isTruth ? '#43A047' : chosen ? '#EF9A9A' : color}`,
          background: isTruth ? '#E8F5E9' : chosen ? '#FFEBEE' : 'white',
          opacity: done && !isTruth && !chosen ? 0.45 : 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        <span style={{ fontSize: 64, lineHeight: 1 }}>{emoji}</span>
        <span style={{ fontSize: 30, fontWeight: 700, color: '#263238' }}>{label}</span>
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {streak.view}
      <div key={index} className="kids-pop" style={{
        background: 'white', borderRadius: 28, padding: '30px 34px', boxShadow: '0 10px 30px rgba(38,50,56,0.12)',
        display: 'flex', alignItems: 'center', gap: 26,
      }}>
        <div style={{ fontSize: 86, lineHeight: 1 }}>{st.emoji ?? '🤔'}</div>
        <div style={{ flex: 1, fontSize: 32, fontWeight: 700, color: '#263238', lineHeight: 1.3 }}>«{st.text}»</div>
      </div>

      {!done && teams.enabled && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: TEAM_COLORS[teams.turn] }}>
            Ставка команды «{teams.names[teams.turn]}»:
          </span>
          {STAKES.map((s) => (
            <button key={s} onClick={() => { sfx.flip(); setStake(s) }} style={{
              fontFamily: KFONT, width: 66, height: 66, borderRadius: '50%', fontSize: 28, fontWeight: 700, cursor: 'pointer',
              border: `4px solid ${stake === s ? TEAM_COLORS[teams.turn] : '#CFD8DC'}`,
              background: stake === s ? TEAM_COLORS[teams.turn] : 'white', color: stake === s ? 'white' : '#78909C',
              transform: stake === s ? 'scale(1.12)' : 'none', transition: 'all 0.15s',
            }}>{s}</button>
          ))}
          <span style={{ fontSize: 17, color: '#90A4AE' }}>угадали — получите, ошиблись — потеряете</span>
        </div>
      )}
      {!done && !teams.enabled && <div style={{ textAlign: 'center', fontSize: 19, color: '#90A4AE', fontWeight: 700 }}>Проголосуйте руками: кто верит, кто нет?</div>}

      <div style={{ display: 'flex', gap: 18 }}>
        {btn(true, 'Верю', '👍', '#A5D6A7')}
        {btn(false, 'Не верю', '👎', '#FFAB91')}
      </div>
      {done && (
        <Feedback
          kind={right ? 'right' : 'wrong'}
          title={`${right ? 'Верно!' : 'Не угадали.'} Это ${st.truth ? 'правда' : 'неправда'}.${teams.enabled ? (right ? ` +${stake}` : ` −${stake}`) : ''}`}
          text={st.note}
          action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.statements.length ? 'Готово!' : 'Дальше →'}</KButton>}
        />
      )}
      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>Утверждение {index + 1} из {game.statements.length}</div>
    </div>
  )
}
