(function (liveSite, window) {

  var $ = liveSite.jQuery,
      _ = liveSite.lodash;

  function deprecateClass(newSelector, oldClass) {
    $(newSelector).addClass(oldClass);
  }

  function deprecateConfig(newConfig, oldConfig) {
    if (!_.isUndefined(liveSite.config[oldConfig])) {
      liveSite.config[newConfig] = liveSite.config[oldConfig];
    }
  }
  
  function classDeprecationWarning(oldClass, newClass) {
    liveSite.log('Change class ' + oldClass + ' to ' + newClass, true);
  }

  function configDeprecationWarning(oldConfig, newConfig) {
    liveSite.log('Change init parameter from ' + oldConfig + ' to ' + newConfig, true);
  }

  liveSite.extend({
    uiBackwardCompatibility : function() {
      deprecateClass('.ls-welcome-box', 'ls-client-welcome-box');
      deprecateClass('.ls-welcome-box-C', 'ls-cwb-c');
      deprecateClass('.ls-ae-C', 'ls-ae-container');
      deprecateClass('.ls-ae .ls-content', 'ls-ae-content');
      deprecateClass('.ls-ae .ls-text', 'ls-ae-text');
      deprecateClass('.ls-ae .ls-more-actions-C', 'ls-ae-more-actions');
      deprecateClass('.ls-ae .ls-more-actions', 'ls-ae-more');
      deprecateClass('.ls-ae .ls-tooltip-menu', 'ls-ae-main-action');
      deprecateClass('.ls-ae .ls-powered-by', 'ls-ae-powered-by');
      deprecateClass('.ls-ae .ls-promotional-link', 'ls-ae-promo-link');
      deprecateClass('.ls-ae .ls-close', 'ls-ae-close');
      deprecateClass('.ls-ae .ls-title', 'ls-ae-title');
      deprecateClass('.ls-ae .ls-photo', 'ls-ae-photo');
      deprecateClass('.ls-ae .ls-main-action', 'ls-ae-main-action');
      deprecateClass('.ls-ae .ls-main-action-C', 'ls-ae-main-warpper');
      deprecateClass('.ls-ae .ls-inline-actions', 'ls-ae-all-actions');
      deprecateClass('.ls-ae .ls-actions-C', 'ls-ae-actions');
      deprecateClass('.ls-ae .ls-actions-C .ls-tooltip-menu', 'ls-ae-more-actions-wrapper');
      deprecateClass('.ls-ae .ls-action-C', 'ls-ae-action-wrapper');
      deprecateClass('.ls-ae .ls-action', 'ls-ae-action');
      deprecateClass('.ls-ae .ls-action.ls-my-account', 'ls-ae-main');
      deprecateClass('.ls-ae .ls-action.ls-more-actions', 'ls-ae-more');
      deprecateClass('.ls-ae .ls-inline-actions', 'ls-ae-all-actions');
      deprecateClass('#livesite_engage_button .ls-trigger-C', 'ls-ab-trigger');
      deprecateClass('#livesite_engage_button .ls-actions-open', 'ls-ab-open');
      deprecateClass('#livesite_engage_button .ls-actions-close', 'ls-ab-close');
      deprecateClass('.ls-icon-cal', 'livesite-icon-cal');
      deprecateClass('.ls-icon-env', 'livesite-icon-env');
      deprecateClass('.ls-icon-phone', 'livesite-icon-phone');
      deprecateClass('.ls-icon-credit-card', 'livesite-icon-credit-card');
      deprecateClass('.ls-icon-doc', 'livesite-icon-doc');
      deprecateClass('.ls-icon-user', 'livesite-icon-user');
      deprecateClass('.ls-tooltip-menu-item', 'ls-ae-more-action');
      deprecateClass('#livesite_action_buttons .ls-action', 'ls-ab-action');
      deprecateClass('#livesite_action_buttons .ls-close', 'ls-cwb-close');
      deprecateClass('#livesite_action_buttons .ls-title', 'ls-cwb-title');
      deprecateClass('#livesite_action_buttons .ls-content', 'ls-cwb-notification');

      deprecateClass('.ls-font-family-T', 'ls-theme-font-family');
      deprecateClass('.ls-font-size-T', 'ls-theme-font-size');
      deprecateClass('.ls-ae-bg-T', 'ls-theme-ae-bg');
      deprecateClass('.ls-ae-text-T', 'ls-theme-ae-text');
      deprecateClass('.ls-ae-link-T', 'ls-theme-ae-link');
      deprecateClass('.ls-main-action-T', 'ls-theme-ae-action');
      deprecateClass('.ls-action-T', 'ls-theme-label');
      deprecateClass('.ls-counter-T', 'ls-theme-counter');

      liveSite.warn('[DEPRECATION] Some of the LiveSite CSS classes have changed and will soon be removed, type LiveSite.deprecationInfo() in console for more information.');
    },

    configBackwardCompatibility : function() {
      deprecateConfig('actionButtons', 'actionsMenu');
      deprecateConfig('inlineActions', 'activeEngageActions');
      deprecateConfig('collapsedActions', 'activeEngageCollapsedActions');
    },
    
    deprecationInfo : function () {
      liveSite.warn('[DEPRECATION] Some of the LiveSite CSS classes have changed and will soon be removed. Please change any custom CSS you have added according to the following:');
      classDeprecationWarning('ls-client-welcome-box', 'ls-welcome-box');
      classDeprecationWarning('ls-cwb-c', 'ls-welcome-box-C');
      classDeprecationWarning('ls-ae-container', 'ls-ae-C');
      classDeprecationWarning('ls-ae-content', 'ls-content');
      classDeprecationWarning('ls-ae-text', 'ls-text');
      classDeprecationWarning('ls-ae-more-actions', 'ls-more-actions-C');
      classDeprecationWarning('ls-ae-more', 'ls-more-actions');
      classDeprecationWarning('ls-ae-main-action', 'ls-tooltip-menu');
      classDeprecationWarning('ls-ae-powered-by', 'ls-powered-by');
      classDeprecationWarning('ls-ae-promo-link', 'ls-promotional-link');
      classDeprecationWarning('ls-ae-close', 'ls-close');
      classDeprecationWarning('ls-ae-title', 'ls-title');
      classDeprecationWarning('ls-ae-photo', 'ls-photo');
      classDeprecationWarning('ls-ae-main-action', 'ls-main-action');
      classDeprecationWarning('ls-ae-main-warpper', 'ls-main-action-C');
      classDeprecationWarning('ls-ae-all-actions', 'ls-inline-actions');
      classDeprecationWarning('ls-ae-actions', 'ls-actions-C');
      classDeprecationWarning('ls-ae-more-actions-wrapper', 'ls-tooltip-menu');
      classDeprecationWarning('ls-ae-action-wrapper', 'ls-action-C');
      classDeprecationWarning('ls-ae-action', 'ls-action');
      classDeprecationWarning('ls-ae-main', 'ls-my-account');
      classDeprecationWarning('ls-ae-more', 'ls-more-actions');
      classDeprecationWarning('ls-ae-all-actions', 'ls-inline-actions');
      classDeprecationWarning('ls-ab-trigger', 'ls-trigger-C');
      classDeprecationWarning('ls-ab-open', 'ls-actions-open');
      classDeprecationWarning('ls-ab-close', 'ls-actions-close');
      classDeprecationWarning('livesite-icon-cal', 'ls-icon-cal');
      classDeprecationWarning('livesite-icon-env', 'ls-icon-env');
      classDeprecationWarning('livesite-icon-phone', 'ls-icon-phone');
      classDeprecationWarning('livesite-icon-credit-card', 'ls-icon-credit-card');
      classDeprecationWarning('livesite-icon-doc', 'ls-icon-doc');
      classDeprecationWarning('livesite-icon-user', 'ls-icon-user');
      classDeprecationWarning('ls-ae-more-action', 'ls-tooltip-menu-item');
      classDeprecationWarning('ls-ab-action', 'ls-action');
      classDeprecationWarning('ls-cwb-close', 'ls-close');
      classDeprecationWarning('ls-cwb-title', 'ls-title');
      classDeprecationWarning('ls-cwb-notification', 'ls-content');

      classDeprecationWarning('ls-theme-font-family', 'ls-font-family-T');
      classDeprecationWarning('ls-theme-font-size', 'ls-font-size-T');
      classDeprecationWarning('ls-theme-ae-bg', 'ls-ae-bg-T');
      classDeprecationWarning('ls-theme-ae-text', 'ls-ae-text-T');
      classDeprecationWarning('ls-theme-ae-link', 'ls-ae-link-T');
      classDeprecationWarning('ls-theme-ae-action', 'ls-main-action-T');
      classDeprecationWarning('ls-theme-label', 'ls-action-T');
      classDeprecationWarning('ls-theme-counter', 'ls-counter-T');

      configDeprecationWarning('actionsMenu', 'actionButtons');
      configDeprecationWarning('activeEngageActions', 'inlineActions');
      configDeprecationWarning('activeEngageCollapsedActions', 'collapsedActions');
    }
  });

} (window.LiveSite, window));