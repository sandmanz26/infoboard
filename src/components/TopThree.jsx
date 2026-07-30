// One side's leaves, from the open top end (angle closest to 0 = top
// dead-center, left mostly open like a real laurel wreath) sweeping down
// to the near-closed bottom (angle closest to 180 = bottom dead-center,
// bridged by the small stem circle below instead of quite touching) —
// sized larger up top and tapering down, matching a classic award
// wreath. Mirrored via scale(-1,1) for the other side instead of
// duplicating the list.
const WREATH_LEAVES = [
  { angle: 45, rx: 3.8, ry: 11 },
  { angle: 62, rx: 3.6, ry: 10.4 },
  { angle: 79, rx: 3.3, ry: 9.6 },
  { angle: 96, rx: 3.0, ry: 8.8 },
  { angle: 113, rx: 2.6, ry: 7.8 },
  { angle: 130, rx: 2.2, ry: 6.6 },
  { angle: 147, rx: 1.9, ry: 5.4 },
  { angle: 164, rx: 1.6, ry: 4.2 },
]

function Wreath({ label, tone }) {
  return (
    <div className={`wreath wreath-${tone}`}>
      <svg viewBox="0 0 64 64" width="58" height="58" aria-hidden="true">
        <g fill="currentColor">
          <g transform="translate(32,36)">
            {WREATH_LEAVES.map(({ angle, rx, ry }) => (
              <ellipse key={angle} rx={rx} ry={ry} transform={`rotate(${angle}) translate(0,-19)`} />
            ))}
          </g>
          <g transform="translate(32,36) scale(-1,1)">
            {WREATH_LEAVES.map(({ angle, rx, ry }) => (
              <ellipse key={angle} rx={rx} ry={ry} transform={`rotate(${angle}) translate(0,-19)`} />
            ))}
          </g>
          {/* The small stem joining both branches at the bottom, closing
              the wreath's open end. */}
          <circle cx="32" cy="54" r="2.4" />
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
