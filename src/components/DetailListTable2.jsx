import PageDots from './PageDots.jsx'

export default function DetailListTable2({ rows, title = 'Detail List', status = 'Ready', pageIndex, pageCount }) {
  return (
    <>
      <div className="detail-panel-head">
        <h2 className="panel-title">{title}</h2>
        <span className="detail-panel-head-meta">
          <span className={`status-pill${status === 'Queue' ? ' status-pill-queue' : ''}`}>
            {status}
          </span>
          <PageDots pageIndex={pageIndex} pageCount={pageCount} />
        </span>
      </div>
      <table className="table table-two">
        <thead>
          <tr>
            <th>No</th>
            <th>Trainee</th>
            <th>Weapon</th>
            <th>Lane</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.no}>
              <td>{row.no}</td>
              <td>
                <span className="trainee-cell">
                  <span className="trainee-rank">{row.rank}</span>
                  <span className="trainee-name" title={row.name}>
                    {row.name}
                  </span>
                </span>
              </td>
              <td>{row.weapon}</td>
              <td>{row.lane}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
