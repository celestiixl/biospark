import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, DM_Sans, Lora, DM_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import OfflineSupport from "@/components/common/OfflineSupport";
import DevBypassProvider from "@/components/common/DevBypassProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  style: ["normal", "italic"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "BioSpark", template: "%s | BioSpark" },
  description:
    "FBISD 9th Grade Biology — mastery-based learning platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${lora.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head />
      <body className="min-h-dvh antialiased">
        <div className="ambient" aria-hidden="true" />
        {children}
        <OfflineSupport />
        <DevBypassProvider />
        <SpeedInsights />
      </body>
    </html>
  );
}
