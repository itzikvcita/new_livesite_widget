/* This file runs after jQuery is loaded */
/* When webpack processes jQuery as CommonJS, it doesn't attach to window.LiveSite.jQuery */
/* So we need to get it from the module and expose it properly */

/* Get jQuery from the module that was already loaded */
/* Since webpack bundles everything, we can require it here and it will get the same instance */
var jQueryModule = require('./jquery-1.11.1.js');

/* Ensure window.LiveSite exists */
if (typeof window !== 'undefined') {
  window.LiveSite = window.LiveSite || {};
  
  /* jQuery should be the actual jQuery object when webpack processes it */
  /* (since global.document exists, it calls factory() and returns jQuery, not the factory function) */
  var jQuery = jQueryModule;
  
  /* Attach jQuery to LiveSite (required for widget code) */
  window.LiveSite.jQuery = jQuery;
  
  /* Expose jQuery globally for plugins that expect window.$ or window.jQuery */
  /* This must happen BEFORE colorbox loads */
  window.jQuery = jQuery;
  window.$ = jQuery;
}
