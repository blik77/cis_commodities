Polymer({
    is: 'jet-app', __version: '2.0.60',

    properties: {
      /**
       * `logLevel` specifies whether to use 'trace' or 'debug' or 'info' or 'warn' or 'error' log level
       *
       * @property logLevel
       * @type string
       * @default info
       */
      logLevel: {
        type: String,
        value: 'info'
      },

      /**
       * `appid` the id for the App to use with the container.
       *
       * @property appid
       * @type string
       * @default
       */
      appid: {
        type: String,
        value: ''
      },

      /**
       * `apptitle` default display title of the App
       *
       * @property apptitle
       * @type string
       * @default
       */
      apptitle: {
        type: String,
        value: ''
      },

      /**
       * `commandline` flag to turn off/on the search command line in the container
       *
       * @property commandline
       * @type boolean
       * @default false
       */
      nocommandline: {
        type: Boolean,
        value: false
      },

      /**
       * `helpurl` url to help page
       *
       * @property helpurl
       * @type string
       * @default
       */
      helpurl: {
        type: String,
        value: ''
      },

      /**
       * `nolink` flag to turn off support for contextual linking features
       *
       * @property nolink
       * @type boolean
       * @default false
       */
      nolink: {
        type: Boolean,
        value: false
      }
    },
    _initProfileConfig: function () {
      var inEikon = false;
      try {
        inEikon = window.navigator.userAgent.indexOf('EikonViewer') > -1 || (top.location.pathname.indexOf('/web/') === 0 && top.location.hostname.indexOf('.cp.') > -1);
      }
      catch (ex) {
        inEikon = (window.location.pathname.indexOf('/web/') === 0 && window.location.hostname.indexOf('.cp.') > -1);
      }

      if (inEikon) {

        var read = function (callback, setting) {
          JET.Settings.read(callback, {
            providerName: 'Configuration',
            settingName: setting
          });
        };

        var handlers = [];

        var el = document.createElement('jet-plugin-settings');
        Polymer.dom(this).appendChild(el);

        // theme attribute
        if (!document.body.theme) {
          handlers.push([read.bind(this), function (value) {
            // check if theme wasn't changed while we were waiting for the request to happen;
            // getAttribute instead of .theme to speed it up
            if (!document.body.getAttribute('theme')) {
              document.body.setAttribute('theme', value.toLowerCase());
            }
          }, 'RDE_USER_CURRENT_THEME']);
        }

        // lang attribute
        if (!document.body.locale) {
          handlers.push([read.bind(this), function (value) {
            if (!document.body.getAttribute('locale')) {
              document.body.setAttribute('locale', value);
            }
          }, 'USERDETAILS.PREFERREDLANGUAGE']);
        }

        // tickcolor attribute for instrument movement colors
        if (!document.body.tickcolor) {
          handlers.push([read.bind(this), function (value) {
            if (!document.body.getAttribute('tickcolor')) {
              document.body.setAttribute('tickcolor', value.toLowerCase());
            }
          }, 'RDE_USER_CURRENT_TICK_COLOR']);
        }

        if (handlers.length > 0) {
          JET.onLoad(function () {
            for (var i = 0; i < handlers.length; i++) {
              handlers[i][0](handlers[i][1] || null, handlers[i][2] || null);
            }
          }, ['Settings']);
        }
      }
      else {
        if (!document.body.theme) {
          document.body.setAttribute('theme', 'charcoal');
        }
        if (!document.body.locale) {
          document.body.setAttribute('locale', 'en-US');
        }
        if (!document.body.tickcolor) {
          document.body.setAttribute('tickcolor', 'american');
        }
      }

    },

    ready: function () {
      var context = this;

      var loadDependencies = function () {

        // set up plugin handler
        JET.onPluginLoaded(function (e) {
          context.fire('jet-plugin-' + e.toLowerCase() + '-loaded', e); // convert plugin name to lower case
        });

        waitUntilPluginsLoaded([], onPluginsLoaded);
      };

      var waitUntilPluginsLoaded = function (plugins, handler) {
        if ((window.JET) && (JET.Plugins.loaded(plugins)) && !JET.Plugins.inflight(true)) {
          handler(plugins);
        }
        else {
          window.setTimeout(function () {
            waitUntilPluginsLoaded(plugins, handler);
          }, 20);
        }
      };

      var onPluginsLoaded = function (plugins) {

        // Setup events
        JET.onLoad(function (e) {
          context.fire('jet-load', e);
        });

        // support for this kind of functionality will be limited not sure
        JET.onUnload(function (e) {
          context.fire('jet-unload', e);
        });

        var containerEvents = [
          'onContextChange',
          'onSendObject',
          'onPropertyChange',
          'onCommand',
          'onDragEnter',
          'onDragOver',
          'onDragLeave',
          'onDrop',
          'onPaste',
          'onActivate',
          'onDeactivate'
        ];

        containerEvents.forEach(function (containerEvent) {
          JET[containerEvent](function (e) {
            var eventName = 'jet-' + containerEvent.substr(2).toLowerCase();
            context.fire(eventName, e.data ? e.data : e);
          });
        });

        // transform jet-app tag properties into config object
        var configFromContext = function () {
          return {
            ID: context.appid,
            Title: context.apptitle,
            required: context.plugins,
            HelpURL: context.helpurl,
            LogLevel: context.logLevel
          };
        };

        // Initialize JET
        var initObj = window.JETConfig || configFromContext();

        // manually set title...
        if (initObj.Title) {
          document.title = initObj.Title;
        }

        if (!context.nocommandline) {
          initObj.commandline = true;
        }
        if (context.nolink) {
          initObj.NavigationSupport = '128';
        }
        JET.init(initObj);
      };

      loadDependencies();

      this._initProfileConfig();
    }
  });