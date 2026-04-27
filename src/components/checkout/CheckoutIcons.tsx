export function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 17h2M8 6h-3a1 1 0 0 0-1 1v8h1.5" />
      <path d="M8 6v5h3l2 2h3.5V9H13V6H8Z" />
      <path d="M3 15h.5A2.5 2.5 0 0 0 6 12.5V6" />
      <circle cx="7.5" cy="18.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="18.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ReturnsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 12a8 8 0 0 1 8-8c2.5 0 4.6 1.1 6 2.8M4 4v4h4M20 12a8 8 0 0 1-8 8c-2.2 0-4.2-.9-5.7-2.4M20 20v-4h-4"
      />
    </svg>
  )
}

export function CardBrandIcons({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      <svg className="inline h-5 w-8" viewBox="0 0 32 20" fill="none">
        <rect width="32" height="20" rx="3" fill="#1A1F71" />
        <path d="M13 7h6l-1.3 6H11.5L13 7zM18.5 7h3.1l-.7 3.5-2.1-3.2" fill="#fff" opacity="0.95" />
      </svg>
      <svg className="ml-0.5 inline h-5 w-8" viewBox="0 0 32 20" fill="none">
        <rect width="32" height="20" rx="3" fill="#000" />
        <circle cx="12" cy="10" r="5" fill="#EB001B" />
        <circle cx="20" cy="10" r="5" fill="#F79E1B" />
      </svg>
      <svg className="ml-0.5 inline h-5 w-8" viewBox="0 0 32 20" fill="none">
        <rect width="32" height="20" rx="3" fill="#006FCF" />
        <text
          x="5"
          y="14"
          fill="white"
          fontSize="8"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          AMEX
        </text>
      </svg>
    </span>
  )
}

export function PayPalMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <text
        x="0"
        y="15"
        fontSize="11"
        fontWeight="700"
        fontFamily="Host Grotesk, system-ui"
        fill="#003087"
      >
        Pay
      </text>
      <text
        x="20"
        y="15"
        fontSize="11"
        fontWeight="700"
        fontFamily="Host Grotesk, system-ui"
        fill="#0070E0"
      >
        Pal
      </text>
    </svg>
  )
}

export function ChevronBack({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

export function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15a2 2 0 100-4 2 2 0 000 4zM5 9h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2zM8 7V5a4 4 0 118 0v2"
      />
    </svg>
  )
}
