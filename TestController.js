(function (angular) {
    angular.module("gw.test", [])
        .controller("TestController", ["$scope", "$compile", "$element", "errorService", "dialogHtml", "screenService", function ($scope, $compile, $element, errorService, dialogHtml, screenService) {
            console.log("TestScreen", $scope);
            var dialog;
            var dialogScope;
            this.name = "test";
            this.find = function () {
                console.log(this.searchTab);
            };
            this.save = function () {
                var errorsHandler = errorService.getErrorsHandler($scope);
                if (this.name === "error") {
                    errorsHandler([{
                        ngModel: 'name',
                        errorType: 'fieldError',
                        message: "Field Error"
                    }]);
                }
            };
            this.addRow1 = function () {
                this.grid1.addRow({
                    OrderID: '21',
                    CustomerID: "HANAR21",
                    OrderDate: "1996-07-08",
                    Freight: 65.8300,
                    ShipName: 'Hanari Carnes'
                });
            };
            this.addRow2 = function () {
                this.grid2.addRow();
            };
            this.addInvoice = function () {
                dialogScope = $scope.$new();
                console.log("dialog", dialogScope);
                var nodes = [
                    "<div gw-layout><gw-content gw-layout-center>",
                    dialogHtml.join(""),
                    "</gw-content><gw-error gw-layout-right></gw-error></div>"
                ];
                var content = $compile("<gw-screen auto-load><gw-screen>")(dialogScope);
                dialog = $("<div>").append(content);
                dialog.dialog({
                    title: "Add an Invoice",
                    width: $(window).width() * 0.8,
                    height: $(window).height() * 0.7,
                    modal: true,
                });
            };
            this.closDialog = function () {
                dialog.empty().dialog("destroy");
                //dialogScope.$destroy();
            }
            this.saveInvoice = function () {
                if (this.name === "error") {
                    var errorsHandler = errorService.getDialogErrorsHandler(dialogScope);
                    errorsHandler([{
                        ngModel: 'name',
                        errorType: 'fieldError',
                        message: "Field Error"
                    }]);
                } else {
                    this.closDialog();
                }
            }
        }])
        /*.controller("AddInvoiceController", function ($scope, errorService) {
                    console.log("dialog", $scope);
                    this.name = "test";
                    this.saveInvoice = function () {
                        if (this.name === "error") {
                            var errorsHandler = errorService.getErrorsHandler($scope);
                            errorsHandler([{
                                ngModel: 'name',
                                errorType: 'fieldError',
                                message: "Field Error"
                            }]);
                        } else {
                            $scope.testCtrl.closDialog();
                        }
                    }
                })*/
    ;
})(window.angular);
