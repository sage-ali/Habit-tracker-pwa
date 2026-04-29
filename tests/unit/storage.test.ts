import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from '../../src/lib/storage'
import { User, Session } from '../../src/types/auth'
import { Habit } from '../../src/types/habit'

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  password: 'password123',
  createdAt: '2026-04-30T00:00:00.000Z',
}

const mockSession: Session = {
  userId: 'user-1',
  email: 'test@example.com',
}

const mockHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Exercise',
  description: 'Daily workout',
  frequency: 'daily',
  createdAt: '2026-04-30T00:00:00.000Z',
  completions: [],
}

beforeEach(() => {
  storage.clear()
})

describe('storage.getUsers / saveUsers', () => {
  it('returns empty array when no users stored', () => {
    expect(storage.getUsers()).toEqual([])
  })

  it('saves and retrieves users', () => {
    storage.saveUsers([mockUser])
    expect(storage.getUsers()).toEqual([mockUser])
  })

  it('overwrites existing users on save', () => {
    storage.saveUsers([mockUser])
    const updated = { ...mockUser, email: 'updated@example.com' }
    storage.saveUsers([updated])
    expect(storage.getUsers()).toEqual([updated])
  })

  it('saves multiple users', () => {
    const second: User = {
      ...mockUser,
      id: 'user-2',
      email: 'second@example.com',
    }
    storage.saveUsers([mockUser, second])
    expect(storage.getUsers()).toHaveLength(2)
  })
})

describe('storage.getSession / saveSession', () => {
  it('returns null when no session stored', () => {
    expect(storage.getSession()).toBeNull()
  })

  it('saves and retrieves a session', () => {
    storage.saveSession(mockSession)
    expect(storage.getSession()).toEqual(mockSession)
  })

  it('removes session when saved with null', () => {
    storage.saveSession(mockSession)
    storage.saveSession(null)
    expect(storage.getSession()).toBeNull()
  })
})

describe('storage.getHabits / saveHabits', () => {
  it('returns empty array when no habits stored', () => {
    expect(storage.getHabits()).toEqual([])
  })

  it('saves and retrieves habits', () => {
    storage.saveHabits([mockHabit])
    expect(storage.getHabits()).toEqual([mockHabit])
  })

  it('overwrites existing habits on save', () => {
    storage.saveHabits([mockHabit])
    const updated = { ...mockHabit, name: 'Meditation' }
    storage.saveHabits([updated])
    expect(storage.getHabits()).toEqual([updated])
  })

  it('saves multiple habits', () => {
    const second: Habit = { ...mockHabit, id: 'habit-2', name: 'Reading' }
    storage.saveHabits([mockHabit, second])
    expect(storage.getHabits()).toHaveLength(2)
  })
})

describe('storage.clear', () => {
  it('removes all stored data', () => {
    storage.saveUsers([mockUser])
    storage.saveSession(mockSession)
    storage.saveHabits([mockHabit])

    storage.clear()

    expect(storage.getUsers()).toEqual([])
    expect(storage.getSession()).toBeNull()
    expect(storage.getHabits()).toEqual([])
  })
})
