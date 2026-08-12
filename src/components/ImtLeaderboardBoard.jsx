import { Wreath } from './TopThree.jsx'
import {
  imtLeaderboardInfo,
  imtLeaderboardLocalRows,
  imtLeaderboardGlobalPodium,
  imtLeaderboardGlobalRows,
} from '../data.js'

// IMT_L level — a fixed replica of a reference design: unlike the
// Leaderboard floor above, the Local panel here is a plain table (no
// podium, medal rows read a small inline wreath badge instead) and the
// Global panel carries BOTH a podium and its own continuation table for
// rank 4 onward. No switchers — this level intentionally matches the
// reference pixel-for-pixel rather than being configurable.
function TrophyIcon({ tone }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className={`imt-trophy imt-trophy-${tone}`}>
      <path
        fill="currentColor"
        d="M7 2h10v2h3v2.5a4 4 0 0 1-4 4h-.06A5.5 5.5 0 0 1 13 13.86V16h3.5v2h-9v-2H11v-2.14A5.5 5.5 0 0 1 8.06 10.5H8a4 4 0 0 1-4-4V4h3V2zm-3 4v.5A2 2 0 0 0 6 8.4V6H4zm14 0v2.4A2 2 0 0 0 20 6.5V6h-2z"
      />
    </svg>
  )
}

function ImtPodiumColumn({ place, tone, entry, tall }) {
  return (
    <div className={`imt-podium-col imt-podium-${tone}${tall ? ' imt-podium-tall' : ''}`}>
      <TrophyIcon tone={tone} />
      <Wreath label={place} tone={tone} size={44} />
      <div className="imt-podium-block">
        <span className="imt-podium-score-pill">
          {entry.score}
          <span className="imt-podium-score-total">/{entry.total}</span>
        </span>
      </div>
      <div className="podium-names">
        {entry.names.map((n) => {
          const [rank, ...rest] = n.split(' ')
          return (
            <div key={n}>
              <strong>{rank}</strong> {rest.join(' ')}
            </div>
          )
        })}
      </div>
      <div className={`mpi-pill mpi-${tone}`}>{entry.mpi}</div>
    </div>
  )
}

function ImtRankingCell({ row }) {
  if (row.medal) return <Wreath label={row.ranking} tone={row.medal} size={30} />
  return <span className="ranking-number">{row.ranking}</span>
}

function ImtLeaderboardTable({ rows }) {
  return (
    <table className="table leaderboard-table imt-leaderboard-table">
      <thead>
        <tr>
          <th>Ranking</th>
          <th>Rank</th>
          <th>Name</th>
          <th>Unit Name</th>
          <th>Total</th>
          <th>MPI(mm)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.name}-${index}`} className={row.medal ? `leaderboard-row-${row.medal}` : undefined}>
            <td>
              <ImtRankingCell row={row} />
            </td>
            <td>{row.rank}</td>
            <td className="name-cell" title={row.name}>
              {row.name}
            </td>
            <td>{row.unitName}</td>
            <td>
              {row.score} / {row.total}
            </td>
            <td>{row.mpi}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ImtInfoRight() {
  return (
    <div className="leaderboard-floor-info-right">
      <span>
        Category : <strong>{imtLeaderboardInfo.category}</strong>
      </span>
      <span>
        Weapon Type : <strong>{imtLeaderboardInfo.weaponType}</strong>
      </span>
    </div>
  )
}

function ImtLocalPanel() {
  return (
    <section className="panel leaderboard-floor-panel">
      <div className="leaderboard-floor-banner leaderboard-floor-banner-local">Local Leaderboard</div>
      <div className="leaderboard-floor-body">
        <div className="leaderboard-floor-info">
          <div>
            <div className="leaderboard-floor-info-title">{imtLeaderboardInfo.title}</div>
            <div className="leaderboard-floor-info-sub">
              Booking ID - {imtLeaderboardInfo.bookingId} | Unit Name - {imtLeaderboardInfo.unitName}
            </div>
          </div>
          <ImtInfoRight />
        </div>
        <ImtLeaderboardTable rows={imtLeaderboardLocalRows} />
      </div>
    </section>
  )
}

function ImtGlobalPanel() {
  return (
    <section className="panel leaderboard-floor-panel">
      <div className="leaderboard-floor-banner leaderboard-floor-banner-global">Global Leaderboard</div>
      <div className="leaderboard-floor-body">
        <div className="leaderboard-floor-info imt-leaderboard-info-global">
          <ImtInfoRight />
        </div>
        <div className="imt-podium">
          <ImtPodiumColumn place="2nd" tone="silver" entry={imtLeaderboardGlobalPodium.second} />
          <ImtPodiumColumn place="1st" tone="gold" entry={imtLeaderboardGlobalPodium.first} tall />
          <ImtPodiumColumn place="3rd" tone="bronze" entry={imtLeaderboardGlobalPodium.third} />
        </div>
        <ImtLeaderboardTable rows={imtLeaderboardGlobalRows} />
      </div>
    </section>
  )
}

export default function ImtLeaderboardBoard() {
  return (
    <main className="layout layout-imt-leaderboard">
      <ImtLocalPanel />
      <ImtGlobalPanel />
    </main>
  )
}
