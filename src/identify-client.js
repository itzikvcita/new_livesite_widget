// Dependencies:

(function (liveSite, window) {

  var $             = liveSite.jQuery,
      _             = liveSite.lodash,
      config        = liveSite.config,
      MESSAGE_TYPES = {
        CLIENT_INFO : 'clientInfo',
        NO_CLIENT   : 'noClient'
      };

  function addNativeListener(event, callback) {
    return window.addEventListener ? window.addEventListener(event, callback, false) : window.attachEvent('on' + event, callback);
  }

  function handleMessage(evt) {
    // Allow messages from both the main host and portal host (protocol-agnostic)
    var expectedHost = config.hostWithProtocol();
    var portalHost = config.portalWithProtocol();
    var originHost = evt.origin.replace(/^https?:\/\//, '').replace(/^https?:\/\//, '');
    var expectedHostOnly = expectedHost.replace(/^https?:\/\//, '');
    var portalHostOnly = portalHost.replace(/^https?:\/\//, '');
    
    if (originHost !== expectedHostOnly && originHost !== portalHostOnly) {
      liveSite.log("Identify client event bad host " + evt.origin + " != " + expectedHost + " or " + portalHost);
    } else {
      var msg = $.parseJSON(evt.data);

      if ((msg.type === MESSAGE_TYPES.CLIENT_INFO) && msg.data) {
        liveSite.trigger('client', {
          name         : msg.data.name,
          email        : msg.data.email,
          unread       : msg.data.unread,
          jwt          : msg.data.access_jwt
        });
      } else if (msg.type === MESSAGE_TYPES.NO_CLIENT) {
        liveSite.trigger('client');
      }
    }
  }

  liveSite.extend({

    initClient: function() {
      if (!config.identifyClient || _.isEmpty(config.identifyClientUrl)) {
        return;
      }

      if ($('#livesite_identify_client').length === 0) {
        addNativeListener('message', handleMessage);

        $('body').append("<IFRAME id='livesite_identify_client' src='" + config.identifyClientUrl + "' width='1' height='1' scrolling='no' frameborder='0' style='position:absolute;left:0;bottom:0'/>");
      } else {
        $('#livesite_identify_client').attr('src', $('#livesite_identify_client').attr('src'));
      }
    }
  });

} (window.LiveSite, window));