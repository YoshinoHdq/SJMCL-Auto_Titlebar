import type { ExtensionFactoryApi } from "../types/host";
import { translate, type LocaleCode } from "../locales";
import type { SettingsStore } from "../shared/settings";

export function createSettingsPage(
  api: ExtensionFactoryApi,
  store: SettingsStore
) {
  const React = api.React;
  const { Box, Button, HStack, Switch, Text, VStack } = api.ChakraUI;
  const { OptionItem, OptionItemGroup } = api.Components;

  return function AutoTitlebarSettingsPage() {
    const { settings, loaded, setEnabled, setLocale } = store.useSettings();
    const t = (key: Parameters<typeof translate>[1]) =>
      translate(settings.locale, key);

    function renderLanguageButton(locale: LocaleCode, label: string) {
      const active = settings.locale === locale;
      return React.createElement(
        Button,
        {
          size: "sm",
          colorScheme: active ? "blue" : "gray",
          variant: active ? "solid" : "outline",
          onClick: () => setLocale(locale),
        },
        label
      );
    }

    return React.createElement(
      VStack,
      {
        align: "stretch",
        spacing: 4,
        p: 4,
      },
      React.createElement(
        Box,
        {
          p: 3,
          borderWidth: "1px",
          borderRadius: "lg",
          borderColor: "chakra-border-color",
        },
        React.createElement(
          HStack,
          {
            spacing: 3,
            align: "center",
            justify: "space-between",
            wrap: "wrap",
          },
          React.createElement(
            Text,
            { fontSize: "sm", fontWeight: "semibold" },
            t("language")
          ),
          React.createElement(
            HStack,
            { spacing: 2 },
            renderLanguageButton("en", t("english")),
            renderLanguageButton("zh", t("chinese"))
          )
        )
      ),
      React.createElement(
        OptionItemGroup,
        {
          title: t("homeWidgetTitle"),
          description: t("titlebarHint"),
          items: [
            React.createElement(
              OptionItem,
              {
                key: "auto-hide",
                title: t("enableAutoHide"),
                description: settings.enabled ? t("enabled") : t("disabled"),
                isChildrenIndependent: true,
              },
              React.createElement(Switch, {
                isChecked: settings.enabled,
                isDisabled: !loaded,
                colorScheme: "blue",
                onChange: () => setEnabled(!settings.enabled),
              })
            ),
          ],
        },
      )
    );
  };
}
