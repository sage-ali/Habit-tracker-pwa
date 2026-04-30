import { describe, it, expect, beforeEach } from 'vitest'
import {
  signupUser,
  loginUser,
  logoutUser,
  isAuthenticated,
  getCurrentSession,
} from '../../src/lib/auth'
import { storage } from '../../src/lib/storage'

beforeEach(() => {
  storage.clear()
})

describe('signupUser', () => {
  it('returns error when email is missing', () => {
    const result = signupUser('', 'password123')
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('returns error when password is missing', () => {
    const result = signupUser('test@example.com', '')
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('creates a new user and returns session on success', () => {
    const result = signupUser('test@example.com', 'password123')
    expect(result.success).toBe(true)
    expect(result.session).toMatchObject({ email: 'test@example.com' })
  })

  it('persists the session after signup', () => {
    signupUser('test@example.com', 'password123')
    expect(getCurrentSession()).not.toBeNull()
  })

  it('returns error when email is already registered', () => {
    signupUser('test@example.com', 'password123')
    const result = signupUser('test@example.com', 'otherpassword')
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('allows two different users to sign up', () => {
    const first = signupUser('a@example.com', 'pass1')
    const second = signupUser('b@example.com', 'pass2')
    expect(first.success).toBe(true)
    expect(second.success).toBe(true)
  })
})

describe('loginUser', () => {
  beforeEach(() => {
    signupUser('test@example.com', 'password123')
    storage.saveSession(null)
  })

  it('returns error for unknown email', () => {
    const result = loginUser('unknown@example.com', 'password123')
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('returns error for wrong password', () => {
    const result = loginUser('test@example.com', 'wrongpassword')
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('returns session on valid credentials', () => {
    const result = loginUser('test@example.com', 'password123')
    expect(result.success).toBe(true)
    expect(result.session).toMatchObject({ email: 'test@example.com' })
  })

  it('persists the session after login', () => {
    loginUser('test@example.com', 'password123')
    expect(getCurrentSession()).not.toBeNull()
  })
})

describe('logoutUser', () => {
  it('clears the session', () => {
    signupUser('test@example.com', 'password123')
    expect(isAuthenticated()).toBe(true)
    logoutUser()
    expect(isAuthenticated()).toBe(false)
  })
})

describe('isAuthenticated', () => {
  it('returns false when no session exists', () => {
    expect(isAuthenticated()).toBe(false)
  })

  it('returns true after signup', () => {
    signupUser('test@example.com', 'password123')
    expect(isAuthenticated()).toBe(true)
  })
})

describe('getCurrentSession', () => {
  it('returns null when no session exists', () => {
    expect(getCurrentSession()).toBeNull()
  })

  it('returns session with correct email after login', () => {
    signupUser('test@example.com', 'password123')
    const session = getCurrentSession()
    expect(session?.email).toBe('test@example.com')
  })
})
