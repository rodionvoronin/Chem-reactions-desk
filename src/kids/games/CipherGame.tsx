import { useMemo, useState } from 'react'
import { CipherGame as Game } from '../types'
import { Feedback, KButton, sfx, shuffle, useTeams, KFONT } from '../kit'
import { elementOf } from '../elements'
import { cipherOptions } from '../generate'

/**
 * «Шифр Менделеева». Слово зашифровано порядковыми номерами элементов.
 * Класс находит каждый номер в таблице и выбирает знак — из знаков
 * складывается слово: 56, 11, 7 → Ba Na N → «банан». Так таблицу листают
 * десятки раз за игру и привыкают, что номер — адрес элемента.
 */
export function CipherGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const [index, setIndex] = useState(0)
  const [slot, setSlot] = useState(0)
  const [wrong, setWrong] = useState<string[]>([])
  const [mistakes, setMistakes] = useState(0)
  const item = game.words[index]
  const done = slot >= item.symbols.length
  const options = useMemo(
    () => (done ? [] : shuffle(cipherOptions(item.symbols[slot]))),
    [index, slot, done, item],
  )

  const pick = (s: string) => {
    if (done || wrong.includes(s)) return
    if (s === item.symbols[slot]) {
      sfx.right()
      setSlot(slot + 1)
      setWrong([])
      teams.award(1)
      teams.again()
    } else {
      sfx.wrong()
      setWrong([...wrong, s])
      setMistakes((m) => m + 1)
      teams.pass()
    }
  }

  const next = () => {
    teams.pass()
    const total = game.words.reduce((n, w) => n + w.symbols.length, 0)
    if (index + 1 >= game.words.length) { onFinish(mistakes === 0 ? 3 : mistakes <= total * 0.25 ? 2 : 1); return }
    setIndex(index + 1)
    setSlot(0)
    setWrong([])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
      <div style={{ fontSize: 20, color: '#78909C', fontWeight: 700 }}>🔐 Найдите элементы по номерам в таблице Менделеева</div>
      <div key={index} style={{ display: 'flex', gap: 14 }}>
        {item.symbols.map((s, i) => {
          const open = i < slot
          const active = i === slot
          return (
            <div key={i} className={open ? 'kids-pop' : undefined} style={{
              width: 128, borderRadius: 20, padding: '10px 8px', textAlign: 'center',
              background: open ? '#E8F5E9' : active ? '#FFF8E1' : 'white',
              border: `4px solid ${open ? '#66BB6A' : active ? '#FFB300' : '#CFD8DC'}`,
            }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#5D4037' }}>№ {elementOf(s).z}</div>
              <div style={{ fontSize: 50, fontWeight: 700, color: open ? '#1B5E20' : '#CFD8DC', lineHeight: 1.2 }}>{open ? s : '?'}</div>
              <div style={{ fontSize: 14, color: '#78909C', minHeight: 18 }}>{open ? elementOf(s).name : ''}</div>
            </div>
          )
        })}
      </div>

      {!done && (
        <>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#263238' }}>Какой знак у элемента № {elementOf(item.symbols[slot]).z}?</div>
          <div style={{ display: 'flex', gap: 14 }}>
            {options.map((s) => {
              const bad = wrong.includes(s)
              return (
                <button key={s} onClick={() => pick(s)} className={bad ? 'kids-shake' : undefined} style={{
                  fontFamily: KFONT, width: 120, height: 110, borderRadius: 22, fontSize: 46, fontWeight: 700,
                  cursor: bad ? 'default' : 'pointer', border: `4px solid ${bad ? '#FFAB91' : '#90CAF9'}`,
                  background: bad ? '#FBE9E7' : 'white', color: bad ? '#BCAAA4' : '#0D47A1',
                }}>{s}</button>
              )
            })}
          </div>
        </>
      )}

      {done && (
        <div style={{ width: '100%' }}>
          <Feedback kind="right"
            title={`${item.symbols.join(' + ')} = ${item.answer.toUpperCase()}!`}
            text={item.note}
            action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.words.length ? 'Готово!' : 'Следующий шифр →'}</KButton>} />
        </div>
      )}
      <div style={{ fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>Шифр {index + 1} из {game.words.length}</div>
    </div>
  )
}
