const STATUS_CLASS = {
  Ongoing: 'status-pill-queue',
  Upcoming: '',
  Completed: 'status-pill-done',
}

export default function BookingList({ rows }) {
  return (
    <>
      <h2 className="panel-title">Booking List</h2>
      <table className="table booking-table">
        <colgroup>
          <col style={{ width: '21%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '6%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '11%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Training Mode</th>
            <th>Programme</th>
            <th>Level</th>
            <th>Start Date &amp; Time</th>
            <th>End Date &amp; Time</th>
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
              <td>
                <div>{row.startDate}</div>
                <div className="booking-time">{row.startTime}</div>
              </td>
              <td>
                <div>{row.endDate}</div>
                <div className="booking-time">{row.endTime}</div>
              </td>
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
