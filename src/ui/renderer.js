// Dependencies: config

(function (liveSite, window) {

  var $             = liveSite.jQuery,
      _             = liveSite.lodash,
      config        = liveSite.config,
      fn            = liveSite.fn,
      widthPercent  = 100,
      aeZoom        = 1,

      ACTIVE_ENGAGE_TEMPLATE = '<div id="livesite_active_engage" class="ls-font-family-T ls-font-size-T ls-zoom ls-overlay-T" dir="{{data.rtl ? "rtl" : "ltr"}}">' +
                                 '<div class="ls-ae-C ls-zoom-width">' +
                                   '<div class="ls-ae">' +
                                     '<div class="ls-content ls-ae-bg-T">' +
                                       '<a href="#" class="ls-close livesite-engage-close ls-ae-text-T"></a>' +
                                       '<div class="ls-ae-top">{{topPromoLink}}</div>' +
                                       '<div class="ls-clearfix">' +
                                         '<% if (!_.isEmpty(data.imageUrl)) { %>' +
                                           '<% if (_.isEmpty(data.profileUrl)) { %>' +
                                             '<div class="ls-photo"><img src="<%- data.imageUrl %>"/></div>' +
                                           '<% } else { %>' +
                                             '<a class="ls-photo" target="_blank" href="<%- data.profileUrl %>"><img src="<%- data.imageUrl %>"/></a>' +
                                           '<% } %>' +
                                         '<% } %>' +
                                         '<div class="ls-title ls-ae-text-T"><%- data.activeEngageTitle %></div>' +
                                       '</div>' +
                                       '<div class="ls-text ls-ae-text-T">{{data.activeEngageText}}</div>' +
                                       '<div class="ls-main-action-C">' +
                                         '<% if (data.activeEngageAction != "none") { %>' +
                                           '<% if (showCollapsedActions) { %>' +
                                             '<div class="ls-more-actions-C">' +
                                               '<a class="ls-more-actions ls-icon-menu ls-ae-text-T" href="#"></a>' +
                                               '<div class="ls-tooltip-menu ls-tooltip-menu-bg-T"> ' +
                                                 '<% _.forEach(data.actions, function(item) { %>' +
                                                   '<a class="ls-tooltip-menu-item ls-tooltip-menu-text-T livesite-{{item.action}} ls-icon-{{item.icon}} ls-action-{{item.name}} {{ item.lightbox ? \'livesite-lightbox\' : \'\' }}" href="<%- item.url || \'#\' %>" title="<%- item.text %>" target="<%- item.target %>" data-origin="livesite_active_engage" data-options="<%- item.options %>"><%- item.text %></a>' +
                                                 '<% }); %>' +
                                               '</div>' +
                                             '</div>' +
                                           '<% } %>' +
                                           '<a class="livesite-{{data.activeEngageAction}} ls-main-action ls-main-action-T {{ data.activeEngageActionLightbox ? \'livesite-lightbox\' : \'\' }}" href="<%- data.activeEngageActionUrl || \'#\' %>" target="<%- data.activeEngageActionTarget %>" data-origin="livesite_main_action" data-options="<%- data.activeEngageActionOptions %>"><%- data.activeEngageActionText %></a>' +
                                         '<% } %>' +
                                       '</div>' +
                                       '{{bottomPromoLink}}' +
                                     '</div>' +
                                     '<% if (showInlineActions) { %>' +
                                       '{{inlineActions}}' +
                                     '<% } %>' +
                                   '</div>' +
                                 '</div>' +
                               '</div>',

      INLINE_ACTIONS_TEMPLATE = '<div class="ls-inline-actions ls-inline-actions-T" id="livesite_inline_actions">' +
                                  '<% if (data.myAccountAction) { %> ' +
                                    '<a class="livesite-main ls-profile-action ls-action-C" data-origin="livesite_active_engage" href="#">' +
                                      '<span class="ls-action ls-my-account ls-my-account-action-T ls-icon-user"><div class="ls-counter ls-counter-T"></div></span>' +
                                      '<span class="livesite-account-text ls-action-text ls-inline-action-text-T"><%- data.textMyAccount %></span>' +
                                    '</a>' +
                                  '<% } %> ' +
                                  '<div class="ls-actions-C">' +
                                    '<% _.forEach(data.actions, function(item, i) { %>' +
                                      '<% if (data.actions.length > 4 && i > 2){ moreActions.push(item)} else { %>' +
                                          '<a class="ls-action-C livesite-{{item.action}} ls-action-{{item.name}} {{ item.lightbox ? \'livesite-lightbox\' : \'\' }}" href="<%- item.url || \'#\' %>" target="<%- item.target %>" data-origin="livesite_active_engage" data-options="<%- item.options %>" <% if(item.text.length > 24){ %> title="<%- item.text %> <% } %>">' +
                                          '<span class="ls-action ls-icon-{{item.icon}} ls-inline-action-T"></span>' +
                                          '<span class="ls-action-text ls-inline-action-text-T"><%- LiveSite.ui.truncate(item.text, 22) %></span>' +
                                        '</a>' +
                                      '<% }}); %>' +
                                      '<% if (moreActions.length > 0){ %>' +
                                        '<div class="ls-action-C ls-more-actions-C">' +
                                          '<a class="ls-action ls-more-actions ls-icon-dots ls-inline-item-T" href="#"></a>' +
                                          '<span class="ls-action-text ls-inline-action-text-T"><%- data.textMore %></span>' +
                                          '<div class="ls-tooltip-menu ls-tooltip-menu-bg-T">' +
                                          '<% _.forEach(moreActions, function(item) { %>' +
                                            '<a class="livesite-{{item.action}} ls-tooltip-menu-item ls-tooltip-menu-text-T ls-action-{{item.name}} ls-icon-{{item.icon}} {{ item.lightbox ? \'livesite-lightbox\' : \'\' }}" href="<%- item.url || \'#\' %>" title="<%- item.text %>" target="<%- item.target %>" data-origin="livesite_active_engage" data-options="<%- item.options %>"><%- item.text %></a>' +
                                          '<% }); %>' +
                                        '</div>' +
                                      '</div>' +
                                    '<% } %>' +
                                  '</div>' +
                                '</div>',

      ENGAGE_BUTTON_TEMPLATE =  '<div id="livesite_engage_button" class="ls-font-family-T ls-font-size-T ls-zoom" dir="{{data.rtl ? "rtl" : "ltr"}}">'+
                                  '<div class="ls-zoom-width">' +
                                    '<div class="ls-welcome-box-C ls-hide-mobile"></div>'+
                                    '<% if (showMobileActionsMenu) { %>' +
                                      '<div class="ls-trigger-C ls-hide-desktop">' +
                                        '<a class="ls-actions-open livesite-action-buttons-show ls-action-T ls-icon-menu ls-visible" href="#"></a>' +
                                      '</div>' +
                                    '<% } %>' +
                                    '<% if (mobileQuickAction) { %>' +
                                      '<div class="ls-trigger-P ls-hide-desktop">' +
                                        '<a class="ls-action ls-actions-open livesite-{{mobileQuickAction}} ls-action-T ls-icon-{{mobileQuickActionIcon}} ls-visible" href="#" data-options="<%- mobileQuickActionOptions %> "></a>' +
                                      '</div>' +
                                    '<% } %>' +
                                    '<% if (data.activeEngage && data.engageButton) { %>' +
                                      '<a href="#" class="livesite-engage ls-engage-button ls-action-T"><%- data.engageButtonText %></a>'+
                                    '<% } %>' +
                                  '</div>' +
                                '</div>',

      WELCOME_BOX_TEMPLATE =  '<div class="ls-welcome-box livesite-main ls-welcome-box-bg-T ls-font-family-T ls-font-size-T">' +
                                '<a href="#" class="livesite-welcome-close ls-close ls-welcome-box-text-T"></a>' +
                                '<div class="ls-title ls-welcome-box-text-T"><%- welcome_text %>, <%- name %></div>' +
                                '<div class="ls-content ls-welcome-box-text-T"><%- notification_text %></div>' +
                              '</div>',

      ACTION_BUTTONS_TEMPLATE = '<div id="livesite_action_buttons" class="ls-font-family-T ls-font-size-T ls-zoom ls-overlay-T" dir="{{data.rtl ? "rtl" : "ltr"}}">' +
                                  '<div class="ls-actions ls-zoom-width">' +
                                    '<div class="ls-actions-C">' +
                                      '<% if (data.myAccountAction) { %> ' +
                                        '<a class="ls-action livesite-main ls-icon-user ls-my-account-action-T" data-origin="livesite_menu" href="#"><span><em class="ls-action-text-T"><%- data.textMyAccount %></em></span><div class="ls-counter ls-counter-T"></div></a>'+
                                        '<div class="ls-welcome-box-C ls-hide-mobile"></div>' +
                                      '<% } %> ' +
                                      '<% _.forEach(data.actions, function(item) { %>' +
                                        '<a class="ls-action ls-action-T ls-icon-{{item.icon}} livesite-{{item.action}} {{ item.lightbox ? \'livesite-lightbox\' : \'\' }}" href="<%- item.url || \'#\' %>" target="<%- item.target %>" data-origin="livesite_menu" data-options="<%- item.options %>"><span><em class="ls-action-text-T"><%- item.text %></em></span></a>' +
                                      '<% }); %>' +
                                    '</div>' +
                                    '<a class="ls-actions-close ls-action-text-T ls-icon-cancel livesite-action-buttons-hide ls-hide-desktop"></a>' +
                                  '</div>' +
                                '</div>',

      TOP_PROMO_LINK_TEMPLATE = '<% if (!_.isEmpty(data.promotionalLinkUrl)) { %>' +
                                  '<a href="<%- data.promotionalLinkUrl %>" class="ls-promotional-link ls-ae-link-T" target="_blank"><%- data.textPromotionalLink %></a>' +
                                '<% } else if (!_.isEmpty(data.poweredByUrl)) { %>' +
                                  '<a href="<%- data.poweredByUrl %>" class="ls-powered-by ls-ae-text-T" target="_blank">{{data.textPoweredBy}}</a>' +
                                '<% } %>',

      BOTTOM_PROMO_LINK_TEMPLATE = '<div class="ls-powered-by"><a href="<%- data.poweredByUrl %>" target="_blank" class="ls-ae-text-T">{{data.textPoweredBy}}</a></div>',

      CSS_TEMPLATE = '<div id="livesite-style"><style>' +
                     '<% if (!_.isEmpty(config.themeFontFamily)) { %>' +
                     '  .ls-font-family-T { font-family: {{ config.themeFontFamily }}; }\n' +
                     '  .ls-font-family-T div, .ls-font-family-T span, .ls-font-family-T a, .ls-font-family-T em, .ls-font-family-T img { font-family: {{ config.themeFontFamily }}; }\n' +
                     '<% } %>' +
                     '<% if (_.isNumber(config.themeFontSize)) { %>' +
                     '  .ls-font-size-T { font-size: {{ config.themeFontSize }}px; }\n' +
                     '<% } %>' +
                     '<% if (!_.isEmpty(config.themeBackground)) { %>' +
                     '  #livesite_active_engage .ls-ae-bg-T { background-color: {{ config.themeBackground }}; }\n' +
                     '<% } %>' +
                     '<% if (!_.isEmpty(config.themeText)) { %>' +
                     '  #livesite_active_engage .ls-ae-text-T { color: {{ config.themeText }}; }\n' +
                     '  #livesite_active_engage .ls-ae-text-T:before { color: {{ config.themeText }}; border-color: {{ config.themeText }};  }\n' +
                     '<% } %>' +
                     '<% if (!_.isEmpty(config.themeLink)) { %>' +
                     '  #livesite_active_engage .ls-ae-link-T { color: {{ config.themeLink }}; }\n' +
                     '  #livesite_active_engage .ls-text a { color: {{ config.themeLink }}; }\n' +
                     '<% } %>' +
                     '<% if (!_.isEmpty(config.themeMainActionColor)) { %>' +
                     '  #livesite_active_engage .ls-main-action-T { background-color: {{ config.themeMainActionColor }}; }\n' +
                     '<% } %>' +
                     '<% if (!_.isEmpty(config.themeMainActionHover)) { %>' +
                     '  #livesite_active_engage .ls-main-action-T:hover { background-color: {{ config.themeMainActionHover }}; }\n' +
                     '<% } %>' +
                     '<% if (!_.isEmpty(config.themeMainActionText)) { %>' +
                     '  #livesite_active_engage .ls-main-action-T { color: {{ config.themeMainActionText }}; }\n' +
                     '<% } %>' +
                     '<% if (!_.isEmpty(config.themeActionColor)) { %>' +
                     '  #livesite_engage_button .ls-action-T, #livesite_action_buttons .ls-action-T { background-color: {{ config.themeActionColor }}; }\n' +
                     '<% } %>' +
                     '<% if (!_.isEmpty(config.themeActionHover)) { %>' +
                     '  #livesite_engage_button .ls-action-T:hover, #livesite_action_buttons .ls-action-T:hover { background-color: {{ config.themeActionHover }}; }\n' +
                     '<% } %>' +
                     '<% if (!_.isEmpty(config.themeActionText)) { %>' +
                     '  #livesite_engage_button .ls-action-T, #livesite_action_buttons .ls-action-T, #livesite_engage_button .ls-action-T, #livesite_engage_button .ls-action-T:before, #livesite_action_buttons .ls-action-T:before { color: {{ config.themeActionText }}; }\n' +
                     '<% } %>' +
                     '</style></div>';

  function addDynamicClasses(element) {
    var classes = 'ls-desktop';

    if (fn.isMobile()) {
      classes = 'ls-mobile';
    }

    if (config.rtl) {
      classes += ' ls-rtl';
    }

    $(element + ', ' + element + ' *').addClass(classes);
  }

  liveSite.ui = liveSite.ui || {};

  liveSite.extend(liveSite.ui, {

    truncate: function(str, maxLength) {
      // adding 2 more chars for the condition in case that its just replacing a char or two
      if (str.length <= (maxLength + 2)) return str;
      var shorty = str.substring(0, maxLength).trim();
      return shorty + '...';
    },

    hasAction: function(action) {
      var has = false;
      _.forEach(config.actions, function(act) {
        if(act.action == action) {
          has = true;
          return;
        }
      });

      return has;
    },

    getAction: function(action) {
      var _action = null;
      // console.log('config.actions ' , config.actions);
      _.forEach(config.actions, function(act) {
        if(act.action == action) {
          _action = act;
          return;
        }
      });

      return _action;
    },

    renderThemeCss: function() {
      var css;

      if (!liveSite.config.theme) {
        return;
      }

      css = _.template(CSS_TEMPLATE, { config: config });

      if (css) {
        $(css).appendTo('head');
      }

      liveSite.log('rendered theme css');
    },

    isActionsListValuable: function() {
      if (config.actions.length == 0) {
        return false;
      } else {
        return config.actions.length > 1 ||
            config.actions[0].action != config.activeEngageAction ||
            config.actions[0].text != config.activeEngageActionText;
      }
    },

    renderActiveEngage: function() {

      var actionsListValuable   = liveSite.ui.isActionsListValuable(),
          showInlineActions     = config.inlineActions && (config.myAccountAction || actionsListValuable),
          showCollapsedActions  = config.collapsedActions && actionsListValuable,
          data                  = config,
          topPromoLink          = liveSite.ui.renderTopPromoLink(),
          bottomPromoLink       = liveSite.ui.renderBottomPromoLink(),
          inlineActions         = liveSite.ui.renderInlineActions(),
          active_engage         = _.template(ACTIVE_ENGAGE_TEMPLATE, {
            data:             data,
            topPromoLink:     topPromoLink,
            bottomPromoLink:  bottomPromoLink,
            inlineActions:    inlineActions,
            showInlineActions: showInlineActions,
            showCollapsedActions: showCollapsedActions
          });

      liveSite.log('body length is ' + $('body').length);

      $(active_engage).appendTo('body');

      liveSite.log('active engage length is ' + $('#livesite_active_engage').length);

      addDynamicClasses('#livesite_active_engage');

      liveSite.log('rendered active engage');
    },

    renderEngageButton: function() {
      var actionsListValuable       = liveSite.ui.isActionsListValuable(),
          showMobileActionsMenu     = config.actionButtons && (config.myAccountAction || actionsListValuable),
          mobileQuickAction         = config.mobileQuickAction,
          mobileQuickActionIcon     = config.mobileQuickActionIcon,
          mobileQuickActionOptions  = config.mobileQuickActionOptions,
          actionFound               = null;

      if (mobileQuickAction != '') {
        actionFound = liveSite.ui.getAction(mobileQuickAction);

        // For call we must have the number in options or in the livesite actions configuration
        if (mobileQuickAction == 'call' && (actionFound == null && mobileQuickActionOptions == '')) {
          mobileQuickAction = '';
        }
      }

      if (mobileQuickAction != '') {
        // Set the icon if no override
        if (mobileQuickActionIcon == '') {
          mobileQuickActionIcon = actionFound.icon;
        }
        // Set the options if no override
        if (mobileQuickActionOptions == '') {
          mobileQuickActionOptions = actionFound.options;
        }
      }

      var engage_button =  _.template(ENGAGE_BUTTON_TEMPLATE, {
          data: config,
          mobileQuickAction: mobileQuickAction,
          mobileQuickActionIcon: mobileQuickActionIcon,
          mobileQuickActionOptions: mobileQuickActionOptions,
          showMobileActionsMenu: showMobileActionsMenu
        });

      $(engage_button).appendTo('body');
      addDynamicClasses('#livesite_engage_button');

      liveSite.log('rendered engage button');
    },

    renderActionButtons: function() {
      var action_buttons =  _.template(ACTION_BUTTONS_TEMPLATE, {
          data: config
        });

      $(action_buttons).appendTo('body');
      addDynamicClasses('#livesite_action_buttons');

      liveSite.log('rendered action buttons');
    },

    setCounter: function(count) {
      var counterElements = $('#livesite_active_engage .ls-counter, #livesite_action_buttons .ls-counter');
      if (_.isNumber(count) && count > 0) {
        counterElements.text(count).addClass('ls-animate-enter');
        counterElements.addClass('ls-visible');
      } else {
        counterElements.text('0').removeClass('ls-visible ls-animate-enter');
      }
    },

    renderInlineActions: function() {
      return _.template(INLINE_ACTIONS_TEMPLATE, {
        data:        config,
        moreActions: []
      });
    },

    renderTopPromoLink: function() {
      if (_.isEmpty(config.poweredByUrl) && _.isEmpty(config.promotionalLinkUrl)) {
        return '';
      } else {
        return _.template(TOP_PROMO_LINK_TEMPLATE, {data: config});
      }
    },

    renderBottomPromoLink: function() {
      if (!_.isEmpty(config.poweredByUrl) && !_.isEmpty(config.promotionalLinkUrl)) {
        return _.template(BOTTOM_PROMO_LINK_TEMPLATE, {data: config});
      } else {
        return '';
      }
    },

    renderClient : function(name, unread) {
      var welcome_box, notification_text, container;

      if (_.isUndefined(name)) {
        $('.ls-welcome-box-C').html('');
      } else {

        if (_.isUndefined(unread) || unread === 0) {
          notification_text = config.textHello;
        } else {
          notification_text = config.textUnread;
        }
        welcome_box = _.template(WELCOME_BOX_TEMPLATE, {
          welcome_text      : config.textWelcome,
          name              : name,
          unread            : unread,
          notification_text : notification_text});

        if (config.actionButtons) {
          container = '#livesite_action_buttons .ls-welcome-box-C';
        } else {
          container = '#livesite_engage_button .ls-welcome-box-C';
        }

        $(container).html(welcome_box);
        addDynamicClasses(container);

        liveSite.log('rendered client');
      }
    },

    render: function() {
      liveSite.ui.renderThemeCss();

      // Notice, on mobile the hamburger for the actions menu is inside the engage button template
      if ((liveSite.config.activeEngage && liveSite.config.engageButton) || (fn.isMobile() && config.actionButtons)) {
        liveSite.ui.renderEngageButton();
      }
      
      if (liveSite.config.activeEngage) {
        liveSite.ui.renderActiveEngage();
      }

      if (liveSite.config.actionButtons) {
        liveSite.ui.renderActionButtons();
      }

      liveSite.uiBackwardCompatibility();

      if (fn.isMobile()) {
        liveSite.ui.adjustZoom();

        $(window).resize(function() {
          liveSite.ui.adjustZoom();
        });

        setInterval(liveSite.ui.adjustZoom, config.adjustZoomInterval);
      }
    },

    destroy: function() {
      $('#livesite_active_engage, #livesite_inline_actions, #livesite_engage_button, #livesite_action_buttons, #livesite-style').remove();

      // Should be in behviour destroy method but was too cluttered
      $('body').off('click', '.livesite-engage-close');
      $('body').off('click', '.livesite-engage');
      $('body').off('click', '.livesite-welcome-close');

      if (fn.isMobile()) {
        clearInterval(liveSite.ui.adjustZoom);
      }      
    },

    adjustZoom: function() {
      liveSite.log('adjust zoom');

      // fix rotating browsers, on mobile, always width < height
      var device_width  = Math.min(screen.width, screen.height),
          device_height = Math.max(screen.width, screen.height),
          inner_width   = window.innerWidth,
          ae_width      = 380,
          landscape, device_ratio, width_percent, ae_zoom;

      if (config.mode == 'mobile-landscape') {
        landscape = true;
      } else if (config.mode == 'mobile-portrait') {
        landscape = false;
      } else {
        landscape = (window.innerHeight < window.innerWidth);
      }

      if (landscape) {
        device_ratio = device_width / device_height;
        width_percent = Math.round(100 * device_ratio);
        ae_zoom       = inner_width * device_ratio / ae_width;
      } else {
        width_percent = 100;
        ae_zoom       = inner_width / ae_width;
      }

      if (widthPercent !== width_percent || aeZoom !== ae_zoom) {
        widthPercent = width_percent;
        aeZoom       = ae_zoom;

        $('.ls-zoom-width').css({'width': widthPercent + '%'});
        $('.ls-zoom').css({'zoom': aeZoom});
      }
    }
  });

} (window.LiveSite, window));