<div align="center">

# Auto Titlebar

鼠标悬停在窗口顶部时显示标题栏，移开后自动隐藏。

**[English](README.en.md) · 简体中文**

</div>

---

> **本项目已停止维护**
>
> 自动隐藏标题栏功能已合并进 [Launcher Theme Enhancer](https://github.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer)，并在那里继续维护。新用户请直接安装 Launcher Theme Enhancer；已有用户可以卸载本扩展后迁移，标题栏开关位于其首页卡片和设置页。
>
> 本仓库仅作历史归档，不再发布功能更新或修复。

## 简介

Auto Titlebar 是一款基于新版 SJMCL 扩展脚手架重构的界面扩展。它兼容 SJMCL 1.3.0 之后的窗口标题栏结构，并支持在扩展设置页中运行时切换英文和中文。

## 功能

- 鼠标移动到窗口顶部时显示标题栏
- 鼠标移出标题栏后自动隐藏
- 标题栏隐藏时保留顶部拖动区域，窗口仍可移动
- 首页卡片和扩展设置页均可控制开关
- 运行时切换 English / 中文
- 自动迁移旧版 `enabled.txt` 开关状态
- 兼容新旧标题栏 DOM 标识

## 使用方法

1. 从 Releases 下载 `org.yoshino.auto_titlebar-0.2.0.sjmclx`
2. 打开 SJMCL → 设置 → 扩展，选择添加扩展
3. 导入并启用扩展
4. 在扩展设置页或首页卡片中打开自动隐藏
5. 在扩展设置页顶部切换语言

如果安装过旧的中文版 `org.yoshino.auto_titlebar.zh`，请先卸载它。新版只使用一个扩展包，并在内部切换语言，避免重复加载标题栏逻辑。

## 兼容性

- 最低启动器版本：1.3.0
- 目标平台：SJMCL 在 Windows、Linux 和 macOS 上提供的自定义标题栏

## 开发

```bash
npm install
npm run typecheck
npm run dev
npm run build
```

构建结果：

- `dist/org.yoshino.auto_titlebar/`
- `dist/org.yoshino.auto_titlebar-0.2.0.sjmclx`

## 相关项目与文档

- [SJMCL 扩展开发文档](https://mc.sjtu.cn/sjmcl/dev/extension/)
- [SJMCL 扩展 API](https://mc.sjtu.cn/sjmcl/dev/extension/api.html)
- [awesome-SJMCL-extensions](https://github.com/SJMC-Dev/awesome-SJMCL-extensions)

## 许可

MIT

---

*此插件在开发过程中使用了 AI 辅助编码工具。*
