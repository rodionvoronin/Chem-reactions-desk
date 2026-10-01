// ── Опыт на доске ─────────────────────────────────────────────────────────────
//
// Настоящих опытов в классе нет, поэтому опыт идёт на доске — но не нарисованный,
// а рассчитанный: каждое действие отправляется в движок реакций лабораторного
// стола, и пробирка показывает то, что случилось бы на самом деле. Наблюдение
// под пробиркой тоже составляется из ответа движка, а не пишется руками.

import { useState, useRef, useEffect } from 'react'
import { DemoVessel, DemoAction } from './types'
import { makeVessel, addTo, observation, equationOf, kidEmoji } from './lab'
import { TubeState } from '../components/TestTube'
import { VesselView } from './games/Vessel'
import { KButton, KFONT, sfx } from './kit'
import { useIsNarrow } from '../useViewport'

export function DemoStep({ title, intro, vessels, actions, explain, life }: {
  title: string; intro?: string; vessels: DemoVessel[]; actions: DemoAction[]; explain: string; life?: string
}) {
  const narrow = useIsNarrow()
  const fresh = () => vessels.map((v, i) => makeVessel(`demo-${i}-${Math.random().toString(36).slice(2, 7)}`, v.start, v.heap))
  const [tubes, setTubes] = useState<TubeState[]>(fresh)
  const [index, setIndex] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [phase, setPhase] = useState<'ready' | 'pouring' | 'observed'>('ready')
  const [seen, setSeen] = useState<string[]>([])
  const [equation, setEquation] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  const action = actions[index]
  const done = index >= actions.length

  useEffect(() => {
    if (phase === 'observed' || done) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [phase, done])

  const run = () => {
    if (!action || phase !== 'ready') return
    sfx.pop()
    setPhase('pouring')
    setTimeout(() => {
      const before = tubes[action.to]
      const after = addTo(before, action.add)
      setTubes(tubes.map((t, i) => (i === action.to ? after : t)))
      setSeen(observation(before, after))
      setEquation(equationOf(after))
      setPhase('observed')
      sfx.right()
    }, 900)
  }

  const nextAction = () => {
    setIndex(index + 1)
    setPick(null)
    setPhase('ready')
    setSeen([])
    setEquation('')
  }

  const restart = () => {
    setTubes(fresh())
    setIndex(0)
    setPick(null)
    setPhase('ready')
    setSeen([])
  }

  // Пробирки невысокие, чтобы на доске под ними помещались вопрос и кнопка
  const height = narrow ? 180 : 240

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ textAlign: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 15, fontWeight: 700, color: 'white', background: '#43A047', borderRadius: 999, padding: '5px 14px', marginBottom: 10 }}>
          🔬 Опыт на виртуальном столе
        </span>
        <h2 style={{ margin: 0, fontSize: narrow ? 26 : 40, color: '#263238' }}>{title}</h2>
        {intro && <div style={{ fontSize: narrow ? 17 : 21, color: '#546E7A', marginTop: 8 }}>{intro}</div>}
      </div>

      {/* Стол */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: narrow ? 8 : 40, flexWrap: 'wrap',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 78%, #CFD8DC 78%, #B0BEC5 100%)',
        borderRadius: 28, padding: narrow ? '14px 8px 22px' : '22px 30px 34px', boxShadow: 'inset 0 -8px 0 #90A4AE',
      }}>
        {tubes.map((t, i) => (
          <VesselView
            key={t.id}
            tube={t}
            label={vessels[i].label}
            height={height}
            active={!done && action?.to === i}
            pouring={phase === 'pouring' && action?.to === i ? kidEmoji(action.add[0]) : null}
            burst={phase === 'observed' && action?.to === i && !seen.includes('Видимых изменений нет.')}
          />
        ))}
      </div>

      {/* Ход опыта */}
      <div ref={cardRef} className="kids-pop" style={{
        background: 'white', borderRadius: 26, padding: narrow ? 18 : '22px 28px', boxShadow: '0 10px 30px rgba(38,50,56,0.10)',
      }}>
        {!done ? (
          <>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#90A4AE', letterSpacing: 1 }}>
              ДЕЙСТВИЕ {index + 1} ИЗ {actions.length}
            </div>
            {action.predict && phase === 'ready' && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: narrow ? 20 : 26, fontWeight: 700, color: '#263238' }}>🔮 {action.predict.question}</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                  {action.predict.options.map((o, i) => (
                    <button key={o} onClick={() => { sfx.flip(); setPick(i) }} style={{
                      fontFamily: KFONT, fontSize: narrow ? 17 : 21, fontWeight: 700, padding: '12px 18px', borderRadius: 16, cursor: 'pointer',
                      border: `3px solid ${pick === i ? '#3949AB' : '#CFD8DC'}`, background: pick === i ? '#E8EAF6' : 'white', color: '#37474F',
                    }}>{o}</button>
                  ))}
                </div>
                <div style={{ fontSize: 16, color: '#90A4AE', marginTop: 8 }}>Проголосуйте и выберите прогноз класса — потом проверим.</div>
              </div>
            )}
            {phase !== 'observed' && (
              <div style={{ marginTop: 16 }}>
                <KButton big color="#43A047" disabled={phase === 'pouring' || (!!action.predict && pick === null)} onClick={run}>
                  {phase === 'pouring' ? 'Смотрим…' : `▶ ${action.label}`}
                </KButton>
              </div>
            )}
            {phase === 'observed' && (
              <div style={{ marginTop: 8 }}>
                {action.predict && pick !== null && (
                  <div style={{ fontSize: 20, fontWeight: 700, color: pick === action.predict.answer ? '#2E7D32' : '#E65100', marginBottom: 8 }}>
                    {pick === action.predict.answer ? '✓ Прогноз класса верен!' : `Прогноз не подтвердился. На самом деле: ${action.predict.options[action.predict.answer]}`}
                  </div>
                )}
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1565C0' }}>👀 Видим</div>
                {seen.map((s) => <div key={s} style={{ fontSize: narrow ? 19 : 24, color: '#263238', marginTop: 4 }}>{s}</div>)}
                <div style={{ fontSize: 20, fontWeight: 700, color: '#2E7D32', marginTop: 14 }}>💡 Что произошло</div>
                <div style={{ fontSize: narrow ? 19 : 24, color: '#263238', marginTop: 4, lineHeight: 1.45 }}>{action.say}</div>
                {equation && (
                  <div style={{ fontSize: 16, color: '#78909C', marginTop: 12, fontFamily: KFONT }}>
                    Уравнение для любопытных: <span style={{ color: '#455A64', fontWeight: 600 }}>{equation}</span>
                  </div>
                )}
                <div style={{ marginTop: 16 }}>
                  <KButton color="#3949AB" onClick={nextAction}>{index + 1 < actions.length ? 'Следующее действие →' : 'Вывод опыта →'}</KButton>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#2E7D32' }}>📌 Вывод</div>
            <div style={{ fontSize: narrow ? 20 : 26, color: '#263238', marginTop: 6, lineHeight: 1.45 }}>{explain}</div>
            {life && <div style={{ fontSize: narrow ? 17 : 21, color: '#5D4037', background: '#FFF8E1', borderRadius: 16, padding: '12px 16px', marginTop: 14 }}>🏠 В жизни: {life}</div>}
            <div style={{ marginTop: 16 }}>
              <KButton ghost color="#78909C" onClick={restart}>Повторить опыт</KButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
