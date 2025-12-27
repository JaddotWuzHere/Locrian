import { useState } from "react"
import type { Piece } from "../types"

type PiecesManagerProps = {
  pieces: Piece[]
  setPieces: (pieces: Piece[]) => void
  onClose: () => void
}

export default function PiecesManager({
  pieces,
  setPieces,
  onClose,
}: PiecesManagerProps) {
  const [composer, setComposer] = useState("")
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  function resetForm() {
    setComposer("")
    setTitle("")
    setError(null)
  }

  function getNextId(): number {
    if (pieces.length === 0) return 1
    const maxId = Math.max(...pieces.map((p) => p.id))
    return maxId + 1
  }

  function handleAddPiece() {
    const trimmedComposer = composer.trim()
    const trimmedTitle = title.trim()

    if (!trimmedComposer || !trimmedTitle) {
      setError("composer and title are required")
      return
    }

    const duplicate = pieces.some(
      (p) =>
        p.composer.toLowerCase() === trimmedComposer.toLowerCase() &&
        p.title.toLowerCase() === trimmedTitle.toLowerCase(),
    )
    if (duplicate) {
      setError("that piece is already in your list")
      return
    }

    const newPiece: Piece = {
      id: getNextId(),
      composer: trimmedComposer,
      title: trimmedTitle,
    }

    setPieces([...pieces, newPiece])
    resetForm()
  }

  function handleDeletePiece(id: number) {
    const confirmed = window.confirm(
      "make sure you wanna remove this shawty",
    )
    if (!confirmed) return

    setPieces(pieces.filter((p) => p.id !== id))
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          minWidth: "320px",
          maxWidth: "480px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ margin: 0 }}>Manage pieces</h2>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <input
              placeholder="composer"
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
            />
            <input
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
          )}

          <button
            type="button"
            onClick={handleAddPiece}
            style={{ marginTop: "0.75rem" }}
          >
            add piece
          </button>
        </div>

        <h3 style={{ marginTop: 0 }}>Your pieces</h3>

        {pieces.length === 0 && (
          <p style={{ fontStyle: "italic" }}>no pieces yet – add one above</p>
        )}

        {pieces.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pieces.map((piece) => (
              <li
                key={piece.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.25rem 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span>
                  {piece.composer} — <strong>{piece.title}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleDeletePiece(piece.id)}
                >
                  delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
