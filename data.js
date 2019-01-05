(function (angular) {
    angular.module("gw.data", [])
        .constant("nodes", [{
            type: "page",
            id: 1,
            name: "Setting"
		}, {
            type: "folder",
            id: 3,
            name: "Budget Development System",
            childNodes: [
                {
                    type: "page",
                    id: 31,
                    name: "Modify District Budget Status"
                }, {
                    type: "page",
                    id: 32,
                    name: "Modify County Budget Status"
                }
            ]
        }, {
            type: "folder",
            id: 2,
            name: "Account Payable System",
            childNodes: [
                {
                    type: "folder",
                    id: 21,
                    name: "Claims Processing",
                    childNodes: [{
                        type: "page",
                        id: 211,
                        name: "Add Claims Batch"
					}, {
                        type: "page",
                        id: 212,
                        name: "Approve Claims for Payment"
					}]
				}, {
                    type: "folder",
                    id: 22,
                    name: "Commercial Warrant Management",
                    childNodes: [{
                        type: "page",
                        id: 222,
                        name: "Issue Commercial Counter Warrant"
					}, {
                        type: "page",
                        id: 221,
                        name: "Approve Commercial Warrant Status Changes"
					}]
				}, {
                    type: "page",
                    id: 23,
                    name: "Add Claims Batch"
					}
			]
	}]).constant("screenHtml", [
            "<div gw-layout ng-controller='TestController as ctrl'>",
                "<gw-content gw-layout-center>",
                    "<gw-tabs id='screenTabs'>",
                        "<gw-tab tab-id='searchTab' tab-title='Search' save-warning disable-siblings tab-controller='ctrl.searchTabCtrl'>",
                            "<input type='text' ng-model='ctrl.name'>",
                            "<button ng-click='ctrl.find()'>Find</button>",
                        "</gw-tab>",
                        "<gw-tab tab-id='detailsTab' tab-title='Details'>",
                            "<gw-grid grid-id='gwGrid1' grid-instance='ctrl.grid2'></gw-grid>",
                            "<button ng-click='ctrl.addRow2()'>Add Row</button>",
                            "<button ng-click='ctrl.addInvoice()'>Add Invoice</button>",
                        "</gw-tab>",
                        "<gw-tab tab-id='noteTab' tab-title='Note'>",
                            "<gw-grid grid-id='gwGrid1' grid-instance='ctrl.grid1'></gw-grid>",
                            "<button ng-click='ctrl.addRow1()'>Add Row</button>",
                        "</gw-tab>",
                    "</gw-tabs>",
                "</gw-content>",
                "<gw-error gw-layout-right></gw-error>",
            "</div>"
    ]).constant("dialogHtml", [
        "<gw-tabs id='dialogTabs'>",
            "<gw-tab tab-id='searchTab' tab-title='Search'>",
                "<input type='text' ng-model='ctrl.name'>",
                "<button ng-click='ctrl.saveInvoice()'>Save Invoice</button>",
            "</gw-tab>",
            "<gw-tab tab-id='detailsTab' tab-title='Details'>",
        "</gw-tabs>"
    ]);

})(window.angular);
