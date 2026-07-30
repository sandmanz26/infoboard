import { PodiumColumn } from './TopThree.jsx'
import { Medal } from './Leaderboard.jsx'
import {
  leaderboardFloorInfo,
  leaderboardFloorPodium,
  leaderboardFloorLocalRows,
  leaderboardFloorGlobalCoursewares,
} from '../data.js'

// Local panel: this unit's own booking, an optional Top 3 podium, then
// rank 4+ (or the full table when the podium's hidden) in a plain table
// — reuses the same PodiumColumn/table markup as the Layouts 1-3 sidebar
// version, just with its own banner header instead of that panel's
// compact title.
function LocalLeaderboardPanel({ showPodium, rowCount }) {
  const visibleRows = leaderboardFloorLocalRows.slice(0, rowCount)
  const tableRows = showPodium ? visibleRows.filter((row) => !row.medal) : visibleRows
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
              <strong>{leaderboardFloorInfo.courseware}</strong>
            </span>
            <span>
              <strong>{leaderboardFloorInfo.weaponType}</strong>
            </span>
          </div>
        </div>
        {showPodium && (
          <div className="podium">
            <PodiumColumn place="2nd" tone="silver" entry={leaderboardFloorPodium.second} />
            <PodiumColumn place="1st" tone="gold" entry={leaderboardFloorPodium.first} tall />
            <PodiumColumn place="3rd" tone="bronze" entry={leaderboardFloorPodium.third} />
          </div>
        )}
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
            {tableRows.map((row, index) => (
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

// One courseware's slice of the Global panel — no podium (with trainees
// from multiple units, ties at the top are common, so every 1st/2nd/3rd
// finisher gets its own row with a medal instead of collapsing to one
// row per medal), and no Unit Name column here — at 4-across width
// there's no room for it, and the courseware name in the banner already
// says which cross-unit board this is.
function GlobalCoursewarePanel({ courseware, weaponType, rows, rowCount }) {
  const visibleRows = rows.slice(0, rowCount)
  return (
    <section className="panel leaderboard-floor-panel">
      <div className="leaderboard-floor-banner leaderboard-floor-banner-global">Global Leaderboard</div>
      <div className="leaderboard-floor-body leaderboard-floor-body-narrow">
        <div className="leaderboard-floor-info leaderboard-floor-info-narrow">
          <span>
            <strong>{courseware}</strong>
          </span>
          <span>
            <strong>{weaponType}</strong>
          </span>
        </div>
        <table className="table leaderboard-table leaderboard-table-narrow">
          <thead>
            <tr>
              {/* "Rank" instead of "Ranking" — there's no separate
                  trainee-rank column here (dropped for space), so it's
                  unambiguous, and short enough not to collide with Name
                  at this column width. */}
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th>MPI</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => (
              <tr key={`${row.name}-${index}`} className={row.medal ? `leaderboard-row-${row.medal}` : undefined}>
                <td>
                  {row.medal ? (
                    <Medal medal={row.medal} label={row.ranking} />
                  ) : (
                    <span className="ranking-number">{row.ranking}</span>
                  )}
                </td>
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

export default function LeaderboardFloorBoard({
  columnRatios,
  showPodium,
  globalCount,
  fontScale,
  rowScale = 1,
  globalRowCount,
  localRowCount,
  slidePairIndex,
  styleVariant = 'classic',
}) {
  // Slide (only meaningful at globalCount === 2): instead of always
  // showing the first 2 courseware, page through the 4 in pairs — pair 0
  // = courseware 1&2, pair 1 = courseware 3&4, wrapping back to pair 0.
  // At any other Global Panels count, slidePairIndex is always 0 (see
  // App.jsx), so this is just .slice(0, globalCount), same as before.
  const pairCount = Math.max(1, Math.ceil(leaderboardFloorGlobalCoursewares.length / globalCount))
  const pairStart = (slidePairIndex % pairCount) * globalCount
  const visibleCoursewares = leaderboardFloorGlobalCoursewares.slice(pairStart, pairStart + globalCount)
  // Only take as many ratio weights as there are panels on screen (Local
  // + however many Global courseware panels are showing) — CSS grid's fr
  // units then re-normalize against that smaller total on their own, so
  // dropping from 4 Global panels to 2 stretches each of the remaining
  // ones wider instead of leaving a gap where the other two were.
  const gridTemplateColumns = [columnRatios[0], ...columnRatios.slice(1, 1 + globalCount)]
    .map((ratio) => `${ratio}fr`)
    .join(' ')
  return (
    <main
      className={`layout layout-leaderboard-floor${styleVariant === 'v2' ? ' layout-leaderboard-floor-v2' : ''}`}
      style={{ gridTemplateColumns, '--lb-font-scale': fontScale, '--lb-row-scale': rowScale }}
    >
      <LocalLeaderboardPanel showPodium={showPodium} rowCount={localRowCount} />
      {visibleCoursewares.map((entry) => (
        <GlobalCoursewarePanel key={entry.courseware} {...entry} rowCount={globalRowCount} />
      ))}
    </main>
  )
}
