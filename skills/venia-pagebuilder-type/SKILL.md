---
name: venia-pagebuilder-type
description: Register a custom or extended Page Builder content type in a Venia storefront. Use when adding a new Page Builder block (e.g. flash_deal) or extending an existing one (banner, text, column-group).
---

# Register a Page Builder content type

Tap `targets.of('@magento/pagebuilder').customContentTypes.tap` in
`src/targets/local-intercept.js`; implementation lives under
`src/overrides/pagebuilder/`.

## Custom content type

1. **Implement under `src/overrides/pagebuilder/ContentTypes/<Type>/`:**
   - `<type>ContentType.js` — config entry (`importPath` target).
   - a masked-render config + a frontend React component.
2. **Register it:**
   ```js
   targets.of('@magento/pagebuilder').customContentTypes.tap(contentTypes => {
     contentTypes.add({
       contentType: 'flash_deal',
       importPath:
         'src/overrides/pagebuilder/ContentTypes/FlashDeal/flashDealContentType.js'
     });
   });
   ```

## Extending an existing type

To customize a built-in type (Banner, Text, ColumnGroup, Html, Buttons/ButtonItem,
Products/Carousel), fork the Venia/Pagebuilder component with `venia-override`
(mirror under `src/overrides/pagebuilder/...`) rather than registering a new type.

## Rules

- One component per file; wrap all copy in react-intl.
- Keep `@magento/...` imports intact so the resolver swaps forked files.

## Verify

Add the block in the Page Builder admin (or a CMS fixture) and confirm it renders on
the storefront.
