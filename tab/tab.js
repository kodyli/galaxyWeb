var nullTabController = {
    activate: angular.noop,
    activateTabById: angular.noop
};
(function (angular) {
    angular.module("gw.tab", ["gw.dialog"])
        .factory("gwTabsService", function () {
            /**
             * Helper functions that import from JQuery UI Tabs Widget.
             * Adapter Design Pattern.
             */
            return {
                activateTabByIndex: activateTabByIndex,
                disableTabsByIndex: disableTabsByIndex,
                enableTabsByIndex: enableTabsByIndex
            };

            function activateTabByIndex(element, tabIndex) {
                element.tabs("option", "active", tabIndex);
            }

            function disableTabsByIndex(element, tabIndexes) {
                element.tabs("option", "disabled", tabIndexes);
            }

            function enableTabsByIndex(element, tabIndexes) {
                var disabledTabIndexes = element.tabs("option", "disabled");
                if (angular.isArray(disabledTabIndexes)) {
                    var self = this,
                        newDisabledTabIndexes = [];
                    disabledTabIndexes.forEach(function (tabIndex) {
                        if (tabIndexes.indexOf(tabIndex) < 0) {
                            newDisabledTabIndexes.push(tabIndex);
                        }
                    });
                    disableTabsByIndex(element, newDisabledTabIndexes);
                }
            }
        })
        .directive("gwTabs", ["gwTabsService", "gwDialogFactory", function (gwTabsService, gwDialogFactory) {
            /**
             * Mediator Design Pattern
             */
            function TabsController() {
                this.element = null;
                this.tabs = [];
            }
            angular.extend(TabsController.prototype, {
                /**
                 * Add a new tab.
                 * @public
                 * @param {Tab} tab A new tab that will be attached to the tabs.
                 */
                attach: function (tab) {
                    tab.gwTabsCtrl = this;
                    this.tabs.push(tab);
                },
                /**
                 * Disable the sibling tabs of a tab.
                 * @public
                 * @param {Tab} tab
                 */
                disableSiblings: function (tab) {
                    var indexes = this._getSiblingTabIndexes(tab, function (siblingTab) {
                        siblingTab.isDisabled = true;
                    });
                    gwTabsService.disableTabsByIndex(this.element, indexes);
                },
                /**
                 * Enable the sibling tabs of a tab.
                 * @public
                 * @param {Tab} tab
                 */
                enableSiblings: function (tab) {
                    var self = this,
                        indexes = this._getSiblingTabIndexes(tab, function (siblingTab) {
                            siblingTab.isDisabled = false;
                        });
                    gwTabsService.enableTabsByIndex(this.element, indexes);
                },
                /**
                 * Active a tab.
                 * @public
                 * @param {id} tab's id
                 */
                activateTabById: function (id) {
                    this.activate(this.getTabById(id));
                },
                /**
                 * Active a tab.
                 * @public
                 * @param {Tab} tab
                 */
                activate: function (tab) {
                    var index = this.tabs.indexOf(tab);
                    if (index >= 0 && !tab.isActive) {
                        tab.isActive = true;
                        gwTabsService.activateTabByIndex(this.element, index);
                    }
                },
                /**
                 * Get a tab by the tab's id.
                 * @public
                 * @param {string} id a tab's id
                 */
                getTabById: function (id) {
                    var currentTab = null;
                    this.tabs.every(function (tab) {
                        if (tab.id === id) {
                            currentTab = tab;
                            return false;
                        }
                        return true;
                    });
                    return currentTab;
                },
                getDisabledTabIndexes: function () {
                    var disabledTabIndexes = [];
                    this.tabs.forEach(function (tab, index) {
                        if (tab.isDisabled) {
                            disabledTabIndexes.push(index);
                        }
                    });
                    return disabledTabIndexes;
                },
                _getSiblingTabIndexes: function (tab, callBack) {
                    var siblingTabIndexes = [],
                        callBack = callBack || function (siblingTab) {};
                    this.tabs.forEach(function (_tab, index) {
                        if (_tab.id !== tab.id) {
                            siblingTabIndexes.push(index);
                            callBack.call(null, _tab);
                        }
                    });
                    return siblingTabIndexes;
                }
            });

            TabsController.$injector = [];

            return {
                restrict: "E",
                controller: TabsController,
                controllerAs: "gwTabsCtrl",
                transclude: true,
                template: "<ul><li ng-repeat='tab in gwTabsCtrl.tabs'><a href='#{{tab.id}}'>{{tab.title}}</a></li></ul><div ng-transclude></div>",
                scope: {
                    name: "=?"
                },
                require: ["gwTabs", "?^^gwContent"],
                compile: function (tEle) {
                    tEle.css({
                        display: "block"
                    });
                    return {
                        pre: function (scope, iEle, iAttr, ctrls) {
                            var gwTabsCtrl = ctrls[0];
                            gwContentCtrl = ctrls[1] || nullContentController;
                            gwContentCtrl.setTabsController(gwTabsCtrl);
                            scope.name = gwTabsCtrl;
                        },
                        post: function (scope, iEle, iAttr, ctrls) {
                            var gwTabsCtrl = ctrls[0];
                            iEle.ready(function () {
                                gwTabsCtrl.element = iEle.tabs({
                                    disabled: gwTabsCtrl.getDisabledTabIndexes(),
                                    beforeActivate: beforeActivate,
                                    activate: activate
                                });
                            });

                            function beforeActivate(event, ui) {
                                var newPanelId = ui.newPanel.attr("id");
                                var newTab = gwTabsCtrl.getTabById(newPanelId)
                                if (!newTab.isActive && newTab.hasSaveWarning) {
                                    gwDialogFactory.dialog({
                                        title: "Warning",
                                        msg: "Your changes are not saved yet, do you want to switch tab?",
                                        buttons: {
                                            "Yes": function () {
                                                $(this).dialog("close");
                                                gwTabsCtrl.activate(newTab);
                                            },
                                            "No": function () {
                                                $(this).dialog("close");
                                                ui.oldTab.focus();
                                            }
                                        }
                                    });
                                    event.preventDefault();
                                }
                            }

                            function activate(event, ui) {
                                var newTabId = ui.newPanel.attr("id");
                                gwTabsCtrl.getTabById(newTabId).activate();
                                var oldTabId = ui.oldPanel.attr("id");
                                gwTabsCtrl.getTabById(oldTabId).deactivate();
                            }
                        }
                    };
                }
            };
        }])
        .directive("gwTab", function () {

            function TabController($scope) {
                this.id = $scope.id;
                this.title = $scope.title;
                this.isDisabled = true; //is this tab disabled
                this.isActive = false; //is this tab currently open
                this.hasSaveWarning = false;
                this.gwTabsCtrl = null;
                this._activatedHandlers = [{
                    handler: function () {
                        this.isActive = true;
                    },
                    context: this
                }];
                this._deactivatedHandlers = [{
                    handler: function () {
                        this.isActive = false;
                    },
                    context: this
                }];
            }

            angular.extend(TabController.prototype, {
                /**
                 * Bind an event handler to the "activate" event, or tigger the events.
                 * @public
                 * @param { Function } handler A function to execute each time the event is triggered.
                 * @param { Object } context An object which handler function should be evaluated in.
                 */
                activate: function (handler, context) {
                    if (angular.isFunction(handler)) {
                        this._activatedHandlers.push({
                            handler: handler,
                            context: context
                        });
                    } else {
                        this._activatedHandlers.forEach(function (obj) {
                            obj.handler.apply(obj.context);
                        });
                    }
                },
                /**
                 * Bind an event handler to the "deactivate" event, or tigger the events.
                 * @public
                 * @param { Function } handler A function to execute each time the event is triggered.
                 * @param { Object } context An object which handler function should be evaluated in.
                 */
                deactivate: function (handler, context) {
                    if (angular.isFunction(handler)) {
                        this._deactivatedHandlers.push({
                            handler: handler,
                            context: context
                        });
                    } else {
                        this._deactivatedHandlers.forEach(function (obj) {
                            obj.handler.apply(obj.context, arguments);
                        });
                    }
                },
                /**
                 * Enable the sibling tabs.
                 * @public
                 * @returns {Function} Returns a function that can be used to active a sibling tab by id.
                 */
                enableSiblings: function () {
                    var self = this;
                    self.gwTabsCtrl.enableSiblings(self);
                    return function activeSibling(tabId) {
                        var gwTabsCtrl = self.gwTabsCtrl;
                        gwTabsCtrl.activate(gwTabsCtrl.getTabById(tabId));
                    };
                }
            });

            TabController.$injector = ["$scope"];

            return {
                require: ['gwTab', '^^gwTabs'],
                restrict: "E",
                transclude: true,
                scope: {
                    id: '@',
                    title: '@',
                    name: '=?'
                },
                controller: TabController,
                controllerAs: 'gwTabCtrl',
                template: "<div id='{{gwTabCtrl.id}}' ng-transclude></div>",
                compile: function (tEle) {
                    tEle.css({
                        display: "block"
                    });
                    return {
                        pre: function (scope, iEle, iAttr, ctrls) {
                            var gwTabCtrl = ctrls[0],
                                gwTabsCtrl = ctrls[1];
                            gwTabsCtrl.attach(gwTabCtrl);
                            scope.name = gwTabCtrl;
                        },
                        post: function (scope, iEle, iAttr, ctrls) {
                            var gwTabCtrl = ctrls[0],
                                gwTabsCtrl = ctrls[1];
                            if (iAttr.hasOwnProperty("enable")) {
                                gwTabCtrl.isDisabled = false;
                            }
                            if (iAttr.hasOwnProperty("active")) {
                                gwTabCtrl.isActive = true;
                            }
                            if (iAttr.hasOwnProperty("disableSiblings")) {
                                gwTabCtrl.isDisabled = false;
                                gwTabCtrl.isActive = true;
                                gwTabCtrl.activate(function () {
                                    gwTabsCtrl.disableSiblings(gwTabCtrl);
                                });
                            }
                            if (iAttr.hasOwnProperty("saveWarning")) {
                                gwTabCtrl.hasSaveWarning = true;
                            }
                        }
                    }
                }
            };
        });
})(window.angular);
