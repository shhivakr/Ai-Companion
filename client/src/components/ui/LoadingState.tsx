interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({
  label = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-60 items-center justify-center rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-950" />

        <p className="text-sm text-neutral-500">{label}</p>
      </div>
    </div>
  );
}
