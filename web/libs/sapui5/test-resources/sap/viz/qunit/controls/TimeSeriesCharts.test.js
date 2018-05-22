module("Time Series Chart Types");
jQuery.sap.require("sap.viz.ui5.controls.VizFrame");

var oModel = new sap.ui.model.json.JSONModel({
    businessData1 : [{
        "Date": 1388505600000,
        "Country": "China",
        "Value": 131.7715651821345,
        "Value2": 12
    }, {
        "Date": 1388505600000,
        "Country": "Japan",
        "Value": 732.2505286429077,
        "Value2": 123
    }, {
        "Date": 1388505600000,
        "Country": "France",
        "Value": 301.2606957927346,
        "Value2": 12
    }, {
        "Date": 1388505600000,
        "Country": "UK",
        "Value": 815.9925150685012,
        "Value2": 456
    }, {
        "Date": 1391097600000,
        "Country": "China",
        "Value": 184.3122337013483,
        "Value2": 12
    }, {
        "Date": 1391097600000,
        "Country": "Japan",
        "Value": 350.25157197378576,
        "Value2": 123
    }, {
        "Date": 1391097600000,
        "Country": "France",
        "Value": 62.60869628749788,
        "Value2": 123
    }, {
        "Date": 1391097600000,
        "Country": "UK",
        "Value": 897.1779812127352,
        "Value2": 123
    }]
});

test("Time Series Line Chart", function() {
    expect(1);
    stop();
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = createVizFrame({
        viztype:"timeseries_line"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        ok(plot != null, "Time Series Line Plot exists.");
        destroyVizFrame(oVizFrame);
        start();
    });
});

test("Time Series Scatter Chart", function() {
    expect(1);
    stop();
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = createVizFrame({
        viztype:"timeseries_scatter"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        ok(plot != null, "Time Series Scatter Plot exists.");
        destroyVizFrame(oVizFrame);
        start()
    });
});

test("Time Series Bubble Chart", function() {
    expect(1);
    stop();
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType:'date'
        }, {
            name: 'Country',
            value: "{Country}"
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        },{
            name: 'Value2',
            value: '{Value2}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = createVizFrame({
        viztype:"timeseries_bubble"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel);

    var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedBubbleWidth = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "bubbleWidth",
            'type': "Measure",
            'values': ["Value2"]
        }),
        feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': ["Country"]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedBubbleWidth);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        ok(plot != null, "Time Series Bubble Plot exists.");
        destroyVizFrame(oVizFrame);
        start();
    });
});
var oModel2 = new sap.ui.model.json.JSONModel({
    businessData1 : [{
        "Date": 1388505600000,
        "Country": "China",
        "Value": 131.7715651821345,
        "Value2": 12
    }, {
        "Date": 1398507600000,
        "Country": "Japan",
        "Value": 732.2505286429077,
        "Value2": 123
    }, {
        "Date": 1408505600000,
        "Country": "France",
        "Value": 301.2606957927346,
        "Value2": 12
    }, {
        "Date": 1418505800000,
        "Country": "UK",
        "Value": 815.9925150685012,
        "Value2": 456
    }, {
        "Date": 1421097600000,
        "Country": "China",
        "Value": 184.3122337013483,
        "Value2": 12
    }, {
        "Date": 1431097800000,
        "Country": "Japan",
        "Value": 350.25157197378576,
        "Value2": 123
    }, {
        "Date": 1441097900000,
        "Country": "France",
        "Value": 62.60869628749788,
        "Value2": 123
    }, {
        "Date": 1451097000000,
        "Country": "UK",
        "Value": 897.1779812127352,
        "Value2": 123
    }]
});
test("Time Series Combination Chart", function() {
    expect(1);
    stop();
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        },
        {
            name: 'Value2',
            value: '{Value2}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = createVizFrame({
        viztype:"timeseries_combination"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel2);

    var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value", "Value2"]
        }),
     
        feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': [{"measureNamesDimension": ["valueAxis"]}]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        ok(plot != null, "Time Series Combination Plot exists.");
        destroyVizFrame(oVizFrame);
        start();
    });
});

test("Dual Time Series Combination Chart", function() {
    expect(1);
    stop();
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions: [{
            name: 'Date',
            value: "{Date}",
            dataType: 'date'
        }],
        measures: [{
            name: 'Value',
            value: '{Value}'
        },
        {
            name: 'Value2',
            value: '{Value2}'
        }],
        data: {
            path: "/businessData1"
        }
    });
    var oVizFrame = createVizFrame({
        viztype:"dual_timeseries_combination"
    });

    oVizFrame.setDataset(oDataset);
    oVizFrame.setModel(oModel2);

    var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Value"]
        }),
        feedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "valueAxis2",
            'type': "Measure",
            'values': ["Value2"]
        }),
        feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "timeAxis",
            'type': "Dimension",
            'values': ["Date"]
        }),
        feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "color",
            'type': "Dimension",
            'values': [{"measureNamesDimension": ["valueAxis"]}]
        });

    oVizFrame.addFeed(feedValueAxis);
    oVizFrame.addFeed(feedCategoryAxis);
    oVizFrame.addFeed(feedColor);
    oVizFrame.addFeed(feedValueAxis2);
    oVizFrame.placeAt('content');
    oVizFrame.attachEventOnce('renderComplete', function(){
        var plot = document.querySelector("#content .v-plot-main");
        ok(plot != null, "Dual Time Series Combination Plot exists.");
        destroyVizFrame(oVizFrame);
        start();
    });
});