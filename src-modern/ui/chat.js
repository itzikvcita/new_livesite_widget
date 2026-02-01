// Modern chat conversation logic
// Manages chat messages, conversation flow, and chat interface

(function (liveSite, window) {
  'use strict';

  var $ = liveSite.jQuery,
      _ = liveSite.lodash,
      config = liveSite.config;

  liveSite.ui = liveSite.ui || {};
  liveSite.chat = liveSite.chat || {};

  // Chat state
  var chatState = {
    messages: [],
    isTyping: false,
    containerSelector: '#livesite_chat_messages'
  };

  liveSite.extend(liveSite.chat, {

    /**
     * Initialize chat interface
     * @param {string} containerSelector - Selector for chat messages container
     */
    init: function(containerSelector) {
      chatState.containerSelector = containerSelector || '#livesite_chat_messages';
      
      // Create chat container if it doesn't exist
      var container = $(chatState.containerSelector);
      if (container.length === 0) {
        // Try to find or create in active engage
        var activeEngage = $('#livesite_active_engage .ls-content');
        if (activeEngage.length > 0) {
          activeEngage.append('<div id="livesite_chat_messages" class="ls-chat-messages"></div>');
          chatState.containerSelector = '#livesite_chat_messages';
        }
      }

      // Initialize chat input handlers
      this.initInputHandlers();

      liveSite.log('[Chat] Initialized chat interface');
    },

    /**
     * Initialize chat input field handlers
     */
    initInputHandlers: function() {
      var self = this;
      var $input = $('#livesite_chat_input');
      var $sendButton = $('#livesite_chat_send');

      if ($input.length === 0 || $sendButton.length === 0) {
        return;
      }

      // Send button click
      $sendButton.on('click', function(e) {
        e.preventDefault();
        self.sendUserMessage();
      });

      // Enter key to send
      $input.on('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          self.sendUserMessage();
        }
      });

      // Focus input when chat opens
      $input.on('focus', function() {
        $(this).closest('.ls-chat-input-wrapper').addClass('ls-focused');
      });

      $input.on('blur', function() {
        $(this).closest('.ls-chat-input-wrapper').removeClass('ls-focused');
      });
    },

    /**
     * Send user message from input field
     */
    sendUserMessage: function() {
      var $input = $('#livesite_chat_input');
      var message = $input.val().trim();

      if (!message) {
        return;
      }

      // Add user message to chat
      this.addUserMessage(message);

      // Clear input
      $input.val('');

      // For now, just acknowledge the message (no real AI yet)
      var self = this;
      setTimeout(function() {
        var responses = [
          'Thanks for your message! I can help you with scheduling, payments, or any questions you have.',
          'Got it! Let me know how I can assist you today.',
          'I understand. What would you like to do next?',
          'Thanks! I\'m here to help with any of your needs.'
        ];
        var randomResponse = responses[Math.floor(Math.random() * responses.length)];
        self.addBotMessage(randomResponse, config.imageUrl, true);
      }, 800);
    },

    /**
     * Add a bot message to the chat
     * @param {string} message - Message text
     * @param {string} avatarUrl - Optional avatar URL
     * @param {boolean} showTyping - Show typing indicator before message (default: true)
     */
    addBotMessage: function(message, avatarUrl, showTyping) {
      showTyping = showTyping !== false; // Default to true

      var self = this;
      var container = $(chatState.containerSelector);

      if (container.length === 0) {
        liveSite.log('[Chat] Chat container not found');
        return;
      }

      // Show typing indicator if requested
      if (showTyping && !chatState.isTyping) {
        chatState.isTyping = true;
        liveSite.ui.showTypingIndicator(chatState.containerSelector, avatarUrl);
        
        // Wait a bit before showing message (simulates typing delay)
        setTimeout(function() {
          liveSite.ui.hideTypingIndicator(chatState.containerSelector);
          chatState.isTyping = false;
          
          // Render and add message
          var time = self.getCurrentTime();
          var messageHtml = liveSite.ui.renderChatMessageBot(message, time, avatarUrl);
          var $message = $(messageHtml);
          
          container.append($message);
          self.scrollToBottom();
          
          // Store message
          chatState.messages.push({
            type: 'bot',
            message: message,
            time: time
          });
        }, 1200); // 1.2 second typing delay
      } else {
        // Add message immediately
        var time = this.getCurrentTime();
        var messageHtml = liveSite.ui.renderChatMessageBot(message, time, avatarUrl);
        var $message = $(messageHtml);
        
        container.append($message);
        this.scrollToBottom();
        
        // Store message
        chatState.messages.push({
          type: 'bot',
          message: message,
          time: time
        });
      }
    },

    /**
     * Add a user message to the chat
     * @param {string} message - Message text
     */
    addUserMessage: function(message) {
      var container = $(chatState.containerSelector);

      if (container.length === 0) {
        liveSite.log('[Chat] Chat container not found');
        return;
      }

      var time = this.getCurrentTime();
      var messageHtml = liveSite.ui.renderChatMessageUser(message, time);
      var $message = $(messageHtml);
      
      container.append($message);
      this.scrollToBottom();
      
      // Store message
      chatState.messages.push({
        type: 'user',
        message: message,
        time: time
      });
    },

    /**
     * Show welcome message with quick replies
     * @param {string} welcomeText - Welcome message text (optional, will use config.aiWelcomeMessage if not provided)
     * @param {Array} quickReplies - Array of quick reply chips (optional)
     */
    showWelcomeMessage: function(welcomeText, quickReplies) {
      var self = this;
      
      // Use provided welcomeText, or config.aiWelcomeMessage, or AI-style default
      var aiWelcomeMessage = welcomeText || config.aiWelcomeMessage || 'Hi! I\'m here to help you. What would you like to do today?';
      
      // Add welcome message from AI agent
      this.addBotMessage(aiWelcomeMessage, config.imageUrl, false);
      
      // Show quick replies after a short delay
      setTimeout(function() {
        if (quickReplies && quickReplies.length > 0) {
          liveSite.ui.renderQuickReplyChips(
            chatState.containerSelector,
            quickReplies,
            function(action, url, options) {
              // Handle quick reply click
              self.handleQuickReply(action, url, options);
            }
          );
        } else {
          // Use default actions as quick replies, limited by aiQuickRepliesMax
          var maxChips = config.aiQuickRepliesMax || 4;
          var chips = liveSite.ui.createQuickReplyChips(config.actions, maxChips);
          if (chips.length > 0) {
            liveSite.ui.renderQuickReplyChips(
              chatState.containerSelector,
              chips,
              function(action, url, options) {
                self.handleQuickReply(action, url, options);
              }
            );
          }
        }
      }, 500);
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
     * Handle quick reply selection
     * @param {string} action - Action type (e.g., 'schedule', 'contact', 'call')
     * @param {string} url - Action URL (optional)
     * @param {string} optionsString - Action options string (optional, format: "key1:value1;key2:value2")
     */
    handleQuickReply: function(action, url, optionsString) {
      var self = this;
      
      // Find action text for user message
      var actionObj = liveSite.ui.getAction(action);
      var actionText = actionObj ? actionObj.text : action;
      
      // Add user message
      this.addUserMessage(actionText);
      
      // Remove quick replies
      liveSite.ui.removeQuickReplyChips(chatState.containerSelector);
      
      // Show AI acknowledgment message for conversational flow
      var acknowledgmentMessages = [
        'Great choice! Let me help you with that...',
        'Perfect! Opening that for you now...',
        'Sure thing! Let\'s get that started...',
        'Excellent! I\'ll take care of that...'
      ];
      var randomAck = acknowledgmentMessages[Math.floor(Math.random() * acknowledgmentMessages.length)];
      this.addBotMessage(randomAck, config.imageUrl, true);
      
      // Parse options string if provided
      var options = this.parseOptions(optionsString || '');
      
      // Trigger action after a brief delay to let acknowledgment message appear
      setTimeout(function() {
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
          liveSite.log('[Chat] Unknown action: ' + action);
          // Fallback: navigate to URL if available
          if (url && url !== '#') {
            window.open(url, '_blank');
          }
        }
      }, 800); // Small delay to show acknowledgment before opening dialog
    },

    /**
     * Scroll chat to bottom
     */
    scrollToBottom: function() {
      var container = $(chatState.containerSelector);
      if (container.length > 0) {
        container.scrollTop(container[0].scrollHeight);
      }
    },

    /**
     * Get current time formatted for display
     * @returns {string} Formatted time string
     */
    getCurrentTime: function() {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return hours + ':' + minutes + ' ' + ampm;
    },

    /**
     * Clear all chat messages
     */
    clear: function() {
      var container = $(chatState.containerSelector);
      container.empty();
      chatState.messages = [];
      liveSite.log('[Chat] Cleared chat messages');
    },

    /**
     * Get chat messages
     * @returns {Array} Array of message objects
     */
    getMessages: function() {
      return chatState.messages;
    }
  });

})(window.LiveSite || {}, window);
