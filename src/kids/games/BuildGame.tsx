import { useState } from 'react'
import { BuildGame as Game, BuildTarget } from '../types'
import { KButton, Feedback, sfx, useTeams, ATOM_COLORS } from '../kit'
import { elementOf } from '../elements'
import { KNOWN_MOLECULES } from '../content'
import { starsByMistakes } from '../progress'
import { GENITIVE } from '../generate'
import { countsOf, sameCounts, formulaOf, elementOrder, readFormula, Counts } from '../molecule'


/**
 * Конструктор: ученик складывает атомы по формуле. Формула на экране
 * пересобирается после каждого атома — так видно, откуда берётся индекс.
 */
export function BuildGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const [index, setIndex] = useState(0)
  const [atoms, setAtoms] = useState<Array<{ id: number; el: string }>>([])
  const [result, setResult] = useState<null | 'right' | { text: string }>(null)
  const [mistakes, setMistakes] = useState(0)
  const [seq, setSeq] = useState(1)

  const target = game.targets[index]
  const order = elementOrder(target.formula)
  const counts: Counts = {}
  for (const a of atoms) counts[a.el] = (counts[a.el] ?? 0) + 1
  const built = formulaOf(counts, order)

  const add = (el: string) => {
    if (result === 'right' || atoms.length >= 10) return
    sfx.pop()
    setAtoms([...atoms, { id: seq, el }])
    setSeq(seq + 1)
    setResult(null)
  }

  const remove = (id: number) => {
    if (result === 'right') return
    setAtoms(atoms.filter((a) => a.id !== id))
    setResult(null)
  }

  const check = () => {
    const need = countsOf(target.formula)
    if (sameCounts(need, counts)) {
      sfx.right()
      setResult('right')
      teams.award(2)
      return
    }
    sfx.wrong()
    setMistakes((m) => m + 1)
    teams.pass()
    const hints: string[] = []
    for (const el of new Set([...Object.keys(need), ...Object.keys(counts)])) {
      const n = need[el] ?? 0
      const have = counts[el] ?? 0
      if (n === have) continue
      if (n === 0) hints.push(`атомы ${GENITIVE[el] ?? el} здесь лишние`)
      else hints.push(`атомов ${GENITIVE[el] ?? el} нужно ${n}, а у вас ${have}`)
    }
    const known = KNOWN_MOLECULES.find((m) => sameCounts(countsOf(m.formula), counts))
    setResult({
      text: (known ? `Вы собрали ${known.formula} — это ${known.name}. Но нам нужно другое вещество: ` : 'Посмотрите на индексы: ')
        + hints.join('; ') + '.',
    })
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= game.targets.length) {
      onFinish(starsByMistakes(mistakes, game.targets.length))
      return
    }
    setIndex(index + 1)
    setAtoms([])
    setResult(null)
  }

  const simple = order.length === 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, userSelect: 'none' }}>
      {/* Задание */}
      <div key={target.id} className="kids-pop" style={{
        background: 'white', borderRadius: 28, padding: '20px 28px',
        boxShadow: '0 10px 30px rgba(38,50,56,0.12)',
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 22, color: '#78909C', fontWeight: 600 }}>Соберите молекулу</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#263238' }}>{target.name}</div>
        <div style={{
          fontSize: 64, fontWeight: 700, color: '#3949AB', marginLeft: 'auto',
          background: '#E8EAF6', borderRadius: 20, padding: '2px 26px',
        }}>
          {target.formula}
        </div>
      </div>

      {/* Рабочее поле */}
      <div style={{
        borderRadius: 28, minHeight: 240, padding: 20,
        background: 'radial-gradient(circle at 50% 40%, #FFFFFF 0%, #E8EAF6 100%)',
        border: '4px dashed #9FA8DA',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
      }}>
        {result === 'right' ? (
          <MoleculeView target={target} />
        ) : atoms.length === 0 ? (
          <div style={{ fontSize: 22, color: '#9FA8DA', fontWeight: 600 }}>Нажимайте на атомы внизу ↓</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {atoms.map((a) => <Ball key={a.id} el={a.el} size={78} onClick={() => remove(a.id)} pop />)}
          </div>
        )}
        <div style={{ fontSize: 22, color: '#5C6BC0', fontWeight: 700 }}>
          {atoms.length > 0 && (result === 'right'
            ? <>Читается «{readFormula(target.formula)}»</>
            : <>У вас получается: <span style={{ fontSize: 34 }}>{built}</span></>)}
        </div>
      </div>

      {result === 'right' && (
        <Feedback
          kind="right"
          title={`Верно! Это ${target.name.toLowerCase()} — ${simple ? 'простое вещество' : 'сложное вещество'}.`}
          text={target.note}
          action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.targets.length ? 'Готово!' : 'Следующая →'}</KButton>}
        />
      )}
      {result && result !== 'right' && <Feedback kind="wrong" title="Пока не то" text={result.text} />}

      {/* Атомы */}
      {result !== 'right' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {game.atoms.map((el) => (
            <div key={el} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Ball el={el} size={84} onClick={() => add(el)} />
              <span style={{ fontSize: 15, color: '#78909C', fontWeight: 600 }}>{elementOf(el).name}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12, marginLeft: 12 }}>
            <KButton big color="#3949AB" disabled={atoms.length === 0} onClick={check}>Проверить</KButton>
            <KButton ghost color="#78909C" disabled={atoms.length === 0} onClick={() => { setAtoms([]); setResult(null) }}>Очистить</KButton>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
        Молекула {index + 1} из {game.targets.length}
      </div>
    </div>
  )
}

function Ball({ el, size, onClick, pop = false }: { el: string; size: number; onClick: () => void; pop?: boolean }) {
  const c = ATOM_COLORS[el]
  const d = size * (0.75 + c.r * 0.3)
  return (
    <button
      onClick={onClick}
      className={pop ? 'kids-pop' : undefined}
      style={{
        width: d, height: d, borderRadius: '50%', cursor: 'pointer',
        border: el === 'H' ? '3px solid #B0BEC5' : 'none',
        background: `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.85) 0%, ${c.fill} 38%, ${c.fill} 100%)`,
        boxShadow: '0 6px 14px rgba(0,0,0,0.22), inset -6px -8px 14px rgba(0,0,0,0.18)',
        color: c.text, fontFamily: 'inherit', fontSize: d * 0.36, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {el}
    </button>
  )
}

/** Шаростержневая модель — как в кабинете химии */
export function MoleculeView({ target, unit = 72 }: { target: BuildTarget; unit?: number }) {
  const xs = target.layout.map((a) => a.x)
  const ys = target.layout.map((a) => a.y)
  const pad = 1.3
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  const w = (Math.max(...xs) + pad - minX) * unit
  const h = (Math.max(...ys) + pad - minY) * unit
  const px = (x: number) => (x - minX) * unit
  const py = (y: number) => (y - minY) * unit
  return (
    <svg width={w} height={h} className="kids-pop" style={{ maxWidth: '100%', overflow: 'visible' }}>
      <defs>
        {Object.entries(ATOM_COLORS).map(([el, c]) => (
          <radialGradient key={el} id={`atom-${el}`} cx="35%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
            <stop offset="40%" stopColor={c.fill} />
            <stop offset="100%" stopColor={c.fill} />
          </radialGradient>
        ))}
      </defs>
      {target.bonds.map(([a, b], i) => (
        <line
          key={i}
          x1={px(target.layout[a].x)} y1={py(target.layout[a].y)}
          x2={px(target.layout[b].x)} y2={py(target.layout[b].y)}
          stroke="#90A4AE" strokeWidth={unit * 0.28} strokeLinecap="round"
        />
      ))}
      {target.layout.map((a, i) => {
        const c = ATOM_COLORS[a.el]
        return (
          <g key={i}>
            <circle
              cx={px(a.x)} cy={py(a.y)} r={c.r * unit}
              fill={`url(#atom-${a.el})`} stroke={a.el === 'H' ? '#B0BEC5' : 'rgba(0,0,0,0.15)'} strokeWidth={2}
            />
            <text
              x={px(a.x)} y={py(a.y)} textAnchor="middle" dominantBaseline="central"
              fontSize={c.r * unit * 0.8} fontWeight={700} fill={c.text}
            >
              {a.el}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
