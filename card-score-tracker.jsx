import { useState } from "react";

const TOTAL_GAMES = 7;

const T = {
  en: {
    title: "Score Tracker",
    enterNames: "Enter player names to begin",
    player: "Player",
    addPlayer: "+ Add Player",
    startGame: "Start Game",
    round: "Round",
    total: "Total",
    pts: "pts",
    currentStandings: "♣ Current Standings",
    nextRound: "Next Round →",
    finishGame: "Finish Game ♠",
    lastRound: "⚠️ Last Round! Score 0 to win the small prize!",
    bigWinner: "🏆 Big Winner!",
    smallWinner: "⭐ Small Winner!",
    tieGame: "It's a Tie!",
    tieSmall: "Tied Small!",
    points: "points",
    newGame: "New Game",
    player_col: "Player",
    smallWinNote: "scored 0 in the last round!",
    bigWinNote: "lowest total points overall!",
    noSmallWinner: "No one scored 0 in the last round.",
    standings: "Final Standings",
    restart: "Restart Game",
    restartConfirm: "Restart and lose all progress?",
    lang: "ES",
  },
  es: {
    title: "Marcador",
    enterNames: "Ingresa los nombres de los jugadores",
    player: "Jugador",
    addPlayer: "+ Agregar Jugador",
    startGame: "Iniciar Juego",
    round: "Ronda",
    total: "Total",
    pts: "pts",
    currentStandings: "♣ Posiciones Actuales",
    nextRound: "Siguiente Ronda →",
    finishGame: "Terminar Juego ♠",
    lastRound: "⚠️ ¡Última Ronda! ¡Anota 0 para ganar el premio chico!",
    bigWinner: "🏆 ¡Gran Ganador!",
    smallWinner: "⭐ ¡Ganador Chico!",
    tieGame: "¡Empate!",
    tieSmall: "¡Empate Chico!",
    points: "puntos",
    newGame: "Nuevo Juego",
    player_col: "Jugador",
    smallWinNote: "¡anotó 0 en la última ronda!",
    bigWinNote: "¡menor total de puntos!",
    noSmallWinner: "Nadie anotó 0 en la última ronda.",
    standings: "Posiciones Finales",
    restart: "Reiniciar Juego",
    restartConfirm: "¿Reiniciar y perder el progreso?",
    lang: "EN",
  },
};

function getTotal(p: any) {
  return p.scores.reduce((a: number, b: number) => a + b, 0);
}

function getBigWinners(players: any[]) {
  if (players.length === 0) return [];
  const min = Math.min(...players.map(getTotal));
  return players.filter((p) => getTotal(p) === min);
}

function getSmallWinners(players: any[]) {
  return players.filter((p) => p.scores[TOTAL_GAMES - 1] === 0);
}

export default function App() {
  const [lang, setLang] = useState("en");
  const t = T[lang];

  const [phase, setPhase] = useState("setup");
  const [playerNames, setPlayerNames] = useState(["", ""]);
  const [players, setPlayers] = useState([]);
  const [currentGame, setCurrentGame] = useState(1);
  const [inputs, setInputs] = useState({});

  function toggleLang() {
    setLang((l) => (l === "en" ? "es" : "en"));
  }

  function addPlayer() {
    if (playerNames.length < 10) setPlayerNames([...playerNames, ""]);
  }

  function removePlayer(i) {
    if (playerNames.length > 2) setPlayerNames(playerNames.filter((_, idx) => idx !== i));
  }

  function updateName(i, val) {
    const updated = [...playerNames];
    updated[i] = val;
    setPlayerNames(updated);
  }

  function startGame() {
    const names = playerNames.map((n, i) => n.trim() || `${t.player} ${i + 1}`);
    setPlayers(names.map((name) => ({ name, scores: [] })));
    setCurrentGame(1);
    setInputs({});
    setPhase("game");
  }

  function submitRound() {
    const updated = players.map((p) => ({
      ...p,
      scores: [...p.scores, parseInt(inputs[p.name] || "0", 10)],
    }));
    setPlayers(updated);
    setInputs({});
    if (currentGame >= TOTAL_GAMES) {
      setPhase("done");
    } else {
      setCurrentGame(currentGame + 1);
    }
  }

  function resetAll() {
    setPhase("setup");
    setPlayerNames(["", ""]);
    setPlayers([]);
    setCurrentGame(1);
    setInputs({});
  }

  const allFilled = players.every((p) => inputs[p.name] !== undefined && inputs[p.name] !== "");
  const isLastRound = currentGame === TOTAL_GAMES;

  const bigWinners = phase === "done" ? getBigWinners(players) : [];
  const smallWinners = phase === "done" ? getSmallWinners(players) : [];

  return (
    <div style={styles.root}>
      <div style={styles.bg} />
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.suitIcon}>♠</span>
          <h1 style={styles.title}>{t.title}</h1>
          <button style={styles.langBtn} onClick={toggleLang}>{t.lang}</button>
        </div>

        {/* SETUP */}
        {phase === "setup" && (
          <div style={styles.section}>
            <p style={styles.subtitle}>{t.enterNames}</p>
            {playerNames.map((name, i) => (
              <div key={i} style={styles.inputRow}>
                <input
                  style={styles.input}
                  placeholder={`${t.player} ${i + 1}`}
                  value={name}
                  onChange={(e) => updateName(i, e.target.value)}
                  maxLength={20}
                />
                {playerNames.length > 2 && (
                  <button style={styles.removeBtn} onClick={() => removePlayer(i)}>✕</button>
                )}
              </div>
            ))}
            <div style={styles.btnRow}>
              {playerNames.length < 10 && (
                <button style={styles.secondaryBtn} onClick={addPlayer}>{t.addPlayer}</button>
              )}
              <button style={styles.primaryBtn} onClick={startGame}>{t.startGame}</button>
            </div>
          </div>
        )}

        {/* GAME */}
        {phase === "game" && (
          <div style={styles.section}>
            <div style={styles.gameHeader}>
              <span style={styles.gameLabel}>{t.round}</span>
              <div style={styles.gameProgress}>
                {Array.from({ length: TOTAL_GAMES }).map((_, i) => (
                  <div key={i} style={{
                    ...styles.pip,
                    background: i < currentGame - 1 ? "#c8a96e" : i === currentGame - 1 ? "#fff" : "rgba(255,255,255,0.15)",
                    border: i === currentGame - 1 ? "2px solid #c8a96e" : "2px solid transparent",
                  }} />
                ))}
              </div>
              <span style={styles.gameLabel}>{currentGame} / {TOTAL_GAMES}</span>
            </div>

            {isLastRound && (
              <div style={styles.lastRoundBanner}>{t.lastRound}</div>
            )}

            <div style={styles.scoreBoard}>
              {players.map((p) => {
                const total = getTotal(p);
                const minTotal = Math.min(...players.map(getTotal));
                const isLeading = p.scores.length > 0 && total === minTotal;
                const inputVal = inputs[p.name] ?? "";
                const isScoringZero = isLastRound && inputVal === "0";
                return (
                  <div key={p.name} style={{
                    ...styles.playerRow,
                    border: isScoringZero
                      ? "1px solid rgba(100,200,120,0.6)"
                      : isLeading
                      ? "1px solid rgba(200,169,110,0.5)"
                      : "1px solid rgba(200,169,110,0.15)",
                    background: isScoringZero
                      ? "rgba(100,200,120,0.07)"
                      : isLeading
                      ? "rgba(200,169,110,0.08)"
                      : "rgba(255,255,255,0.04)",
                  }}>
                    <div style={styles.playerInfo}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {isScoringZero && <span style={{ fontSize: "13px" }}>⭐</span>}
                        {!isScoringZero && isLeading && <span style={{ fontSize: "13px" }}>👑</span>}
                        <span style={styles.playerName}>{p.name}</span>
                      </div>
                      <span style={{ ...styles.playerTotal, color: isLeading ? "#c8a96e" : "#9a8870" }}>
                        {t.total}: <strong style={{ color: isLeading ? "#c8a96e" : "#e8e0d0", fontSize: "14px" }}>{total}</strong> {t.pts}
                      </span>
                    </div>
                    <div style={styles.pastScores}>
                      {p.scores.map((s, i) => (
                        <span key={i} style={{
                          ...styles.pastScore,
                          background: i === TOTAL_GAMES - 1 && s === 0 ? "rgba(100,200,120,0.2)" : "rgba(200,169,110,0.15)",
                          color: i === TOTAL_GAMES - 1 && s === 0 ? "#6dc87a" : "#c8a96e",
                        }}>{s}</span>
                      ))}
                    </div>
                    <input
                      type="number"
                      style={{
                        ...styles.scoreInput,
                        borderColor: isScoringZero ? "rgba(100,200,120,0.6)" : "rgba(200,169,110,0.35)",
                        color: isScoringZero ? "#6dc87a" : "#fff",
                      }}
                      placeholder={t.pts}
                      value={inputVal}
                      onChange={(e) => setInputs({ ...inputs, [p.name]: e.target.value })}
                    />
                  </div>
                );
              })}
            </div>

            {players.some((p) => p.scores.length > 0) && (
              <div style={styles.standingsBox}>
                <p style={styles.standingsTitle}>{t.currentStandings}</p>
                {[...players]
                  .sort((a, b) => getTotal(a) - getTotal(b))
                  .map((p, rank) => (
                    <div key={p.name} style={styles.standingRow}>
                      <span style={{ color: rank === 0 ? "#c8a96e" : "#9a8870", fontSize: 13, minWidth: 20 }}>
                        {rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `${rank + 1}.`}
                      </span>
                      <span style={{ flex: 1, color: rank === 0 ? "#e8e0d0" : "#9a8870", fontSize: 13 }}>{p.name}</span>
                      <span style={{ color: rank === 0 ? "#c8a96e" : "#9a8870", fontWeight: 700, fontSize: 13 }}>{getTotal(p)} {t.pts}</span>
                    </div>
                  ))}
              </div>
            )}

            <button
              style={{ ...styles.primaryBtn, opacity: allFilled ? 1 : 0.4 }}
              disabled={!allFilled}
              onClick={submitRound}
            >
              {isLastRound ? t.finishGame : t.nextRound}
            </button>
            <button
              style={styles.restartBtn}
              onClick={resetAll}
            >
              ↺ {t.restart}
            </button>
          </div>
        )}

        {/* DONE */}
        {phase === "done" && (
          <div style={styles.section}>

            {/* Big Winner */}
            <div style={styles.winnerBox}>
              <div style={styles.trophyIcon}>🏆</div>
              <p style={styles.winnerLabel}>{bigWinners.length > 1 ? t.tieGame : t.bigWinner}</p>
              <p style={styles.winnerName}>{bigWinners.map((w) => w.name).join(" & ")}</p>
              <p style={styles.winnerScore}>{getTotal(bigWinners[0])} {t.points}</p>
              <p style={styles.winnerNote}>{t.bigWinNote}</p>
            </div>

            {/* Small Winner */}
            <div style={styles.smallWinnerBox}>
              {smallWinners.length > 0 ? (
                <>
                  <div style={{ fontSize: "26px", marginBottom: "4px" }}>⭐</div>
                  <p style={styles.smallWinnerLabel}>{smallWinners.length > 1 ? t.tieSmall : t.smallWinner}</p>
                  <p style={styles.smallWinnerName}>{smallWinners.map((w) => w.name).join(" & ")}</p>
                  <p style={styles.smallWinnerNote}>{t.smallWinNote}</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "22px", marginBottom: "4px" }}>⭐</div>
                  <p style={styles.smallWinnerLabel}>{t.smallWinner}</p>
                  <p style={{ color: "#9a8870", fontSize: "12px", margin: 0 }}>{t.noSmallWinner}</p>
                </>
              )}
            </div>

            {/* Final Table */}
            <p style={{ color: "#9a8870", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", margin: "4px 0 0" }}>
              ♦ {t.standings}
            </p>
            <div style={styles.finalTable}>
              <div style={{ ...styles.tableHeader, gridTemplateColumns: `1.4fr repeat(${TOTAL_GAMES}, 1fr) 1fr` }}>
                <span>{t.player_col}</span>
                {Array.from({ length: TOTAL_GAMES }).map((_, i) => (
                  <span key={i}>R{i + 1}</span>
                ))}
                <span>{t.total}</span>
              </div>
              {[...players]
                .sort((a, b) => getTotal(a) - getTotal(b))
                .map((p, rank) => {
                  const isBig = bigWinners.some((w) => w.name === p.name);
                  const isSmall = smallWinners.some((w) => w.name === p.name);
                  return (
                    <div key={p.name} style={{
                      ...styles.tableRow,
                      gridTemplateColumns: `1.4fr repeat(${TOTAL_GAMES}, 1fr) 1fr`,
                      background: isBig ? "rgba(200,169,110,0.12)" : isSmall ? "rgba(100,200,120,0.07)" : "transparent",
                    }}>
                      <span style={{ fontWeight: 600, color: isBig ? "#c8a96e" : isSmall ? "#6dc87a" : "#e8e0d0", fontSize: 11 }}>
                        {isBig ? "🏆 " : isSmall ? "⭐ " : ""}{p.name}
                      </span>
                      {p.scores.map((s, i) => (
                        <span key={i} style={{
                          color: i === TOTAL_GAMES - 1 && s === 0 ? "#6dc87a" : "#aaa",
                          fontSize: 11,
                          fontWeight: i === TOTAL_GAMES - 1 && s === 0 ? 700 : 400,
                        }}>{s}</span>
                      ))}
                      <span style={{ fontWeight: 700, color: isBig ? "#c8a96e" : "#fff", fontSize: 11 }}>{getTotal(p)}</span>
                    </div>
                  );
                })}
            </div>

            <button style={styles.primaryBtn} onClick={resetAll}>{t.newGame}</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#1a1208",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Georgia', serif",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  bg: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(200,169,110,0.03) 0px, rgba(200,169,110,0.03) 1px, transparent 1px, transparent 60px)",
    pointerEvents: "none",
  },
  card: {
    background: "linear-gradient(160deg, #2a1f10 0%, #1e1508 100%)",
    border: "1px solid rgba(200,169,110,0.3)",
    borderRadius: "16px",
    padding: "28px 22px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(200,169,110,0.2)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "22px",
  },
  suitIcon: { fontSize: "20px", color: "#c8a96e", opacity: 0.7 },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
    color: "#e8e0d0",
    letterSpacing: "2px",
    textTransform: "uppercase",
    flex: 1,
    textAlign: "center",
  },
  langBtn: {
    background: "rgba(200,169,110,0.15)",
    border: "1px solid rgba(200,169,110,0.4)",
    borderRadius: "6px",
    color: "#c8a96e",
    fontSize: "11px",
    fontWeight: "bold",
    padding: "4px 9px",
    cursor: "pointer",
    letterSpacing: "1px",
    fontFamily: "Georgia, serif",
    whiteSpace: "nowrap",
  },
  subtitle: { color: "#9a8870", textAlign: "center", marginTop: 0, marginBottom: "14px", fontSize: "13px" },
  section: { display: "flex", flexDirection: "column", gap: "10px" },
  inputRow: { display: "flex", gap: "8px", alignItems: "center" },
  input: {
    flex: 1,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(200,169,110,0.25)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#e8e0d0",
    fontSize: "15px",
    outline: "none",
    fontFamily: "Georgia, serif",
  },
  removeBtn: {
    background: "transparent",
    border: "1px solid rgba(255,80,80,0.3)",
    color: "#ff6060",
    borderRadius: "6px",
    width: "32px",
    height: "32px",
    cursor: "pointer",
    fontSize: "12px",
  },
  btnRow: { display: "flex", gap: "10px", marginTop: "4px" },
  primaryBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #c8a96e, #a07840)",
    border: "none",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#1a1208",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    letterSpacing: "0.5px",
    fontFamily: "Georgia, serif",
    transition: "opacity 0.2s",
  },
  secondaryBtn: {
    flex: 1,
    background: "transparent",
    border: "1px solid rgba(200,169,110,0.4)",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#c8a96e",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "Georgia, serif",
  },
  gameHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  gameLabel: { color: "#c8a96e", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" },
  gameProgress: { display: "flex", gap: "5px" },
  pip: { width: "9px", height: "9px", borderRadius: "50%", transition: "all 0.3s" },
  lastRoundBanner: {
    background: "rgba(200,120,50,0.12)",
    border: "1px solid rgba(200,120,50,0.35)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#e0a060",
    fontSize: "12px",
    textAlign: "center",
  },
  scoreBoard: { display: "flex", flexDirection: "column", gap: "7px" },
  playerRow: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(200,169,110,0.15)",
    borderRadius: "10px",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  playerInfo: { flex: 1, display: "flex", flexDirection: "column", gap: "2px" },
  playerName: { color: "#e8e0d0", fontSize: "14px", fontWeight: "bold" },
  playerTotal: { color: "#9a8870", fontSize: "12px" },
  pastScores: { display: "flex", gap: "3px", flexWrap: "wrap" },
  pastScore: { background: "rgba(200,169,110,0.15)", color: "#c8a96e", borderRadius: "4px", padding: "2px 5px", fontSize: "11px" },
  scoreInput: {
    width: "55px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(200,169,110,0.35)",
    borderRadius: "6px",
    padding: "7px 5px",
    color: "#fff",
    fontSize: "14px",
    textAlign: "center",
    outline: "none",
    fontFamily: "Georgia, serif",
  },
  standingsBox: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(200,169,110,0.15)",
    borderRadius: "10px",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  standingsTitle: { margin: "0 0 4px", color: "#9a8870", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase" },
  standingRow: { display: "flex", alignItems: "center", gap: "8px" },
  winnerBox: {
    textAlign: "center",
    background: "rgba(200,169,110,0.08)",
    border: "1px solid rgba(200,169,110,0.35)",
    borderRadius: "12px",
    padding: "16px",
  },
  trophyIcon: { fontSize: "32px", marginBottom: "4px" },
  winnerLabel: { color: "#9a8870", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 3px" },
  winnerName: { color: "#c8a96e", fontSize: "20px", fontWeight: "bold", margin: "0 0 2px" },
  winnerScore: { color: "#e8e0d0", fontSize: "13px", margin: "0 0 2px" },
  winnerNote: { color: "#9a8870", fontSize: "10px", margin: 0, fontStyle: "italic" },
  smallWinnerBox: {
    textAlign: "center",
    background: "rgba(100,200,120,0.06)",
    border: "1px solid rgba(100,200,120,0.3)",
    borderRadius: "12px",
    padding: "14px",
  },
  smallWinnerLabel: { color: "#9a8870", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 3px" },
  smallWinnerName: { color: "#6dc87a", fontSize: "18px", fontWeight: "bold", margin: "0 0 2px" },
  smallWinnerNote: { color: "#9a8870", fontSize: "10px", margin: 0, fontStyle: "italic" },
  restartBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #c8a96e, #a07840)",
    border: "none",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#1a1208",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    letterSpacing: "0.5px",
    fontFamily: "Georgia, serif",
  },
  finalTable: { display: "flex", flexDirection: "column", gap: "3px" },
  tableHeader: {
    display: "grid",
    color: "#9a8870",
    fontSize: "10px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    padding: "0 5px 5px",
    borderBottom: "1px solid rgba(200,169,110,0.2)",
    gap: "2px",
  },
  tableRow: {
    display: "grid",
    padding: "5px",
    borderRadius: "5px",
    gap: "2px",
    alignItems: "center",
  },
};
