(function (angular) {
    angular.module("gw.dialog", [])
        .constant("dialogConfig", {
            modal: true,
            draggable: false,
            resizable: false,
            close: function () {
                $(this).dialog("destroy");
            }
        })
        .factory("dialog", ["dialogConfig", function (dialogConfig) {
            return {
                dialog: function (config) {
                    $("<div><p>" + config.msg + "</p></div>").dialog(angular.extend({}, dialogConfig, config));
                }
            };
        }])
        .directive("dialog", function () {});
})(window.angular);
