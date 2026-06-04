---
name: venia-override
description: Override or fork a Venia, Peregrine, or Page Builder component or talon by mirroring the node_modules file under src/overrides. Use when changing core Venia/Peregrine behavior, forking a UI component, or replacing a core talon.
---

# Override a Venia / Peregrine / Page Builder file

The resolver swaps `@magento/<package>/lib/<path>` for `src/overrides/<package>/<path>`
when the mirrored file exists. To override, recreate the file at the mirrored path.

## Steps

1. **Find the exact source file.** Grep for the symbol inside
   `node_modules/@magento/<venia-ui|peregrine|pagebuilder>/lib/` to locate the real
   file before copying — names are not always where you'd guess.
2. **Mirror the path.** Copy the file to `src/overrides/<package>/<same relative path>`.
   `<package>` is `venia-ui`, `peregrine`, or `pagebuilder`.
3. **Keep `@magento/...` imports intact.** Do NOT rewrite imports to relative
   `node_modules` paths — the resolver redirects `@magento/...` imports to your
   overrides automatically. Rewriting them defeats the resolver.
4. **CSS is the exception.** Change any `.module.css` import to the **local**
   `./component.module.css`, and copy that CSS file alongside if you touch styles.
5. **Split mixed files.** If the forked file declares more than one component,
   split into one component per file as you fork it (project rule) rather than
   copying the mixed file verbatim.
6. **Wrap copy in react-intl.** Any user-facing string you touch must go through
   `<FormattedMessage />` / `formatMessage` (see `venia-i18n`).

## When NOT to use this

- New, additive behavior that doesn't replace a core file → use `venia-talon`
  (talon in `src/talons/`) or a plain component in `src/components/`.
- Swapping a default export wholesale → `venia-targetable-splice`.

## Verify

- Lint/build the new file.
- Confirm the resolver log line `...-override-resolver path: <old> => <new>`
  appears for your file during the build.
