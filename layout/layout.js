(function (angular) {
    angular.module("gw.layout", [])
        .controller("gwLayoutController", ["$element", function ($element) {
            this.closeRightPanel = function () {
                this.layout.close("east");
            };
            this.openRightPanel = function () {
                this.layout.open("east");
            };
        }])
        .directive("gwLayout", function () {
            return {
                restrict: "A",
                controller: "gwLayoutController",
                controllerAs: "gwLayoutCtrl",
                compile: function (tEle) {
                    tEle.css({
                        display: "block",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: "0px",
                        right: "0px",
                        top: "0px",
                        bottom: "0px"
                    });
                    return function (scope, iEle, iAttr, ctrl) {
                        iEle.ready(function () {
                            ctrl.layout = iEle.layout({
                                applyDemoStyles: true,
                                north: {
                                    size: 95,
                                    spacing_open: 0,
                                },
                                west: {
                                    size: 300,
                                    spacing_open: 15,
                                    spacing_closed: 15
                                },
                                east: {
                                    initClosed: true,
                                    spacing_open: 15,
                                    spacing_closed: 15
                                }
                            });
                        });
                    }
                }
            };
        }).directive("gwLayoutTop", function () {
            return {
                restrict: "A",
                compile: function (tEle) {
                    tEle.addClass("ui-layout-north");
                }
            };
        }).directive("gwLayoutCenter", function () {
            return {
                restrict: "A",
                compile: function (tEle) {
                    tEle.addClass("ui-layout-center");
                }
            };
        }).directive("gwLayoutLeft", function () {
            return {
                restrict: "A",
                compile: function (tEle) {
                    tEle.addClass("ui-layout-west");
                }
            };
        }).directive("gwLayoutRight", function () {
            return {
                restrict: "A",
                compile: function (tEle) {
                    tEle.addClass("ui-layout-east");
                }
            };
        });
})(window.angular);
