(function (angular) {

    function Error(data, errorHandler) {
        this.contentCtrl = data.contentCtrl;
        this.tabId = data.tabId;
        this.message = data.message || "Unknown Error";
        this._errorHandler = errorHandler || angular.noop;
    }
    Error.prototype = angular.extend(Object.create(Error.prototype), {
        contructor: Error,
        toHtml: function () {
            var self = this;
            var a = $("<a>").attr("href", "#")
                .css({
                    "text-decoration": "none"
                })
                .text(self.message)
                .click(function (e) {
                    self._errorHandler.handle(self);
                    e.preventDefault();
                });
            return $("<li>").append(a);
        }
    });

    Error.createSubClass = function (object) {
        return angular.extend(Object.create(Error.prototype), object || {});
    };

    function gwBaseErrorFactor() {
        return {
            create: function (data, errorHandler) {
                return new Error(data, errorHandler);
            }
        };
    }
    gwBaseErrorFactor.$injector = [];

    angular.module("gw.screen.error.baseError", [])
        .constant("GwError", Error)
        .factory("gwBaseErrorFactor", gwBaseErrorFactor);
})(window.angular);
