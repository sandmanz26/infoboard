export default function PageDots({ pageIndex, pageCount }) {
  if (pageCount <= 1) return null
  return (
    <span className="page-dots" aria-label={`Page ${pageIndex + 1} of ${pageCount}`}>
      {Array.from({ length: pageCount }).map((_, i) => (
        <span key={i} className={`page-dot${i === pageIndex ? ' active' : ''}`} aria-hidden="true" />
      ))}
    </span>
  )
}
