import type { PracticeSession, Piece } from "../types"

type HistoryTabProps = {
  sortedDateKeys: string[]
  sessionsByDate: Record<string, PracticeSession[]>
  formatHMS: (seconds: number) => string
  deleteSession: (id: number) => void
  pieces: Piece[]
}

export default function HistoryTab({
  sortedDateKeys,
  sessionsByDate,
  formatHMS,
  deleteSession,
  pieces,
}: HistoryTabProps) {
  return (
    <div>
      {sortedDateKeys.length === 0 && <p>No sessions yet</p>}

      {sortedDateKeys.map((dateKey) => {
        const daySessions = sessionsByDate[dateKey] ?? []

        const totalForDay = daySessions.reduce(
          (sum, session) => sum + session.durationSec,
          0,
        )

        const dateLabel = new Date(dateKey).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })

        return (
          <div key={dateKey} className="card">
            <div className="card-header">
              {dateLabel} — {formatHMS(totalForDay)}
            </div>

            <ul className="session-list">
              {daySessions.map((session) => {
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
          </div>
        )
      })}
    </div>
  )
}
