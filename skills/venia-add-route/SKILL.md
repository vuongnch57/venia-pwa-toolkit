---
name: venia-add-route
description: Add a custom page/route to a Venia storefront via routes.tap in local-intercept.js. Use when creating a new top-level page (e.g. a landing page, thank-you page, account sub-page).
---

# Add a custom route

Register routes by tapping `targets.of('@magento/venia-ui').routes.tap` in
`src/targets/local-intercept.js`.

## Steps

1. **Build the page component in `src/components/`** — NOT under `overrides/`.
   One component per file; wrap all copy in react-intl.
2. **Tap routes** in `local-intercept.js`:
   ```js
   targets.of('@magento/venia-ui').routes.tap(routes => {
     routes.push({
       name: 'Thank you page',
       pattern: '/checkout/success',
       path: require.resolve('../components/ThankYouPage'),
       exact: true
     });
     return routes;
   });
   ```
   - `path` uses `require.resolve('../components/<Comp>')` (relative to
     `src/targets/`).
   - `pattern` supports params (`/order-detail/:orderNumber`) and you can push many
     routes in one tap by mapping an array.
3. **Authed routes.** For routes that need auth + redirect
   (`authed: true, redirectTo: '/'`), the component is rendered through the
   `customRoutes` mechanism wired by `extend-configured-route.js`. Make sure
   `extendConfiguredRoute(targets)` runs in `local-intercept.js`.

## Editing an existing route

To change behavior of a route Venia already defines, don't add a duplicate — fork
the relevant component with `venia-override`, or adjust via
`extend-configured-route.js`.

## Verify

Run the dev server and navigate to the `pattern`; confirm the component renders and
deep-link/refresh works.
