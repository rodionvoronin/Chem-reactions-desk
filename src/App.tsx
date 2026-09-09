import { useState, useSyncExternalStore, useCallback } from 'react'
import { Lab } from './Lab'
import { HomeScreen } from './screens/HomeScreen'
import { TaskMapScreen } from './screens/TaskMapScreen'
import { JournalScreen } from './screens/JournalScreen'
import { TeacherScreen } from './screens/TeacherScreen'
import { EgeScreen } from './screens/EgeScreen'
import { CasesScreen } from './screens/CasesScreen'
import { getProgress, subscribe, maxDifficulty } from './game/progress'
import { Session, startSession } from './game/session'
import { tasksOfTopic, TASK_MAP } from './game/bank'
import { CASE_MAP } from './game/cases'
import { Task } from './game/types'

type Screen = 'home' | 'sandbox' | 'tasks' | 'task' | 'cases' | 'ege' | 'journal' | 'teacher'

/**
 * Роутер приложения. Песочница — это Lab без сессии: тот же стол, те же палитры,
 * что и раньше. Режим заданий надстраивается сверху и включается отдельно,
 * ничего в песочнице не отключая.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [session, setSession] = useState<Session | null>(null)
  /** Дело, из которого запущена задача: по нему решаем, куда возвращаться */
  const [caseId, setCaseId] = useState<string | null>(null)
  const progress = useSyncExternalStore(subscribe, getProgress)

  const openTask = useCallback((task: Task, fromCase: string | null = null) => {
    setSession(startSession(task))
    setCaseId(fromCase)
    setScreen('task')
  }, [])

  /**
   * Что предложить после разбора. В деле это следующий его шаг: расследование
   * ведут по порядку, и уводить ученика в другую тему посреди дела нельзя.
   */
  const nextCaseStep = caseId && session
    ? CASE_MAP[caseId]?.steps
        .map((s) => TASK_MAP[s.taskId])
        .find((t) => t && t.id !== session.task.id && (progress.results[t.id]?.stars ?? 0) === 0) ?? null
    : null

  const nextTask = nextCaseStep ?? (session
    ? tasksOfTopic(session.task.topic).find((t) => (
        t.id !== session.task.id
        && t.difficulty <= maxDifficulty(progress)
        && (progress.results[t.id]?.stars ?? 0) === 0
      )) ?? null
    : null)

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
          onExit={() => { setSession(null); setScreen(caseId ? 'cases' : 'tasks') }}
          onRetry={() => setSession(startSession(session.task, session.attempt + 1))}
          onNext={() => { if (nextTask) openTask(nextTask, caseId) }}
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

    case 'cases':
      return (
        <CasesScreen
          progress={progress}
          initialCaseId={caseId}
          onBack={() => { setCaseId(null); setScreen('home') }}
          onStartStep={(task, id) => openTask(task, id)}
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
          onCases={() => { setCaseId(null); setScreen('cases') }}
          onEge={() => setScreen('ege')}
          onJournal={() => setScreen('journal')}
          onTeacher={() => setScreen('teacher')}
        />
      )
  }
}
