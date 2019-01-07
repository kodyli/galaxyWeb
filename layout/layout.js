(function (angular) {
    angular.module("gw.layout", [])
        .factory("gwLayoutService", function () {
            return {
                closeErrorPanel: closeErrorPanel,
                openErrorPanel: openErrorPanel
            };

            function closeErrorPanel(layoutEle) {
                layoutEle.close("east");
            }

            function openErrorPanel(layoutEle) {
                layoutEle.open("east");
            }
        })
        .directive("gwLayout", ["gwLayoutService", function (gwLayoutService) {
            function LayoutController() {
                this._layout = null;
            }
            LayoutController.$injector = [];
            angular.extend(LayoutController.prototype, {
                setLayout: function (layoutEle) {
                    this._layout = layoutEle;
                },
                closeErrorPanel: function () {
                    gwLayoutService.closeErrorPanel(this._layout);
                },
                openErrorPanel: function () {
                    gwLayoutService.openErrorPanel(this._layout);
                }
            });
            return {
                restrict: "A",
                controller: LayoutController,
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
                            ctrl.setLayout(iEle.layout({
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
                            }));
                        });
                    }
                }
            };
        }]).directive("gwLayoutTop", function () {
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
