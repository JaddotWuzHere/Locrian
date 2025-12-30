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
    <div className="modal-backdrop">
      <div className="card modal-card">
        <div className="modal-header">
          <h2 className="modal-title">Manage pieces</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-section">
          <label>Composer</label>
          <input
            className="input"
            placeholder="composer"
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
          />

          <label>Title</label>
          <input
            className="input"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button
            type="button"
            className="button button-primary"
            onClick={handleAddPiece}
          >
            Add piece
          </button>
        </div>

        <div className="modal-section">
          <h3 className="modal-subtitle">Your pieces</h3>

          {pieces.length === 0 && (
            <p className="empty-text">
              No pieces yet – add one above
            </p>
          )}

          {pieces.length > 0 && (
            <ul className="session-list">
              {pieces.map((piece) => (
                <li key={piece.id} className="session-block">
                  <div className="session-top">
                    <div className="session-piece">
                      <div className="session-title-line">
                        {piece.title}
                      </div>
                      <div className="session-composer-line">
                        {piece.composer}
                      </div>
                    </div>
                  </div>

                  <div className="session-bottom">
                    <div className="session-right">
                      <button
                        type="button"
                        className="button button-danger session-delete"
                        onClick={() => handleDeletePiece(piece.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
