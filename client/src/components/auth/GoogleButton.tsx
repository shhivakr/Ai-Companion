"use client";

interface GoogleButtonProps {
  onClick?: () => void;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.39Z"
      />

      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.74 9.74 0 0 0 12 21.5Z"
      />

      <path
        fill="#FBBC05"
        d="M6.54 13.61A5.85 5.85 0 0 1 6.23 12c0-.56.1-1.1.31-1.61v-2.5H3.3A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.11l3.24-2.5Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.36c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.5C6.85 8.08 9 6.36 12 6.36Z"
      />
    </svg>
  );
}

export default function GoogleButton({ onClick }: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-900/40"
    >
      <GoogleIcon />

      <span>Continue with Google</span>
    </button>
  );
}
