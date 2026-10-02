import { useState, useMemo, useRef } from 'react'
import { SortGame as Game, SortItem } from '../types'
import { KButton, Feedback, sfx, shuffle, useTeams, shade } from '../kit'
import { starsByMistakes } from '../progress'

/**
 * Сортировка по корзинам. Карточка на столе одна: всему классу видно, о чём
 * сейчас речь, и ответ обсуждают вслух, прежде чем ученик у доски его даст.
 * Карточку можно перетащить в корзину или просто нажать на корзину — на
 * интерактивных досках перетаскивание срабатывает не везде.
 */
export function SortGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const order = useMemo(() => shuffle(game.items), [game])
  const [index, setIndex] = useState(0)
  const [placed, setPlaced] = useState<Record<string, SortItem[]>>({})
  const [mistakes, setMistakes] = useState(0)
  const [state, setState] = useState<'ask' | 'right' | 'wrong'>('ask')
  const [shakeKey, setShakeKey] = useState(0)
  const [drag, setDrag] = useState<{ x: number; y: number; dx: number; dy: number } | null>(null)
  const [hoverBin, setHoverBin] = useState<string | null>(null)
  const start = useRef<{ x: number; y: number; moved: boolean } | null>(null)

  const item = order[index]
  const done = index >= order.length

  const answer = (binId: string) => {
    if (!item || state === 'right') return
    if (binId === item.bin) {
      sfx.right()
      setPlaced((p) => ({ ...p, [binId]: [...(p[binId] ?? []), item] }))
      setState('right')
      teams.award(1)
    } else {
      sfx.wrong()
      setMistakes((m) => m + 1)
      setState('wrong')
      setShakeKey((k) => k + 1)
      teams.pass()
    }
  }

  const next = () => {
    teams.pass()
    setState('ask')
    if (index + 1 >= order.length) {
      setIndex(index + 1)
      onFinish(starsByMistakes(mistakes, order.length))
    } else {
      setIndex(index + 1)
    }
  }

  const binAt = (x: number, y: number): string | null => {
    // Под пальцем лежит сама карточка, поэтому ищем корзину во всей стопке
    for (const el of document.elementsFromPoint(x, y)) {
      const bin = el.closest('[data-bin]')
      if (bin) return bin.getAttribute('data-bin')
    }
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, userSelect: 'none' }}>
      {/* Карточка */}
      <div style={{ minHeight: 230, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!done && item && state !== 'right' && (
          <div
            key={`${item.id}-${shakeKey}`}
            className={state === 'wrong' ? 'kids-shake' : 'kids-pop'}
            onPointerDown={(e) => {
              start.current = { x: e.clientX, y: e.clientY, moved: false }
              ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
            }}
            onPointerMove={(e) => {
              const s = start.current
              if (!s) return
              const dx = e.clientX - s.x
              const dy = e.clientY - s.y
              if (!s.moved && Math.hypot(dx, dy) < 8) return
              s.moved = true
              setDrag({ x: e.clientX, y: e.clientY, dx, dy })
              setHoverBin(binAt(e.clientX, e.clientY))
            }}
            onPointerUp={(e) => {
              const s = start.current
              start.current = null
              setDrag(null)
              setHoverBin(null)
              if (s?.moved) {
                const bin = binAt(e.clientX, e.clientY)
                if (bin) answer(bin)
              }
            }}
            style={{
              width: 300, minHeight: 210, borderRadius: 26, background: 'white',
              boxShadow: drag ? '0 24px 50px rgba(0,0,0,0.25)' : '0 10px 30px rgba(38,50,56,0.15)',
              border: '4px solid #ECEFF1',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10, padding: 20, cursor: 'grab', touchAction: 'none',
              transform: drag ? `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.dx / 30}deg)` : undefined,
              transition: drag ? 'none' : 'transform 0.2s',
              position: 'relative', zIndex: 5,
            }}
          >
            {item.swatch ? (
              <div style={{
                width: 120, height: 92, borderRadius: '0 0 46px 46px', background: item.swatch,
                border: '5px solid #CFD8DC', borderTop: 'none', boxShadow: 'inset 0 -10px 18px rgba(0,0,0,0.12)',
              }} />
            ) : item.big
              ? <div style={{ fontSize: item.big.length > 5 ? 46 : 70, fontWeight: 700, color: '#263238' }}>{item.big}</div>
              : <div style={{ fontSize: 84, lineHeight: 1 }}>{item.emoji}</div>}
            <div style={{ fontSize: 26, fontWeight: 700, color: '#37474F', textAlign: 'center' }}>{item.label}</div>
          </div>
        )}
        {state === 'right' && item && (
          <div style={{ flex: 1 }}>
            <Feedback
              kind="right"
              title={`Верно! ${item.label} — ${game.bins.find((b) => b.id === item.bin)!.title.toLowerCase()}.`}
              text={item.note}
              action={<KButton big color="#43A047" onClick={next}>{index + 1 >= order.length ? 'Готово!' : 'Дальше →'}</KButton>}
            />
          </div>
        )}
      </div>

      {state === 'wrong' && (
        <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#E65100' }}>
          Не сюда! Подумайте ещё раз{teams.enabled ? ` — отвечает команда «${teams.names[teams.turn]}»` : ''}.
        </div>
      )}

      {/* Корзины */}
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${game.bins.length}, minmax(0, 1fr))`, gap: 18,
      }}>
        {game.bins.map((bin) => {
          const hover = hoverBin === bin.id
          return (
            <div
              key={bin.id}
              data-bin={bin.id}
              onClick={() => answer(bin.id)}
              style={{
                borderRadius: 26, padding: '18px 16px', minHeight: 190, cursor: 'pointer', minWidth: 0,
                background: hover ? `${bin.color}30` : `${bin.color}14`,
                border: `4px ${hover ? 'solid' : 'dashed'} ${bin.color}`,
                transform: hover ? 'scale(1.03)' : 'none', transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              <div style={{ fontSize: 46, lineHeight: 1 }}>{bin.emoji}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: shade(bin.color, 0.8), textAlign: 'center', overflowWrap: 'anywhere', hyphens: 'auto' }} lang="ru">{bin.title}</div>
              {bin.subtitle && <div style={{ fontSize: 16, color: '#78909C', marginTop: -6, textAlign: 'center' }}>{bin.subtitle}</div>}
              {/* Пустой ряд не рисуем: иначе он сдвигает заголовок корзины вверх от центра */}
              {!!placed[bin.id]?.length && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 4 }}>
                {placed[bin.id].map((it) => (
                  <span key={it.id} className="kids-pop" style={{
                    background: 'white', borderRadius: 12, padding: '5px 11px',
                    fontSize: 16, fontWeight: 600, color: '#455A64', boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  }}>
                    {it.swatch
                      ? <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 6, background: it.swatch, marginRight: 4 }} />
                      : it.big ?? it.emoji} {it.label}
                  </span>
                ))}
              </div>}
            </div>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
        Карточка {Math.min(index + 1, order.length)} из {order.length} · ошибок: {mistakes}
      </div>
    </div>
  )
}
