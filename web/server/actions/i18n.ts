"use server";

import { appLocale, type AppLocale } from "@/lib/i18n";
import { cookies } from "next/headers";

export async function getLocale(): Promise<AppLocale> {
  const c = await cookies();
  return appLocale.parse(c.get("lang")?.value);
}

export async function setLocale(to: "en" | "vi") {
  const c = await cookies();
  c.set("lang", to);
}
