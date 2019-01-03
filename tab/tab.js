(function (angular) {
    angular.module("gw.tab", ["gw.dialog"])
        .directive("gwTabs", ["dialog", function (dialog) {
            function GwTabsController() {
                this.element = null;
                this.tabs = [];
            }

            angular.extend(GwTabsController.prototype, {
                disable: function (tab) {
                    this.element.tabs("disable", "#" + tab.tabId);
                },
                enable: function (tab) {
                    this.element.tabs("enable", "#" + tab.tabId);
                },
                disableSiblings: function (tab, disabled) {
                    var self = this;
                    this.tabs.forEach(function (_tab) {
                        if (_tab.tabId !== tab.tabId) {
                            if (disabled) {
                                self.disable(_tab);
                            } else {
                                self.enable(_tab);
                            }
                        }
                    });
                },
                attach: function (tab) {
                    tab.gwTabsCtrl = this;
                    this.tabs.push(tab);
                },
                getTabById: function (tabId) {
                    var currentTab = null;
                    this.tabs.every(function (tab) {
                        if (tab.tabId === tabId) {
                            currentTab = tab;
                            return false;
                        }
                        return true;
                    });
                    return currentTab;
                },
                select: function (tab) {
                    tab.isActivated = true;
                    var a = this.element.find("a[href='#" + tab.tabId + "']").filter(":first").trigger("click");
                }
            });

            GwTabsController.$injector = [];

            return {
                restrict: "E",
                controller: GwTabsController,
                controllerAs: "gwTabsCtrl",
                transclude: true,
                template: "<ul><li ng-repeat='tab in gwTabsCtrl.tabs'><a href='#{{tab.tabId}}'>{{tab.tabTitle}}</a></li></ul><div ng-transclude></div>",
                scope: {},
                compile: function (tEle) {
                    tEle.css({
                        display: "block"
                    });
                    return function (scope, iEle, iAttr, gwTabsCtrl) {
                        iEle.ready(function () {
                            var disabledTabIndexes = [];
                            gwTabsCtrl.tabs.forEach(function (tab, index) {
                                if (tab.disabled) {
                                    disabledTabIndexes.push(index);
                                }
                            });
                            gwTabsCtrl.element = iEle.tabs({
                                disabled: disabledTabIndexes,
                                beforeActivate: function (event, ui) {
                                    var newPanelId = ui.newPanel.attr("id");
                                    var newTab = gwTabsCtrl.getTabById(newPanelId)
                                    if (!newTab.isActivated && newTab.hasSaveWarning) {
                                        dialog.dialog({
                                            title: "Warning",
                                            msg: "Your changes are not saved yet, do you want to switch tab?",
                                            buttons: {
                                                "Yes": function () {
                                                    $(this).dialog("close");
                                                    gwTabsCtrl.select(newTab);
                                                },
                                                "No": function () {
                                                    $(this).dialog("close");
                                                    ui.oldTab.focus();
                                                }
                                            }
                                        });
                                        event.preventDefault();
                                    }
                                },
                                activate: function (event, ui) {
                                    var tabId = ui.newPanel.attr("id");
                                    gwTabsCtrl.getTabById(tabId).activated();
                                }
                            });
                        });
                    }
                }
            };
        }])
        .directive("gwTab", function () {

            function GwTabController($scope) {
                this.tabId = $scope.tabId;
                this.tabTitle = $scope.tabTitle;
                this.isActivated = false;
                this._activatedHandlers = [];
                this.hasSaveWarning = false;
                this.disabled = true;
                this.gwTabsCtrl = null;
            }

            angular.extend(GwTabController.prototype, {
                disable: function () {
                    this.gwTabsCtrl.disable(this);
                },
                enable: function () {
                    this.gwTabsCtrl.enable(this);
                },
                disableSiblings: function (disabled) {
                    this.gwTabsCtrl.disableSiblings(this, disabled);
                },
                afterActivated: function (handler, context) {
                    this._activatedHandlers.push({
                        handler: handler,
                        context: context
                    });
                },
                activated: function () {
                    this._activatedHandlers.forEach(function (obj) {
                        obj.handler.apply(obj.context, arguments);
                    });
                }
            });

            GwTabController.$injector = ["$scope"];

            return {
                require: ['gwTab', '^^gwTabs'],
                restrict: "E",
                transclude: true,
                scope: {
                    tabId: '@',
                    tabTitle: '@',
                    tabInstance: '=?'
                },
                controller: GwTabController,
                controllerAs: 'gwTabCtrl',
                template: "<div id='{{gwTabCtrl.tabId}}' ng-transclude></div>",
                compile: function (tEle) {
                    tEle.css({
                        display: "block"
                    });
                    return function (scope, iEle, iAttr, ctrls) {
                        var gwTabCtrl = ctrls[0],
                            gwTabsCtrl = ctrls[1];
                        gwTabCtrl.hasSaveWarning = iAttr.saveWarning;
                        gwTabCtrl.disabled = !iAttr.enable;
                        if (iAttr.hasOwnProperty("disableSiblings")) {

                            gwTabCtrl.disabled = false;
                        }
                        scope.tabInstance = gwTabCtrl;
                        gwTabsCtrl.attach(gwTabCtrl);
                    }
                }
            };
        });
})(window.angular);
