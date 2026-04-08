"use client";

import { useState } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconApps,
  IconBook2,
  IconChartDots3,
  IconChevronDown,
  IconChevronUp,
  IconFlask2,
  IconLayoutDashboard,
  IconListCheck,
  IconRobot,
  IconUserCircle,
} from "@tabler/icons-react";

// Shared visual classes — kept in one place so the pill and expanded dock look identical.
const DOCK_SURFACE = "border border-[var(--bs-border)] bg-white/90 shadow-lg backdrop-blur";

export default function StudentFloatingDock() {
  const [minimized, setMinimized] = useState(false);

  const links = [
    {
      title: "Dashboard",
      icon: (
        <IconLayoutDashboard className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      href: "/student/dashboard",
    },
    {
      title: "Learning Hub",
      icon: <IconApps className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: "/student/learning-hub",
    },
    {
      title: "BioSpark Quest",
      icon: <IconFlask2 className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: "/student/learn",
    },
    {
      title: "Assignments",
      icon: <IconListCheck className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: "/student/assignments",
    },
    {
      title: "Simulations",
      icon: <IconChartDots3 className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: "/student/learn/simulations",
    },
    {
      title: "Assessment Lab",
      icon: <IconBook2 className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: "/student/assessment",
    },
    {
      title: "AI Tutor",
      icon: <IconRobot className="h-full w-full text-neutral-600 dark:text-neutral-300" />,
      href: "/student/ai",
    },
    {
      title: "My Profile",
      icon: (
        <IconUserCircle className="h-full w-full text-neutral-600 dark:text-neutral-300" />
      ),
      href: "/student/profile",
    },
  ];

  return (
    <>
      {/*
       * ── Desktop expanded dock ────────────────────────────────────────────────
       * The outer div owns the fixed positioning and all visual styling so the
       * inner FloatingDock can be stripped down to a bare flex row of icons.
       * The divider + chevron-down button are plain flex siblings on the right.
       */}
      <div
        className={`fixed bottom-4 left-1/2 z-40 hidden items-end md:flex ${DOCK_SURFACE} rounded-2xl`}
        style={{
          transform: `translateX(-50%) scale(${minimized ? 0.9 : 1})`,
          opacity: minimized ? 0 : 1,
          pointerEvents: minimized ? "none" : "auto",
          transition: "opacity 200ms ease-in-out, transform 200ms ease-in-out",
        }}
        aria-hidden={minimized}
      >
        {/* FloatingDockDesktop — visual styles stripped; outer div owns them */}
        <FloatingDock
          items={links}
          desktopClassName="shadow-none border-0 bg-transparent rounded-none backdrop-blur-none dark:bg-transparent"
          mobileClassName="hidden"
        />

        {/* Divider — 1px vertical line, same border color as the dock */}
        <div
          className="mx-1 mb-3 w-px flex-shrink-0 self-stretch"
          style={{ background: "var(--bs-border)" }}
          aria-hidden="true"
        />

        {/* Minimize toggle */}
        <button
          onClick={() => setMinimized(true)}
          aria-label="Minimize navigation"
          tabIndex={minimized ? -1 : 0}
          className="mb-3 mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-neutral-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <IconChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/*
       * ── Desktop minimized pill ───────────────────────────────────────────────
       * Independent fixed element at the same centre-bottom position.
       * Fades in as the expanded dock fades out.
       */}
      <button
        onClick={() => setMinimized(false)}
        aria-label="Expand navigation"
        tabIndex={minimized ? 0 : -1}
        className={`fixed bottom-4 left-1/2 z-40 hidden items-center justify-center rounded-full md:flex ${DOCK_SURFACE}`}
        style={{
          width: 64,
          height: 32,
          transform: `translateX(-50%) scale(${minimized ? 1 : 0.85})`,
          opacity: minimized ? 1 : 0,
          pointerEvents: minimized ? "auto" : "none",
          transition: "opacity 200ms ease-in-out, transform 200ms ease-in-out",
        }}
      >
        <IconChevronUp className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
      </button>

      {/*
       * ── Mobile dock (unchanged) ──────────────────────────────────────────────
       * FloatingDockMobile already has its own open/close toggle.
       * Desktop variant suppressed so it doesn't duplicate the icons above.
       */}
      <FloatingDock
        items={links}
        desktopClassName="hidden"
        mobileClassName="fixed right-4 bottom-4 z-40"
      />
    </>
  );
}
