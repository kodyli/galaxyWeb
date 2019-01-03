(function (angular) {
    angular.module("gw.screen.content", ["gw.grid"])
        .directive("gwContent", function () {
            return {
                restrict: "E"
            };
        });
})(window.angular);
