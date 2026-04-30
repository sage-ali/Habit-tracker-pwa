export function calculateCurrentStreak(
  completions: string[],
  today?: string
): number {
  if (completions.length === 0) return 0

  const referenceDate = today || new Date().toISOString().split('T')[0]
  const sortedCompletions = Array.from(new Set(completions)).sort((a, b) =>
    b.localeCompare(a)
  )

  if (!sortedCompletions.includes(referenceDate)) return 0

  let streak = 0
  const currentDate = new Date(referenceDate)

  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = sortedCompletions.find(
      (c) => c === currentDate.toISOString().split('T')[0]
    )
    if (completionDate) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
