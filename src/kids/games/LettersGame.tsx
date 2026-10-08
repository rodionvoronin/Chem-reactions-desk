import { useState } from 'react'
import { LettersGame as Game } from '../types'
import { Feedback, KButton, sfx, useTeams, KFONT, TEAM_COLORS } from '../kit'

const ALPHABET = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

/**
 * «Поле чудес». Слово закрыто, видна только подсказка. Класс называет буквы:
 * есть такая — открываются все её места и ход остаётся у команды, нет —
 * ход переходит. Кто узнал слово раньше, говорит его целиком, а учитель
 * открывает слово кнопкой.
 */
export function LettersGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const [index, setIndex] = useState(0)
  const [tried, setTried] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)
  const [misses, setMisses] = useState(0)
  const [flash, setFlash] = useState<string | null>(null)
  const item = game.words[index]
  const word = item.word.toUpperCase()
  const letters = word.split('')
  const solved = revealed || letters.every((l) => tried.includes(l))

  const press = (l: string) => {
    if (solved || tried.includes(l)) return
    setTried([...tried, l])
    const hits = letters.filter((x) => x === l).length
    setFlash(l)
    if (hits) {
      sfx.right()
      // Очки за каждую открытую клетку; ход остаётся у той же команды
      if (teams.enabled) { teams.award(hits); teams.again() }
    } else {
      sfx.wrong()
      setMisses((m) => m + 1)
      teams.pass()
    }
  }

  const sayWord = () => {
    sfx.win()
    // Угадать слово целиком — дорого: столько очков, сколько клеток ещё закрыто
    const closed = letters.filter((l) => !tried.includes(l)).length
    if (closed) teams.award(closed)
    setRevealed(true)
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.words.length) {
      const per = misses / game.words.length
      onFinish(per <= 2 ? 3 : per <= 4 ? 2 : 1)
      return
    }
    setIndex(index + 1)
    setTried([])
    setRevealed(false)
    setFlash(null)
  }

  const tile = Math.min(86, Math.floor(1100 / letters.length) - 10)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
      <div className="kids-pop" key={index} style={{
        fontSize: 27, fontWeight: 700, color: '#4E342E', background: '#FFF8E1', borderRadius: 20,
        padding: '14px 24px', textAlign: 'center', maxWidth: 1000,
      }}>
        🎡 {item.hint}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap' }}>
        {letters.map((l, i) => {
          const open = solved || tried.includes(l)
          return (
            <div key={i} className={open && flash === l ? 'kids-pop' : undefined} style={{
              width: tile, height: tile * 1.2, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: open ? 'white' : 'linear-gradient(160deg, #1E88E5, #1565C0)',
              border: `4px solid ${open ? '#1E88E5' : '#0D47A1'}`, boxShadow: '0 6px 0 rgba(13,71,161,0.25)',
              fontSize: tile * 0.62, fontWeight: 700, color: '#0D47A1',
            }}>
              {open ? l : ''}
            </div>
          )
        })}
      </div>

      {!solved && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 62px)', gap: 8 }}>
            {ALPHABET.map((l) => {
              const used = tried.includes(l)
              const hit = used && letters.includes(l)
              return (
                <button key={l} onClick={() => press(l)} disabled={used} style={{
                  fontFamily: KFONT, fontSize: 26, fontWeight: 700, height: 62, borderRadius: 14, cursor: used ? 'default' : 'pointer',
                  border: `3px solid ${hit ? '#66BB6A' : used ? '#ECEFF1' : '#CFD8DC'}`,
                  background: hit ? '#E8F5E9' : used ? '#F5F7F8' : 'white',
                  color: hit ? '#2E7D32' : used ? '#CFD8DC' : '#37474F',
                  textDecoration: used && !hit ? 'line-through' : 'none',
                }}>
                  {l}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {teams.enabled && (
              <span style={{ fontSize: 20, fontWeight: 700, color: TEAM_COLORS[teams.turn] }}>
                Букву называет «{teams.names[teams.turn]}»
              </span>
            )}
            <KButton ghost color="#8E24AA" onClick={sayWord}>Назвали слово целиком!</KButton>
          </div>
        </>
      )}

      {solved && (
        <div style={{ width: '100%' }}>
          <Feedback
            kind="right" title={`Слово: ${word}`}
            text={revealed ? 'Угадали раньше, чем открылись все буквы. Отлично!' : 'Все буквы открыты.'}
            action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.words.length ? 'Готово!' : 'Следующее слово →'}</KButton>}
          />
        </div>
      )}
      <div style={{ fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>Слово {index + 1} из {game.words.length}</div>
    </div>
  )
}
