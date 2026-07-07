import { useEffect, useRef, useState } from 'react'

export default function LayoutSwitcher({ layouts, active, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  return (
    <div className="layout-switcher" ref={rootRef}>
      {open && (
        <div className="switcher-dropdown" role="menu">
          <div className="switcher-dropdown-title">Layout</div>
          {layouts.map((l) => (
            <button
              key={l.id}
              role="menuitemradio"
              aria-checked={active === l.id}
              className={`switcher-option${active === l.id ? ' active' : ''}`}
              onClick={() => {
                onChange(l.id)
                setOpen(false)
              }}
            >
              <span className="switcher-option-check">{active === l.id ? '✓' : ''}</span>
              <span>
                <span className="switcher-option-label">{l.label}</span>
                <span className="switcher-option-desc">{l.description}</span>
              </span>
            </button>
          ))}
        </div>
      )}
      <button
        className="switcher-button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="currentColor">
          <rect x="2" y="2" width="7" height="16" rx="1.5" />
          <rect x="11" y="2" width="7" height="7" rx="1.5" />
          <rect x="11" y="11" width="7" height="7" rx="1.5" />
        </svg>
        Layout
      </button>
    </div>
  )
}
