// Handling cookie states

(function (liveSite, window) {

  var document     = window.document,
      fn           = liveSite.fn,
      cookiePrefix = 'livesite_';


  function cookieName() {
    return cookiePrefix + liveSite.config.uid;
  }

  liveSite.extend(liveSite.fn, {

    setState: function(scope, value) {
      var cookieString, date, expires;

      if (!liveSite.config.cookie) {
        return;
      }

      date = new Date();
      date.setTime(date.getTime()+liveSite.config.cookieLifetime);
      expires = '; expires='+date.toGMTString();
      cookieString = cookieName()+'_'+scope+'='+value+expires+'; path=/';
      document.cookie = cookieString;
    },

    getState: function(scope) {
      if (!liveSite.config.cookie) {
        return '';
      }

      var i, c,
          nameEQ = cookieName()+'_'+scope+'=',
          ca     = document.cookie.split(';');

      for(i=0;i < ca.length;i+=1) {
        c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
      }
      return '';
    },

    resetState: function() {
      fn.setState('engage', '');
      fn.setState('notification', '');
    }
  });

}(window.LiveSite = window.LiveSite || {}, window));