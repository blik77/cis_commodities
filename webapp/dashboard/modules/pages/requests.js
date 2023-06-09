/**
 * Created by Yury Morozov on 23.06.2015.
 */
define(["knockout",'appViewModel'], function(ko,AppViewModel) {


    var sm = new AppViewModel(function(appViewModel) {
        //ko.applyBindings(appViewModel);
    });

    return sm;
});