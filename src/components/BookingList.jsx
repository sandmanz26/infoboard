import PageLoadingBar from './PageLoadingBar.jsx'
import LevelIndicator from './LevelIndicator.jsx'
import { BOOKING_PAGE_INTERVAL_MS } from '../rotationConfig.js'

const STATUS_CLASS = {
  Ongoing: 'status-pill-queue',
  Upcoming: '',
  Completed: 'status-pill-done',
}

const STAT_CARDS = [
  { key: 'upcoming', label: 'Upcoming', tone: 'upcoming' },
  { key: 'ready', label: 'Ready', tone: 'ready' },
  { key: 'starting', label: 'Starting', tone: 'starting' },
]

// Column widths differ depending on whether the Training Mode column is
// showing, so the remaining columns can reclaim its share of the width.
const COLUMN_WIDTHS = {
  withMode: { id: '27%', mode: '13%', programme: '17%', start: '11%', end: '11%', instructor: '12%', status: '9%' },
  withoutMode: { id: '30%', programme: '23%', start: '12%', end: '12%', instructor: '13%', status: '10%' },
}

function StatIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 6v4.3l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function BookingList({ rows, levels, activeLevelId, pageIndex, stats, showTrainingMode }) {
  const widths = showTrainingMode ? COLUMN_WIDTHS.withMode : COLUMN_WIDTHS.withoutMode
  return (
    <>
      <div className="booking-stats">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className={`booking-stat-card booking-stat-${card.tone}`}>
            <span className="booking-stat-icon" aria-hidden="true">
              <StatIcon />
            </span>
            <div>
              <div className="booking-stat-value">{stats[card.key]}</div>
              <div className="booking-stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="booking-panel-head">
        <LevelIndicator levels={levels} active={activeLevelId} />
        <PageLoadingBar pageIndex={pageIndex} intervalMs={BOOKING_PAGE_INTERVAL_MS} />
      </div>
      <table className="table booking-table">
        <colgroup>
          <col style={{ width: widths.id }} />
          {showTrainingMode && <col style={{ width: widths.mode }} />}
          <col style={{ width: widths.programme }} />
          <col style={{ width: widths.start }} />
          <col style={{ width: widths.end }} />
          <col style={{ width: widths.instructor }} />
          <col style={{ width: widths.status }} />
        </colgroup>
        <thead>
          <tr>
            <th>Booking ID</th>
            {showTrainingMode && <th>Training Mode</th>}
            <th>Programme</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Instructor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.code}>
              <td>
                <div className="booking-unit">{row.unit}</div>
                <div className="booking-code">{row.code}</div>
              </td>
              {showTrainingMode && <td>{row.mode}</td>}
              <td>{row.programme}</td>
              <td className="booking-time">{row.startTime}</td>
              <td className="booking-time">{row.endTime}</td>
              <td>{row.instructor}</td>
              <td>
                <span className={`status-pill ${STATUS_CLASS[row.status]}`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
