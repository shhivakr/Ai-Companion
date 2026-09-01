"use client";

import Button from "@/components/ui/Button";

interface MemoryCardProps {
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  source: string;
  onEdit?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
}

export default function MemoryCard({
  title,
  content,
  category,
  updatedAt,
  source,
  onEdit,
  onDelete,
  deleting = false,
}: MemoryCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold">{title}</h3>

          <p className="mt-2 text-sm leading-6 text-foreground-secondary">{content}</p>
        </div>

        <span className="shrink-0 rounded-full bg-surface-elevated px-2.5 py-1 text-xs text-foreground-secondary">
          {category}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
        <div className="text-xs text-foreground-secondary">
          <span>{source}</span>
          <span className="mx-2">·</span>
          <span>{updatedAt}</span>
        </div>

        <div className="flex items-center gap-3">
          {onEdit && (
            <Button
              type="button"
              variant="ghost"
              className="px-0 text-xs"
              onClick={onEdit}
              disabled={deleting}
            >
              Edit memory
            </Button>
          )}

          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              className="px-0 text-xs text-red-600 hover:text-red-700"
              onClick={onDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
