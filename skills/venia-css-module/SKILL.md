---
name: venia-css-module
description: Style a Venia component with Tailwind in CSS modules, handle loading shimmers, and create SVG icons. Use when writing .module.css for a Venia component, adding a loading state, or cloning an icon from Figma.
---

# Tailwind in Venia CSS modules + loading + icons

## Tailwind-in-CSS-modules

- **Style with Tailwind via `@apply`** inside `.module.css` — prefer `@apply` over
  `composes: ... from global`. Reach for raw CSS only when no utility fits.
- Separator is `_` (e.g. `md_pt-10`, `hover_text-black`).
- **Use arbitrary values when no token fits** rather than hand-written CSS, e.g.
  `@apply py-[13px] w-[100px]`.
- Theme extends `@magento/pwa-theme-venia` via `tailwind.config.js` / `theme.js`.
- In a component override, import the **local** `./component.module.css`.
- **Don't assume a stock Tailwind class exists.** The `pwa-theme-venia` preset omits
  many utilities — `duration-*` / `transition-duration` is the recurring one
  (`The duration-150 class does not exist`). Verify the utility is enabled in
  `theme.js`/the preset, or add it there.
- **Never `@apply` a utility inside a class of the same name** — `.grid { @apply grid }`
  creates a circular dependency and fails the build. Rename the class or apply on a
  different selector.
- **Colors come from `theme.js`.** Use the defined color classes (e.g. `text-primary`,
  `bg-black-light`), never the default Tailwind palette (`gray-700`…) or raw hex. **If
  the color you need isn't in `theme.js`, add it there first**, then use the class.
- **Responsive by default** — style for mobile and desktop; when adjusting one
  breakpoint, confirm the other still holds.

## Loading states

- Prefer a **shimmer skeleton that mirrors the real layout** while an API loads — match
  the actual structure (header, title, rows, cards) and spacing so the layout doesn't
  jump when data arrives. Avoid `fullPageLoadingIndicator` as the default.
- Applies to **any async-populated UI**, not just initial page load — modals and
  sections that fetch data need a loading state; never render an empty shell while
  fetching.

## Icons (hard rule)

- New icons live in `src/components/Icons/` as JS components with **inline SVG**.
- **Never use `react-feather`** (or other icon libraries) for app icons.
- **From Figma MCP:** when a design node is an SVG icon, *clone* it into a JS icon
  component under `src/components/Icons/` — inline the SVG markup as a React
  component. Do not substitute a react-feather equivalent or render the raw asset.
- Storybook stories for icons live under `src/.storybook/`
  (`yarn storybook` / `yarn storybook:build`).
