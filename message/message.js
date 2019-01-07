(function (angular) {
    angular.module("gw.message", [])
        .service("gwMessageService", function () {

        })
        .controller("gwMessageController", ["$scope", "$compile", "$element", function ($scope, $compile, $element) {
            var self = this;
            self.render = function (tElement) {

            }
	}])
        .directive("gwMessage", function () {
            return {
                controller: "gwMessageController",
                controllerAs: "gwMessageCtrl",
            };
        });

})(window.angular);
