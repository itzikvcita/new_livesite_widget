// Dependencies: bindings

(function (liveSite, window) {
  var $             = liveSite.jQuery,
      _             = liveSite.lodash,
      fn            = liveSite.fn,
      css_wait      = {},
      max_wait      = 6 * 1000,  // approx 6 sec
      interval      = 50,        // every 50 milli      
      loaded_assets = {},
      loaded_config = null;      

  function initInternal() {
    if (liveSite.config.failed) {
      return;
    }

    liveSite.config.adjustHttps();
    liveSite.configBackwardCompatibility();

    liveSite.trigger('beforeRender');

    if (liveSite.config.ui && liveSite.config.deviceEnabled()) {
      liveSite.ui.render();
      liveSite.ui.init();
    }

    liveSite.initClient();
    liveSite.bindActions();
    fn.track('loader');

    liveSite.trigger('ready');

    liveSite.doActionsOnLoad();
  }

  function assetLoaded(type) {
    loaded_assets[type] = true;
    if (loaded_assets.css && loaded_assets.font && loaded_assets.config) {
      liveSite.log('assets - all Assets Loaded');
      $(initInternal); // Even if config is done before DOM is ready, the actual rendering must happen after DOM ready
    }
  }

  function checkCssAssetLoaded(type, div) {
    if (_.isUndefined(div)) {
      assetLoaded(type);
    } else {

      if (_.isUndefined(css_wait[type])) {
        css_wait[type] = 0;
      }

      if ($('.' + div).length == 0) {
        $('body').append('<div class="'+ div + '" style="width:0px;height:0px;display:none;"></div>');
      }

      if (($('.' + div).css('position') === 'fixed') || (css_wait[type] >= max_wait)) {
        assetLoaded(type);
      } else {

        css_wait[type] += interval;

        setTimeout(function() {
          checkCssAssetLoaded(type, div)
        }, interval);
      }
    }
  }

  function loadCssFile(url, type, div) {
    if (_.isEmpty(url)) {
      liveSite.log('no ' + type + ' file, skip loading');

      assetLoaded(type);

    } else {
      liveSite.log('load ' + type + ' - ' + url);

      $('head').append('<link href="' + url + '" media="screen" rel="stylesheet" type="text/css">');
      checkCssAssetLoaded(type, div);
    }
  }

  function loadCss() {
    var url = fn.isMobile() ? liveSite.config.mobileCss : liveSite.config.desktopCss;
    loadCssFile(url, 'css', 'ls-ensure-loaded');
  }

  function loadFont() {
    loadCssFile(liveSite.config.fontUrl, 'font');
  }

  function loadConfig() {
    var id = liveSite.config.id,
        configUrl;

    if (_.isEmpty(id)) {
      liveSite.log('no config, skip loading');

      assetLoaded('config');
    } else {      
      loaded_config = id;
      
      liveSite.log('load config ' + loaded_config);

      configUrl = liveSite.config.hostWithProtocol() + '/widgets/active_engage/configuration?id=' + id;
      if (liveSite.config.overrideTheme != null) {
        configUrl += '&theme_id=' + liveSite.config.overrideTheme;
      }
      configUrl += '&callback=?'; // Add callback for using jsonp to allow CORS

      $.getJSON(configUrl, {}, function(serverConfig) {
        $.extend(liveSite.config, serverConfig);
        $.extend(liveSite.config, liveSite.options);
        console.log('liveSite.config.uid', liveSite.config.uid)

        assetLoaded('config');
      });
    }
  }

  function loadAssetsAndInit() {
    if (loaded_assets.config && loaded_config != null && loaded_config != liveSite.config.id) {
      loaded_assets.config = false;
    }

    // All assets loaded already - for destroy flow
    if (loaded_assets.css && loaded_assets.font && loaded_assets.config) {
      liveSite.log('assets - all Assets Loaded');
      $(initInternal); // Even if config is done before DOM is ready, the actual rendering must happen after DOM ready    
    } else { // Need to load assets

      if (!loaded_assets.css) {
        loadCss();  
      }
      
      if (!loaded_assets.font) {
        loadFont();  
      }
      if (!loaded_assets.config) {
        loadConfig();  
      }    
    }
  }

  liveSite.extend({

    // options can have an id=WI code, nickname, UID or directly the options object
    init : function (options) {

      if (/msie\s6/i.test(navigator.userAgent) || /msie\s7/i.test(navigator.userAgent) ) {
        liveSite.log('Internet Explorer versions lower than 8 are not supported');
      } else {

        if (!_.isObject(options)) {
          liveSite.log('init failed - invalid options');
          return;
        }

        if (_.isObject(options)) {
          $.extend(liveSite.options, options);
          $.extend(liveSite.config, liveSite.options);
        }


        if (liveSite.config.waitForDomReady) {
          liveSite.log('rendering - waiting for DOM ready');
          $(loadAssetsAndInit);
        } else {
          loadAssetsAndInit();
        }
      }
    },

    destroy : function() {
      if (liveSite.config.ui && liveSite.config.deviceEnabled()) {
        liveSite.ui.destroy();
      }

      liveSite.unbindActions();

      liveSite.trigger('destroy');
    }
  });

  // liveSiteAsyncInit is the newer embed code and has higher priority than the liveSiteLegacyInit which is used
  // only in the old loader.js.erb code
  if (window.liveSiteAsyncInit && !window.liveSiteAsyncInit.hasRun) {
    window.liveSiteAsyncInit.hasRun = true;
    window.liveSiteAsyncInit(liveSite);
  } else if (window.liveSiteLegacyInit && !window.liveSiteLegacyInit.hasRun) {
    window.liveSiteLegacyInit.hasRun = true;
    window.liveSiteLegacyInit(liveSite);
  }

} (window.LiveSite, window));