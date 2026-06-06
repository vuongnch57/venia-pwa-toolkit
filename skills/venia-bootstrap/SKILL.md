---
name: venia-bootstrap
description: Set up Venia / Magento PWA Studio override infrastructure in a fresh project — install the resolver, local-intercept, path aliases, driver mapping, and build-env quirks. Use when a project needs the override system wired up for the first time.
---

# Bootstrap Venia override infrastructure

Install the override resolver and supporting wiring into a Magento PWA Studio / Venia
project. Run once per project. The templates referenced live in this plugin's
`templates/` directory.

## Steps

1. **Copy targets.** Create `src/targets/` and copy in:
   - `VeniaResolverPlugin.js` (verbatim from `templates/`)
   - `extend-configured-route.js` (verbatim)
   - `local-intercept.template.js` → save as `src/targets/local-intercept.js`
2. **Verify path depth.** The `path.resolve(__dirname, '..', '..', ...)` hops in
   `local-intercept.js` and the resolver `basePath` assume this file sits at
   `<project>/src/targets/`. Confirm the `..` counts reach the project root and
   `node_modules/` for THIS project's layout — this is the most common copy break.
   If layout differs, adjust the counts.
3. **Stub the root intercept.** Make root `local-intercept.js` re-export the real one:
   `module.exports = require('./src/targets/local-intercept');`
4. **Rename the resolver namespace.** In `local-intercept.js`, change the
   `'myorg/...-override-resolver'` plugin name to the project's org/slug.
5. **Path aliases.** Add to webpack `resolve.alias` AND `jsconfig.json` `paths`:
   `@/` → `src`, `@components`, `@utils`, `@hooks`, `@talons`, `@overrides`, `@i18n`.
6. **Driver mapping.** In `package.json`, add the `browser` field:
   `{ "@magento/venia-drivers": "src/drivers" }` and create `src/drivers/index.js`
   re-exporting `@magento/venia-ui/lib/drivers`.
7. **Theme tokens.** Copy `templates/theme.js` (responsive `screens` scaffold) to the
   project root and have `tailwind.config.js` consume it (extending
   `@magento/pwa-theme-venia`). Add the brand's tokens under `extend` (colors,
   fontFamily, fontSize, etc.). Remember: only utilities defined here exist — add a
   `transitionDuration` key before using a new `duration-*` class (this is why
   `duration-150` fails by default).
8. **Custom server (optional).** Copy `templates/serve.js` to the project root for a
   production server with immutable static caching, image-opt, gzip, and custom
   HTTPS/port handling. Wire a script (e.g. `"start:c": "node serve.js"`). It depends on
   a local `createUpwardServer.js` (or adapt to `@magento/upward-js`); add custom
   middleware inside `before(app)`.
9. **Build env.** Note in scripts/docs that production build may need
   `NODE_OPTIONS=--openssl-legacy-provider`. `??` / `?.` fail in buildbus-babel files
   under `src/overrides/**` and `src/talons/**` — use explicit checks and `||` there.
10. **Conventions.** Paste `templates/CLAUDE.partial.md` into the project's CLAUDE.md.
    Merge `settings.partial.json` deny-globs into `.claude/settings.json`.

## Verify

- Create a trivial override (a one-line edited file mirrored under
  `src/overrides/venia-ui/...`) and run a dev build; confirm the resolver log line
  `...-override-resolver path: <old> => <new>` appears.

Then use `venia-override` for component/talon forks and `venia-add-route` /
`venia-pagebuilder-type` / `venia-targetable-splice` for the intercept patterns.
