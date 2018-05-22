sap.ui.controller("sap.viz.sample.PopoverFormatter.PopoverFormatter", {
	onInit: function(oEvent) {
		var oVizFrame = this.getView().byId("idVizFramePopoverFormatter");
		var oPopOver = this.getView().byId("idPopOver");
		var start = new Date();
		start.setFullYear(2013);
		start.setMonth(5);
		start.setDate(1);
		start.setHours(22);
		start.setMinutes(51);
		start.setSeconds(10);

		var end = new Date();
		end.setFullYear(2014);
		end.setMonth(4);
		end.setDate(30);
		end.setHours(16);
		end.setMinutes(39);
		end.setSeconds(31);

		var range = end.getTime() - start.getTime();
		var timeArr = [];
		for (var i = 0; i < 10; i++) {
			var t = parseInt(range * Math.random()) + start.getTime();
			timeArr.push(t);
		}
		var oModel = new sap.ui.model.json.JSONModel({
			"Products": [{
				"Country": "China",
				"Product": "Car",
				"Date": timeArr[0],
				"Revenue": 550,
				"Profit": 721,
				"Revenue3": 1153
			}, {
				"Country": "China",
				"Product": "Truck",
				"Date": timeArr[1],
				"Revenue": 230,
				"Profit": 1302,
				"Revenue3": 103
			}, {
				"Country": "China",
				"Product": "Motorcycle",
				"Date": timeArr[2],
				"Revenue": 1229,
				"Profit": 822,
				"Revenue3": 923
			}, {
				"Country": "USA",
				"Product": "Car",
				"Date": timeArr[3],
				"Revenue": 116,
				"Profit": 112,
				"Revenue3": 113
			}, {
				"Country": "USA",
				"Product": "Truck",
				"Date": timeArr[4],
				"Revenue": 249,
				"Profit": 242,
				"Revenue3": 243
			}, {
				"Country": "USA",
				"Product": "Motorcycle",
				"Date": timeArr[5],
				"Revenue": 16,
				"Profit": 1,
				"Revenue3": 1
			}, {
				"Country": "Canada",
				"Product": "Car",
				"Date": timeArr[6],
				"Revenue": 149,
				"Profit": 242,
				"Revenue3": 243
			}, {
				"Country": "Canada",
				"Product": "Truck",
				"Date": timeArr[7],
				"Revenue": 68,
				"Profit": 62,
				"Revenue3": 63
			}, {
				"Country": "Canada",
				"Product": "Motorcycle",
				"Date": timeArr[8],
				"Revenue": 133,
				"Profit": 232,
				"Revenue3": 233
			}, {
				"Country": "China",
				"Product": "Car",
				"Date": timeArr[9],
				"Revenue": 50,
				"Profit": 11,
				"Revenue3": 22
			}]
		});
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions: [{
				name: 'Country',
				value: "{Country}"
			}, {
				name: 'Product',
				value: "{Product}"
			}],
			measures: [{
				name: 'Date',
				value: '{Date}'
			}, {
				name: 'Revenue',
				value: '{Revenue}'
			}, {
				name: "Profit",
				value: "{Profit}"
			}, {
				name: "Revenue3",
				value: "{Revenue3}"
			}],
			data: {
				path: "/Products"
			}
		});

		oVizFrame.setVizProperties({
			plotArea: {
				"referenceLine": {
					"line": {
						"primaryValues": [{
							"value": "1396322755175",
							"color": "green",
							"label": {
								"text": "Last month",
								"style": {
									"color": "green"
								}
							}
						}]
					}

				}
			},
			title: {
				visible: true,
				text: 'Popover Formatter'
			},
			sizeLegend: {
				title: {
					visible: true
				}
			},
			legend: {
				title: {
					visible: false
				}
			}

		});

		oVizFrame.setDataset(oDataset);
		oVizFrame.setModel(oModel);

		feeding = {
			primaryValues: ['Date'],
			secondaryValues: ['Revenue'],
			bubbleWidth: ['Profit'],
			bubbleHeight: ['Revenue3'],
			regionColor: ['Country'],
			regionShape: ['Product']
		};

		var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "valueAxis",
				'type': "Measure",
				'values': ["Date"]
			}),
			feedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "valueAxis2",
				'type': "Measure",
				'values': ["Revenue"]
			}),
			feedBubbleWidth = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "bubbleWidth",
				'type': "Measure",
				'values': ["Profit"]
			}),
			feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "color",
				'type': "Dimension",
				'values': ["Country"]
			});

		oVizFrame.addFeed(feedValueAxis);
		oVizFrame.addFeed(feedValueAxis2);
		oVizFrame.addFeed(feedBubbleWidth);
		oVizFrame.addFeed(feedColor);
		/* formatString can be an object of measure-pattern pairs, 
		 * or a single pattern string applied to every measure */


		oPopOver.setFormatString({
			Date: 'yyyy-mm-dd',
			Revenue: '$ #,###.00',
			Profit: '€ #,###.00',
			Revenue3: '#,###.00'
		});

		oPopOver.connect(oVizFrame.getVizUid());

	}
});