/**
 * Tailwind theme overrides for a Venia / PWA Studio app, consumed by
 * tailwind.config.js (which extends `@magento/pwa-theme-venia`).
 *
 * This starter ships the responsive `screens` scaffold only — min-width breakpoints
 * plus paired `-xx` max-width and `hxx`/`-hxx` height variants. Add your brand tokens
 * under `extend` (colors, fontFamily, fontSize, transitionDuration, etc.) as needed.
 *
 * Reminder (see CLAUDE.md "Tailwind" rules): Tailwind only generates the utilities this
 * config enables. Anything you don't define here (or in the venia preset) does NOT
 * exist — e.g. `duration-150` fails unless you add a `transitionDuration: { '150': ... }`
 * key under `extend`.
 */
module.exports = {
  screens: {
    xs: '480px',
    '-xs': { max: '479px' },
    sm: '640px',
    '-sm': { max: '639px' },
    hsm: { raw: '(min-height: 640px)' },
    '-hsm': { raw: '(max-height: 639px)' },
    md: '800px',
    '-md': { max: '799px' },
    hmd: { raw: '(min-height: 800px)' },
    '-hmd': { raw: '(max-height: 799px)' },
    lg: '960px',
    '-lg': { max: '959px' },
    hlg: { raw: '(min-height: 960px)' },
    '-hlg': { raw: '(max-height: 959px)' },
    xl: '1024px',
    '-xl': { max: '1023px' },
    '2xl': '1280px',
    '-2xl': { max: '1279px' },
    '3xl': '1440px',
    '-3xl': { max: '1439px' },
    '4xl': '1600px',
    '-4xl': { max: '1599px' },
    max: '1920px',
    '-max': { max: '1920px' }
  }
};
