import PageDots from './PageDots.jsx'

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

function StatIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 6v4.3l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function BookingList({ rows, pageIndex, pageCount, stats }) {
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
      <div className="detail-panel-head">
        <h2 className="panel-title">Today's Booking</h2>
        <PageDots pageIndex={pageIndex} pageCount={pageCount} />
      </div>
      <table className="table booking-table">
        <colgroup>
          <col style={{ width: '27%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '9%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Training Mode</th>
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
              <td>{row.mode}</td>
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
