// Dependencies: actions, fn/object, core, options

(function (liveSite, window) {
  var $  = liveSite.jQuery,
      _  = liveSite.lodash,
      fn = liveSite.fn;

  function parseOptions(optionsString) {
    var options = {},
        key_value;

    optionsString.split(';').forEach(function(option) {
      key_value = option.split(':');
      if (key_value.length === 2) {
        options[key_value[0].trim()] = key_value[1].trim();
      }
    });

    return options
  }

  function dataToOptions(data) {
    var options = {};

    if (_.isObject(data)) {
      options = $.extend({}, data);
      if (!_.isEmpty(options.options)) {
        $.extend(options, parseOptions(options.options));

        delete options.options;
      }
    }

    return options;
  }

  function _isB64Encoded(str) {
    try {
      _b64DecodeUnicode(str)
    } catch (e) {
      return false
    }
    return _b64EncodeUnicode(_b64DecodeUnicode(str)) === str
  }
    function _b64EncodeUnicode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }

    function _b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

  function bindAction(bindingsContainer, action) {
    bindingsContainer.on('click.livesite', '.livesite-' + action, function (e) {
      var options = dataToOptions($(this).data());
      // Production uses e.originalEvent.srcElement.href
      // Chrome supports srcElement as alias for target, but when clicking on child text,
      // srcElement might be text node (no .href). Traverse up to find anchor.
      var el = e.originalEvent && e.originalEvent.srcElement;
      // If srcElement is not the anchor (e.g. text node or child element), traverse up
      while (el && el.nodeName !== 'A' && el.parentNode) {
        el = el.parentNode;
      }
      // Fallback to target if srcElement not available, then to the matched element (this)
      if (!el || !el.href) {
        el = (e.originalEvent && e.originalEvent.target) || this;
        while (el && el.nodeName !== 'A' && el.parentNode) {
          el = el.parentNode;
        }
      }
      var href = (el && el.href !== undefined) ? el.href : (this.href !== undefined ? this.href : ($(this).attr('href') || ''));
      var params = href && href.split('?')[1]
      if(params) {
          params = params.split('&').map(function(param){return param.split('=')})
          params.forEach(function(param) {
              options[param[0]] = param[1]
              if(param[0] === 'o') {
                  if(_isB64Encoded(param[1])) {
                      options.origin = _b64DecodeUnicode(param[1]).trim()
                      options[param[0]] = options.origin
                  } else {
                      options.origin = param[1]
                  }

              }
              if(param[0] === 's'){
                  options.source = param[1]
              }
          })
      }
      liveSite[action](options);
      e.preventDefault();
    });
  }

  liveSite.extend({

    bindActions: function (bindingsSelector) {
      // We must wait for the body element
      $(function() {
        if (_.isUndefined(bindingsSelector)) {
          bindingsSelector = 'body';
        }

        var bindingsContainer = $(bindingsSelector);

        bindingsContainer.off('.livesite'); // handle duplicate binding

        bindingsContainer.on('click.livesite', '.livesite-action', function (e) {
          var options = dataToOptions($(this).data()),
              action = options.action;
          delete options.action;

          liveSite.action(action, options);

          e.preventDefault();
        });

        bindAction(bindingsContainer, 'schedule');
        bindAction(bindingsContainer, 'contact');
        bindAction(bindingsContainer, 'pay');
        bindAction(bindingsContainer, 'document');
        bindAction(bindingsContainer, 'call');
        bindAction(bindingsContainer, 'main');
        bindAction(bindingsContainer, 'login');

        bindingsContainer.on('click.livesite', '.livesite-lightbox', function (e) {
          var href = $(this).data('href') || $(this).attr('href');

          if (!_.isEmpty(href)) {
            liveSite.opener(href);
          }

          e.preventDefault();
        });

        liveSite.log('Bindings added');
      });
    },

    unbindActions: function (bindingsSelector) {
      // We must wait for the body element
      $(function() {
        if (_.isUndefined(bindingsSelector)) {
          bindingsSelector = 'body';
        }

        var bindingsContainer = $(bindingsSelector);

        bindingsContainer.off('.livesite');
        liveSite.log('Bindings removed');
      });
    },

    doActionsOnLoad: function() {
      var options,
          params = fn.getQueryParams(window.location.search.substring(1));

      lsParam = params['livesite'];
      if (_.isString(lsParam)) {
        if (lsParam.indexOf('http://') === 0 || lsParam.indexOf('https://') === 0) {
          liveSite.opener(lsParam);
        } else {
          options = parseOptions(lsParam);

          liveSite.action(options.action, options);
        }
      }
    }
  });
} (window.LiveSite, window));