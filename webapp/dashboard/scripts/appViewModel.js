define(['knockout','jquery'], function(ko) {
           return function() {
            var self = this;

               self.name = ko.observable('Server methods response time');


            $.getJSON("/kortes/service/info/tracking/", function (data) {
                self.statistics = ko.observable(data);
            })

            //ko.applyBindings(self);

    };
});