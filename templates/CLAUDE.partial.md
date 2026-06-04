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
- Keep imports as `@magento/...` so the resolver can swap in overrides.
- In a component override, import the **local** `./component.module.css`, not the
  CSS path inside `node_modules`.

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

## i18n

- Messages catalog at `src/i18n/en_US.json`; alias `@i18n` points there.
- With the **Field `Message` override**, validators return `{ id, defaultMessage }`,
  not plain strings.
- Keep new strings statically discoverable for extraction.

## Tailwind in Venia CSS Modules

- Separator is `_` (e.g. `md_pt-10`). Use `composes: ... from global` in `.module.css`.
- Theme extends `@magento/pwa-theme-venia` via `tailwind.config.js` / `theme.js`.

## Loading States

- Prefer a **page shimmer** for initial load; avoid `fullPageLoadingIndicator` as
  the default. Align shimmer spacing with the real page (header/title).

## Icons

- New icons live in `src/components/Icons/` (inline SVG as a React component).
- **No `react-feather`** (or other icon libs) for app icons.
- **From Figma MCP:** when a design node is an SVG icon, *clone* it into a JS icon
  component under `src/components/Icons/` — do not pull the equivalent from
  react-feather or render the raw asset.

## Build / Node

- Production build may set `NODE_OPTIONS=--openssl-legacy-provider` for OpenSSL
  compatibility — preserve if upgrading Node/webpack.
- If webpack fails on `??` / `?.`, rewrite with explicit checks and `||` in that file.
