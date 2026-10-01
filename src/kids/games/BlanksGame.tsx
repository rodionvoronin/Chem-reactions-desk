import { useState, useMemo } from 'react'
import { BlanksGame as Game } from '../types'
import { Feedback, KButton, sfx, shuffle, useTeams, KFONT } from '../kit'
import { starsByMistakes } from '../progress'
import { useIsNarrow } from '../../useViewport'

/** Разбор «Вещества состоят из {молекул}» на текст и пропуски */
export function parseBlanks(text: string): Array<{ text: string } | { blank: string }> {
  return text.split(/(\{[^}]+\})/).filter(Boolean).map((p) => (p.startsWith('{') ? { blank: p.slice(1, -1) } : { text: p }))
}

/**
 * Вставь пропущенное слово: правило урока с пропусками и банк слов. Слово
 * встаёт в первый пустой пропуск; нажатие на заполненный пропуск освобождает его.
 */
export function BlanksGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const narrow = useIsNarrow()
  const [index, setIndex] = useState(0)
  const parts = useMemo(() => parseBlanks(game.sentences[index].text), [game, index])
  const answers = parts.flatMap((p) => ('blank' in p ? [p.blank] : []))
  const bank = useMemo(() => shuffle([...answers, ...(game.sentences[index].extra ?? [])]), [game, index]) // eslint-disable-line react-hooks/exhaustive-deps
  const [filled, setFilled] = useState<Array<number | null>>(answers.map(() => null))
  const [state, setState] = useState<'fill' | 'right' | 'wrong'>('fill')
  const [mistakes, setMistakes] = useState(0)

  const put = (b: number) => {
    if (state === 'right' || filled.includes(b)) return
    const slot = filled.indexOf(null)
    if (slot < 0) return
    sfx.pop()
    const next = filled.map((f, i) => (i === slot ? b : f))
    setFilled(next)
    setState('fill')
    if (next.every((f) => f !== null)) {
      const ok = next.every((f, i) => bank[f!] === answers[i])
      if (ok) { sfx.right(); setState('right'); teams.award(1) } else { sfx.wrong(); setState('wrong'); setMistakes((m) => m + 1); teams.pass() }
    }
  }

  const clear = (slot: number) => {
    if (state === 'right') return
    setFilled(filled.map((f, i) => (i === slot ? null : f)))
    setState('fill')
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.sentences.length) { onFinish(starsByMistakes(mistakes, game.sentences.length)); return }
    const nextAnswers = parseBlanks(game.sentences[index + 1].text).filter((p) => 'blank' in p)
    setIndex(index + 1)
    setFilled(nextAnswers.map(() => null))
    setState('fill')
  }

  let slot = -1
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div key={index} className="kids-pop" style={{
        background: 'repeating-linear-gradient(#FFFDF5 0px, #FFFDF5 62px, #BBDEFB 63px)', borderRadius: 22, padding: narrow ? '18px 16px' : '26px 34px',
        fontSize: narrow ? 21 : 30, lineHeight: '63px', color: '#1A237E', fontWeight: 600, boxShadow: '0 10px 30px rgba(38,50,56,0.10)',
      }}>
        {parts.map((p, i) => {
          if ('text' in p) return <span key={i}>{p.text}</span>
          slot += 1
          const s = slot
          const f = filled[s]
          const bad = state === 'wrong' && f !== null && bank[f] !== answers[s]
          return (
            <button key={i} onClick={() => clear(s)} className={bad ? 'kids-shake' : undefined} style={{
              fontFamily: KFONT, fontSize: 'inherit', fontWeight: 700, minWidth: 130, padding: '2px 14px', margin: '0 4px', borderRadius: 12, cursor: 'pointer',
              border: `3px ${f === null ? 'dashed' : 'solid'} ${state === 'right' ? '#43A047' : bad ? '#E53935' : '#7986CB'}`,
              background: state === 'right' ? '#E8F5E9' : bad ? '#FFEBEE' : f === null ? 'rgba(255,255,255,0.7)' : '#E8EAF6',
              color: '#1A237E', lineHeight: 1.3, verticalAlign: 'middle',
            }}>
              {f === null ? ' ' : bank[f]}
            </button>
          )
        })}
      </div>

      {state !== 'right' && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {bank.map((w, b) => (
            <button key={b} onClick={() => put(b)} disabled={filled.includes(b)} style={{
              fontFamily: KFONT, fontSize: narrow ? 19 : 25, fontWeight: 700, padding: '12px 22px', borderRadius: 999, cursor: 'pointer',
              border: '3px solid #9FA8DA', background: filled.includes(b) ? '#ECEFF1' : 'white', color: filled.includes(b) ? '#B0BEC5' : '#283593',
              boxShadow: filled.includes(b) ? 'none' : '0 4px 0 #C5CAE9',
            }}>
              {w}
            </button>
          ))}
        </div>
      )}

      {state === 'wrong' && <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, color: '#E65100' }}>Есть ошибка — нажмите на красное слово, чтобы убрать его.</div>}
      {state === 'right' && (
        <Feedback kind="right" title="Верно!" action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.sentences.length ? 'Готово!' : 'Дальше →'}</KButton>} />
      )}
      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>Предложение {index + 1} из {game.sentences.length}</div>
    </div>
  )
}
