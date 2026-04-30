'use client'

import React, { useReducer, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import { Habit } from '@/types/habit'
import HabitList from '@/components/habits/HabitList'
import HabitForm from '@/components/habits/HabitForm'
import { toggleHabitCompletion } from '@/lib/habits'
import { logoutUser } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const [, forceUpdate] = useReducer((n: number) => n + 1, 0)

  const session = storage.getSession()
  const habits = session
    ? storage.getHabits().filter((h) => h.userId === session.userId)
    : []

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session, router])

  const handleLogout = () => {
    logoutUser()
    router.push('/login')
  }

  const handleCreateHabit = (data: { name: string; description: string }) => {
    if (!session) return
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: data.name,
      description: data.description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    }
    storage.saveHabits([...storage.getHabits(), newHabit])
    forceUpdate()
    setIsFormOpen(false)
  }

  const handleUpdateHabit = (data: { name: string; description: string }) => {
    if (!session || !editingHabit) return
    const updatedHabit: Habit = {
      ...editingHabit,
      name: data.name,
      description: data.description,
    }
    storage.saveHabits(
      storage
        .getHabits()
        .map((h) => (h.id === editingHabit.id ? updatedHabit : h))
    )
    forceUpdate()
    setEditingHabit(null)
  }

  const handleToggleHabit = (habit: Habit) => {
    if (!session) return
    const today = new Date().toISOString().split('T')[0]
    const updatedHabit = toggleHabitCompletion(habit, today)
    storage.saveHabits(
      storage.getHabits().map((h) => (h.id === habit.id ? updatedHabit : h))
    )
    forceUpdate()
  }

  const handleDeleteHabit = (habit: Habit) => {
    if (!session) return
    storage.saveHabits(storage.getHabits().filter((h) => h.id !== habit.id))
    forceUpdate()
  }

  if (!session) return null

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen bg-gray-50 p-4 sm:p-8"
    >
      <header className="mx-auto mb-8 flex max-w-4xl items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
          <p className="text-gray-600">Welcome back, {session.email}</p>
        </div>
        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          Logout
        </button>
      </header>

      <main className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Your Habits</h2>
          <button
            data-testid="create-habit-button"
            onClick={() => setIsFormOpen(true)}
            className="bg-primary rounded-lg px-6 py-2 font-bold text-white shadow-sm transition-all hover:opacity-90"
          >
            + Create Habit
          </button>
        </div>

        {(isFormOpen || editingHabit) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md">
              <HabitForm
                initialData={editingHabit || undefined}
                onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
                onCancel={() => {
                  setIsFormOpen(false)
                  setEditingHabit(null)
                }}
              />
            </div>
          </div>
        )}

        {habits.length === 0 ? (
          <div
            data-testid="empty-state"
            className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center"
          >
            <div className="mb-4 text-5xl">🌱</div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              No habits found
            </h3>
            <p className="text-gray-600">
              Start your journey by creating your first habit!
            </p>
          </div>
        ) : (
          <HabitList
            habits={habits}
            onToggle={handleToggleHabit}
            onEdit={setEditingHabit}
            onDelete={handleDeleteHabit}
          />
        )}
      </main>
    </div>
  )
}
