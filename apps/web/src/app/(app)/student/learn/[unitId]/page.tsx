import { notFound } from "next/navigation";
import { getUnitById } from "@/lib/learningHubContent";
import UnitPageClient from "./UnitPageClient";

type UnitPageProps = {
  params: Promise<{ unitId: string }>;
};

export default async function Page({ params }: UnitPageProps) {
  const { unitId } = await params;
  const unit = getUnitById(unitId);

  if (!unit) notFound();

  return <UnitPageClient unit={unit} />;
}
