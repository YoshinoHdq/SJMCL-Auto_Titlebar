const STYLE_ID = "sjmcl-auto-titlebar-style";
const DRAG_REGION_ID = "sjmcl-auto-titlebar-drag-strip";
const HIDDEN_ATTRIBUTE = "data-sjmcl-auto-titlebar-hidden";
const VISIBLE_ATTRIBUTE = "data-sjmcl-auto-titlebar-visible";
const TITLEBAR_SELECTORS = [
  "#sjmcl-window-drag-region",
  "#sjmcl-main-drag-region",
  "[data-tauri-drag-region]",
];

const SHOW_ZONE_PX = 20;
const HIDE_DELAY_MS = 180;
const RETRY_INTERVAL_MS = 300;
const TARGET_CHECK_INTERVAL_MS = 1000;

const STYLES = `
  [${HIDDEN_ATTRIBUTE}] {
    opacity: 0 !important;
    pointer-events: none !important;
    transform: translateY(-100%) !important;
    transition: opacity 120ms ease, transform 120ms ease !important;
  }

  [${HIDDEN_ATTRIBUTE}][${VISIBLE_ATTRIBUTE}] {
    opacity: 1 !important;
    pointer-events: auto !important;
    transform: translateY(0) !important;
  }

  #${DRAG_REGION_ID} {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 8px;
    z-index: 2147482999;
    -webkit-app-region: drag;
  }
`;

export interface TitlebarController {
  setEnabled(enabled: boolean): void;
  dispose(): void;
}

function findTitlebar(): HTMLElement | null {
  for (const selector of TITLEBAR_SELECTORS) {
    const dragRegion = document.querySelector<HTMLElement>(selector);
    const titlebar = dragRegion?.parentElement;
    if (titlebar) {
      return titlebar;
    }
  }
  return null;
}

export function createTitlebarController(): TitlebarController {
  let enabled = false;
  let disposed = false;
  let titlebar: HTMLElement | null = null;
  let hideTimer: number | undefined;
  let retryTimer: number | undefined;
  let targetCheckTimer: number | undefined;

  function clearTimers(): void {
    if (hideTimer !== undefined) {
      window.clearTimeout(hideTimer);
      hideTimer = undefined;
    }
    if (retryTimer !== undefined) {
      window.clearTimeout(retryTimer);
      retryTimer = undefined;
    }
    if (targetCheckTimer !== undefined) {
      window.clearInterval(targetCheckTimer);
      targetCheckTimer = undefined;
    }
  }

  function showTitlebar(): void {
    if (!enabled || !titlebar) {
      return;
    }
    if (hideTimer !== undefined) {
      window.clearTimeout(hideTimer);
      hideTimer = undefined;
    }
    titlebar.setAttribute(VISIBLE_ATTRIBUTE, "");
  }

  function hideTitlebar(): void {
    if (hideTimer !== undefined) {
      window.clearTimeout(hideTimer);
      hideTimer = undefined;
    }
    titlebar?.removeAttribute(VISIBLE_ATTRIBUTE);
  }

  function scheduleHide(): void {
    if (!enabled || !titlebar) {
      return;
    }
    if (hideTimer !== undefined) {
      window.clearTimeout(hideTimer);
    }
    hideTimer = window.setTimeout(() => {
      hideTimer = undefined;
      if (enabled) {
        titlebar?.removeAttribute(VISIBLE_ATTRIBUTE);
      }
    }, HIDE_DELAY_MS);
  }

  function handleMouseMove(event: MouseEvent): void {
    if (!enabled) {
      return;
    }

    if (!titlebar?.isConnected) {
      bindTitlebar(findTitlebar());
    }
    if (!titlebar) {
      return;
    }

    if (event.clientY <= SHOW_ZONE_PX) {
      showTitlebar();
      return;
    }

    if (!titlebar.hasAttribute(VISIBLE_ATTRIBUTE)) {
      return;
    }

    const titlebarHeight = Math.max(titlebar.getBoundingClientRect().height, 24);
    if (event.clientY > titlebarHeight + 8) {
      scheduleHide();
    }
  }

  function handleWindowBlur(): void {
    hideTitlebar();
  }

  function ensureStyle(): void {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  function ensureDragStrip(): HTMLElement {
    const existing = document.getElementById(DRAG_REGION_ID);
    if (existing) {
      return existing;
    }

    const strip = document.createElement("div");
    strip.id = DRAG_REGION_ID;
    strip.setAttribute("data-tauri-drag-region", "");
    strip.setAttribute("aria-hidden", "true");
    strip.addEventListener("pointerenter", showTitlebar);
    document.body.appendChild(strip);
    return strip;
  }

  function bindTitlebar(nextTitlebar: HTMLElement | null): void {
    if (titlebar === nextTitlebar && titlebar?.isConnected) {
      return;
    }

    if (titlebar) {
      titlebar.removeAttribute(HIDDEN_ATTRIBUTE);
      titlebar.removeAttribute(VISIBLE_ATTRIBUTE);
    }

    titlebar = nextTitlebar;
    if (!titlebar) {
      return;
    }

    titlebar.setAttribute(HIDDEN_ATTRIBUTE, "");
    titlebar.removeAttribute(VISIBLE_ATTRIBUTE);
  }

  function scheduleRetry(): void {
    if (!enabled || disposed || retryTimer !== undefined) {
      return;
    }
    retryTimer = window.setTimeout(() => {
      retryTimer = undefined;
      if (!enabled || disposed) {
        return;
      }
      bindTitlebar(findTitlebar());
      if (!titlebar) {
        scheduleRetry();
      }
    }, RETRY_INTERVAL_MS);
  }

  function setEnabled(nextEnabled: boolean): void {
    if (disposed || enabled === nextEnabled) {
      return;
    }

    enabled = nextEnabled;
    clearTimers();

    if (!enabled) {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleWindowBlur);
      window.removeEventListener("blur", handleWindowBlur);
      if (titlebar) {
        titlebar.removeAttribute(HIDDEN_ATTRIBUTE);
        titlebar.removeAttribute(VISIBLE_ATTRIBUTE);
      }
      titlebar = null;
      document.getElementById(DRAG_REGION_ID)?.remove();
      document.getElementById(STYLE_ID)?.remove();
      return;
    }

    ensureStyle();
    ensureDragStrip();
    bindTitlebar(findTitlebar());
    scheduleRetry();

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleWindowBlur);
    window.addEventListener("blur", handleWindowBlur);
    targetCheckTimer = window.setInterval(() => {
      if (!enabled) {
        return;
      }
      const nextTitlebar = findTitlebar();
      if (!titlebar?.isConnected || nextTitlebar !== titlebar) {
        bindTitlebar(nextTitlebar);
      }
    }, TARGET_CHECK_INTERVAL_MS);
  }

  return {
    setEnabled,
    dispose() {
      setEnabled(false);
      disposed = true;
    },
  };
}
