(function (angular, $) {
    angular.module("gw.menu", [])
        .value("NodeType", {
            PAGE: "page",
            FOLDER: "folder"
        })
        .factory("menuFactory", ["NodeType", "screenHtml", function (NodeType, screenHtml) {

            function ANode(data, parentNode) {
                this.id = data.id;
                this.name = data.name;
                this.parent = parentNode || null;
            }
            ANode.prototype = angular.extend(Object.create(Object.prototype), {
                constructor: ANode,
                collapse: angular.noop,
                expand: angular.noop,
                toHtml: function () {
                    return $("<a>")
                        .attr("href", "#")
                        .css("text-decoration", "none");
                }
            });

            function Page(data, parentNode, pageSelectedHandler, context) {
                ANode.apply(this, arguments);
                this._pageSelectedHandler = pageSelectedHandler;
                this._context = context;
            }
            Page.prototype = angular.extend(Object.create(ANode.prototype), {
                constructor: Page,
                expand: function () {
                    this._pageSelectedHandler.call(this._context, this);
                },
                toHtml: function () {
                    var self = this,
                        span = $("<span>"),
                        a = ANode.prototype.toHtml.call(this);
                    span.text(self.name).addClass("menu-item page");
                    a.append(span).click(function (e) {
                        self.expand();
                        e.preventDefault();
                    });
                    return $("<li>").append(a);
                }
            });

            function Folder(data, parentNode) {
                ANode.apply(this, arguments);
                this.nodes = this._createNodes(data.childNodes, data.pageSelectedHandler, data.context);
                this._ul = $("<ul>").hide();
                this._span = $("<span>").text(this.name).addClass("menu-item folder-close");
            }
            Folder.prototype = angular.extend(Object.create(ANode.prototype), {
                constructor: Folder,
                collapse: function () {
                    this._collapseChildNodes();
                    this._collapse();
                },
                expand: function () {
                    this._collapseSiblingNodes();
                    this._expand();
                },
                toHtml: function () {
                    var self = this,
                        a = ANode.prototype.toHtml.call(this);
                    a.append(self._span).click(function (e) {
                        if (self._isCollapsed()) {
                            self.expand();
                        } else {
                            self.collapse();
                        }
                        e.preventDefault();
                    });
                    angular.forEach(self.nodes, function (node) {
                        self._ul.append(node.toHtml());
                    });
                    return $("<li>").append(a).append(self._ul);
                },
                _createNodes: function (childNodesData, pageSelectedHandler, context) {
                    var nodes = [];
                    angular.forEach(childNodesData, function (node) {
                        switch (node.type) {
                            case NodeType.PAGE:
                                nodes.push(new Page(node, this, pageSelectedHandler, context));
                                break;
                            case NodeType.FOLDER:
                                nodes.push(new Folder(angular.extend(node, {
                                    pageSelectedHandler: pageSelectedHandler || angular.noop,
                                    context: context
                                }), this));
                                break;
                            default:
                                throw "Invalid Type.";
                        }
                    }, this);
                    return nodes.sort(function (pre, next) {
                        return pre.name < next.name ? -1 : 1;
                    });
                },
                _isCollapsed: function () {
                    return !this._ul.is(":visible");
                },
                _collapse: function () {
                    this._span.removeClass("folder-open")
                        .addClass("folder-close");
                    this._ul.hide();
                },
                _collapseChildNodes: function () {
                    angular.forEach(this.nodes, function (childNode) {
                        childNode.collapse();
                    });
                },
                _collapseSiblingNodes: function () {
                    var self = this;
                    if (self.parent) {
                        angular.forEach(self.parent.nodes, function (siblingNode) {
                            if (siblingNode !== self) {
                                siblingNode.collapse();
                            }
                        });
                    }
                },
                _expand: function () {
                    this._span.removeClass("folder-close")
                        .addClass("folder-open");
                    this._ul.show();
                }
            });

            return {
                createNodes: function (resData, pageSelectedHandler, context) {
                    var rootNode = {
                        type: "folder",
                        id: 0,
                        childNodes: angular.isArray(resData) ? resData : [resData],
                        pageSelectedHandler: pageSelectedHandler || angular.noop,
                        context: context
                    };
                    var rootFolder = new Folder(rootNode, null);
                    return rootFolder.nodes;
                }
            };
        }])
        .service("menuService", ["menuFactory", "nodes", function (menuFactory, resData) {
            var self = this;
            self.loadNodes = function (pageSelectedHandler, context) {
                return menuFactory.createNodes(resData, pageSelectedHandler, context);
            };
	}])
        .controller("menuController", ["$scope", "$element", "menuService", "NodeType", function ($scope, $element, menuService, NodeType) {
            var self = this;
            self.loadNodes = function () {
                var nodes = menuService.loadNodes(function (pageNode) {
                    $scope.pageCtrl.loadPage(pageNode);
                });
                self._render(nodes);
            };

            self._render = function (nodes) {
                var ul = $("<ul>");
                angular.forEach(nodes, function (node) {
                    ul.append(node.toHtml());
                });
                $element.append(ul);
            };
	}])
        .directive("gwMenu", function () {
            return {
                require: "gwMenu",
                restrict: "E",
                controller: "menuController",
                controllerAs: "menuCtrl",
                compile: function (tEle, tAttr) {
                    tEle.addClass("menu");
                    return function (scope, iEle, iAttr, menuCtrl) {
                        menuCtrl.loadNodes();
                    }
                }
            };
        });
})(window.angular, window.jQuery);
