(function (angular) {


    function errorFactory(GwErrorType, gwBaseErrorFactor, gwFieldErrorFactor) {
        return {
            createError: createError,
            createErrors: createErrors
        };

        function createError(errorData, errorHandler, context) {
            var error = null;
            switch (errorData.errorType) {
                case GwErrorType.FIELD_ERROR:
                    error = gwFieldErrorFactor.create(errorData, errorHandler, context);
                    break;
                default:
                    error = gwBaseErrorFactor.create(errorData, errorHandler, context);
            }
            return error;
        }

        function createErrors(resData, errorHandler, context) {
            var errors = [];
            angular.forEach(resData, function (errorData) {
                if (errorData) {
                    errors.push(createError(errorData, errorHandler, context));
                } else {
                    throw "Invalid Error Data."
                }
            });
            return errors;
        }
    }
    errorFactory.$injector = ["GwErrorType", "gwBaseErrorFactor", "gwFieldErrorFactor"];

    function ErrorController($element, gwErrorFactory) {
        var errors = [],
            screenCtrl = null,
            ol = $("<ol>");
        this.setScreenController = function (screenController) {
            screenCtrl = screenController;
        };
        this.handleErrors = function (resData) {
            this.clearErrors();
            errors = gwErrorFactory.createErrors(resData, function (error) {
                screenCtrl.handleError(error);
            });
            this._render(errors);
            if (errors.length > 0) {
                screenCtrl.openErrorPanel();
            } else {
                screenCtrl.closeErrorPanel();
            }
        };

        this.attachError = function (errorData) {
            var error = gwErrorFactory.createError(errorData, function (error) {
                screenCtrl.handleError(error);
            });
            ol.append(error.toHtml());
        };
        this.clearErrors = function (closeErrorPanel) {
            errors = [];
            closeErrorPanel = closeErrorPanel === true ? true : false;
            this._render(errors);
            if (closeErrorPanel) {
                screenCtrl.closeErrorPanel();
            }
        };
        this.hasErrors = function () {
            return errors.length > 0;
        }
        this._render = function (errors) {
            if (errors.length > 0) {
                angular.forEach(errors, function (error) {
                    ol.append(error.toHtml());
                });
                $element.append(ol);
            } else {
                ol.empty();
            }
        };
    }

    ErrorController.$injector = ["$element", "gwErrorFactory"];

    function errorDirective() {
        return {
            controller: "gwErrorController",
            controllerAs: "gwErrorCtrl",
            require: ["gwError", "^^gwScreen"],
            link: function (scope, iEle, iAttr, ctrls) {
                ctrls[1].setErrorController(ctrls[0]);
            }
        };
    }
    errorDirective.$injector = [];

    angular.module("gw.screen.error", ["gw.screen.error.baseError", "gw.screen.error.fieldError"])
        .value("GwErrorType", {
            FIELD_ERROR: "fieldError"
        })
        .factory("gwErrorFactory", errorFactory)
        .controller("gwErrorController", ErrorController)
        .directive("gwError", errorDirective);
})(window.angular);
