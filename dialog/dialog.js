(function (angular) {

    function dialogFactory() {
        return {
            dialog: dialog
        };

        function dialog(config) {
            $("<div><p>" + config.msg + "</p></div>").dialog(config);
        }
    }
    dialogFactory.$injector = [];

    angular.module("gw.dialog", [])
        .config(function () {
            /**
             * Redefining Widgets
             * Instead of creating a new widget, we can pass $.widget()
             * an existing widget's name and constructor to redefine it. 
             */
            $.widget("ui.dialog", $.ui.dialog, {
                options: {
                    modal: true,
                    draggable: false,
                    resizable: true,
                    closeOnEscape: false,
                    classes: {
                        "ui-dialog-titlebar-close": "hidden-titlebar-close"
                    }
                },
                close: function (event) {
                    this._superApply(arguments);
                    this._destroy();
                }
            });
        })
        .factory("gwDialogFactory", dialogFactory);
})(window.angular);