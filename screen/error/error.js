(function (angular) {
    var i = 0;
    angular.module("gw.screen.error", [])
        .value("ErrorType", {
            FIELD_ERROR: "fieldError"
        })
        .factory("errorFactory", ["ErrorType", function (ErrorType) {

            function Error(data, errorHandler, context) {
                this.message = "Unknown Error";
                this._errorHandler = errorHandler || angular.noop;
                this._context = context;
            }
            Error.prototype = angular.extend(Object.create(Object.prototype), {
                contructor: Error,
                handle: function () {
                    this._errorHandler.call(this._context, this);
                },
                toHtml: function () {
                    return "";
                }
            });

            function FieldError(data, errorHandler, context) {
                Error.apply(this, arguments);
                this.ngModel = data.ngModel;
                this.message = "Field Error";
            }
            FieldError.prototype = angular.extend(Object.create(Error.prototype), {
                contructor: FieldError,
                handle: function () {
                    Error.prototype.handle.call(this);
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
                createErrors: function (resData, errorHandler, context) {
                    var errors = [];
                    angular.forEach(resData, function (errorData) {
                        if (errorData) {
                            switch (errorData.errorType) {
                                case ErrorType.FIELD_ERROR:
                                    errors.push(new FieldError(errorData, errorHandler, context));
                                    break;
                                default:
                                    errors.push(new Error(errorData, errorHandler, context));
                            }
                        } else {
                            throw "Invalid Error Data."
                        }
                    });
                    return errors;
                }
            };
	}])
        .service("errorService", function () {
            this.getErrorsHandler = function (scope) {
                var parent = scope;
                while (!parent.errorCtrl) {
                    parent = parent.$parent;
                }
                var errorCtrl = parent.errorCtrl;
                return function errorsHandler(resData) {
                    errorCtrl.handleErrors(resData);
                    return errorCtrl.hasErrors();
                };
            };
            this.getDialogErrorsHandler = function (scope) {
                var errorCtrl = scope.errorCtrl;
                return function errorsHandler(resData) {
                    errorCtrl.handleErrors(resData);
                    return errorCtrl.hasErrors();
                };
            }
        })
        .controller("errorController", ["$scope", "$element", "errorFactory", function ($scope, $element, errorFactory) {
            var self = this;
            var errors = [];
            this.i = i = i + 1;
            self.handleErrors = function (resData) {
                self.clearErrors();
                errors = errorFactory.createErrors(resData, function (error) {
                    $scope.screenCtrl.handleError(error);
                });
                self._render(errors);
                if (errors.length > 0) {
                    $scope.gwLayoutCtrl.openRightPanel();
                } else {
                    $scope.gwLayoutCtrl.closeRightPanel();
                }
            };
            self.clearErrors = function () {
                errors = [];
                self._render(errors);
            };
            self.hasErrors = function () {
                return errors.length > 0;
            }
            self._render = function (errors) {
                if (errors.length > 0) {
                    var ol = $("<ol>");
                    angular.forEach(errors, function (error) {
                        ol.append(error.toHtml());
                    });
                    $element.append(ol);
                } else {
                    $element.empty();
                }
            };
	}])
        .directive("gwError", function () {
            return {
                controller: "errorController",
                controllerAs: "errorCtrl",
                link: function (scope) {
                    console.log("gwError", scope);
                }
            };
        });
})(window.angular);
