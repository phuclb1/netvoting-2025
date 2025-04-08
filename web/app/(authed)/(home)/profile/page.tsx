import { api } from "@/protocol/trpc/server";
import { InfoCard } from "../people-management/_component/InfoCard";
import { BackButton } from "@/components/shared/BackButton";
import { ROUTE } from "@/lib/constants";

export default async function Page() {
  const me = await api.auth.me();
  return (
    <div className="flex flex-col gap-4">
      <BackButton href={ROUTE.HOME.root.path} />
      <InfoCard user={me} />
    </div>
  );
}
