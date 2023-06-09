define(['knockout'], function(ko) {
    return function() {
        var self = this;

        self.firstName = ko.observable('Bert');
        self.firstNameCaps = ko.pureComputed(function () {
            return self.firstName().toUpperCase();
        }, self);
        self.articles = ko.observableArray(["application", "cache", "users", "requests"]);
        self.reportId = ko.observable(3);
        self.title = "One Title2";
        self.author = "Bob Smith2";


    };
});