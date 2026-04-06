import SummaryClient from "@/components/teacher/AssignmentSummaryClient";

const C = {
  pageBg: "#f0f4f2",
} as const;

export default async function AssignmentSummaryPage({
  params,
}: {
  params: any;
}) {
  const p = await params;
  const assignmentId = p?.assignmentId;
  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <SummaryClient assignmentId={assignmentId} />
    </div>
  );
}
