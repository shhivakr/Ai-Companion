interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>

        {description && (
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            {description}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {children}
      </div>
    </section>
  );
}
