export type PracticeSession = {
  id: number
  piece: string
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