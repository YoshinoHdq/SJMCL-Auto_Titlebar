import type { ExtensionFactoryApi } from "../types/host";
import { translate } from "../locales";
import type { SettingsStore } from "../shared/settings";

export function createHomeWidget(
  api: ExtensionFactoryApi,
  store: SettingsStore
) {
  const React = api.React;
  const { HStack, Switch, Text } = api.ChakraUI;

  return function AutoTitlebarHomeWidget() {
    const { settings, loaded, setEnabled } = store.useSettings();
    const t = (key: Parameters<typeof translate>[1]) =>
      translate(settings.locale, key);

    return React.createElement(
      HStack,
      {
        align: "center",
        spacing: 3,
        p: 2,
        w: "100%",
      },
      React.createElement(
        Text,
        {
          flex: 1,
          fontSize: "sm",
          title: t("homeWidgetDescription"),
        },
        t("enableAutoHide")
      ),
      React.createElement(Switch, {
        isChecked: settings.enabled,
        isDisabled: !loaded,
        colorScheme: "blue",
        size: "sm",
        "aria-label": t("enableAutoHide"),
        onChange: () => setEnabled(!settings.enabled),
      })
    );
  };
}
