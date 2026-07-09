import PageDots from './PageDots.jsx'

const STATUS_CLASS = {
  Ongoing: 'status-pill-queue',
  Upcoming: '',
  Completed: 'status-pill-done',
}

export default function BookingList({ rows, pageIndex, pageCount }) {
  return (
    <>
      <div className="detail-panel-head">
        <h2 className="panel-title">Booking List</h2>
        <PageDots pageIndex={pageIndex} pageCount={pageCount} />
      </div>
      <table className="table booking-table">
        <colgroup>
          <col style={{ width: '26%' }} />
          <col style={{ width: '14%' }} />
          <col style={{ width: '16%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Training Mode</th>
            <th>Programme</th>
            <th>Level</th>
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
              <td>{row.level}</td>
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
