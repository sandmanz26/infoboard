// Replaces the dot page-indicator for panels where a fill/progress feel
// reads better than discrete dots. The fill re-mounts (via key={pageIndex})
// and restarts its CSS animation every time the page actually advances, so
// it always finishes exactly as the next page loads.
export default function PageLoadingBar({ pageIndex, intervalMs }) {
  return (
    <div className="page-loading-bar" aria-hidden="true">
      <div
        key={pageIndex}
        className="page-loading-bar-fill"
        style={{ animationDuration: `${intervalMs}ms` }}
      />
    </div>
  )
}
