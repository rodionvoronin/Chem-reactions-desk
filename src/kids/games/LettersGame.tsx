import { useRef, useState } from 'react'
import { LettersGame as Game } from '../types'
import { Feedback, KButton, sfx, useTeams, KFONT, TEAM_COLORS } from '../kit'

const ALPHABET = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('')

type Sector = { label: string; color: string } & (
  | { kind: 'points'; value: number }
  | { kind: 'double' }
  | { kind: 'bankrupt' }
  | { kind: 'plus' }
  | { kind: 'skip' }
)

/** Барабан как в телеигре: очки, «Банкрот», «×2», «+» и «Переход хода» */
const SECTORS: Sector[] = [
  { kind: 'points', value: 100, label: '100', color: '#42A5F5' },
  { kind: 'points', value: 300, label: '300', color: '#66BB6A' },
  { kind: 'bankrupt', label: 'Б', color: '#263238' },
  { kind: 'points', value: 200, label: '200', color: '#FFA726' },
  { kind: 'plus', label: '+', color: '#AB47BC' },
  { kind: 'points', value: 500, label: '500', color: '#EF5350' },
  { kind: 'skip', label: '⇄', color: '#90A4AE' },
  { kind: 'points', value: 400, label: '400', color: '#26A69A' },
  { kind: 'double', label: '×2', color: '#FFCA28' },
  { kind: 'points', value: 200, label: '200', color: '#5C6BC0' },
]
const SLICE = 360 / SECTORS.length

const SECTOR_TEXT: Record<Sector['kind'], string> = {
  points: 'Называйте букву!',
  double: '×2 — угадаете букву, и очки в кошельке удвоятся!',
  bankrupt: 'Банкрот! Кошелёк сгорел, ход переходит.',
  plus: '«Плюс» — откройте любую букву на табло!',
  skip: 'Переход хода!',
}

/**
 * «Поле чудес». Слово закрыто, видна только подсказка. Перед каждой буквой
 * крутят барабан: выпали очки — за каждую открытую клетку столько очков,
 * «×2» удваивает кошелёк, «Банкрот» его сжигает, «+» открывает любую клетку.
 * Ошиблись буквой — ход переходит. Кто узнал слово, говорит его целиком,
 * а учитель открывает слово кнопкой.
 */
export function LettersGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const names = teams.enabled ? teams.names : ['Класс', ''] as [string, string]
  const who = teams.enabled ? teams.turn : 0
  const [index, setIndex] = useState(0)
  const [tried, setTried] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)
  const [misses, setMisses] = useState(0)
  const [flash, setFlash] = useState<string | null>(null)
  const [purse, setPurse] = useState<[number, number]>([0, 0])
  const [angle, setAngle] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [sector, setSector] = useState<Sector | null>(null)
  const [opened, setOpened] = useState<number[]>([])
  const timer = useRef<number>()

  const item = game.words[index]
  const word = item.word.toUpperCase()
  const letters = word.split('')
  const isOpen = (i: number) => revealed || tried.includes(letters[i]) || opened.includes(i)
  const solved = revealed || letters.every((_, i) => isOpen(i))

  const addPurse = (fn: (x: number) => number) => setPurse((p) => (who === 0 ? [fn(p[0]), p[1]] : [p[0], fn(p[1])]))
  const passTurn = () => { setSector(null); if (teams.enabled) teams.pass() }

  const spin = () => {
    if (spinning || solved || (sector && sector.kind !== 'bankrupt' && sector.kind !== 'skip')) return
    sfx.spin()
    const k = Math.floor(Math.random() * SECTORS.length)
    // Указатель сверху: поворачиваем барабан так, чтобы под ним встал центр сектора k
    const target = (360 - (k * SLICE + SLICE / 2)) % 360
    const next = angle + 360 * 4 + ((target - (angle % 360)) + 360) % 360
    setAngle(next)
    setSpinning(true)
    setSector(null)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setSpinning(false)
      const s = SECTORS[k]
      setSector(s)
      if (s.kind === 'bankrupt') { sfx.boom(); addPurse(() => 0); window.setTimeout(passTurn, 1600) }
      else if (s.kind === 'skip') { sfx.wrong(); window.setTimeout(passTurn, 1300) }
      else sfx.pop()
    }, 2700)
  }

  const press = (l: string) => {
    if (solved || tried.includes(l) || !sector || spinning) return
    if (sector.kind !== 'points' && sector.kind !== 'double') return
    setTried([...tried, l])
    const hits = letters.filter((x, i) => x === l && !opened.includes(i)).length
    setFlash(l)
    if (hits) {
      sfx.right()
      if (sector.kind === 'points') addPurse((x) => x + sector.value * hits)
      else addPurse((x) => Math.max(x * 2, 100))
      // Угадал — крутит снова та же команда
      setSector(null)
      if (teams.enabled) teams.again()
    } else {
      sfx.wrong()
      setMisses((m) => m + 1)
      passTurn()
    }
  }

  const openTile = (i: number) => {
    if (sector?.kind !== 'plus' || isOpen(i)) return
    sfx.right()
    setOpened([...opened, i])
    setFlash(letters[i])
    setSector(null)
  }

  const sayWord = () => {
    sfx.win()
    addPurse((x) => x + 500)
    if (teams.enabled) teams.award(1)
    setRevealed(true)
  }

  const next = () => {
    if (teams.enabled) teams.pass()
    if (index + 1 >= game.words.length) {
      const per = misses / game.words.length
      onFinish(per <= 2 ? 3 : per <= 4 ? 2 : 1)
      return
    }
    setIndex(index + 1)
    setTried([])
    setOpened([])
    setRevealed(false)
    setFlash(null)
    setSector(null)
  }

  const tile = Math.min(80, Math.floor(820 / letters.length) - 10)
  const color = teams.enabled ? TEAM_COLORS[who] : '#1E88E5'
  const canLetter = !!sector && (sector.kind === 'points' || sector.kind === 'double') && !spinning

  return (
    <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start', justifyContent: 'center' }}>
      {/* Барабан и кошельки */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <div style={{ position: 'relative', width: 320, height: 330 }}>
          <div style={{
            position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', zIndex: 2,
            width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: '30px solid #263238',
          }} />
          <svg width={320} height={320} viewBox="-1 -1 2 2" style={{
            position: 'absolute', top: 10, transform: `rotate(${angle}deg)`,
            transition: spinning ? 'transform 2.6s cubic-bezier(0.15, 0.7, 0.2, 1)' : 'none',
          }}>
            {SECTORS.map((s, i) => {
              const a0 = ((i * SLICE - 90) * Math.PI) / 180
              const a1 = (((i + 1) * SLICE - 90) * Math.PI) / 180
              const mid = (((i + 0.5) * SLICE - 90) * Math.PI) / 180
              return (
                <g key={i}>
                  <path d={`M0 0 L${Math.cos(a0)} ${Math.sin(a0)} A1 1 0 0 1 ${Math.cos(a1)} ${Math.sin(a1)} Z`} fill={s.color} stroke="white" strokeWidth={0.015} />
                  <text x={0.68 * Math.cos(mid)} y={0.68 * Math.sin(mid)} fill="white" fontSize={s.label.length > 2 ? 0.14 : 0.17} fontWeight={700}
                    textAnchor="middle" dominantBaseline="central" fontFamily={KFONT}
                    transform={`rotate(${(i + 0.5) * SLICE} ${0.68 * Math.cos(mid)} ${0.68 * Math.sin(mid)})`}>{s.label}</text>
                </g>
              )
            })}
            <circle r={0.16} fill="white" stroke="#263238" strokeWidth={0.02} />
          </svg>
        </div>
        <KButton big color={color} disabled={spinning || solved || canLetter || sector?.kind === 'plus'} onClick={spin}>
          {spinning ? 'Крутится…' : '🎡 Крутить барабан'}
        </KButton>
        <div style={{ display: 'flex', gap: 10 }}>
          {(teams.enabled ? [0, 1] : [0]).map((t) => (
            <div key={t} style={{
              borderRadius: 16, padding: '8px 16px', fontWeight: 700, fontSize: 18, textAlign: 'center', minWidth: 120,
              border: `3px solid ${teams.enabled ? TEAM_COLORS[t] : '#1E88E5'}`,
              background: who === t ? (teams.enabled ? `${TEAM_COLORS[t]}18` : '#E3F2FD') : 'white',
              color: teams.enabled ? TEAM_COLORS[t] : '#1565C0',
            }}>
              <div style={{ fontSize: 15 }}>{names[t]}</div>
              <div style={{ fontSize: 28 }}>💰 {purse[t]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Табло и буквы */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', minWidth: 0, flex: 1, maxWidth: 860 }}>
        <div className="kids-pop" key={index} style={{
          fontSize: 25, fontWeight: 700, color: '#4E342E', background: '#FFF8E1', borderRadius: 20,
          padding: '14px 24px', textAlign: 'center',
        }}>
          {item.hint}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {letters.map((l, i) => {
            const open = isOpen(i)
            const pickable = !open && sector?.kind === 'plus'
            return (
              <div key={i} onClick={() => openTile(i)} className={open && flash === l ? 'kids-pop' : pickable ? 'kids-glow' : undefined} style={{
                width: tile, height: tile * 1.2, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: open ? 'white' : 'linear-gradient(160deg, #1E88E5, #1565C0)', cursor: pickable ? 'pointer' : 'default',
                border: `4px solid ${pickable ? '#FFC107' : open ? '#1E88E5' : '#0D47A1'}`, boxShadow: '0 6px 0 rgba(13,71,161,0.25)',
                fontSize: tile * 0.62, fontWeight: 700, color: '#0D47A1',
              }}>
                {open ? l : ''}
              </div>
            )
          })}
        </div>

        {!solved && (
          <>
            <div style={{ minHeight: 34, fontSize: 24, fontWeight: 700, color: sector?.kind === 'bankrupt' ? '#C62828' : color }}>
              {spinning ? '…' : sector ? SECTOR_TEXT[sector.kind] : `${teams.enabled ? `Ход «${names[who]}». ` : ''}Крутите барабан!`}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 58px)', gap: 7, opacity: canLetter ? 1 : 0.45 }}>
              {ALPHABET.map((l) => {
                const used = tried.includes(l)
                const hit = used && letters.includes(l)
                return (
                  <button key={l} onClick={() => press(l)} disabled={used || !canLetter} style={{
                    fontFamily: KFONT, fontSize: 25, fontWeight: 700, height: 58, borderRadius: 14, cursor: used || !canLetter ? 'default' : 'pointer',
                    border: `3px solid ${hit ? '#66BB6A' : used ? '#ECEFF1' : '#CFD8DC'}`,
                    background: hit ? '#E8F5E9' : used ? '#F5F7F8' : 'white',
                    color: hit ? '#2E7D32' : used ? '#CFD8DC' : '#37474F',
                    textDecoration: used && !hit ? 'line-through' : 'none',
                  }}>
                    {l}
                  </button>
                )
              })}
            </div>
            <KButton ghost color="#8E24AA" onClick={sayWord}>Назвали слово целиком! (+500)</KButton>
          </>
        )}

        {solved && (
          <div style={{ width: '100%' }}>
            <Feedback
              kind="right" title={`Слово: ${word}`}
              text={revealed ? 'Угадали раньше, чем открылись все буквы. Отлично!' : 'Все буквы открыты.'}
              action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.words.length ? 'Готово!' : 'Следующее слово →'}</KButton>}
            />
          </div>
        )}
        <div style={{ fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>Слово {index + 1} из {game.words.length}</div>
      </div>
    </div>
  )
}
