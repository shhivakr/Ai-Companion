import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface MemoryCardProps {
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  source: string;
}

export default function MemoryCard({
  title,
  content,
  category,
  updatedAt,
  source,
}: MemoryCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge variant="muted">{category}</Badge>

          <h2 className="mt-3 text-base font-semibold">{title}</h2>
        </div>

        <button
          type="button"
          aria-label={`More options for ${title}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
        >
          ...
        </button>
      </div>

      <p className="mt-3 text-sm leading-6 text-neutral-600">{content}</p>

      <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
        <div>
          <p className="text-xs text-neutral-400">Source</p>

          <p className="mt-1 text-xs text-neutral-500">{source}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-neutral-400">Updated</p>

          <p className="mt-1 text-xs text-neutral-500">{updatedAt}</p>
        </div>
      </div>

      <div className="mt-4">
        <Button variant="ghost" className="px-0 text-xs">
          Edit memory
        </Button>
      </div>
    </Card>
  );
}
