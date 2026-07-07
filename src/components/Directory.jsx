export default function Directory() {
  return (
    <>
      <h2 className="panel-title">Directory</h2>
      <p className="directory-desc">
        Shooting detail can now follow the directory map to your base station (IMT-01).
      </p>
      <div className="directory-map">
        <svg viewBox="0 0 620 260" role="img" aria-label="Directory map to base station IMT-01">
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

          {/* four colored lane bays */}
          <g stroke="#ffffff" strokeWidth="3">
            <polygon points="70,150 170,122 265,148 165,178" fill="#e05252" />
            <polygon points="185,127 285,100 380,126 280,155" fill="#7ec84f" />
            <polygon points="300,105 400,80 495,105 395,133" fill="#9b6fd6" />
            <polygon points="415,84 510,62 600,84 505,110" fill="#f2d13c" />
          </g>

          {/* bay labels */}
          <text x="325" y="130" fill="#3d6b1e" fontSize="10" transform="rotate(-14 325 130)">IMT-02</text>
          <text x="440" y="108" fill="#4a2f78" fontSize="10" transform="rotate(-14 440 108)">IMT-03</text>
          <text x="548" y="88" fill="#7a6410" fontSize="10" transform="rotate(-14 548 88)">IMT-04</text>

          {/* route from briefing room to red bay */}
          <path
            d="M150 92 q18 14 8 26 q-10 12 -30 22 q22 4 20 14"
            fill="none"
            stroke="#e02424"
            strokeWidth="3"
            strokeDasharray="7 5"
          />
          <text x="158" y="90" fill="#e02424" fontSize="11" fontWeight="700" transform="rotate(-14 158 90)">
            You are Here!
          </text>

          {/* destination marker inside red bay */}
          <g transform="translate(148,152)">
            <rect x="-11" y="-8" width="22" height="16" rx="3" fill="#b91c1c" />
            <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">
              IMT-01
            </text>
          </g>
        </svg>
      </div>
    </>
  )
}
