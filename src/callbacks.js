// Dependencies: core

(function (liveSite) {

  var $       = liveSite.jQuery,
      config  = liveSite.config,
      streams = {},
      EVENTS  = ['beforeRender', 'ready', 'resize', 'client', 'destroy'];

  function stream(id) {
    var callbacks,
        callback = id && streams[id];

    if (!callback) {
      callbacks = $.Callbacks();
      callback = {
        publish: callbacks.fire,
        subscribe: callbacks.add,
        unsubscribe: callbacks.remove
      };
      if(id) {
        streams[id] = callback;
      }
    }
    return callback;
  }

  liveSite.extend({

    on: function(event, func) {
      if (EVENTS.indexOf(event) === -1) {
        liveSite.log('Cannot bind event ' + event);
      }

      stream(event).subscribe(func);
    },

    trigger: function(event, data) {
      if (EVENTS.indexOf(event) === -1) {
        liveSite.log('Cannot trigger event: ' + event);
      } else {
        liveSite.log('Trigger event: ' + event);
      }

      stream(event).publish(data);
    }
  });

}(window.LiveSite = window.LiveSite || {}));