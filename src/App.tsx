import { useState, useEffect } from "react";

function App() {
  const [activeTab, setActiveTab] =
    useState<"today" | "history" | "insights">("today")

  const [pieceName, setPieceName] = useState("")
  const [goal, setGoal] = useState("Technique")

  // null if no active session
  const [activeSession, setActiveSession] =
    useState<null | { startedAt: number; piece: string; goal: string }>(null)

  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // timer
  useEffect(() => {
    if (!activeSession) return

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - activeSession.startedAt) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [activeSession])

  function startSession() {
    if (!pieceName.trim()) {
      alert("Enter piece name plz")
      return
    }

    setActiveSession({
      startedAt: Date.now(),
      piece: pieceName,
      goal,
    })
    setElapsedSeconds(0)
  }

  function stopSession() {
    setActiveSession(null)
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <div style={{ paddingBottom: "60px" }}>
      <h1>Locrian</h1>

      {activeTab === "today" && (
        <div>
          <h2>Today</h2>

          {!activeSession && (
            <div>
              <input
                placeholder="piece name"
                value={pieceName}
                onChange={(e) => setPieceName(e.target.value)}
              />
              <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option>technique</option>
                <option>phrasing</option>
              </select>

              <button onClick={startSession}>Start session</button>
            </div>
          )}

          {activeSession && (
            <div>
              <p>
                Practicing: <strong>{activeSession.piece}</strong> ({activeSession.goal})
              </p>
              <h3>{formatTime(elapsedSeconds)}</h3>

              <button onClick={stopSession}>Stop session</button>
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && <h2>History</h2>}
      {activeTab === "insights" && <h2>Insights</h2>}

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
    </div>
  )
}

export default App