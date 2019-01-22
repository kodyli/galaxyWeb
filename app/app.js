var nullAppController = {
    setMessageController: angular.noop,
    setMenuController: angular.noop,
    setPageController: angular.noop
};
(function (angular) {
    angular.module("gw.app", ["gw.message", "gw.menu", "gw.page"])
        .directive("gwApp", function () {
            function MainController() {
                this._messageCtrl = null;
                this._menuCtrl = null;
                this._pageCtrl = null;
            }
            angular.extend(MainController.prototype, {
                setMessageController: function (gwMessageController) {
                    this._messageCtrl = gwMessageController;
                    this._messageCtrl.appCtrl = this;
                },
                setMenuController: function (gwMenuController) {
                    this._menuCtrl = gwMenuController;
                    this._menuCtrl.appCtrl = this;
                },
                setPageController: function (gwPageController) {
                    this._pageCtrl = gwPageController;
                    this._pageCtrl.appCtrl = this;
                },
                loadPage: function (page) {
                    var pageHtml = this._pageCtrl.loadPage(page);
                    this._pageCtrl.render(pageHtml, this._pageCtrl.element);
                }
            });
            return {
                restrict: "E",
                controller: MainController,
                compile: function (tEle) {
                    tEle.css({
                        display: "block"
                    })
                }
            }
        });
})(window.angular);
