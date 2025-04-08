import { getLocale } from "@/server/actions/i18n";
import { getRequestConfig } from "next-intl/server";
import { z } from "zod";

export const appLocale = z.enum(["en", "vi"]).catch("en");
export type AppLocale = z.TypeOf<typeof appLocale>;

export default getRequestConfig(async ({ requestLocale }) => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = (await requestLocale) ?? (await getLocale());

  const messages = (await import(`../messages/${locale}.ts`)).default;
  return {
    locale,
    messages,
  };
});
