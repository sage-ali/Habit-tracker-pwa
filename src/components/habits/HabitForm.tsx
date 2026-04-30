'use client'

import React, { useState } from 'react'
import { Habit } from '@/types/habit'
import { validateHabitName } from '@/lib/validators'

interface HabitFormProps {
  initialData?: Habit
  onSubmit: (data: { name: string; description: string }) => void
  onCancel: () => void
}

const HabitForm: React.FC<HabitFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateHabitName(name)

    if (!validation.valid) {
      setError(validation.error)
      return
    }

    onSubmit({ name: validation.value, description })
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="habit-form"
      className="flex flex-col gap-4 rounded border bg-white p-4 shadow-sm"
    >
      <h3 className="text-xl font-bold">
        {initialData ? 'Edit Habit' : 'New Habit'}
      </h3>

      <div className="flex flex-col gap-1">
        <label htmlFor="habit-name">Name</label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="habit-name-input"
          className="rounded border p-2"
          placeholder="e.g. Drink Water"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="habit-description">Description (Optional)</label>
        <textarea
          id="habit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-testid="habit-description-input"
          className="rounded border p-2"
          placeholder="Stay hydrated throughout the day"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="habit-frequency">Frequency</label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          className="rounded border bg-gray-100 p-2"
          disabled
          value="daily"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border px-4 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="habit-save-button"
          className="bg-primary rounded px-4 py-2 font-bold text-white hover:opacity-90"
        >
          {initialData ? 'Update Habit' : 'Save Habit'}
        </button>
      </div>
    </form>
  )
}

export default HabitForm
