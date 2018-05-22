sap.ui.controller("sap.viz.sample.BarWithLegend.Bar", {
    onInit: function(oEvent) {
        var oVizFrame = this.getView().byId("idVizFrame_small");
        var oPopOver = this.getView().byId("idPopOver_small");
        var oButton = this.getView().byId("idButton");
        var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/viz/demokit/dataset/bookstore_fiori/ByYearCity_sum.json");
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
            valueAxis: {
                label: {
                    formatString: 'u'
                }
            },
            categoryAxis: {
                title: {
                    visible: false
                }
            },
            plotArea: {
                dataLabel: {
                    visible: false
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


        var oVizFrame2 = this.getView().byId("idVizFrame_large");
        var oPopOver2 = this.getView().byId("idPopOver_large");
        var oModel2 = new sap.ui.model.json.JSONModel("test-resources/sap/viz/demokit/dataset/bookstore_fiori/ByYearCity_sum.json");
        var oDataset2 = new sap.viz.ui5.data.FlattenedDataset({
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

        oVizFrame2.setDataset(oDataset2);
        oVizFrame2.setModel(oModel2);


        var feedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Profit"]
            }),
            feedCategoryAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Year"]
            }),
            feedColor2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["City"]
            });

        oVizFrame2.setVizProperties({
            valueAxis: {
                label: {
                    formatString: 'u'
                }
            },
            categoryAxis: {
                title: {
                    visible: false
                }
            },
            plotArea: {
                dataLabel: {
                    visible: false
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

        oVizFrame2.addFeed(feedValueAxis2);
        oVizFrame2.addFeed(feedCategoryAxis2);
        oVizFrame2.addFeed(feedColor2);
        oPopOver2.connect(oVizFrame2.getVizUid());


        oButton.attachPress(function() {
            oVizFrame.setLegendVisible(!oVizFrame.getLegendVisible());
            oVizFrame2.setLegendVisible(!oVizFrame2.getLegendVisible());
        });

    }


});