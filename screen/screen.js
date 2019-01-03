(function (angular) {

    angular.module("gw.screen", ["gw.screen.error", "gw.screen.content"])
        .service("screenService", ["screenHtml", function (screenHtml) {
            var self = this;
            self.loadScreen = function (screen) {
                return screenHtml.join("");
            };
            self.handleError = function (error, $element) {
                $element.find("[ng-model$='" + error.ngModel + "']")
                    .filter(":first")
                    .select();
            };
        }])
        .controller("screenController", ["$scope", "$compile", "$element", "screenService", function ($scope, $compile, $element, screenService) {
            var self = this;
            var screenScope = null;
            self.loadScreen = function (pageNode) {
                var tElement = screenService.loadScreen(pageNode);
                if (screenScope != null) {
                    screenScope.$destroy();
                }
                screenScope = $scope.$new(true, $scope);
                var nodes = [
                    "<div",
                        "gw-layout><gw-content gw-layout-center>",
                            tElement,
                        "</gw-content><gw-error gw-layout-right></gw-error>",
                    "</div>"
                ];
                var iElement = $compile(nodes.join(""))(screenScope);
                $element.empty().append(iElement);
            };
            self.handleError = function (error) {
                screenService.handleError(error, $element);
            };
	}])
        .directive("gwScreen", function () {
            return {
                controller: "screenController",
                controllerAs: "screenCtrl",
                compile: function (tEle, tAttr) {
                    tEle.css({
                        display: "block"
                    });
                    return function (scope, iEle, iAttr, screenCtrl) {
                        if (iAttr.hasOwnProperty("autoLoad")) {
                            screenCtrl.loadScreen({});
                        }
                    };
                }
            };
        });

})(window.angular);
