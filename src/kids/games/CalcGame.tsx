import { useState, useEffect, useCallback } from 'react'
import { CalcGame as Game, CalcTask } from '../types'
import { KButton, Feedback, sfx, useTeams } from '../kit'
import { atomColor } from './BalanceGame'
import { starsByMistakes } from '../progress'
import { calcView } from '../generate'
import { AR, countsOf, elementOrder, mrOf, fmt } from '../molecule'
import { elementOf } from '../elements'

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', ',', '0', '⌫']

/**
 * Расчёт с экранной клавиатурой: на доске нет физической клавиатуры, а
 * варианты ответа превратили бы задачу в угадайку. Первая ошибка открывает
 * подсказку, вторая — решение: дальше идём всё равно с разобранной задачей.
 */
export function CalcGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const teams = useTeams()
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [tries, setTries] = useState(0)
  const [state, setState] = useState<'ask' | 'right' | 'shown'>('ask')
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState(0)

  const task = game.tasks[index]
  const view = calcView(task)

  const press = useCallback((k: string) => {
    if (state !== 'ask') return
    sfx.flip()
    setInput((v) => {
      if (k === '⌫') return v.slice(0, -1)
      if (k === ',') return v.includes(',') || v === '' ? v : v + ','
      return v.length >= 7 ? v : v + k
    })
  }, [state])

  const check = useCallback(() => {
    if (state !== 'ask' || !input) return
    const x = parseFloat(input.replace(',', '.'))
    if (view.accepts(x)) {
      sfx.right()
      setState('right')
      teams.award(tries === 0 ? 2 : 1)
      return
    }
    sfx.wrong()
    setShake((s) => s + 1)
    teams.pass()
    if (tries === 0) setMistakes((m) => m + 1)
    if (tries >= 1) setState('shown')
    setTries(tries + 1)
  }, [state, input, view, tries, teams])

  // На ноутбуке удобнее печатать с клавиатуры
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key)
      else if (e.key === ',' || e.key === '.') press(',')
      else if (e.key === 'Backspace') press('⌫')
      else if (e.key === 'Enter') check()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press, check])

  const next = () => {
    teams.pass()
    if (index + 1 >= game.tasks.length) {
      onFinish(starsByMistakes(mistakes, game.tasks.length))
      return
    }
    setIndex(index + 1)
    setInput('')
    setTries(0)
    setState('ask')
  }

  const formula = task.type === 'mr' || task.type === 'fraction' ? task.formula : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div key={index} className="kids-pop" style={{
        background: 'white', borderRadius: 26, padding: '20px 26px', boxShadow: '0 8px 24px rgba(38,50,56,0.1)',
      }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#263238', lineHeight: 1.35 }}>{view.prompt}</div>
        {formula && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
            {elementOrder(formula).filter((e, i, all) => all.indexOf(e) === i).map((el) => (
              <span key={el} style={{
                background: '#ECEFF1', borderRadius: 12, padding: '6px 14px', fontSize: 19, fontWeight: 700, color: '#455A64',
              }}>
                Ar({el}) = {fmt(AR[el])}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'minmax(0, 1fr) 340px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div key={shake} className={shake ? 'kids-shake' : undefined} style={{
            background: 'white', borderRadius: 22, padding: '16px 22px', minHeight: 92,
            border: `4px solid ${state === 'right' ? '#66BB6A' : state === 'shown' ? '#FFA726' : '#C5CAE9'}`,
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            fontSize: 44, fontWeight: 700, color: '#283593',
          }}>
            <span style={{ color: '#5C6BC0' }}>{view.lhs}</span>
            <span style={{ minWidth: 80, borderBottom: '4px dashed #9FA8DA', padding: '0 8px' }}>
              {state === 'shown' ? fmt(view.answer) : input || ' '}
            </span>
            <span style={{ color: '#7986CB' }}>{view.unit}</span>
          </div>

          {state === 'right' && (
            <Feedback
              kind="right" title="Верно!" text={view.solution}
              action={<KButton big color="#43A047" onClick={next}>{index + 1 >= game.tasks.length ? 'Готово!' : 'Дальше →'}</KButton>}
            />
          )}
          {state === 'shown' && (
            <Feedback
              kind="wrong" title="Разберём решение" text={view.solution}
              action={<KButton big color="#FB8C00" onClick={next}>{index + 1 >= game.tasks.length ? 'Готово' : 'Дальше →'}</KButton>}
            />
          )}
          {state === 'ask' && tries === 1 && (
            <Feedback kind="wrong" title="Пока не так. Подсказка:" text={view.hint} />
          )}
          {state !== 'ask' && <Composition task={task} />}
        </div>

        {state === 'ask' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {KEYS.map((k) => (
              <button
                key={k}
                onClick={() => press(k)}
                style={{
                  fontFamily: 'inherit', fontSize: 30, fontWeight: 700, height: 72, borderRadius: 16, cursor: 'pointer',
                  border: 'none', background: k === '⌫' ? '#FFE0B2' : 'white', color: '#37474F',
                  boxShadow: '0 4px 0 #CFD8DC',
                }}
              >
                {k}
              </button>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <KButton big color="#3949AB" disabled={!input} onClick={check} style={{ width: '100%' }}>Проверить</KButton>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', fontSize: 16, color: '#90A4AE', fontWeight: 600 }}>
        Задача {index + 1} из {game.tasks.length} · ошибок: {mistakes}
      </div>
    </div>
  )
}

/**
 * Из чего складывается масса: полоса, разделённая по элементам (для Mr и
 * доли) или по веществу и воде (для раствора). Доля сразу видна глазом.
 */
function Composition({ task }: { task: CalcTask }) {
  let parts: Array<{ label: string; value: number; color: string; text: string }>
  if (task.type === 'mr' || task.type === 'fraction') {
    const counts = countsOf(task.formula)
    const total = mrOf(task.formula)
    parts = elementOrder(task.formula).filter((e, i, all) => all.indexOf(e) === i).map((el) => {
      const mass = counts[el] * AR[el]
      return {
        label: el, value: mass,
        // Белый водород на белом фоне не виден — берём серый
        color: el === 'H' ? '#CFD8DC' : atomColor(el),
        text: `${elementOf(el).name}: ${fmt(mass)} из ${fmt(total)} (${fmt(Math.round((mass / total) * 1000) / 10)} %)`,
      }
    })
  } else {
    const solute = task.type === 'w-solution' ? task.mSolute : (task.mSolution * task.percent) / 100
    const water = task.type === 'w-solution' ? task.mWater : task.mSolution - solute
    parts = [
      { label: task.solute, value: solute, color: '#FFB300', text: `${task.solute}: ${fmt(solute)} г` },
      { label: 'вода', value: water, color: '#4FC3F7', text: `вода: ${fmt(water)} г` },
    ]
  }
  const total = parts.reduce((a, p) => a + p.value, 0)
  return (
    <div className="kids-pop" style={{ background: 'white', borderRadius: 20, padding: 16 }}>
      <div style={{ display: 'flex', height: 46, borderRadius: 12, overflow: 'hidden', gap: 2 }}>
        {parts.map((p) => (
          <div key={p.label} style={{
            width: `${(p.value / total) * 100}%`, minWidth: 6, background: p.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#263238', fontWeight: 700, fontSize: 18,
          }}>
            {(p.value / total) > 0.08 ? p.label : ''}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 10, fontSize: 17, color: '#546E7A' }}>
        {parts.map((p) => (
          <span key={p.label}><span style={{ color: p.color, fontSize: 20 }}>■</span> {p.text}</span>
        ))}
      </div>
    </div>
  )
}
