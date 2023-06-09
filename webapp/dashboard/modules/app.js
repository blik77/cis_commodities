define(["knockout"], function(ko) {
    var sm = function(){
    //return function() {

        self = this;
        this.articlePath = "pages";
        this.statistics = ko.observable();
        this.appinfo = ko.observable();
        $.getJSON("/kortes/service/info/tracking/", function (data) {
            self.statistics(data);
        });
        $.getJSON("/kortes/service/info/", function (data) {
            self.appinfo(data);
        });
        self.clearCache =function() {
            $.getJSON("/kortes/service/info/reset/", function (data) {
                console.log("cache reset done");
            });
        };

        this.currentArticle = ko.observable("requests");
        this.currentArticle.full = ko.computed(function () {
            var current = this.currentArticle();
            return current && this.articlePath + "/" + current;
        }, this);
    };
    return sm;
});