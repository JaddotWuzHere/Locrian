import type { PracticeSession } from "../types"

type HistoryTabProps = {
  sortedDateKeys: string[]
  sessionsByDate: Record<string, PracticeSession[]>
  formatHMS: (seconds: number) => string
}

export default function HistoryTab({
  sortedDateKeys,
  sessionsByDate,
  formatHMS,
}: HistoryTabProps) {
  return (
    <div>
      <h2>History</h2>

      {sortedDateKeys.length === 0 && <p>No sessions yet shawty</p>}

      {sortedDateKeys.map((dateKey) => {
        const daySessions = sessionsByDate[dateKey] ?? []

        const totalForDay = daySessions.reduce(
          (sum, session) => sum + session.durationSec,
          0
        )

        const dateLabel = new Date(dateKey).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })

        return (
          <div key={dateKey} style={{ marginBottom: "1.5rem" }}>
            <h3>
              {dateLabel} — {formatHMS(totalForDay)}
            </h3>

            <ul>
              {daySessions.map((session) => (
                <li key={session.id}>
                  <strong>{session.piece}</strong> — {session.goal} —{" "}
                  {formatHMS(session.durationSec)}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
