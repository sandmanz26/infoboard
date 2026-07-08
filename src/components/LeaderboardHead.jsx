import PageDots from './PageDots.jsx'

export default function LeaderboardHead({ pageIndex = 0, pageCount = 1 }) {
  return (
    <div className="leaderboard-head">
      <div className="leaderboard-head-title">
        <h2 className="panel-title">Leaderboard</h2>
        <PageDots pageIndex={pageIndex} pageCount={pageCount} />
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
