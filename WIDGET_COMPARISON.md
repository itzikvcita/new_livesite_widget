# Widget Comparison: Production vs Local

## Key Findings

### 1. **Script Loading Issue (FIXED)**
- **Problem**: Widget container was trying to load `livesite.js` but the actual file is `livesite.min.js`
- **Fix**: Updated `demo/widget-container.html` to use `livesite.min.js`

### 2. **Initialization Pattern Differences**

#### Production Widget (from vcita project):
```javascript
window.liveSiteAsyncInit = function(liveSite) {
  // liveSite object is passed as parameter
  LiveSite.init({
    id: 'WI-2HUTRFBQZWZWH7EF835C'
  });
};

// Loader calls: window.liveSiteAsyncInit(liveSite)
```

#### Local Widget (current):
```javascript
window.liveSiteAsyncInit = function() {
  // No parameter - assumes window.LiveSite is already available
  if (window.LiveSite && window.LiveSite.init) {
    window.LiveSite.init({
      id: 'WI-2HUTRFBQZWZWH7EF835C'
    });
  }
};
```

**Key Difference**: Production loader passes `liveSite` object as parameter, local expects it on `window.LiveSite`

### 3. **Asset Loading System**

#### Production (from `loader.js`):
- Waits for CSS to load (checks for `.ls-ensure-loaded` class)
- Waits for fonts to load
- Waits for config to load from server
- Only initializes after ALL assets are loaded
- Uses `checkCssAssetLoaded()` with polling mechanism

#### Local:
- May initialize before CSS/fonts are fully loaded
- No explicit asset loading checks

### 4. **File Structure**

#### Production:
- Uses Sprockets (`//= require` directives)
- Files in: `app/assets/livesite/`
- Compiled to: `widgets_cdn_host/assets/livesite.js`

#### Local:
- Uses Webpack
- Files in: `src/`
- Compiled to: `dist/livesite.min.js`

### 5. **CSS Loading**

#### Production:
- CSS loaded dynamically via `loadCssFile()` in loader.js
- Checks CSS is loaded by testing if `.ls-ensure-loaded` class has `position: fixed`
- CSS URLs come from config: `desktopCss` or `mobileCss`

#### Local:
- CSS can be pre-loaded in HTML
- Or passed via config: `desktopCss`, `mobileCss`
- May not wait for CSS to fully load before rendering

## Root Cause Analysis

The widget may not be visible because:

1. **Script path was wrong** (404 error) - FIXED
2. **Initialization timing** - Widget may initialize before CSS/fonts are loaded
3. **Asset loading checks** - Production has sophisticated asset loading, local may be missing these checks
4. **Config loading** - Production waits for server config, local may proceed without it

## Recommendations

1. ✅ **FIXED**: Update script path to `livesite.min.js`
2. **Add asset loading checks** similar to production
3. **Ensure CSS is loaded** before rendering
4. **Wait for config** from server before initializing UI
5. **Compare rendered HTML** between production and local to see visual differences

## Next Steps

1. Test the fixed script path
2. Add asset loading checks to local widget
3. Compare side-by-side using `demo/compare.html`
4. Check browser console for any remaining errors
5. Verify CSS and fonts are loading correctly
