// Demo page JavaScript
(function() {
  'use strict';

  // State
  let currentConfig = getDefaultConfig();
  let widgetInitialized = false;
  let consoleLogs = [];

  // DOM Elements
  const websiteUrlInput = document.getElementById('website-url');
  const loadWebsiteBtn = document.getElementById('load-website');
  const configPresetSelect = document.getElementById('config-preset');
  const editConfigBtn = document.getElementById('edit-config');
  const versionClassicRadio = document.getElementById('version-classic');
  const versionModernRadio = document.getElementById('version-modern');
  const iframeContainer = document.getElementById('iframe-container');
  const iframePlaceholder = document.getElementById('iframe-placeholder');
  const targetIframe = document.getElementById('target-iframe');
  const toggleWidgetBtn = document.getElementById('toggle-widget');
  const resetWidgetBtn = document.getElementById('reset-widget');
  const reloadWidgetBtn = document.getElementById('reload-widget');
  const showConsoleBtn = document.getElementById('show-console');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  const configModal = document.getElementById('config-modal');
  const consoleModal = document.getElementById('console-modal');

  // Store config globally for async init
  window.demoConfig = getDefaultConfig();
  
  // Initialize
  loadConfigFromStorage();
  setupEventListeners();
  interceptConsole();
  
  // Update global config after loading from storage
  if (window.demoConfig) {
    window.demoConfig = { ...window.demoConfig, ...currentConfig };
  } else {
    window.demoConfig = currentConfig;
  }
  
  // Check if widget loaded on page load
  // NOTE: Widget should NOT be initialized on the demo page - only in the iframe
  window.addEventListener('load', function() {
    setTimeout(function() {
      // Widget script is not loaded on demo page - it's only in widget-container.html
      updateStatus('Ready - Click "Load" to test widget in iframe', 'success');
      addConsoleLog('Demo page loaded - widget will initialize in iframe when website is loaded', 'info');
      
      // Auto-load vcita.com for testing (if configured)
      if (websiteUrlInput.value.includes('vcita.com')) {
        setTimeout(loadWebsite, 1000);
      }
    }, 500);
  });

  function getDefaultConfig() {
    return {
      // Business ID/UID - widget will fetch full config from server using this ID
      // Replace with a real business ID to fetch actual configuration
      id: 'WI-2HUTRFBQZWZWH7EF835C', // Production format: 'WI-...' - widget will fetch config from server
      host: 'www.vcita.com',
      portalHost: 'clients.vcita.com',
      widgetsCdnHost: 'widgets.vcdnita.com',
      version: 'classic', // Widget version: 'classic' or 'modern'
      activeEngage: true,
      engageButton: true,
      desktopEnabled: true,
      mobileEnabled: true,
      desktopEngageAfter: 5000,
      mobileEngageAfter: 5000,
      lightbox: true,
      log: true,
      track: true,
      identifyClient: false,
      myAccountAction: true,
      actionButtons: true,
      inlineActions: true,
      collapsedActions: true,
      // Add text content for the widget
      engageButtonText: 'Contact Us',
      activeEngageTitle: 'Welcome!',
      activeEngageText: 'How can we help you today?',
      activeEngageAction: 'schedule',
      activeEngageActionText: 'Schedule Appointment',
      textMyAccount: 'My Account',
      textMore: 'More',
      // Add some default actions
      actions: [
        { name: 'schedule', action: 'schedule', text: 'Schedule', icon: 'cal' },
        { name: 'contact', action: 'contact', text: 'Contact', icon: 'env' },
        { name: 'call', action: 'call', text: 'Call', icon: 'phone' }
      ],
      desktopCss: '../dist-classic/livesite.min.css',
      mobileCss: '../dist-classic/livesite.mobile.min.css',
    };
  }

  function getPresetConfig(preset) {
    const config = getDefaultConfig();
    switch(preset) {
      case 'development':
        config.log = true;
        config.track = false;
        break;
      case 'production':
        config.log = false;
        config.track = true;
        break;
    }
    return config;
  }

  function setupEventListeners() {
    loadWebsiteBtn.addEventListener('click', loadWebsite);
    websiteUrlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') loadWebsite();
    });

    configPresetSelect.addEventListener('change', (e) => {
      if (e.target.value !== 'custom') {
        currentConfig = getPresetConfig(e.target.value);
        saveConfigToStorage();
        updateStatus('Configuration preset applied', 'success');
      }
    });

    // Version selection listeners
    if (versionClassicRadio) {
      versionClassicRadio.addEventListener('change', function() {
        if (this.checked) {
          currentConfig.version = 'classic';
          updateCssUrlsForVersion('classic');
          saveConfigToStorage();
          updateStatus('Switched to Classic version', 'success');
          addConsoleLog('Widget version changed to: Classic', 'info');
          // Always reload widget if iframe is loaded (regardless of widgetInitialized flag)
          if (targetIframe.src && targetIframe.src !== 'about:blank') {
            reloadWidget();
          }
        }
      });
    }

    if (versionModernRadio) {
      versionModernRadio.addEventListener('change', function() {
        if (this.checked) {
          currentConfig.version = 'modern';
          updateCssUrlsForVersion('modern');
          saveConfigToStorage();
          updateStatus('Switched to Modern version', 'success');
          addConsoleLog('Widget version changed to: Modern', 'info');
          // Always reload widget if iframe is loaded (regardless of widgetInitialized flag)
          if (targetIframe.src && targetIframe.src !== 'about:blank') {
            reloadWidget();
          }
        }
      });
    }

    editConfigBtn.addEventListener('click', showConfigModal);
    document.getElementById('close-config').addEventListener('click', hideConfigModal);
    document.getElementById('save-config').addEventListener('click', saveConfig);
    document.getElementById('reset-config').addEventListener('click', resetConfig);
    document.getElementById('cancel-config').addEventListener('click', hideConfigModal);

    toggleWidgetBtn.addEventListener('click', toggleWidget);
    resetWidgetBtn.addEventListener('click', resetWidget);
    reloadWidgetBtn.addEventListener('click', reloadWidget);
    showConsoleBtn.addEventListener('click', showConsole);
    document.getElementById('close-console').addEventListener('click', hideConsole);
    document.getElementById('clear-console').addEventListener('click', clearConsole);

    // Close modals on outside click
    configModal.addEventListener('click', (e) => {
      if (e.target === configModal) hideConfigModal();
    });
    consoleModal.addEventListener('click', (e) => {
      if (e.target === consoleModal) hideConsole();
    });
  }

  function loadWebsite() {
    const url = websiteUrlInput.value.trim();
    if (!url) {
      updateStatus('Please enter a URL', 'error');
      return;
    }

    // Add protocol if missing
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = 'https://' + url;
    }

    updateStatus('Loading website with widget...', 'warning');

    // Reset iframe
    targetIframe.src = 'about:blank';
    
    // Show iframe and hide placeholder
    iframePlaceholder.style.display = 'none';
    targetIframe.style.display = 'block';
    
    // Ensure iframe has proper dimensions and visibility
    targetIframe.style.width = '100%';
    targetIframe.style.height = '100%';
    targetIframe.style.border = 'none';
    targetIframe.style.visibility = 'visible';
    targetIframe.style.opacity = '1';
    
    // Build URL for widget-container.html with parameters
    const widgetContainerUrl = new URL('widget-container.html', window.location.href);
    widgetContainerUrl.searchParams.set('url', fullUrl);
    
    // Pass business ID/UID if available (widget will fetch config from server)
    if (currentConfig.uid) {
      widgetContainerUrl.searchParams.set('id', currentConfig.uid);
      addConsoleLog(`Using business ID: ${currentConfig.uid} - widget will fetch config from server`, 'info');
    } else if (currentConfig.id) {
      widgetContainerUrl.searchParams.set('id', currentConfig.id);
      addConsoleLog(`Using business ID: ${currentConfig.id} - widget will fetch config from server`, 'info');
    } else {
      // Fallback: pass full config if no ID available (for demo/testing)
      widgetContainerUrl.searchParams.set('config', encodeURIComponent(JSON.stringify(currentConfig)));
      addConsoleLog('No business ID found - passing full config (widget may not fetch from server)', 'warn');
    }
    
    // Pass host configuration
    if (currentConfig.host) {
      widgetContainerUrl.searchParams.set('host', currentConfig.host);
    }
    if (currentConfig.portalHost) {
      widgetContainerUrl.searchParams.set('portalHost', currentConfig.portalHost);
    }
    
    // Enable logging if configured
    if (currentConfig.log) {
      widgetContainerUrl.searchParams.set('log', 'true');
    }
    
    // Pass widget version (classic or modern)
    if (currentConfig.version) {
      widgetContainerUrl.searchParams.set('version', currentConfig.version);
      addConsoleLog(`Widget version: ${currentConfig.version}`, 'info');
    }
    
    addConsoleLog(`Loading widget container: ${widgetContainerUrl.href}`, 'info');
    addConsoleLog(`Target website: ${fullUrl}`, 'info');

    // Set up message listener for communication with widget container
    const messageHandler = (event) => {
      // Verify origin for security (in production, check against expected origin)
      if (event.data && event.data.type) {
        switch (event.data.type) {
          case 'livesite-widget-initialized':
            if (event.data.success) {
              updateStatus('Widget initialized successfully', 'success');
              addConsoleLog('Widget initialized in container', 'info');
            } else {
              updateStatus('Widget initialization failed: ' + (event.data.error || 'Unknown error'), 'error');
              addConsoleLog('Widget initialization error: ' + (event.data.error || 'Unknown'), 'error');
            }
            break;
          case 'website-loaded':
            updateStatus('Website loaded successfully', 'success');
            addConsoleLog('Website loaded in nested iframe: ' + (event.data.url || ''), 'info');
            break;
          case 'website-load-error':
            updateStatus('Failed to load website (may be blocked by X-Frame-Options)', 'warning');
            addConsoleLog('Website failed to load: ' + (event.data.url || ''), 'warn');
            break;
        }
      }
    };
    window.addEventListener('message', messageHandler);
    
    // Store handler for cleanup
    targetIframe._messageHandler = messageHandler;

    // Set a timeout to detect if iframe fails to load
    let loadTimeout = setTimeout(() => {
      updateStatus('Loading is taking longer than expected...', 'warning');
      addConsoleLog('Widget container load timeout', 'warn');
    }, 10000);

    targetIframe.onload = () => {
      clearTimeout(loadTimeout);
      updateStatus('Widget container loaded', 'success');
      addConsoleLog('Widget container iframe loaded', 'info');
    };

    targetIframe.onerror = () => {
      clearTimeout(loadTimeout);
      updateStatus('Failed to load widget container', 'error');
      addConsoleLog('Widget container iframe failed to load', 'error');
      iframePlaceholder.style.display = 'flex';
      targetIframe.style.display = 'none';
    };
    
    // Load widget container page
    targetIframe.src = widgetContainerUrl.href;
  }

  function injectWidgetIntoIframe() {
    try {
      const iframeDoc = targetIframe.contentDocument || targetIframe.contentWindow.document;
      
      if (!iframeDoc) {
        throw new Error('Cannot access iframe document - CORS restriction');
      }
      
      // Ensure iframe has head and body
      if (!iframeDoc.head) {
        iframeDoc.head = iframeDoc.createElement('head');
        iframeDoc.documentElement.appendChild(iframeDoc.head);
      }
      if (!iframeDoc.body) {
        iframeDoc.body = iframeDoc.createElement('body');
        iframeDoc.documentElement.appendChild(iframeDoc.body);
      }
      
      // Get absolute URLs based on the demo page's location
      const demoPageUrl = new URL(window.location.href);
      const basePath = demoPageUrl.pathname.substring(0, demoPageUrl.pathname.lastIndexOf('/'));
      const widgetScriptUrl = `${demoPageUrl.origin}${basePath}/../dist/livesite.js`;
      const widgetCssUrl = `${demoPageUrl.origin}${basePath}/../dist/livesite.cdn.css`;
      const widgetMobileCssUrl = `${demoPageUrl.origin}${basePath}/../dist/livesite.mobile.cdn.css`;
      
      addConsoleLog(`Injecting widget into iframe. Script URL: ${widgetScriptUrl}`, 'info');
      addConsoleLog(`Iframe document ready: ${iframeDoc.readyState}, has head: ${!!iframeDoc.head}, has body: ${!!iframeDoc.body}`, 'info');
      
      // Inject widget script
      const script = iframeDoc.createElement('script');
      script.src = widgetScriptUrl;
      script.onerror = () => {
        updateStatus('Failed to load widget script in iframe. Check console for details.', 'error');
        addConsoleLog(`Failed to load widget script from: ${widgetScriptUrl}`, 'error');
        console.error('Widget script failed to load. URL:', widgetScriptUrl);
      };
      script.onload = () => {
        addConsoleLog('Widget script loaded successfully in iframe', 'info');
        
        // Try to inject CSS (optional - widget can use CDN defaults)
        // Check if CSS files exist by trying to load them
        const desktopCss = iframeDoc.createElement('link');
        desktopCss.rel = 'stylesheet';
        desktopCss.href = widgetCssUrl;
        desktopCss.onerror = () => {
          addConsoleLog(`Local desktop CSS not found (${widgetCssUrl}) - widget will use CDN defaults`, 'warn');
        };
        desktopCss.onload = () => {
          addConsoleLog('Desktop CSS loaded from local file', 'info');
        };
        iframeDoc.head.appendChild(desktopCss);

        const mobileCss = iframeDoc.createElement('link');
        mobileCss.rel = 'stylesheet';
        mobileCss.href = widgetMobileCssUrl;
        mobileCss.onerror = () => {
          addConsoleLog(`Local mobile CSS not found (${widgetMobileCssUrl}) - widget will use CDN defaults`, 'warn');
        };
        mobileCss.onload = () => {
          addConsoleLog('Mobile CSS loaded from local file', 'info');
        };
        iframeDoc.head.appendChild(mobileCss);

        // Initialize widget in iframe - wait a bit for CSS to load
        setTimeout(() => {
          const iframeWindow = iframeDoc.defaultView || targetIframe.contentWindow;
          
          if (!iframeWindow || !iframeWindow.LiveSite) {
            updateStatus('LiveSite object not found in iframe after script load', 'error');
            addConsoleLog('window.LiveSite is not defined in iframe. Check if script loaded correctly.', 'error');
            console.error('LiveSite not found. Iframe window:', iframeWindow);
            return;
          }
          
          addConsoleLog('LiveSite object found, initializing widget...', 'info');
          
          // Prepare config - don't override CSS URLs if local files don't exist
          // Let widget use its default CDN URLs
          const widgetConfig = { ...currentConfig };
          
          // Only set CSS URLs if we want to override (remove them to use defaults)
          // widgetConfig.desktopCss = widgetCssUrl;
          // widgetConfig.mobileCss = widgetMobileCssUrl;
          
          const initScript = iframeDoc.createElement('script');
          initScript.textContent = `
            (function() {
              try {
                console.log('Checking LiveSite availability...');
                console.log('window.LiveSite:', typeof window.LiveSite);
                console.log('window.LiveSite.init:', typeof (window.LiveSite && window.LiveSite.init));
                
                if (window.LiveSite && window.LiveSite.init) {
                  console.log('Initializing LiveSite widget in iframe with config:', ${JSON.stringify(widgetConfig)});
                  window.LiveSite.init(${JSON.stringify(widgetConfig)});
                  console.log('LiveSite widget initialized successfully');
                  
                  // Trigger a custom event to notify parent
                  if (window.parent) {
                    window.parent.postMessage({ type: 'livesite-widget-initialized', success: true }, '*');
                  }
                } else {
                  console.error('LiveSite.init not available');
                  if (window.parent) {
                    window.parent.postMessage({ type: 'livesite-widget-initialized', success: false, error: 'LiveSite.init not available' }, '*');
                  }
                }
              } catch (error) {
                console.error('Error initializing widget:', error);
                if (window.parent) {
                  window.parent.postMessage({ type: 'livesite-widget-initialized', success: false, error: error.message }, '*');
                }
              }
            })();
          `;
          iframeDoc.body.appendChild(initScript);
          
          // Listen for initialization message from iframe
          const messageHandler = (event) => {
            if (event.data && event.data.type === 'livesite-widget-initialized') {
              window.removeEventListener('message', messageHandler);
              if (event.data.success) {
                widgetInitialized = true;
                updateStatus('Widget initialized successfully in iframe', 'success');
                addConsoleLog('Widget initialization confirmed', 'info');
              } else {
                updateStatus('Widget initialization failed: ' + (event.data.error || 'Unknown error'), 'error');
                addConsoleLog('Widget initialization error: ' + (event.data.error || 'Unknown'), 'error');
              }
            }
          };
          window.addEventListener('message', messageHandler);
          
          // Fallback verification after timeout
          setTimeout(() => {
            try {
              if (iframeWindow.LiveSite) {
                widgetInitialized = true;
                updateStatus('Widget appears to be initialized in iframe', 'success');
                addConsoleLog('Widget verified in iframe (fallback check)', 'info');
              }
            } catch (e) {
              addConsoleLog('Cannot verify widget initialization (CORS): ' + e.message, 'warn');
            }
          }, 2000);
        }, 500);
      };
      iframeDoc.head.appendChild(script);
    } catch (error) {
      // CORS restriction - cannot access iframe content
      // This should not happen with widget-container.html approach since it's same-origin
      updateStatus('CORS restriction: Cannot access iframe content. This should not happen with widget-container.html.', 'error');
      addConsoleLog('CORS error accessing iframe: ' + error.message, 'error');
      console.error('Widget container access error:', error);
    }
  }

  function initializeWidget() {
    // NOTE: This function is deprecated - widget should only initialize in widget-container.html iframe
    // This is kept for backwards compatibility but should not be called
    updateStatus('Widget should initialize in iframe, not on demo page', 'warning');
    addConsoleLog('initializeWidget() called - widget should only load in widget-container.html iframe', 'warn');
  }

  function toggleWidget() {
    // Try to toggle widget in iframe
    try {
      const iframeWindow = targetIframe.contentWindow;
      if (iframeWindow && iframeWindow.LiveSite && iframeWindow.LiveSite.ui && iframeWindow.LiveSite.ui.toggleActiveEngage) {
        iframeWindow.LiveSite.ui.toggleActiveEngage();
        updateStatus('Widget toggled in iframe', 'success');
        return;
      }
    } catch (e) {
      // CORS - can't access iframe
    }
    
    // Fallback to demo page widget
    if (!window.LiveSite || !widgetInitialized) {
      updateStatus('Widget not initialized', 'error');
      return;
    }

    try {
      if (window.LiveSite.ui && window.LiveSite.ui.toggleActiveEngage) {
        window.LiveSite.ui.toggleActiveEngage();
        updateStatus('Widget toggled', 'success');
      }
    } catch (error) {
      updateStatus('Error toggling widget: ' + error.message, 'error');
    }
  }

  function resetWidget() {
    // Reload the widget container iframe with current config (including updated version)
    if (targetIframe.src && targetIframe.src !== 'about:blank') {
      // Rebuild the URL with current config to ensure version parameter is updated
      const currentUrl = new URL(targetIframe.src);
      const websiteUrl = currentUrl.searchParams.get('url') || websiteUrlInput.value.trim();
      
      // Update the URL with current config
      const widgetContainerUrl = new URL('widget-container.html', window.location.href);
      widgetContainerUrl.searchParams.set('url', websiteUrl);
      
      // Pass business ID/UID if available
      if (currentConfig.uid) {
        widgetContainerUrl.searchParams.set('id', currentConfig.uid);
      } else if (currentConfig.id) {
        widgetContainerUrl.searchParams.set('id', currentConfig.id);
      } else {
        widgetContainerUrl.searchParams.set('config', encodeURIComponent(JSON.stringify(currentConfig)));
      }
      
      // Pass host configuration
      if (currentConfig.host) {
        widgetContainerUrl.searchParams.set('host', currentConfig.host);
      }
      if (currentConfig.portalHost) {
        widgetContainerUrl.searchParams.set('portalHost', currentConfig.portalHost);
      }
      
      // Enable logging if configured
      if (currentConfig.log) {
        widgetContainerUrl.searchParams.set('log', 'true');
      }
      
      // Pass widget version (classic or modern) - THIS IS THE KEY FIX
      if (currentConfig.version) {
        widgetContainerUrl.searchParams.set('version', currentConfig.version);
      }
      
      targetIframe.src = 'about:blank';
      setTimeout(() => {
        targetIframe.src = widgetContainerUrl.href;
        updateStatus('Widget container reloaded with current config', 'success');
      }, 100);
      return;
    }
    
    // Fallback to demo page widget
    if (!window.LiveSite) {
      updateStatus('Widget not loaded', 'error');
      return;
    }

    try {
      if (window.LiveSite.destroy) {
        window.LiveSite.destroy();
      }
      if (window.LiveSite.utils && window.LiveSite.utils.resetState) {
        window.LiveSite.utils.resetState();
      }
      widgetInitialized = false;
      updateStatus('Widget reset', 'success');
      setTimeout(initializeWidget, 500);
    } catch (error) {
      updateStatus('Error resetting widget: ' + error.message, 'error');
    }
  }

  function reloadWidget() {
    resetWidget();
  }

  function showConfigModal() {
    populateConfigForm();
    configModal.style.display = 'block';
  }

  function hideConfigModal() {
    configModal.style.display = 'none';
  }

  function populateConfigForm() {
    const form = document.getElementById('config-form');
    form.innerHTML = '';

    const configFields = [
      { key: 'uid', label: 'UID', type: 'text', placeholder: 'User ID' },
      { key: 'host', label: 'Host', type: 'text', placeholder: 'www.vcita.com' },
      { key: 'portalHost', label: 'Portal Host', type: 'text', placeholder: 'clients.vcita.com' },
      { key: 'widgetsCdnHost', label: 'Widgets CDN Host', type: 'text', placeholder: 'widgets.vcdnita.com' },
      { key: 'activeEngage', label: 'Active Engage', type: 'checkbox' },
      { key: 'engageButton', label: 'Engage Button', type: 'checkbox' },
      { key: 'desktopEnabled', label: 'Desktop Enabled', type: 'checkbox' },
      { key: 'mobileEnabled', label: 'Mobile Enabled', type: 'checkbox' },
      { key: 'desktopEngageAfter', label: 'Desktop Engage After (ms)', type: 'number' },
      { key: 'mobileEngageAfter', label: 'Mobile Engage After (ms)', type: 'number' },
      { key: 'lightbox', label: 'Lightbox', type: 'checkbox' },
      { key: 'log', label: 'Log', type: 'checkbox' },
      { key: 'track', label: 'Track', type: 'checkbox' },
      { key: 'identifyClient', label: 'Identify Client', type: 'checkbox' },
      { key: 'myAccountAction', label: 'My Account Action', type: 'checkbox' },
      { key: 'actionButtons', label: 'Action Buttons', type: 'checkbox' },
      { key: 'inlineActions', label: 'Inline Actions', type: 'checkbox' },
      { key: 'collapsedActions', label: 'Collapsed Actions', type: 'checkbox' },
    ];

    configFields.forEach(field => {
      const group = document.createElement('div');
      group.className = 'config-form-group';

      const label = document.createElement('label');
      label.textContent = field.label;
      label.setAttribute('for', field.key);
      group.appendChild(label);

      if (field.type === 'checkbox') {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = field.key;
        input.checked = currentConfig[field.key] || false;
        group.appendChild(input);
      } else if (field.type === 'select') {
        const select = document.createElement('select');
        select.id = field.key;
        field.options.forEach(option => {
          const optionEl = document.createElement('option');
          optionEl.value = option.value;
          optionEl.textContent = option.label;
          if (currentConfig[field.key] === option.value) {
            optionEl.selected = true;
          }
          select.appendChild(optionEl);
        });
        group.appendChild(select);
      } else {
        const input = document.createElement('input');
        input.type = field.type;
        input.id = field.key;
        input.value = currentConfig[field.key] || '';
        if (field.placeholder) input.placeholder = field.placeholder;
        group.appendChild(input);
      }

      form.appendChild(group);
    });
  }

  function saveConfig() {
    const form = document.getElementById('config-form');
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      const key = input.id;
      if (input.type === 'checkbox') {
        currentConfig[key] = input.checked;
      } else if (input.type === 'number') {
        currentConfig[key] = parseInt(input.value) || 0;
      } else if (input.tagName === 'SELECT') {
        currentConfig[key] = input.value;
      } else {
        currentConfig[key] = input.value;
      }
    });

    saveConfigToStorage();
    configPresetSelect.value = 'custom';
    hideConfigModal();
    updateStatus('Configuration saved', 'success');

    // Reload widget with new config
    if (widgetInitialized) {
      reloadWidget();
    }
  }

  function resetConfig() {
    currentConfig = getDefaultConfig();
    populateConfigForm();
    updateStatus('Configuration reset to defaults', 'success');
  }

  function updateStatus(message, type = 'success') {
    statusText.textContent = message;
    statusIndicator.className = 'status-indicator ' + type;
    addConsoleLog(message, type === 'error' ? 'error' : 'info');
  }

  function interceptConsole() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = function(...args) {
      originalLog.apply(console, args);
      addConsoleLog(args.join(' '), 'log');
    };

    console.error = function(...args) {
      originalError.apply(console, args);
      addConsoleLog(args.join(' '), 'error');
    };

    console.warn = function(...args) {
      originalWarn.apply(console, args);
      addConsoleLog(args.join(' '), 'warn');
    };
  }

  function addConsoleLog(message, type = 'log') {
    const timestamp = new Date().toLocaleTimeString();
    consoleLogs.push({ timestamp, message, type });
    if (consoleLogs.length > 100) {
      consoleLogs.shift();
    }
    updateConsoleOutput();
  }

  function updateConsoleOutput() {
    const output = document.getElementById('console-output');
    if (output) {
      output.innerHTML = consoleLogs.map(log => {
        return `<span class="${log.type}">[${log.timestamp}] ${escapeHtml(log.message)}</span>`;
      }).join('\n');
      output.scrollTop = output.scrollHeight;
    }
  }

  function showConsole() {
    updateConsoleOutput();
    consoleModal.style.display = 'block';
  }

  function hideConsole() {
    consoleModal.style.display = 'none';
  }

  function clearConsole() {
    consoleLogs = [];
    updateConsoleOutput();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function saveConfigToStorage() {
    try {
      localStorage.setItem('livesite-demo-config', JSON.stringify(currentConfig));
    } catch (e) {
      console.warn('Could not save config to localStorage:', e);
    }
  }

  function loadConfigFromStorage() {
    try {
      const saved = localStorage.getItem('livesite-demo-config');
      if (saved) {
        currentConfig = { ...getDefaultConfig(), ...JSON.parse(saved) };
      }
      
      // Set version radio buttons based on config
      const version = currentConfig.version || 'classic';
      if (versionClassicRadio) {
        versionClassicRadio.checked = (version === 'classic');
      }
      if (versionModernRadio) {
        versionModernRadio.checked = (version === 'modern');
      }
      
      // Update CSS URLs based on version
      updateCssUrlsForVersion(version);
    } catch (e) {
      console.warn('Could not load config from localStorage:', e);
    }
  }

  function updateCssUrlsForVersion(version) {
    if (version === 'modern') {
      currentConfig.desktopCss = '../dist-modern/livesite.modern.min.css';
      currentConfig.mobileCss = '../dist-modern/livesite.modern.mobile.min.css';
    } else {
      currentConfig.desktopCss = '../dist-classic/livesite.min.css';
      currentConfig.mobileCss = '../dist-classic/livesite.mobile.min.css';
    }
  }
})();
