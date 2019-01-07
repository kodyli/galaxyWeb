(function (angular) {

    function PageService(screenHtml) {
        this.loadPage = function (screen) {
            return screenHtml.join("");
        };
    }
    PageService.$injector = ["screenHtml"];

    function PageController($scope, $compile, $element, pageService) {
        var self = this;
        var pageScope = null;
        self.loadPage = function (pageNode) {
            var tElement = pageService.loadPage(pageNode);
            if (pageScope != null) {
                pageScope.$destroy();
            }
            pageScope = $scope.$new(true, $scope);
            var iElement = $compile(tElement)(pageScope);
            $element.empty().append(iElement);
        };

    }
    PageController.$injector = ["$scope", "$compile", "$element", "pageService"];

    function PageDirective() {
        return {
            controller: "pageController",
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
    PageDirective.$injector = [];

    angular.module("gw.page", ["gw.screen"])
        .service("pageService", PageService)
        .controller("pageController", PageController)
        .directive("gwPage", PageDirective);
})(window.angular);
