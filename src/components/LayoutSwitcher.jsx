import { useEffect, useRef, useState } from 'react'

const POSITION_STORAGE_KEY = 'infoboard-switcher-pos'
const DRAG_THRESHOLD = 4

function GripIcon() {
  return (
    <svg viewBox="0 0 12 20" width="9" height="15" aria-hidden="true" fill="currentColor">
      <circle cx="3" cy="3" r="1.4" />
      <circle cx="9" cy="3" r="1.4" />
      <circle cx="3" cy="10" r="1.4" />
      <circle cx="9" cy="10" r="1.4" />
      <circle cx="3" cy="17" r="1.4" />
      <circle cx="9" cy="17" r="1.4" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none">
      <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 2.6v2.2M10 15.2v2.2M17.4 10h-2.2M4.8 10H2.6M15.1 4.9l-1.55 1.55M6.45 13.55 4.9 15.1M15.1 15.1l-1.55-1.55M6.45 6.45 4.9 4.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function LayoutSwitcher({ groups }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(POSITION_STORAGE_KEY))
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) return saved
    } catch {
      /* ignore malformed saved position */
    }
    return null
  })

  const rootRef = useRef(null)
  const dragState = useRef(null)

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

  const clampToViewport = (x, y) => {
    const el = rootRef.current
    const w = el?.offsetWidth ?? 0
    const h = el?.offsetHeight ?? 0
    return {
      x: Math.min(Math.max(8, x), Math.max(8, window.innerWidth - w - 8)),
      y: Math.min(Math.max(8, y), Math.max(8, window.innerHeight - h - 8)),
    }
  }

  const onPointerDown = (e) => {
    const rect = rootRef.current.getBoundingClientRect()
    dragState.current = {
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    const drag = dragState.current
    if (!drag) return
    if (
      !drag.moved &&
      Math.abs(e.clientX - drag.startX) < DRAG_THRESHOLD &&
      Math.abs(e.clientY - drag.startY) < DRAG_THRESHOLD
    ) {
      return
    }
    drag.moved = true
    const next = clampToViewport(e.clientX - drag.offsetX, e.clientY - drag.offsetY)
    drag.lastPos = next
    setPos(next)
  }

  const onPointerUp = (e) => {
    const drag = dragState.current
    e.currentTarget.releasePointerCapture(e.pointerId)
    dragState.current = null
    if (drag?.moved) {
      if (drag.lastPos) localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(drag.lastPos))
    } else {
      setOpen((v) => !v)
    }
  }

  const nearTop = pos ? pos.y < window.innerHeight / 2 : false
  const nearLeft = pos ? pos.x < window.innerWidth / 2 : false

  const wrapperStyle = pos
    ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' }
    : undefined

  return (
    <div
      className={`layout-switcher${pos ? ' layout-switcher-positioned' : ''}`}
      style={wrapperStyle}
      ref={rootRef}
    >
      {open && (
        <div
          className={`switcher-panel${nearTop ? ' switcher-panel-below' : ''}${
            nearLeft ? ' switcher-panel-left' : ''
          }`}
          role="menu"
        >
          {groups.map((group) => (
            <div className="switcher-panel-section" key={group.id}>
              <div className="switcher-panel-section-title">
                {group.icon}
                {group.label}
              </div>
              {group.type === 'text' ? (
                <input
                  type="text"
                  className="switcher-text-input"
                  value={group.value}
                  placeholder={group.placeholder}
                  onChange={(e) => group.onChange(e.target.value)}
                />
              ) : (
                <div className="switcher-chip-row">
                  {group.options.map((opt) => {
                    const isActive = group.multiSelect
                      ? group.active.includes(opt.id)
                      : group.active === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role={group.multiSelect ? 'menuitemcheckbox' : 'menuitemradio'}
                        aria-checked={isActive}
                        title={opt.description}
                        className={`switcher-chip${isActive ? ' active' : ''}`}
                        onClick={() => (group.multiSelect ? group.onToggle(opt.id) : group.onChange(opt.id))}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        className="switcher-fab"
        aria-haspopup="menu"
        aria-expanded={open}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <GripIcon />
        <GearIcon />
        <span className="switcher-fab-label">Controls</span>
      </button>
    </div>
  )
}
