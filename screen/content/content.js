(function (angular) {
    function ContentController($scope, $element) {
        var tabsCtrl = null,
            screenCtrl = null;
        this.setTabsController = function (tabsController) {
            tabsCtrl = tabsController;
        };
        this.setScreenController = function (screenController) {
            screenCtrl = screenController;
        };
        this.attachError = function (error) {
            screenCtrl.attachError(error);
        };
        this.handleError = function (error) {
            error.display(this);
        };
        this.getElement = function () {
            return $element;
        };
    }
    ContentController.$injector = ["$scope", "$element"];

    function contentDirective() {
        return {
            restrict: "E",
            controller: "gwContentController",
            require: ["gwContent", "^^gwScreen"],
            link: function (scope, iEle, iAttr, ctrls) {
                ctrls[1].setContentController(ctrls[0]);
            }
        };
    }
    contentDirective.$injector = [];

    angular.module("gw.screen.content", ["gw.grid"])
        .controller("gwContentController", ContentController)
        .directive("gwContent", contentDirective);
})(window.angular);
