import { useMemo, useState, ReactNode, CSSProperties } from 'react'
import { Progress, encodeResults, decodeResults } from '../game/progress'
import { TASK_MAP } from '../game/bank'
import { optimalSteps } from '../game/engine'
import { Screen, Card, Button, FONT } from './ui'

interface Props {
  progress: Progress
  onBack: () => void
}

interface StudentSummary {
  name: string
  journal: number
  solved: number
  stars: number
  hints: number
  minutes: number
  /** Фактические шаги ÷ оптимальные — главный показатель роста */
  redundancy: number
  firstTry: number
  total: number
}

/**
 * Экран преподавателя без бэкенда и аккаунтов: ученик показывает код
 * результата, преподаватель вставляет коды и получает сводную таблицу.
 * Этого достаточно, чтобы провести пилот с замером.
 */
export function TeacherScreen({ progress, onBack }: Props) {
  const [codes, setCodes] = useState('')
  const [copied, setCopied] = useState(false)

  const myCode = useMemo(() => encodeResults(progress), [progress])

  const { students, bad } = useMemo(() => {
    const students: StudentSummary[] = []
    let bad = 0
    for (const line of codes.split('\n').map((s) => s.trim()).filter(Boolean)) {
      const decoded = decodeResults(line)
      if (!decoded) { bad++; continue }
      const rows = decoded.rows
      const solvedRows = rows.filter((r) => r.stars > 0)
      const redundancies = solvedRows.map((r) => {
        const task = TASK_MAP[r.taskId]
        const optimal = task ? Math.max(1, optimalSteps(task)) : 1
        return r.spent / optimal
      })
      students.push({
        name: decoded.name || '(без имени)',
        journal: decoded.journal,
        solved: solvedRows.length,
        total: rows.length,
        stars: rows.reduce((s, r) => s + r.stars, 0),
        hints: rows.reduce((s, r) => s + r.hints, 0),
        minutes: Math.round(rows.reduce((s, r) => s + r.seconds, 0) / 60),
        redundancy: redundancies.length
          ? redundancies.reduce((a, b) => a + b, 0) / redundancies.length
          : 0,
        firstTry: rows.filter((r) => r.stars > 0 && r.attempts === 1).length,
      })
    }
    return { students, bad }
  }, [codes])

  return (
    <Screen
      title="Экран преподавателя"
      subtitle="Аккаунтов и сервера нет: ученик показывает код результата, вы вставляете коды сюда."
      onBack={onBack}
    >
      <Card style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: '#37474F' }}>
          Мой код результата
        </h2>
        <p style={{ margin: '7px 0 11px', fontSize: 13, color: '#78909C', lineHeight: 1.5 }}>
          Ученик копирует эту строку и передаёт преподавателю — в ней имя, число записей
          в журнале и результат по каждой задаче.
        </p>
        <textarea
          readOnly
          value={myCode}
          onFocus={(e) => e.currentTarget.select()}
          style={{
            width: '100%', height: 74, resize: 'vertical',
            border: '1.5px solid #E0E0E0', borderRadius: 9, padding: '10px 12px',
            fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: 11.5,
            color: '#546E7A', outline: 'none', wordBreak: 'break-all',
          }}
        />
        <div style={{ marginTop: 10 }}>
          <Button
            kind="primary"
            onClick={() => {
              navigator.clipboard?.writeText(myCode).then(
                () => { setCopied(true); setTimeout(() => setCopied(false), 1800) },
                () => setCopied(false),
              )
            }}
          >
            {copied ? 'Скопировано' : 'Скопировать код'}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: '#37474F' }}>
          Сводка по классу
        </h2>
        <p style={{ margin: '7px 0 11px', fontSize: 13, color: '#78909C', lineHeight: 1.5 }}>
          Вставьте коды учеников — по одному в строке.
        </p>
        <textarea
          value={codes}
          onChange={(e) => setCodes(e.target.value)}
          placeholder={'CRD1-…\nCRD1-…'}
          style={{
            width: '100%', height: 96, resize: 'vertical',
            border: '1.5px solid #E0E0E0', borderRadius: 9, padding: '10px 12px',
            fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: 11.5,
            color: '#546E7A', outline: 'none',
          }}
        />
        {bad > 0 && (
          <p style={{ margin: '9px 0 0', fontSize: 12.5, color: '#E64A19' }}>
            Не удалось разобрать строк: {bad}. Код должен начинаться с CRD1-.
          </p>
        )}

        {students.length > 0 && (
          <div style={{ overflowX: 'auto', marginTop: 16 }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse', fontFamily: FONT, fontSize: 13,
            }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#90A4AE', fontSize: 11, letterSpacing: 0.4 }}>
                  <Th>УЧЕНИК</Th>
                  <Th>РЕШЕНО</Th>
                  <Th>ЗВЁЗДЫ</Th>
                  <Th>С ПЕРВОЙ ПОПЫТКИ</Th>
                  <Th>ИЗБЫТОЧНОСТЬ</Th>
                  <Th>ПОДСКАЗКИ</Th>
                  <Th>ЖУРНАЛ</Th>
                  <Th>ВРЕМЯ</Th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #ECEFF1', color: '#455A64' }}>
                    <Td><b style={{ color: '#263238' }}>{s.name}</b></Td>
                    <Td>{s.solved} / {s.total}</Td>
                    <Td>{s.stars}</Td>
                    <Td>{s.firstTry}</Td>
                    <Td style={{ color: s.redundancy > 2 ? '#E64A19' : '#2E7D32', fontWeight: 600 }}>
                      {s.redundancy ? `×${s.redundancy.toFixed(2)}` : '—'}
                    </Td>
                    <Td>{s.hints}</Td>
                    <Td>{s.journal}</Td>
                    <Td>{s.minutes} мин</Td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: '13px 0 0', fontSize: 11.5, color: '#B0BEC5', lineHeight: 1.6 }}>
              Избыточность — фактические приливания, делённые на оптимальные. Значение около ×1
              означает, что ученик идёт по схеме анализа, а не перебирает реагенты; снижение
              этого числа от занятия к занятию и есть измеримый рост.
            </p>
          </div>
        )}
      </Card>
    </Screen>
  )
}

function Th({ children }: { children: ReactNode }) {
  return <th style={{ padding: '7px 10px', fontWeight: 700, whiteSpace: 'nowrap' }}>{children}</th>
}

function Td({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <td style={{ padding: '9px 10px', whiteSpace: 'nowrap', ...style }}>{children}</td>
}
