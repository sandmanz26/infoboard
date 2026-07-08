import { stations } from '../data.js'

const ROUTE_START = [150, 95]

export default function Directory({ activeStation = 'IMT-01' }) {
  const active = stations.find((s) => s.id === activeStation) ?? stations[0]
  const [ax, ay] = active.bayCenter
  const midX = (ROUTE_START[0] + ax) / 2
  const midY = Math.min(ROUTE_START[1], ay) - 18

  return (
    <>
      <h2 className="panel-title">Directory</h2>
      <p className="directory-desc">
        Shooting detail can now follow the directory map to your base station ({activeStation}).
      </p>
      <div className="directory-map">
        <svg viewBox="0 0 620 260" role="img" aria-label={`Directory map to base station ${activeStation}`}>
          {/* floor slab */}
          <polygon points="10,120 310,40 610,120 310,205" fill="#d9d9dc" />
          <polygon points="10,120 310,205 310,225 10,140" fill="#bdbdc2" />
          <polygon points="610,120 310,205 310,225 610,140" fill="#c9c9ce" />

          {/* briefing rooms block (top-left) */}
          <g>
            <polygon points="60,78 165,50 245,72 140,102" fill="#57575e" />
            <polygon points="60,78 140,102 140,60 60,38" fill="#3f3f46" transform="translate(0,0)" />
            <polygon points="60,38 165,12 245,32 245,72 165,50 60,78" fill="#4a4a52" />
            <text x="105" y="58" fill="#e6e6e6" fontSize="11" transform="rotate(-14 105 58)">
              Briefing Room
            </text>
            <text x="150" y="82" fill="#e6e6e6" fontSize="11" transform="rotate(-14 150 82)">
              Briefing Room
            </text>
          </g>

          {/* right cluster of small rooms */}
          <g fill="#e8e8ea" stroke="#b5b5bb" strokeWidth="2">
            <polygon points="430,70 520,48 600,70 510,94" />
            <polygon points="470,100 560,78 620,96 530,120" fill="#efeff1" />
            <polygon points="405,95 460,82 515,96 460,110" fill="#e2e2e5" />
          </g>

          {/* four lane bays — the active station is shown at full color,
              the other three dim so the current bay reads at a glance */}
          <g stroke="#ffffff" strokeWidth="3">
            {stations.map((s) => (
              <polygon
                key={s.id}
                points={{
                  'IMT-01': '70,150 170,122 265,148 165,178',
                  'IMT-02': '185,127 285,100 380,126 280,155',
                  'IMT-03': '300,105 400,80 495,105 395,133',
                  'IMT-04': '415,84 510,62 600,84 505,110',
                }[s.id]}
                fill={s.bayFill}
                opacity={s.id === activeStation ? 1 : 0.4}
              />
            ))}
          </g>

          {/* labels for the bays that are not currently active */}
          {stations
            .filter((s) => s.id !== activeStation)
            .map((s) => (
              <text
                key={s.id}
                x={s.bayCenter[0]}
                y={s.bayCenter[1]}
                fill="#5b5b63"
                fontSize="10"
                textAnchor="middle"
                transform={`rotate(-14 ${s.bayCenter[0]} ${s.bayCenter[1]})`}
              >
                {s.id}
              </text>
            ))}

          {/* route from briefing room to the active bay */}
          <path
            d={`M${ROUTE_START[0]} ${ROUTE_START[1]} Q ${midX} ${midY} ${ax} ${ay}`}
            fill="none"
            stroke="#8a1f1f"
            strokeWidth="3"
            strokeDasharray="7 5"
          />
          <text x="158" y="90" fill="#8a1f1f" fontSize="11" fontWeight="700" transform="rotate(-14 158 90)">
            You are Here!
          </text>

          {/* destination marker on the active bay */}
          <g transform={`translate(${ax},${ay})`}>
            <rect x="-22" y="-9" width="44" height="18" rx="4" fill="#8a1f1f" />
            <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
              {activeStation}
            </text>
          </g>
        </svg>
      </div>
    </>
  )
}
