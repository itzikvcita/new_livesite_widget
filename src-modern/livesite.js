//
//= require lib/index.of.ie8.shim
//= require lib/lodash
//= require lib/jquery-1.11.1.js
//= require lib/jquery-expose
//= require lib/jquery.colorbox

//= require core
//= require config.js.erb

//= require utils/core
//= require utils/url-builder
//= require utils/analytics
//= require utils/platform
//= require utils/state
//= require utils/base64

//= require opener
//= require actions
//= require bindings
//= require callbacks
//= require identify-client
//= require backward_compatibility.js

//= require ui/renderer
//= require ui/behaviour
//= require ui/typing-indicator
//= require ui/quick-replies
//= require ui/chat

//= require loader

// Ensure window.LiveSite is available after all modules have loaded
// All the requires above have already attached their functionality to window.LiveSite
// No need to export - the code modifies window.LiveSite directly
