"use client";

import { useUi } from "@/components/providers/ui-provider";
import { buttonClass } from "@/components/ui/cta";

export function CookieSettingsButton() {
  const { setCookieSettingsOpen } = useUi();
  return (
    <button type="button" onClick={() => setCookieSettingsOpen(true)} className={buttonClass("secondary")}>
      Pengaturan cookie
    </button>
  );
}
