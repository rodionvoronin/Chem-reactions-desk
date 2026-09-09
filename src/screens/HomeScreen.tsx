import {
  Progress, LEVELS, levelIndex, solvedCount, starsCount,
  TOTAL_EQUATIONS, TOTAL_STARS, setName, decodeBaseline, setBaseline,
} from '../game/progress'
import { TASKS } from '../game/bank'
import { CASES } from '../game/cases'
import { useState } from 'react'
import { Card, Button, FONT, ProgressBar } from './ui'
import { useIsNarrow } from '../useViewport'

interface Props {
  progress: Progress
  onSandbox: () => void
  onTasks: () => void
  onCases: () => void
  onEge: () => void
  onJournal: () => void
  onTeacher: () => void
}

export function HomeScreen({
  progress, onSandbox, onTasks, onCases, onEge, onJournal, onTeacher,
}: Props) {
  const narrow = useIsNarrow()
  const lvl = levelIndex(progress)
  const level = LEVELS[lvl]
  const next = LEVELS[lvl + 1]
  const solved = solvedCount(progress)

  return (
    <div style={{
      position: 'fixed', inset: 0, overflowY: 'auto', fontFamily: FONT,
      background: 'linear-gradient(180deg, #F7FAFC 0%, #E8EEF3 100%)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '46px 28px 60px' }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#1A2A33', letterSpacing: -0.4 }}>
          Chem Reactions Desk
        </h1>
        <p style={{ margin: '9px 0 0', fontSize: 15, color: '#78909C', lineHeight: 1.55 }}>
          Виртуальная лаборатория качественного анализа: {TOTAL_EQUATIONS} реакций,
          осадки, газы и окрашивание пламени.
        </p>

        {/* Два режима */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16, marginTop: 28,
        }}>
          <Card onClick={onSandbox} style={{ padding: 24 }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>🧪</div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#263238' }}>Песочница</h2>
            <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#78909C', lineHeight: 1.55 }}>
              Свободный стол: все реагенты, любое число пробирок и горелок,
              уравнение реакции сразу под столом. Без ограничений и без проверки.
            </p>
            <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: '#1565C0' }}>
              Открыть стол →
            </div>
          </Card>

          <Card onClick={onTasks} style={{ padding: 24 }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>🎯</div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#263238' }}>Режим заданий</h2>
            <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#78909C', lineHeight: 1.55 }}>
              {TASKS.length} задач на определение вещества по признакам. Палитра ограничена,
              реактивы в бюджете, после ответа — разбор с оптимальным ходом.
            </p>
            <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: '#1565C0' }}>
              Выбрать задание →
            </div>
          </Card>

          <Card onClick={onCases} style={{ padding: 24 }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>🔍</div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#263238' }}>Дела</h2>
            <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#78909C', lineHeight: 1.55 }}>
              {CASES.length} расследования из нескольких задач. Каждый шаг открывает улику,
              а финальный вопрос решается только по всем уликам сразу.
            </p>
            <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: '#1565C0' }}>
              Взяться за дело →
            </div>
          </Card>

          <Card onClick={onEge} style={{ padding: 24 }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>📋</div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#263238' }}>Тренажёр ЕГЭ</h2>
            <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#78909C', lineHeight: 1.55 }}>
              Задания 6, 7, 8, 9, 29 и 30 в формате экзамена. Условия собираются из той же
              базы реакций, поэтому не кончаются; после ответа — уравнение с разбором.
            </p>
            <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: '#1565C0' }}>
              Начать тренировку →
            </div>
          </Card>
        </div>

        {/* Прогресс */}
        <Card style={{ marginTop: 16, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.7, color: '#90A4AE' }}>
              УРОВЕНЬ ДОПУСКА
            </span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#263238' }}>{level.title}</span>
            <span style={{ fontSize: 12.5, color: '#90A4AE' }}>открыто: {level.unlocks}</span>
          </div>

          {next && (
            <p style={{ margin: '10px 0 0', fontSize: 12.5, color: '#78909C', lineHeight: 1.5 }}>
              До уровня «{next.title}» — решить задач: {Math.max(0, next.needSolved - solved)},
              записей в журнале: {Math.max(0, next.needJournal - progress.journal.length)}.
            </p>
          )}

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: 18, marginTop: 18,
          }}>
            <Metric
              label="ЛАБОРАТОРНЫЙ ЖУРНАЛ"
              value={`${progress.journal.length} / ${TOTAL_EQUATIONS}`}
              bar={{ value: progress.journal.length, max: TOTAL_EQUATIONS, color: '#42A5F5' }}
              onClick={onJournal}
            />
            <Metric
              label="ЗВЁЗДЫ ЗА ЗАДАЧИ"
              value={`${starsCount(progress)} / ${TOTAL_STARS}`}
              bar={{ value: starsCount(progress), max: TOTAL_STARS, color: '#FFB300' }}
            />
            <Metric
              label="РЕШЕНО ЗАДАЧ"
              value={`${solved} / ${TASKS.length}`}
              bar={{ value: solved, max: TASKS.length, color: '#66BB6A' }}
            />
          </div>
        </Card>

        {/* Имя и экран преподавателя */}
        <div style={{
          display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginTop: 18,
        }}>
          <label style={{ fontSize: 12.5, color: '#78909C', display: 'flex', alignItems: 'center', gap: 9 }}>
            Имя для отчёта:
            <input
              value={progress.name}
              placeholder="Фамилия и класс"
              onChange={(e) => setName(e.target.value)}
              style={{
                border: '1.5px solid #E0E0E0', borderRadius: 8, padding: '8px 11px',
                fontFamily: FONT, fontSize: 13, color: '#37474F', width: 200, outline: 'none',
              }}
            />
          </label>
          <button
            onClick={onTeacher}
            style={{
              border: 'none', background: 'none', padding: narrow ? '12px 10px' : 0,
              cursor: 'pointer',
              fontFamily: FONT, fontSize: 12.5, fontWeight: 600, color: '#1565C0',
              marginLeft: narrow ? -10 : undefined,
              minHeight: narrow ? 44 : undefined,
            }}
          >
            Экран преподавателя →
          </button>
        </div>

        <ClassCodeInput progress={progress} narrow={narrow} />

        <p style={{ margin: '22px 0 0', fontSize: 11.5, color: '#B0BEC5', lineHeight: 1.6 }}>
          Прогресс хранится в этом браузере. Песочница доступна полностью с первой минуты —
          уровни допуска открывают только новые задания.
        </p>
      </div>
    </div>
  )
}

function Metric({ label, value, bar, onClick }: {
  label: string
  value: string
  bar: { value: number; max: number; color: string }
  onClick?: () => void
}) {
  return (
    <div onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, color: '#B0BEC5' }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#37474F', margin: '5px 0 8px' }}>
        {value}
      </div>
      <ProgressBar value={bar.value} max={bar.max} color={bar.color} />
    </div>
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
          cursor: 'pointer', marginTop: 12,
          fontFamily: FONT, fontSize: 12.5, fontWeight: 600, color: '#78909C',
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
      <label style={{ fontSize: 12.5, color: '#78909C' }}>
        Код класса от преподавателя
        <textarea
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
        <p style={{ margin: '7px 0 0', fontSize: 12, color: '#E64A19' }}>
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
