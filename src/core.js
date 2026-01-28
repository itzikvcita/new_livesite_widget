(function (liveSite, window) {
  var $        = liveSite.jQuery,
      _        = liveSite.lodash,
      fn       = liveSite.fn,
      forcelog = window.location.search.substring(1).indexOf('livesite_debug') != -1,
      console  = window.console || { msgs: [], 
                                     log: function (msg) { console.msgs.push(msg); }, 
                                     warn: function (msg) { console.msgs.push(msg); } };

  // function for extending objects
  liveSite.extend = function(target, opts) {
    var next;

    if (_.isUndefined(opts)) {
      opts = target;
      target = liveSite;
    }

    for (next in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, next)) {
        target[next] = opts[next];
      }
    }
    return target;
  };

  liveSite.extend({

    log: function(msg, force) {

      if (liveSite.config.log || forcelog || force === true) {
        console.log("[LiveSite] " + msg);
      }
    },

    warn: function(msg) {
      console.warn("[LiveSite] " + msg);
    }
  });

} (window.LiveSite = window.LiveSite || {}, window));



