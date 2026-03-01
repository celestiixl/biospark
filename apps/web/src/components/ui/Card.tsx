import * as React from "react";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export default function Card({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "sm";
}) {
  const base =
    variant === "sm"
      ? "ia-card p-5"
      : "ia-card p-6";

  return <div className={cx(base, className)}>{children}</div>;
}
