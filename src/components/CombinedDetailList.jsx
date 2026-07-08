import { Fragment } from 'react'

function GroupHeadCell({ title, status }) {
  return (
    <div className="detail-group-head">
      <span className="detail-group-title">{title}</span>
      <span className={`status-pill${status === 'Queue' ? ' status-pill-queue' : ''}`}>
        {status}
      </span>
    </div>
  )
}

// One shared "Lane" column on the left instead of repeating Lane 1..N
// inside every detail group — every group already runs the same lane
// sequence, so a per-group column just duplicated the same numbers.
function UnifiedTable({ groups, statuses, merged }) {
  const rowCount = Math.max(...groups.map((g) => g.length))

  return (
    <table className={`table combined-table combined-table-unified${merged ? ' table-two' : ''}`}>
      <thead>
        <tr>
          <th className="lane-col" rowSpan={2} />
          {groups.map((_, gi) => (
            <th
              key={gi}
              colSpan={merged ? 2 : 3}
              className={`unified-group-head-cell${gi > 0 ? ' group-divider' : ''}`}
            >
              <GroupHeadCell title={`Detail ${gi + 1}`} status={statuses[gi]} />
            </th>
          ))}
        </tr>
        <tr>
          {groups.map((_, gi) => (
            <Fragment key={gi}>
              {merged ? (
                <th className={`unified-sub-head${gi > 0 ? ' group-divider' : ''}`}>Trainee</th>
              ) : (
                <>
                  <th className={`unified-sub-head${gi > 0 ? ' group-divider' : ''}`}>Rank</th>
                  <th className="unified-sub-head">Name</th>
                </>
              )}
              <th className="unified-sub-head">Weapon</th>
            </Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rowCount }).map((_, ri) => (
          <tr key={ri}>
            <td className="lane-col">
              <span className="lane-tag">Lane {ri + 1}</span>
            </td>
            {groups.map((rows, gi) => {
              const row = rows[ri]
              return (
                <Fragment key={gi}>
                  {merged ? (
                    <td className={gi > 0 ? 'group-divider' : ''}>
                      {row && (
                        <span className="trainee-cell">
                          <span className="trainee-rank">{row.rank}</span>
                          <span className="trainee-name" title={row.name}>
                            {row.name}
                          </span>
                        </span>
                      )}
                    </td>
                  ) : (
                    <>
                      <td className={gi > 0 ? 'group-divider' : ''}>{row?.rank}</td>
                      <td className="name-cell" title={row?.name}>
                        {row?.name}
                      </td>
                    </>
                  )}
                  <td>{row?.weapon}</td>
                </Fragment>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function UnifiedCards({ groups, statuses }) {
  const rowCount = Math.max(...groups.map((g) => g.length))

  return (
    <div className="unified-card-grid" style={{ '--group-count': groups.length }}>
      <div className="unified-card-cell unified-card-corner" />
      {groups.map((_, gi) => (
        <div
          className={`unified-card-cell unified-card-head${gi > 0 ? ' group-divider' : ''}`}
          key={gi}
        >
          <GroupHeadCell title={`Detail ${gi + 1}`} status={statuses[gi]} />
        </div>
      ))}
      {Array.from({ length: rowCount }).map((_, ri) => (
        <Fragment key={ri}>
          <div className="unified-card-cell unified-card-lane">
            <span className="lane-tag">Lane {ri + 1}</span>
          </div>
          {groups.map((rows, gi) => {
            const row = rows[ri]
            return (
              <div className={`unified-card-cell${gi > 0 ? ' group-divider' : ''}`} key={gi}>
                {row && (
                  <div className="detail-card">
                    <div className="detail-card-name" title={row.name}>
                      <span className="trainee-rank">{row.rank}</span> {row.name}
                    </div>
                    <div className="detail-card-weapon">{row.weapon}</div>
                  </div>
                )}
              </div>
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}

export default function CombinedDetailList({ groups, statuses, tableModel, title = 'Detail List' }) {
  return (
    <section className="panel combined-detail-panel">
      <h2 className="panel-title">{title}</h2>
      {tableModel === 'card' ? (
        <UnifiedCards groups={groups} statuses={statuses} />
      ) : (
        <UnifiedTable groups={groups} statuses={statuses} merged={tableModel === 'table2'} />
      )}
    </section>
  )
}
