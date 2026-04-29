import { User, Session } from '../types/auth'
import { Habit } from '../types/habit'
import { STORAGE_KEYS } from './constants'

const KEYS = STORAGE_KEYS

export const storage = {
  // Users
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(KEYS.USERS)
    return data ? JSON.parse(data) : []
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users))
  },

  // Session
  getSession: (): Session | null => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(KEYS.SESSION)
    return data ? JSON.parse(data) : null
  },
  saveSession: (session: Session | null) => {
    if (session === null) {
      localStorage.removeItem(KEYS.SESSION)
    } else {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(session))
    }
  },

  // Habits
  getHabits: (): Habit[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(KEYS.HABITS)
    return data ? JSON.parse(data) : []
  },
  saveHabits: (habits: Habit[]) => {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits))
  },

  // Clear all for testing if needed
  clear: () => {
    localStorage.removeItem(KEYS.USERS)
    localStorage.removeItem(KEYS.SESSION)
    localStorage.removeItem(KEYS.HABITS)
  },
}
