// Dependencies: core

(function (liveSite) {
  var _   = liveSite.lodash,
      fn  = liveSite.fn;

  liveSite.fn = liveSite.fn || {};

  liveSite.extend(liveSite.fn, {

    getQueryParams: function(qs) {
      var params = {}, tokens,
          re = /[?&]?([^=]+)=([^&]*)/g;

      qs = qs.split('+').join(' ');

      while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      }

      return params;
    },

    addParamString: function(url, paramWithValue) {
      if (_.isEmpty(paramWithValue)) {
        return url;
      } else if (url.indexOf('?') === -1) {
        return url + '?' + paramWithValue;
      } else {
        return url + '&' + paramWithValue;
      }
    },

    addParam: function(url, param, value) {
      if (!_.isEmpty(value) || _.isNumber(value)) {
        return fn.addParamString(url, param + '=' + encodeURIComponent(value));
      } else {
        return url;
      }
    },

    addParams: function(url, params) {
      for (var i=0;i<params.length;i+=1) {
        if (!_.isUndefined(params[i][1]) && !_.isNull(params[i][1])) {
          url = fn.addParam(url, params[i][0], params[i][1]);
        }
      }

      return url;
    }
  });

}(window.LiveSite = window.LiveSite || {}));