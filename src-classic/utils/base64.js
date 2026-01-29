/*jslint plusplus: false, bitwise: false */

// Dependencies: core

(function (liveSite) {

  var _      = liveSite.lodash,
      KEYSTR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';


  liveSite.extend(liveSite.fn, {

    encodeBase64: function (input) {
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4,
          i = 0,
          output = '';

      if (!_.isString(input)) {
        input = '';
      }

      while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
            KEYSTR.charAt(enc1) + KEYSTR.charAt(enc2) +
            KEYSTR.charAt(enc3) + KEYSTR.charAt(enc4);
      }

      return output;
    }
  });

}(window.LiveSite = window.LiveSite || {}));