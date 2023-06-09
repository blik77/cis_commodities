JET.extend(0, "QuickTips", function (util) {

    var QT_PUB_CHANNEL = "/desktop/quicktip";
    var QT_SUB_CHANNEL = "/desktop/quicktip/events";

    var api = {};
    var windowId = null;
    var onRequestCallback = null;

    JET.onLoad(function() {
        if (JET.ContainerDescription && 
            JET.ContainerDescription.windowInfo && 
            JET.ContainerDescription.windowInfo.windowId) {
            windowId = JET.ContainerDescription.windowInfo.windowId;
        }
        JET.subscribe(QT_SUB_CHANNEL, globalQTEventHandler);
    });

    function globalQTEventHandler(message) {
        message = JSON.parse(message);
        if (message.windowId == windowId) {
            switch (message.event) {
                case "QuickTipsMenuClicked":
                    if (onRequestCallback) {
                        onRequestCallback();
                    }
                    break;
            }
        }
    }

    function Session(tipId, windowId, util) {
        this._u = util;
        this._sessionId = this._u.guid();
        this._tipId = tipId;
        this._windowId = windowId;
    }

    Session.prototype._subHandler = null;
    Session.prototype._u = null;
    Session.prototype._sessionId = null;
    Session.prototype._tipId = null;
    Session.prototype._tipList = null;
    Session.prototype._windowId = null;
    Session.prototype._onStartedCallback = null;
    Session.prototype._onEndedCallback = null;
    Session.prototype._onClickedCallback = null;
    Session.prototype._onAfterStepCallback = null;
    Session.prototype._onErrorCallback = null;
    Session.prototype._started = false;
    Session.prototype._defaultProperties = {
        lineLength : 50.0,
        direction : "Bottom",
        showWithPriorStep : false,
        includeNextStep : false
    }

    Session.prototype._incomingMessage = function(message) {
        message = JSON.parse(message);
        if (message.sessionId == this._sessionId && message.windowId == this._windowId) {
            switch (message.event) {
                case "TipShown":
                    if (this._onAfterStepCallback) {
                        this._onAfterStepCallback(message.tip);
                    }
                    break;
                case "Clicked":
                    if (this._onClickedCallback) {
                        this._onClickedCallback(message.tip);
                    }
                    break;
                case "UserEnded":
                    if (this._onEndedCallback) {
                        this._onEndedCallback(this._tipList);
                    }
                    break;
                case "Error":
                    if (this._onErrorCallback) {
                        this._onErrorCallback(message.message);
                    }
                    break;
            }
        }
    };

    Session.prototype._findPosition = function(element, anchor) {
        if (element) {
            var b = element.getBoundingClientRect();
            var width = element.offsetWidth;
            var height = element.offsetHeight;
            switch (anchor) {
                case "Top":
                    return {x: b.left + (width/2), y: b.top};
                case "TopLeft":
                    return {x: b.left, y: b.top};
                case "TopRight":
                    return {x: b.right, y: b.top};
                case "Left":
                    return {x: b.left, y: b.top + (height/2)};
                case "Right":
                    return {x: b.right, y: b.top + (height/2)};
                case "Bottom":
                    return {x: b.left + (width/2), y: b.bottom};
                case "BottomLeft":
                    return {x: b.left, y: b.bottom};
                case "BottomRight":
                    return {x: b.right, y: b.bottom};
                case "Center":
                default:
                    return {x: b.left + (width/2), y: b.top + (height/2)};
            }
        } else {
            return {x:0, y:0};
        }
    }

    Session.prototype._markShown = function() {
        //Check local storage support
        if(typeof(Storage) !== "undefined") {
            var key = this.getStorageKey();
            localStorage[key] = "true";

            var globalKey = JET.QuickTips.getGlobalStorageKey();
            localStorage[globalKey] = "true";
        }
    }

    Session.prototype.clearShownStatus = function() {
        //Check local storage support
        if(typeof(Storage) !== "undefined") {
            var key = this.getStorageKey();
            localStorage.removeItem(key);
        }
    }

    Session.prototype.getStorageKey = function() {
        return "jet.quicktip.shown."+JET.ID+"."+this._tipId;
    }

    Session.prototype.hasShownBefore = function() {
        //Check local storage support
        if(typeof(Storage) !== "undefined") {
            var key = this.getStorageKey();
            var value = localStorage[key];
            return (value === "true");
        } else {
            //Return true because if something wrong with the local storage,
            //the tip shouldn't be showing all the time.
            return true; 
        }
    } 

    Session.prototype.tips = function(listOfTips) {
        if (this._u.isArray(listOfTips)) {
            this._tipList = listOfTips;
            return this;
        } else {
            throw "Tips data must be stored in an array";
        }
    }

    Session.prototype.onStarted = function(handler) {
        this._onStartedCallback = handler;
        return this;
    }

    Session.prototype.onEnded = function(handler) {
        this._onEndedCallback = handler;
        return this;
    }

    Session.prototype.onClicked = function(handler) {
        this._onClickedCallback = handler;
        return this;
    }

    Session.prototype.onAfterStep = function(handler) {
        this._onAfterStepCallback = handler;
        return this;
    }

    Session.prototype.onError = function(handler) {
        this._onErrorCallback = handler;
        return this;
    }	

    Session.prototype.start = function(playOnlyOnce) {
        if (playOnlyOnce && this.hasShownBefore()) {			
            return this;
        }
        if (this._windowId != null) {
            //Force showing Quick Tip Menu
            JET.QuickTips.tipsAvailable(true);

            //Create Subscription if needed
            if (this._subHandler === null) {
                this._subHandler = JET.subscribe(QT_SUB_CHANNEL, this._incomingMessage.bind(this));
            }
            //Publish start message
            if (this._tipList != null && this._tipList.length > 0) {
                //Transform before sending to container
                var clonedList = [];
                for (var i=0;i<this._tipList.length;i++) {
                    //Fill default values
                    clonedList[i] = this._u.mixin({}, this._defaultProperties, this._tipList[i]);
                    //Get Element Position
                    if (clonedList[i].element) {
                        var elementPos = this._findPosition(clonedList[i].element, clonedList[i].elementAnchor);
                        clonedList[i].x = elementPos.x;
                        clonedList[i].y = elementPos.y;
                        clonedList[i].element = undefined;
                        try {
                            delete clonedList[i].element;
                        } catch (ex) {}
                    }
                }

                var tipsToShow = {
                    sessionId: this._sessionId,
                    windowId: this._windowId,
                    type: "Start",
                    tips: clonedList
                };

                //If this is the first time showing a tip in this app, show the
                //"Find Quick Tip Again Here" message.
                if (!JET.QuickTips.hasShownAnyTipBefore()) {
                    tipsToShow.showFindQuickTipsAgainInfo = true;
                }

                JET.publish(QT_PUB_CHANNEL, JSON.stringify(tipsToShow));
                this._started = true;
                //Dispatch Event
                if (this._onStartedCallback) {
                    this._onStartedCallback(this._tipList);
                }
                //Mark this tip as shown
                this._markShown();
            }
        } else {
            if (this._onErrorCallback) {
                this._onErrorCallback("This version of container doesn't support QuickTips.");
            }
        }
        return this;
    }

    Session.prototype.end = function() {
        if (this._started) {
            JET.publish(QT_PUB_CHANNEL, JSON.stringify({
                sessionId: this._sessionId,
                windowId: this._windowId,
                type: "End"
            }));
            this._started = false;
        }
        return this;
    }

    api.create = function(tipId) {
        return new Session(tipId, windowId, util);
    }

    api.tipsAvailable = function(isAvailable) {
        var json = JSON.stringify({
                    windowId: windowId,
                    type: "QuickTipMenu",
                    showQuickTipMenu: isAvailable
                });
        JET.publish(QT_PUB_CHANNEL, json);
    }

    api.onQuickTipRequest = function(handler) {
        onRequestCallback = handler;
    }

    api.getGlobalStorageKey = function() {
        return "jet.quicktip.shown."+JET.ID;        
    }    

    api.hasShownAnyTipBefore = function() {
        //Check local storage support
        if(typeof(Storage) !== "undefined") {
            var key = JET.QuickTips.getGlobalStorageKey();
            var value = localStorage[key];
            return (value === "true");
        } else {
            //Return true because if something wrong with the local storage,
            //the tip shouldn't be showing all the time.
            return true; 
        }
    } 

    api.clearGlobalShownStatus = function() {
        //Check local storage support
        if(typeof(Storage) !== "undefined") {
            var globalKey = JET.QuickTips.getGlobalStorageKey();
            localStorage.removeItem(globalKey);
        }
    }    

    return api;
});