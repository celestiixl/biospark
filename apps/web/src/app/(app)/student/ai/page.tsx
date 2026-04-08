import { LEARNING_UNITS } from "@/lib/learningHubContent";
import AxoPageClient from "./AxoPageClient";

export const metadata = { title: "Ask Axo" };

export default function StudentAiPage() {
  const units = LEARNING_UNITS.map((u) => ({
    id: u.id,
    unitNumber: u.unitNumber,
    title: u.title,
    teks: u.priorityTeks,
  }));

  return <AxoPageClient units={units} />;
}
