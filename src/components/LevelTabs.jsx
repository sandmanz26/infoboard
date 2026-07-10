// Persistent Level 2/3/4 indicator shown in the header on the training
// levels. All three always render, whichever floor's LCD is currently
// selected — only the "active" styling changes. Clicking a tab switches
// the floor the same way the Level group in Controls does.
export default function LevelTabs({ levels, active, onChange }) {
  return (
    <div className="level-tabs" role="tablist" aria-label="Level">
      {levels.map((level) => (
        <button
          key={level.id}
          type="button"
          role="tab"
          aria-selected={level.id === active}
          className={`level-tab${level.id === active ? ' active' : ''}`}
          onClick={() => onChange(level.id)}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}
