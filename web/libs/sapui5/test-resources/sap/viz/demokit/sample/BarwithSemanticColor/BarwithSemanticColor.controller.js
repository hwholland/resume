sap.ui.controller("sap.viz.sample.BarwithSemanticColor.BarwithSemanticColor", {
    onInit: function(oEvent) {
        var oVizFrame = this.getView().byId("idVizFrameWithSemantic");
        var oPopOver = this.getView().byId("idPopOver");
        var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/viz/demokit/dataset/bookstore_fiori/ByItemCity_sum.json");
        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [{
                name: "Item Category",
                value: "{Item Category}"
            }, {
                name: 'City',
                value: '{City}'
            }],
            measures: [{
                name: 'Revenue',
                value: '{Revenue}'
            }],
            data: {
                path: "/book"
            }
        });
        oVizFrame.setVizProperties({
            valueAxis: {
                label: {
                    formatString: 'u'
                }
            },
            plotArea: {
                dataPointStyle: {
                    "rules": [{
                        "dataContext": [{
                            "Revenue": {
                                "min": 450000
                            }
                        }],
                        "properties": {
                            "color": "sapUiChartPaletteSemanticGood"
                        },
                        "displayName": "Revenue > 450k"
                    }, {
                        "dataContext": [{
                            "Revenue": {
                                "max": 140000
                            }
                        }],
                        "properties": {
                            "color": "sapUiChartPaletteSemanticBad"
                        },
                        "displayName": "Revenue < 140k"
                    }],
                    "others": {
                        "properties": {
                            "color": "sapUiChartPaletteSemanticNeutral"
                        },
                        "displayName": "Others"
                    }
                }
            },
            categoryAxis: {
                label: {
                    hideSubLevels: true
                }
            },
            legend: {
                title: {
                    visible: false
                }
            },

            title: {
                visible: true,
                text: 'Revenue by City and Item Category'
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
                'values': ["Item Category"]
            }),
            feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["City"]
            });

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.addFeed(feedColor);
        oPopOver.connect(oVizFrame.getVizUid());
    }
});