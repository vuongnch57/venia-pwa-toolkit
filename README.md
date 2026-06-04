# venia-pwa-toolkit

A Claude Code plugin packaging the reusable knowledge for building **Magento PWA
Studio / Venia** override-based storefronts: the override resolver, intercept
patterns, conventions, and the day-to-day workflows as skills.

## What's inside

| Path | Purpose |
|---|---|
| `skills/` | On-demand workflows (override, route, pagebuilder type, splice, talon, i18n, css, bootstrap) |
| `templates/` | Copy-in infra: `VeniaResolverPlugin.js`, `local-intercept.template.js`, `extend-configured-route.js`, `CLAUDE.partial.md` |
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

From a target Venia project:

```
/plugin marketplace add <git-url-or-local-path-to-this-repo>
/plugin install venia-pwa-toolkit
```

Then run the **venia-bootstrap** skill once to wire the resolver, aliases, and
driver mapping. Paste `templates/CLAUDE.partial.md` into the project's CLAUDE.md and
merge `settings.partial.json` into `.claude/settings.json`.

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
