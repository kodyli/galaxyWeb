(function (angular) {
    angular.module("gw.screen.content", ["gw.grid"])
        .controller("contentController", ["$scope", function ($scope) {

        }])
        .directive("gwContent", function () {
            return {
                restrict: "E",
                controller: "contentController",
                controllerAs: "contentCtrl",
                link: function (scope) {
                    console.log(scope);
                }
            };
        });
})(window.angular);
