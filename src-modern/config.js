// Dependencies: core

(function (liveSite, window) {

  var r = Math.floor(new Date().getTime() / 1000000),
    p = ('https:' == window.document.location.protocol) ? 'https://' : 'http://',
    options = {},
    config  = {

      protocol                      : p,
      portalHost                    : 'clients.vcita.com', // Default matching Rails production
      host                          : 'www.vcita.com', // Default matching Rails production
      uid                           : '', // Pivot uid for the actions

      desktopCss                    : p + 'widgets.vcdnita.com/assets/livesite.css?' + r, // Default matching Rails production
      mobileCss                     : p + 'widgets.vcdnita.com/assets/livesite_mobile.css?' + r, // Default matching Rails production
      fontUrl                       : p + 'fonts.googleapis.com/css?family=Caudex|Overlock|Patrick+Hand|Jockey+One|Sarina|Niconne|Fredericka+the+Great|Corben|Kelly+Slab|Marck+Script|Mr+De+Haviland|Lobster|Anton|Josefin+Slab|EB+Garamond|Basic|Chelsea+Market|Enriqueta|Forum|Jura|Noticia+Text|Open+Sans|Play|Signika|Spinnaker:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800',

      trackUrl                      : '',
      requestUrl                    : '', // Only filled when ActiveEngage is opened in IFrame
      imageUrl                      : '', // Leave empty for no image
      profileUrl                    : '', // Leave empty for no profile link
      identifyClientUrl             : '',
      poweredByUrl                  : '', // Leave empty for no powered by
      promotionalLinkUrl            : '', // Leave empty for no promotional link

      new_client_portal_window      : false, // Url for the new client portal (change to true in actions.js according to the action url)

      rtl                           : false, // true to have rtl on

      engageButtonText              : '', // Text on the label
      activeEngageTitle             : '', // ActiveEngage title
      activeEngageText              : '', // ActiveEngage text

      activeEngageAction            : '', // ActiveEngage main call-to-action (schedule, contact, call, pay, document, none)
      activeEngageActionOptions     : '', // ActiveEngage main call-to-action options string (e.g. for call action "number=12345678")
      activeEngageActionText        : '', // ActiveEngage main call-to-action text
      activeEngageActionUrl         : '', // ActiveEngage main url for external url configuration
      activeEngageActionLightbox    : '', // ActiveEngage main url for external url configuration
      activeEngageActionTarget      : '', // ActiveEngage main url for external url configuration

      mobileQuickAction             : 'call', // Quick action to show only on mobile
      mobileQuickActionIcon         : '', // Override icon for the mobile quick action
      mobileQuickActionOptions      : '', // Override options for the mobile quick action

      defaultContactTitle           : '', // Default title for the contact action

      textMyAccount                 : '', // My Account translation
      textWelcome                   : '', // Welcome notification translation
      textUnread                    : '', // Unread messages notification translation
      textHello                     : '', // No unread messages notification translation
      textPoweredBy                 : '', // Powered By translation
      textPromotionalLink           : '', // Promotional link translation
      textMore                      : '', // More translation

      actions                       : [], // List of actions, each action is a hash as follows
      // { name: '', action: '', options: '', text: '', icon: ''}
      // name     - the name of the action, should be a valid css class name, no spaces allowed
      // action   - can be one of schedule, contact, call, pay, document or can omitted for custom action
      // options  - semi-colon separated options, can be omitted (e.g. option1:value;option2:value)
      // text     - action caption
      // icon     - icon to show for the action
      // url      - action url for custom actions
      // target   - anchor target for custom actions
      // lightbox - true/false

      theme                         : true, // Whether the render configured theme css
      themeVariant                   : null, // Widget theme variant: null (classic/default), 'classic', or 'modern'
      themeFontFamily               : '',   // Theme font-family
      themeFontSize                 : null, // Theme font-size, used for main text, everything else is adjusted relatively
      themeBackground               : '',   // ActiveEngage background color
      themeText                     : '',   // ActiveEngage text color
      themeLink                     : '',   // ActiveEngage link color
      themeMainActionColor          : '',   // ActiveEngage main call-to-action button color
      themeMainActionHover          : '',   // ActiveEngage main call-to-action button hover color
      themeMainActionText           : '',   // ActiveEngage main call-to-action text color
      themeActionColor              : '',   // ActiveEngage label and Action menu items color
      themeActionHover              : '',   // ActiveEngage label and Action menu items hover color
      themeActionText               : '',   // ActiveEngage label and Action menu items text color

      ui                            : true, // Whether to show the UI
      actionButtons                 : true, // Whether to show the action menu on the top right
      inlineActions                 : true, // Whether to show actions menu inside the active engage
      collapsedActions              : true, // Whether to show collapsed actions menu side by side to the main ActiveEngage action
      myAccountAction               : true, // Whether to show the my account action (the person icon)

      cookie                        : true,           // Whether to remember state in cookie
      cookieName                    : 'livesite',     // Cookie name prefix
      cookieLifetime                : 30 * 60 * 1000, // How long to remember state in cookie
      reset                         : false,          // Whether to reset the state on load
      engageState                   : '',             // 'opened' for ActiveEngage opened

      identifyClient                : true,   // Recognize and welcome returning clients
      activeEngage                  : true,   // Whether to show the ActiveEngage
      engageButton                  : true,   // Whether to show the engage button

      // AI Chat Experience Configuration
      aiChatEnabled                 : true,   // Enable chat-first experience for modern widget (default: true)
      aiWelcomeMessage              : '',     // AI agent's welcome message (loaded from server/CDN, fallback to default)
      aiAgentName                   : '',     // Name of the AI agent (optional, for personalization)
      aiQuickRepliesMax             : 4,      // Maximum number of quick reply chips to show (default: 4)
      aiSyncActionButtons           : true,   // Sync action button clicks with chat messages for consistency
      desktopEnabled                : true,   // Whether to enable the widget on mobile
      desktopEngageAfter            : 5*1000, // Engage after in milliseconds, -1 to prevent from auto engaging
      mobileEnabled                 : true,   // Whether to enable the widget on desktop
      mobileEngageAfter             : 5*1000, // Engage after in milliseconds, -1 to prevent from auto engaging

      waitForDomReady               : false,  // Should LiveSite rendering wait until rest of document ready to prevent lag caused by its loading
      branding                      : null,   // branding_id to pass to actions
      overrideTheme                 : null,   // theme_id to override, can be used only with remote config
      preview                       : false,  // TODO: Remove or change, on preview the AE just appears when open with no animation, and we used lightbox=false for the add_to_website preview
      lightbox                      : true,   // Whether to open action in lightbox (or a popup)
      track                         : true,   // Whether to track analytics for the pivot
      source                        : window.location.href,   // Source for all actions, unless overridden

      log                           : false, // Default to false (production mode), can be overridden via LiveSite.init()
      mode                          : null,   // null, 'mobile', 'mobile-portrait', 'mobile-landscape' or 'desktop'
      adjustZoomInterval            : 2000,   // Interval to adjust the zoom on mobile, milliseconds
      openerFunc                    : null,   // function(href) to open actions

      httpsSafe: function(url) {
        if (!liveSite.lodash.isEmpty(url) && (config.protocol == 'https://')) {
          return url.replace(new RegExp('^http://'), 'https://');
        } else {
          return url;
        }
      },

      adjustHttps: function() {
        config.trackUrl           = config.httpsSafe(config.trackUrl);
        config.identifyClientUrl  = config.httpsSafe(config.identifyClientUrl);
        config.profileUrl         = config.httpsSafe(config.profileUrl);
        config.poweredByUrl       = config.httpsSafe(config.poweredByUrl);
        config.promotionalLinkUrl = config.httpsSafe(config.promotionalLinkUrl);
      },

      hostWithProtocol: function() {
        return config.protocol + config.host;
      },
      portalWithProtocol: function() {
        return config.protocol + config.portalHost;
      },

      deviceEnabled: function() {
        if (liveSite.fn.isMobile()) {
          return config.mobileEnabled;
        } else {
          return config.desktopEnabled;
        }
      },

      deviceEngageAfter: function() {
        if (liveSite.fn.isMobile()) {
          return config.mobileEngageAfter;
        } else {
          return config.desktopEngageAfter;
        }
      }
    };

  console.log('should replace with default config?')
  console.log('config.uid', config.uid) 
   
  if (liveSite.config){
    console.log('liveSite.config.uid', liveSite.config.uid)
  }

  liveSite.options = options;
  liveSite.config = config;

} (window.LiveSite, window));
