import type { PracticeSession, Piece } from "../types"

export type TodayTabProps = {
  selectedPieceId: number | ""
  setSelectedPieceId: (value: number | "") => void
  goal: string
  setGoal: (value: string) => void
  activeSession: { startedAt: number, pieceId: number, goal: string } | null
  elapsedSeconds: number
  startSession: () => void
  stopSession: () => void
  sessionsToday: PracticeSession[]
  totalSecondsToday: number
  formatHMS: (seconds: number) => string
  pieces: Piece[]
  onManagePiecesClick: () => void
  deleteSession: (id: number) => void
}

export default function TodayTab({
  selectedPieceId,
  setSelectedPieceId,
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
  deleteSession,
}: TodayTabProps) {
  const activePiece =
    activeSession && pieces.find((p) => p.id === activeSession.pieceId)

  return (
    <div>
      <h2>Today</h2>

      <p>total practice today: {formatHMS(totalSecondsToday)}</p>

      {!activeSession && (
        <div>
          <div>
            <label>
              Piece:{" "}
              <select
                value={
                  selectedPieceId === ""
                    ? ""
                    : String(selectedPieceId)
                }
                onChange={(e) => {
                  const value = e.target.value
                  setSelectedPieceId(
                    value === "" ? "" : Number(value),
                  )
                }}
              >
                <option value="">select a piece...</option>

                {pieces.map((piece) => {
                  const label = `${piece.composer} — ${piece.title}`
                  return (
                    <option key={piece.id} value={piece.id}>
                      {label}
                    </option>
                  )
                })}
              </select>
            </label>

            <button type="button" onClick={onManagePiecesClick}>
              manage pieces
            </button>
          </div>

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option>technique</option>
            <option>phrasing</option>
          </select>

          <button onClick={startSession}>Start session</button>
        </div>
      )}

      {activeSession && (
        <div>
          <p>
            Practicing:{" "}
            <strong>
              {activePiece
                ? `${activePiece.composer} — ${activePiece.title}`
                : "Unknown piece"}
            </strong>{" "}
            ({activeSession.goal})
          </p>

          <h3>{formatHMS(elapsedSeconds)}</h3>

          <button onClick={stopSession}>Stop session</button>
        </div>
      )}

      <h3>Today&apos;s Sessions</h3>

      {sessionsToday.length === 0 && (
        <p>why haven&apos;t you practiced yet</p>
      )}

      {sessionsToday.length > 0 && (
        <ul>
          {sessionsToday.map((session) => {
            const piece = pieces.find(
              (p) => p.id === session.pieceId,
            )

            const label = piece
              ? `${piece.composer} — ${piece.title}`
              : "Unknown piece"

            return (
              <li key={session.id}>
                <strong>{label}</strong> — {session.goal} —{" "}
                {formatHMS(session.durationSec)}{" "}
                <button
                  type="button"
                  onClick={() => {
                    const ok = window.confirm(
                      "delete this session?",
                    )
                    if (ok) deleteSession(session.id)
                  }}
                >
                  delete
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
