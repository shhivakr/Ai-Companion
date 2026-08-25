interface CommandActionProps {
  title: string;
  description: string;
  shortcut?: string;
  onClick?: () => void;
}

export default function CommandAction({
  title,
  description,
  shortcut,
  onClick,
}: CommandActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 text-left transition-colors hover:bg-neutral-50"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-950">{title}</p>

        <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>
      </div>

      {shortcut && (
        <span className="ml-4 shrink-0 rounded-md border border-neutral-200 px-2 py-1 text-[11px] text-neutral-400">
          {shortcut}
        </span>
      )}
    </button>
  );
}
