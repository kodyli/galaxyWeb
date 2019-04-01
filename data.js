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
            "<gw-screen id='test' gw-layout ng-controller='TestController as ctrl'>",
                "<gw-content gw-layout-center name='ctrl.contentCtrl'>",
                    "<gw-tabs id='screenTabs'>",
                        "<gw-tab id='searchTab' title='Search' save-warning disable-siblings name='ctrl.searchTabCtrl'>",
                            "<form name='ctrl.searchForm'>",
                                "<input type='text' ng-model='ctrl.name'>",
                                "<button ng-disabled='!ctrl.searchForm.$dirty' ng-click='ctrl.find()'>Find</button>",
                            "</form>",
                        "</gw-tab>",
                        "<gw-tab id='detailsTab' title='Details'>",
                            "<form gw-form>",
                                "<label>First Name</label><input type='text' ng-model='ctrl.firstName'>",
                            "</form>",
                            "<gw-grid id='gwGrid1' name='ctrl.grid1'></gw-grid>",
                            "<button ng-disabled='ctrl.contentCtrl.disablePrintButton()' ng-click='ctrl.print()'>Print</button>",
                            "<button ng-click='ctrl.addRow1()'>Add Row</button>",
                            "<button ng-click='ctrl.addInvoice()'>Add Invoice</button>",
                            "<button ng-disabled='ctrl.contentCtrl.disableSaveButton()' ng-click='ctrl.save()'>Save</button>",
                        "</gw-tab>",
                        "<gw-tab id='noteTab' title='Note'>",
                            "<form gw-form>",
                                "<label>Last Name</label><input type='text' ng-model='ctrl.lastName'>",
                            "</form>",
                            "<gw-grid id='gwGrid2' name='ctrl.grid2'></gw-grid>",
                            "<button ng-disabled='ctrl.contentCtrl.disablePrintButton()' ng-click='ctrl.print()'>Print</button>",
                            "<button ng-click='ctrl.addRow2()'>Add</button>",
                            "<button ng-disabled='!ctrl.grid2.hasSelectedRow()' ng-click='ctrl.dupRow2()'>Dup</button>",
                            "<button ng-disabled='ctrl.contentCtrl.disableSaveButton()' ng-click='ctrl.save()'>Save</button>",
                        "</gw-tab>",
                    "</gw-tabs>",
                "</gw-content>",
                "<gw-error gw-layout-right name='ctrl.gwErrorCtrl'></gw-error>",
            "</gw-screen>"
    ]).constant("dialogHtml", [
        "<gw-tabs id='dialogTabs'>",
            "<gw-tab id='searchTab' title='Search'>",
                "<input type='text' ng-model='ctrl.name'>",
                "<button ng-click='ctrl.saveInvoice()'>Save Invoice</button>",
            "</gw-tab>",
            "<gw-tab id='detailsTab' title='Details'>",
        "</gw-tabs>"
    ]).constant("jqgridData", [{
            "OrderID": "1",
            "CustomerID": "WILMK",
            "OrderDate": "1996-07-04 00:00:00",
            "Freight": "32.3800",
            "ShipName": "Vins et alcools Chevalier"
        }, {
            "OrderID": "2",
            "CustomerID": "TRADH",
            "OrderDate": "1996-07-05 00:00:00",
            "Freight": "11.6100",
            "ShipName": "Toms Spezialit\u00e4ten"
        }, {
            "OrderID": "3",
            "CustomerID": "HANAR",
            "OrderDate": "1996-07-08 00:00:00",
            "Freight": "65.8300",
            "ShipName": "Hanari Carnes"
        }, {
            "OrderID": "4",
            "CustomerID": "VICTE",
            "OrderDate": "1996-07-08 00:00:00",
            "Freight": "41.3400",
            "ShipName": "Victuailles en stock"
        }, {
            "OrderID": "5",
            "CustomerID": "SUPRD",
            "OrderDate": "1996-07-09 00:00:00",
            "Freight": "51.3000",
            "ShipName": "Supr\u00eames d\u00e9lices"
        }, {
            "OrderID": "6",
            "CustomerID": "HANAR",
            "OrderDate": "1996-07-10 00:00:00",
            "Freight": "58.1700",
            "ShipName": "Hanari Carnes"
        }, {
            "OrderID": "7",
            "CustomerID": "CHOPS",
            "OrderDate": "1996-07-11 00:00:00",
            "Freight": "22.9800",
            "ShipName": "Chop-suey Chinese"
        }, {
            "OrderID": "8",
            "CustomerID": "RICSU",
            "OrderDate": "1996-07-12 00:00:00",
            "Freight": "148.3300",
            "ShipName": "Richter Supermarkt"
        }, {
            "OrderID": "9",
            "CustomerID": "WELLI",
            "OrderDate": "1996-07-15 00:00:00",
            "Freight": "13.9700",
            "ShipName": "Wellington Importadora"
        }, {
            "OrderID": "10",
            "CustomerID": "HILAA",
            "OrderDate": "1996-07-16 00:00:00",
            "Freight": "81.9100",
            "ShipName": "HILARI\u00d3N-Abastos"
        }, {
            "OrderID": "11",
            "CustomerID": "ERNSH",
            "OrderDate": "1996-07-17 00:00:00",
            "Freight": "140.5100",
            "ShipName": "Ernst Handel"
        }, {
            "OrderID": "12",
            "CustomerID": "CENTC",
            "OrderDate": "1996-07-18 00:00:00",
            "Freight": "3.2500",
            "ShipName": "Centro comercial Moctezuma"
        }, {
            "OrderID": "13",
            "CustomerID": "OLDWO",
            "OrderDate": "1996-07-19 00:00:00",
            "Freight": "55.0900",
            "ShipName": "Ottilies K\u00e4seladen"
        }, {
            "OrderID": "14",
            "CustomerID": "QUEDE",
            "OrderDate": "1996-07-19 00:00:00",
            "Freight": "3.0500",
            "ShipName": "Que Del\u00edcia"
        }, {
            "OrderID": "15",
            "CustomerID": "RATTC",
            "OrderDate": "1996-07-22 00:00:00",
            "Freight": "48.2900",
            "ShipName": "Rattlesnake Canyon Grocery"
        }, {
            "OrderID": "16",
            "CustomerID": "ERNSH",
            "OrderDate": "1996-07-23 00:00:00",
            "Freight": "146.0600",
            "ShipName": "Ernst Handel"
        }, {
            "OrderID": "17",
            "CustomerID": "FOLKO",
            "OrderDate": "1996-07-24 00:00:00",
            "Freight": "3.6700",
            "ShipName": "Folk och f\u00e4 HB"
        }, {
            "OrderID": "18",
            "CustomerID": "BLONP",
            "OrderDate": "1996-07-25 00:00:00",
            "Freight": "55.2800",
            "ShipName": "Blondel p\u00e8re et fils"
        }, {
            "OrderID": "19",
            "CustomerID": "WARTH",
            "OrderDate": "1996-07-26 00:00:00",
            "Freight": "25.7300",
            "ShipName": "Wartian Herkku"
        }, {
            "OrderID": "20",
            "CustomerID": "FRANK",
            "OrderDate": "1996-07-29 00:00:00",
            "Freight": "208.5800",
            "ShipName": "Frankenversand"
        }]);
})(window.angular);
