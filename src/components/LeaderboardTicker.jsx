import LeaderboardHead from './LeaderboardHead.jsx'

export default function LeaderboardTicker({ rows, pageIndex, pageCount }) {
  return (
    <>
      <LeaderboardHead pageIndex={pageIndex} pageCount={pageCount} />
      <div className="leaderboard-ticker">
        {rows.map((row) => (
          <div className="ticker-item" key={row.name}>
            <span className={`ticker-rank${row.medal ? ` ticker-rank-${row.medal}` : ''}`}>
              {row.ranking}
            </span>
            <span className="ticker-name" title={row.name}>
              {row.name}
            </span>
            <span className="ticker-score">{row.score}</span>
          </div>
        ))}
      </div>
    </>
  )
}
