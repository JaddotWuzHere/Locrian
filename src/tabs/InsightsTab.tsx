import type { PieceTotal } from "../types"

type InsightsTabProps = {
  insightsDays: number
  pieceTotals: PieceTotal[]
  formatHMS: (seconds: number) => string
}

export default function InsightsTab({
  insightsDays,
  pieceTotals,
  formatHMS,
}: InsightsTabProps) {
  return (
    <div className="card">
      <div className="card-header">
        Top pieces · last {insightsDays} days
      </div>

      {pieceTotals.length === 0 && (
        <p>No practice data yet for this period.</p>
      )}

      {pieceTotals.length > 0 && (
        <ul className="insights-list">
          {pieceTotals.map((item, index) => {
            const parts = item.piece.split(" — ")
            const composer = parts[0] || "Unknown composer"
            const title =
              parts.length > 1
                ? parts.slice(1).join(" — ")
                : item.piece

            return (
              <li key={item.piece} className="insight-row">
                <div className="insight-main">
                  <div className="insight-title">{title}</div>
                  <div className="insight-composer">{composer}</div>
                </div>

                <div className="insight-right">
                  <div className="insight-rank">
                    #{index + 1}
                  </div>
                  <div className="insight-duration">
                    {formatHMS(item.totalSeconds)}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
