import { useState, useEffect } from 'react'
import { LabGame as Game, LabMix, Sign } from '../types'
import { SIGN_INFO } from '../content'
import { KButton, Feedback, sfx, useTeams } from '../kit'
import { useIsNarrow } from '../../useViewport'

const CHEM_SIGNS: Sign[] = ['gas', 'precipitate', 'color', 'light']

/**
 * Кухонная лаборатория: два вещества — в стакан, и смотрим, что вышло.
 * Цель — найти все четыре признака реакции. Пары, где ничего нового не
 * появляется, тоже важны: на них видно, чем физическое явление отличается
 * от химического.
 */
export function LabGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const narrow = useIsNarrow()
  const [chosen, setChosen] = useState<string[]>([])
  const [shown, setShown] = useState<{ pair: string[]; mix: LabMix | null; n: number } | null>(null)
  const [found, setFound] = useState<Sign[]>([])
  const [tries, setTries] = useState(0)

  const byId = Object.fromEntries(game.substances.map((s) => [s.id, s]))
  const allFound = CHEM_SIGNS.every((s) => found.includes(s))

  const toggle = (id: string) => {
    sfx.flip()
    setShown(null)
    setChosen((c) => c.includes(id) ? c.filter((x) => x !== id) : c.length >= 2 ? [c[1], id] : [...c, id])
  }

  const mix = () => {
    if (chosen.length < 2) return
    const [a, b] = chosen
    const m = game.mixes.find((x) => (x.pair[0] === a && x.pair[1] === b) || (x.pair[0] === b && x.pair[1] === a)) ?? null
    setTries((t) => t + 1)
    setShown({ pair: chosen, mix: m, n: tries + 1 })
    setChosen([])
    if (m && m.sign !== 'none' && !found.includes(m.sign)) {
      setTimeout(() => sfx.win(), 600)
      setFound((f) => [...f, m.sign])
      teams.award(1)
    } else {
      setTimeout(() => (m ? sfx.right() : sfx.pop()), 600)
    }
    teams.pass()
  }

  const finish = () => onFinish(tries <= 8 ? 3 : tries <= 14 ? 2 : 1)

  return (
    <div style={{
      display: 'grid', gap: 20,
      gridTemplateColumns: narrow ? '1fr' : 'minmax(0, 1.25fr) minmax(0, 1fr)',
      userSelect: 'none',
    }}>
      {/* Полка */}
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#78909C', marginBottom: 10 }}>
          ПОЛКА С ВЕЩЕСТВАМИ — выберите два
        </div>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {game.substances.map((s) => {
            const on = chosen.includes(s.id)
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                style={{
                  fontFamily: 'inherit', cursor: 'pointer', borderRadius: 18, padding: '12px 8px',
                  minHeight: 108, border: `4px solid ${on ? '#43A047' : '#E0E0E0'}`,
                  background: on ? '#E8F5E9' : 'white',
                  transform: on ? 'translateY(-4px)' : 'none', transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  boxShadow: on ? '0 8px 18px rgba(67,160,71,0.25)' : 'none',
                }}
              >
                <span style={{ fontSize: 40, lineHeight: 1 }}>{s.emoji}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#37474F', lineHeight: 1.2 }}>{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Стакан и находки */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          background: 'white', borderRadius: 28, padding: 18, minHeight: 330,
          boxShadow: '0 10px 30px rgba(38,50,56,0.12)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          {shown ? (
            <Scene key={shown.n} pair={shown.pair} mix={shown.mix} colorOf={(id) => byId[id]?.color ?? null} />
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 64 }}>
                <span style={{ opacity: chosen[0] ? 1 : 0.2 }}>{chosen[0] ? byId[chosen[0]].emoji : '❔'}</span>
                <span style={{ fontSize: 40, color: '#B0BEC5' }}>+</span>
                <span style={{ opacity: chosen[1] ? 1 : 0.2 }}>{chosen[1] ? byId[chosen[1]].emoji : '❔'}</span>
              </div>
              <KButton big color="#43A047" disabled={chosen.length < 2} onClick={mix}>Смешать!</KButton>
            </div>
          )}
          {shown && (
            <KButton ghost color="#43A047" onClick={() => setShown(null)}>Новый опыт</KButton>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CHEM_SIGNS.map((s) => {
            const ok = found.includes(s)
            return (
              <div key={s} className={ok ? 'kids-pop' : undefined} style={{
                borderRadius: 18, padding: '12px 10px', textAlign: 'center',
                background: ok ? '#E8F5E9' : '#F5F5F5', border: `3px solid ${ok ? '#66BB6A' : '#E0E0E0'}`,
              }}>
                <div style={{ fontSize: 34, filter: ok ? 'none' : 'grayscale(1) opacity(0.4)' }}>{SIGN_INFO[s].emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: ok ? '#2E7D32' : '#B0BEC5' }}>
                  {ok ? '✓ ' : ''}{SIGN_INFO[s].title}
                </div>
              </div>
            )
          })}
        </div>

        {allFound && (
          <KButton big color="#FB8C00" onClick={finish}>Все признаки найдены! Завершить →</KButton>
        )}
        <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
          Опытов: {tries} · найдено признаков: {found.length} из 4
        </div>
      </div>

      {shown && (
        <div style={{ gridColumn: '1 / -1' }}>
          {shown.mix ? (
            <Feedback
              kind={shown.mix.sign === 'none' ? 'info' : 'right'}
              title={shown.mix.sign === 'none'
                ? 'Новых веществ нет'
                : `Признак реакции: ${SIGN_INFO[shown.mix.sign].title.toLowerCase()}!`}
              text={shown.mix.text}
            />
          ) : (
            <Feedback kind="info" title="Видимых изменений нет" text="Попробуйте другую пару веществ." />
          )}
        </div>
      )}
    </div>
  )
}

/** Что происходит в стакане: пузыри, муть, смена цвета или пламя */
export function Scene({ pair, mix, colorOf }: { pair: string[]; mix: LabMix | null; colorOf: (id: string) => string | null }) {
  const start = pair.map(colorOf).find(Boolean) ?? '#E3F2FD'
  const end = mix?.color ?? start
  const [color, setColor] = useState(start)
  useEffect(() => {
    const t = setTimeout(() => setColor(end), 350)
    return () => clearTimeout(t)
  }, [end])

  if (mix?.sign === 'light') {
    const flash = pair.includes('magnesium')
    return (
      <div style={{ position: 'relative', width: 240, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: flash
            ? 'radial-gradient(circle, #FFFFFF 0%, #FFFDE7 40%, transparent 70%)'
            : 'radial-gradient(circle, #FFE082 0%, #FFCC80 35%, transparent 70%)',
          animation: flash ? 'kids-flash 1.4s ease-out both' : undefined,
        }} />
        <span style={{
          fontSize: 130, position: 'relative', display: 'inline-block', transformOrigin: 'bottom center',
          animation: 'kids-flame 0.5s ease-in-out infinite',
        }}>
          {flash ? '✨' : '🕯️'}
        </span>
      </div>
    )
  }

  const bubbles = mix?.sign === 'gas'
  const cloudy = mix?.sign === 'precipitate'
  return (
    <svg width="220" height="270" viewBox="0 0 220 270">
      <defs>
        <clipPath id="beaker-in">
          <path d="M42 30 L42 238 Q42 254 58 254 L162 254 Q178 254 178 238 L178 30 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#beaker-in)">
        <rect x="30" y="92" width="160" height="170" fill={color} style={{ transition: 'fill 1.6s ease' }} />
        {cloudy && (
          <>
            <rect x="30" y="92" width="160" height="170" fill="white" opacity="0.55" style={{ animation: 'kids-settle 1.2s ease-out both' }} />
            <ellipse cx="110" cy="250" rx="70" ry="14" fill="white" style={{ animation: 'kids-settle 2s ease-out 0.6s both' }} />
          </>
        )}
        {bubbles && Array.from({ length: 16 }, (_, i) => (
          <circle
            key={i} cx={55 + ((i * 37) % 110)} cy={250} r={4 + (i % 4) * 2.5}
            fill="white" stroke="rgba(0,0,0,0.12)"
            style={{ animation: `kids-bubble ${1.3 + (i % 5) * 0.25}s ease-in ${(i * 0.17) % 1.5}s infinite` }}
          />
        ))}
        {bubbles && <rect x="30" y="72" width="160" height="22" fill="white" opacity="0.8" rx="10" />}
      </g>
      <path
        d="M34 22 L42 30 L42 238 Q42 254 58 254 L162 254 Q178 254 178 238 L178 30 L186 22"
        fill="none" stroke="#90A4AE" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"
      />
      <line x1="62" y1="70" x2="62" y2="220" stroke="white" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
