// tone lets the active dot match whatever status color the surrounding
// panel is using (e.g. "ready" -> blue, "queue" -> amber) instead of
// always defaulting to the app's accent color.
export default function PageDots({ pageIndex, pageCount, tone }) {
  if (pageCount <= 1) return null
  return (
    <span
      className={`page-dots${tone ? ` page-dots-${tone}` : ''}`}
      aria-label={`Page ${pageIndex + 1} of ${pageCount}`}
    >
      {Array.from({ length: pageCount }).map((_, i) => (
        <span key={i} className={`page-dot${i === pageIndex ? ' active' : ''}`} aria-hidden="true" />
      ))}
    </span>
  )
}
