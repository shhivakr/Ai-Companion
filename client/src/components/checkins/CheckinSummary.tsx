import Card from "@/components/ui/Card";

interface CheckinSummaryProps {
  date: string;
  feeling: string;
  energy: string;
  focus: string;
}

export default function CheckinSummary({
  date,
  feeling,
  energy,
  focus,
}: CheckinSummaryProps) {
  return (
    <Card className="p-5">
      <p className="text-xs text-neutral-500">{date}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-neutral-500">Feeling</p>
          <p className="mt-1 text-sm font-medium">{feeling}</p>
        </div>

        <div>
          <p className="text-xs text-neutral-500">Energy</p>
          <p className="mt-1 text-sm font-medium">{energy}</p>
        </div>

        <div>
          <p className="text-xs text-neutral-500">Focus</p>
          <p className="mt-1 text-sm font-medium">{focus}</p>
        </div>
      </div>
    </Card>
  );
}
