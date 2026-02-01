// Dependencies: config, ui/renderer

(function (liveSite, window) {

  var $      = liveSite.jQuery,
      _      = liveSite.lodash,
      config = liveSite.config,
      fn     = liveSite.fn;

  function triggerResize(element) {
    liveSite.trigger('resize', {
      width:  $(element).outerWidth(true),
      height: $(element).outerHeight(true)
    });
  }

  function isVisible(element) {
    return $(element).hasClass('ls-visible');
  }

  // animate defaults to true
  function show(element, animate) {
    if (_.isUndefined(animate)) {
      animate = true;
    }

    $(element).removeClass('ls-animate-hover');

    if (animate) {
      $(element).addClass('ls-animate-enter');
    } else {
      $(element).removeClass('ls-animate-enter');
    }

    $(element).addClass('ls-visible');
  }

  // animate defaults to true
  function hide(element, animate) {
    if (_.isUndefined(animate)) {
      animate = true;
    }

    $(element).removeClass('ls-animate-hover');

    if (animate) {
      $(element).addClass('ls-animate-enter');
    } else {
      $(element).removeClass('ls-animate-enter');
    }

    $(element).removeClass('ls-visible');
  }

  function addHoverClass(element, animate, milliseconds) {
    if (_.isUndefined(animate)) {
      animate = true;
    }

    if (animate) {
      setTimeout(function() {
        $(element).addClass('ls-animate-hover');
      }, milliseconds);
    } else {
      $(element).addClass('ls-animate-hover');
    }
  }

  function onClient(client) {

    if (_.isUndefined(client)) {
      liveSite.ui.hideClient();
    } else {
      window.client_jwt = client.jwt
      liveSite.ui.showClient(client);
    }
  }

  liveSite.extend(liveSite.ui, {

    engageButtonVisible : function() {
      return isVisible('#livesite_engage_button');
    },

    actionButtonsVisible : function() {
      return isVisible('#livesite_action_buttons');
    },

    // animate defaults to true
    showEngageButton : function(animate) {
      show('#livesite_engage_button', animate);
      triggerResize('#livesite_engage_button');
    },

    // animate defaults to true
    hideEngageButton: function(animate) {
      hide('#livesite_engage_button', animate);
    },

    // animate defaults to true
    showActiveEngage: function(animate) {
      fn.trackOnce('active_engage');

      fn.setState('engage', 'opened');

      if (fn.isMobile() && liveSite.ui.actionButtonsVisible()) {
        liveSite.ui.hideActionButtons(animate);
      }

      liveSite.ui.hideEngageButton(animate);

      show('#livesite_active_engage', animate);
      addHoverClass('#livesite_active_engage', animate, 1500);

      triggerResize('#livesite_active_engage');

      // HACK: For wix editor, when switching between accounts in open mode, the animation doesn't finishe before size is reported
      setTimeout(function() {
        triggerResize('#livesite_active_engage');
      }, 400);

      // Initialize AI chat if enabled
      if (config.aiChatEnabled && liveSite.chat) {
        // Wait a bit for DOM to be ready, then initialize chat
        setTimeout(function() {
          var chatContainer = $('#livesite_chat_messages');
          if (chatContainer.length > 0) {
            liveSite.chat.init('#livesite_chat_messages');
            // Show AI welcome message
            liveSite.chat.showWelcomeMessage(config.aiWelcomeMessage);
          }
        }, animate ? 300 : 0); // Small delay if animated to let animation start
      }
    },

    // animate defaults to true
    hideActiveEngage: function(animate) {
      if (_.isUndefined(animate)) {
        animate = true;
      }

      fn.setState('engage', 'closed');

      hide('#livesite_active_engage', animate);

      liveSite.ui.showEngageButton(animate);

      if (fn.isMobile()) {
        $('#livesite_active_engage .ls-tooltip-menu').removeClass('ls-visible');
      }

      triggerResize('#livesite_engage_button');
    },

    // animate defaults to true
    toggleActiveEngage : function(animate) {

      var state = liveSite.fn.getState('engage');

      if (state === 'opened') {
        liveSite.ui.showActiveEngage(animate);
      } else {
        liveSite.ui.hideActiveEngage(animate);
      }
    },

    // animate defaults to true
    showActionButtons: function(animate) {
      show('#livesite_action_buttons', animate);
      addHoverClass('#livesite_action_buttons', animate, 1500);
    },

    // animate defaults to true
    hideActionButtons: function(animate) {
      hide('#livesite_action_buttons', animate);
    },

    showClient: function(data) {
      var counterElements = '#livesite_active_engage .ls-counter, #livesite_action_buttons .ls-counter',
          counterAlreadyVisible = $(counterElements).hasClass('ls-visible'),
          welcomeAlreadyVisible = $('.ls-welcome-box').hasClass('ls-visible');

      $('#livesite_active_engage .livesite-account-text').text(data.name);

      liveSite.ui.renderClient(data.name, data.unread);
      liveSite.ui.setCounter(data.unread);

      if (_.isNumber(data.unread) && data.unread > 0) {
        show(counterElements, !counterAlreadyVisible);
      } else {
        hide(counterElements, false);
      }

      if (fn.getState('notification') !== 'closed') {
        show('.ls-welcome-box', !welcomeAlreadyVisible);
      }

      if (liveSite.ui.engageButtonVisible()) {
        triggerResize('#livesite_engage_button');
      }
    },

    hideClient: function() {
      liveSite.log('Hide client');

      fn.setState('notification', '');

      $('#livesite_active_engage .livesite-account-text').text(config.textMyAccount);

      liveSite.ui.renderClient();
      liveSite.ui.setCounter(0);

      $('.ls-welcome-box').remove();

      if (liveSite.ui.engageButtonVisible()) {
        triggerResize('#livesite_engage_button');
      }
    },

    closeClientWelcomeBox: function() {
      fn.setState('notification', 'closed');

      $('.ls-welcome-box').remove();
    },

    leggedActiveEngageOpen: function() {
      var state = fn.getState('engage');

      if (state !== 'opened' && state !== 'closed') {
        liveSite.ui.showActiveEngage(true);
      }
    },

    initActiveEngage: function() {
      var state = config.engageState;

      $('body').on('click', '.livesite-engage-close', function(e) {
        e.preventDefault();
        liveSite.ui.hideActiveEngage();
      });

      $('body').on('click', '.livesite-engage', function(e) {
        e.preventDefault();
        fn.trackOnce('active_engage_button_click');

        liveSite.ui.showActiveEngage();
      });

      $('#livesite_active_engage').on('click', '.ls-more-actions', function(e) {
        e.preventDefault();
        if (fn.isMobile()) {
          $('#livesite_active_engage .ls-tooltip-menu').toggleClass('ls-visible');
        }
      });

      if (_.isEmpty(state)) {
        state = fn.getState('engage');
      }

      liveSite.log('ActiveEngage state: ' + state);

      if (state === 'opened') {
        liveSite.ui.showActiveEngage(false);
      } else {
        liveSite.ui.showEngageButton(false);
      }

      if (state !== 'opened' && state !== 'closed' && config.deviceEngageAfter() !== -1) {
        setTimeout(liveSite.ui.leggedActiveEngageOpen, config.deviceEngageAfter());
      }
    },

    initActionButtons: function() {
      $('#livesite_action_buttons').on('click', '.livesite-action-buttons-hide', function(e) {
        e.preventDefault();
        liveSite.ui.hideActionButtons();
        liveSite.ui.showEngageButton();
      });

      $('#livesite_engage_button').on('click', '.livesite-action-buttons-show', function(e) {
        e.preventDefault();
        liveSite.ui.showActionButtons();
        liveSite.ui.hideEngageButton();
      });

      if (!fn.isMobile()) {
        setTimeout(function() {
          // give time for all html to render and be in place ready for entering animation
          liveSite.ui.showActionButtons();
        }, 1500);
      }
    },

    init: function() {
      if (config.reset) {
        fn.resetState();
      }

      if (config.activeEngage) {
        liveSite.ui.initActiveEngage();
      }

      liveSite.ui.initActionButtons();

      $('body').on('click', '.livesite-welcome-close', function(e) {
        e.preventDefault();
        e.stopPropagation();
        liveSite.ui.closeClientWelcomeBox();
      });
      
      liveSite.on('client', onClient);
    }
  });

} (window.LiveSite, window));