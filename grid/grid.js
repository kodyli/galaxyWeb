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
                getRowIds: getRowIds,
                selectCell: selectCell
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

            function selectCell(gridEle, rowId, colName) {
                var iRow = getRowIndex(gridEle, rowId);
                var iCol = getColumnIndex(gridEle, colName);
                console.log(gridEle.editCell(iRow, iCol, true));
            }

            function getRowIndex(gridEle, rowId) {
                return gridEle.getInd(rowId);
            }

            function getColumnIndex(gridEle, colName) {
                var colModel = gridEle.getGridParam("colModel"),
                    index = 0;
                colModel.every(function (column, i) {
                    if (column.name === colName) {
                        index = i;
                        return false;
                    }
                    return true;
                });
                return index;
            }
        })
        .directive("gwGrid", ["gwGridService", function (gwGridService) {
            function GwGridController($scope) {
                this._grid = null;
                this.id = $scope.id;
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
                selectCell: function (rowId, colName) {
                    gwGridService.selectCell(this._grid, rowId, colName);
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

            GwGridController.$injector = ["$scope"];

            return {
                restrict: "E",
                scope: {
                    id: "@",
                    name: "=?"
                },
                controller: GwGridController,
                controllerAs: "gwGridCtrl",
                require: ["gwGrid", "?^^gwTab", "^^?gwContent"],
                template: "<table></table>",
                compile: function (tEle, tAttr) {
                    tEle.css({
                        display: "block"
                    });
                    return {
                        pre: function (scope, iEle, iAttr, ctrls) {
                            var gwGridCtrl = ctrls[0],
                                gwTabCtrl = ctrls[1] || nullTabController,
                                gwContentCtrl = ctrls[2];
                            gwTabCtrl.activate(gwGridCtrl.init, gwGridCtrl);
                            gwContentCtrl.attachGridController(gwGridCtrl);
                            scope.name = gwGridCtrl;
                        },
                        post: function (scope, iEle, iAttr, ctrls) {
                            var gwGridCtrl = ctrls[0];
                            iEle.ready(function () {
                                var grid = iEle.children("table").filter(":first").jqGrid({
                                    url: 'http://trirand.com/blog/phpjqgrid/examples/jsonp/getjsonp.php?callback=?&qwery=longorders',
                                    mtype: "GET",
                                    datatype: "jsonp",
                                    cellEdit: true,
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
                                            width: 150,
                                            editable: true
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
                                            align: "right",
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
                        }
                    };
                }
            };
        }]);
})(window.angular);
