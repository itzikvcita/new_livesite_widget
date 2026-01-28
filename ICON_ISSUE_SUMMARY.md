# Icon Rendering Issue Summary

## Problem
The close 'x' button and hamburger (more actions) button icons are not rendering, even though:
- ✅ Both buttons exist in HTML
- ✅ CSS content values are correct (`\e812` for close, `\e808` for menu)
- ✅ Font-family is set to `ls-icomoon`
- ✅ Font is loaded according to browser
- ✅ Characters exist in font file (verified in SVG)

## Current CSS State

### Close Button
- **Rule**: `#livesite_active_engage .ls-close:before`
- **Content**: `content: "\e812"` ✓
- **Font-family**: `ls-icomoon` ✓
- **All font properties**: Set correctly ✓

### More Actions Button
- **Rule**: `#livesite_active_engage .ls-content .ls-more-actions-C .ls-more-actions:before`
- **Content**: `content: "\e808"` ✓
- **Font-family**: `ls-icomoon` ✓ (explicitly added)
- **All properties**: Set correctly ✓

## Root Cause Hypothesis

The most likely issue is **font file path resolution**. The CSS uses relative paths:
```css
@font-face {
  font-family: "ls-icomoon";
  src: url(fonts/icomoon.eot);
  src: url(fonts/icomoon.woff) format("woff");
  ...
}
```

When the CSS is loaded in an iframe at `http://localhost:5000/demo/widget-container.html`, the relative path `fonts/icomoon.woff` resolves to:
- `http://localhost:5000/demo/fonts/icomoon.woff` ❌ (wrong!)

But the actual font files are at:
- `http://localhost:5000/dist/fonts/icomoon.woff` ✓ (correct)

## Solution

The font paths in the CSS need to be absolute or relative to the CSS file location, not relative to the HTML document.

### Option 1: Use absolute paths in CSS
Change font paths to be absolute from the CSS file location.

### Option 2: Copy fonts to demo directory
Copy font files to `demo/fonts/` so relative paths work.

### Option 3: Use CSS `url()` with correct relative path
Ensure font paths are relative to the CSS file, not the HTML.

## Next Steps

1. Check if font files are actually loading (network tab)
2. Compare font paths between production and local
3. Fix font path resolution
4. Test icon rendering after fix
