# Webpack Configuration Changes Analysis

## Current Webpack Configuration

### webpack.config.js (Main JavaScript Build)

**Current Settings:**
- **TerserPlugin**: Enabled with:
  - `mangle: false` - Added to try to fix template string issues
  - `drop_console: false` - Added for debugging
  - No special handling for template strings

**Key Observation:**
- The `mangle: false` setting was **added later** (as indicated by the comment "Disable mangling to avoid breaking template strings")
- This suggests the original working version either:
  1. Didn't have TerserPlugin at all
  2. Had TerserPlugin with default settings (mangle: true)
  3. Had different TerserPlugin configuration

## Potential Issues

### 1. TerserPlugin Processing Template Strings

**Problem:**
- TerserPlugin minifies JavaScript, which may corrupt Lodash template strings
- Template strings like `dir="<%= data.rtl ? 'rtl' : 'ltr' %>"` contain special syntax that Terser might misinterpret
- When Terser processes these strings, it might:
  - Escape quotes incorrectly
  - Break the template syntax
  - Generate invalid JavaScript that Lodash can't compile

### 2. String Compression

**Problem:**
- Terser's `compress` option may optimize string literals
- This could break template strings that rely on specific quote escaping
- The current config doesn't explicitly disable string compression

### 3. Build Process Differences

**What We Know:**
- Production widget works (from CDN)
- Local widget fails with `SyntaxError: Unexpected token '='`
- Both use the same source code (after revert)
- The difference must be in the build process

## Questions to Answer

1. **Did the original working version use TerserPlugin?**
   - If yes, what were the settings?
   - If no, what minification was used?

2. **Was the original version minified at all?**
   - Maybe it was only bundled, not minified
   - Maybe it used a different minifier

3. **What changed when the modern widget was added?**
   - Were webpack configs split into multiple files?
   - Was TerserPlugin added/modified at that time?
   - Were any new loaders or plugins added?

## Recommended Investigation Steps

1. **Test without TerserPlugin:**
   ```javascript
   optimization: {
     minimize: false, // Disable minification entirely
   }
   ```
   - Build and test to see if template strings work
   - This will tell us if TerserPlugin is the culprit

2. **Test with TerserPlugin but different settings:**
   - Try with default settings (remove mangle: false)
   - Try with compress disabled
   - Try with format.preserve_annotations

3. **Compare with production build:**
   - Check if production widget is minified
   - Check what minification settings production uses
   - Compare the actual built output

## Current State

- **webpack.config.js**: Has TerserPlugin with `mangle: false`
- **webpack.mobile.config.js**: Has TerserPlugin (for CSS, shouldn't affect JS)
- **webpack.css.config.js**: Has TerserPlugin (for CSS, shouldn't affect JS)

## Next Steps

1. Check if there's a backup of the original working webpack.config.js
2. Test building without TerserPlugin to isolate the issue
3. Compare the built output with production widget's built output
4. Check if the issue occurs in development mode (no minification)
