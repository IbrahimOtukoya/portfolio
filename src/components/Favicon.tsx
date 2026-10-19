/** Navbar mark from Figma "FAVICON": the eyes glance left and back, holding 1s between 350ms ease-in moves. */
export function Favicon({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M16 4V8H20V16H16V20H8V16H4V8H8V4H16Z" fill="#D48249" />
      <path
        d="M24 20H20V24H4V20H0V0H24V20ZM16 8V4H8V8H4V16H8V20H16V16H20V8H16Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#404040"
      />
      <g className="favicon-eyes">
        <rect x="8" y="8" width="4" height="4" fill="white" />
        <rect x="16" y="8" width="4" height="4" fill="white" />
      </g>
    </svg>
  );
}
