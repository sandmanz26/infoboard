import LeaderboardHead from './LeaderboardHead.jsx'

function Medal({ medal, label }) {
  return (
    <span className={`medal medal-${medal}`}>
      <span className="medal-label">{label}</span>
    </span>
  )
}

export default function LeaderboardCards({ rows }) {
  return (
    <>
      <LeaderboardHead />
      <div className="leaderboard-cards">
        {rows.map((row, i) => (
          <div
            className={`leaderboard-card${row.medal ? ` leaderboard-card-${row.medal}` : ''}`}
            key={i}
          >
            <span className="leaderboard-card-rank">
              {row.medal ? (
                <Medal medal={row.medal} label={row.ranking} />
              ) : (
                <span className="ranking-number">{row.ranking}</span>
              )}
            </span>
            <span className="leaderboard-card-name" title={row.name}>
              <span className="trainee-rank">{row.rank}</span> {row.name}
            </span>
            <span className="leaderboard-card-stats">
              <span className="leaderboard-stat">
                <strong>{row.score}</strong>
                <small>Score</small>
              </span>
              <span className="leaderboard-stat">
                <strong>{row.mpi}</strong>
                <small>MPI mm</small>
              </span>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
