import {
  Progress, LEVELS, levelIndex, solvedCount, starsCount,
  TOTAL_EQUATIONS, TOTAL_STARS, setName, decodeBaseline, setBaseline, toNextLevel,
} from '../game/progress'
import { TOTAL_REAGENTS } from '../reactions'
import { count } from '../plural'
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
  const ahead = toNextLevel(progress)
  const solved = solvedCount(progress)

  return (
    <div style={{
      position: 'fixed', inset: 0, overflowY: 'auto', fontFamily: FONT,
      background: 'linear-gradient(180deg, #F7FAFC 0%, #E8EEF3 100%)',
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: narrow ? '22px 16px 40px' : '46px 28px 60px',
      }}>
        <h1 style={{
          margin: 0, fontSize: narrow ? 24 : 32, fontWeight: 700,
          color: '#1A2A33', letterSpacing: -0.4,
        }}>
          Chem Reactions Desk
        </h1>
        <p style={{
          margin: narrow ? '7px 0 0' : '9px 0 0',
          fontSize: narrow ? 13.5 : 15, color: '#78909C', lineHeight: 1.55,
        }}>
          Виртуальная лаборатория качественного анализа. Смешивайте реагенты в пробирках,
          читайте осадки, газы и окраску пламени — и определяйте вещество по признакам.
        </p>

        {/* Два режима */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: narrow ? 12 : 16, marginTop: narrow ? 18 : 28,
        }}>
          <Card onClick={onSandbox} style={{ padding: narrow ? 18 : 24 }}>
            <div style={{ fontSize: narrow ? 25 : 30, marginBottom: narrow ? 7 : 10 }}>🧪</div>
            <h2 style={{ margin: 0, fontSize: narrow ? 17 : 19, fontWeight: 700, color: '#263238' }}>Песочница</h2>
            <p style={{
              margin: '8px 0 0', fontSize: narrow ? 13 : 13.5,
              color: '#78909C', lineHeight: 1.55,
            }}>
              Свободный стол: {count(TOTAL_REAGENTS, 'реагент', 'реагента', 'реагентов')},
              любое число пробирок и горелок. Уравнение появляется под столом сразу.
              Ни ограничений, ни проверки — место для опытов «а что будет, если».
            </p>
            <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: '#1565C0' }}>
              Открыть стол →
            </div>
          </Card>

          <Card onClick={onTasks} style={{ padding: narrow ? 18 : 24 }}>
            <div style={{ fontSize: narrow ? 25 : 30, marginBottom: narrow ? 7 : 10 }}>🎯</div>
            <h2 style={{ margin: 0, fontSize: narrow ? 17 : 19, fontWeight: 700, color: '#263238' }}>Режим заданий</h2>
            <p style={{
              margin: '8px 0 0', fontSize: narrow ? 13 : 13.5,
              color: '#78909C', lineHeight: 1.55,
            }}>
              {count(TASKS.length, 'задача', 'задачи', 'задач')}: определить вещество,
              добиться признака, различить пару, провести цепочку превращений.
              Реактивы в бюджете, после ответа — разбор с оптимальным ходом.
            </p>
            <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: '#1565C0' }}>
              Выбрать задание →
            </div>
          </Card>

          <Card onClick={onCases} style={{ padding: narrow ? 18 : 24 }}>
            <div style={{ fontSize: narrow ? 25 : 30, marginBottom: narrow ? 7 : 10 }}>🔍</div>
            <h2 style={{ margin: 0, fontSize: narrow ? 17 : 19, fontWeight: 700, color: '#263238' }}>Дела</h2>
            <p style={{
              margin: '8px 0 0', fontSize: narrow ? 13 : 13.5,
              color: '#78909C', lineHeight: 1.55,
            }}>
              {count(CASES.length, 'расследование', 'расследования', 'расследований')} из
              нескольких задач. Каждый шаг открывает улику, а финальный вопрос решается
              только по всем уликам сразу.
            </p>
            <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: '#1565C0' }}>
              Взяться за дело →
            </div>
          </Card>

          <Card onClick={onEge} style={{ padding: narrow ? 18 : 24 }}>
            <div style={{ fontSize: narrow ? 25 : 30, marginBottom: narrow ? 7 : 10 }}>📋</div>
            <h2 style={{ margin: 0, fontSize: narrow ? 17 : 19, fontWeight: 700, color: '#263238' }}>Тренажёр ЕГЭ</h2>
            <p style={{
              margin: '8px 0 0', fontSize: narrow ? 13 : 13.5,
              color: '#78909C', lineHeight: 1.55,
            }}>
              Задания 6, 7, 8, 9, 29 и 30 в формате экзамена. Условия собираются из базы
              реакций при каждом показе, поэтому не кончаются и не заучиваются.
            </p>
            <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: '#1565C0' }}>
              Начать тренировку →
            </div>
          </Card>
        </div>

        {/* Прогресс */}
        <Card style={{ marginTop: narrow ? 12 : 16, padding: narrow ? 17 : 22 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.7, color: '#90A4AE' }}>
              УРОВЕНЬ ДОПУСКА
            </span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#263238' }}>{level.title}</span>
            <span style={{ fontSize: 12.5, color: '#90A4AE' }}>открыто: {level.unlocks}</span>
          </div>

          {ahead ? (
            <p style={{ margin: '10px 0 0', fontSize: 12.5, color: '#78909C', lineHeight: 1.5 }}>
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
            fontSize: 11, fontWeight: 700, letterSpacing: 0.7, color: '#90A4AE', marginBottom: 12,
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
          <p style={{ margin: '7px 0 0', fontSize: 12, color: '#B0BEC5', lineHeight: 1.5 }}>
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
          cursor: 'pointer', marginTop: 14,
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
