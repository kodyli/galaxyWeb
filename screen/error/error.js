(function (angular) {


    function errorFactory(GwErrorType, gwBaseErrorFactor, gwFieldErrorFactor, gwCellErrorFactor) {
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
                case GwErrorType.CELL_ERROR:
                    error = gwCellErrorFactor.create(errorData, errorHandler, context);
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
    errorFactory.$injector = ["GwErrorType", "gwBaseErrorFactor", "gwFieldErrorFactor", "gwCellErrorFactor"];



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
                var errors = this._errors = gwErrorFactory.createErrors(resData, function (error) {
                    screenCtrl.handleError(error);
                });
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

    angular.module("gw.screen.error", ["gw.screen.error.baseError", "gw.screen.error.fieldError", "gw.screen.error.cellError"])
        .value("GwErrorType", {
            FIELD_ERROR: "fieldError",
            CELL_ERROR: "cellError"
        })
        .factory("gwErrorFactory", errorFactory)
        .directive("gwError", errorDirective);
})(window.angular);
