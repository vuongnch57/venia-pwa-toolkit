const path = require('path');
const { Targetables } = require('@magento/pwa-buildpack');
const { cachedCleverMerge } = require('webpack/lib/util/cleverMerge');
const VeniaResolverPlugin = require('./VeniaResolverPlugin');
const extendConfiguredRoute = require('./extend-configured-route');

/**
 * Project intercept. Lives at src/targets/local-intercept.js; the root
 * local-intercept.js should be a stub that re-exports this file.
 *
 * NOTE on path depth: the `..` hops below assume this file sits at
 * <project>/src/targets/. If your layout differs, adjust the counts (or the
 * resolver basePath) accordingly — this is the #1 thing that breaks on copy.
 */

// Packages whose `lib/` tree can be overridden under src/overrides/<package>/.
const packagesToOverride = [
  '@magento/peregrine/lib',
  '@magento/venia-ui/lib',
  '@magento/pagebuilder/lib'
];
const resolverPlugins = [];

packagesToOverride.forEach(function(pkg) {
  const parts = pkg.split('/');
  const namespace = parts[0]; // @magento
  const packageName = parts[1]; // venia-ui | peregrine | pagebuilder
  const mainFolder = parts[2]; // lib
  // Rename this namespace to your org/project slug.
  const pluginName = 'myorg/' + packageName + '-override-resolver';
  const destinationDir = path.resolve(
    __dirname,
    '..',
    '..',
    'src',
    'overrides',
    packageName
  );
  const sourceDir = path.resolve(
    __dirname,
    '..',
    '..',
    'node_modules',
    namespace,
    packageName,
    mainFolder
  );

  resolverPlugins.push(
    new VeniaResolverPlugin({
      name: pluginName,
      projectPath: destinationDir,
      veniaUiModulePath: sourceDir
    })
  );
});

module.exports = targets => {
  const targetables = Targetables.using(targets);

  // --- Register the override resolver on both 'normal' and 'context' phases ---
  const webpackCompiler = targets.of('@magento/pwa-buildpack').webpackCompiler;
  ['normal', 'context'].forEach(phase => {
    webpackCompiler.tap(compiler =>
      compiler.resolverFactory.hooks.resolveOptions
        .for(phase)
        .tap('AddVeniaResolverToWebpackConfig', resolveOptions =>
          cachedCleverMerge({ plugins: resolverPlugins }, resolveOptions)
        )
    );
  });

  // --- Example: replace a default Venia export via esModule + spliceSource ---
  // The `remove` value is a CHARACTER LENGTH, derive it from the `before` string.
  // Absolute paths must use forward slashes: `.replace(/\\/g, '/')`.
  //
  // const customSearchPagePath = path
  //   .resolve(__dirname, '..', 'overrides', 'venia-ui', 'components', 'SearchPage', 'searchPage.js')
  //   .replace(/\\/g, '/');
  // const before = "export { default } from '../../components/SearchPage';";
  // targetables
  //   .esModule('@magento/venia-ui/lib/RootComponents/Search/index.js')
  //   .spliceSource({
  //     before,
  //     insert: `export { default } from '${customSearchPagePath}';`,
  //     remove: before.length
  //   });

  // --- Example: inject app-level providers into App/contextProvider.js ---
  // const ContextProvider = targetables.reactComponent(
  //   '@magento/venia-ui/lib/components/App/contextProvider.js'
  // );
  // const StoreContextProvider = ContextProvider.addImport(
  //   "StoreContextProvider from 'src/contexts/store'"
  // );
  // ContextProvider.insertBeforeSource(
  //   'const ContextProvider = ({ children }) => {',
  //   `contextProviders.push(${StoreContextProvider});\n`
  // );

  // --- Example: register a custom route ---
  // Component lives in src/components/, NOT src/overrides/.
  // targets.of('@magento/venia-ui').routes.tap(routes => {
  //   routes.push({
  //     name: 'Thank you page',
  //     pattern: '/checkout/success',
  //     path: require.resolve('../components/ThankYouPage'),
  //     exact: true
  //   });
  //   return routes;
  // });

  // --- Example: register a custom Page Builder content type ---
  // targets.of('@magento/pagebuilder').customContentTypes.tap(contentTypes => {
  //   contentTypes.add({
  //     contentType: 'flash_deal',
  //     importPath:
  //       'src/overrides/pagebuilder/ContentTypes/FlashDeal/flashDealContentType.js'
  //   });
  // });

  // Extra route wiring that needs <AuthRoute> support (customRoutes prop).
  extendConfiguredRoute(targets);
};
