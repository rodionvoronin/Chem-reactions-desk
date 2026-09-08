import { useState, useSyncExternalStore, useCallback } from 'react'
import { Lab } from './Lab'
import { HomeScreen } from './screens/HomeScreen'
import { TaskMapScreen } from './screens/TaskMapScreen'
import { JournalScreen } from './screens/JournalScreen'
import { TeacherScreen } from './screens/TeacherScreen'
import { EgeScreen } from './screens/EgeScreen'
import { getProgress, subscribe, maxDifficulty } from './game/progress'
import { Session, startSession } from './game/session'
import { tasksOfTopic } from './game/bank'
import { Task } from './game/types'

type Screen = 'home' | 'sandbox' | 'tasks' | 'task' | 'ege' | 'journal' | 'teacher'

/**
 * Роутер приложения. Песочница — это Lab без сессии: тот же стол, те же палитры,
 * что и раньше. Режим заданий надстраивается сверху и включается отдельно,
 * ничего в песочнице не отключая.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [session, setSession] = useState<Session | null>(null)
  const progress = useSyncExternalStore(subscribe, getProgress)

  const openTask = useCallback((task: Task) => {
    setSession(startSession(task))
    setScreen('task')
  }, [])

  /** Следующая доступная задача той же темы — чтобы не возвращаться к списку. */
  const nextTask = session
    ? tasksOfTopic(session.task.topic).find((t) => (
        t.id !== session.task.id
        && t.difficulty <= maxDifficulty(progress)
        && (progress.results[t.id]?.stars ?? 0) === 0
      )) ?? null
    : null

  switch (screen) {
    case 'sandbox':
      return (
        <Lab
          session={null}
          onExit={() => setScreen('home')}
          onRetry={() => {}}
          onNext={() => {}}
          hasNext={false}
        />
      )

    case 'task':
      if (!session) return <TaskMapScreen progress={progress} onBack={() => setScreen('home')} onStart={openTask} />
      return (
        <Lab
          session={session}
          onExit={() => { setSession(null); setScreen('tasks') }}
          onRetry={() => setSession(startSession(session.task, session.attempt + 1))}
          onNext={() => { if (nextTask) openTask(nextTask) }}
          hasNext={nextTask !== null}
        />
      )

    case 'tasks':
      return (
        <TaskMapScreen
          progress={progress}
          onBack={() => setScreen('home')}
          onStart={openTask}
        />
      )

    case 'ege':
      return <EgeScreen onBack={() => setScreen('home')} />

    case 'journal':
      return <JournalScreen progress={progress} onBack={() => setScreen('home')} />

    case 'teacher':
      return <TeacherScreen progress={progress} onBack={() => setScreen('home')} />

    default:
      return (
        <HomeScreen
          progress={progress}
          onSandbox={() => setScreen('sandbox')}
          onTasks={() => setScreen('tasks')}
          onEge={() => setScreen('ege')}
          onJournal={() => setScreen('journal')}
          onTeacher={() => setScreen('teacher')}
        />
      )
  }
}
