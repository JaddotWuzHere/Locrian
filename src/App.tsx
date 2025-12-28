import { useState, useEffect } from "react"
import "./App.css"

import TodayTab from "./tabs/TodayTab"
import HistoryTab from "./tabs/HistoryTab"
import InsightsTab from "./tabs/InsightsTab"

import PiecesManager from "./components/PiecesManager"

import type { PracticeSession, Piece } from "./types"


function App() {
  const [activeTab, setActiveTab] =
    useState<"today" | "history" | "insights">("today")

  const [selectedPieceId, setSelectedPieceId] = useState<number | "">("")
  const [goal, setGoal] = useState("technique")

  const [pieces, setPieces] = useState<Piece[]>([])
  const [showPiecesManager, setShowPiecesManager] = useState(false)

  const [activeSession, setActiveSession] = useState<{
    startedAt: number
    pieceId: number
    goal: string
  } | null>(null)

  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const [loaded, setLoaded] = useState(false)
  const [sessions, setSessions] = useState<PracticeSession[]>([])

  // -------- local storage shit idk --------
  useEffect(() => {
    const savedSessions = localStorage.getItem("locrian.sessions")
    const savedPieces = localStorage.getItem("locrian.pieces")

    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions)
        if (Array.isArray(parsedSessions)) {
          setSessions(parsedSessions)
        }
      } catch (e) {
        console.error("failed to parse saved sessions", e)
      }
    }

    if (savedPieces) {
      try {
        const parsedPieces = JSON.parse(savedPieces)
        if (Array.isArray(parsedPieces)) {
          setPieces(parsedPieces)
        }
      } catch (e) {
        console.error("failed to parse saved pieces", e)
      }
    }

    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    localStorage.setItem("locrian.sessions", JSON.stringify(sessions))
    localStorage.setItem("locrian.pieces", JSON.stringify(pieces))
  }, [sessions, pieces, loaded])

  // -------- timer effect --------
  useEffect(() => {
    if (!activeSession) return

    const interval = setInterval(() => {
      setElapsedSeconds(
        Math.floor((Date.now() - activeSession.startedAt) / 1000)
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [activeSession])

  // -------- actions --------
  function startSession() {
    if (selectedPieceId === "") {
      alert("select a piece first")
      return
    }

    if (activeSession) return

    const startedAt = Date.now()

    setActiveSession({
      startedAt,
      pieceId: selectedPieceId,
      goal,
    })
  }

  function stopSession() {
    if (!activeSession) return

    const newSession: PracticeSession = {
      id: Date.now(),
      pieceId: activeSession.pieceId,
      goal: activeSession.goal,
      startedAt: activeSession.startedAt,
      durationSec: elapsedSeconds,
    }

    setSessions((oldSessions) => [...oldSessions, newSession])

    setActiveSession(null)
    setElapsedSeconds(0)
  }

  // -------- format TIME --------
  function formatHMS(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const hh = hours.toString().padStart(2, "0")
    const mm = minutes.toString().padStart(2, "0")
    const ss = seconds.toString().padStart(2, "0")

    return `${hh}:${mm}:${ss}`
  }

  function formatDate(ts: number) {
    const d = new Date(ts)

    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    const yyyy = d.getFullYear()

    return `${mm}/${dd}/${yyyy}`
  }


  
  // -------- group sessions by date --------
  const sessionsByDate = sessions.reduce(
    (acc: Record<string, PracticeSession[]>, session) => {
      const date = formatDate(session.startedAt)

      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(session)

      return acc
    },
    {} as Record<string, PracticeSession[]>
  )

  const sortedDateKeys = Object.keys(sessionsByDate).sort((a, b) =>
    a < b ? 1 : -1
  )

  // -------- today's sessions wahoo --------
  const todayKey = formatDate(Date.now())

  const sessionsToday = sessions.filter(
    (session) => formatDate(session.startedAt) === todayKey
  )

  const totalSecondsToday = sessionsToday.reduce(
    (sum, session) => sum + session.durationSec,
    0
  )

  // -------- pieces manager open --------
  function handleManagePiecesClick() {
    setShowPiecesManager(true)
  }

  // -------- remove sessions --------
  function deleteSession(id: number) {
    setSessions((allSessions) => allSessions.filter((s) => s.id !== id))
  }

  // -------- some basic insights stuff, past 30 days --------
  const INSIGHTS_DAYS = 30
  const now = Date.now()
  const cutoffMs = now - INSIGHTS_DAYS * 24 * 60 * 60 * 1000

  const recentSessions = sessions.filter(
    (session) => session.startedAt >= cutoffMs
  )

  const totalSecondsPiece = recentSessions.reduce(
    (acc: Record<string, number>, session) => {
      const pieceObj = pieces.find((p) => p.id === session.pieceId)

      const piece = pieceObj
        ? `${pieceObj.composer} — ${pieceObj.title}`
        : " (unknown piece)"

      acc[piece] = (acc[piece] || 0) + session.durationSec
      return acc
    },
    {} as Record<string, number>
  )

  const pieceTotals = Object.entries(totalSecondsPiece)
    .map(([piece, totalSeconds]) => ({ piece, totalSeconds }))
    .sort((a, b) => b.totalSeconds - a.totalSeconds)

  // -------- JSX SHIT AHHHHH --------
  return (
    <div style={{ paddingBottom: "60px" }}>
      <h1>Locrian</h1>

      {activeTab === "today" && (
        <TodayTab
          selectedPieceId={selectedPieceId}
          setSelectedPieceId={setSelectedPieceId}
          goal={goal}
          setGoal={setGoal}
          activeSession={activeSession}
          elapsedSeconds={elapsedSeconds}
          startSession={startSession}
          stopSession={stopSession}
          sessionsToday={sessionsToday}
          totalSecondsToday={totalSecondsToday}
          formatHMS={formatHMS}
          pieces={pieces}
          onManagePiecesClick={() => setShowPiecesManager(true)}
          deleteSession={deleteSession}
        />
      )}

      {activeTab === "history" && (
        <HistoryTab
          sortedDateKeys={sortedDateKeys}
          sessionsByDate={sessionsByDate}
          formatHMS={formatHMS}
          deleteSession={deleteSession}
        />
      )}

      {activeTab === "insights" && (
        <InsightsTab
          insightsDays={INSIGHTS_DAYS}
          pieceTotals={pieceTotals}
          formatHMS={formatHMS}
        />
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-around",
          borderTop: "1px solid #ccc",
          padding: "10px",
          background: "white",
        }}
      >
        <button onClick={() => setActiveTab("today")}>Today</button>
        <button onClick={() => setActiveTab("history")}>History</button>
        <button onClick={() => setActiveTab("insights")}>Insights</button>
      </div>

      {showPiecesManager && (
        <PiecesManager
          pieces={pieces}
          setPieces={setPieces}
          onClose={() => setShowPiecesManager(false)}
        />
      )}
    </div>
  )
}

export default App
