import {
  Progress, LEVELS, levelIndex, solvedCount, starsCount,
  TOTAL_EQUATIONS, TOTAL_STARS, setName, decodeBaseline, setBaseline, toNextLevel,
} from '../game/progress'
import { TOTAL_REAGENTS } from '../reactions'
import { count } from '../plural'
import { TASKS } from '../game/bank'
import { LESSONS } from '../kids/content'
import { CASES } from '../game/cases'
import './home.css'
import { useState } from 'react'
import { Card, Button, FONT, ProgressBar } from './ui'
import { useIsNarrow } from '../useViewport'

interface Props {
  progress: Progress
  onKids: () => void
  onSandbox: () => void
  onTasks: () => void
  onCases: () => void
  onEge: () => void
  onJournal: () => void
  onTeacher: () => void
}

export function HomeScreen({
  progress, onKids, onSandbox, onTasks, onCases, onEge, onJournal, onTeacher,
}: Props) {
  const narrow = useIsNarrow()
  const lvl = levelIndex(progress)
  const level = LEVELS[lvl]
  const ahead = toNextLevel(progress)
  const solved = solvedCount(progress)

  const modes = [
    { name: 'Режим заданий', detail: count(TASKS.length, 'задача', 'задачи', 'задач') + ' с разбором решения', open: onTasks, symbol: 'tasks' },
    { name: 'Дела', detail: count(CASES.length, 'химическое расследование', 'химических расследования', 'химических расследований'), open: onCases, symbol: 'cases' },
    { name: 'Тренажёр ЕГЭ', detail: 'Задания 6–9, 29 и 30', open: onEge, symbol: 'exam' },
    { name: 'Юный химик', detail: count(LESSONS.length, 'урок', 'урока', 'уроков') + ' для 6–7 классов и интерактивной доски', open: onKids, symbol: 'kids' },
  ] as const

  return (
    <main className="desk-home">
      <div className="desk-wrap">
        <header className="desk-header">
          <span className="desk-brand"><Glyph kind="flask" /> Chem Reactions Desk</span>
          <button onClick={onJournal}><Glyph kind="journal" /> Журнал</button>
        </header>
        <h1>Виртуальная лаборатория</h1>
        <p className="desk-intro">Определяйте вещества по осадку, выделению газа и окраске пламени.</p>
        <div className="desk-start">
          <section className="desk-bench">
            <Glassware />
            <div className="bench-copy">
              <h2>Песочница</h2>
              <p>На столе {count(TOTAL_REAGENTS, 'реагент', 'реагента', 'реагентов')}. Смешивайте вещества и наблюдайте, как меняется содержимое пробирки.</p>
              <button onClick={onSandbox}>Открыть стол <span aria-hidden="true">→</span></button>
            </div>
          </section>
          <section className="desk-modes">
            <h2>Учебные режимы</h2>
            {modes.map(mode => (
              <button key={mode.symbol} onClick={mode.open}>
                <span className={'mode-symbol ' + mode.symbol}><Glyph kind={mode.symbol} /></span>
                <span><strong>{mode.name}</strong><small>{mode.detail}</small></span>
                <span className="mode-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </section>
        </div>
        {/* Прогресс */}
        <Card style={{ marginTop: narrow ? 12 : 16, padding: narrow ? 17 : 22 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.7, color: '#536973' }}>
              УРОВЕНЬ ДОПУСКА
            </span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#263238' }}>{level.title}</span>
            <span style={{ fontSize: 12.5, color: '#536973' }}>открыто: {level.unlocks}</span>
          </div>

          {ahead ? (
            <p style={{ margin: '10px 0 0', fontSize: 12.5, color: '#536973', lineHeight: 1.5 }}>
              До уровня «{ahead.level.title}» осталось{' '}
              <b>решить ещё {count(Math.max(0, ahead.needSolved - ahead.solved), 'задачу', 'задачи', 'задач')}</b>
              {' и '}
              <b>открыть ещё {count(Math.max(0, ahead.needJournal - ahead.journal), 'уравнение', 'уравнения', 'уравнений')}</b>.
            </p>
          ) : (
            <p style={{ margin: '10px 0 0', fontSize: 12.5, color: '#2E7D32', lineHeight: 1.5 }}>
              Открыт весь банк заданий — выше уровня нет.
            </p>
          )}

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: 18, marginTop: 18,
          }}>
            <Metric
              label="РЕШЕНО ЗАДАЧ"
              value={`${solved} / ${TASKS.length}`}
              bar={{ value: solved, max: TASKS.length, color: '#66BB6A' }}
              onClick={onTasks}
            />
            <Metric
              label="ЖУРНАЛ: ОТКРЫТО УРАВНЕНИЙ"
              value={`${progress.journal.length} / ${TOTAL_EQUATIONS}`}
              bar={{ value: progress.journal.length, max: TOTAL_EQUATIONS, color: '#42A5F5' }}
              onClick={onJournal}
            />
            <Metric
              label="ЗВЁЗДЫ ЗА ЗАДАЧИ"
              value={`${starsCount(progress)} / ${TOTAL_STARS}`}
              bar={{ value: starsCount(progress), max: TOTAL_STARS, color: '#FFB300' }}
            />
          </div>
        </Card>

        {/* Всё, что нужно для занятия в классе, — в одном месте.
            Раньше имя, код класса и ссылка на преподавателя стояли тремя
            несвязанными строками, и код класса выглядел случайной ссылкой. */}
        <Card style={{ marginTop: narrow ? 12 : 16, padding: narrow ? 17 : 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 0.7, color: '#536973', marginBottom: 12,
          }}>
            ДЛЯ ЗАНЯТИЯ В КЛАССЕ
          </div>

          <label style={{
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            fontSize: 13, color: '#546E7A',
          }}>
            Имя для отчёта
            <input
              value={progress.name}
              placeholder="Фамилия и класс"
              onChange={(e) => setName(e.target.value)}
              style={{
                border: '1.5px solid #E0E0E0', borderRadius: 8, padding: '9px 12px',
                fontFamily: FONT, fontSize: 13.5, color: '#37474F',
                width: narrow ? '100%' : 230, outline: 'none',
              }}
            />
          </label>
          <p style={{ margin: '7px 0 0', fontSize: 12, color: '#536973', lineHeight: 1.5 }}>
            Понадобится, когда преподаватель попросит код результата.
          </p>

          <ClassCodeInput progress={progress} narrow={narrow} />

          <div style={{ borderTop: '1px solid #F0F3F5', margin: '16px 0 0', paddingTop: 12 }}>
            <button
              onClick={onTeacher}
              style={{
                border: 'none', background: 'none', cursor: 'pointer',
                padding: narrow ? '12px 10px' : 0,
                fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#1565C0',
                marginLeft: narrow ? -10 : undefined,
                minHeight: narrow ? 44 : undefined,
              }}
            >
              Экран преподавателя →
            </button>
          </div>
        </Card>

        <p style={{ margin: '22px 0 0', fontSize: 11.5, color: '#536973', lineHeight: 1.6 }}>
          Прогресс хранится в этом браузере. Песочница доступна полностью с первой минуты —
          уровни допуска открывают только новые задания.
        </p>
      </div>
    </main>
  )
}

function Metric({ label, value, bar, onClick }: {
  label: string
  value: string
  bar: { value: number; max: number; color: string }
  onClick?: () => void
}) {
  const Element = onClick ? 'button' : 'div'
  return (
    <Element className="desk-metric" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, color: '#536973' }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#37474F', margin: '5px 0 8px' }}>
        {value}
      </div>
      <ProgressBar value={bar.value} max={bar.max} color={bar.color} />
    </Element>
  )
}

/**
 * Ученик вставляет код класса, выданный преподавателем, и в разборе задач
 * появляется сравнение с одноклассниками. Без кода приложение сравнивает
 * ученика только с ним самим: чужих результатов оно не выдумывает.
 */
function ClassCodeInput({ progress, narrow }: { progress: Progress; narrow: boolean }) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const tasksWithClass = Object.keys(progress.baseline ?? {}).length

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          border: 'none', background: 'none', padding: narrow ? '12px 10px' : 0,
          cursor: 'pointer', marginTop: 14,
          fontFamily: FONT, fontSize: 12.5, fontWeight: 600, color: '#536973',
          marginLeft: narrow ? -10 : undefined,
          minHeight: narrow ? 44 : undefined,
        }}
      >
        {tasksWithClass > 0
          ? `Ориентир класса подключён: задач ${tasksWithClass} — изменить`
          : 'Ввести код класса от преподавателя'}
      </button>
    )
  }

  return (
    <div style={{ marginTop: 14, maxWidth: 520 }}>
      <label style={{ fontSize: 12.5, color: '#536973' }}>
        Код класса от преподавателя
        <textarea
          autoFocus
          aria-invalid={error}
          aria-describedby={error ? 'class-code-error' : undefined}
          value={code}
          placeholder="CRB1-…"
          onChange={(e) => { setCode(e.target.value); setError(false) }}
          style={{
            display: 'block', width: '100%', height: 62, resize: 'vertical', marginTop: 6,
            border: `1.5px solid ${error ? '#EF9A9A' : '#E0E0E0'}`, borderRadius: 9,
            padding: '10px 12px', fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
            fontSize: 11.5, color: '#546E7A', outline: 'none',
          }}
        />
      </label>
      {error && (
        <p id="class-code-error" role="alert" style={{ margin: '7px 0 0', fontSize: 12, color: '#A33117' }}>
          Не похоже на код класса. Он начинается с CRB1-.
        </p>
      )}
      <div style={{ display: 'flex', gap: 9, marginTop: 10, flexWrap: 'wrap' }}>
        <Button
          kind="primary"
          onClick={() => {
            const parsed = decodeBaseline(code)
            if (!parsed) { setError(true); return }
            setBaseline(parsed)
            setOpen(false)
            setCode('')
          }}
        >
          Подключить
        </Button>
        {tasksWithClass > 0 && (
          <Button onClick={() => { setBaseline(undefined); setOpen(false); setCode('') }}>
            Отключить
          </Button>
        )}
        <Button onClick={() => { setOpen(false); setError(false) }}>Отмена</Button>
      </div>
    </div>
  )
}

const glyphPaths = {
  flask: 'M9 3h6m-5 0v6L4 19q-.5 2 2 2h12q2.5 0 2-2L14 9V3M7 15h10',
  journal: 'M5 3h14v18H6q-2 0-2-2V5q0-2 2-2m2 0v18m3-13h5m-5 4h4',
  tasks: 'M8 5H5v16h14V5h-3M9 3h6v4H9zM8 13l3 3 5-6',
  cases: 'M16 16l5 5M18 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
  exam: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7m-7 4h5',
  kids: 'M12 7Q7 3 2 5v13q5-2 10 2 5-4 10-2V5q-5-2-10 2v13',
}
function Glyph({ kind }: { kind: keyof typeof glyphPaths }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={glyphPaths[kind]} /></svg>
}

function Glassware() {
  return (
    <svg className="bench-drawing" aria-hidden="true" viewBox="0 0 400 156" fill="none">
      <g stroke="#71a8ab" strokeWidth="1">
        <path d="M20 140h360M26 133v7m16-4v4m16-4v4m16-4v4m16-7v7m16-4v4m16-4v4m16-4v4m16-7v7m16-4v4m16-4v4m16-4v4m16-7v7m16-4v4m16-4v4m16-4v4m16-7v7m16-4v4m16-4v4m16-4v4m16-7v7m16-4v4m16-4v4"/>
      </g>
      <g stroke="#c8ede6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M67 24h28v5h-4v37l29 51q3 7-5 7H47q-8 0-5-7l29-51V29h-4z"/>
        <path fill="#74d9c3" stroke="none" d="M59 92q12-5 24 0t19 0l15 27q1 2-3 2H48q-4 0-2-3z"/>
        <path d="M144 60h70l-5 9v51q0 4-5 4h-50q-5 0-5-4V68z"/>
        <path fill="#e9b771" stroke="none" d="M152 88q15-4 28 0t26 0v32q0 1-3 1h-48q-3 0-3-2z"/>
        <path d="M191 72h11m-7 9h7m-11 10h11m-7 9h7"/>
        {[250,278,306].map((x,i) => <g key={x}>
          <path d={`M${x-2} 34h20m-18 0v73a8 8 0 0 0 16 0V34`}/>
          <path d={`M${x+8} ${[69,80,62][i]}v${[38,27,45][i]}`} stroke={['#74d9c3','#e9b771','#a7b9ed'][i]} strokeWidth="10"/>
        </g>)}
        <path d="M237 57h98m-93 1v65m88-65v65m-95 0h102" stroke="#89b3b5"/>
      </g>
    </svg>
  )
}
