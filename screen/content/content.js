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

    function ContentDirective() {
        return {
            restrict: "E",
            controller: "contentController",
            controllerAs: "contentCtrl",
            require: ["gwContent", "^^gwScreen"],
            link: function (scope, iEle, iAttr, ctrls) {
                ctrls[1].setContentController(ctrls[0]);
            }
        };
    }
    ContentDirective.$injector = [];

    angular.module("gw.screen.content", ["gw.grid"])
        .controller("contentController", ContentController)
        .directive("gwContent", ContentDirective);
})(window.angular);
