export type PieceTotal = {
  piece: string
  totalSeconds: number
}

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
    <div>
      <h2>Insights</h2>
      <p>Last {insightsDays} days</p>

      {pieceTotals.length === 0 && (
        <p>No practice data yet for this period.</p>
      )}

      {pieceTotals.length > 0 && (
        <ul>
          {pieceTotals.map((item) => (
            <li key={item.piece}>
              <strong>{item.piece}</strong> — {formatHMS(item.totalSeconds)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
