(function (angular) {
    function fieldErrorHandlerFactor(GwBaseErrorHandler) {

        function FieldErrorHandler() {
            GwBaseErrorHandler.call(this);
        }

        FieldErrorHandler.prototype = GwBaseErrorHandler.createSubClass({
            contructor: FieldErrorHandler,
            display: function (error) {
                /**
                 * jquery select() function has different behavors between google, IE, and firefox,
                 * double check: google has a blue solid border aroud the input element; IE has a black dot border;
                 * firefox no border;
                 * so there is a chance to refactor this method. 
                 * this is one of the reasons why we want to seperate the error and its error 
                 * handler.
                 */
                error.contentCtrl.element.find("[ng-model$='" + error.ngModel + "']").filter(":first").select();
            }
        });
        var fieldErrorHandler = new FieldErrorHandler();
        return {
            create: function () {
                return fieldErrorHandler;
            }
        };
    }
    fieldErrorHandlerFactor.$injector = ["GwBaseErrorHandler"];

    angular.module("gw.screen.error.fieldErrorHandler", ["gw.screen.error.baseErrorHandler"])
        .factory("gwFieldErrorHandlerFactor", fieldErrorHandlerFactor);
})(window.angular);
