import type { PracticeSession, Piece } from "../types"

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
  pieces: Piece[]
  onManagePiecesClick: () => void
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
  pieces,
  onManagePiecesClick,
}: TodayTabProps) {
  return (
    <div>
      <h2>Today</h2>

      <p>total practice today: {formatHMS(totalSecondsToday)}</p>

      {!activeSession && (
        <div>
          <select
            value={pieceName}
            onChange={(e) => setPieceName(e.target.value)}
          >
            <option value="">select a piece...</option>

            {pieces.map((piece) => {
              const label = `${piece.composer} — ${piece.title}`

              return (
                <option key={piece.id} value={label}>
                  {label}
                </option>
              )
            })}
          </select>

          <button type="button" onClick={onManagePiecesClick}>
            manage pieces
          </button>

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
