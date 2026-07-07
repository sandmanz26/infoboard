import { useEffect, useRef, useState } from 'react'

function SwitcherGroup({ group, isOpen, onToggle, onClose }) {
  return (
    <div className="switcher-group">
      {isOpen && (
        <div className="switcher-dropdown" role="menu">
          <div className="switcher-dropdown-title">{group.label}</div>
          {group.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="menuitemradio"
              aria-checked={group.active === opt.id}
              className={`switcher-option${group.active === opt.id ? ' active' : ''}`}
              onClick={() => {
                group.onChange(opt.id)
                onClose()
              }}
            >
              <span className="switcher-option-check">{group.active === opt.id ? '✓' : ''}</span>
              <span>
                <span className="switcher-option-label">{opt.label}</span>
                <span className="switcher-option-desc">{opt.description}</span>
              </span>
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className="switcher-button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {group.icon}
        {group.label}
      </button>
    </div>
  )
}

export default function LayoutSwitcher({ groups }) {
  const [openId, setOpenId] = useState(null)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!openId) return
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpenId(null)
    }
    const onEscape = (e) => {
      if (e.key === 'Escape') setOpenId(null)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [openId])

  return (
    <div className="layout-switcher" ref={rootRef}>
      {groups.map((group) => (
        <SwitcherGroup
          key={group.id}
          group={group}
          isOpen={openId === group.id}
          onToggle={() => setOpenId((v) => (v === group.id ? null : group.id))}
          onClose={() => setOpenId(null)}
        />
      ))}
    </div>
  )
}
