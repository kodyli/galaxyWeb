(function (angular) {

    function ScreenController($scope, $compile, $element) {
        var screenScope = null,
            errorCtrl = null,
            contentCtrl = null,
            layoutCtrl = null;

        this.attachError = function (errorData) {
            errorCtrl.attachError(errorData);
        };
        this.handleError = function (error) {
            contentCtrl.handleError(error);
        };

        this.setErrorController = function (errorController) {
            errorCtrl = errorController;
            errorCtrl.setScreenController(this);
        };
        this.getErrorController = function () {
            return errorCtrl;
        };
        this.setContentController = function (contentController) {
            contentCtrl = contentController;
            contentCtrl.setScreenController(this);
        };
        this.getContentController = function () {
            return contentCtrl;
        };

        this.openErrorPanel = function () {
            $scope.layoutCtrl.openErrorPanel();
        }
        this.closeErrorPanel = function () {
            $scope.layoutCtrl.closeErrorPanel();
        };
    }
    ScreenController.$injector = ["$scope", "$compile", "$element"];

    function ScreenDirective() {
        return {
            controller: "screenController",
            controllerAs: "screenCtrl",
            compile: function (tEle, tAttr) {
                tEle.css({
                    display: "block"
                });
                return function (scope, iEle, iAttr, screenCtrl) {

                };
            }
        };
    }
    ScreenDirective.$injector = [];

    angular.module("gw.screen", ["gw.screen.error", "gw.screen.content"])
        .controller("screenController", ScreenController)
        .directive("gwScreen", ScreenDirective);

})(window.angular);
