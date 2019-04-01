(function (angular) {
    angular.module("gw.test", [])
        .controller("TestController", ["$scope", "$compile", "$element", "dialogHtml", function ($scope, $compile, $element, dialogHtml) {
            var dialog;
            var dialogScope;
            this.name = "test";
            this.find = function () {
                this.gwErrorCtrl.clearErrors(true);
                if (this.name === "error") {
                    this.gwErrorCtrl.handleErrors([{
                        tabId: "searchTab",
                        ngModel: "name",
                        errorType: 'fieldError',
                        message: "Field Error"
                    }]);
                } else {
                    this.grid1.find();
                    this.grid2.find();
                    var selectTabById = this.searchTabCtrl.enableSiblings();
                    selectTabById("detailsTab");
                }
            };
            this.save = function () {
                this.gwErrorCtrl.clearErrors(true);
                var errors = [];
                if (this.firstName === "error") {
                    errors.push({
                        errorType: 'fieldError',
                        tabId: 'detailsTab',
                        ngModel: 'firstName',
                        message: "Field Error"
                    }, {
                        errorType: 'cellError',
                        tabId: "detailsTab",
                        gridId: "gwGrid1",
                        rowId: 1,
                        colName: "CustomerID",
                        message: "Can not be empty"
                    }, {
                        errorType: 'rowError',
                        tabId: "detailsTab",
                        gridId: "gwGrid1",
                        rowId: 2,
                        message: "Row Error"
                    }, {
                        errorType: 'cellError',
                        tabId: "detailsTab",
                        gridId: "gwGrid1",
                        rowId: 3,
                        colName: "CustomerID",
                        message: "Can not be empty"
                    });

                }
                if (this.lastName === "error") {
                    errors.push({
                        errorType: 'fieldError',
                        tabId: 'noteTab',
                        ngModel: 'lastName',
                        message: "Field Error"
                    });
                }
                this.gwErrorCtrl.handleErrors(errors);
            };
            this.print = function () {
                console.log("print");
            };
            this.addRow1 = function () {
                this.grid1.addRowToSelectedGrid({
                    OrderID: '21',
                    CustomerID: "HANAR21",
                    OrderDate: "1996-07-08",
                    Freight: 65.8300,
                    ShipName: 'Hanari Carnes'
                });
            };
            this.addRow2 = function () {
                this.grid2.addRowToSelectedGrid({
                    OrderID: '21',
                    CustomerID: "HANAR21",
                    OrderDate: "1996-07-08",
                    Freight: 65.8300,
                    ShipName: 'Hanari Carnes'
                });
            };
            this.dupRow2 = function () {
                this.grid2.dupRowToSelectedGrid();
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
            }
        }]);
})(window.angular);
