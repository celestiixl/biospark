import { LEARNING_UNITS } from "@/lib/learningHubContent";
import TutorPageClient from "./TutorPageClient";

export const metadata = { title: "BioSpark Global Tutor" };

export default function StudentTutorPage() {
  const units = LEARNING_UNITS.map((u) => ({
    id: u.id,
    unitNumber: u.unitNumber,
    title: u.title,
    teks: u.priorityTeks,
  }));

  return <TutorPageClient units={units} />;
}
