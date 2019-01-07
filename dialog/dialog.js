(function (angular) {

    function dialogFactory(gwDialogConfig) {
        return {
            dialog: dialog
        };

        function dialog(config) {
            $("<div><p>" + config.msg + "</p></div>").dialog(angular.extend({}, gwDialogConfig, config));
        }
    }
    dialogFactory.$injector = ["gwDialogConfig"];

    angular.module("gw.dialog", [])
        .constant("gwDialogConfig", {
            modal: true,
            draggable: false,
            resizable: true,
            classes: {
                "ui-dialog-titlebar-close": "hidden-titlebar-close"
            },
            closeOnEscape: false,
            close: function () {
                $(this).dialog("destroy");
            }
        })
        .factory("gwDialogFactory", dialogFactory);
})(window.angular);
