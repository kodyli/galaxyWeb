(function (angular) {

    function ScreenController($scope) {
        var screenScope = null,
            errorCtrl = null,
            contentCtrl = null;

        this.attachError = function (errorData) {
            errorCtrl.attachError(errorData);
        };
        this.handleError = function (error) {
            contentCtrl.handleError(error);
        };

        this.setErrorController = function (gwErrorController) {
            errorCtrl = gwErrorController;
            errorCtrl.setScreenController(this);
        };
        this.setContentController = function (gwContentController) {
            contentCtrl = gwContentController;
            contentCtrl.setScreenController(this);
        };

        this.openErrorPanel = function () {
            $scope.gwLayoutCtrl.openErrorPanel();
        }
        this.closeErrorPanel = function () {
            $scope.gwLayoutCtrl.closeErrorPanel();
        };
    }
    ScreenController.$injector = ["$scope"];

    function screenDirective() {
        return {
            controller: "gwScreenController",
            compile: function (tEle, tAttr) {
                tEle.css({
                    display: "block"
                });
            }
        };
    }
    screenDirective.$injector = [];

    angular.module("gw.screen", ["gw.screen.error", "gw.screen.content"])
        .controller("gwScreenController", ScreenController)
        .directive("gwScreen", screenDirective);

})(window.angular);
