(function (angular) {
    function cellErrorHandlerFactor(GwBaseErrorHandler) {

        function CellErrorHandler() {
            GwBaseErrorHandler.call(this);
            this._grid = null;
        }

        CellErrorHandler.prototype = GwBaseErrorHandler.createSubClass({
            contructor: CellErrorHandler,
            display: function (error) {
                var grid = error.grid;
                grid.expand();
                grid.selectCell(error.rowId, error.colName);
            }
        });
        var cellErrorHandler = new CellErrorHandler()
        return {
            create: function () {
                return cellErrorHandler;
            }
        };
    }
    cellErrorHandlerFactor.$injector = ["GwBaseErrorHandler"];

    angular.module("gw.screen.error.cellErrorHandler", ["gw.screen.error.baseErrorHandler"])
        .factory("gwCellErrorHandlerFactor", cellErrorHandlerFactor);
})(window.angular);
