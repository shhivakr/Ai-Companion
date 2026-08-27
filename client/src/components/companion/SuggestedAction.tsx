interface SuggestedActionProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

export default function SuggestedAction({
  title,
  description,
  onClick,
}: SuggestedActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-elevated"
    >
      <p className="text-sm font-medium text-foreground">{title}</p>

      {description && (
        <p className="mt-1 text-xs leading-5 text-foreground-secondary">
          {description}
        </p>
      )}
    </button>
  );
}
