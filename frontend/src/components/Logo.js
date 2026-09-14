export function Logo({ size = 36, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="nf-logo-gradient"
          x1="0"
          y1="0"
          x2="36"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="9" fill="url(#nf-logo-gradient)" />
      <path
        d="M11.5 8.5h13V23l-2.17 2-2.16-2-2.17 2-2.17-2-2.16 2-2.17-2V8.5Z"
        fill="#ffffff"
      />
      <rect
        x="14.5"
        y="12.5"
        width="7"
        height="1.8"
        rx="0.9"
        fill="#2563EB"
      />
      <rect
        x="14.5"
        y="16"
        width="5"
        height="1.8"
        rx="0.9"
        fill="#2563EB"
        opacity="0.6"
      />
    </svg>
  );
}
