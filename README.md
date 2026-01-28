# LiveSite Widget - Standalone Build

A standalone, independently buildable version of the LiveSite widget that works identically to the original Rails-compiled version.

## Overview

This project extracts the LiveSite widget from the vcita Rails application and provides a pure JavaScript/Node.js build system. The widget maintains 100% API compatibility and identical behavior to the original.

## Project Structure

```
new_livesite_widget/
├── src/                    # Source files (copied from vcita, minimal changes)
│   ├── livesite.js         # Main entry point
│   ├── config.js           # Configuration (converted from .erb)
│   ├── lib/                # Dependencies (jQuery, lodash, colorbox)
│   ├── utils/              # Utility functions
│   ├── ui/                 # UI components
│   └── scss/               # Stylesheets
├── dist/                   # Build output
│   ├── livesite.js         # Bundled widget
│   ├── livesite.css        # Desktop styles
│   └── livesite.mobile.css # Mobile styles
├── demo/                   # Interactive demo page
│   ├── index.html
│   ├── demo.js
│   └── demo.css
└── webpack.config.js        # Build configuration
```

## Installation

```bash
npm install
```

## Building

### Development Build

```bash
# Build JavaScript only
npm run build:js:dev

# Build CSS only
npm run build:css:dev

# Build everything
npm run build:dev
```

### Production Build

```bash
# Build JavaScript only
npm run build:js

# Build CSS only  
npm run build:css

# Build everything
npm run build
```

### Watch Mode

```bash
npm run watch
```

## Usage

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/livesite.cdn.css">
</head>
<body>
  <script src="dist/livesite.js"></script>
  <script>
    LiveSite.init({
      uid: 'your-user-id',
      host: 'www.vcita.com',
      portalHost: 'clients.vcita.com',
      // ... other config options
    });
  </script>
</body>
</html>
```

### Configuration Options

The widget accepts all the same configuration options as the original:

- `uid` - User/account ID
- `host` - Main host URL
- `portalHost` - Portal host URL
- `desktopCss` - Desktop CSS URL
- `mobileCss` - Mobile CSS URL
- `activeEngage` - Show ActiveEngage UI (boolean)
- `engageButton` - Show engage button (boolean)
- `desktopEnabled` - Enable on desktop (boolean)
- `mobileEnabled` - Enable on mobile (boolean)
- `desktopEngageAfter` - Auto-engage delay for desktop (milliseconds)
- `mobileEngageAfter` - Auto-engage delay for mobile (milliseconds)
- `lightbox` - Open actions in lightbox (boolean)
- `log` - Enable logging (boolean)
- `track` - Enable analytics tracking (boolean)
- And many more...

See the original widget documentation for complete configuration options.

### API Methods

All original API methods are available:

```javascript
// Actions
LiveSite.schedule(options);
LiveSite.contact(options);
LiveSite.pay(options);
LiveSite.document(options);
LiveSite.login(options);
LiveSite.myaccount(options);
LiveSite.call(options);

// General action
LiveSite.action('schedule', options);

// UI Control
LiveSite.ui.showActiveEngage();
LiveSite.ui.hideActiveEngage();
LiveSite.ui.toggleActiveEngage();

// State Management
LiveSite.utils.resetState();

// Destroy widget
LiveSite.destroy();
```

## Demo Page

An interactive demo page is included for testing:

1. Build the widget: `npm run build:js:dev`
2. Open `demo/index.html` in a browser
3. Enter a website URL
4. Configure and test the widget

**Note:** Due to CORS restrictions, the widget may need to be loaded directly on the page rather than injected into an iframe. The demo page handles this automatically.

## Development

### Key Principles

- **Zero behavior changes** - Widget works identically to original
- **Minimal code changes** - Only build system modifications
- **Preserve original code** - All source files copied as-is (except config.js.erb → config.js)

### Files Modified

- `src/config.js` - Converted from `config.js.erb` (ERB syntax removed)
- `src/scss/compass-compat.scss` - Compass compatibility layer (new file)
- `src/scss/*.scss` - Compass import replaced with compass-compat

### Files Unchanged

- All JavaScript files (core, actions, bindings, loader, opener, etc.)
- All library files (jQuery, lodash, colorbox)
- All utility files
- All UI files
- SCSS files (except Compass import)

### Build System

- **Webpack** - Module bundling
- **Custom Loader** - Handles Rails-style `//= require` directives
- **Sass** - SCSS compilation
- **Terser** - JavaScript minification

## Testing

### Browser Testing

Test the widget in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### Comparison Testing

1. Load original widget (from Rails app) in one browser tab
2. Load standalone widget in another tab
3. Compare side-by-side:
   - Visual appearance
   - Functionality
   - Console output
   - Network requests

### Functional Testing

- [ ] Widget loads without errors
- [ ] All actions work (schedule, contact, pay, etc.)
- [ ] ActiveEngage UI displays correctly
- [ ] Mobile detection works
- [ ] CSS loads correctly
- [ ] All config options work

## Troubleshooting

### Widget Not Loading

- Check browser console for errors
- Verify `dist/livesite.js` exists
- Ensure CSS files are built
- Check CORS restrictions if loading from different domain

### CSS Not Loading

- Build CSS files: `npm run build:css:dev`
- Check font paths in `dist/fonts/`
- Verify CSS file paths in config

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check webpack loader for `//= require` directive issues
- Verify all source files are in `src/` directory

## Differences from Original

### Build System
- Uses Webpack instead of Rails asset pipeline
- Custom loader handles Rails `//= require` directives
- Separate CSS builds for desktop and mobile

### Configuration
- Default config values instead of ERB template variables
- All values can be overridden via `LiveSite.init()`
- No server-side config API dependency (optional)

### Dependencies
- All dependencies bundled (jQuery, lodash, colorbox)
- No external runtime dependencies
- Self-contained widget

## Contributing

When making changes:

1. **Preserve original behavior** - Test against original widget
2. **Minimal changes** - Only modify what's necessary
3. **Document changes** - Update this README if behavior changes
4. **Test thoroughly** - Use demo page and real browsers

## License

Same license as the original vcita project.

## Support

For issues or questions, refer to the original vcita project documentation or contact the development team.
