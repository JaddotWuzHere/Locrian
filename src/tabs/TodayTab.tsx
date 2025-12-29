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
      <div className="card">
        <div className="card-header">Today</div>
        <p>Total practice today: {formatHMS(totalSecondsToday)}</p>
      </div>

      {!activeSession && (
        <div className="card">
          <div className="card-header">Start a session</div>
            <div>
              <label>Piece:{" "}</label>
              <select
                className="input"
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
                <option value="">Select a piece...</option>

                {pieces.map((piece) => {
                  const label = `${piece.composer} — ${piece.title}`
                  return (
                    <option key={piece.id} value={piece.id}>
                      {label}
                    </option>
                  )
                })}
              </select>
            <button 
              type="button"
              className="button button-secondary"
              onClick={onManagePiecesClick}
            >
              Manage Pieces
            </button>
          </div>

          <label>Goal</label>
          <select
            className="input"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="technique">Technique</option>
            <option value="phrasing">Phrasing</option>
          </select>

          <button className="button button-primary" onClick={startSession}>
            Start session
          </button>
        </div>
      )}

      {activeSession && (
        <div className="card">
          <div className="card-header">Active session</div>
          <p>
            Practicing:{" "}
            <strong>
              {activePiece
                ? `${activePiece.composer} — ${activePiece.title}`
                : "Unknown piece"}
            </strong>{" "}
            ({activeSession.goal})
          </p>

          <h3 className="timer">{formatHMS(elapsedSeconds)}</h3>

          <button className="button button-danger" onClick={stopSession}>
            Stop session
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-header">Today&apos;s Sessions</div>

        {sessionsToday.length === 0 && (
          <p>No sessions yet</p>
        )}

        {sessionsToday.length > 0 && (
          <ul>
            {sessionsToday.map((session) => {
              const piece = pieces.find((p) => p.id === session.pieceId)

                return (
                  <li key={session.id} className="session-block">
                    <div className="session-top">
                      <div className="session-piece">
                        <div className="session-title-line">
                          {piece ? piece.title : "Unknown piece"}
                        </div>
                        <div className="session-composer-line">
                          {piece ? piece.composer : "Unknown composer"}
                        </div>
                      </div>

                      <div className="session-right">
                        <span className="session-duration">
                          {formatHMS(session.durationSec)}
                        </span>
                      </div>
                    </div>

                    <div className="session-goal-line">
                      {session.goal.toUpperCase()}
                    </div>

                    <div className="session-bottom">
                      <div className="session-right">
                        <button
                          type="button"
                          className="button button-danger session-delete"
                          onClick={() => {
                            const ok = window.confirm("delete this session?")
                            if (ok) deleteSession(session.id)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
