import { createTitlebarController } from "./features/titlebar-auto-hide";
import { translate } from "./locales";
import { createSettingsPage } from "./pages/settings-page";
import { createSettingsStore } from "./shared/settings";
import type {
  ExtensionFactory,
  ExtensionFactoryApi,
} from "./types/host";
import { createHomeWidget } from "./widgets/home-widget";

(function registerAutoTitlebar(factory: ExtensionFactory) {
  const token = document.currentScript?.dataset?.extensionToken || "";

  if (!token) {
    throw new Error("Missing extension activation token");
  }

  if (typeof window.registerExtension !== "function") {
    throw new Error("SJMCL host is unavailable");
  }

  window.registerExtension(factory, token);
})(function createExtension(api: ExtensionFactoryApi) {
  const controller = createTitlebarController();
  const store = createSettingsStore(api, controller);

  void store.initialize();

  return {
    homeWidget: {
      title: translate("en", "homeWidgetTitle"),
      description: translate("en", "homeWidgetDescription"),
      defaultWidth: 300,
      minWidth: 240,
      Component: createHomeWidget(api, store),
    },
    settingsPage: {
      Component: createSettingsPage(api, store),
    },
    dispose() {
      store.dispose();
    },
  };
});
