// EikonNow client library.
// Usage guide: https://thehub.thomsonreuters.com/docs/DOC-771948
/* jshint strict: true */

(function (window) {
    'use strict';
    var version = "1.3.3";
    // default options, can be changed with corresponding methods or with EikonNow.init();
    var defaultConfig = {
        trace: false,       // tracing output is disabled
        log: true,          // other logging is enabled
        ccf: true,          // ccf simulation is enabled
        markerFrameName: 'EikonNowMarker', // name of frame that sits inside of EikonNow frame. Parent of this frame considered as Eikon Now core container
        ignoreSecondInit: false, // throw exception if EikonNow.init was called second time in same window. 'true' means silent ignore
        defaultContextMenu: false   // prevent to show default context menu
    };

    var config,
        proxy,
        originId,
        listeners = {},
        plugins = {},
        util,
        ccf,
    // jet, not implemented
        oldRegisterWithCCFContainer,
        hasFocus = true,
        readyHandlers = [];

    // Helper functions block
    function extend(dst) {
        var key, src, i;
        if (dst)
            for (i = 0; i < arguments.length; i++) {
                src = arguments[i];
                if (src !== dst && src)
                    for (key in src) // jshint ignore:line
                        dst[key] = src[key];
            }
        return dst;
    }

    // logging functions
    function log(func, args, stack) {
        var a = [],
            i;
        for (i = 0; i < args.length; i++)
            a.push(args[i]);
        if (stack && config.trace)
            try {
                var traceLine = Error().stack.split("\n")[4];
                a.push(traceLine);
            } catch (e) {}
        func.apply(console, a); // jshint ignore:line
    }

    function info() {
        if (!config.log)
            return;
        log(console.log, arguments, true); // jshint ignore:line
    }

    function trace() {
        if (!config.trace)
            return;
        log(console.log, arguments, true); // jshint ignore:line
    }

    function warn() {
        log(console.warn, arguments, true); // jshint ignore:line
    }

    function error() {
        log(console.error, arguments); // jshint ignore:line
    }

    function getParent(w) {
        // undefined != null on IE. window.undefined !== window.opener.undefined
        if (w.opener)
            return w.opener;
        if (w.parent && w !== w.parent) // jshint ignore:line
            return w.parent;
        return null;
    }

    function checkForEikonDesktop(w) {
        try {
            return w.registerWithJET || w.registerWithAsyncCCFContainer;
        } catch (e) {}
        return false;
    }

    function findEikonNow() {
        var next = window;
        // undefined != null on IE. window.undefined !== window.opener.undefined
        while (next) { // jshint ignore:line
            if (checkForEikonDesktop(next))
                return 'desktop';
            try {
                return next.frames[config.markerFrameName].parent; // jshint ignore:line
            } catch (e) {}
            next = getParent(next);
        }
        return null;
    }

    function init(userConfig) {
        if (config) {
            if (!config.ignoreSecondInit || (userConfig && userConfig.ignoreSecondInit))
                throw "EikonNow.init() called second time. Fix your code or use ignoreSecondInit:true option";
            return;
        }

        config = extend({}, defaultConfig, userConfig); // logging will not work before this point !!!!!!!!!!!!!!
        originId = new Date().getTime() + "-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        trace("EikonNow originId: " + originId);
        proxy = findEikonNow();
        if (proxy === 'desktop') {
            info("EikonNow detected Eikon Desktop");
            return;
        }
        if (!proxy) {
            info("EikonNow core was not found");
            return;
        }

        info("EikonNow core was found. Initializing EikonNow core");
        ccf = new CcfStub(); // ccf var is used at UtilStub.onMessage.plugins
        util = new UtilStub();

        // setupCcf/setupJet register registerWithJet/registerWithCcf functions
        // register functions, once called create corresponding stubs
        // if register function was not called stub will not be created
        setupCcf();
        // setupJet(); not implemented
    }

    function registerListener(listener, id) {
        listener.$$id = originId + "-" + id;
        listeners[listener.$$id] = listener;
        return listener.$$id;
    }

    function send(method, data, listener) {
        if (!listener.$$id)
            error('EikonNow listener is unknown', listener);
        proxy.postMessage({
            originId: listener.$$id,
            method: method,
            data: data
        }, '*');
    }

    // application main window message listener.
    function receive(event) {
        var listener, e = event.data, o = event.origin.split('.').slice(-2);
        if (event.source !== proxy || !e || !e.targetId || typeof e.targetId !== 'string') {
            return; // ignore problematic and suspicious messages
        }
        // allow only "reutest.com", "thomsonreuters.com", "localhost:10300" && mpls sites
        if (((o[1]!='com' && o[1]!='biz') || (o[0]!='thomsonreuters' && o[0]!='reutest'))
            && !/^https?:\/\/localhost:?\d*$/.test(event.origin)) {
            warn("Ignored suspicious message", event);
            return;
        }
        listener = listeners[e.targetId];
        if (listener)
            listener.onMessage(e);
        else
            warn("Ignored message from unregistered listener", event);
    }

    function isEnabled() {
        return !!ccf;
    }

    function getVersion() {
        return version;
    }

    function getPlugins() {
        return plugins;
    }

    function ready( callback ) {
        if( callback && typeof(callback) === 'function' ) {
            if( readyHandlers )
                readyHandlers.push( callback );
            else {
                callback(config.rdata);
            }
        }
    }

    function cpurl( url ) {
        if( ! isEnabled() )
            return url;
        if( ! config.rdata )
            throw( new Error("EikonNow has not been initialized yet") );

        if( ! url || typeof(url) !== 'string' ) return url;
        if( ! config.rdata.sap ) return url;

        var m = /^(cpurl):\/\/(\w+[\w.-]*)\/?(.*)$/.exec( url)
        if( m && m.length > 2 ) {
            var sap = config.rdata.sap[m[2]];
            if( sap )
                return window.location.protocol + "//" + sap + "/" + (m[3] || '');
        }

        return url;
    }

    function convertToCpurl( url ) {
        if( ! isEnabled() )
            return url;
        if( ! config.rdata )
            throw( new Error("EikonNow has not been initialized yet") );

        if( ! url || typeof(url) !== 'string' ) return url;
        if( ! config.rdata.sap ) return url;

        var m = /^(https):\/\/(\w+[\w.-]*)\/?(.*)$/.exec(url);
        if( m && m.length > 2 ) {
            var sap = config.rdata.sap;
            var key, k;
            for ( k in sap ) {
                if( sap[k] === m[2] ){
                    key = k;
                    break;
                }
            }
            if( key )
                return "cpurl://" + key + "/" + (m[3] || '');
        }

        return url;
    }

    // Util postMessage() listener for doing internal stuff.
    var UtilStub = function () {
        registerListener(this, 'util');
        window.addEventListener("message", receive, false);
        window.addEventListener("unload", this.onUnload, false);
        window.addEventListener("load", this.onLoad, false);
        window.addEventListener("click", this.onClick, false);
        window.addEventListener("scroll", this.onScroll, false);
        send("init", {
            href: window.location.href,
            timeStamp: new Date().getTime()
        }, this);
    };
    UtilStub.prototype.onMessage = function (e) {
        if (e.method=="plugins") {
            var d = e.data;
            for(var p in d) { // jshint ignore:line
                if (plugins[p]) {
                    warn("plugin " + p + " is already installed");
                    continue;
                }
                trace('registering plugin ' + p);
                this.stub = { config: config, util: util, ccf: ccf, send: send, info: info, warn: warn, trace:trace, error: error };
                plugins[p] = "//" + p + "\n" + "(" + d[p] + ")(this.stub);";
                eval(plugins[p],this);
            }
        } else if(e.method=="ready" && readyHandlers ) {
            config.rdata = e.data;
            readyHandlers.forEach( function( callback ) {
                try {
                    callback(config.rdata);
                } catch(exception) {
                    error(exception);
                }
            });
            readyHandlers = null;
        } else
            warn("EikonNowListener UtilStub received unsupported message", e);
    };
    UtilStub.prototype.onUnload = function (data) {
        send("unload", {
            timeStamp: data.timeStamp
        }, util); // 'this' is window here
    };
    UtilStub.prototype.onLoad = function (data) {
        send("load", {
            timeStamp: data.timeStamp
        }, util);
    };
    UtilStub.prototype.onClick = function (data) {
        send("click", {
            x: data.x,
            y: data.y,
            layerX: data.layerX,
            layerY: data.layerY,
            screenX: data.screenX,
            screenY: data.screenY,
            target: data.target ? {
                className: data.target.className,
                innerText: data.target.innerText,
                localName: data.target.localName
            } : null,
            timeStamp: data.timeStamp
        }, util);
    };
    UtilStub.prototype.onScroll = function (data) {
        send("scroll", {
            offset: {
                x: window.pageXOffset || document.documentElement.clientTop,
                y: window.pageYOffset || document.documentElement.clientLeft
            },
            timeStamp: data.timeStamp
        }, util);
    };
    UtilStub.prototype.cancelEvent = function(event) {
        if (event.stopPropagation)
            event.stopPropagation();
        else
            event.cancelBubble = true;
        if (event.preventDefault)
            event.preventDefault();
        if(event.returnValue)
            event.returnValue = false;
    };

    // CCF postMessage() listener
    var setupCcf = function () {
        if (window.setupCCFRegisterFunction)
            window.setupCCFRegisterFunction();
        if (window.registerWithCCFContainer)
            oldRegisterWithCCFContainer = window.registerWithCCFContainer;

        window.registerWithCCFContainer = registerWithCCFContainerFunc;
    };

    var registerWithCCFContainerFunc = function (ccfInterface, xmlSession) {
        trace("registerWithCCFContainer called with ", ccfInterface, xmlSession);
        return ccf.registerWithCCFContainer(ccfInterface, xmlSession);
    };

    var CcfStub = function () {
        registerListener(this, 'ccf');
        this.clientData = {};
        this.ccfInterface = null;
    };

    CcfStub.prototype.registerWithCCFContainer = function (ccfInterface, xmlSession) {
        if (this.ccfInterface) {
            error("EikonNowStubContainer: called second time. This approach is not correct");
            return null;
        }

        if (oldRegisterWithCCFContainer) {
            try {
                this.oldContainer = oldRegisterWithCCFContainer(ccfInterface, xmlSession);
            } catch (e) {
                error(e);
                this.oldContainer = undefined;
            }
        }

        this.ccfInterface = ccfInterface;

        return this;
    };

    // listener interface method, received message from core
    CcfStub.prototype.onMessage = function (event) {
        if (event.method === 'setData' && event.data) {
            this.clientData[event.data.name] = event.data.data;
            return true;
        }
        if (event.method === 'unsupported' && this.oldContainer) {
            // that will fire only on maelstrom CCF. Can we optimize this?
            return this.oldContainer.processEvent(event.data, this.ccfInterface);
        }
        if (event.method === 'processEvent' && this.ccfInterface) {
            return this.ccfInterface.processEvent(event.data);
        }
        warn('CcfStub.onMessage: Unrecognized message ', event);
        return false;
    };

    CcfStub.prototype.processEvent = function (event, listener) {
        trace('CcfStub.processEvent: ', event);
        send("processEvent", event, this);
        return true;
    };

    CcfStub.prototype.getData = function (data) {
        trace('CcfStub.getData', data);
        switch (data.name) {
            case "isActive":
                return true;
            case "hasFocus":
                return hasFocus;
            case "persistdata":
            case "getPasteData":
            case "UserInfo":
            case "ActiveSymbol":
            case "ClipboardData":
                var r = this.clientData[data.name];
                return r ? r : "";
            case "search":
            case "getDropData":
            case "resetDragDrop":
            case "windowDragEnter":
            case "windowDragLeave":
            case "cancelDragDrop":
                return null;
            case "description":
                var r = this.clientData[data.name];
                return r ? r : '<Description name="EikonNowContainer" version="1.0.0" containerVersion="0.0.1"> <WindowInfo windowId="EikonNowContentFrame"> </WindowInfo> </Description>';
        }
        return null;
    };

    // JET Stub
    //var setupJet = function () {
    //    window.registerWithJET = registerWithCCFContainerFunc;
    //};

    //var JetStub = function () {};

    window.EikonNow = {
        init: init,
        isEnabled: isEnabled,
        originId: originId,
        version: getVersion,
        plugins: getPlugins,
        ready: ready,
        cpurl: cpurl,
        convertToCpurl: convertToCpurl
    };

})(window); // jshint ignore:line