import en from "./en";
import type { LocaleCode, LocaleKey, LocaleStrings } from "./types";
import zh from "./zh";

const locales: Record<LocaleCode, LocaleStrings> = {
  en,
  zh,
};

export function isLocaleCode(value: unknown): value is LocaleCode {
  return value === "en" || value === "zh";
}

export function translate(locale: LocaleCode, key: LocaleKey): string {
  return locales[locale]?.[key] ?? locales.en[key] ?? key;
}

export type { LocaleCode, LocaleKey, LocaleStrings };
