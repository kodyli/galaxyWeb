(function (angular) {
    function cellErrorFactor(GwError) {
        function CellError(data, errorHandler, context) {
            GwError.apply(this, arguments);
            this.gridId = data.gridId;
            this.rowId = data.rowId;
            this.colName = data.colName;
        }

        CellError.prototype = GwError.createSubClass({
            contructor: CellError,
            display: function (gwContentCtrl) {
                var grid = gwContentCtrl.getGridById(this.gridId);
                grid.selectCell(this.rowId, this.colName);
            }
        });

        return {
            create: function (data, errorHandler, context) {
                return new CellError(data, errorHandler, context);
            }
        };
    }
    cellErrorFactor.$injector = ["GwError"];

    angular.module("gw.screen.error.cellError", ["gw.screen.error.baseError"])
        .factory("gwCellErrorFactor", cellErrorFactor);
})(window.angular);
