(function (angular) {
    angular.module("gw.message", [])
        .directive("gwMessage", function () {
            function MessageController() {
                this.appCtrl = nullAppController;
            }
            angular.extend(MessageController.prototype, {

            });
            return {
                restrict: "E",
                require: ["gwMessage", "^^?gwApp"],
                controller: MessageController,
                scope: {
                    name: "=?"
                },
                compile: function () {
                    return {
                        pre: function (scope, iEle, iAttr, ctrls) {
                            var gwMessageCtrl = ctrls[0],
                                gwAppCtrl = ctrls[1] || gwMessageCtrl.appCtrl;
                            gwAppCtrl.setMessageController(gwMessageCtrl);
                            scope.name = gwMessageCtrl;
                        },
                        post: function (scope, iEle, iAttr, ctrls) {

                        }
                    };
                }
            };
        });
})(window.angular);
