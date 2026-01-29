// Modern quick reply chips component
// Renders quick action buttons as modern chip-style buttons

(function (liveSite, window) {
  'use strict';

  var $ = liveSite.jQuery,
      _ = liveSite.lodash,
      config = liveSite.config;

  liveSite.ui = liveSite.ui || {};

  liveSite.extend(liveSite.ui, {

    /**
     * Render quick reply chips from actions
     * @param {Array} actions - Array of action objects (optional, defaults to config.actions)
     * @param {number} maxChips - Maximum number of chips to show (default: 4)
     * @returns {Array} Array of chip objects
     */
    createQuickReplyChips: function(actions, maxChips) {
      actions = actions || config.actions || [];
      maxChips = maxChips || 4;

      // Convert actions to chip format
      var chips = [];
      
      _.forEach(actions.slice(0, maxChips), function(action) {
        chips.push({
          text: action.text || '',
          action: action.action || '',
          url: action.url || '#',
          options: action.options || '',
          icon: action.icon || ''
        });
      });

      return chips;
    },

    /**
     * Render and append quick reply chips to a container
     * @param {string} containerSelector - Selector for the container
     * @param {Array} chips - Array of chip objects (optional)
     * @param {Function} onClickCallback - Callback function when a chip is clicked
     */
    renderQuickReplyChips: function(containerSelector, chips, onClickCallback) {
      var container = $(containerSelector);
      
      if (container.length === 0) {
        liveSite.log('[QuickReplies] Container not found: ' + containerSelector);
        return;
      }

      // Remove existing chips
      container.find('.ls-quick-replies').remove();

      // Create chips if not provided
      if (!chips) {
        chips = this.createQuickReplyChips();
      }

      if (chips.length === 0) {
        return;
      }

      // Render chips HTML
      var chipsHtml = liveSite.ui.renderQuickReplyChips(chips);
      var $chipsContainer = $(chipsHtml);
      
      container.append($chipsContainer);

      // Attach click handlers
      var self = this;
      $chipsContainer.find('.ls-quick-reply-chip').on('click', function(e) {
        e.preventDefault();
        
        var $chip = $(this);
        var action = $chip.data('action');
        var url = $chip.data('url');
        var options = $chip.data('options');

        liveSite.log('[QuickReplies] Chip clicked: ' + action);

        // Call callback if provided
        if (onClickCallback && typeof onClickCallback === 'function') {
          onClickCallback(action, url, options, $chip);
        } else {
          // Default behavior: trigger action
          self.handleQuickReplyClick(action, url, options);
        }

        // Remove chips after selection (optional)
        $chipsContainer.fadeOut(200, function() {
          $(this).remove();
        });
      });

      liveSite.log('[QuickReplies] Rendered ' + chips.length + ' quick reply chips');
      
      return $chipsContainer;
    },

    /**
     * Parse options string (same format as bindings.js)
     * @param {string} optionsString - Options string in format "key1:value1;key2:value2"
     * @returns {Object} Parsed options object
     */
    parseOptions: function(optionsString) {
      var options = {},
          key_value;

      if (!optionsString || typeof optionsString !== 'string') {
        return options;
      }

      optionsString.split(';').forEach(function(option) {
        key_value = option.split(':');
        if (key_value.length === 2) {
          options[key_value[0].trim()] = key_value[1].trim();
        }
      });

      return options;
    },

    /**
     * Handle quick reply chip click
     * @param {string} action - Action type (e.g., 'schedule', 'contact', 'call')
     * @param {string} url - Action URL (optional)
     * @param {string} optionsString - Action options string (optional, format: "key1:value1;key2:value2")
     */
    handleQuickReplyClick: function(action, url, optionsString) {
      // Parse options string if provided
      var options = this.parseOptions(optionsString || '');
      
      // If URL is provided and it's a valid embed URL with mode=embed, use it directly
      if (url && url !== '#' && url.indexOf('http') === 0 && url.indexOf('mode=embed') !== -1) {
        liveSite.opener(url);
        return;
      }
      
      // Otherwise, trigger the action using liveSite.action() or liveSite[action]()
      if (action && liveSite.action) {
        liveSite.action(action, options);
      } else if (action && liveSite[action] && typeof liveSite[action] === 'function') {
        liveSite[action](options);
      } else {
        liveSite.log('[QuickReplies] Unknown action: ' + action);
        // Fallback: navigate to URL if available
        if (url && url !== '#') {
          window.open(url, '_blank');
        }
      }
    },

    /**
     * Remove quick reply chips from container
     * @param {string} containerSelector - Selector for the container
     */
    removeQuickReplyChips: function(containerSelector) {
      var container = $(containerSelector);
      container.find('.ls-quick-replies').fadeOut(200, function() {
        $(this).remove();
      });
    }
  });

})(window.LiveSite || {}, window);
