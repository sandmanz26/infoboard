import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Wreath } from './TopThree.jsx'
import {
  imtLeaderboardInfo,
  imtLeaderboardLocalRows,
  imtLeaderboardGlobalPodium,
  imtLeaderboardGlobalRows,
} from '../data.js'

// "Takeover Effect" switcher (App.jsx, IMT_L only) — rank 11 (Farid Bin
// Osman) leapfrogs into a joint-3rd, ahead of the existing bronze tier,
// to demo a dramatic live-standings shake-up. The row is spliced out of
// its old slot and back in right after 2nd, relabeled '3rd'/bronze — the
// rest of the table's numbers are left alone (a real recompute would
// renumber everyone between old and new position, but this is a display
// effect, not a scoring engine, and the visual move already tells the
// story on its own).
const TAKEOVER_SOURCE_RANKING = '11'
const TAKEOVER_MOVER_NAME = imtLeaderboardLocalRows.find((r) => r.ranking === TAKEOVER_SOURCE_RANKING)?.name

function applyTakeoverRows(rows) {
  const fromIndex = rows.findIndex((r) => r.ranking === TAKEOVER_SOURCE_RANKING)
  if (fromIndex === -1) return rows
  const mover = { ...rows[fromIndex], ranking: '3rd', medal: 'bronze' }
  const rest = rows.filter((_, i) => i !== fromIndex)
  const thirdIndex = rest.findIndex((r) => r.ranking === '3rd')
  const insertAt = thirdIndex === -1 ? rest.length : thirdIndex
  return [...rest.slice(0, insertAt), mover, ...rest.slice(insertAt)]
}

// IMT_L level — a fixed replica of a reference design: unlike the
// Leaderboard floor above, the Local panel here is a plain table (no
// podium, medal rows read a small inline wreath badge instead) and the
// Global panel carries BOTH a podium and its own continuation table for
// rank 4 onward. No switchers — this level intentionally matches the
// reference pixel-for-pixel rather than being configurable.

// A full circular award wreath (closed loop, small sparkle-filled gap at
// the top) with a large centered label — visually distinct from
// TopThree's own Wreath (an intentionally *open* laurel, used elsewhere
// in the app), so it's a separate, local component rather than a shared
// one, to avoid disturbing that other design. Both leaf arcs run from
// just past the top gap (12°) down to the bottom (172°, closed by the
// block below rather than a stem), mirrored via scale(-1,1).
const IMT_WREATH_LEAF_ANGLES = [12, 32, 52, 72, 92, 112, 132, 152, 172]

function ImtWreath({ label, tone }) {
  return (
    <div className={`imt-wreath imt-wreath-${tone}`}>
      <svg viewBox="0 0 100 100" width="150" height="150" aria-hidden="true">
        <g fill="currentColor">
          <g transform="translate(50,54)">
            {IMT_WREATH_LEAF_ANGLES.map((angle) => (
              <ellipse key={angle} rx={4.2} ry={10.5} transform={`rotate(${angle}) translate(0,-34)`} />
            ))}
          </g>
          <g transform="translate(50,54) scale(-1,1)">
            {IMT_WREATH_LEAF_ANGLES.map((angle) => (
              <ellipse key={angle} rx={4.2} ry={10.5} transform={`rotate(${angle}) translate(0,-34)`} />
            ))}
          </g>
          {/* Small twinkle marks filling the open top gap. */}
          <path d="M50 6l1.6 4.4L56 12l-4.4 1.6L50 18l-1.6-4.4L44 12l4.4-1.6z" />
          <path d="M35 13l1 2.8L38.8 17l-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1z" />
          <path d="M65 13l1 2.8L68.8 17l-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1z" />
        </g>
      </svg>
      <span className="imt-wreath-label">{label}</span>
    </div>
  )
}

function TrophyIcon({ tone }) {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" className={`imt-trophy imt-trophy-${tone}`}>
      <path
        fill="currentColor"
        d="M7 2h10v2h3v2.5a4 4 0 0 1-4 4h-.06A5.5 5.5 0 0 1 13 13.86V16h3.5v2h-9v-2H11v-2.14A5.5 5.5 0 0 1 8.06 10.5H8a4 4 0 0 1-4-4V4h3V2zm-3 4v.5A2 2 0 0 0 6 8.4V6H4zm14 0v2.4A2 2 0 0 0 20 6.5V6h-2z"
      />
      <path fill="#fff" opacity="0.85" d="M12 4.5l.7 1.6 1.7.2-1.3 1.1.4 1.6-1.5-.9-1.5.9.4-1.6-1.3-1.1 1.7-.2z" />
    </svg>
  )
}

function ImtPodiumColumn({ place, tone, entry, tall }) {
  return (
    <div className={`imt-podium-col imt-podium-${tone}${tall ? ' imt-podium-tall' : ''}`}>
      <div className="imt-podium-topgroup">
        <div className="imt-podium-trophy-wrap">
          <TrophyIcon tone={tone} />
        </div>
        <ImtWreath label={place} tone={tone} />
      </div>
      <div className="imt-podium-block">
        <span className="imt-podium-score-pill">
          {entry.score}
          <span className="imt-podium-score-total">/{entry.total}</span>
        </span>
        <div className="imt-podium-names">
          {entry.names.map((n) => {
            const [rank, ...rest] = n.split(' ')
            return (
              <div key={n}>
                {rank} <strong>{rest.join(' ')}</strong>
              </div>
            )
          })}
        </div>
        <div className={`mpi-pill mpi-${tone} imt-podium-mpi`}>{entry.mpi}</div>
      </div>
    </div>
  )
}

function ImtRankingCell({ row }) {
  if (row.medal) return <Wreath label={row.ranking} tone={row.medal} size={30} />
  return <span className="ranking-number">{row.ranking}</span>
}

function ImtLeaderboardTable({ rows, rowRef, moverName }) {
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
        {rows.map((row, index) => {
          const isMover = row.name === moverName
          return (
            <tr
              key={row.name}
              ref={rowRef ? (el) => rowRef(row.name, el) : undefined}
              className={`${row.medal ? `leaderboard-row-${row.medal}` : ''}${isMover ? ' imt-row-mover' : ''}`.trim() || undefined}
            >
              <td>
                <ImtRankingCell row={row} />
              </td>
              <td>{row.rank}</td>
              <td className="name-cell" title={row.name}>
                {row.name}
                {isMover && <span className="imt-row-mover-badge">▲ Joint 3rd</span>}
              </td>
              <td>{row.unitName}</td>
              <td>
                {row.score} / {row.total}
              </td>
              <td>{row.mpi}</td>
            </tr>
          )
        })}
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

function ImtLocalPanel({ takeoverActive }) {
  const rows = useMemo(
    () => (takeoverActive ? applyTakeoverRows(imtLeaderboardLocalRows) : imtLeaderboardLocalRows),
    [takeoverActive]
  )

  // FLIP animation: every row (not just the mover) gets its position
  // change animated, since splicing one row out of the middle and back
  // in a few slots up shifts everyone between the two spots down by one
  // — letting that whole block slide together, while the mover itself
  // flies past them, is what actually reads as a "takeover" rather than
  // a row just silently teleporting to a new spot.
  const rowEls = useRef({})
  const prevRects = useRef({})
  const registerRow = (name, el) => {
    if (el) rowEls.current[name] = el
    else delete rowEls.current[name]
  }
  useLayoutEffect(() => {
    const nextRects = {}
    for (const [name, el] of Object.entries(rowEls.current)) {
      const rect = el.getBoundingClientRect()
      nextRects[name] = rect
      const prev = prevRects.current[name]
      const deltaY = prev ? prev.top - rect.top : 0
      if (deltaY) {
        el.style.transition = 'none'
        el.style.transform = `translateY(${deltaY}px)`
        el.getBoundingClientRect() // force reflow before releasing the transition
        requestAnimationFrame(() => {
          el.style.transition = 'transform 750ms cubic-bezier(0.22, 1, 0.36, 1)'
          el.style.transform = ''
        })
      }
    }
    prevRects.current = nextRects
  }, [rows])

  // A brief announcement banner on the way *in* only (not on revert) —
  // self-clears instead of lingering once the row has settled into place.
  const [showBanner, setShowBanner] = useState(false)
  const wasActive = useRef(takeoverActive)
  useEffect(() => {
    if (takeoverActive && !wasActive.current) {
      setShowBanner(true)
      const t = setTimeout(() => setShowBanner(false), 3200)
      wasActive.current = takeoverActive
      return () => clearTimeout(t)
    }
    wasActive.current = takeoverActive
  }, [takeoverActive])

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
        {showBanner && (
          <div className="imt-takeover-banner">
            🔥 <strong>{TAKEOVER_MOVER_NAME}</strong> surges from 11th to Joint 3rd!
          </div>
        )}
        <ImtLeaderboardTable rows={rows} rowRef={registerRow} moverName={takeoverActive ? TAKEOVER_MOVER_NAME : null} />
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

export default function ImtLeaderboardBoard({ takeoverActive = false }) {
  return (
    <main className="layout layout-imt-leaderboard">
      <ImtLocalPanel takeoverActive={takeoverActive} />
      <ImtGlobalPanel />
    </main>
  )
}
