(function (angular) {
    function rowErrorHandlerFactor(GwBaseErrorHandler, gwCellErrorHandlerFactor) {


        function RowErrorHandler() {
            GwBaseErrorHandler.call(this);
        }

        RowErrorHandler.prototype = GwBaseErrorHandler.createSubClass({
            contructor: RowErrorHandler,
            display: function (error) {
                var grid = error.grid;
                grid.expand();
                grid.selectRow(error.rowId);
            }
        });

        /**
         * Decorator Design Pattern
         * RowErrorHandler will only select a row, right now 
         * we want row error handler not only select the row,
         * but also select the first editable cell.
         */
        function RowCellErrorHandler() {
            GwBaseErrorHandler.call(this);
            this._rowErrorHandler = new RowErrorHandler();
        }

        RowCellErrorHandler.prototype = GwBaseErrorHandler.createSubClass({
            contructor: RowCellErrorHandler,
            display: function (error) {
                var grid = error.grid;
                this._rowErrorHandler.display(error);
                grid.selectCell(error.rowId, "CustomerID");
            }
        });

        var rowErrorHandler = new RowCellErrorHandler();
        return {
            create: function () {
                /**
                 * Strategy Design Pattern
                 * When we need a new handler to handle row error, create a new one here
                 * and replace the old one.
                 */
                //return new RowErrorHandler(contentController);
                return rowErrorHandler;
            }
        };
    }
    rowErrorHandlerFactor.$injector = ["GwBaseErrorHandler", "gwCellErrorHandlerFactor"];

    angular.module("gw.screen.error.rowErrorHandler", ["gw.screen.error.baseErrorHandler"])
        .factory("gwRowErrorHandlerFactor", rowErrorHandlerFactor);
})(window.angular);
