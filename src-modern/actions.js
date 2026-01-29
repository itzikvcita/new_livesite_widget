
//these files are cached so if you deploy some changes and wonder why they aren't taking affect you probably have a cache you need to invalidate

// Dependencies: core, config, opener

(function (liveSite, window) {

  var _              = liveSite.lodash,
      config         = liveSite.config,
      fn             = liveSite.fn,
      DEFAULT_ORIGIN = 'livesite_sdk';
  
  liveSite.extend({

    action: function (action, options) {

      config.new_client_portal_window = false;
      if (['schedule', 'contact', 'call', 'pay', 'document', 'myaccount', 'main', 'login', 'btCheckout'].indexOf(action) !== -1) {
        liveSite[action](options);
      } else {
        liveSite.log("Unknown action " + action);
      }
    },

    actionUrl: function (action, options) {
      if (['schedule', 'contact', 'pay', 'document', 'myaccount', 'login', 'btCheckout'].indexOf(action) !== -1) {
        liveSite[action+'Url'](options);
      } else {
        liveSite.log("Unknown action " + action);
      }
    },

    scheduleUrl: function (options) {
      if (_.isUndefined(options)) {
        options = {};
      }
      var uid       = options.uid || config.uid,
          branding  = options.branding || config.branding,
          source    = options.source || config.source,
          channel   = options.channel,
          campaign  = options.campaign,
          origin    = options.origin || DEFAULT_ORIGIN,
          params    = [
            ['select_date', options.date],
            ['euid', options.euid],
            ['service_id', options.service],
            ['category_id', options.category],
            ['service_name', options.service_name],
            ['event_id', options.event],
            ['staff_id', options.staff],
            ['email', options.email],
            ['first_name', options.first_name],
            ['last_name', options.last_name],
            ['phone', options.phone],
            ['title', options.title],
            ['agenda', options.agenda],
            ['scheduling_order', options.order],
            ['client_package_uid', options.client_package_uid]];
      var portalOptions = {
          path: 'schedule',
          uid: uid,
          branding: branding,
          source: source,
          channel: channel,
          campaign: campaign,
          o: fn.encodeBase64(origin),
          s: source,
          vtm_ch: fn.encodeBase64(channel),
          vtm_cp: campaign,
          origin: origin,
          utm_params: options.utm_params,
          no_header: options.no_header,
          user_id: options.user_id,
          custom_param_1: options.custom_param_1,
          custom_param_2: options.custom_param_2,
          custom_param_3: options.custom_param_3,
          custom_param_4: options.custom_param_4,
          custom_param_5: options.custom_param_5,
      }
      var url = this.myPortalUrl(portalOptions);
      url = fn.addParams(url, params);
      url = config.httpsSafe(url);

      return url;
    },
    packageUrl: function (options) {
      if (_.isUndefined(options)) {
          options = {};
      }
      var uid       = options.uid || config.uid,
          branding  = options.branding || config.branding,
          source    = options.source || config.source,
          channel   = options.channel,
          campaign  = options.campaign,
          origin    = options.origin || DEFAULT_ORIGIN,
          params    = [
              ['select_date', options.date],
              ['euid', options.euid],
              ['service_id', options.service],
              ['category_id', options.category],
              ['package_id', options.package],
              ['service_name', options.service_name],
              ['event_id', options.event],
              ['staff_id', options.staff],
              ['email', options.email],
              ['first_name', options.first_name],
              ['last_name', options.last_name],
              ['phone', options.phone],
              ['title', options.title],
              ['agenda', options.agenda],
              ['scheduling_order', options.order]];
      var portalOptions = {
          path: 'package',
          uid: uid,
          branding: branding,
          source: source,
          channel: channel,
          campaign: campaign,
          o: fn.encodeBase64(origin),
          s: source,
          vtm_ch: fn.encodeBase64(channel),
          vtm_cp: campaign,
          origin: origin,
          utm_params: options.utm_params,
          user_id: options.user_id,
          custom_param_1: options.custom_param_1,
          custom_param_2: options.custom_param_2,
          custom_param_3: options.custom_param_3,
          custom_param_4: options.custom_param_4,
          custom_param_5: options.custom_param_5,
      }
      
      var url = this.myPortalUrl(portalOptions);
      url = fn.addParams(url, params);
      url = config.httpsSafe(url);

      return url;
  },
  checkoutUrl: function (options) {
      if (_.isUndefined(options)) {
          options = {};
      }
      var uid       = options.uid || config.uid,
          branding  = options.branding || config.branding,
          source    = options.source || config.source,
          channel   = options.channel,
          campaign  = options.campaign,
          origin    = options.origin || DEFAULT_ORIGIN,
          params    = [
              ['open_checkout', 'true'],
              ['ps_id', options.ps_id]
          ];
      var portalOptions = {
          path: 'payments',
          uid: uid,
          branding: branding,
          source: source,
          channel: channel,
          campaign: campaign,
          o: fn.encodeBase64(origin),
          s: source,
          vtm_ch: fn.encodeBase64(channel),
          vtm_cp: campaign,
          origin: origin,
          utm_params: options.utm_params,
          user_id: options.user_id,
          custom_param_1: options.custom_param_1,
          custom_param_2: options.custom_param_2,
          custom_param_3: options.custom_param_3,
          custom_param_4: options.custom_param_4,
          custom_param_5: options.custom_param_5,
      }

      var url = this.myPortalUrl(portalOptions);
      url = fn.addParams(url, params);
      url = config.httpsSafe(url);

      return url;
  },

    /**
     * Schedule an appointment
     * @param {hash} options - scheduling call options (optional)
     *  {string} uid          : override the account uid for the specific action

     *  {string} date         : preselect date to show the scheduling on (mmddyy or mmddyyyy)
     *  {string} service      : preselect a service by the uid
     *  {string} service_name : show only services matching the name (only if service not provided)
     *  {string} event        : preselect an event by the uid
     *  {string} staff        : preselect a staff by the uid
     *  {string} order        : whether the client will choose service first or staff first - 'services_first', 'staff_first'

     *  {string} email        : pre-fill email for the appointment
     *  {string} first_name   : pre-fill first_name for the appointment
     *  {string} last_name    : pre-fill last_name for the appointment
     *  {string} phone        : pre-fill phone for the appointment
     *  {string} title        : pre-fill title for the appointment
     *  {string} agenda       : pre-fill agenda for the appointment
     *
     *  SHOW? {string} redirect     : redirect action once scheduling is done - 'close', 'livesite',
     *                          a url or empty for default behaviour
     *  {string} branding     : branding theme id to use for the action
     *  {string} source       : action source
     *  {string} origin       : action origin
     *
     *  FUTURE {string} staff_name   : preselect staff who's name matches the filter
     */
    schedule: function (options) {

      var url = liveSite.scheduleUrl(options);

      liveSite.log("schedule - " + url);

      liveSite.opener(url);
    },

    contactUrl: function (options) {

      if (_.isUndefined(options)) {
        options = {};
      }
      var uid       = options.uid || config.uid,
          branding  = options.branding || config.branding,
          source    = options.source || config.source,
          channel   = options.channel,
          campaign  = options.campaign,
          origin    = options.origin || DEFAULT_ORIGIN,
          title     = options.title || config.defaultContactTitle,
          params    = [
            ['email', options.email],
            ['first_name', options.first_name],
            ['last_name', options.last_name],
            ['phone', options.phone],
            ['title', title],
            ['message', options.message]];
        var portalOptions = {
            path: 'contact',
            uid: uid,
            branding: branding,
            source: source,
            channel: channel,
            campaign: campaign,
            o: fn.encodeBase64(origin),
            s: source,
            vtm_ch: fn.encodeBase64(channel),
            vtm_cp: campaign,
            origin: origin,
            utm_params: options.utm_params,
            user_id: options.user_id,
            custom_param_1: options.custom_param_1,
            custom_param_2: options.custom_param_2,
            custom_param_3: options.custom_param_3,
            custom_param_4: options.custom_param_4,
            custom_param_5: options.custom_param_5,
        }
        var url = this.myPortalUrl(portalOptions);
        url = fn.addParams(url, params);
        url = config.httpsSafe(url);

      return url;
    },

    /**
     * Contact request
     * @param {hash} options - contact request options (optional)
     *  {string} uid          : override the account uid for the specific action

     *  {string} email        : pre-fill email for the contact request
     *  {string} first_name   : pre-fill first_name for the contact request
     *  {string} last_name    : pre-fill last_name for the contact request
     *  {string} phone        : pre-fill phone for the contact request
     *  {string} title        : pre-fill title for the contact request
     *  {string} message      : pre-fill message for the contact request
     *
     *  {string} redirect     : redirect action once request is sent - 'close', 'livesite',
     *                          a url or empty for default behaviour
     *  {string} theme        : theme id to use for the action
     *  {string} source       : action source
     *  {string} origin       : action origin
     *
     *  FUTURE {string} staff        : preselect a staff by the uid
     *  FUTURE {string} staff_name   : preselect staff who's name matches the filter
     */
    contact: function (options) {
      var url = liveSite.contactUrl(options);

      liveSite.log("contact - " + url);

      liveSite.opener(url);
    },

    payUrl: function (options) {
      if (_.isUndefined(options)) {
        options = {};
      }
      var uid       = options.uid || config.uid,
          branding  = options.branding || config.branding,
          source    = options.source || config.source,
          channel   = options.channel,
          campaign  = options.campaign,
          origin    = options.origin || DEFAULT_ORIGIN,
          params    = [
            ['amount', options.amount],
            ['currency', options.currency],
            ['pay_for', (options.title || options.pay_for)],
            ['email', options.email],
            ['first_name', options.first_name],
            ['last_name', options.last_name],
            ['phone', options.phone],
            ['checkoutId', options.checkoutId],
            ['transactionId', options.transactionId],
            ['provider', options.provider],
            ['title', options.header]

          ];

      var portalOptions = {
        path: 'pay',
        uid: uid,
        branding: branding,
        source: source,
        channel: channel,
        campaign: campaign,
        o: fn.encodeBase64(origin),
        s: source,
        vtm_ch: fn.encodeBase64(channel),
        vtm_cp: campaign,
        origin: origin,
        utm_params: options.utm_params,
        user_id: options.user_id,
        custom_param_1: options.custom_param_1,
        custom_param_2: options.custom_param_2,
        custom_param_3: options.custom_param_3,
        custom_param_4: options.custom_param_4,
        custom_param_5: options.custom_param_5,
      }
      var url = this.myPortalUrl(portalOptions);
      url = fn.addParams(url, params);
      url = config.httpsSafe(url);

      return url;
    },

    /**
     * Pay
     * amount - the amount
     * title - pay for
     * @param options
     */
    pay: function (options) {
      var url = liveSite.payUrl(options);

      liveSite.log("payment - " + url);

      liveSite.opener(url);
    },

    btCheckoutUrl: function (options) {
      if (_.isUndefined(options)) {
        options = {};
      }

      var uid       = options.uid || config.uid,
          branding  = options.branding || config.branding,
          source    = options.source || config.source,
          url       = config.hostWithProtocol() + "/v/" + uid + "/home#/payment/checkout",
          origin    = options.origin || DEFAULT_ORIGIN,
          params    = [['branding_id', branding],
            ['s', source],
            ['amount', options.amount],
            ['paymentType', options.paymentType],
            ['paymentUid', options.paymentUid],
            ['o', fn.encodeBase64(origin)]];

      url = fn.addParams(url, params);
      url = config.httpsSafe(url);

      return url;
    },

    /**
     * Pay
     * amount - the amount
     * title - pay for
     * @param options
     */
    btCheckout: function (options) {
      var url = liveSite.btCheckoutUrl(options);

      liveSite.log("payment - " + url);

      liveSite.opener(url);
    },

    documentUrl: function(options) {
      if (_.isUndefined(options)) {
        options = {};
      }
      var uid       = options.uid || config.uid,
          branding  = options.branding || config.branding,
          source    = options.source || config.source,
          channel   = options.channel,
          campaign  = options.campaign,
          origin    = options.origin || DEFAULT_ORIGIN,
          params    = [
            ['email', options.email],
            ['first_name', options.first_name],
            ['last_name', options.last_name],
            ['phone', options.phone]
          ];
      var portalOptions = {
            path: 'upload',
            uid: uid,
            branding: branding,
            source: source,
            channel: channel,
            campaign: campaign,
            o: fn.encodeBase64(origin),
            s: source,
            vtm_ch: fn.encodeBase64(channel),
            vtm_cp: campaign,
            origin: origin,
            utm_params: options.utm_params,
            user_id: options.user_id,
            custom_param_1: options.custom_param_1,
            custom_param_2: options.custom_param_2,
            custom_param_3: options.custom_param_3,
            custom_param_4: options.custom_param_4,
            custom_param_5: options.custom_param_5,
      }
      var url = this.myPortalUrl(portalOptions);
      url = fn.addParams(url, params);
      url = config.httpsSafe(url);

      return url;
    },

    /**
     * Send a document
     * @param options
     */
    document: function(options) {
      var url = liveSite.documentUrl(options);

      liveSite.log("document - " + url);

      liveSite.opener(url);
    },

    /**
     * Call a number
     * @param options
     */
    call: function(options) {
      if (_.isUndefined(options)) {
        options = {};
      }

      var origin    = options.origin || DEFAULT_ORIGIN,
          source    = options.source || config.source,
          o         = fn.encodeBase64(origin),
          number    = options.number; // TODO: add tracking data when tracking the call

      if (number) {
        liveSite.log("call - " + number);

        if (fn.isMobile()) {
          window.location.href = "tel:" + number;
        } else {
          window.location.href = "callto:" + number;
        }

      } else {
        liveSite.log("call - no number given");
      }
    },

    myPortalUrl: function(options) {
      if (_.isUndefined(options)) {
        options = {};
      }

      config.new_client_portal_window = true;

      var uid       = options.uid || config.uid,
          branding  = options.branding || config.branding,
          source    = options.source || config.source,
          channel   = options.channel,
          campaign  = options.campaign,
          o         = options.o,
          s         = options.s,
          vtm_ch    = options.vtm_ch,
          vtm_cp    = options.vtm_cp,
          url       = config.portalWithProtocol() + '/portal/' + uid + (branding ? ('?branding_id=' + branding): '' ) + '#/' + ( options.path || '' ) + '?',
          origin    = options.origin || DEFAULT_ORIGIN,
          user_id   = options.user_id,
          custom_param_1 = options.custom_param_1,
          custom_param_2 = options.custom_param_2,
          custom_param_3 = options.custom_param_3,
          custom_param_4 = options.custom_param_4,
          custom_param_5 = options.custom_param_5,
  
          utm_params = options.utm_params || [],
          params = [
            ['branding_id', branding],
            ['s', source],
            ['vtm_cp', vtm_cp || campaign],
            ['o', o || fn.encodeBase64(origin)],
            ['vtm_ch', vtm_ch || fn.encodeBase64(channel)],
            ['user_id', user_id],
            ['custom_param_1', custom_param_1],
            ['custom_param_2', custom_param_2],
            ['custom_param_3', custom_param_3],
            ['custom_param_4', custom_param_4],
            ['custom_param_5', custom_param_5],
          ];


      if (options.no_header){
        params.push(['isWidget', 'true'])
        params.push(['widget_type', 'calendar_widget'])
      }

      if (!_.isUndefined(window.client_jwt)){
        params.push(['client_jwt', window.client_jwt]);
      }

      url = fn.addParams(url, params);
      url = fn.addParams(url, utm_params);
      url = config.httpsSafe(url);

      return url;
    },

    myaccountUrl: function(options) {

      if (_.isUndefined(options)) {
        options = {};
      }

      var uid       = options.uid || config.uid,
          branding  = options.branding || config.branding,
          source    = options.source || config.source,
          channel   = options.channel,
          campaign  = options.campaign,
          url       = config.hostWithProtocol() + "/v/" + uid + "/home",
          origin    = options.origin || DEFAULT_ORIGIN,
          params    = [['branding_id', branding],
            ['s', source],
            ['vtm_cp', campaign],
            ['o', fn.encodeBase64(origin)],
            ['vtm_ch', fn.encodeBase64(channel)]];

      url = fn.addParams(url, params);
      url = config.httpsSafe(url);

      return url;
    },

    /**
     * Open liveSite MyAccount
     * @param options
     */
    myaccount: function(options) {
      var url = liveSite.myPortalUrl(options);
      liveSite.log("myaccount - " + url);

      liveSite.opener(url);
    },

    /**
     * Backward compatibility, maybe remove if we see that nobody uses
     * @param options
     */
    main: function(options) {
      liveSite.myaccount(options);
    },

    loginUrl: function(options) {
      if (_.isUndefined(options)) {
        options = {};
      }

      var uid      = options.uid || config.uid,
          branding = options.branding || config.branding,
          source   = options.source || config.source,
          origin   = options.origin || DEFAULT_ORIGIN,
          channel   = options.channel,
          campaign  = options.campaign,
          params   = [
            ['email', options.email]
          ];
      var portalOptions = {
        path: 'auth/login',
        uid: uid,
        branding: branding,
        source: source,
        channel: channel,
        campaign: campaign,
        o: fn.encodeBase64(origin),
        s: source,
        vtm_ch: fn.encodeBase64(channel),
        vtm_cp: campaign,
        origin: origin
      }
      var url = this.myPortalUrl(portalOptions);
      url = fn.addParams(url, params);
      url = config.httpsSafe(url);

      return url;
    },

    /**
     * Open liveSite login
     * @param options
     */
    login: function(options) {
      var url = liveSite.loginUrl(options);

      liveSite.log("login - " + url);

      liveSite.opener(url);
    }
  });

} (window.LiveSite, window));