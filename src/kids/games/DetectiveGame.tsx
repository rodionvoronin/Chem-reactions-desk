import { useState, useMemo } from 'react'
import { DetectiveGame as Game } from '../types'
import { makeVessel, addTo, observation, kidName, kidEmoji } from '../lab'
import { TubeState } from '../../components/TestTube'
import { VesselView } from './Vessel'
import { KButton, Feedback, sfx, shuffle, useTeams, KFONT } from '../kit'
import { count } from '../../plural'

const LETTERS = ['А', 'Б', 'В', 'Г']

/**
 * Лаборатория-детектив. Этикетки сорвались — пробирки подписаны только буквами.
 * Из каждой можно отлить пробу и добавить реактив. Что произойдёт, решает
 * движок, а вывод — за классом. Так работают настоящие химики-аналитики.
 */
export function DetectiveGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const hidden = useMemo(() => shuffle(game.unknowns), [game])
  const [samples, setSamples] = useState<Array<TubeState | null>>(hidden.map(() => null))
  const [log, setLog] = useState<string[][]>(hidden.map(() => []))
  const [pouring, setPouring] = useState<{ tube: number; emoji: string } | null>(null)
  const [answer, setAnswer] = useState<Array<string | null>>(hidden.map(() => null))
  const [tests, setTests] = useState(0)
  const [verdict, setVerdict] = useState<null | 'right' | 'wrong'>(null)

  const probe = (i: number, reagent: string) => {
    if (pouring) return
    sfx.pop()
    const sample = makeVessel(`det-${i}-${tests}`, [hidden[i]])
    setSamples(samples.map((s, j) => (j === i ? sample : s)))
    setPouring({ tube: i, emoji: kidEmoji(reagent) })
    setTests(tests + 1)
    setTimeout(() => {
      const after = addTo(sample, [reagent])
      setSamples((all) => all.map((s, j) => (j === i ? after : s)))
      setLog((all) => all.map((l, j) => (j === i ? [...l, `${kidName(reagent)}: ${observation(sample, after).join(' ')}`] : l)))
      setPouring(null)
    }, 900)
  }

  const check = () => {
    const ok = answer.every((a, i) => a === hidden[i])
    if (ok) {
      sfx.win()
      setVerdict('right')
      teams.award(3)
    } else {
      sfx.wrong()
      setVerdict('wrong')
      teams.pass()
    }
  }

  const minTests = game.unknowns.length - 1
  const stars = tests <= minTests + 1 ? 3 : tests <= minTests + 4 ? 2 : 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ background: '#FFF8E1', borderRadius: 20, padding: '14px 20px', fontSize: 22, color: '#5D4037', lineHeight: 1.45 }}>
        🕵️ {game.story}
      </div>

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: `repeat(${hidden.length}, minmax(0, 1fr))` }}>
        {hidden.map((_, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 24, padding: 14, boxShadow: '0 6px 18px rgba(38,50,56,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#3949AB' }}>Пробирка {LETTERS[i]}</div>
            <VesselView
              tube={samples[i] ?? makeVessel(`det-view-${i}`, [hidden[i]])}
              label={samples[i] ? 'проба' : 'образец'}
              height={170}
              pouring={pouring?.tube === i ? pouring.emoji : null}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {game.tests.map((t) => (
                <button key={t} onClick={() => probe(i, t)} disabled={!!pouring || verdict === 'right'} style={{
                  fontFamily: KFONT, fontSize: 15, fontWeight: 700, padding: '8px 12px', borderRadius: 14, cursor: 'pointer',
                  border: '2px solid #A5D6A7', background: '#F1F8E9', color: '#2E7D32', minHeight: 44,
                }}>
                  + {kidEmoji(t)} {kidName(t)}
                </button>
              ))}
            </div>
            {log[i].map((l, k) => <div key={k} style={{ fontSize: 15.5, color: '#455A64', alignSelf: 'stretch', borderTop: '1px solid #ECEFF1', paddingTop: 6 }}>{l}</div>)}
            <div style={{ alignSelf: 'stretch', marginTop: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#90A4AE', marginBottom: 6 }}>ЗДЕСЬ, ПО-ВАШЕМУ:</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {game.unknowns.map((u) => (
                  <button key={u} onClick={() => { sfx.flip(); setVerdict(null); setAnswer(answer.map((a, j) => (j === i ? u : a))) }} style={{
                    fontFamily: KFONT, fontSize: 15, fontWeight: 700, padding: '8px 12px', borderRadius: 999, cursor: 'pointer',
                    border: `2px solid ${answer[i] === u ? '#3949AB' : '#CFD8DC'}`, background: answer[i] === u ? '#3949AB' : 'white',
                    color: answer[i] === u ? 'white' : '#546E7A',
                  }}>
                    {kidName(u)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {verdict === 'right' ? (
        <Feedback
          kind="right" title="Дело раскрыто!"
          text={`Вы определили все вещества за ${count(tests, 'пробу', 'пробы', 'проб')}. Настоящие аналитики стараются обходиться как можно меньшим числом проб — реактивы дорогие.`}
          action={<KButton big color="#43A047" onClick={() => onFinish(stars)}>Готово!</KButton>}
        />
      ) : (
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {verdict === 'wrong' && <span style={{ fontSize: 20, fontWeight: 700, color: '#E65100' }}>Где-то ошибка — проведите ещё пробы{teams.enabled ? `, ход команды «${teams.names[teams.turn]}»` : ''}.</span>}
          <KButton big color="#3949AB" disabled={answer.some((a) => a === null)} onClick={check}>Проверить ответ</KButton>
          <span style={{ fontSize: 16, color: '#90A4AE' }}>Проб: {tests}</span>
        </div>
      )}
    </div>
  )
}
