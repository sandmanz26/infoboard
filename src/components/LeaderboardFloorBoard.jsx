import { PodiumColumn } from './TopThree.jsx'
import { Medal } from './Leaderboard.jsx'
import {
  leaderboardFloorInfo,
  leaderboardFloorPodium,
  leaderboardFloorLocalRows,
  leaderboardFloorGlobalRows,
} from '../data.js'

// Local panel: this unit's own booking, a Top 3 podium, then rank 4+ in
// a plain table — reuses the same PodiumColumn/table markup as the
// Layouts 1-3 sidebar version, just with its own banner header instead
// of that panel's compact title.
function LocalLeaderboardPanel() {
  return (
    <section className="panel leaderboard-floor-panel">
      <div className="leaderboard-floor-banner leaderboard-floor-banner-local">Local Leaderboard</div>
      <div className="leaderboard-floor-body">
        <div className="leaderboard-floor-info">
          <div>
            <div className="leaderboard-floor-info-title">{leaderboardFloorInfo.title}</div>
            <div className="leaderboard-floor-info-sub">
              Booking ID - {leaderboardFloorInfo.bookingId} | Unit Name - {leaderboardFloorInfo.unitName}
            </div>
          </div>
          <div className="leaderboard-floor-info-right">
            <span>
              Courseware: <strong>{leaderboardFloorInfo.courseware}</strong>
            </span>
            <span>
              Weapon Type: <strong>{leaderboardFloorInfo.weaponType}</strong>
            </span>
          </div>
        </div>
        <div className="podium">
          <PodiumColumn place="2nd" tone="silver" entry={leaderboardFloorPodium.second} />
          <PodiumColumn place="1st" tone="gold" entry={leaderboardFloorPodium.first} tall />
          <PodiumColumn place="3rd" tone="bronze" entry={leaderboardFloorPodium.third} />
        </div>
        <table className="table leaderboard-table">
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th>MPI (mm)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardFloorLocalRows.map((row) => (
              <tr key={row.name}>
                <td>
                  <span className="ranking-number">{row.ranking}</span>
                </td>
                <td>{row.rank}</td>
                <td className="name-cell" title={row.name}>
                  {row.name}
                </td>
                <td>{row.score}</td>
                <td>{row.mpi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// Global panel: no podium — with trainees from multiple units, ties at
// the top are common, so every 1st/2nd/3rd finisher gets its own row
// with a medal instead of only the single top scorer.
function GlobalLeaderboardPanel() {
  return (
    <section className="panel leaderboard-floor-panel">
      <div className="leaderboard-floor-banner leaderboard-floor-banner-global">Global Leaderboard</div>
      <div className="leaderboard-floor-body">
        <div className="leaderboard-floor-info leaderboard-floor-info-compact">
          <span>
            Courseware: <strong>{leaderboardFloorInfo.courseware}</strong>
          </span>
          <span>
            Weapon Type: <strong>{leaderboardFloorInfo.weaponType}</strong>
          </span>
        </div>
        <table className="table leaderboard-table">
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Rank</th>
              <th>Name</th>
              <th>Unit Name</th>
              <th>Score</th>
              <th>MPI (mm)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardFloorGlobalRows.map((row, index) => (
              <tr key={`${row.name}-${index}`} className={row.medal ? `leaderboard-row-${row.medal}` : undefined}>
                <td>
                  {row.medal ? (
                    <Medal medal={row.medal} label={row.ranking} />
                  ) : (
                    <span className="ranking-number">{row.ranking}</span>
                  )}
                </td>
                <td>{row.rank}</td>
                <td className="name-cell" title={row.name}>
                  {row.name}
                </td>
                <td>{row.unitName}</td>
                <td>{row.score}</td>
                <td>{row.mpi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function LeaderboardFloorBoard() {
  return (
    <main className="layout layout-leaderboard-floor">
      <LocalLeaderboardPanel />
      <GlobalLeaderboardPanel />
    </main>
  )
}
