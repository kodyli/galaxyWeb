(function (angular) {
    function fieldErrorFactor(GwError) {
        function FieldError(data, errorHandler, context) {
            GwError.apply(this, arguments);
            this.ngModel = data.ngModel;
        }

        FieldError.prototype = GwError.createSubClass({
            contructor: FieldError,
            display: function (gwContentCtrl) {
                gwContentCtrl.element.find("[ng-model$='" + this.ngModel + "']").filter(":first").select();
            }
        });

        return {
            create: function (data, errorHandler, context) {
                return new FieldError(data, errorHandler, context);
            }
        };
    }
    fieldErrorFactor.$injector = ["GwError"];

    angular.module("gw.screen.error.fieldError", ["gw.screen.error.baseError"])
        .factory("gwFieldErrorFactor", fieldErrorFactor);
})(window.angular);
