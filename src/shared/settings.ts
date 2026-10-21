import type { ExtensionFactoryApi } from "../types/host";
import {
  isLocaleCode,
  translate,
  type LocaleCode,
} from "../locales";
import type { TitlebarController } from "../features/titlebar-auto-hide";

export interface ExtensionSettings {
  enabled: boolean;
  locale: LocaleCode;
}

const SETTINGS_FILE = "settings.json";
const LEGACY_ENABLED_FILES = ["data/enabled.txt", "enabled.txt"];
const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: false,
  locale: "en",
};

type HostContext = ReturnType<ExtensionFactoryApi["getHostContext"]>;

function normalizeSettings(value: unknown): ExtensionSettings {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  return {
    enabled: record.enabled === true,
    locale: isLocaleCode(record.locale) ? record.locale : DEFAULT_SETTINGS.locale,
  };
}

async function readLegacyEnabled(host: HostContext): Promise<boolean | null> {
  for (const path of LEGACY_ENABLED_FILES) {
    try {
      const content = await host.actions.readFile(path);
      return content.trim() === "true";
    } catch {
      // Try the next legacy location.
    }
  }
  return null;
}

async function readSettings(
  host: HostContext
): Promise<{ settings: ExtensionSettings; migrated: boolean }> {
  try {
    const content = await host.actions.readFile(SETTINGS_FILE);
    return {
      settings: normalizeSettings(JSON.parse(content)),
      migrated: false,
    };
  } catch {
    const legacyEnabled = await readLegacyEnabled(host);
    return {
      settings: {
        enabled: legacyEnabled ?? DEFAULT_SETTINGS.enabled,
        locale: DEFAULT_SETTINGS.locale,
      },
      migrated: true,
    };
  }
}

async function writeSettings(
  host: HostContext,
  settings: ExtensionSettings
): Promise<void> {
  await host.actions.writeFile(
    SETTINGS_FILE,
    `${JSON.stringify(settings, null, 2)}\n`
  );
}

export interface SettingsStore {
  initialize(): Promise<void>;
  getSnapshot(): ExtensionSettings;
  subscribe(listener: () => void): () => void;
  useSettings(): {
    settings: ExtensionSettings;
    loaded: boolean;
    setEnabled(enabled: boolean): void;
    setLocale(locale: LocaleCode): void;
  };
  dispose(): void;
}

export function createSettingsStore(
  api: ExtensionFactoryApi,
  controller: TitlebarController
): SettingsStore {
  const React = api.React;
  const host = api.getHostContext();
  const listeners = new Set<() => void>();

  let current = DEFAULT_SETTINGS;
  let loaded = false;
  let disposed = false;
  let initialization: Promise<void> | null = null;

  function logError(message: string, error: unknown): void {
    try {
      host.actions.logger.error(message, error);
    } catch {
      // Logging must never break extension behavior.
    }
  }

  function notify(): void {
    for (const listener of listeners) {
      listener();
    }
  }

  function updateHomeWidgetTitle(): void {
    window.setTimeout(() => {
      if (disposed) {
        return;
      }
      try {
        host.actions.setHomeWidgetTitle(
          translate(current.locale, "homeWidgetTitle")
        );
      } catch {
        // The host can be unavailable while the extension is unloading.
      }
    }, 0);
  }

  function persist(): void {
    void writeSettings(host, current).catch((error) => {
      logError("Failed to save Auto Titlebar settings.", error);
    });
  }

  function apply(nextSettings: ExtensionSettings, shouldPersist: boolean): void {
    current = nextSettings;
    controller.setEnabled(current.enabled);
    updateHomeWidgetTitle();
    notify();
    if (shouldPersist) {
      persist();
    }
  }

  function initialize(): Promise<void> {
    if (initialization) {
      return initialization;
    }

    initialization = readSettings(host)
      .then(async ({ settings, migrated }) => {
        if (disposed) {
          return;
        }
        loaded = true;
        apply(settings, false);
        if (migrated) {
          await writeSettings(host, settings);
        }
      })
      .catch((error) => {
        if (!disposed) {
          loaded = true;
          apply(DEFAULT_SETTINGS, false);
        }
        logError("Failed to load Auto Titlebar settings.", error);
      });

    return initialization;
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function useSettings() {
    const [, setVersion] = React.useState(0);

    React.useEffect(() => {
      void initialize();
      return subscribe(() => setVersion((version: number) => version + 1));
    }, []);

    return {
      settings: current,
      loaded,
      setEnabled(enabled: boolean) {
        apply({ ...current, enabled }, true);
      },
      setLocale(locale: LocaleCode) {
        if (isLocaleCode(locale)) {
          apply({ ...current, locale }, true);
        }
      },
    };
  }

  return {
    initialize,
    getSnapshot: () => current,
    subscribe,
    useSettings,
    dispose() {
      disposed = true;
      listeners.clear();
      controller.dispose();
    },
  };
}
