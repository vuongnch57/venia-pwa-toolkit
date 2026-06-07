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
- **Don't assume a stock Tailwind class exists.** The `pwa-theme-venia` preset has
  incomplete numeric scales — confirmed missing: `duration-*` (`The duration-150 class
  does not exist`), `size-5` (→ use `w-5 h-5`), `min-w-40` (→ `min-w-[10rem]`).
  - **Rule:** when webpack reports ``The `X-N` class does not exist``, convert `N` to
    its standard Tailwind rem value and rewrite as `X-[Nrem]` (e.g. `40` = `10rem` →
    `min-w-[10rem]`) — don't guess at a different numeric step. (For `size-*`, split into
    `w-*`/`h-*`.) Or add the value to `theme.js`.
- **Never `@apply` a utility inside a class of the same name** — `.grid { @apply grid }`
  creates a circular dependency and fails the build. Rename the class or apply on a
  different selector.
- **Responsive by default** — style for mobile and desktop; when adjusting one
  breakpoint, confirm the other still holds.

## Colors — `theme.js` is the single source (hard rule)

- **Grep before adding.** Search `theme.js` `extend.colors` for an existing entry first.
- **No raw hex anywhere** — `bg-[#hex]`/`text-[#hex]` arbitrary utilities AND plain CSS
  `color:` / `background-color:` / `border-color: #hex` declarations are equally
  forbidden. Grep for both (`-\[#` and `#` in declarations) before adding a color.
- **Pick the right naming convention for what the color represents:**
  - **Semantic group** named after the CSS class/state it backs, for component-state
    colors shared across components — e.g. `field: { DEFAULT, error, disabled }` →
    `bg-field`, `bg-field-error`, `bg-field-disabled`.
  - **Scale-style palette** with simple sequential numeric suffixes (`gray.1`..`gray.4`,
    `orange.1`) for general-purpose text/icon grays and accents. Explicitly **NOT**
    Tailwind's 50–950 scale — that collides with colors already used elsewhere
    (`gray-700`/`gray-800`/`orange-50`…).
- **Don't duplicate an existing brand color** into a new palette — e.g. keep
  `primary: '#FF6900'` under `primary`, don't copy it into a new `orange` group.

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
- **Attribute the source.** Add a one-line comment citing the Figma node, e.g.
  `// Cloned from Figma \`icon/checked\` (node 115:9791) — selected Checkbox` — keeps
  it traceable for future re-syncs.
- **Verify and de-dupe assets before writing components.** Fetch the actual SVG from
  the Figma MCP asset server (curl), confirm it's really SVG (`file -b`), and `diff`
  assets that look like duplicates (e.g. two chevron URLs). Byte-identical assets
  should produce **one shared** icon component, not two.
- Storybook stories for icons live under `src/.storybook/`
  (`yarn storybook` / `yarn storybook:build`).
