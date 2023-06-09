curl({
    paths: {
        "knockout": "/kortes/static/dashboard/scripts/knockout-3.3.0",
        "knockout-amd-helpers": "/kortes/static/dashboard/scripts/knockout-amd-helpers.min",
        //"jquery": "/kortes/static/dashboard/scripts/jquery-2.1.4",
        "text": "/kortes/static/dashboard/scripts/require/text",
        "domReady": "/kortes/static/dashboard/scripts/domReady",
        "appViewModel" : "/kortes/static/dashboard/scripts/appViewModel",
        "navmodel" : "/kortes/static/dashboard/scripts/navmodel"
    },
    pluginPath: "/kortes/static/dashboard/scripts/curl/plugins"
});

curl(["knockout", "/kortes/static/dashboard/modules/app", "knockout-amd-helpers"], function(ko, App) {

    ko.bindingHandlers.module.baseDir = "/kortes/static/dashboard/modules";
    ko.bindingHandlers.module.templateProperty = "embeddedTemplate";

    var app = new App;

    ko.applyBindings(app);

    object = function(App,ko) {
        //var context = ko.contextFor(App);
        $.getJSON("/kortes/service/info/tracking/", function (data) {
            App.statistics(data);
        });

        $.getJSON("/kortes/service/info/", function (data) {
            App.appinfo(data);
        });

    };


    setInterval(function() {object(app,ko)},10000);


});
