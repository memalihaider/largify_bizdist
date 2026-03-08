"use client";

import { useEffect, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

export default function RootShell({ children }: { children: ReactNode }) {
  const { locale, dir } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    if (locale === "ur") {
      document.body.style.fontFamily =
        "var(--font-urdu), var(--font-inter), system-ui, sans-serif";
    } else {
      document.body.style.fontFamily =
        "var(--font-inter), system-ui, sans-serif";
    }
  }, [locale, dir]);

  return <>{children}</>;
}
