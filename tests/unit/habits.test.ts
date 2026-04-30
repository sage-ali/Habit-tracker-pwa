import { describe, it, expect } from 'vitest'
import { toggleHabitCompletion } from '../../src/lib/habits'
import { Habit } from '../../src/types/habit'

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    userId: 'user1',
    name: 'Test Habit',
    description: 'Test Description',
    frequency: 'daily',
    createdAt: '2026-04-25T00:00:00.000Z',
    completions: ['2026-04-24'],
  }

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2026-04-25')
    expect(result.completions).toContain('2026-04-25')
    expect(result.completions).toContain('2026-04-24')
    expect(result.completions.length).toBe(2)
  })

  it('removes a completion date when the date already exists', () => {
    const result = toggleHabitCompletion(mockHabit, '2026-04-24')
    expect(result.completions).not.toContain('2026-04-24')
    expect(result.completions.length).toBe(0)
  })

  it('does not mutate the original habit object', () => {
    const originalCompletions = [...mockHabit.completions]
    toggleHabitCompletion(mockHabit, '2026-04-25')
    expect(mockHabit.completions).toEqual(originalCompletions)
  })

  it('does not return duplicate completion dates', () => {
    const habitWithDuplicate = {
      ...mockHabit,
      completions: ['2026-04-25', '2026-04-25'],
    }
    const result = toggleHabitCompletion(habitWithDuplicate, '2026-04-24')
    expect(new Set(result.completions).size).toBe(result.completions.length)
  })
})
