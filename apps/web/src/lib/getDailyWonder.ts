import { dailyWonders, type DailyWonder } from "@/data/dailyWonders";

export function getDailyWonder(): DailyWonder {
  const start = new Date("2025-08-01");
  const today = new Date();
  const diff = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return dailyWonders[diff % dailyWonders.length];
}
