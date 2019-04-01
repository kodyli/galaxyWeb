(function (angular) {
    function errorFactory(GwErrorType, gwBaseErrorFactor, gwBaseErrorHandlerFactor, gwFieldErrorFactor, gwFieldErrorHandlerFactor, gwCellErrorFactor, gwCellErrorHandlerFactor, gwRowErrorFactor, gwRowErrorHandlerFactor) {
        return {
            createError: createError,
            createErrors: createErrors
        };
        /**
         * Simple Factory Design Pattern
         */
        function createError(errorData, gwContentCtrl) {
            errorData.contentCtrl= gwContentCtrl;
            var error = null;
            var errorHandler = null;
            switch (errorData.errorType) {
                case GwErrorType.FIELD_ERROR:
                    errorHandler = gwFieldErrorHandlerFactor.create();
                    error = gwFieldErrorFactor.create(errorData, errorHandler);
                    break;
                case GwErrorType.CELL_ERROR:
                    errorHandler = gwCellErrorHandlerFactor.create();
                    error = gwCellErrorFactor.create(errorData, errorHandler);
                    break;
                case GwErrorType.ROW_ERROR:
                    errorHandler = gwRowErrorHandlerFactor.create();
                    error = gwRowErrorFactor.create(errorData, errorHandler);
                    break;
                default:
                    errorHandler = gwBaseErrorHandlerFactor.create();
                    error = gwBaseErrorFactor.create(errorData, errorHandler);
            }
            return error;
        }

        function createErrors(resData, gwContentCtrl) {
            var errors = [];
            angular.forEach(resData, function (errorData) {
                if (errorData) {
                    errors.push(createError(errorData, gwContentCtrl));
                } else {
                    throw "Invalid Error Data."
                }
            });
            return errors;
        }
    }
    errorFactory.$injector = ["GwErrorType", "gwBaseErrorFactor", "gwBaseErrorHandlerFactor", "gwFieldErrorFactor", "gwFieldErrorHandlerFactor", "gwCellErrorFactor", "gwCellErrorHandlerFactor"];



    function errorDirective(gwErrorFactory) {

        function ErrorController($element) {
            this.screenCtrl = nullScreenController;
            this._errors = [];
            this._element = $element;
            this._ol = $("<ol>");
        }

        ErrorController.$injector = ["$element", "gwErrorFactory"];
        angular.extend(ErrorController.prototype, {
            attachError: function (errorData) {
                var screenCtrl = this.screenCtrl;
                var error = gwErrorFactory.createError(errorData, function (error) {
                    screenCtrl.handleError(error);
                });
                this._ol.append(error.toHtml());
            },
            clearErrors: function (closeErrorPanel) {
                this._errors = [];
                this._ol.empty();
                closeErrorPanel = closeErrorPanel === true ? true : false;
                if (closeErrorPanel) {
                    this.screenCtrl.closeErrorPanel();
                }
            },
            hasErrors: function () {
                return this._errors.length > 0;
            },
            handleErrors: function (resData) {
                this.clearErrors();
                var screenCtrl = this.screenCtrl;
                var errors = this._errors = gwErrorFactory.createErrors(resData, screenCtrl.getContentController());
                this._render(errors, this._element);
                if (errors.length > 0) {
                    screenCtrl.openErrorPanel();
                } else {
                    screenCtrl.closeErrorPanel();
                }
            },
            _render: function (errors, parentElement) {
                var ol = this._ol,
                    parentElement = parentElement || this._element;
                angular.forEach(errors, function (error) {
                    ol.append(error.toHtml());
                });
                parentElement.append(ol);
            },
        });

        return {
            controller: ErrorController,
            scope: {
                name: "=?"
            },
            require: ["gwError", "^^?gwScreen"],
            compile: function () {
                return {
                    pre: function (scope, iEle, iAttr, ctrls) {
                        var gwErrorCtrl = ctrls[0],
                            gwScreenCtrl = ctrls[1] || nullScreenController;
                        gwScreenCtrl.setErrorController(gwErrorCtrl);
                        scope.name = gwErrorCtrl;
                    },
                    post: function (scope, iEle, iAttr, ctrls) {

                    }
                }
            }
        };
    }
    errorDirective.$injector = ["gwErrorFactory"];

    angular.module("gw.screen.error", ["gw.screen.error.baseError", "gw.screen.error.baseErrorHandler", "gw.screen.error.fieldError", "gw.screen.error.fieldErrorHandler", "gw.screen.error.cellError", "gw.screen.error.cellErrorHandler", "gw.screen.error.rowError", "gw.screen.error.rowErrorHandler"])
        .value("GwErrorType", {
            FIELD_ERROR: "fieldError",
            CELL_ERROR: "cellError",
            ROW_ERROR: "rowError"
        })
        .factory("gwErrorFactory", errorFactory)
        .directive("gwError", errorDirective);
})(window.angular);
