export default function Composer() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3">
      <textarea
        rows={2}
        placeholder="What's on your mind?"
        className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-neutral-400"
      />

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-neutral-400">
          Companion uses your relevant context.
        </p>

        <button
          type="button"
          className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Send
        </button>
      </div>
    </div>
  );
}
