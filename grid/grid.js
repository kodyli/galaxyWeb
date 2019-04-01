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
                loadData: loadData,
                addRowToBottom: addRowToBottom,
                selectRowById: selectRowById,
                unselectRow: unselectRow,
                getRowIds: getRowIds,
                selectCell: selectCell,
                saveCellByIndex: saveCellByIndex,
                expandSubGridByRowId: expandSubGridRow,
                collapseSubGridByRowId: collapseSubGridRow,
                getRowData: getRowData
            };

            function getRowData(gridEle, rowId) {
                return gridEle.getRowData(rowId);
            }

            function loadData(gridEle, data) {
                gridEle.clearGridData(true);
                gridEle.setGridParam({
                    data: data
                });
                gridEle.trigger("reloadGrid");
            }

            function addRows(gridEle, rowsData) {

            }

            function addRowToBottom(gridEle, rowId, rowData) {
                return gridEle.addRowData(rowId, rowData, "last");
            }

            function selectRowById(gridEle, rowId) {
                //the sceond paramter must be true, otherwise it does not trigger the onSelectRow event.
                gridEle.setSelection(rowId, true);
            }

            function unselectRow(gridEle) {
                gridEle.resetSelection();
            }

            function getRowIds(gridEle) {
                return gridEle.getDataIDs();
            }

            function selectCell(gridEle, rowId, colName) {
                var iRow = _getRowIndex(gridEle, rowId);
                var iCol = _getColumnIndex(gridEle, colName);
                gridEle.editCell(iRow, iCol, true);
            }

            function saveCellByIndex(gridEle, iRow, iCol) {
                gridEle.saveCell(iRow, iCol);
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
        .directive("gwGrid", ["$compile", "gwGridService", "jqgridData", function ($compile, gwGridService, jqgridData) {
            /**
             * Refactor GwGridController constructor function using Proxy Design Patter to
             * seperate grid function from angular, so we can change framework easily,
             * and also hide the details of grid.
             * Stratege Design Patter
             * define addRow(), dupRow() and print() function as a strategy, so we can easily
             * change them or modify them.
             */
            function GwGridController($scope) {
                this._scope = $scope;
                this.gridElement = null;
                this.id = $scope.id;
                this.root = this;
                this.parent = null;
                this.parentRowId = null;
                this.childGrids = [];
                this.isExpanded = false;
                this.contentCtrl = nullContentController;
                this.currentSelectedRowId = null; //only avaliable for root grid;
                this.currentSelectedGrid = null; //only avaliable for root grid;
                this._dirty = false;
            }
            angular.extend(GwGridController.prototype, editable, {
                find: function (searchCriteria) {
                    this.loadData(jqgridData);
                },
                loadData: function (data) {
                    gwGridService.loadData(this.gridElement, data);
                },
                setDirty: function () {
                    var self = this;
                    if (!self._dirty) {
                        self._scope.$applyAsync(function () {
                            self._dirty = true;
                        });
                    }
                },
                isDirty: function () {
                    return this._dirty;
                },
                resize: function () {
                    console.log("resize");
                },
                addRowToSelectedGrid: function (rowData) {
                    if (this.isSubgrid()) {
                        throw "addRowToSelectedGrid() method does not work for subgrid";
                    }
                    var selectedGrid = this.root.currentSelectedGrid || this;
                    selectedGrid.addRow(rowData);
                },
                addRow: function (rowData) {
                    if (this.isSubgrid() && !this.isExpanded) {
                        this.expand();
                    }
                    var rowId = this._getLastRowId() + 1;
                    var result = gwGridService.addRowToBottom(this.gridElement, rowId, rowData);
                    if (result) {
                        this.selectRow(rowId);
                        this._applyNewRowStyle(rowId);
                    }
                },
                dupRowToSelectedGrid: function () {
                    if (this.isSubgrid()) {
                        throw "addRowToSelectedGrid() method does not work for subgrid";
                    }
                    var selectedGrid = this.root.currentSelectedGrid || this;
                    selectedGrid.dupRow(this.root.currentSelectedRowId);
                },
                dupRow: function (rowId) {
                    var fromRowData = gwGridService.getRowData(this.gridElement, rowId);
                    this.addRow(fromRowData);
                },
                selectRow: function (rowId) {
                    gwGridService.selectRowById(this.gridElement, rowId);
                },
                selectCell: function (rowId, colName) {
                    gwGridService.selectCell(this.gridElement, rowId, colName);
                },
                saveCellByIndex: function (iRow, iCol) {
                    gwGridService.saveCellByIndex(this.gridElement, iRow, iCol);
                },
                attach: function (childGrid, parentRowId) {
                    childGrid.root = this.root;
                    childGrid.root.currentSelectedGrid = childGrid;
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
                    /**
                     * Chain of Responsibility Design Pattern
                     */
                    if (this.isSubgrid() && !this.isExpanded) {
                        this.isExpanded = true;
                        if (!isOnClick) {
                            this.parent.expandSubGridByRowId(this.parentRowId);
                        } else {
                            this.root.currentSelectedGrid = this;
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
                setSelectedRowId: function (rowId) {
                    if (this.root.currentSelectedGrid) {
                        /**
                         * if select the same row more than once, ingnor the rest selection.
                         * otherwise, saveCell() method will not work, because resetSelection() method
                         * will empty savedRow whitch is important for saveCell() method to work correctly.
                         */
                        if (this.root.currentSelectedGrid !== this || this.root.currentSelectedRowId !== rowId) {
                            gwGridService.unselectRow(this.root.currentSelectedGrid.gridElement);
                            this.root.currentSelectedGrid = this;
                            this.root.currentSelectedRowId = rowId;
                        }
                    } else {
                        var self = this;
                        this._scope.$applyAsync(function () {
                            //force view to update
                            self.root.currentSelectedGrid = self;
                            self.root.currentSelectedRowId = rowId;
                        });
                    }
                },
                hasSelectedRow: function () {
                    return this.root.currentSelectedRowId !== null;
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
                },
                _applyNewRowStyle: function (rowId) {
                    var tbody = this.gridElement.children("tbody").filter(":first");
                    var newRow = tbody.children("tr.jqgrow[id='" + rowId + "']").filter(":first");
                    newRow.removeClass("ui-state-highlight").addClass("gw-grid-new-row");
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
                                gwGridCtrl.resize();
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
                                var oldCellValue = null;
                                gwGridCtrl.gridElement = iEle.children("table").filter(":first").jqGrid({
                                    datatype: "local",
                                    cellEdit: true,
                                    cellsubmit: "clientArray",
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
                                    scrollrows: true,
                                    height: 400,
                                    beforeSelectRow: function (rowId, e) {
                                        //This event fire when the user CLICK on the row, but before select them. 
                                        gwGridCtrl.setSelectedRowId(rowId);
                                        return true;
                                    },
                                    onSelectRow: function (rowId, e) {
                                        //Raised immediately after row was clicked by setSelection(rowId,true)
                                        gwGridCtrl.setSelectedRowId(rowId);
                                    },
                                    afterInsertRow: function () {
                                        gwGridCtrl.setDirty();
                                    },
                                    formatCell: function () {
                                        //console.log(1);
                                    },
                                    beforeEditCell: function (rowid, cellname, oldValue) {
                                        //console.log(2);
                                        //oldCellValue = oldValue;
                                    },
                                    afterEditCell: function (rowid, cellname, value, iRow, iCol) {
                                        //console.log(3);
                                        var input = $(this).find(">tbody>tr.jqgrow>td>#" + rowid + "_" + cellname);
                                        input.one("input", function () {
                                            gwGridCtrl.setDirty();
                                        });
                                        input.one("blur", function () {
                                            gwGridCtrl.saveCellByIndex(iRow, iCol);
                                        });
                                    },
                                    beforeSaveCell: function () {
                                        //console.log(4);
                                    },
                                    beforeSubmitCell: function () {
                                        //console.log(5);
                                    },
                                    afterSaveCell: function () {
                                        //console.log(6);
                                    },
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
                                    },
                                });
                            });
                        }
                    };
                }
            };
            }]);
})(window.angular);
