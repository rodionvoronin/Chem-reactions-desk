import { useMemo } from 'react'
import { CountGame as Game } from '../types'
import { QuizGame } from './QuizGame'
import { countQuestion } from '../generate'

/** «Индексы и коэффициенты»: вопросы и варианты считаются из самих записей */
export function CountGame({ game, onFinish }: { game: Game; onFinish: (stars: number) => void }) {
  const questions = useMemo(() => game.items.map(countQuestion), [game])
  return <QuizGame game={{ kind: 'quiz', questions }} onFinish={onFinish} />
}
