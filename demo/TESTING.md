# Testing Guide for Widget Container

## Quick Test Steps

1. **Start a local server** (from the project root):
   ```bash
   cd C:\Programming\new_livesite_widget
   python -m http.server 8000
   ```

2. **Open the demo page**:
   - Navigate to: `http://localhost:8000/demo/index.html`

3. **Test with a business ID**:
   - In the demo page, edit the config to set a real business ID/UID
   - Enter a website URL (e.g., `https://example.com`)
   - Click "Load"
   - The widget should:
     - Load the website in a nested iframe
     - Fetch configuration from server using the business ID
     - Display the widget overlaying the website

## What to Verify

### ✅ Configuration Fetching
- [ ] Console shows: "Using business ID to fetch config from server: [ID]"
- [ ] Network tab shows request to: `{host}/widgets/active_engage/configuration?id={id}`
- [ ] Widget receives and applies server configuration

### ✅ Widget Display
- [ ] Widget appears as a floating overlay on top of the website
- [ ] Widget is not embedded in the page content
- [ ] Widget buttons/actions are clickable

### ✅ Iframe Structure
- [ ] Main iframe contains widget-container.html
- [ ] Nested iframe contains the external website
- [ ] Both iframes load successfully

### ✅ Fallback Behavior
- [ ] If no business ID provided, shows warning in console
- [ ] Widget still initializes with minimal config
- [ ] Can still pass full config via URL parameter if needed

## Test URLs

### With Business ID:
```
http://localhost:8000/demo/widget-container.html?id=YOUR_BUSINESS_ID&url=https://example.com
```

### Without Business ID (fallback):
```
http://localhost:8000/demo/widget-container.html?url=https://example.com
```

## Expected Console Output

When working correctly, you should see:
```
Using business ID to fetch config from server: [ID]
Initializing LiveSite widget with config: {host: "...", portalHost: "...", id: "..."}
LiveSite widget initialized
Loading website in iframe: https://example.com
Website loaded in iframe
```

## Troubleshooting

- **Widget doesn't appear**: Check browser console for errors
- **Config not fetching**: Verify business ID is correct and server endpoint is accessible
- **Iframe blank**: Website may block iframe embedding (X-Frame-Options)
- **CORS errors**: Normal for cross-origin websites, widget should still work
