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
      className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-left transition-colors hover:bg-neutral-50"
    >
      <p className="text-sm font-medium text-neutral-950">{title}</p>

      {description && (
        <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>
      )}
    </button>
  );
}
