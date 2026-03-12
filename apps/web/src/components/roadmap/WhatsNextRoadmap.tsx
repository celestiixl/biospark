import { Pill } from "@/components/ia/Pill";
import { Surface } from "@/components/ia/Surface";
import {
  buildRoadmapSections,
  type RoadmapItem,
  type RoadmapTone,
} from "@/lib/roadmap";

const ROADMAP_TONE_STYLES: Record<
  RoadmapTone,
  {
    panel: string;
    title: string;
    badge: string;
    text: string;
  }
> = {
  emerald: {
    panel: "border-emerald-200 bg-emerald-50/80",
    title: "text-emerald-800",
    badge: "border-emerald-300 text-emerald-800",
    text: "text-emerald-900",
  },
  teal: {
    panel: "border-teal-200 bg-teal-50/80",
    title: "text-teal-800",
    badge: "border-teal-300 text-teal-800",
    text: "text-teal-900",
  },
  amber: {
    panel: "border-amber-200 bg-amber-50/80",
    title: "text-amber-800",
    badge: "border-amber-300 text-amber-800",
    text: "text-amber-900",
  },
};

export function WhatsNextRoadmap({
  items,
  footer,
}: {
  items: RoadmapItem[];
  footer?: string;
}) {
  const sections = buildRoadmapSections(items);

  return (
    <Surface className="p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">What’s next</div>
        <Pill tone="amber">roadmap</Pill>
      </div>
      <div className="mt-4 space-y-3">
        {sections.map((section) => {
          const toneStyles = ROADMAP_TONE_STYLES[section.tone];

          return (
            <div
              key={section.title}
              className={`rounded-xl border p-3 ${toneStyles.panel}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div
                  className={`text-xs font-semibold uppercase tracking-wide ${toneStyles.title}`}
                >
                  {section.title}
                </div>
                <span
                  className={`rounded-full border bg-white px-2 py-0.5 text-[10px] font-semibold ${toneStyles.badge}`}
                >
                  {section.statusLabel}
                </span>
              </div>
              {section.items.length === 1 ? (
                <p className={`mt-1 text-sm ${toneStyles.text}`}>
                  {section.items[0]?.title}
                </p>
              ) : (
                <ul className={`mt-1 space-y-1 text-sm ${toneStyles.text}`}>
                  {section.items.map((item) => (
                    <li key={item.id}>{item.title}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      {footer ? (
        <div className="mt-4 text-xs text-slate-600">{footer}</div>
      ) : null}
    </Surface>
  );
}
