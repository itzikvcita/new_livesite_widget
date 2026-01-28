// Dependencies: core, options

(function (liveSite, window) {

  var fn     = liveSite.fn,
      config = liveSite.config;

  liveSite.extend(liveSite.fn, {

    overrideUserAgent : null,

    isMobile: function() {
      if (config.mode === 'mobile' || config.mode === 'mobile-portrait' || config.mode === 'mobile-landscape') {
        return true;
      } else if (config.mode === 'desktop') {
        return false;
      } else {
        var useragent = fn.overrideUserAgent || window.navigator.userAgent;

        return (/Mobile|webOS|BlackBerry|SymbianOS/i).test(useragent) && !(/iPad/i).test(useragent);
      }
    }
  });

}(window.LiveSite = window.LiveSite || {}, window));