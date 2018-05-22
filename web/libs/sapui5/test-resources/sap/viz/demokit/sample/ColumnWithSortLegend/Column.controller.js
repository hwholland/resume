sap.ui.controller("sap.viz.sample.ColumnWithSortLegend.Column", {
    onInit: function(oEvent) {
        var oVizFrame = this.getView().byId("idVizFrameColumn");
        var oPopOver = this.getView().byId("idPopOver");
        var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/viz/demokit/dataset/bookstore_fiori/ByYearItemCity_sum.json");
        var oButton = this.getView().byId("idButton");
        var oTextArea = this.getView().byId("idTextArea");
        oTextArea.setValue("/* define your compare function here */\nfunction(x, y) {\n\tvar base = function(a, b) {\n\t\treturn a < b ? -1 : (a > b ? 1 : 0);  \n\t}    \n\tvar xx = x.split(\"/\").map(function(i){return i.trim();}),  \n\t      yy = y.split(\"/\").map(function(i){return i.trim();});  \n\tvar fst = base(xx[0], yy[0]),  \n\t      sec = base(xx[1], yy[1]),  \n\t      thd = base(xx[2], yy[2]);  \n\tif (fst !== 0) { return -fst; }  \n\telse if (sec !== 0) {return sec;}  \n\telse {return -thd;}\n}");

        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [{
                name: "Year",
                value: "{Year}"
            }, {
                name: "City",
                value: "{City}"
            }, {
                name: 'Item Category',
                value: '{Item Category}'
            }],
            measures: [{
                name: 'Profit',
                value: '{Profit}'
            }, {
                name: 'Revenue',
                value: '{Revenue}'
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
                'values': ["Profit", "Revenue"]
            }),
            feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["City"]
            }),
            feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["Item Category", "Year"]
            });

        oVizFrame.setVizProperties({
            plotArea: {
                dataLabel: {
                    visible: true,
                    formatString: "#,##0"
                }
            },
            legend: {
                title: {
                    visible: false
                }
            },

            title: {
                visible: true,
                text: 'Profit & Revenue by City and Year'
            }
        });

        oVizFrame.addFeed(feedValueAxis);
        oVizFrame.addFeed(feedCategoryAxis);
        oVizFrame.addFeed(feedColor);
        oPopOver.connect(oVizFrame.getVizUid());

        function getOrderFunction() {
            var code = oTextArea.getValue();
            var compare_fn = undefined;
            try {
                eval("compare_fn = " + code + ";");
            } catch (e) {
                compare_fn = null;
                console.error("Error in Javascript code for order function", e);
            }
            return compare_fn;

        }

        oButton.attachPress(function() {
            oVizFrame.setVizProperties({
                legend: {
                    order: getOrderFunction()
                }
            });
        });
    }
});