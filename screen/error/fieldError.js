(function (angular) {
    function fieldErrorFactor(GwError) {
        function FieldError(data, errorHandler) {
            GwError.apply(this, arguments);
            this.ngModel = data.ngModel;
        }

        FieldError.prototype = GwError.createSubClass({
            contructor: FieldError,
        });

        return {
            create: function (data, errorHandler) {
                return new FieldError(data, errorHandler);
            }
        };
    }
    fieldErrorFactor.$injector = ["GwError"];

    angular.module("gw.screen.error.fieldError", ["gw.screen.error.baseError"])
        .factory("gwFieldErrorFactor", fieldErrorFactor);
})(window.angular);
