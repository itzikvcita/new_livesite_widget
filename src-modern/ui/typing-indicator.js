// Modern typing indicator component
// Shows animated dots to indicate the bot is "typing"

(function (liveSite, window) {
  'use strict';

  var $ = liveSite.jQuery,
      _ = liveSite.lodash;

  liveSite.ui = liveSite.ui || {};

  liveSite.extend(liveSite.ui, {

    /**
     * Show typing indicator in the chat
     * @param {string} containerSelector - Selector for the chat container (e.g., '#livesite_chat_messages')
     * @param {string} avatarUrl - Optional avatar URL for the bot
     */
    showTypingIndicator: function(containerSelector, avatarUrl) {
      var container = $(containerSelector || '#livesite_chat_messages');
      
      if (container.length === 0) {
        liveSite.log('[TypingIndicator] Container not found: ' + containerSelector);
        return;
      }

      // Remove any existing typing indicator
      this.hideTypingIndicator(containerSelector);

      // Render and append typing indicator
      var typingHtml = liveSite.ui.renderTypingIndicator(avatarUrl);
      var $typingIndicator = $(typingHtml);
      
      container.append($typingIndicator);
      
      liveSite.log('[TypingIndicator] Showing typing indicator');
      
      return $typingIndicator;
    },

    /**
     * Hide typing indicator
     * @param {string} containerSelector - Selector for the chat container
     */
    hideTypingIndicator: function(containerSelector) {
      var container = $(containerSelector || '#livesite_chat_messages');
      container.find('.ls-typing-indicator').remove();
    },

    /**
     * Show typing indicator for a specified duration, then hide it
     * @param {string} containerSelector - Selector for the chat container
     * @param {number} duration - Duration in milliseconds (default: 1500ms)
     * @param {string} avatarUrl - Optional avatar URL
     */
    showTypingIndicatorForDuration: function(containerSelector, duration, avatarUrl) {
      duration = duration || 1500; // Default 1.5 seconds
      
      this.showTypingIndicator(containerSelector, avatarUrl);
      
      var self = this;
      setTimeout(function() {
        self.hideTypingIndicator(containerSelector);
      }, duration);
    }
  });

})(window.LiveSite || {}, window);
