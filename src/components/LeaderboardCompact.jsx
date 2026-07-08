import LeaderboardHead from './LeaderboardHead.jsx'

function Medal({ medal, label }) {
  return (
    <span className={`medal medal-${medal}`}>
      <span className="medal-label">{label}</span>
    </span>
  )
}

export default function LeaderboardCompact({ rows, pageIndex, pageCount }) {
  return (
    <>
      <LeaderboardHead pageIndex={pageIndex} pageCount={pageCount} />
      <div className="leaderboard-compact">
        {rows.map((row) => (
          <div className="leaderboard-compact-row" key={row.name}>
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
