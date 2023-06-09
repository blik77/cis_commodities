/*define(["knockout"], function(ko) {
    return {
        articles: ["one", "two", "three"]
    };
});*/
define(['knockout', 'navmodel','text','domReady','jquery'], function(ko, Navmodel) {

    var sm = new Navmodel(function(navmodel) {
        ko.applyBindings(navmodel);
    });

    return sm;
});