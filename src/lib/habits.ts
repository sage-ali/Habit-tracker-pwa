import { Habit } from '../types/habit'

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = [...habit.completions]
  const index = completions.indexOf(date)

  if (index === -1) {
    completions.push(date)
  } else {
    completions.splice(index, 1)
  }

  // Ensure unique dates and return a new habit object
  return {
    ...habit,
    completions: Array.from(new Set(completions)),
  }
}
