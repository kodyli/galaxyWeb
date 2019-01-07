(function (angular) {

    function PageService(screenHtml) {
        this.loadPage = function (screen) {
            return screenHtml.join("");
        };
    }
    PageService.$injector = ["screenHtml"];

    function PageController($scope, $compile, $element, gwPageService) {
        var self = this;
        var pageScope = null;
        self.loadPage = function (pageNode) {
            var tElement = gwPageService.loadPage(pageNode);
            if (pageScope != null) {
                pageScope.$destroy();
            }
            pageScope = $scope.$new(true, $scope);
            var iElement = $compile(tElement)(pageScope);
            $element.empty().append(iElement);
        };

    }
    PageController.$injector = ["$scope", "$compile", "$element", "gwPageService"];

    function pageDirective() {
        return {
            controller: "gwPageController",
            controllerAs: "pageCtrl",
            compile: function (tEle, tAttr) {
                tEle.css({
                    display: "block"
                });
                return function (scope, iEle, iAttr, pageCtrl) {
                    if (iAttr.hasOwnProperty("autoLoad")) {
                        pageCtrl.loadPage({});
                    }
                };
            }
        };
    }
    pageDirective.$injector = [];

    angular.module("gw.page", ["gw.screen"])
        .service("gwPageService", PageService)
        .controller("gwPageController", PageController)
        .directive("gwPage", pageDirective);
})(window.angular);
