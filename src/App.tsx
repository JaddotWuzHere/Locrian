import { useState, useEffect } from "react";
import "./App.css"

function App() {
  const [activeTab, setActiveTab] =
    useState<"today" | "history" | "insights">("today")

  const [pieceName, setPieceName] = useState("")
  const [goal, setGoal] = useState("technique")

  const [activeSession, setActiveSession] =
    useState<null | { startedAt: number; piece: string; goal: string }>(null)

  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const [loaded, setLoaded] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])

  // local storage
  useEffect(() => {
    const saved = localStorage.getItem("locrian.sessions")

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setSessions(parsed)
        }
      } catch (e) {
        console.error("failed to parse saved sessions", e)
      }
    }

    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) {
      return
    }
    localStorage.setItem("locrian.sessions", JSON.stringify(sessions))
  }, [sessions, loaded])


  // timer
  useEffect(() => {
    if (!activeSession) return

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - activeSession.startedAt) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [activeSession])

  // start session
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

  // stop session and store session
  function stopSession() {
    if (!activeSession) return 

    const newSession = {
      id: Date.now(),
      piece: activeSession.piece,
      goal: activeSession.goal,
      startedAt: activeSession.startedAt,
      durationSec: elapsedSeconds,
    }

    setSessions((oldSessions) => [...oldSessions, newSession])

    setActiveSession(null)
    setElapsedSeconds(0)
  }

  // time formatting
  function formatHMS(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const hh = hours.toString().padStart(2, "0")
    const mm = minutes.toString().padStart(2, "0")
    const ss = seconds.toString().padStart(2, "0")

    return `${hh}:${mm}:${ss}`
  }

  // date formatting
  function formatDate(ts: number) {
    // 12/26/2025 type shit
    const d = new Date(ts)

    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    const yyyy = d.getFullYear()

    return `${mm}/${dd}/${yyyy}`
  }

  // group sessions by date
  const sessionsByDate = sessions.reduce((acc: Record<string, any[]>, session) => {
    const date = formatDate(session.startedAt)

    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(session)

    return acc
  }, {} as Record<string, any[]>)

  const sortedDateKeys = Object.keys(sessionsByDate).sort((a, b) =>
    a < b ? 1 : -1
  )

  const todayKey = formatDate(Date.now())

  // list of all sessions today
  const sessionsToday = sessions.filter(
    (session) => formatDate(session.startedAt) === todayKey
  )

  // total practiced time today
  const totalSecondsToday = sessionsToday.reduce(
    (sum, session) => sum + session.durationSec,
    0
  )

  // some jsx shit
  return (
    <div style={{ paddingBottom: "60px" }}>
      <h1>Locrian</h1>

      {activeTab === "today" && (
        <div>
          <h2>Today</h2>
          <p>total practice today: {formatHMS(totalSecondsToday)}</p>

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
              <h3>{formatHMS(elapsedSeconds)}</h3>

              <button onClick={stopSession}>Stop session</button>
            </div>
          )}

          <h3>Today's Sessions</h3>

          {sessionsToday.length === 0 && (
            <p>why haven't you practiced yet</p>
          )}

          {sessionsToday.length > 0 && (
            <ul>
              {sessionsToday.map((session) => (
                <li key={session.id}>
                  <strong>{session.piece}</strong> — {session.goal} — {" "}
                  {formatHMS(session.durationSec)}
                </li>
              ))}
            </ul>
          )}

        </div>
      )}

      {activeTab === "history" && (
        <div>
          <h2>History</h2>

          {sortedDateKeys.length === 0 && <p>No sessions yet shawty</p>}

          {sortedDateKeys.map((dateKey) => {
            const daySessions = sessionsByDate[dateKey]
            const totalForDay = daySessions.reduce(
              (sum, session) => sum + session.durationSec,
              0
            )

            const dateLabel = new Date(dateKey).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })

            return (
              <div key={dateKey} style={{ marginBottom: "1.5rem" }}>
                <h3>
                  {dateLabel} — {formatHMS(totalForDay)}
                </h3>

                <ul>
                  {daySessions.map((session) => (
                    <li key={session.id}>
                      <strong>{session.piece}</strong> — {session.goal} —{" "}
                      {formatHMS(session.durationSec)}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}

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