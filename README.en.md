<div align="center">

# Auto Titlebar

Shows the title bar when hovering at the top edge and hides it automatically after the pointer leaves.

**English · [简体中文](README.md)**

</div>

---

## Overview

Auto Titlebar is an SJMCL interface extension rebuilt with the official extension scaffold. It supports the custom window title bar introduced in SJMCL 1.3.0 and switches between English and Chinese at runtime from the extension settings page.

## Features

- Reveal the title bar by moving the pointer to the top edge
- Hide it after the pointer leaves
- Keep a top drag strip so the window remains draggable while the title bar is hidden
- Toggle the feature from both the home card and the settings page
- Switch between English and Chinese at runtime
- Migrate the legacy `enabled.txt` state automatically
- Support both the old and current title bar DOM identifiers

## Installation

1. Download `org.yoshino.auto_titlebar-0.2.0.sjmclx` from Releases
2. Open SJMCL → Settings → Extensions and add the package
3. Import and enable the extension
4. Enable auto-hide from the settings page or home card
5. Use the language selector at the top of the settings page

If the legacy Chinese package `org.yoshino.auto_titlebar.zh` is installed, uninstall it first. The new release uses one package and switches languages internally to avoid duplicate title bar logic.

## Compatibility

- Minimum launcher version: 1.3.0
- Targets SJMCL custom title bars on Windows, Linux, and macOS

## Development

```bash
npm install
npm run typecheck
npm run dev
npm run build
```

Build outputs:

- `dist/org.yoshino.auto_titlebar/`
- `dist/org.yoshino.auto_titlebar-0.2.0.sjmclx`

## Related projects and documentation

- [SJMCL extension documentation](https://mc.sjtu.cn/sjmcl/dev/extension/)
- [SJMCL extension API](https://mc.sjtu.cn/sjmcl/dev/extension/api.html)
- [awesome-SJMCL-extensions](https://github.com/SJMC-Dev/awesome-SJMCL-extensions)

## License

MIT

---

*This plugin was developed with the assistance of AI coding tools.*
