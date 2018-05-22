sap.ui.controller("sap.viz.sample.BulletMultiple.Bullet", {
	onInit: function(oEvent) {
		var oVizFrame = this.getView().byId("idVizFrameBullet");
		var oPopOver = this.getView().byId("idPopOver");
		var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/viz/demokit/dataset/bookstore_fiori/MultipleBullet.json");

		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions: [{
				name: 'Country',
				value: "{Country}"
			}, {
				name: 'Product',
				value: "{Product}"
			}],
			measures: [{
				name: 'Profit',
				value: '{Profit}'
			}, {
				name: "Revenue",
				value: "{Revenue}"
			}, {
				name: 'GrowthRate',
				value: '{GrowthRate}'
			}, {
				name: "Forecast",
				value: "{Forecast}"
			}],
			data: {
				path: "/data"
			}
		});

		oVizFrame.setVizProperties({
			plotArea: {
				// colorPalette:['sapUiChartPaletteSemanticNeutral'],
				// gap: {visible : true}
			},
			legend: {
				title: {
					visible: false
				}
			},
			title: {
				visible: true,
				text: 'Bullet with multiple display'
			}
		});
		oVizFrame.setDataset(oDataset);
		oVizFrame.setModel(oModel);

		var feedTrellisRow = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "trellisRow",
				'type': "Dimension",
				'values': ["Country"]
			}),
			feedTrellisColumn = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "trellisColumn",
				'type': "Dimension",
				'values': ["Country"]
			}),
			feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "valueAxis",
				'type': "Measure",
				'values': ["Profit", "Revenue"]
			}),
			feedTargetValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "targetValues",
				'type': "Measure",
				'values': ["GrowthRate"]
			}),
			feedForecastValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "forecastValues",
				'type': "Measure",
				'values': ["Forecast"]
			}),
			feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "categoryAxis",
				'type': "Dimension",
				'values': ["Product"]
			});

		oVizFrame.addFeed(feedTrellisRow);
		//oVizFrame.addFeed(feedTrellisColumn);
		oVizFrame.addFeed(feedValueAxis);
		oVizFrame.addFeed(feedTargetValues);
		oVizFrame.addFeed(feedForecastValues);
		oVizFrame.addFeed(feedCategoryAxis);
		oPopOver.connect(oVizFrame.getVizUid());


		var oRadio1 = this.getView().byId("idRadio1");
		var oRadio2 = this.getView().byId("idRadio2");

		oRadio1.attachSelect(function() {
			oVizFrame.removeAllFeeds();
			oVizFrame.addFeed(feedTrellisRow);
			oVizFrame.addFeed(feedValueAxis);
			oVizFrame.addFeed(feedTargetValues);
			oVizFrame.addFeed(feedForecastValues);
			oVizFrame.addFeed(feedCategoryAxis);
			oVizFrame.setVizType("bullet");
		});

		oRadio2.attachSelect(function() {
			oVizFrame.removeAllFeeds();
			oVizFrame.addFeed(feedTrellisColumn);
			oVizFrame.addFeed(feedValueAxis);
			oVizFrame.addFeed(feedTargetValues);
			oVizFrame.addFeed(feedForecastValues);
			oVizFrame.addFeed(feedCategoryAxis);
			oVizFrame.setVizType("vertical_bullet");
		});

	}
});