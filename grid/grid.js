var nullGridController = {
    attach: angular.noop
};
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
                selectCell: selectCell,
                expandSubGridByRowId: expandSubGridRow,
                collapseSubGridByRowId: collapseSubGridRow
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
                var iRow = _getRowIndex(gridEle, rowId);
                var iCol = _getColumnIndex(gridEle, colName);
                gridEle.editCell(iRow, iCol, true);
                gridEle.setCell(rowId, colName, '', 'test');
            }

            function expandSubGridRow(gridEle, parentRowId) {
                gridEle.expandSubGridRow(parentRowId);
            }

            function collapseSubGridRow(gridEle, parentRowId) {
                gridEle.collapseSubGridRow(parentRowId);
            }

            function _getRowIndex(gridEle, rowId) {
                return gridEle.getInd(rowId);
            }

            function _getColumnIndex(gridEle, colName) {
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
        .directive("gwGrid", ["$compile", "gwGridService", function ($compile, gwGridService) {
            function GwGridController($scope) {
                this.gridElement = null;
                this.id = $scope.id;
                this.parent = null;
                this.parentRowId = null;
                this.childGrids = [];
                this.isExpanded = false;
                this.contentCtrl = nullContentController;
            }
            angular.extend(GwGridController.prototype, {
                init: function () {
                    console.log("init");
                },
                addRow: function (rowData) {
                    var rowId = this._getLastRowId() + 1;
                    var result = gwGridService.addRowToBottom(this.gridElement, rowId, rowData);
                    if (result) {
                        gwGridService.selectRowById(this.gridElement, rowId);
                    }
                    return result;
                },
                selectCell: function (rowId, colName) {
                    gwGridService.selectCell(this.gridElement, rowId, colName);
                },
                attach: function (childGrid, parentRowId) {
                    childGrid.parent = this;
                    childGrid.parentRowId = parentRowId;
                    childGrid.isExpanded = true;
                    this.childGrids.push(childGrid);
                    this.contentCtrl.attachGridController(childGrid);
                },
                getSubgrid: function (id) {
                    var current = null;
                    this.childGrids.every(function (subgrid) {
                        if (subgrid.id === id) {
                            current = subgrid;
                            return false;
                        }
                        return true;
                    });
                    return current;
                },
                isSubgrid: function () {
                    return this.parent !== null;
                },
                expand: function (isOnClick) {
                    if (this.isSubgrid() && !this.isExpanded) {
                        this.isExpanded = true;
                        if (!isOnClick) {
                            this.parent.expandSubGridByRowId(this.parentRowId);
                        }
                    }
                },
                expandSubGridByRowId: function (rowId) {
                    this.expand();
                    gwGridService.expandSubGridByRowId(this.gridElement, rowId);
                },
                collapse: function (isOnClick) {
                    if (this.isSubgrid() && this.isExpanded) {
                        if (this.childGrids.length > 0) {
                            this.childGrids.forEach(function (subgrid) {
                                subgrid.collapse();
                            });
                        }
                        this.isExpanded = false;
                        if (!isOnClick) {
                            this.parent.collapseSubGridByRowId(this.parentRowId);
                        }
                    }
                },
                collapseSubGridByRowId: function (rowId) {
                    gwGridService.collapseSubGridByRowId(this.gridElement, rowId);
                },
                _getLastRowId: function () {
                    var rowIds = gwGridService.getRowIds(this.gridElement);
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
                    name: "=?",
                    parent: "<?",
                    parentRowId: "@?"
                },
                controller: GwGridController,
                controllerAs: "gwGridCtrl",
                require: ["gwGrid", "?^^gwTab", "^^?gwContent"],
                template: "<table id='{{gwGridCtrl.id}}_table'></table>",
                compile: function (tEle, tAttr) {
                    tEle.css({
                        display: "block"
                    });
                    return {
                        pre: function (scope, iEle, iAttr, ctrls) {
                            var gwGridCtrl = ctrls[0],
                                gwTabCtrl = ctrls[1] || nullTabController,
                                gwContentCtrl = ctrls[2] || nullContentController;
                            scope.parent = scope.parent || nullGridController;
                            gwTabCtrl.activate(function () {
                                gwGridCtrl.init();
                            });
                            gwContentCtrl.attachGridController(gwGridCtrl);
                            scope.name = gwGridCtrl;
                            scope.parent.attach(gwGridCtrl, scope.parentRowId);
                        },
                        post: function (scope, iEle, iAttr, ctrls) {
                            var gwGridCtrl = ctrls[0];

                            function toSubgridId(subgridContainerId) {
                                return subgridContainerId.replace("_table", "") + "_subgrid";
                            }
                            iEle.ready(function () {
                                gwGridCtrl.gridElement = iEle.children("table").filter(":first").jqGrid({
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
                                    height: 400,
                                    subGrid: true,
                                    subGridOptions: {
                                        reloadOnExpand: false
                                    },
                                    subGridBeforeExpand: function (subgridContainerId, rowId) {
                                        var subgridId = toSubgridId(subgridContainerId);
                                        var subgrid = gwGridCtrl.getSubgrid(subgridId);
                                        if (subgrid) {
                                            subgrid.expand(true);
                                        }
                                    },
                                    subGridRowExpanded: function (subgridContainerId, rowId) {
                                        var subgridId = toSubgridId(subgridContainerId),
                                            template = "<gw-grid id='" + subgridId + "' parent='gwGridCtrl' parent-row-id='" + rowId + "'></gw-grid>",
                                            element = $compile(template)(scope);
                                        $("#" + subgridContainerId).html(element);
                                    },
                                    subGridRowColapsed: function (subgridContainerId, rowId) {
                                        var subgridId = toSubgridId(subgridContainerId);
                                        var subgrid = gwGridCtrl.getSubgrid(subgridId);
                                        subgrid.collapse(true);
                                    }
                                });
                            });
                        }
                    };
                }
            };
        }]);
})(window.angular);
