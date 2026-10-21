# Changelog

All notable changes to this project are documented in this file.

## [0.2.0] - 2026-10-21

### Changed

- Rebuilt the extension with the official `create-sjmcl-extension` scaffold and TypeScript sources.
- Added support for SJMCL's current `#sjmcl-window-drag-region` title bar while retaining compatibility with the legacy `#sjmcl-main-drag-region`.
- Added a drag-region attribute fallback and automatic rebinding when the title bar is replaced.
- Consolidated English and Chinese UI into one package with a runtime language switch.
- Persisted settings in `settings.json` and migrated the legacy `enabled.txt` value.
- Added cleanup for listeners, timers, injected styles, and the custom drag strip.
- Added `npm run typecheck` and standard build scripts.

### Removed

- Removed the standalone Chinese extension `org.yoshino.auto_titlebar.zh`.
- Removed the legacy hand-written `frontend/index.js` source entry.

### Compatibility

- Minimum launcher version is now `1.3.0`.
- Users who installed the legacy Chinese package should uninstall it before enabling version `0.2.0`.

## [0.1.0] - 2026-07-07

### Added

- Initial Auto Titlebar release.
- Show the title bar when hovering at the top edge and hide it after the pointer leaves.
- Separate English and Chinese packages.
