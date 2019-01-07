(function (angular) {
    angular.module("main", ["gw.data", "gw.layout", "gw.tab", "gw.menu", "gw.page", "gw.test"])
        .controller("mainController", function ($scope) {
            console.log("main", $scope);
        })
        .directive("gwApp", function () {
            return {
                restrict: "E",
                controller: function () {},
                controllerAs: "gwAppCtrl",
                link: function (scope) {
                    console.log("gwApp", scope);
                }
            }
        });
})(window.angular);
