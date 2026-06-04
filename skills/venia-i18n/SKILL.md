---
name: venia-i18n
description: Add or fix user-facing copy and translations in a Venia storefront using react-intl. Use whenever adding visible text, labels, a11y strings, or validator messages — all must be wrapped, never bare literals.
---

# i18n / react-intl (hard rule)

**All user-facing text goes through react-intl.** This is a gate, not a suggestion.

## Rules

1. **No bare string literals** in:
   - JSX text content
   - `alt`, `aria-label`, `placeholder`, `title`, and other meaningful a11y/labels
   Wrap each in `<FormattedMessage id="..." defaultMessage="..." />` or
   `formatMessage({ id, defaultMessage })`.
2. **Validators return `{ id, defaultMessage }`, not strings.** With the Field
   `Message` override in Venia, validators used with `combine` must return the
   message-descriptor object so the message renders translated.
3. **Statically extractable.** Use literal `id` + `defaultMessage` so the extraction
   tooling can find them — no computed/concatenated ids.
4. **Catalog.** Add new strings to `src/i18n/en_US.json` (alias `@i18n`).

## Reviewing an edit

Before finishing any component change, scan the diff for new JSX text / `alt` /
`aria-label` / `placeholder` / `title` that isn't wrapped, and fix it.

## Note

A reliable automated guard needs an ESLint rule (e.g.
`formatjs/no-literal-string-in-jsx` or `react-intl/no-literal-string`), not a regex
hook — recommend wiring that into the project's `.eslintrc` for enforcement.
