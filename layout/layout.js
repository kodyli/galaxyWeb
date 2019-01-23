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
                this.element = null;
            }
            LayoutController.$injector = [];
            angular.extend(LayoutController.prototype, {
                closeErrorPanel: function () {
                    gwLayoutService.closeErrorPanel(this.element);
                },
                openErrorPanel: function () {
                    gwLayoutService.openErrorPanel(this.element);
                }
            });
            return {
                restrict: "A",
                controller: LayoutController,
                controllerAs: "gwLayoutCtrl",
                require: ["gwLayout", "?gwScreen"],
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
                    return {
                        pre: function (scope, iEle, iAttr, ctrls) {
                            var gwLayoutCtrl = ctrls[0],
                                gwScreenCtrl = ctrls[1] || nullScreenController;
                            gwScreenCtrl.setLayoutController(gwLayoutCtrl);
                        },
                        post: function (scope, iEle, iAttr, ctrls) {
                            var gwLayoutCtrl = ctrls[0];
                            iEle.ready(function () {
                                gwLayoutCtrl.element = iEle.layout({
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
                    };
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
