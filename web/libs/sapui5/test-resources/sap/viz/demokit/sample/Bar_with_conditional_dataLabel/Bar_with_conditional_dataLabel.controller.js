sap.ui.controller("sap.viz.sample.Bar_with_conditional_dataLabel.Bar_with_conditional_dataLabel", {
	onInit: function(oEvent) {
		var oVizFrame = this.getView().byId("idVizFrameBar_with_conditional_dataLabel");
		var oPopOver = this.getView().byId("idPopOver");
		var oModel = new sap.ui.model.json.JSONModel({
			"Products": [{
					"Country": "China",
					"Product": "Car",
					"Revenue": 50,
					"Revenue2": 521
				}, {
					"Country": "China",
					"Product": "Truck",
					"Revenue": 30,
					"Revenue2": 302
				}, {
					"Country": "China",
					"Product": "Motorcycle",
					"Revenue": 229,
					"Revenue2": 222
				}, {
					"Country": "USA",
					"Product": "Car",
					"Revenue": 149,
					"Revenue2": 112
				}, {
					"Country": "USA",
					"Product": "Truck",
					"Revenue": 249,
					"Revenue2": 242
				}, {
					"Country": "USA",
					"Product": "Motorcycle",
					"Revenue": 133,
					"Revenue2": 1
				}, {
					"Country": "Canada",
					"Product": "Car",
					"Revenue": 116,
					"Revenue2": 242
				}, {
					"Country": "Canada",
					"Product": "Truck",
					"Revenue": 68,
					"Revenue2": 62
				}, {
					"Country": "Canada",
					"Product": "Motorcycle",
					"Revenue": 23,
					"Revenue2": 232
				}, {
					"Country": "France",
					"Product": "Car",
					"Revenue": 60,
					"Revenue2": 11
				}, {
					"Country": "France",
					"Product": "Truck",
					"Revenue": 30,
					"Revenue2": 302
				}, {
					"Country": "France",
					"Product": "Motorcycle",
					"Revenue": 105,
					"Revenue2": 302
				}, {
					"Country": "Germany",
					"Product": "Car",
					"Revenue": 159,
					"Revenue2": 242
				}, {
					"Country": "Germany",
					"Product": "Truck",
					"Revenue": 168,
					"Revenue2": 62
				}, {
					"Country": "Germany",
					"Product": "Motorcycle",
					"Revenue": 131,
					"Revenue2": 232
				},

			]
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
				name: 'Revenue',
				value: '{Revenue}'
			}],
			data: {
				path: "/Products"
			}
		});
		oVizFrame.setVizProperties({
			plotArea: {
				dataPointStyle: {
					"rules": [{
						"dataContext": [{
							"Country": "Canada"
						}],
						"properties": {
							"dataLabel": true
						},
						"displayName": ""
					}],
					"others": {
						"properties": {
							"dataLabel": false
						},
						"displayName": "Others"
					}
				}
			},
			legend: {
				title: {
					visible: false
				}
			},
			categoryAxis: {
				label: {
					hideSubLevels: true
				}
			},

			title: {
				visible: true,
				text: 'Bar with conditional dataLabel'
			}
		});
		oVizFrame.setDataset(oDataset);
		oVizFrame.setModel(oModel);


		var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "valueAxis",
				'type': "Measure",
				'values': ["Revenue"]
			}),
			feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "categoryAxis",
				'type': "Dimension",
				'values': ["Country"]
			}),
			feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "color",
				'type': "Dimension",
				'values': ["Product"]
			});;

		oVizFrame.addFeed(feedValueAxis);
		oVizFrame.addFeed(feedCategoryAxis);
		oVizFrame.addFeed(feedColor);
		oPopOver.connect(oVizFrame.getVizUid());
	}
});