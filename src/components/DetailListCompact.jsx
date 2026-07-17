// All rows in one dense table — no pagination, no rotation. Built for TV
// display where scrolling isn't an option: every row must fit on screen.
export default function DetailListCompact({ rows, title = 'Detail List', status, hideNo }) {
  return (
    <>
      <div className="detail-panel-head">
        <h2 className="panel-title">{title}</h2>
        {status && (
          <span className={`status-pill${status === 'Queue' ? ' status-pill-queue' : ''}`}>
            {status}
          </span>
        )}
      </div>
      <table className="table detail-table-compact">
        <thead>
          <tr>
            {!hideNo && <th className="no-cell">No</th>}
            <th className="rank-cell">Rank</th>
            <th>Name</th>
            <th>Status</th>
            <th className="weapon-cell">Weapon</th>
            <th>Lane</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.no}>
              {!hideNo && <td className="no-cell">{row.no}</td>}
              <td className="rank-cell">{row.rank}</td>
              <td className="name-cell" title={row.name}>
                {row.name}
              </td>
              <td>
                <span className="status-pill">{row.status}</span>
              </td>
              <td className="weapon-cell" title={row.weapon}>
                {row.weapon}
              </td>
              <td>{row.lane}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
