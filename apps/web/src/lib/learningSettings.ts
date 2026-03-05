export type PacingMode = "on_track" | "review" | "accelerated";

export type LearningHubSettings = {
  visibleUnitIds: string[];
  pacingByGradingPeriod: Record<1 | 2 | 3 | 4, PacingMode>;
  playlistsByPeriod: Record<
    "P1" | "P2" | "P3" | "P4",
    { lessonIds: string[]; dueDate: string | null }
  >;
};

const SETTINGS_KEY = "biospark.learning.settings.v1";

export function defaultLearningSettings(
  unitIds: string[],
): LearningHubSettings {
  return {
    visibleUnitIds: unitIds,
    pacingByGradingPeriod: {
      1: "on_track",
      2: "on_track",
      3: "on_track",
      4: "on_track",
    },
    playlistsByPeriod: {
      P1: { lessonIds: [], dueDate: null },
      P2: { lessonIds: [], dueDate: null },
      P3: { lessonIds: [], dueDate: null },
      P4: { lessonIds: [], dueDate: null },
    },
  };
}

export function loadLearningSettings(unitIds: string[]): LearningHubSettings {
  if (typeof window === "undefined") return defaultLearningSettings(unitIds);
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultLearningSettings(unitIds);
    const parsed = JSON.parse(raw) as LearningHubSettings;
    return {
      visibleUnitIds:
        parsed.visibleUnitIds?.filter((id) => unitIds.includes(id)) ?? unitIds,
      pacingByGradingPeriod: parsed.pacingByGradingPeriod ?? {
        1: "on_track",
        2: "on_track",
        3: "on_track",
        4: "on_track",
      },
      playlistsByPeriod: parsed.playlistsByPeriod ?? {
        P1: { lessonIds: [], dueDate: null },
        P2: { lessonIds: [], dueDate: null },
        P3: { lessonIds: [], dueDate: null },
        P4: { lessonIds: [], dueDate: null },
      },
    };
  } catch {
    return defaultLearningSettings(unitIds);
  }
}

export function saveLearningSettings(settings: LearningHubSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
