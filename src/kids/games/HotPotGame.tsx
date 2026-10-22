import { useEffect, useMemo, useRef, useState } from 'react'
import { HotPotGame as Game } from '../types'
import { blitzQuestions } from './BlitzGame'
import { KButton, sfx, shuffle, useTeams, KFONT, TEAM_COLORS, Confetti } from '../kit'

/** Сколько раундов в игре и сколько секунд колба греется до кипения */
const ROUNDS = 3
const MAX_FUSE = 60
const MIN_FUSE = 30

/**
 * «Горячая колба» — химическая «горячая картошка». Колба стоит на горелке
 * у одной из команд и всё время нагревается. Команда отвечает на вопрос:
 * верно — колба переезжает к соперникам, неверно — остаётся и приходит
 * новый вопрос. В какой-то момент после середины шкалы колба вскипает —
 * когда именно, не знает никто. У кого вскипела, тот проиграл раунд.
 * Отвечать надо быстро, но угадывать наугад — значит держать колбу дольше.
 */
export function HotPotGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const names = teams.enabled ? teams.names : ['Левая половина', 'Правая половина'] as [string, string]
  const pool = useMemo(() => shuffle(blitzQuestions({ kind: 'blitz', sections: game.sections, seconds: 0 })).map((q) => {
    const order = shuffle(q.options.map((_, i) => i))
    return { text: q.text, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) }
  }), [game])

  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'ready' | 'hot' | 'boom' | 'done'>('ready')
  const [holder, setHolder] = useState<0 | 1>(0)
  const [qi, setQi] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [wins, setWins] = useState<[number, number]>([0, 0])
  const [shake, setShake] = useState(0)
  const [passFx, setPassFx] = useState(0)
  const fuse = useRef(MAX_FUSE)

  const start = () => {
    sfx.pop()
    fuse.current = MIN_FUSE + Math.random() * (MAX_FUSE - MIN_FUSE)
    setElapsed(0)
    lastTick.current = 0
    setHolder((round % 2) as 0 | 1)
    setQi((x) => x + 1)
    setPhase('hot')
  }

  // Колба греется по десятым долям секунды; тиканье ускоряется с нагревом
  useEffect(() => {
    if (phase !== 'hot') return
    const id = window.setInterval(() => setElapsed((e) => e + 0.1), 100)
    return () => window.clearInterval(id)
  }, [phase])

  const heat = Math.min(1, elapsed / MAX_FUSE)
  const lastTick = useRef(0)
  useEffect(() => {
    if (phase !== 'hot') return
    const gap = 1.2 - heat * 0.95
    if (elapsed - lastTick.current >= gap) { lastTick.current = elapsed; sfx.tick() }
    if (elapsed >= fuse.current) {
      sfx.boom()
      // Раунд выигрывает соперник той команды, у которой вскипело
      const winner = holder === 0 ? 1 : 0
      setWins((w) => (winner === 0 ? [w[0] + 1, w[1]] : [w[0], w[1] + 1]))
      setPhase('boom')
    }
  }, [elapsed, phase, heat, holder])

  const answer = (i: number) => {
    if (phase !== 'hot') return
    const q = pool[qi % pool.length]
    setQi(qi + 1)
    if (i === q.answer) {
      sfx.right()
      setHolder((h) => (h === 0 ? 1 : 0))
      setPassFx((x) => x + 1)
    } else {
      sfx.wrong()
      setShake((x) => x + 1)
    }
  }

  const nextRound = () => {
    if (round + 1 >= ROUNDS || Math.max(...wins) > ROUNDS / 2) { setPhase('done'); sfx.win(); return }
    setRound(round + 1)
    setPhase('ready')
  }

  const q = pool[qi % pool.length]
  const liquid = `hsl(${210 - heat * 210}, 85%, ${55 - heat * 8}%)`
  const winner = wins[0] === wins[1] ? null : wins[0] > wins[1] ? 0 : 1

  const flask = (
    <div style={{ position: 'relative', width: 220, height: 280 }}>
      <svg width={220} height={280} viewBox="0 0 220 280">
        <defs>
          <clipPath id="hotpot-flask"><path d="M85 20 h50 v70 l60 150 q8 24 -18 24 h-134 q-26 0 -18 -24 l60 -150 z" /></clipPath>
        </defs>
        <g clipPath="url(#hotpot-flask)">
          <rect x={0} y={0} width={220} height={280} fill="#F5FAFF" />
          <rect x={0} y={270 - 130 - heat * 60} width={220} height={200} fill={liquid} style={{ transition: 'fill 0.4s' }} />
        </g>
        <path d="M85 20 h50 v70 l60 150 q8 24 -18 24 h-134 q-26 0 -18 -24 l60 -150 z" fill="none" stroke="#546E7A" strokeWidth={6} />
        <rect x={78} y={10} width={64} height={14} rx={6} fill="#78909C" />
      </svg>
      {/* Пузыри — тем чаще, чем горячее */}
      {phase === 'hot' && Array.from({ length: Math.round(2 + heat * 10) }, (_, k) => (
        <span key={k} style={{
          position: 'absolute', left: 60 + ((k * 37) % 100), bottom: 30 + ((k * 13) % 40), width: 14, height: 14, borderRadius: 7,
          background: 'rgba(255,255,255,0.8)', animation: `kids-boil ${1.6 - heat}s ease-in ${(k * 0.17) % 1}s infinite`,
        }} />
      ))}
      <div style={{ textAlign: 'center', fontSize: 40, marginTop: -6 }}>🔥</div>
    </div>
  )

  const side = (t: 0 | 1) => {
    const has = holder === t && (phase === 'hot' || phase === 'boom')
    return (
      <div style={{
        flex: 1, minWidth: 0, borderRadius: 26, padding: 18, minHeight: 420,
        border: `5px solid ${has ? TEAM_COLORS[t] : '#ECEFF1'}`, background: has ? `${TEAM_COLORS[t]}10` : 'white',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transition: 'all 0.3s',
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: TEAM_COLORS[t] }}>{names[t]} · {'★'.repeat(wins[t]) || '—'}</div>
        {has && phase === 'hot' && (
          <div key={passFx} className="kids-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
            <div key={shake} className={shake ? 'kids-shake' : undefined}>{flask}</div>
          </div>
        )}
        {has && phase === 'boom' && <div className="kids-pop" style={{ fontSize: 150, lineHeight: 1 }}>💥</div>}
        {!has && phase === 'hot' && <div style={{ fontSize: 22, color: '#90A4AE', marginTop: 120 }}>Колба у соперников… пока!</div>}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {phase === 'done' && <Confetti />}
      <div style={{ display: 'flex', gap: 22, alignItems: 'stretch' }}>
        {side(0)}
        <div style={{ width: 520, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          {phase === 'ready' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#263238' }}>Раунд {round + 1} из {ROUNDS}</div>
              <div style={{ fontSize: 20, color: '#546E7A', lineHeight: 1.4 }}>
                Колба начнёт у команды «{names[(round % 2) as 0 | 1]}». Верный ответ — колба уходит соперникам. Когда она вскипит, не знает никто!
              </div>
              <KButton big color="#E53935" onClick={start}>🔥 Зажечь горелку</KButton>
            </div>
          )}
          {phase === 'hot' && q && (
            <>
              <div style={{ fontSize: 18, fontWeight: 700, color: TEAM_COLORS[holder], textAlign: 'center' }}>Отвечает «{names[holder]}»</div>
              <div style={{ background: 'white', borderRadius: 22, padding: '20px 22px', fontSize: 26, fontWeight: 700, color: '#263238', lineHeight: 1.3, textAlign: 'center', boxShadow: '0 8px 22px rgba(38,50,56,0.10)' }}>
                {q.text}
              </div>
              <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
                {q.options.map((o, i) => (
                  <button key={`${qi}-${i}`} onClick={() => answer(i)} style={{
                    fontFamily: KFONT, fontSize: 21, fontWeight: 700, minHeight: 72, borderRadius: 16, padding: '8px 10px', cursor: 'pointer',
                    border: `3px solid ${TEAM_COLORS[holder]}55`, background: 'white', color: '#37474F',
                  }}>{o}</button>
                ))}
              </div>
              <div style={{ height: 14, borderRadius: 7, background: '#ECEFF1', overflow: 'hidden' }}>
                <div style={{ width: `${heat * 100}%`, height: '100%', background: 'linear-gradient(90deg, #42A5F5, #FFCA28, #E53935)', transition: 'width 0.1s linear' }} />
              </div>
              <div style={{ textAlign: 'center', fontSize: 15, color: '#90A4AE' }}>После середины шкалы колба может вскипеть в любую секунду</div>
            </>
          )}
          {phase === 'boom' && (
            <div className="kids-pop" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <div style={{ fontSize: 38, fontWeight: 700, color: '#C62828' }}>Вскипело у «{names[holder]}»!</div>
              <div style={{ fontSize: 22, color: '#455A64' }}>Раунд за командой «{names[holder === 0 ? 1 : 0]}».</div>
              <KButton big color="#5E35B1" onClick={nextRound}>Дальше →</KButton>
            </div>
          )}
          {phase === 'done' && (
            <div className="kids-pop" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: winner === null ? '#455A64' : TEAM_COLORS[winner] }}>
                {winner === null ? 'Ничья!' : `🏆 Победа «${names[winner]}»!`}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <KButton ghost color="#78909C" onClick={() => { setWins([0, 0]); setRound(0); setPhase('ready') }}>Ещё раз</KButton>
                <KButton big color="#43A047" onClick={() => onFinish(3)}>Дальше →</KButton>
              </div>
            </div>
          )}
        </div>
        {side(1)}
      </div>
    </div>
  )
}
