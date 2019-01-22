(function (angular) {

    function Error(data, errorHandler, context) {
        this.tabId = data.tabId;
        this.message = data.message || "Unknown Error";
        this._errorHandler = errorHandler || angular.noop;
        this._context = context;
    }
    Error.prototype = angular.extend(Object.create(Error.prototype), {
        contructor: Error,
        display: angular.noop,
        toHtml: function () {
            var self = this;
            var a = $("<a>").attr("href", "#")
                .css({
                    "text-decoration": "none"
                })
                .text(self.message)
                .click(function (e) {
                    self.handle();
                    e.preventDefault();
                });
            return $("<li>").append(a);
        },
        handle: function () {
            this._errorHandler.call(this._context, this);
        }
    });

    Error.createSubClass = function (object) {
        return angular.extend(Object.create(Error.prototype), object || {});
    };

    function gwBaseErrorFactor() {
        return {
            create: function (data, errorHandler, context) {
                return new Error(data, errorHandler, context);
            }
        };
    }
    gwBaseErrorFactor.$injector = [];

    angular.module("gw.screen.error.baseError", [])
        .constant("GwError", Error)
        .factory("gwBaseErrorFactor", gwBaseErrorFactor);
})(window.angular);
