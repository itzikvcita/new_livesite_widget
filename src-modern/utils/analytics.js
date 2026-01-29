/*jslint regexp: false */

// Dependencies: core, options, config, fn/base64

(function (liveSite, window) {

  var $               = liveSite.jQuery,
      _               = liveSite.lodash,
      fn              = liveSite.fn,
      tracked_events  = [];

  liveSite.extend(liveSite.fn, {

    trackOnce: function(event) {
      if (liveSite.config.track && tracked_events.indexOf(event) === -1) {
        liveSite.fn.track(event);
      }
    },

    track: function(event) {
      var sendTrPic = false
      var trPicExpiry = window.localStorage.getItem('sentTrPicV');
      if (!trPicExpiry || trPicExpiry && new Date().getTime() > trPicExpiry) {
        sendTrPic = true;
      }

      if (liveSite.config.track && !_.isEmpty(liveSite.config.trackUrl) && sendTrPic ) {
        var newTrPicExpiry = new Date().getTime() + 86400000 //24H in ms
        window.localStorage.setItem('sentTrPicV', newTrPicExpiry.toString());
        liveSite.log('Track event: ' + event);
        big_data_event = liveSite.fn.getBigDataEventName(event);

        try {
          var ref = liveSite.fn.getRequestUrl();
          $('body').append("<img src='" + liveSite.config.trackUrl + '&o=' + liveSite.fn.encodeBase64(event) + "' style='width:1px;height:1px;position:fixed;bottom:0px;left:0px;'></img>");
          tracked_events.push(event);
        } catch (e) {}

      }
    },

    getRequestUrl: function() {
      if (!_.isEmpty(liveSite.config.requestUrl)) {
        return liveSite.config.requestUrl
      }  else {
        return document.referrer.substring(0, 256);
      }
    },

    getBigDataEventName: function(event_name) {
      switch (event_name) {
        case 'loader':
          return 'SDK';
        case 'active_engage':
          return "Active Engage";
        case 'active_engage_button_click':
          return "Label Click";
        default:
          return event_name;
      }
    },

    gaParams: function() {
      var i,
          ga_query  = '',
          params    = fn.getQueryParams(window.location.search.substring(1)),
          ga = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'];

      for (i=0; i < ga.length; i++) {
        if (_.isString(params[ga[i]])) {
          if (ga_query !== '') {
            ga_query += '&';
          }

          ga_query += ga[i] + '=' + params[ga[i]];
        }
      }

      return ga_query;
    }
  });

}(window.LiveSite = window.LiveSite || {}, window));