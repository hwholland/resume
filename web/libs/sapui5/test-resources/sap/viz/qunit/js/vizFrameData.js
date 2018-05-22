var createXYChart = function(type) {
    var initOptions = {
        "vizType" : type ? type : 'info/bar',
        width : '100%',
        height : '100%',
        "uiConfig" : {
            "applicationSet" : "fiori"
        }
    };
    var vizframe = new sap.viz.ui5.controls.VizFrame(initOptions);
    var model = new sap.ui.model.json.JSONModel({
        "businessData" : [ {
            "Country" : "China",
            "Year" : "2009",
            "Cost" : 80.1
        }, {
            "Country" : "China",
            "Year" : "2010",
            "Cost" : 70.53
        }, {
            "Country" : "China",
            "Year" : "2011",
            "Cost" : 720.3
        }, {
            "Country" : "Japan",
            "Year" : "2009",
            "Cost" : 45.3
        }, {
            "Country" : "Japan",
            "Year" : "2010",
            "Cost" : 67.8
        }, {
            "Country" : "Japan",
            "Year" : "2011",
            "Cost" : 80.1
        }, {
            "Country" : "France",
            "Year" : "2009",
            "Cost" : 80
        }, {
            "Country" : "France",
            "Year" : "2010",
            "Cost" : 70.3
        }, {
            "Country" : "France",
            "Year" : "2011",
            "Cost" : 70.37
        }, {
            "Country" : "UK",
            "Year" : "2009",
            "Cost" : -45.63
        }, {
            "Country" : "UK",
            "Year" : "2010",
            "Cost" : 267.8
        }, {
            "Country" : "UK",
            "Year" : "2011",
            "Cost" : 380
        } ]
    });
    var dataset = new sap.viz.ui5.data.FlattenedDataset({
        "dimensions" : [ {
            "name" : "Country",
            "value" : "{Country}"
        }, {
            "name" : "Year",
            "value" : "{Year}"
        } ],
        "measures" : [ {
            "name" : "Cost",
            "value" : "{Cost}"
        } ],
        "data" : {
            "path" : "/businessData"
        }
    });
    vizframe.setModel(model);
    vizframe.setDataset(dataset);
    var feeds = [ new sap.viz.ui5.controls.common.feeds.FeedItem({
        "uid" : "categoryAxis",
        "type" : "Dimension",
        "values" : [ "Country" ]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        "uid" : "color",
        "type" : "Dimension",
        "values" : [ "Year" ]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        "uid" : "valueAxis",
        "type" : "Measure",
        "values" : [ "Cost" ]
    }) ];
    feeds.forEach(function(feedItem) {
        vizframe.addFeed(feedItem);
    });
    var popOver = new sap.viz.ui5.controls.Popover({});
    popOver.connect(vizframe.getVizUid());
    vizframe.placeAt("content");

    return {
        vizFrame : vizframe,
        chartPopover : popOver
    };
};

var createTimeLineChart = function() {
    var initOptions = {
        "vizType" : 'timeseries_line',
        width : '100%',
        height : '100%',
        "uiConfig" : {
            "applicationSet" : "fiori"
        }
    };
    var vizframe = new sap.viz.ui5.controls.VizFrame(initOptions);
    var model = new sap.ui.model.json.JSONModel({
        "businessData" : [ {
            "Revenue" : 669.0972230862826,
            "Date" : 1420070400000
        }, {
            "Revenue" : 785.6516572646797,
            "Date" : 1420156800000
        }, {
            "Revenue" : 354.9720789305866,
            "Date" : 1420243200000
        }, {
            "Revenue" : 238.8825339730829,
            "Date" : 1420329600000
        }, {
            "Revenue" : 38.120953598991036,
            "Date" : 1420416000000
        }, {
            "Revenue" : 305.40843144990504,
            "Date" : 1420502400000
        }

        ]
    });
    var dataset = new sap.viz.ui5.data.FlattenedDataset({
        "dimensions" : [ {
            "name" : "Date",
            "value" : "{Date}",
            "dataType" : "date"
        }, {
            "name" : "Date",
            "value" : "{Date}"
        } ],
        "measures" : [ {
            "name" : "Revenue",
            "value" : "{Revenue}"
        } ],
        "data" : {
            "path" : "/businessData"
        }
    });
    vizframe.setModel(model);
    vizframe.setDataset(dataset);
    var feeds = [ new sap.viz.ui5.controls.common.feeds.FeedItem({
        "uid" : "timeAxis",
        "type" : "Dimension",
        "values" : [ "Date" ]
    }), new sap.viz.ui5.controls.common.feeds.FeedItem({
        "uid" : "valueAxis",
        "type" : "Measure",
        "values" : [ "Revenue" ]
    }) ]
    feeds.forEach(function(feedItem) {
        vizframe.addFeed(feedItem);
    });
    var popOver = new sap.viz.ui5.controls.Popover({});
    popOver.connect(vizframe.getVizUid());
    vizframe.placeAt("content");
    return {
        vizFrame : vizframe,
        chartPopover : popOver
    };
}
