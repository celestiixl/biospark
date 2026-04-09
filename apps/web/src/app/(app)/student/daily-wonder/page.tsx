import { getDailyWonder } from "@/lib/getDailyWonder";
import DailyWonderLearnMore from "@/components/student/DailyWonderLearnMore";

export default function DailyWonderPage() {
  const wonder = getDailyWonder();
  return <DailyWonderLearnMore wonder={wonder} />;
}
