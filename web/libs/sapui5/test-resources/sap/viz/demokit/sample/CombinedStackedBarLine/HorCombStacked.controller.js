sap.ui.controller("sap.viz.sample.CombinedStackedBarLine.HorCombStacked", {
    onInit: function(oEvent) {
        //single chart
        var initOptions = {
            "vizType": "horizontal_stacked_combination",
            "uiConfig": {
                "applicationSet": "fiori"
            },
            "width":"100%",
            "height":"700px",
        };
        var oVizFrame = new sap.viz.ui5.controls.VizFrame(initOptions);
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
            }, {
                name: 'Profit',
                value: '{Profit}'
            }, {
                name: 'Unit Price',
                value: '{Unit Price}'
            }, {
                name: 'Units Sold',
                value: '{Units Sold}'
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
                'values': ["Revenue", "Profit"]
            }),
            feedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis2",
                'type': "Measure",
                'values': ["Unit Price", "Units Sold"]
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

        oVizFrame.setVizProperties({
            valueAxis: {
                label: {
                    formatString: 'u'
                }
            },
            legend: {
                title: {
                    visible: false
                }
            },

            title: {
                visible: true,
                text: 'Revenue & Profit by City and Item Category'
            }
        });



        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.addFeed(feedColor);
        oPopOver.connect(oVizFrame.getVizUid());
        var scrollContainer = this.getView().byId("idScrollContainer");
        oVizFrame.placeAt(scrollContainer);


        //dual chart
        var initOptions_dual = {
            "vizType": "dual_horizontal_stacked_combination",
            "uiConfig": {
                "applicationSet": "fiori"
            },
            "width":"100%",
            "height":"700px",
        };
        var oVizFrame_dual = new sap.viz.ui5.controls.VizFrame(initOptions_dual);
        var oPopOver_dual = this.getView().byId("idPopOver_dual");
        var oModel_dual = new sap.ui.model.json.JSONModel("test-resources/sap/viz/demokit/dataset/bookstore_fiori/ByItemCity_sum.json");
        var oDataset_dual = new sap.viz.ui5.data.FlattenedDataset({
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
            }, {
                name: 'Profit',
                value: '{Profit}'
            }, {
                name: 'Unit Price',
                value: '{Unit Price}'
            }, {
                name: 'Units Sold',
                value: '{Units Sold}'
            }],
            data: {
                path: "/book"
            }
        });

        oVizFrame_dual.setDataset(oDataset_dual);
        oVizFrame_dual.setModel(oModel_dual);

        var feedValueAxis_dual = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Revenue", "Profit"]
            }),
            feedValueAxis2_dual = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis2",
                'type': "Measure",
                'values': ["Unit Price", "Units Sold"]
            }),
            feedCategoryAxis_dual = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Item Category"]
            }),
            feedColor_dual = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["City"]
            });

        oVizFrame_dual.setVizProperties({
            valueAxis: {
                label: {
                    formatString: 'u'
                }
            },
            valueAxis2: {
                label: {
                    formatString: 'u'
                }
            },
            legend: {
                title: {
                    visible: false
                }
            },
            title: {
                visible: true,
                text: 'Revenue & Profit and UnitPrice & UnitsSold by City and Item Category'
            }
        });



        oVizFrame_dual.addFeed(feedValueAxis_dual);
        oVizFrame_dual.addFeed(feedValueAxis2_dual);
        oVizFrame_dual.addFeed(feedCategoryAxis_dual);
        oVizFrame_dual.addFeed(feedColor_dual);
        oPopOver_dual.connect(oVizFrame_dual.getVizUid());

        var oRadio1 = this.getView().byId("idRadio1");
        var oRadio2 = this.getView().byId("idRadio2");

        oRadio1.attachSelect(function() {
            scrollContainer.removeContent(oVizFrame_dual);
            oVizFrame.placeAt(scrollContainer);
        });
        oRadio2.attachSelect(function() {
            scrollContainer.removeContent(oVizFrame);
            oVizFrame_dual.placeAt(scrollContainer);
        });
    }
});