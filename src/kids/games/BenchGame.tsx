import { useState } from 'react'
import { BenchGame as Game, Sign } from '../types'
import { SIGN_INFO } from '../content'
import { makeVessel, addTo, observation, signsOf, equationOf, kidName, kidEmoji } from '../lab'
import { TubeState } from '../../components/TestTube'
import { SOLID_OR_GAS } from '../../reactions'
import { VesselView } from './Vessel'
import { KButton, sfx, useTeams, KFONT } from '../kit'
import { useIsNarrow } from '../../useViewport'

/**
 * Стол с реактивами. Ученик сам решает, что смешать или что поджечь на плитке,
 * а что получится — считает движок реакций. Неудачный опыт тоже честный:
 * «видимых изменений нет» — значит, в жизни их тоже не было бы.
 */
export function BenchGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const narrow = useIsNarrow()
  const [chosen, setChosen] = useState<string[]>([])
  const [tube, setTube] = useState<TubeState | null>(null)
  const [pouring, setPouring] = useState<string | null>(null)
  const [result, setResult] = useState<{ lines: string[]; note?: string; eq: string; signs: Sign[] } | null>(null)
  const [found, setFound] = useState<Sign[]>([])
  const [tries, setTries] = useState(0)

  const fire = chosen.includes('heat')
  // На плитке поджигают только твёрдое: раствор на огнеупорную плитку не льют
  const canFire = chosen.filter((x) => x !== 'heat').every((x) => SOLID_OR_GAS.has(x))
  const ready = fire ? chosen.length >= 2 && canFire : chosen.length === 2
  const allFound = game.goals.every((g) => found.includes(g))

  const toggle = (id: string) => {
    sfx.flip()
    setResult(null)
    setTube(null)
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 2 ? [c[1], id] : [...c, id]))
  }

  const mix = () => {
    if (!ready) return
    const stuff = chosen.filter((x) => x !== 'heat')
    const key = [...chosen].sort().join('+')
    const start = fire
      ? makeVessel(`bench-${tries}`, [...stuff, 'air'], true)
      : makeVessel(`bench-${tries}`, [stuff[0]])
    const add = fire ? ['heat'] : [stuff[1]]
    setTube(start)
    setPouring(kidEmoji(add[0]))
    setTries((t) => t + 1)
    setTimeout(() => {
      const after = addTo(start, add)
      const signs = signsOf(start, after)
      setTube(after)
      setPouring(null)
      setResult({ lines: observation(start, after), note: game.notes?.[key], eq: equationOf(after), signs })
      const fresh = signs.filter((s) => game.goals.includes(s) && !found.includes(s))
      if (fresh.length) {
        sfx.win()
        setFound((f) => [...f, ...fresh])
        teams.award(fresh.length)
      } else {
        sfx.pop()
      }
      teams.pass()
    }, 900)
  }

  const finish = () => onFinish(tries <= game.goals.length + 3 ? 3 : tries <= game.goals.length + 7 ? 2 : 1)

  return (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: narrow ? '1fr' : 'minmax(0, 1.15fr) minmax(0, 1fr)' }}>
      {/* Реактивы */}
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#78909C', marginBottom: 10 }}>
          РЕАКТИВЫ — выберите два или одно вещество и «🔥 Поджечь»
        </div>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
          {game.palette.map((id) => {
            const on = chosen.includes(id)
            return (
              <button key={id} onClick={() => toggle(id)} style={{
                fontFamily: KFONT, cursor: 'pointer', borderRadius: 18, padding: '12px 8px', minHeight: 100,
                border: `4px solid ${on ? (id === 'heat' ? '#E65100' : '#43A047') : '#E0E0E0'}`,
                background: on ? (id === 'heat' ? '#FFF3E0' : '#E8F5E9') : 'white',
                transform: on ? 'translateY(-4px)' : 'none', transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 36, lineHeight: 1 }}>{kidEmoji(id)}</span>
                <span style={{ fontSize: 15.5, fontWeight: 700, color: '#37474F', lineHeight: 1.2 }}>{id === 'heat' ? 'Поджечь на плитке' : kidName(id)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Сосуд и находки */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 80%, #CFD8DC 80%)', borderRadius: 26, minHeight: 330,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 10,
        }}>
          {tube ? (
            <VesselView tube={tube} label={chosen.filter((x) => x !== 'heat').map(kidName).join(' + ')} height={narrow ? 200 : 260} pouring={pouring} />
          ) : (
            <>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#90A4AE', textAlign: 'center' }}>
                {chosen.length ? chosen.map((c) => (c === 'heat' ? '🔥' : kidName(c))).join(' + ') : 'Выберите реактивы'}
              </div>
              {fire && !canFire && <div style={{ fontSize: 17, color: '#E65100', textAlign: 'center' }}>Поджигают только твёрдые вещества — раствор на плитку не льют.</div>}
              <KButton big color={fire ? '#E65100' : '#43A047'} disabled={!ready} onClick={mix}>{fire ? 'Поджечь!' : 'Смешать!'}</KButton>
            </>
          )}
          {tube && !pouring && <KButton ghost color="#43A047" onClick={() => { setTube(null); setResult(null); setChosen([]) }}>Новый опыт</KButton>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(game.goals.length, 4)}, 1fr)`, gap: 8 }}>
          {game.goals.map((s) => {
            const ok = found.includes(s)
            return (
              <div key={s} className={ok ? 'kids-pop' : undefined} style={{
                borderRadius: 16, padding: '10px 6px', textAlign: 'center',
                background: ok ? '#E8F5E9' : '#F5F5F5', border: `3px solid ${ok ? '#66BB6A' : '#E0E0E0'}`,
              }}>
                <div style={{ fontSize: 30, filter: ok ? 'none' : 'grayscale(1) opacity(0.4)' }}>{SIGN_INFO[s].emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: ok ? '#2E7D32' : '#B0BEC5' }}>{SIGN_INFO[s].title}</div>
              </div>
            )
          })}
        </div>
        {allFound && <KButton big color="#FB8C00" onClick={finish}>Все признаки найдены! →</KButton>}
      </div>

      {result && (
        <div className="kids-pop" style={{ gridColumn: '1 / -1', background: 'white', borderRadius: 24, padding: '18px 24px', borderLeft: `10px solid ${result.signs.length ? '#43A047' : '#90A4AE'}` }}>
          {result.lines.map((l) => <div key={l} style={{ fontSize: narrow ? 19 : 23, color: '#263238', fontWeight: 600 }}>👀 {l}</div>)}
          {result.note && <div style={{ fontSize: narrow ? 18 : 21, color: '#37474F', marginTop: 8, lineHeight: 1.45 }}>💡 {result.note}</div>}
          {result.eq && <div style={{ fontSize: 16, color: '#78909C', marginTop: 8 }}>Уравнение: <b style={{ color: '#455A64' }}>{result.eq}</b></div>}
        </div>
      )}
    </div>
  )
}
