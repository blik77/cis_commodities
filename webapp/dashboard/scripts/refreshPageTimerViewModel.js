/**
 * Created by u6020011 on 29.06.2015.
 */
RefreshPageTimerViewModel = function () {
    var self = this;

    self.timerId = 0;
    self.elapsedTime = ko.observable(0);
    self.initialTime = ko.observable(0);
    self.remainingTime = ko.computed(function(){
        return self.initialTime() - self.elapsedTime();
    });
    self.isRunning = ko.observable(false);

    self.StartCounter = function(){
        self.elapsedTime(0);
        self.isRunning(true);
        self.timerId = window.setInterval(function(){
            self.elapsedTime(self.elapsedTime()+1);
            if(self.remainingTime() == 0){
                clearInterval(self.timerId);
                self.isRunning(false);
                self.Callback();
            }
        },1000)
    }
    self.StopCounter = function(){
        clearInterval(self.timerId);
        self.isRunning(false);
    }
    self.Callback = function(){}
}
