(function (angular) {
    angular.module("gw.form", [])
        .directive("gwForm", function () {
            function GwFormController() {
                this.ngFormCtrl = null;
                this.contentCtrl = nullContentController;
                this.tabCtrl = nullTabController;
            };

            angular.extend(GwFormController.prototype, editable, {
                isDirty: function () {
                    return this.ngFormCtrl.$dirty;
                }
            });

            GwFormController.$injector = [];

            return {
                require: ["gwForm", "form", "?^^gwTab", "^^?gwContent"],
                controller: GwFormController,
                restrict: "A",
                compile: function (tEle, tAttr) {
                    return {
                        pre: function (scope, iEle, iAttr, ctrls) {
                            var formCtrl = ctrls[0],
                                ngFormCtrl = ctrls[1],
                                tabCtrl = ctrls[2] || formCtrl.tabCtrl,
                                contentCtrl = ctrls[3] || formCtrl.contentCtrl;
                            formCtrl.ngFormCtrl = ngFormCtrl;
                            contentCtrl.attachFormController(formCtrl);
                        }
                    };
                }
            };
        });
})(window.angular)
