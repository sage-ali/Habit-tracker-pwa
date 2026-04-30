'use client'

import React from 'react'
import { Habit } from '@/types/habit'
import HabitCard from './HabitCard'

interface HabitListProps {
  habits: Habit[]
  onToggle: (habit: Habit) => void
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
}

/**
 * HabitList component
 * Renders a list of habit cards
 * Displays empty state when no habits exist
 */
const HabitList: React.FC<HabitListProps> = ({
  habits,
  onToggle,
  onEdit,
  onDelete,
}) => {
  if (habits.length === 0) {
    return (
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
    )
  }

  return (
    <div className="grid gap-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default HabitList
