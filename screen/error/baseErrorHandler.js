(function (angular) {
    /**
     * Template Design Pattern: Class's objects communication
     * All the error handler constructors share the same handle() method,
     * and each constructor will have their own display() method.
     * Flyweight Design Pattern: Class and Object composition
     * all the same error will share the same error handler instance;
     * Singleton Design Pattern
     * each type of error handler will only have one instance.
     */
    function BaseErrorHandler() {

    }

    angular.extend(BaseErrorHandler.prototype, {
        handle: function (error) {
            error.contentCtrl.activateTabById(error.tabId);
            this.display(error);
        },
        display: angular.noop
    });

    BaseErrorHandler.createSubClass = function (object) {
        return angular.extend(Object.create(BaseErrorHandler.prototype), object || {});
    };

    var errorHandler = new BaseErrorHandler();

    function baseErrorHandlerFactor() {
        return {
            create: function () {
                return errorHandler;
            }
        };
    }
    baseErrorHandlerFactor.$injector = [];

    angular.module("gw.screen.error.baseErrorHandler", [])
        .constant("GwBaseErrorHandler", BaseErrorHandler)
        .factory("gwBaseErrorHandlerFactor", baseErrorHandlerFactor);
})(window.angular);
