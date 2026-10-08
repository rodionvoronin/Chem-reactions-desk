import { useMemo, useState } from 'react'
import { TimelineGame as Game, TimelineEvent } from '../types'
import { Feedback, KButton, sfx, shuffle, useTeams, KFONT } from '../kit'
import { starsByMistakes } from '../progress'

/**
 * «Лента времени». Одно событие уже лежит на ленте, остальные приходят по
 * одному без даты: класс решает, раньше или позже оно случилось, и ставит
 * его в промежуток между карточками. Дата открывается после хода. Ошибка
 * не ломает игру: карточка всё равно встаёт на своё место.
 */
export function TimelineGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const deck = useMemo(() => shuffle(game.events), [game])
  const [placed, setPlaced] = useState<TimelineEvent[]>(() => [deck[0]])
  const [next, setNext] = useState(1)
  const [last, setLast] = useState<{ ev: TimelineEvent; ok: boolean } | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const current = deck[next]

  const place = (slot: number) => {
    if (last || !current) return
    const before = placed[slot - 1]
    const after = placed[slot]
    const ok = (!before || before.year <= current.year) && (!after || current.year <= after.year)
    const sorted = [...placed, current].sort((a, b) => a.year - b.year)
    setPlaced(sorted)
    setLast({ ev: current, ok })
    if (ok) { sfx.right(); teams.award(1) } else { sfx.wrong(); setMistakes((m) => m + 1); teams.award(0) }
  }

  const go = () => {
    teams.pass()
    if (next + 1 >= deck.length) { onFinish(starsByMistakes(mistakes, deck.length - 1)); return }
    setLast(null)
    setNext(next + 1)
  }

  const n = placed.length
  const slotW = 40
  const cardW = Math.min(170, Math.floor((1180 - (n + 1) * slotW) / Math.max(n, 1)))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      {current && !last && (
        <div key={next} className="kids-pop" style={{
          display: 'flex', alignItems: 'center', gap: 20, background: '#FFF8E1', border: '4px solid #FFCA28',
          borderRadius: 26, padding: '18px 28px', maxWidth: 980,
        }}>
          <span style={{ fontSize: 70, lineHeight: 1 }}>{current.emoji}</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#4E342E', lineHeight: 1.3 }}>{current.text}</span>
        </div>
      )}
      {current && !last && (
        <div style={{ fontSize: 19, color: '#90A4AE', fontWeight: 700 }}>Куда положить это событие? Нажмите на промежуток «＋»</div>
      )}

      {/* Лента: слева раньше, справа позже */}
      <div style={{ display: 'flex', alignItems: 'stretch', position: 'relative', padding: '8px 0' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 6, background: '#D7CCC8', borderRadius: 3, zIndex: 0 }} />
        {placed.map((ev, i) => (
          <div key={ev.text} style={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
            <Slot onClick={() => place(i)} active={!!current && !last} width={slotW} />
            <div className={last?.ev === ev ? 'kids-pop' : undefined} style={{
              width: cardW, minHeight: 150, borderRadius: 18, padding: '10px 8px', textAlign: 'center',
              background: 'white', boxShadow: '0 6px 18px rgba(38,50,56,0.10)',
              border: `4px solid ${last?.ev === ev ? (last.ok ? '#43A047' : '#FB8C00') : '#BCAAA4'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#6D4C41', background: '#EFEBE9', borderRadius: 10, padding: '2px 8px' }}>{ev.when}</span>
              <span style={{ fontSize: 34, lineHeight: 1.1 }}>{ev.emoji}</span>
              <span style={{ fontSize: cardW < 130 ? 13 : 15, color: '#37474F', lineHeight: 1.25 }}>{ev.text}</span>
            </div>
            {i === placed.length - 1 && <Slot onClick={() => place(i + 1)} active={!!current && !last} width={slotW} />}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 1180, fontSize: 16, fontWeight: 700, color: '#A1887F' }}>
        <span>← раньше</span><span>позже →</span>
      </div>

      {last && (
        <div style={{ width: '100%' }}>
          <Feedback
            kind={last.ok ? 'right' : 'wrong'}
            title={last.ok ? `Верно! ${last.ev.when}` : `Это было ${last.ev.when} — карточка встала на своё место`}
            text={last.ev.note}
            action={<KButton big color="#43A047" onClick={go}>{next + 1 >= deck.length ? 'Лента собрана!' : 'Следующее событие →'}</KButton>}
          />
        </div>
      )}
    </div>
  )
}

function Slot({ onClick, active, width }: { onClick: () => void; active: boolean; width: number }) {
  return (
    <button onClick={onClick} disabled={!active} style={{
      width: width - 6, height: width - 6, margin: '0 3px', borderRadius: '50%', fontFamily: KFONT,
      border: `3px dashed ${active ? '#FB8C00' : 'transparent'}`, background: active ? '#FFF3E0' : 'transparent',
      color: '#E65100', fontSize: 24, fontWeight: 700, cursor: active ? 'pointer' : 'default', padding: 0,
    }}>
      {active ? '＋' : ''}
    </button>
  )
}
