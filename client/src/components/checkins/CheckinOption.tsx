interface CheckinOptionProps {
  label: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function CheckinOption({
  label,
  description,
  selected = false,
  onClick,
}: CheckinOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-xl border p-4 text-left transition-colors",
        selected
          ? "border-foreground bg-surface-elevated"
          : "border-border bg-surface hover:bg-surface-elevated",
      ].join(" ")}
    >
      <p className="text-sm font-medium">{label}</p>

      {description && (
        <p className="mt-1 text-xs leading-5 text-foreground-secondary">{description}</p>
      )}
    </button>
  );
}
