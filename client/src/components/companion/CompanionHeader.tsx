import Avatar from "@/components/ui/Avatar";

export default function CompanionHeader() {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
      <div className="flex items-center gap-3">
        <Avatar name="Companion" />

        <div>
          <h1 className="text-lg font-semibold">Companion</h1>

          <p className="text-xs text-neutral-500">
            Here to help you think, decide and move forward.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
      >
        Context
      </button>
    </div>
  );
}
