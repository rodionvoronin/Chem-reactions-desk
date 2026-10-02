import { useState, useMemo } from 'react'
import { TableGame as Game, TableTask } from '../types'
import { ELEMENTS, Element } from '../../periodic'
import { CARD_MAP } from '../elements'
import { KButton, Feedback, sfx, shuffle, useTeams } from '../kit'
import { starsByMistakes } from '../progress'

const BLOCK_COLORS: Record<string, string> = { s: '#FFCDD2', p: '#FFF59D', d: '#BBDEFB', f: '#C8E6C9' }

/** Текст задания выводится из данных, а не пишется руками */
export function tableAsk(task: TableTask): string {
  const el = ELEMENTS.find((e) => e.symbol === task.symbol)!
  if (task.by === 'z') return `Найдите элемент с порядковым номером ${el.z}`
  if (task.by === 'name') return `Найдите элемент «${el.name}»`
  return `Найдите элемент со знаком ${el.symbol}`
}

/** Где клетка элемента стоит в сетке 18 × 10 (два нижних ряда — лантаноиды и актиноиды) */
function cellOf(e: Element): { row: number; col: number } {
  if (e.series === 'La') return { row: 9, col: e.z - 58 + 4 }
  if (e.series === 'Ac') return { row: 10, col: e.z - 90 + 4 }
  return { row: e.period, col: e.group! }
}

/**
 * Охота по таблице Менделеева: таблица — справочник, и найти в ней элемент
 * по номеру или названию нужно уметь быстро. Клетки крупные: искать будут
 * у доски, а подсказывать — с мест.
 */
export function TableGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const tasks = useMemo(() => shuffle(game.tasks), [game])
  const [index, setIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [miss, setMiss] = useState<string | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const task = tasks[index]
  const target = ELEMENTS.find((e) => e.symbol === task.symbol)!

  const pick = (e: Element) => {
    if (solved) return
    if (e.symbol === task.symbol) {
      sfx.right()
      setSolved(true)
      setMiss(null)
      teams.award(1)
    } else {
      sfx.wrong()
      setMiss(e.symbol)
      setMistakes((m) => m + 1)
      teams.pass()
    }
  }

  const next = () => {
    teams.pass()
    if (index + 1 >= tasks.length) {
      onFinish(starsByMistakes(mistakes, tasks.length))
      return
    }
    setIndex(index + 1)
    setSolved(false)
    setMiss(null)
  }

  const missed = miss ? ELEMENTS.find((e) => e.symbol === miss)! : null
  const card = CARD_MAP[target.symbol]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div key={index} className="kids-pop" style={{
        background: 'white', borderRadius: 24, padding: '16px 24px', boxShadow: '0 8px 24px rgba(38,50,56,0.1)',
        fontSize: 30, fontWeight: 700, color: '#263238', display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ fontSize: 42 }}>🔎</span> {tableAsk(task)}
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(18, minmax(44px, 1fr))',
          gridTemplateRows: 'repeat(7, auto) 14px repeat(2, auto)', gap: 3, minWidth: 820,
        }}>
          {ELEMENTS.map((e) => {
            const { row, col } = cellOf(e)
            const isTarget = solved && e.symbol === task.symbol
            const isMiss = miss === e.symbol
            return (
              <button
                key={e.z}
                onClick={() => pick(e)}
                className={isMiss ? 'kids-shake' : isTarget ? 'kids-pop' : undefined}
                style={{
                  gridRow: row, gridColumn: col,
                  fontFamily: 'inherit', cursor: 'pointer', padding: '3px 2px', borderRadius: 7,
                  border: isTarget ? '3px solid #2E7D32' : isMiss ? '3px solid #E64A19' : '1px solid rgba(0,0,0,0.08)',
                  background: isTarget ? '#A5D6A7' : BLOCK_COLORS[e.block],
                  transform: isTarget ? 'scale(1.25)' : 'none', zIndex: isTarget ? 2 : 1, position: 'relative',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.05,
                  transition: 'transform 0.2s',
                }}
              >
                <span style={{ fontSize: 10, color: '#607D8B', alignSelf: 'flex-start', paddingLeft: 2 }}>{e.z}</span>
                <span style={{ fontSize: 19, fontWeight: 700, color: '#263238' }}>{e.symbol}</span>
                <span style={{ fontSize: 8.5, color: '#546E7A', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {solved ? (
        <Feedback
          kind="right"
          title={`Нашли! ${target.symbol} — ${target.name}${card ? ` («${card.say}»)` : ''}`}
          text={`Порядковый номер ${target.z}, относительная атомная масса ${target.mass}, ${target.period}-й период.${card ? ' ' + card.fact : ''}`}
          action={<KButton big color="#43A047" onClick={next}>{index + 1 >= tasks.length ? 'Готово!' : 'Дальше →'}</KButton>}
        />
      ) : missed ? (
        <div style={{ textAlign: 'center', fontSize: 21, fontWeight: 700, color: '#E65100' }}>
          Это {missed.name} ({missed.symbol}, № {missed.z}). Ищем дальше{teams.enabled ? ` — ход команды «${teams.names[teams.turn]}»` : ''}!
        </div>
      ) : null}

      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
        Задание {index + 1} из {tasks.length} · ошибок: {mistakes}
      </div>
    </div>
  )
}
