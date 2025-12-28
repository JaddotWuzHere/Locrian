export type PracticeSession = {
  id: number
  pieceId: number
  goal: string
  startedAt: number
  durationSec: number
}

export type Piece = {
  id: number
  composer: string
  title: string
}

export type PieceTotal = {
  piece: string
  totalSeconds: number
}