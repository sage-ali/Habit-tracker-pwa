import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SignupForm from '../../src/components/auth/SignupForm'
import LoginForm from '../../src/components/auth/LoginForm'
import { storage } from '../../src/lib/storage'

// Mock useRouter
const mockPush = vi.fn()
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

describe('auth flow', () => {
  beforeEach(() => {
    storage.clear()
    vi.clearAllMocks()
  })

  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />)

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      expect(storage.getSession()).toEqual({
        userId: expect.any(String),
        email: 'test@example.com',
      })
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows an error for duplicate signup email', async () => {
    storage.saveUsers([
      { id: '1', email: 'test@example.com', password: 'old', createdAt: '' },
    ])

    render(<SignupForm />)

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeDefined()
    })
  })

  it('submits the login form and stores the active session', async () => {
    storage.saveUsers([
      {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        createdAt: '',
      },
    ])

    render(<LoginForm />)

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      expect(storage.getSession()).toEqual({
        userId: '1',
        email: 'test@example.com',
      })
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'wrong@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'wrong' },
    })
    fireEvent.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeDefined()
    })
  })
})
