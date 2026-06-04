---
name: venia-css-module
description: Style a Venia component with Tailwind in CSS modules, handle loading shimmers, and create SVG icons. Use when writing .module.css for a Venia component, adding a loading state, or cloning an icon from Figma.
---

# Tailwind in Venia CSS modules + loading + icons

## Tailwind-in-CSS-modules

- Separator is `_` (e.g. `md_pt-10`, `hover_text-black`).
- Compose Tailwind classes: `composes: ... from global` inside `.module.css`.
- Theme extends `@magento/pwa-theme-venia` via `tailwind.config.js` / `theme.js`.
- In a component override, import the **local** `./component.module.css`.

## Loading states

- Prefer a **page shimmer** for initial load; avoid `fullPageLoadingIndicator` as
  the default.
- Align shimmer spacing with the real page (header height, title position) so the
  layout doesn't jump on load.

## Icons (hard rule)

- New icons live in `src/components/Icons/` as JS components with **inline SVG**.
- **Never use `react-feather`** (or other icon libraries) for app icons.
- **From Figma MCP:** when a design node is an SVG icon, *clone* it into a JS icon
  component under `src/components/Icons/` — inline the SVG markup as a React
  component. Do not substitute a react-feather equivalent or render the raw asset.
- Storybook stories for icons live under `src/.storybook/`
  (`yarn storybook` / `yarn storybook:build`).
