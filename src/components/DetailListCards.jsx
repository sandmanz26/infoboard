import PageDots from './PageDots.jsx'

export default function DetailListCards({ rows, title = 'Detail List', status = 'Ready', pageIndex, pageCount }) {
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
      <div className="detail-cards">
        {rows.map((row) => (
          <div className="detail-card" key={row.no}>
            <div className="detail-card-top">
              <span className="detail-card-no">#{row.no}</span>
              <span className="detail-card-lane">{row.lane}</span>
            </div>
            <div className="detail-card-name" title={row.name}>
              <span className="trainee-rank">{row.rank}</span> {row.name}
            </div>
            <div className="detail-card-weapon">{row.weapon}</div>
          </div>
        ))}
      </div>
    </>
  )
}
