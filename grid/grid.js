(function (angular) {
    angular.module("gw.grid", [])
        .factory("gwGridService", function () {
            /**
             * Designed as an Adapter.
             * Import functions from jqGrid, must be stateless.
             */
            return {
                addRowToBottom: addRowToBottom,
                selectRowById: selectRowById,
                getRowIds: getRowIds
            };

            function addRowToBottom(gridEle, rowId, rowData) {
                return gridEle.addRowData(rowId, rowData, "last");
            }

            function selectRowById(gridEle, rowId) {
                gridEle.setSelection(rowId);
            }

            function getRowIds(gridEle) {
                return gridEle.getDataIDs();
            }
        })
        .directive("gwGrid", ["gwGridService", function (gwGridService) {
            function GwGridController() {
                this._grid = null;
            }
            angular.extend(GwGridController.prototype, {
                init: function () {
                    console.log("init");
                },
                setGrid: function (grid) {
                    this._grid = grid;
                },
                addRow: function (rowData) {
                    var rowId = this._getLastRowId() + 1;
                    var result = gwGridService.addRowToBottom(this._grid, rowId, rowData);
                    if (result) {
                        gwGridService.selectRowById(this._grid, rowId);
                    }
                    return result;
                },
                _getLastRowId: function () {
                    var rowIds = gwGridService.getRowIds(this._grid);
                    if (rowIds.length > 0) {
                        var max = rowIds.reduce(function (a, b) {
                            return Math.max(parseInt(a), parseInt(b));
                        });
                        return max;
                    }
                    return 0;
                }
            });

            GwGridController.$injector = ["gwGridService"];

            return {
                restrict: "E",
                scope: {
                    gridInstance: "=?"
                },
                controller: GwGridController,
                controllerAs: "gwGridCtrl",
                require: ["gwGrid", "?^^gwTab"],
                template: "<table></table>",
                compile: function (tEle, tAttr) {
                    tEle.css({
                        display: "block"
                    });
                    return function (scope, iEle, iAttr, ctrls) {
                        var gwGridCtrl = ctrls[0],
                            gwTabCtrl = ctrls[1];
                        scope.gridInstance = gwGridCtrl;
                        gwTabCtrl.activate(gwGridCtrl.init, gwGridCtrl);
                        iEle.ready(function () {
                            var grid = iEle.children("table").filter(":first").jqGrid({
                                url: 'http://trirand.com/blog/phpjqgrid/examples/jsonp/getjsonp.php?callback=?&qwery=longorders',
                                mtype: "GET",
                                datatype: "jsonp",
                                colModel: [
                                    {
                                        label: 'OrderID',
                                        name: 'OrderID',
                                        key: true,
                                        width: 75
                    },
                                    {
                                        label: 'Customer ID',
                                        name: 'CustomerID',
                                        width: 150
                    },
                                    {
                                        label: 'Order Date',
                                        name: 'OrderDate',
                                        width: 150,
                                        formatter: 'date',
                                        formatoptions: {
                                            srcformat: 'Y-m-d H:i:s',
                                            newformat: 'ShortDate'
                                        }
                    },
                                    {
                                        label: 'Freight',
                                        name: 'Freight',
                                        width: 150
                    },
                                    {
                                        label: 'Ship Name',
                                        name: 'ShipName',
                                        width: 150
                    }
                ],
                                viewrecords: true,
                                scrollrows: true,
                                height: 200
                            });
                            gwGridCtrl.setGrid(grid);
                        });
                    };
                }
            };
        }]);
})(window.angular);
