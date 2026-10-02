import { useState, useMemo, useRef } from 'react'
import { MemoryGame as Game } from '../types'
import { CARD_MAP, elementOf, cardColor } from '../elements'
import { sfx, shuffle, useTeams } from '../kit'

interface Tile {
  key: string
  symbol: string
  face: 'symbol' | 'name'
}

/**
 * «Мемори»: знак элемента ↔ название. Пара угадана — ход остаётся у команды,
 * промах — ход переходит. Так играют в мемори за столом, и дети знают правила.
 */
export function MemoryGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const tiles = useMemo<Tile[]>(() => {
    const symbols = shuffle(game.pool).slice(0, game.pairs)
    return shuffle(symbols.flatMap((s) => [
      { key: `${s}-s`, symbol: s, face: 'symbol' as const },
      { key: `${s}-n`, symbol: s, face: 'name' as const },
    ]))
  }, [game])
  const [open, setOpen] = useState<string[]>([])
  const [found, setFound] = useState<string[]>([])
  const [misses, setMisses] = useState(0)
  const [last, setLast] = useState<string | null>(null)
  const busy = useRef(false)

  const flip = (tile: Tile) => {
    if (busy.current || open.includes(tile.key) || found.includes(tile.symbol)) return
    sfx.flip()
    const next = [...open, tile.key]
    setOpen(next)
    if (next.length < 2) return
    const [a, b] = next.map((k) => tiles.find((t) => t.key === k)!)
    if (a.symbol === b.symbol) {
      const nowFound = [...found, a.symbol]
      setTimeout(() => {
        sfx.right()
        setFound(nowFound)
        setLast(a.symbol)
        setOpen([])
        teams.award(1)
        // Угадали пару — ход остаётся у той же команды
        teams.again()
        if (nowFound.length === game.pairs) {
          // Промахов меньше числа пар — отлично: часть пар угадана с первого раза
          const stars = misses <= game.pairs ? 3 : misses <= game.pairs * 2 ? 2 : 1
          setTimeout(() => onFinish(stars), 1400)
        }
      }, 450)
    } else {
      busy.current = true
      setTimeout(() => {
        sfx.wrong()
        setOpen([])
        setMisses((m) => m + 1)
        teams.pass()
        busy.current = false
      }, 1300)
    }
  }

  const lastCard = last ? CARD_MAP[last] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, userSelect: 'none' }}>
      <div style={{
        display: 'grid', gap: 14,
        // Ровные ряды: на доске 8 пар ложатся в две строки по восемь, на телефоне — по четыре
        gridTemplateColumns: `repeat(${game.pairs <= 8 ? game.pairs : Math.ceil(game.pairs / 2)}, minmax(0, 1fr))`,
      }}>
        {tiles.map((t) => {
          const card = CARD_MAP[t.symbol]
          const shown = open.includes(t.key) || found.includes(t.symbol)
          const done = found.includes(t.symbol)
          const { bg, fg } = cardColor(card)
          return (
            <div key={t.key} onClick={() => flip(t)} style={{ perspective: 800, height: 190, cursor: 'pointer' }}>
              <div style={{
                position: 'relative', width: '100%', height: '100%',
                transformStyle: 'preserve-3d', transition: 'transform 0.4s',
                transform: shown ? 'rotateY(180deg)' : 'none',
              }}>
                {/* Рубашка */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 20,
                  background: 'linear-gradient(135deg, #5C6BC0, #3949AB)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 56, color: 'rgba(255,255,255,0.85)', boxShadow: '0 5px 0 #283593',
                }}>
                  ⚛
                </div>
                {/* Лицо */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 20,
                  transform: 'rotateY(180deg)',
                  background: done ? bg : 'white', border: `4px solid ${done ? fg : '#CFD8DC'}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: 8, textAlign: 'center',
                }}>
                  {t.face === 'symbol' ? (
                    <div style={{ fontSize: 72, fontWeight: 700, color: fg }}>{t.symbol}</div>
                  ) : (
                    game.face === 'say' ? (
                      <div style={{ fontSize: 26, fontWeight: 700, color: '#37474F' }}>«{card.say}»</div>
                    ) : (
                      <div style={{ fontSize: 23, fontWeight: 700, color: '#37474F' }}>{elementOf(t.symbol).name}</div>
                    )
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ minHeight: 64, textAlign: 'center' }}>
        {lastCard ? (
          <div key={last} className="kids-pop" style={{ fontSize: 22, color: '#37474F' }}>
            <b style={{ color: cardColor(lastCard).fg }}>{lastCard.symbol}</b> читается «{lastCard.say}» — {elementOf(lastCard.symbol).name.toLowerCase()}.{' '}
            <span style={{ color: '#78909C' }}>{lastCard.life}</span>
          </div>
        ) : (
          <div style={{ fontSize: 20, color: '#90A4AE' }}>Найдите {game.pairs} пар: знак и {game.face === 'say' ? 'его чтение' : 'название элемента'}</div>
        )}
      </div>

      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
        Найдено пар: {found.length} из {game.pairs} · промахов: {misses}
      </div>
    </div>
  )
}
