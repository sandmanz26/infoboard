// All rows in one dense table — no pagination, no rotation. Built for TV
// display where scrolling isn't an option: every row must fit on screen.
export default function DetailListCompact({ rows, title = 'Detail List', status, hideNo, splitRank }) {
  return (
    <>
      <div className="detail-panel-head">
        <h2 className="panel-title">{title}</h2>
        {status && (
          <span className={`status-pill${status === 'Queue' || status === 'Ongoing' ? ' status-pill-queue' : ''}`}>
            {status}
          </span>
        )}
      </div>
      <table className="table detail-table-compact">
        <thead>
          <tr>
            {!hideNo && <th className="no-cell">No</th>}
            <th className="rank-cell">Rank</th>
            <th className="name-cell">Name</th>
            <th className="status-cell">Status</th>
            <th className="weapon-cell">Weapon</th>
            <th className={splitRank ? 'lane-cell' : undefined}>Lane</th>
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
              <td className="status-cell">
                <span className="status-pill">{row.status}</span>
              </td>
              <td className="weapon-cell" title={row.weapon}>
                {row.weapon}
              </td>
              {/* Layout 5 (splitRank) drops the redundant "Lane " prefix
                  repeated on every row now that the column is narrow. */}
              <td className={splitRank ? 'lane-cell' : undefined}>
                {splitRank ? String(row.lane).replace(/^Lane\s*/i, '') : row.lane}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
