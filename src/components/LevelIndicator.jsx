// Status-only marker — shows which level's booking table is currently on
// screen (Level 2/3/4 rotate through in place). Not a navigation control:
// switching floors is still done through Controls > Level.
export default function LevelIndicator({ levels, active }) {
  return (
    <div className="level-tabs" role="status" aria-label="Showing bookings for">
      {levels.map((level) => (
        <span key={level.id} className={`level-tab${level.id === active ? ' active' : ''}`}>
          {level.label}
        </span>
      ))}
    </div>
  )
}
