export default function InfoBanner({
  lead = 'Detail 2',
  message = 'Trainees should refer to the detail list below. Pay close attention to your specific detail and lane assignments, and proceed promptly to the base station when instructed.',
}) {
  return (
    <div className="info-banner">
      <svg className="info-banner-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none">
        <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10" cy="6.4" r="1.05" fill="currentColor" />
      </svg>
      <span>
        <strong>{lead}</strong>&nbsp; {message}
      </span>
    </div>
  )
}
