import { useState, useMemo } from 'react'
import { AnagramGame as Game } from '../types'
import { Feedback, KButton, sfx, shuffle, useTeams, KFONT } from '../kit'
import { starsByMistakes } from '../progress'

/** Собери слово: буквы перепутаны, нажимайте их по порядку. Подсказка — смысл слова. */
export function AnagramGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const [index, setIndex] = useState(0)
  const word = game.words[index].word.toUpperCase()
  const tiles = useMemo(() => {
    let s = shuffle(word.split('').map((ch, i) => ({ ch, i })))
    while (s.map((t) => t.ch).join('') === word && word.length > 1) s = shuffle(s)
    return s
  }, [word])
  const [used, setUsed] = useState<number[]>([])
  const [state, setState] = useState<'build' | 'right' | 'wrong'>('build')
  const [mistakes, setMistakes] = useState(0)
  const built = used.map((k) => tiles[k].ch).join('')

  const tap = (k: number) => {
    if (state === 'right' || used.includes(k)) return
    sfx.pop()
    const next = [...used, k]
    setUsed(next)
    if (next.length === word.length) {
      if (next.map((x) => tiles[x].ch).join('') === word) { sfx.right(); setState('right'); teams.award(1) } else { sfx.wrong(); setState('wrong'); setMistakes((m) => m + 1); teams.pass() }
    } else setState('build')
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.words.length) { onFinish(starsByMistakes(mistakes, game.words.length)); return }
    setIndex(index + 1)
    setUsed([])
    setState('build')
  }

  const size = 72
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
      <div style={{ fontSize: 27, color: '#455A64', textAlign: 'center', maxWidth: 900 }}>💡 {game.words[index].hint}</div>
      <div className={state === 'wrong' ? 'kids-shake' : undefined} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {word.split('').map((_, i) => (
          <div key={i} style={{
            width: size, height: size, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.55, fontWeight: 700, fontFamily: KFONT,
            border: `3px ${built[i] ? 'solid' : 'dashed'} ${state === 'right' ? '#43A047' : state === 'wrong' ? '#E53935' : '#9FA8DA'}`,
            background: state === 'right' ? '#E8F5E9' : built[i] ? '#E8EAF6' : 'white', color: '#1A237E',
          }}>{built[i] ?? ''}</div>
        ))}
      </div>
      {state !== 'right' && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {tiles.map((t, k) => (
            <button key={k} onClick={() => tap(k)} disabled={used.includes(k)} style={{
              width: size, height: size, borderRadius: 16, fontFamily: KFONT, fontSize: size * 0.5, fontWeight: 700, cursor: 'pointer',
              border: 'none', background: used.includes(k) ? '#ECEFF1' : '#FFB300', color: used.includes(k) ? '#CFD8DC' : 'white',
              boxShadow: used.includes(k) ? 'none' : '0 5px 0 #E65100',
            }}>{t.ch}</button>
          ))}
        </div>
      )}
      {state !== 'right' && used.length > 0 && <KButton ghost color="#78909C" onClick={() => { setUsed(state === 'wrong' ? [] : used.slice(0, -1)); setState('build') }}>{state === 'wrong' ? 'Собрать заново' : '⌫ Убрать букву'}</KButton>}
      {state === 'right' && (
        <Feedback kind="right" title={`Верно: ${word}!`} action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.words.length ? 'Готово!' : 'Следующее слово →'}</KButton>} />
      )}
      <div style={{ fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>Слово {index + 1} из {game.words.length}</div>
    </div>
  )
}
