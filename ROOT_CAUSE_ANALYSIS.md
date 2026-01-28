# Root Cause Analysis: Why Production and Local Widgets Are Different

## The Core Issue

**Production behavior:**
- The widget's `loader.js` (line 86) checks `fn.isMobile()` and loads **ONLY ONE** CSS file:
  ```javascript
  var url = fn.isMobile() ? liveSite.config.mobileCss : liveSite.config.desktopCss;
  loadCssFile(url, 'css', 'ls-ensure-loaded');
  ```
- On desktop: loads `desktopCss` only → `livesite.css`
- On mobile: loads `mobileCss` only → `livesite_mobile.css`
- **Result:** Only one CSS file is active, no conflicts

**Local/Demo behavior:**
- Demo HTML files (`compare.html`, `widget-container.html`, `side-by-side.html`) **manually preload BOTH CSS files** in the `<head>`:
  ```html
  <link rel="stylesheet" href="${baseUrl}/../dist/livesite.min.css">
  <link rel="stylesheet" href="${baseUrl}/../dist/livesite.mobile.min.css">
  ```
- Then the widget ALSO loads its CSS via `loader.js`
- **Result:** Both CSS files are loaded, mobile CSS (loaded last) overrides desktop CSS

## Evidence from Browser Automation

**Production CSS files loaded:**
- `livesite.css` (1 file)

**Local CSS files loaded:**
- `livesite.min.css`
- `livesite.mobile.min.css` 
- `livesite.min.css` (duplicate, loaded by widget)
- **Total: 3 CSS files**

## Why This Causes Problems

1. **Mobile CSS rules are NOT scoped** - They use the same selectors as desktop CSS (e.g., `#livesite_active_engage .ls-close:before`)
2. **No media queries** - Mobile CSS doesn't use `@media` queries to scope rules
3. **No class-based scoping** - Mobile CSS doesn't use `.ls-mobile` class selectors to scope rules
4. **Load order matters** - When both files load, the last one wins (mobile CSS)

## The Design Intent

The widget is designed to:
1. Detect device type via `fn.isMobile()`
2. Add class `ls-desktop` or `ls-mobile` to the widget container
3. Load **only the appropriate CSS file** for that device type
4. Never load both files simultaneously

## Why Demo Pages Load Both Files

The demo pages were likely created to:
- Show both desktop and mobile CSS in the same page
- Allow testing both versions
- But this breaks the intended single-CSS-file architecture

## Is Loading Only One CSS File a Problem?

**No, it's the correct design!** Here's why:

### How the Widget Works

1. **Device Detection at Init**: `fn.isMobile()` checks user agent **once** at initialization
2. **Single CSS Load**: `loader.js` loads **only one** CSS file based on device type
3. **No Dynamic Switching**: The widget does NOT reload CSS when window resizes
4. **Class-Based Styling**: Widget adds `ls-desktop` or `ls-mobile` class to container
5. **Asset Caching**: Once `loaded_assets.css` is true, CSS won't reload (line 134 in `loader.js`)

### Why This Design Makes Sense

- **Embedded Widget**: This is an embedded widget, not a full responsive website
- **Device Type, Not Window Size**: Widget detects device type (mobile/desktop), not window dimensions
- **Performance**: Loading only one CSS file is more efficient
- **Simplicity**: No need for complex responsive switching logic

### Potential Edge Cases (Not Problems)

- **Window Resize**: If user resizes browser from desktop to mobile size, widget won't adapt
  - **This is intentional**: Widget is designed for device type, not window size
- **Device Rotation**: If user rotates device, widget won't switch CSS
  - **This is intentional**: Widget detects device type once at init

### The Real Problem

The demo pages are **breaking this design** by manually loading both CSS files. This causes:
- Mobile CSS overriding desktop CSS
- Conflicts between desktop and mobile rules
- Inconsistent behavior compared to production

## Solution Options

### Option 1: Remove Manual CSS Loading (Recommended)
Let the widget load CSS automatically via `loader.js`:
- Remove the `<link>` tags from demo HTML files
- Let `loader.js` handle CSS loading based on `fn.isMobile()`
- This matches production behavior exactly

### Option 2: Scope Mobile CSS Rules
Wrap mobile CSS rules in `.ls-mobile` class selectors:
- Change `#livesite_active_engage .ls-close:before` to `#livesite_active_engage.ls-mobile .ls-close:before`
- This would prevent mobile CSS from affecting desktop widgets
- But this requires refactoring all mobile CSS rules

### Option 3: Use Media Queries
Wrap mobile CSS in `@media` queries:
- Only apply mobile CSS on small screens
- But this doesn't match the current architecture and would break the single-CSS design

## Current State

- Widget class: Both production and local have `ls-desktop` class ✓
- CSS loading: Production loads 1 file, local loads 3 files ✗
- This is the root cause of all styling differences
