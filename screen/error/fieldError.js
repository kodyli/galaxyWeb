(function (angular) {
    function fieldErrorFactor(GwError) {
        function FieldError(data, errorHandler, context) {
            GwError.apply(this, arguments);
            this.ngModel = data.ngModel;
            this.message = "Field Error";
        }

        FieldError.prototype = GwError.createSubClass({
            contructor: FieldError,
            display: function (contentCtrl) {
                contentCtrl.getElement().find("[ng-model$='" + this.ngModel + "']")
                    .filter(":first")
                    .select();
            },
            toHtml: function () {
                var self = this;
                var a = $("<a>").attr("href", "#")
                    .text(self.message)
                    .click(function (e) {
                        self.handle();
                        e.preventDefault();
                    });
                return $("<li>").append(a);
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
