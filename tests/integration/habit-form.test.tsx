import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import DashboardPage from '../../src/app/dashboard/page'
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

describe('habit form', () => {
  beforeEach(() => {
    storage.clear()
    storage.saveSession({ userId: 'user1', email: 'user@example.com' })
    vi.clearAllMocks()
  })

  it('shows a validation error when habit name is empty', async () => {
    render(<DashboardPage />)

    fireEvent.click(screen.getByTestId('create-habit-button'))

    const saveButton = screen.getByTestId('habit-save-button')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Habit name is required')).toBeDefined()
    })
  })

  it('creates a new habit and renders it in the list', async () => {
    render(<DashboardPage />)

    fireEvent.click(screen.getByTestId('create-habit-button'))

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink Water' },
    })
    fireEvent.change(screen.getByTestId('habit-description-input'), {
      target: { value: 'Stay hydrated' },
    })
    fireEvent.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeDefined()
      expect(screen.getByText('Drink Water')).toBeDefined()
    })
  })

  it('edits an existing habit and preserves immutable fields', async () => {
    const originalHabit = {
      id: 'h1',
      userId: 'user1',
      name: 'Read',
      description: 'Old desc',
      frequency: 'daily' as const,
      createdAt: '2026-01-01',
      completions: ['2026-01-01'],
    }
    storage.saveHabits([originalHabit])

    render(<DashboardPage />)

    fireEvent.click(screen.getByTestId('habit-edit-read'))

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Read Books' },
    })
    fireEvent.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      const updatedHabits = storage.getHabits()
      expect(updatedHabits[0].name).toBe('Read Books')
      expect(updatedHabits[0].id).toBe('h1')
      expect(updatedHabits[0].createdAt).toBe('2026-01-01')
      expect(updatedHabits[0].completions).toEqual(['2026-01-01'])
    })
  })

  it('deletes a habit only after explicit confirmation', async () => {
    storage.saveHabits([
      {
        id: 'h1',
        userId: 'user1',
        name: 'Delete Me',
        description: '',
        frequency: 'daily' as const,
        createdAt: '',
        completions: [],
      },
    ])

    render(<DashboardPage />)

    fireEvent.click(screen.getByTestId('habit-delete-delete-me'))

    // Check if confirmation is shown (our UI shows confirmation within the card)
    expect(screen.getByText(/Are you sure you want to delete/)).toBeDefined()

    fireEvent.click(screen.getByTestId('confirm-delete-button'))

    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-delete-me')).toBeNull()
      expect(storage.getHabits().length).toBe(0)
    })
  })

  it('toggles completion and updates the streak display', async () => {
    storage.saveHabits([
      {
        id: 'h1',
        userId: 'user1',
        name: 'Streak Habit',
        description: '',
        frequency: 'daily' as const,
        createdAt: '',
        completions: [],
      },
    ])

    render(<DashboardPage />)

    const completeButton = screen.getByTestId('habit-complete-streak-habit')
    fireEvent.click(completeButton)

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-streak-habit').textContent).toBe(
        '1 days'
      )
    })

    fireEvent.click(completeButton)

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-streak-habit').textContent).toBe(
        '0 days'
      )
    })
  })
})
