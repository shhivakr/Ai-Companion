interface SettingsRowProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function SettingsRow({
  title,
  description,
  children,
}: SettingsRowProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-neutral-100 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>

        {description && (
          <p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-500">
            {description}
          </p>
        )}
      </div>

      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
    