import { TotalCoachCard } from "./TotalCard";

export default function Page() {
  return (
    <div className="flex flex-row gap-2">
      <TotalCoachCard className="w-[50%]" role="Coach" />
      <TotalCoachCard className="w-[50%]" role="Student" />
    </div>
  );
}
