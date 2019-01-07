(function (angular) {
    angular.module("main", ["gw.data", "gw.layout", "gw.tab", "gw.menu", "gw.page", "gw.test"])
        .controller("mainController", function ($scope) {
            console.log("main", $scope);
        })
        .directive("gwApp", function () {
            return {
                restrict: "E",
                controller: angular.noop,
                compile: function (tEle) {
                    tEle.css({
                        display: "block"
                    })
                }
            }
        });
})(window.angular);
