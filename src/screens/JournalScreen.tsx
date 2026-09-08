import { useMemo, useState } from 'react'
import { Progress, TOTAL_EQUATIONS } from '../game/progress'
import { Screen, Card, ProgressBar, FONT } from './ui'

interface Props {
  progress: Progress
  onBack: () => void
}

/**
 * Лабораторный журнал: каждое впервые увиденное уравнение попадает сюда —
 * и из песочницы, и из заданий. Коллекция здесь не надстройка: журнал
 * наблюдений химик ведёт и в жизни, а перед экзаменом читает его как справочник.
 */
export function JournalScreen({ progress, onBack }: Props) {
  const [query, setQuery] = useState('')

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = [...progress.journal].reverse()
    return q ? list.filter((e) => e.toLowerCase().includes(q)) : list
  }, [progress.journal, query])

  return (
    <Screen
      title="Лабораторный журнал"
      subtitle={`Записано ${progress.journal.length} уравнений из ${TOTAL_EQUATIONS}. `
              + 'Запись появляется, как только реакция прошла у вас на столе.'}
      onBack={onBack}
      actions={
        <input
          value={query}
          placeholder="Поиск по формуле…"
          onChange={(e) => setQuery(e.target.value)}
          style={{
            border: '1.5px solid #E0E0E0', borderRadius: 9, padding: '10px 13px',
            fontFamily: FONT, fontSize: 13, color: '#37474F', width: 240, outline: 'none',
          }}
        />
      }
    >
      <Card style={{ padding: 18, marginBottom: 18 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', fontSize: 12.5,
          color: '#78909C', marginBottom: 9,
        }}>
          <span>Прогресс коллекции</span>
          <b style={{ color: '#37474F' }}>
            {progress.journal.length} / {TOTAL_EQUATIONS}
          </b>
        </div>
        <ProgressBar value={progress.journal.length} max={TOTAL_EQUATIONS} color="#42A5F5" />
      </Card>

      {shown.length === 0 ? (
        <Card style={{ padding: 26, textAlign: 'center', color: '#B0BEC5', fontSize: 14 }}>
          {progress.journal.length === 0
            ? 'Журнал пуст. Проведите первую реакцию в песочнице или в задании.'
            : 'По этому запросу записей нет.'}
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {shown.map((equation, i) => (
            <div
              key={equation}
              style={{
                background: 'white', border: '1px solid #ECEFF1', borderLeft: '4px solid #66BB6A',
                borderRadius: 9, padding: '12px 16px', display: 'flex', gap: 13,
                alignItems: 'baseline', fontSize: 14.5, color: '#1B5E20',
                fontWeight: 600, lineHeight: 1.45,
              }}
            >
              <span style={{ fontSize: 11, color: '#B0BEC5', fontWeight: 700, minWidth: 32 }}>
                №{shown.length - i}
              </span>
              {equation}
            </div>
          ))}
        </div>
      )}
    </Screen>
  )
}
