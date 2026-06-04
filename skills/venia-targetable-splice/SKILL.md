---
name: venia-targetable-splice
description: Replace a default Venia export or inject an app-level provider using Targetables (esModule spliceSource / reactComponent insertBeforeSource). Use when you must swap a whole module export or add a context provider into App/contextProvider.js.
---

# Targetable splice / provider injection

For cases the file-mirror resolver can't handle: replacing a module's export
wholesale, or inserting code into a core file.

## Replace a default export

```js
const before = "export { default } from '../../components/SearchPage';";
const customPath = path
  .resolve(__dirname, '..', 'overrides', 'venia-ui', 'components', 'SearchPage', 'searchPage.js')
  .replace(/\\/g, '/'); // forward slashes required (Windows safety)

targetables
  .esModule('@magento/venia-ui/lib/RootComponents/Search/index.js')
  .spliceSource({
    before,
    insert: `export { default } from '${customPath}';`,
    remove: before.length // remove is a CHARACTER LENGTH, derive from `before`
  });
```

Gotchas:
- `remove` is a character count, not a line count — compute it from the `before`
  string so it stays correct if the source changes.
- Always `.replace(/\\/g, '/')` absolute paths.

## Inject app-level providers

```js
const ContextProvider = targetables.reactComponent(
  '@magento/venia-ui/lib/components/App/contextProvider.js'
);
const StoreContextProvider = ContextProvider.addImport(
  "StoreContextProvider from 'src/contexts/store'"
);
ContextProvider.insertBeforeSource(
  'const ContextProvider = ({ children }) => {',
  `contextProviders.push(${StoreContextProvider});\n`
);
```

Repeat `addImport` + `insertBeforeSource` per provider. Providers live in
`src/contexts/`.

## When to prefer the resolver instead

If you're changing the *body* of a component (not its export wiring), just fork it
with `venia-override` — simpler and less brittle than splicing source strings.
