// Dependencies: core, options, fn/platform, fn/add-param

(function (liveSite, window) {

  var _      = liveSite.lodash,
      $      = liveSite.jQuery,
      config = liveSite.config,
      fn     = liveSite.fn,
      bound  = false;

  window.addEventListener('message', function(event) {
    if (event.data && event.data.source === 'client-portal' && event.data.action === 'upload_documents_close') {
      $('#ls_cboxClose').click();
      return;
    }

    var data;

    try {
      data = JSON.parse(event.data);
    } catch (e) {
      data = event.data;
    }

    if (data.data === 'portal_opened') {
      config.new_client_portal_window = true;
      $(window).trigger('resize');
    }
  });

  liveSite.extend({

    lightboxHeight: function() {
      var height = window.innerHeight;
      if(height >= 700) {
        height = 700
      } else if (height >= 654 + 100) {
        height -= 100;
      } else {
        height -= 40;
      }      

      return height;
    },

    portalboxHeight: function() {
      return 700;
    },

    opener: function(url) {

      url = liveSite.fn.addParamString(url, fn.gaParams());

      if (_.isFunction(config.openerFunc)) {

        config.openerFunc(url);

      } else if (liveSite.fn.isMobile()) {

        // if no explicit redirect, add redirect close
        if (!url.match(/(\?|&)redirect=/)) {
          url = liveSite.fn.addParam(url, 'redirect', 'close');
        }
        window.open(url);

      } else if (!config.lightbox) {

        window.open(url, 'livesite_popup', 'width=1024,height=700');

      } else {

        url = fn.addParam(url, 'prevent_redirect', 'true');
        var sourceDefined = url.split('?').pop().split('&').some(function(param){
          var parts = param.split('=')
          return parts[0] === 's'
        })
        if(!sourceDefined){
            url = fn.addParam(url, 's', window.location.href);
        }

        if (!bound) {
          bound = true;
          $(window).resize(function() {
            height = config.new_client_portal_window ? liveSite.portalboxHeight() : liveSite.lightboxHeight()
            $.ls_colorbox.resize({height: height + 'px'});
          });
        }
        $.ls_colorbox({
          href: url,
          opacity: 0.7,
          fixed: true,
          iframe: true,
          scrolling: !config.new_client_portal_window,
          fastIframe: true,
          trapFocus: false,
          overlayClose: false,
          height: liveSite.lightboxHeight() + 'px',
          width: "1024px",
          maxHeight: config.new_client_portal_window ? liveSite.portalboxHeight()+"px" : "",
          initialHeight: "200px",
          initialWidth: "250px",
          className: config.rtl ? 'i18n-rtl': '',
          onOpen: function() {
            liveSite.ui.hideActiveEngage(false);
          },
          onClosed: function() {
            liveSite.initClient();
          }
        });
      }
    }
  });

} (window.LiveSite, window));