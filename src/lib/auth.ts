import { User, Session } from '../types/auth'
import { storage } from './storage'

export interface AuthResult {
  success: boolean
  error?: string
  session?: Session
}

/**
 * Signup a new user with email and password
 * @returns AuthResult with session on success, error on failure
 */
export function signupUser(email: string, password: string): AuthResult {
  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required',
    }
  }

  const users = storage.getUsers()

  // Check for duplicate email
  if (users.find((u) => u.email === email)) {
    return {
      success: false,
      error: 'User already exists',
    }
  }

  // Create new user
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  }

  // Save user and create session
  storage.saveUsers([...users, newUser])
  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
  }
  storage.saveSession(session)

  return {
    success: true,
    session,
  }
}

/**
 * Login an existing user with email and password
 * @returns AuthResult with session on success, error on failure
 */
export function loginUser(email: string, password: string): AuthResult {
  const users = storage.getUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password',
    }
  }

  // Create session
  const session: Session = {
    userId: user.id,
    email: user.email,
  }
  storage.saveSession(session)

  return {
    success: true,
    session,
  }
}

/**
 * Logout the current user by clearing the session
 */
export function logoutUser(): void {
  storage.saveSession(null)
}

/**
 * Check if a user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return storage.getSession() !== null
}

/**
 * Get the current session if it exists
 */
export function getCurrentSession(): Session | null {
  return storage.getSession()
}
