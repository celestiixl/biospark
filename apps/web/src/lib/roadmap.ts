"use client";

import { useEffect, useState } from "react";

export type RoadmapStatus = "shipped" | "in-progress" | "upcoming";

export type RoadmapTone = "emerald" | "teal" | "amber";

export type RoadmapItem = {
  id: string;
  title: string;
  status: RoadmapStatus;
  updatedAt: string;
};

export type RoadmapSection = {
  key: RoadmapStatus;
  title: string;
  statusLabel: string;
  tone: RoadmapTone;
  items: RoadmapItem[];
};

const ROADMAP_STORAGE_KEY = "biospark.assessment-roadmap.v1";
const LEGACY_ROADMAP_STORAGE_KEY = "biospark.whats-next.v1";
const ROADMAP_UPDATED_EVENT = "biospark:roadmap-updated";

const DEFAULT_ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: "assessment-inline-choice",
    title: "Inline Choice works end-to-end in builder, runner, and scoring.",
    status: "shipped",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "assessment-role-preference",
    title: "Persist role preference (Student or Teacher) after sign-in.",
    status: "in-progress",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "assessment-publishing-filters",
    title: "Add assignment publishing with due-date and class filters.",
    status: "in-progress",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "assessment-accommodations",
    title:
      "Expanded accommodations: read-aloud, extended time, reduced choices.",
    status: "upcoming",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
  {
    id: "assessment-review-queue",
    title: "Teacher review queue for item quality and revision history.",
    status: "upcoming",
    updatedAt: "2026-03-11T00:00:00.000Z",
  },
];

const ROADMAP_SECTION_META: Array<{
  key: RoadmapStatus;
  title: string;
  statusLabel: string;
  tone: RoadmapTone;
}> = [
  {
    key: "shipped",
    title: "Live now",
    statusLabel: "shipped",
    tone: "emerald",
  },
  {
    key: "in-progress",
    title: "Next sprint",
    statusLabel: "in progress",
    tone: "teal",
  },
  {
    key: "upcoming",
    title: "Upcoming",
    statusLabel: "planned",
    tone: "amber",
  },
];

function canUseStorage() {
  return typeof window !== "undefined";
}

function parseRoadmapItems(raw: string | null): RoadmapItem[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as RoadmapItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (item): item is RoadmapItem =>
        typeof item?.id === "string" &&
        typeof item?.title === "string" &&
        (item?.status === "shipped" ||
          item?.status === "in-progress" ||
          item?.status === "upcoming") &&
        typeof item?.updatedAt === "string",
    );
  } catch {
    return null;
  }
}

function mergeWithDefaults(items: RoadmapItem[]) {
  const seen = new Set(items.map((item) => item.id));
  const merged = [...items];
  for (const item of DEFAULT_ROADMAP_ITEMS) {
    if (!seen.has(item.id)) {
      merged.push(item);
    }
  }
  return merged;
}

export function loadRoadmapItems(): RoadmapItem[] {
  if (!canUseStorage()) return DEFAULT_ROADMAP_ITEMS;

  const nextRaw = window.localStorage.getItem(ROADMAP_STORAGE_KEY);
  const nextParsed = parseRoadmapItems(nextRaw);
  if (nextParsed) {
    return mergeWithDefaults(nextParsed);
  }

  const legacyRaw = window.localStorage.getItem(LEGACY_ROADMAP_STORAGE_KEY);
  const legacyParsed = parseRoadmapItems(legacyRaw);
  if (legacyParsed) {
    const merged = mergeWithDefaults(legacyParsed);
    saveRoadmapItems(merged);
    return merged;
  }

  return DEFAULT_ROADMAP_ITEMS;
}

export function saveRoadmapItems(items: RoadmapItem[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(ROADMAP_UPDATED_EVENT));
}

export function makeRoadmapId() {
  return `rm_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

export function buildRoadmapSections(items: RoadmapItem[]): RoadmapSection[] {
  return ROADMAP_SECTION_META.map((section) => ({
    ...section,
    items: items.filter((item) => item.status === section.key),
  }));
}

export function useRoadmapItems() {
  const [roadmapItems, setLocalRoadmapItems] = useState<RoadmapItem[]>(() =>
    loadRoadmapItems(),
  );

  useEffect(() => {
    const syncRoadmap = () => {
      setLocalRoadmapItems(loadRoadmapItems());
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        !event.key ||
        event.key === ROADMAP_STORAGE_KEY ||
        event.key === LEGACY_ROADMAP_STORAGE_KEY
      ) {
        syncRoadmap();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(ROADMAP_UPDATED_EVENT, syncRoadmap);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(ROADMAP_UPDATED_EVENT, syncRoadmap);
    };
  }, []);

  function setRoadmapItems(next: RoadmapItem[]) {
    setLocalRoadmapItems(next);
    saveRoadmapItems(next);
  }

  return { roadmapItems, setRoadmapItems };
}
