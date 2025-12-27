export type PracticeSession = {
  id: number
  piece: string
  goal: string
  startedAt: number
  durationSec: number
}

export type TodayTabProps = {
  pieceName: string
  setPieceName: (value: string) => void
  goal: string
  setGoal: (value: string) => void
  activeSession: { startedAt: number; piece: string; goal: string } | null
  elapsedSeconds: number
  startSession: () => void
  stopSession: () => void
  sessionsToday: PracticeSession[]
  totalSecondsToday: number
  formatHMS: (seconds: number) => string
}

export default function TodayTab({
  pieceName,
  setPieceName,
  goal,
  setGoal,
  activeSession,
  elapsedSeconds,
  startSession,
  stopSession,
  sessionsToday,
  totalSecondsToday,
  formatHMS,
}: TodayTabProps) {
  return (
    <div>
      <h2>Today</h2>

      <p>total practice today: {formatHMS(totalSecondsToday)}</p>

      {!activeSession && (
        <div>
          <input
            placeholder="piece name"
            value={pieceName}
            onChange={(e) => setPieceName(e.target.value)}
          />

          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option>technique</option>
            <option>phrasing</option>
          </select>

          <button onClick={startSession}>Start session</button>
        </div>
      )}

      {activeSession && (
        <div>
          <p>
            Practicing: <strong>{activeSession.piece}</strong> (
            {activeSession.goal})
          </p>

          {/* live timer */}
          <h3>{formatHMS(elapsedSeconds)}</h3>

          <button onClick={stopSession}>Stop session</button>
        </div>
      )}

      <h3>Today's Sessions</h3>

      {sessionsToday.length === 0 && <p>why haven't you practiced yet</p>}

      {sessionsToday.length > 0 && (
        <ul>
          {sessionsToday.map((session) => (
            <li key={session.id}>
              <strong>{session.piece}</strong> — {session.goal} —{" "}
              {formatHMS(session.durationSec)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
