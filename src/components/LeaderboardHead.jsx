export default function LeaderboardHead({ pageIndex = 0, pageCount = 1 }) {
  return (
    <div className="leaderboard-head">
      <div className="leaderboard-head-title">
        <h2 className="panel-title">Leaderboard</h2>
        {pageCount > 1 && (
          <span className="leaderboard-page-dots" aria-label={`Page ${pageIndex + 1} of ${pageCount}`}>
            {Array.from({ length: pageCount }).map((_, i) => (
              <span
                key={i}
                className={`leaderboard-page-dot${i === pageIndex ? ' active' : ''}`}
                aria-hidden="true"
              />
            ))}
          </span>
        )}
      </div>
      <div className="courseware-line">
        <span>
          Courseware: <strong>Day Test For SAR21/M16 BTP</strong>
        </span>
        <span>
          Weapon Type: <strong>SAR21</strong>
        </span>
      </div>
    </div>
  )
}
