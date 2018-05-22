sap.ui.controller("sap.viz.sample.BulletWithForecastAndAdditionalValue.Bullet", {
	onInit: function(oEvent) {
		var oVizFrame = this.getView().byId("idVizFrameBullet_with_forecast_and_additional_value");
		var oPopOver = this.getView().byId("idPopOver");
		var oModel = new sap.ui.model.json.JSONModel({
			"Products": [{
				"Country": "China",
				"Profit": 100,
				"Forcast": 200,
				"Target": 20,
				"Revenue": 50,
				"Revenue2": 153,
				"Revenue3": 512
			}, {
				"Country": "Japan",
				"Profit": 159,
				"Forcast": 140,
				"Target": 150,
				"Revenue": 30,
				"Revenue2": 100,
				"Revenue3": 303
			}, {
				"Country": "India",
				"Profit": 129,
				"Forcast": 120,
				"Target": 100,
				"Revenue": 200,
				"Revenue2": 222,
				"Revenue3": 263
			}, {
				"Country": "France",
				"Profit": 58,
				"Forcast": 60,
				"Target": 80,
				"Revenue": 116,
				"Revenue2": 152,
				"Revenue3": 113
			}, {
				"Country": "Austrilia",
				"Profit": 149,
				"Forcast": 120,
				"Target": 150,
				"Revenue": 249,
				"Revenue2": 292,
				"Revenue3": 443
			}, {
				"Country": "Sweden",
				"Profit": 49,
				"Forcast": 60,
				"Target": 55,
				"Revenue": 149,
				"Revenue2": 242,
				"Revenue3": 243
			}]
		});
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions: [{
				name: 'Country',
				value: "{Country}"
			}],
			measures: [{
				name: 'Profit',
				value: '{Profit}'
			}, {
				name: 'Target',
				value: '{Target}'
			}, {
				name: "Forcast",
				value: "{Forcast}"
			}, {
				name: "Revenue",
				value: "{Revenue}"
			}, {
				name: 'Revenue2',
				value: '{Revenue2}'
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
			},
			legend: {
				title: {
					visible: false
				}
			},
			title: {
				visible: true,
				text: 'Bullet with forecast and additional value'
			}
		});
		oVizFrame.setDataset(oDataset);
		oVizFrame.setModel(oModel);

		var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "valueAxis",
				'type': "Measure",
				'values': ["Revenue", "Revenue2"]
			}),
			feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "categoryAxis",
				'type': "Dimension",
				'values': ["Country"]
			}),
			feedTargetValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "targetValues",
				'type': "Measure",
				'values': ["Target"]
			}),
			feedForecastValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "forecastValues",
				'type': "Measure",
				'values': ["Forcast"]
			});



		oVizFrame.addFeed(feedValueAxis);
		oVizFrame.addFeed(feedCategoryAxis);
		oVizFrame.addFeed(feedTargetValues);
		oVizFrame.addFeed(feedForecastValues);
		oPopOver.connect(oVizFrame.getVizUid());


		var oRadio1 = this.getView().byId("idRadio1");
		var oRadio2 = this.getView().byId("idRadio2");

		oRadio1.attachSelect(function() {
			oVizFrame.setVizType("bullet");
		});

		oRadio2.attachSelect(function() {
			oVizFrame.setVizType("vertical_bullet");
		});
	}
});