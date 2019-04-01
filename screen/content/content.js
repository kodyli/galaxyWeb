//global --nullContentController
var nullContentController = {
        setTabsController: angular.noop,
        attachGridController: angular.noop,
        attachFormController: angular.noop
    },
    editable = {
        isDirty: function () {
            throw "editable isDirty override";
        }
    };


(function (angular) {
    function contentDirective() {
        function ContentController() {
            this.screenCtrl = nullScreenController;
            this.element = null;
            this._tabsCtrl = nullTabController;
            this._gridCtrls = {};
            this._formCtrls = [];
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
            attachFormController: function (gwFormController) {
                gwFormController.contentCtrl = this;
                this._formCtrls.push(gwFormController);
            },
            getGridById: function (id) {
                return this._gridCtrls[id];
            },
            attachError: function (errorData) {
                this.screenCtrl.attachError(errorData);
            },
            activateTabById: function (tabId) {
                this._tabsCtrl.activateTabById(tabId);
            },
            disableSaveButton: function () {
                return !this._isDirty();
            },
            disablePrintButton: function () {
                return this._isDirty();
            },
            _isDirty: function () {
                var dirty = false;
                this._formCtrls.every(function (formCtrl) {
                    dirty = formCtrl.isDirty();
                    return !dirty;
                });
                if (!dirty) {
                    var id;
                    var gridCtrl;
                    for (id in this._gridCtrls) {
                        gridCtrl = this._gridCtrls[id];
                        dirty = gridCtrl.isDirty();
                        if (dirty) {
                            break;
                        }
                    }
                }
                return dirty;
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

    angular.module("gw.screen.content", ["gw.tab", "gw.form", "gw.grid"])
        .directive("gwContent", contentDirective);
})(window.angular);
