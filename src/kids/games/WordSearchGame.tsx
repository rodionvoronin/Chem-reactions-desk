import { useMemo, useState } from 'react'
import { WordSearchGame as Game } from '../types'
import { KButton, sfx, useTeams, KFONT, Feedback } from '../kit'

const FILL = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ'

/** Генератор случайных чисел с зерном: сетка одна и та же при каждом запуске */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

function hash(text: string): number {
  let h = 2166136261
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return h >>> 0
}

export interface Placed { word: string; r: number; c: number; dr: number; dc: number }

/**
 * Раскладывает слова по сетке: только слева направо и сверху вниз — так
 * их ищут шестиклассники. Слова могут пересекаться по общей букве.
 * Возвращает null, если слова не уместились, — это ловит проверка курса.
 */
export function buildGrid(words: string[], size: number): { grid: string[][]; placed: Placed[] } | null {
  for (let attempt = 0; attempt < 60; attempt++) {
    const rand = rng(hash(words.join('|')) + attempt)
    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''))
    const placed: Placed[] = []
    // Длинные слова раскладываем первыми — им труднее найти место
    const order = [...words].map((w) => w.toUpperCase()).sort((a, b) => b.length - a.length)
    let ok = true
    for (const word of order) {
      let done = false
      for (let tries = 0; tries < 300 && !done; tries++) {
        const vertical = rand() < 0.5
        const dr = vertical ? 1 : 0
        const dc = vertical ? 0 : 1
        const r = Math.floor(rand() * (size - dr * (word.length - 1)))
        const c = Math.floor(rand() * (size - dc * (word.length - 1)))
        if (r < 0 || c < 0) continue
        let fits = true
        for (let i = 0; i < word.length; i++) {
          const cell = grid[r + dr * i][c + dc * i]
          if (cell && cell !== word[i]) { fits = false; break }
        }
        if (!fits) continue
        for (let i = 0; i < word.length; i++) grid[r + dr * i][c + dc * i] = word[i]
        placed.push({ word, r, c, dr, dc })
        done = true
      }
      if (!done) { ok = false; break }
    }
    if (!ok) continue
    for (const row of grid) for (let j = 0; j < size; j++) if (!row[j]) row[j] = FILL[Math.floor(rand() * FILL.length)]
    return { grid, placed }
  }
  return null
}

const key = (r: number, c: number) => `${r}:${c}`

/**
 * Филворд. Нажмите на первую букву слова, потом на последнюю: если между
 * ними по прямой лежит слово из списка, оно подсвечивается. Каждое слово
 * в списке — термин урока, найти его значит ещё раз его прочитать.
 */
export function WordSearchGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const built = useMemo(() => buildGrid(game.words, game.size), [game])
  const [first, setFirst] = useState<[number, number] | null>(null)
  const [found, setFound] = useState<Placed[]>([])
  const [miss, setMiss] = useState(0)
  const [shake, setShake] = useState(0)
  if (!built) return <div>Слова не помещаются в сетку</div>
  const { grid, placed } = built
  const foundCells = new Set(found.flatMap((p) => Array.from(p.word, (_, i) => key(p.r + p.dr * i, p.c + p.dc * i))))
  const done = found.length === placed.length

  const tap = (r: number, c: number) => {
    if (done) return
    if (!first) { sfx.flip(); setFirst([r, c]); return }
    const [r0, c0] = first
    setFirst(null)
    // Слово можно отметить с любого конца
    const hit = placed.find((p) => !found.includes(p) && (
      (p.r === r0 && p.c === c0 && p.r + p.dr * (p.word.length - 1) === r && p.c + p.dc * (p.word.length - 1) === c)
      || (p.r === r && p.c === c && p.r + p.dr * (p.word.length - 1) === r0 && p.c + p.dc * (p.word.length - 1) === c0)
    ))
    if (hit) {
      sfx.right()
      setFound([...found, hit])
      teams.award(1)
      teams.again()
    } else if (r !== r0 || c !== c0) {
      sfx.wrong()
      setMiss((m) => m + 1)
      setShake((s) => s + 1)
      teams.pass()
    }
  }

  const cell = Math.min(64, Math.floor(700 / game.size))

  return (
    <div style={{ display: 'flex', gap: 34, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
      <div key={shake} className={shake ? 'kids-shake' : undefined} style={{
        display: 'grid', gridTemplateColumns: `repeat(${game.size}, ${cell}px)`, gap: 4,
        background: 'white', padding: 14, borderRadius: 24, boxShadow: '0 10px 30px rgba(38,50,56,0.12)', userSelect: 'none',
      }}>
        {grid.map((row, r) => row.map((ch, c) => {
          const isFirst = first && first[0] === r && first[1] === c
          const isFound = foundCells.has(key(r, c))
          return (
            <button key={key(r, c)} onClick={() => tap(r, c)} style={{
              width: cell, height: cell, borderRadius: 10, fontFamily: KFONT, fontSize: cell * 0.5, fontWeight: 700, cursor: 'pointer', padding: 0,
              border: `3px solid ${isFirst ? '#FB8C00' : isFound ? '#66BB6A' : '#ECEFF1'}`,
              background: isFirst ? '#FFF3E0' : isFound ? '#C8E6C9' : '#FAFBFC',
              color: isFound ? '#1B5E20' : '#37474F',
            }}>
              {ch}
            </button>
          )
        }))}
      </div>

      <div style={{ minWidth: 300, maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#263238' }}>Найдите слова: {found.length} из {placed.length}</div>
        <div style={{ fontSize: 16, color: '#90A4AE' }}>Нажмите на первую букву слова, потом на последнюю.</div>
        {[...game.words].sort().map((w) => {
          const ok = found.some((p) => p.word === w.toUpperCase())
          return (
            <div key={w} style={{
              fontSize: 24, fontWeight: 700, padding: '8px 16px', borderRadius: 14,
              background: ok ? '#E8F5E9' : 'white', color: ok ? '#2E7D32' : '#455A64',
              textDecoration: ok ? 'line-through' : 'none', border: `2px solid ${ok ? '#A5D6A7' : '#ECEFF1'}`,
            }}>
              {ok ? '✓ ' : ''}{w.toUpperCase()}
            </div>
          )
        })}
        {done && (
          <Feedback kind="right" title="Все слова найдены!"
            action={<KButton big color="#43A047" onClick={() => onFinish(miss <= 2 ? 3 : miss <= 5 ? 2 : 1)}>Готово!</KButton>} />
        )}
      </div>
    </div>
  )
}
