(function (angular) {
    angular.module("gw.test", [])
        .controller("TestController", ["$scope", "$compile", "$element", "dialogHtml", function ($scope, $compile, $element, dialogHtml) {
            console.log("TestScreen", $scope);
            var dialog;
            var dialogScope;
            this.name = "test";
            this.find = function () {
                $scope.gwErrorCtrl.clearErrors(true);
                if (this.name === "error") {
                    $scope.gwErrorCtrl.handleErrors([{
                        tabId: "searchTab",
                        ngModel: "name",
                        errorType: 'fieldError',
                        message: "Field Error"
                    }]);
                } else {
                    this.searchTabCtrl.enableSiblings()("noteTab");
                }
            };
            this.save = function () {
                $scope.gwErrorCtrl.clearErrors(true);
                var errors = [];
                if (this.firstName === "error") {
                    errors.push({
                        tabId: 'detailsTab',
                        ngModel: 'firstName',
                        errorType: 'fieldError',
                        message: "Field Error"
                    });

                }
                if (this.lastName === "error") {
                    errors.push({
                        tabId: 'noteTab',
                        ngModel: 'lastName',
                        errorType: 'fieldError',
                        message: "Field Error"
                    });

                }
                $scope.gwErrorCtrl.handleErrors(errors);
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
                var content = $compile("<gw-page auto-load><gw-page>")(dialogScope);
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
                /*this.saveInvoice = function () {
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
                }*/
        }]);
})(window.angular);
