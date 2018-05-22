sap.ui.controller("sap.viz.sample.ColumnWithRange.Column", {
    onInit: function(oEvent) {
        var oVizFrame = this.getView().byId("idVizFrameColumn");
        var oPopOver = this.getView().byId("idPopOver");
        var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/viz/demokit/dataset/bookstore_fiori/ByYearCity_ProfitMin.json");
        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [{
                name: "Year",
                value: "{Year}"
            }, {
                name: 'City',
                value: '{City}'
            }],
            measures: [{
                name: 'Profit',
                value: '{Profit}'
            }],
            data: {
                path: "/book"
            }
        });

        oVizFrame.setDataset(oDataset);
        oVizFrame.setModel(oModel);

        var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Profit"]
            }),
            feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Year"]
            }),
            feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["City"]
            });

        oVizFrame.setVizProperties({
            plotArea: {
                dataLabel: {
                    visible: true,
                    formatString: "#,##0"
                },
                window: {
                    start: {
                        categoryAxis: {
                            'Year': "2004"
                        }
                    },
                    end: {
                        categoryAxis: {
                            'Year': "2007"
                        }
                    }
                }
            },
            legend: {
                title: {
                    visible: false
                }
            },

            title: {
                visible: true,
                text: 'Profit by City and Year'
            }
  
        });

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.addFeed(feedColor);
        oPopOver.connect(oVizFrame.getVizUid());
    }
});