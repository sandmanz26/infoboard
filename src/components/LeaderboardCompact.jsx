import LeaderboardHead from './LeaderboardHead.jsx'

function Medal({ medal, label }) {
  return (
    <span className={`medal medal-${medal}`}>
      <span className="medal-label">{label}</span>
    </span>
  )
}

export default function LeaderboardCompact({ rows }) {
  return (
    <>
      <LeaderboardHead />
      <div className="leaderboard-compact">
        {rows.map((row, i) => (
          <div className="leaderboard-compact-row" key={i}>
            <span className="leaderboard-compact-rank">
              {row.medal ? (
                <Medal medal={row.medal} label={row.ranking} />
              ) : (
                <span className="ranking-number">{row.ranking}</span>
              )}
            </span>
            <span className="leaderboard-compact-name" title={row.name}>
              <span className="trainee-rank">{row.rank}</span> {row.name}
            </span>
            <span className="leaderboard-compact-score">{row.score}</span>
            <span className="leaderboard-compact-mpi">{row.mpi} mm</span>
          </div>
        ))}
      </div>
    </>
  )
}
