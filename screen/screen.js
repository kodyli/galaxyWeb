var nullScreenController = {
    setLayoutController: angular.noop,
    setContentController: angular.noop,
    setErrorController: angular.noop,
    attachError: angular.noop,
    handleError: angular.noop,
    openErrorPanel: angular.noop,
    closeErrorPanel: angular.noop
};

(function (angular) {

    function screenDirective() {
        function ScreenController() {
            this._errorCtrl = null;
            this._contentCtrl = null;
            this._layoutCtrl = null;
        }

        angular.extend(ScreenController.prototype, {
            setLayoutController: function (gwLayoutController) {
                this._layoutCtrl = gwLayoutController;
            },
            setContentController: function (gwContentController) {
                this._contentCtrl = gwContentController;
                this._contentCtrl.screenCtrl = this;
            },
            setErrorController: function (gwErrorController) {
                this._errorCtrl = gwErrorController;
                this._errorCtrl.screenCtrl = this;
            },
            attachError: function (errorData) {
                this._errorCtrl.attachError(errorData);
            },
            handleError: function (error) {
                this._contentCtrl.displayError(error);
            },
            openErrorPanel: function () {
                this._layoutCtrl.openErrorPanel();
            },
            closeErrorPanel: function () {
                this._layoutCtrl.closeErrorPanel();
            }
        });


        ScreenController.$injector = [];
        return {
            controller: ScreenController,
            compile: function (tEle, tAttr) {
                tEle.css({
                    display: "block"
                });
            }
        };
    }
    screenDirective.$injector = [];

    angular.module("gw.screen", ["gw.screen.error", "gw.screen.content"])
        .directive("gwScreen", screenDirective);

})(window.angular);
