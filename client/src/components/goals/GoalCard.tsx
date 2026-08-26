import Link from "next/link";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface GoalCardProps {
  _id: string;
  title: string;
  description?: string;
  progress: number;
  milestone?: string;
  nextAction?: string;
  category?: string;
}

export default function GoalCard({
  _id,
  title,
  description,
  progress,
  milestone,
  nextAction,
  category,
}: GoalCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          {category && <Badge variant="muted">{category}</Badge>}

          <h2 className="mt-3 text-lg font-semibold">{title}</h2>

          {description && (
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              {description}
            </p>
          )}
        </div>

        <span className="text-sm font-medium text-neutral-500">
          {progress}%
        </span>
      </div>

      <div className="mt-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-neutral-900"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {milestone && (
        <div className="mt-6 border-t border-neutral-100 pt-5">
          <p className="text-xs text-neutral-500">Current milestone</p>

          <p className="mt-1 text-sm font-medium">{milestone}</p>
        </div>
      )}

      {nextAction && (
        <div className="mt-4">
          <p className="text-xs text-neutral-500">Next action</p>

          <p className="mt-1 text-sm font-medium">{nextAction}</p>
        </div>
      )}

      <div className="mt-5">
        <Link href={`/goals/${_id}`}>
          <Button variant="secondary">Open goal</Button>
        </Link>
      </div>
    </Card>
  );
}
