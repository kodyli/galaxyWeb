(function (angular) {
    angular.module("gw.message", [])
        .service("messageService", function () {

        })
        .controller("messageController", ["$scope", "$compile", "$element", function ($scope, $compile, $element) {
            var self = this;
            self.render = function (tElement) {

            }
	}])
        .directive("gwMessage", function () {
            return {
                controller: "messageController",
                controllerAs: "messageCtrl",
            };
        });

})(window.angular);
