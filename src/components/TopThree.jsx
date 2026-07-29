function Wreath({ label, tone }) {
  return (
    <div className={`wreath wreath-${tone}`}>
      <svg viewBox="0 0 64 64" width="58" height="58" aria-hidden="true">
        <g fill="currentColor">
          <g transform="translate(32,32)">
            <ellipse rx="2.8" ry="6" transform="rotate(-38) translate(0,-19)" />
            <ellipse rx="2.8" ry="6" transform="rotate(-64) translate(0,-19)" />
            <ellipse rx="2.8" ry="6" transform="rotate(-90) translate(0,-19)" />
            <ellipse rx="2.8" ry="6" transform="rotate(-116) translate(0,-19)" />
            <ellipse rx="2.8" ry="6" transform="rotate(-142) translate(0,-19)" />
          </g>
          <g transform="translate(32,32) scale(-1,1)">
            <ellipse rx="2.8" ry="6" transform="rotate(-38) translate(0,-19)" />
            <ellipse rx="2.8" ry="6" transform="rotate(-64) translate(0,-19)" />
            <ellipse rx="2.8" ry="6" transform="rotate(-90) translate(0,-19)" />
            <ellipse rx="2.8" ry="6" transform="rotate(-116) translate(0,-19)" />
            <ellipse rx="2.8" ry="6" transform="rotate(-142) translate(0,-19)" />
          </g>
        </g>
      </svg>
      <span className="wreath-label">{label}</span>
    </div>
  )
}

export function PodiumColumn({ place, tone, entry, tall }) {
  return (
    <div className={`podium-col podium-${tone}${tall ? ' podium-tall' : ''}`}>
      <Wreath label={place} tone={tone} />
      <div className="podium-block">
        <div className="podium-top" />
        <div className="podium-score">
          <strong>{entry.score}</strong>&thinsp;/&thinsp;{entry.total}
        </div>
      </div>
      <div className="podium-names">
        {entry.names.map((n) => (
          <div key={n}>
            <strong>{n.split(' ')[0]}</strong> {n.split(' ').slice(1).join(' ')}
          </div>
        ))}
      </div>
      <div className={`mpi-pill mpi-${tone}`}>{entry.mpi}</div>
    </div>
  )
}

export default function TopThree({ data }) {
  return (
    <>
      <h2 className="panel-title">Top 3 Leaderboard</h2>
      <div className="courseware-line">
        <span>
          Courseware: <strong>Day Test For SAR21/M16 BTP</strong>
        </span>
        <span>
          Weapon Type: <strong>SAR21</strong>
        </span>
      </div>
      <div className="podium">
        <PodiumColumn place="2nd" tone="silver" entry={data.second} />
        <PodiumColumn place="1st" tone="gold" entry={data.first} tall />
        <PodiumColumn place="3rd" tone="bronze" entry={data.third} />
      </div>
    </>
  )
}
