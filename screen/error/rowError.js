(function (angular) {
    function rowErrorFactor(GwError) {
        function RowError(data, errorHandler) {
            GwError.apply(this, arguments);
            this.grid = this.contentCtrl.getGridById(data.gridId);
            this.rowId = data.rowId;
        }

        RowError.prototype = GwError.createSubClass({
            contructor: RowError
        });

        return {
            create: function (data, errorHandler) {
                return new RowError(data, errorHandler);
            }
        };
    }
    rowErrorFactor.$injector = ["GwError"];

    angular.module("gw.screen.error.rowError", ["gw.screen.error.baseError"])
        .factory("gwRowErrorFactor", rowErrorFactor);
})(window.angular);