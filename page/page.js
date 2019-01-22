(function (angular) {

    function PageService(screenHtml) {
        this.loadPage = function (screen) {
            return screenHtml.join("");
        };
    }
    PageService.$injector = ["screenHtml"];

    function pageDirective($compile, gwPageService) {

        function PageController($scope, $element) {
            this.appCtrl = nullAppController;
            this.element = $element;
            this._scope = $scope;
            this._pageScope = null;
        }

        PageController.$injector = ["$scope", "$element"];

        angular.extend(PageController.prototype, {
            loadPage: function (page) {
                return gwPageService.loadPage(page);
            },
            render: function (pageHtml, parentElement) {
                parentElement = parentElement || this.element;
                if (this._pageScope != null) {
                    this._pageScope.$destroy();
                }
                this._pageScope = this._scope.$new(true, this._scope);
                var iElement = $compile(pageHtml)(this._pageScope);
                parentElement.empty().append(iElement);
            }
        });
        return {
            controller: PageController,
            scope: {
                name: "=?"
            },
            require: ["gwPage", "^^?gwApp"],
            compile: function (tEle) {
                tEle.css({
                    display: "block"
                });
                return {
                    pre: function (scope, iEle, iAttr, ctrls) {
                        var gwPageCtrl = ctrls[0],
                            gwAppCtrl = ctrls[1] || gwPageCtrl.appCtrl;
                        gwAppCtrl.setPageController(gwPageCtrl);
                        scope.name = gwPageCtrl;
                    },
                    post: function (scope, iEle, iAttr, ctrls) {
                        var gwPageCtrl = ctrls[0];
                        if (iAttr.hasOwnProperty("autoLoad")) {
                            var pageHtml = gwPageCtrl.loadPage({});
                            gwPageCtrl.render(pageHtml, iEle);
                        }
                    }
                };
            }
        };
    }
    pageDirective.$injector = ["$compile", "gwPageService"];

    angular.module("gw.page", ["gw.screen"])
        .service("gwPageService", PageService)
        .directive("gwPage", pageDirective);
})(window.angular);
