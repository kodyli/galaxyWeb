//global --nullContentController
var nullContentController = {
    setTabsController: angular.noop,
    attachGridController: angular.noop
};

(function (angular) {
    function contentDirective() {
        function ContentController() {
            this.screenCtrl = nullScreenController;
            this.element = null;
            this._tabsCtrl = nullTabController;
            this._gridCtrls = {};
        }
        ContentController.$injector = [];
        angular.extend(ContentController.prototype, {
            setTabsController: function (tabsController) {
                this._tabsCtrl = tabsController;
            },
            attachGridController: function (gwGridController) {
                gwGridController.contentCtrl = this;
                this._gridCtrls[gwGridController.id] = gwGridController;
            },
            getGridById: function (id) {
                return this._gridCtrls[id];
            },
            attachError: function (error) {
                this.screenCtrl.attachError(error);
            },
            displayError: function (error) {
                var self = this;
                this._tabsCtrl.activateTabById(error.tabId);
                error.display(this);
            }
        });
        return {
            restrict: "E",
            controller: ContentController,
            require: ["gwContent", "^^?gwScreen"],
            scope: {
                name: "=?"
            },
            compile: function () {
                return {
                    pre: function (scope, iEle, iAttr, ctrls) {
                        var gwContentCtrl = ctrls[0],
                            gwScreenCtrl = ctrls[1] || gwContentCtrl.screenCtrl;
                        gwContentCtrl.element = iEle;
                        gwScreenCtrl.setContentController(gwContentCtrl);
                        scope.name = gwContentCtrl;
                    },
                    post: function (scope, iEle, iAttr, ctrls) {

                    }
                };
            }
        };
    }
    contentDirective.$injector = [];

    angular.module("gw.screen.content", ["gw.grid", "gw.tab"])
        .directive("gwContent", contentDirective);
})(window.angular);
