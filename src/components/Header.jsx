export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="brand">
          <div className="crest" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="40" height="40">
              <circle cx="20" cy="20" r="19" fill="#8a1f1f" />
              <circle cx="20" cy="20" r="15" fill="#fff" />
              <circle cx="20" cy="20" r="11" fill="#8a1f1f" />
              <path d="M20 11l2.2 5.2 5.6.5-4.3 3.7 1.3 5.5-4.8-3-4.8 3 1.3-5.5-4.3-3.7 5.6-.5z" fill="#f2c14e" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-line1">Training Resource</span>
            <span className="brand-line2">Management System</span>
          </div>
        </div>
        <div className="header-item">
          <div className="header-item-title">IMT For Training Team 1SIR</div>
          <div className="header-item-sub">260706-PLC001</div>
        </div>
        <div className="header-item">
          <div className="header-item-title">Unit Name</div>
          <div className="header-item-sub">1SIR</div>
        </div>
        <div className="header-tab">Infoboard</div>
      </div>
      <div className="header-right">
        <div className="header-item detail-station">
          <div className="header-item-title">Detail 2</div>
          <div className="header-item-sub">IMT-01</div>
        </div>
        <span className="status-dot" aria-hidden="true" />
      </div>
    </header>
  )
}
