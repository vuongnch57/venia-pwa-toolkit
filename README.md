# venia-pwa-toolkit

Reusable knowledge for building **Magento PWA Studio / Venia** override-based
storefronts — the override resolver, intercept patterns, conventions, and the
day-to-day workflows. Packaged for **Claude Code** (as a plugin with skills) and
**Cursor** (as copy-in rules), from one source of truth.

## What's inside

| Path | Purpose |
|---|---|
| `skills/` | Claude Code on-demand workflows (override, route, pagebuilder type, splice, talon, i18n, css, bootstrap) |
| `cursor-rules/` | Cursor `.mdc` rules — copy into a project's `.cursor/rules/` (mirrors the 8 skills + conventions) |
| `templates/` | Copy-in infra: `VeniaResolverPlugin.js`, `local-intercept.template.js`, `extend-configured-route.js`, `serve.js`, `theme.js`, `CLAUDE.partial.md` |
| `settings.partial.json` | Reusable permission deny-globs for Magento projects |

## Skills

- **venia-bootstrap** — install the override infrastructure into a fresh project.
- **venia-override** — fork a Venia/Peregrine/Pagebuilder file via the resolver.
- **venia-add-route** — register a custom route (`routes.tap`).
- **venia-pagebuilder-type** — register a custom/extended Page Builder content type.
- **venia-targetable-splice** — replace a default export / inject a provider.
- **venia-talon** — add a new talon + co-located GraphQL.
- **venia-i18n** — react-intl rules (all copy wrapped; validators return `{id,defaultMessage}`).
- **venia-css-module** — Tailwind-in-CSS-modules, shimmers, SVG icons (no react-feather).

## Install

> Run these in the **terminal `claude` CLI** (the `/plugin` command is not available
> in the VSCode/IDE extension chat).
>
> Enter each command on its own line and press Enter — do **not** paste both at once,
> or `marketplace add` will treat the second line as part of its argument and fail
> with `... is not a valid repository name`.

**1. Register this repo as a marketplace** (pick one form):

```
/plugin marketplace add vuongnch57/venia-pwa-toolkit
```

```
/plugin marketplace add https://github.com/vuongnch57/venia-pwa-toolkit.git
```

**2. Then install the plugin:**

```
/plugin install venia-pwa-toolkit
```

**3. Verify** — ask *"override a Venia component"* and confirm the `venia-override`
skill fires, or check `/help`.

Then run the **venia-bootstrap** skill once to wire the resolver, aliases, and
driver mapping. Paste `templates/CLAUDE.partial.md` into the project's CLAUDE.md and
merge `settings.partial.json` into `.claude/settings.json`.

## Use with Cursor

Cursor's native agent doesn't read Claude Code plugins, but the same knowledge ships
as Cursor rules under `cursor-rules/`. Unlike the Claude plugin (installed once,
centrally), Cursor rules live **per project** — copy them into each project's
`.cursor/rules/`:

```
mkdir -p .cursor/rules
cp /path/to/venia-pwa-toolkit/cursor-rules/*.mdc .cursor/rules/
```

How they attach:
- `venia-conventions.mdc` — `alwaysApply: true` (always in context).
- the rest — scoped by `globs` (e.g. `venia-override` on `src/overrides/**`,
  `venia-i18n` on `src/**/*.{js,jsx}`) so they auto-attach when you edit matching files.

Running the **`claude` CLI inside Cursor's integrated terminal** instead uses the
real plugin — no copying needed.

## Caveat — path depth

`VeniaResolverPlugin` and `local-intercept.template.js` assume the intercept lives at
`<project>/src/targets/`. The `path.resolve(__dirname, '..', ...)` hops must reach the
project root and `node_modules/`. If a project's layout differs, adjust the `..`
counts — this is the most likely thing to break on copy.

## TODO

- Add an ESLint rule (`formatjs/no-literal-string-in-jsx` or
  `react-intl/no-literal-string`) recipe to enforce the i18n rule automatically
  instead of relying on review.

---

Author: hoangvuong94st
