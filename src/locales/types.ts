export type LocaleCode = "en" | "zh";

export interface LocaleStrings {
  extensionName: string;
  homeWidgetTitle: string;
  homeWidgetDescription: string;
  enableAutoHide: string;
  titlebarHint: string;
  language: string;
  english: string;
  chinese: string;
  enabled: string;
  disabled: string;
}

export type LocaleKey = keyof LocaleStrings;
