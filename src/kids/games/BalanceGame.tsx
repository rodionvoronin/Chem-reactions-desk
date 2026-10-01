import { useState } from 'react'
import { BalanceGame as Game } from '../types'
import { KButton, Feedback, sfx, useTeams, ATOM_COLORS } from '../kit'
import { starsByMistakes } from '../progress'
import { splitEquation, sideCounts, sameCounts, countsOf, elementOrder, gcdAll } from '../molecule'
import { elementOf } from '../elements'
import { useIsNarrow } from '../../useViewport'

/** Цвета атомов, которых нет в шаростержневом наборе */
const EXTRA_COLORS: Record<string, string> = {
  Mg: '#9CCC65', Na: '#AB47BC', Al: '#B0BEC5', Fe: '#E65100', P: '#FF8A65', Cu: '#B87333', Ca: '#A1887F', K: '#7E57C2',
}

export function atomColor(el: string): string {
  return ATOM_COLORS[el]?.fill ?? EXTRA_COLORS[el] ?? '#8D6E63'
}

const MAX = 8

/**
 * Уравниваем реакцию: коэффициенты меняются кнопками, под каждой формулой
 * нарисовано столько молекул, сколько велит коэффициент. Так видно, что
 * коэффициент — это число молекул, а индекс внутри формулы трогать нельзя.
 */
export function BalanceGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const narrow = useIsNarrow()
  const [index, setIndex] = useState(0)
  const eq = splitEquation(game.equations[index])
  const terms = [...eq.left, ...eq.right]
  const [coefs, setCoefs] = useState<number[]>(() => terms.map(() => 1))
  const [state, setState] = useState<'ask' | 'right' | 'wrong'>('ask')
  const [mistakes, setMistakes] = useState(0)

  const left = sideCounts(eq.left, coefs.slice(0, eq.left.length))
  const right = sideCounts(eq.right, coefs.slice(eq.left.length))
  const elements = terms.flatMap((t) => elementOrder(t)).filter((e, i, all) => all.indexOf(e) === i)

  const change = (i: number, d: number) => {
    if (state === 'right') return
    sfx.pop()
    setCoefs(coefs.map((c, j) => (j === i ? Math.min(MAX, Math.max(1, c + d)) : c)))
    setState('ask')
  }

  const check = () => {
    if (sameCounts(left, right)) {
      sfx.right()
      setState('right')
      teams.award(2)
    } else {
      sfx.wrong()
      setState('wrong')
      setMistakes((m) => m + 1)
      teams.pass()
    }
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.equations.length) {
      onFinish(starsByMistakes(mistakes, game.equations.length))
      return
    }
    const nextEq = splitEquation(game.equations[index + 1])
    setIndex(index + 1)
    setCoefs([...nextEq.left, ...nextEq.right].map(() => 1))
    setState('ask')
  }

  const reducible = state === 'right' && gcdAll(coefs) > 1
  const written = terms.map((t, i) => `${coefs[i] > 1 ? coefs[i] : ''}${t}`)
  const writtenEq = `${written.slice(0, eq.left.length).join(' + ')} → ${written.slice(eq.left.length).join(' + ')}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, userSelect: 'none' }}>
      <div key={index} className="kids-pop" style={{
        background: 'white', borderRadius: 28, padding: narrow ? 14 : '24px 20px', boxShadow: '0 8px 24px rgba(38,50,56,0.1)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: narrow ? 8 : 18, flexWrap: 'wrap',
      }}>
        {terms.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: narrow ? 8 : 18 }}>
            {i > 0 && (
              <div style={{ fontSize: narrow ? 34 : 52, fontWeight: 700, color: '#90A4AE', marginTop: 46 }}>
                {i === eq.left.length ? '→' : '+'}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: narrow ? 90 : 140 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Step label="−" onClick={() => change(i, -1)} disabled={coefs[i] <= 1 || state === 'right'} />
                <div style={{ fontSize: narrow ? 34 : 52, fontWeight: 700, color: '#263238', whiteSpace: 'nowrap' }}>
                  <span style={{ color: coefs[i] > 1 ? '#E53935' : '#CFD8DC' }}>{coefs[i] > 1 ? coefs[i] : '1'}</span>{t}
                </div>
                <Step label="+" onClick={() => change(i, 1)} disabled={coefs[i] >= MAX || state === 'right'} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxWidth: 220 }}>
                {Array.from({ length: coefs[i] }, (_, k) => <MiniMolecule key={k} formula={t} />)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Счёт атомов */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {elements.map((el) => {
          const ok = left[el] === right[el]
          return (
            <div key={el} style={{
              borderRadius: 18, padding: '10px 18px', minWidth: 150, textAlign: 'center',
              background: ok ? '#E8F5E9' : '#FFF3E0', border: `3px solid ${ok ? '#66BB6A' : '#FFB74D'}`,
            }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#546E7A' }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: atomColor(el), border: '1px solid #B0BEC5', marginRight: 6, verticalAlign: -1 }} />
                {elementOf(el).name}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: ok ? '#2E7D32' : '#E65100' }}>
                {left[el] ?? 0} {ok ? '=' : '≠'} {right[el] ?? 0}
              </div>
            </div>
          )
        })}
      </div>

      {state === 'right' ? (
        <Feedback
          kind="right"
          title={`Уравнено: ${writtenEq}`}
          text={reducible
            ? 'Атомов поровну! Но все коэффициенты можно разделить на одно число — химики пишут самые маленькие.'
            : 'Атомов каждого элемента слева и справа поровну — масса сохраняется.'}
          action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.equations.length ? 'Готово!' : 'Следующее →'}</KButton>}
        />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          {state === 'wrong' && (
            <span style={{ fontSize: 21, fontWeight: 700, color: '#E65100' }}>
              Пока не поровну — посмотрите на оранжевые элементы{teams.enabled ? `. Ход команды «${teams.names[teams.turn]}»` : ''}.
            </span>
          )}
          <KButton big color="#3949AB" onClick={check}>Проверить</KButton>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
        Уравнение {index + 1} из {game.equations.length} · ошибок: {mistakes}
      </div>
    </div>
  )
}

function Step({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 48, height: 48, borderRadius: 14, border: 'none', cursor: disabled ? 'default' : 'pointer',
        background: disabled ? '#ECEFF1' : '#3949AB', color: 'white', fontSize: 28, fontWeight: 700,
        fontFamily: 'inherit', opacity: disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  )
}

/** Молекула шариками в строку — без связей, только состав */
function MiniMolecule({ formula }: { formula: string }) {
  const counts = countsOf(formula)
  const atoms = elementOrder(formula)
    .filter((e, i, all) => all.indexOf(e) === i)
    .flatMap((el) => Array.from({ length: counts[el] }, () => el))
  return (
    <div className="kids-pop" style={{
      display: 'flex', background: '#F5F7FA', borderRadius: 999, padding: 3, border: '1px solid #E0E0E0',
    }}>
      {atoms.map((el, i) => (
        <span key={i} style={{
          width: 18, height: 18, borderRadius: 9, marginLeft: i ? -3 : 0,
          background: atomColor(el), border: '1.5px solid rgba(0,0,0,0.18)',
        }} />
      ))}
    </div>
  )
}
