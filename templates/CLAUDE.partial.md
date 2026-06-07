<!--
  Magento PWA Studio / Venia conventions — paste this block into your project's
  CLAUDE.md (plugins do not auto-load CLAUDE.md). De-branded; adjust paths/aliases
  to match your project.
-->

# Magento PWA Studio / Venia — Conventions

## Override Resolution

- `src/targets/local-intercept.js` registers `VeniaResolverPlugin` for three packages:
  `@magento/venia-ui/lib`, `@magento/peregrine/lib`, `@magento/pagebuilder/lib` →
  resolves to `src/overrides/<package>/...` when a mirrored file exists (mirror the
  `lib/` tree from `node_modules`).
- Root `local-intercept.js` is a stub; real taps live under `src/targets/`.
- Keep imports as `@magento/...` so the resolver can swap in overrides; rewrite a
  forked file's *relative* imports to `@magento/venia-ui/lib/...` /
  `@magento/peregrine/lib/...`.
- In a component override, import the **local** `./component.module.css`, not the
  CSS path inside `node_modules`.
- **`classes` prop replaces, doesn't merge.** `mergeClasses` does
  `Object.assign(default, className, classes)`, so a `classes={{ key: ... }}` value
  overwrites the child's class for that key. If a parent passes a `classes` key that
  isn't defined in its own `.module.css`, it resolves to `undefined` and silently wipes
  the child's class. When forking a child, override the parent's CSS module too if it
  references a missing key.

## Path Aliases (webpack)

- `@/` → `src`, plus `@components`, `@utils`, `@hooks`, `@talons`, `@overrides`, `@i18n`.
- Prefer `@/...` for app code (e.g. `@/talons/...`, `@/components/...`).

## Intercept Patterns

- **Targetables**: replace a default export via `esModule().spliceSource(...)`; inject
  providers into `App/contextProvider.js` via `reactComponent().insertBeforeSource(...)`.
  `spliceSource` `remove` is a character length; forward-slash absolute paths.
- `targets.of('@magento/venia-ui').routes.tap`: custom routes; use
  `require.resolve('../components/...')` for `path`. Route components go in
  `src/components/`, not `overrides/`.
- `targets.of('@magento/pagebuilder').customContentTypes.tap`: register content
  types pointing at `src/overrides/pagebuilder/...`.
- `extendConfiguredRoute(targets)` (local helper): adds a `customRoutes` prop to
  Venia's `<Routes>` for `<AuthRoute>`-aware routes.

## Feature Layout

| Location | Purpose |
|---|---|
| `src/components/` | New screens/features — **not** under `overrides/` unless replacing Venia |
| `src/talons/` | Talons + `.gql.js` for features that are not simple Peregrine overrides |
| `src/overrides/peregrine/` | Forked talons that replace core Peregrine paths |
| `src/overrides/venia-ui/` | Forked UI components that replace core Venia paths |
| `src/overrides/pagebuilder/` | Custom and extended Page Builder content types |
| `src/contexts/` | App-level providers (checkout, store, visitor, batchers, labels) |

## Drivers

- `package.json` `browser` field maps `@magento/venia-drivers` → `src/drivers/`,
  which re-exports `@magento/venia-ui/lib/drivers`.

## Component & Copy Rules (always)

- **All user-facing text goes through react-intl** — wrap every visible string and
  meaningful a11y string in `<FormattedMessage />` or
  `formatMessage({ id, defaultMessage })`. No bare string literals in JSX text,
  `alt`, `aria-label`, `placeholder`, or `title`.
- **One component per file.** Never declare multiple React components in a single file.
- **Split when it grows.** Extract sub-components (own file) once a component takes
  on a second responsibility or a JSX block becomes independently reusable — prefer
  small, composable components over one large one.
- **Logic lives in talons/hooks, components stay presentational.** When a component
  accumulates queries, callbacks, or non-trivial state, move it into a `use*` hook
  (`src/talons/...` or a Peregrine override) and keep the JSX thin.
- **DRY.** Extract repeated logic into a shared function/util; reuse existing helpers
  in `src/utils/` before writing a new one.
- **Responsive by default.** Every UI change must work at mobile **and** desktop.
  When you adjust one breakpoint, verify the other still holds — don't fix mobile and
  break desktop (or vice-versa).
- **Surface API errors inline.** Render server/mutation errors under the relevant
  form field (inside the form), not only as a toast or `console.error`.

## i18n

- Messages catalog at `src/i18n/en_US.json`; alias `@i18n` points there.
- With the **Field `Message` override**, validators return `{ id, defaultMessage }`,
  not plain strings.
- Keep new strings statically discoverable for extraction.

## Tailwind in Venia CSS Modules

- **Style with Tailwind via `@apply`** in `.module.css` — prefer `@apply` over
  `composes: ... from global`. Reach for raw CSS only when no utility fits.
- Separator is `_` (e.g. `md_pt-10`).
- **Use arbitrary values when no token fits** instead of hand-written CSS, e.g.
  `@apply py-[13px] w-[100px]`.
- Theme extends `@magento/pwa-theme-venia` via `tailwind.config.js` / `theme.js`.
- **Don't assume a stock Tailwind class exists.** The `pwa-theme-venia` preset has
  incomplete numeric scales — confirmed missing: `duration-*`, `size-5` (→ `w-5 h-5`),
  `min-w-40` (→ `min-w-[10rem]`). When webpack reports ``The `X-N` class does not
  exist``, convert `N` to its standard Tailwind rem value and rewrite as `X-[Nrem]`
  (e.g. `40` = `10rem`) — don't guess a different numeric step. Or add the value to
  `theme.js`.
- **Never `@apply` a utility inside a class of the same name** (e.g. `.grid { @apply
  grid }`) — it creates a circular dependency and fails the build.

### Colors — `theme.js` is the single source (hard rule)

- **Grep `theme.js` `extend.colors` before adding** any color.
- **No raw hex anywhere** — `bg-[#hex]` / `text-[#hex]` arbitrary utilities AND plain
  CSS `color:` / `background-color:` / `border-color: #hex` declarations are equally
  forbidden. Use a `theme.js` class instead.
- **Naming convention by intent:**
  - *Semantic group* named after the class/state it backs, for shared component-state
    colors — `field: { DEFAULT, error, disabled }` → `bg-field`, `bg-field-error`.
  - *Scale-style palette* with sequential numeric suffixes (`gray.1`..`gray.4`,
    `orange.1`) for general text/icon grays and accents — **not** Tailwind's 50–950
    scale (collides with `gray-700` / `orange-50` already in use).
- **Don't duplicate a brand color** into a new palette (keep `primary` under `primary`).

## Loading States

- Prefer a **shimmer skeleton that mirrors the real page/section layout** while an API
  loads — match the actual structure (header, title, rows, cards) and spacing so the
  layout doesn't jump when data arrives. Avoid `fullPageLoadingIndicator` as the default.
- This applies to **any async-populated UI**, not just initial page load — modals and
  sections that fetch data need a loading state; never render an empty shell while
  fetching.

## Icons

- New icons live in `src/components/Icons/` (inline SVG as a React component).
- **No `react-feather`** (or other icon libs) for app icons.
- **From Figma MCP:** when a design node is an SVG icon, *clone* it into a JS icon
  component under `src/components/Icons/` — do not pull the equivalent from
  react-feather or render the raw asset.

## Build / Node

- Production build may set `NODE_OPTIONS=--openssl-legacy-provider` for OpenSSL
  compatibility — preserve if upgrading Node/webpack.
- **`??` / `?.` fail in files processed by the buildbus babel loader** — notably
  anything under `src/overrides/**` and `src/talons/**` (`Module parse failed:
  Unexpected token`). In those files, use explicit checks and `||` instead of nullish
  coalescing / optional chaining.
