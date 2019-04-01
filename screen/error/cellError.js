(function (angular) {
    function cellErrorFactor(GwError) {
        function CellError(data, errorHandler) {
            GwError.apply(this, arguments);
            this.grid = this.contentCtrl.getGridById(data.gridId);
            this.rowId = data.rowId;
            this.colName = data.colName;
        }

        CellError.prototype = GwError.createSubClass({
            contructor: CellError
        });

        return {
            create: function (data, errorHandler) {
                return new CellError(data, errorHandler);
            }
        };
    }
    cellErrorFactor.$injector = ["GwError"];

    angular.module("gw.screen.error.cellError", ["gw.screen.error.baseError"])
        .factory("gwCellErrorFactor", cellErrorFactor);
})(window.angular);
