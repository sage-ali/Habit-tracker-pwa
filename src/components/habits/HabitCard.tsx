'use client'

import React, { useState } from 'react'
import { Habit } from '@/types/habit'
import { getHabitSlug } from '@/lib/slug'
import { calculateCurrentStreak } from '@/lib/streaks'

interface HabitCardProps {
  habit: Habit
  onToggle: (habit: Habit) => void
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const slug = getHabitSlug(habit.name)
  const streak = calculateCurrentStreak(habit.completions)
  const today = new Date().toISOString().split('T')[0]
  const isCompletedToday = habit.completions.includes(today)

  if (isDeleting) {
    return (
      <div
        data-testid={`habit-card-${slug}`}
        className="animate-in fade-in zoom-in flex flex-col gap-3 rounded-lg border bg-red-50 p-4 shadow-sm duration-200"
      >
        <p className="text-center font-bold text-red-700">
          Are you sure you want to delete &quot;{habit.name}&quot;?
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setIsDeleting(false)}
            className="rounded border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            data-testid="confirm-delete-button"
            onClick={() => onDelete(habit)}
            className="rounded bg-red-600 px-4 py-2 font-bold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="flex items-center justify-between gap-4 rounded-lg border bg-white p-4 shadow-sm"
    >
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-lg font-bold">{habit.name}</h4>
        {habit.description && (
          <p className="truncate text-sm text-gray-500">{habit.description}</p>
        )}
        <p className="mt-1 text-sm">
          Streak:{' '}
          <span
            data-testid={`habit-streak-${slug}`}
            className="text-primary font-bold"
          >
            {streak} days
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit)}
          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
            isCompletedToday
              ? 'border-green-500 bg-green-500 text-white shadow-md'
              : 'hover:border-primary border-gray-300 text-transparent'
          }`}
          aria-label={
            isCompletedToday ? 'Unmark as complete' : 'Mark as complete'
          }
        >
          {isCompletedToday ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="flex flex-col gap-1">
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            className="hover:text-primary p-1 text-gray-400 transition-colors"
            aria-label="Edit habit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setIsDeleting(true)}
            className="p-1 text-gray-400 transition-colors hover:text-red-500"
            aria-label="Delete habit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HabitCard
