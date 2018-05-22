sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, FlattenedDataset, FeedItem, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.MultipleMeasuresForOneSeries.MultipleMeasuresForOneSeries", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_additional_forecast_target",

        settingsModel : {
            chartType : {
                name: "Chart Type",
                defaultSelected : 0,
                values : [{
                    key: "0",
                    name : "Bullet Chart",
                    value : ["Revenue"],
                    vizType : "vertical_bullet",
                    json : "/semantic.json",
                    dataset : {
                       dimensions: [{
                           name: 'Year',
                           value: "{Year}",
                       }],
                       measures: [{
                           name: 'Revenue',
                           value: '{Revenue}'
                       },{
                           name: 'Revenue2',
                           value: '{Revenue2}'
                       },{
                           name: 'Target',
                           value: '{Target}'
                       }],
                       data: {
                           path: "/milk"
                       }
                    },
                    vizProperties : {
                        gap: {
                            visible: false
                        },
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                [
                                    {
                                        "dataContext": {"Year": {max : 2015}},
                                        "properties": {
                                            "color":"sapUiChartPaletteSequentialHue1Light1"
                                        },
                                        "displayName":"Actual",
                                        "dataName" : {
                                            "Revenue" : "Actual"
                                        }
                                    },
                                    {
                                        "dataContext": {"Year": {min : 2016}},
                                        "properties": {
                                            "color":"sapUiChartPaletteSequentialHue1Light1",
                                            "pattern":"diagonalLightStripe"
                                        },
                                        "displayName":"Forecast",
                                        "dataName" : {
                                            "Revenue" : "Forecast"
                                        }
                                    }
                                ]
                            }
                        },
                        valueAxis: {
                            label: {
                                formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_10
                            },
                            title: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: false
                            }
                        },
                        title: {
                            visible: false,
                        }
                    }
                },{
                    key: "1",
                    name : "Column Chart",
                    value : ["Revenue"],
                    vizType : "column",
                    json : "/semantic.json",
                    dataset : {
                       dimensions: [{
                           name: 'Year',
                           value: "{Year}",
                       }],
                       measures: [{
                           name: 'Revenue',
                           value: '{Revenue}'
                       },{
                           name: 'Revenue2',
                           value: '{Revenue2}'
                       }],
                       data: {
                           path: "/milk"
                       }
                    },
                    vizProperties : {
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                [
                                    {
                                        "dataContext": {"Year": {max : 2015}},
                                        "properties": {
                                            "color":"sapUiChartPaletteSequentialHue1Light1"
                                        },
                                        "displayName":"Actual",
                                        "dataName" : {
                                            "Revenue" : "Actual"
                                        }
                                    },
                                    {
                                        "dataContext": {"Year": {min : 2016}},
                                        "properties": {
                                            "color":"sapUiChartPaletteSequentialHue1Light1",
                                            "pattern":"diagonalLightStripe"
                                        },
                                        "displayName":"Forecast",
                                        "dataName" : {
                                            "Revenue" : "Forecast"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },{
                    key: "2",
                    name : "Column Chart with Time Axis",
                    value : ["Revenue"],
                    vizType : "timeseries_column",
                    json : "/semanticTimeAxis.json",
                    dataset : {
                       dimensions: [{
                           name: 'Date',
                           value: "{Date}",
                           dataType:'date'
                       }],
                       measures: [{
                           name: 'Revenue',
                           value: '{Revenue}'
                       }],
                       data: {
                           path: "/milk"
                       }
                    },
                    vizProperties : {
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                [
                                    {
                                        "dataContext": {"Date": {max : "3/28/2016"}},
                                        "properties": {
                                            "color":"sapUiChartPaletteSequentialHue1Light1"
                                        },
                                        "displayName":"Actual",
                                        "dataName" : {
                                            "Revenue" : "Actual"
                                        }
                                    },
                                    {
                                        "dataContext": {"Date": {min : "4/1/2016"}},
                                        "properties": {
                                            "color":"sapUiChartPaletteSequentialHue1Light1",
                                            "pattern":"diagonalLightStripe"
                                        },
                                        "displayName":"Forecast",
                                        "dataName" : {
                                            "Revenue" : "Forecast"
                                        }
                                    }
                                ]
                            }
                        },
                        timeAxis: {
                            levels: ["quarter","year"]
                        }
                    }
                },{
                    key: "3",
                    name : "Line Chart",
                    value : ["Revenue", "Revenue2"],
                    vizType : "line",
                    json : "/semantic.json",
                    dataset : {
                       dimensions: [{
                           name: 'Year',
                           value: "{Year}",
                       }],
                       measures: [{
                           name: 'Revenue',
                           value: '{Revenue}'
                       },{
                           name: 'Revenue2',
                           value: '{Revenue2}'
                       }],
                       data: {
                           path: "/milk"
                       }
                    },
                    vizProperties : {
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                    [
                                        {
                                            "dataContext": {"Year": {max : 2015}, "Revenue2": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineColor":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineType":"line"
                                            },
                                            "displayName":"Revenue - Actual ",
                                            "dataName" : {
                                                "Revenue2" : "Revenue - Actual"
                                            }
                                        },
                                        {
                                            "dataContext": {"Year": {min : 2016}, "Revenue2": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineColor":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineType":"dotted"
                                                
                                            },
                                            "displayName":"Revenue - Forecast",
                                            "dataName" : {
                                                "Revenue2" : "Revenue - Forecast"
                                            }
                                        },
                                        {
                                            "dataContext": {"Year": {max : 2015}, "Revenue": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue2Light1",
                                                "lineColor":"sapUiChartPaletteSequentialHue2Light1",
                                                "lineType":"line"
                                            },
                                            "displayName":"Cost - Actual",
                                            "dataName" : {
                                                "Revenue" : "Cost - Actual"
                                            }
                                        },
                                        {
                                            "dataContext": {"Year": {min : 2016}, "Revenue": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue2Light1",
                                                "lineColor":"sapUiChartPaletteSequentialHue2Light1",
                                                "lineType":"dotted"
                                            },
                                            "displayName":"Cost - Forecast",
                                            "dataName" : {
                                                "Revenue" : "Cost - Forecast"
                                            }
                                        }
                                    ]
                            }
                        }
                    }
                },{
                    key: "4",
                    name : "Line Chart with Time Axis",
                    value : ["Revenue", "Revenue2"],
                    vizType : "timeseries_line",
                    json : "/semanticTimeAxis.json",
                    dataset : {
                       dimensions: [{
                           name: 'Date',
                           value: "{Date}",
                           dataType:'date'
                       }],
                       measures: [{
                           name: 'Revenue',
                           value: '{Revenue}'
                       },{
                           name: 'Revenue2',
                           value: '{Revenue2}'
                       }],
                       data: {
                           path: "/milk"
                       }
                    },
                    vizProperties : {
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                    [
                                        {
                                            "dataContext": {"Date": {max : "3/28/2016"}, "Revenue2": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineColor":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineType":"line"
                                            },
                                            "displayName":"Revenue - Actual",
                                            "dataName" : {
                                                "Revenue2" : "Revenue - Actual"
                                            }
                                        },
                                        {
                                            "dataContext": {"Date": {min : "4/1/2016"}, "Revenue2": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineColor":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineType":"dotted"
                                                
                                            },
                                            "displayName":"Revenue - Forecast",
                                            "dataName" : {
                                                "Revenue2" : "Revenue - Forecast"
                                            }
                                        },
                                        {
                                            "dataContext": {"Date": {max : "3/28/2016"}, "Revenue": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue2Light1",
                                                "lineColor":"sapUiChartPaletteSequentialHue2Light1",
                                                "lineType":"line"
                                            },
                                            "displayName":"Cost - Actual",
                                            "dataName" : {
                                                "Revenue" : "Cost - Actual "
                                            }
                                        },
                                        {
                                            "dataContext": {"Date": {min : "4/1/2016"}, "Revenue": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue2Light1",
                                                "lineColor":"sapUiChartPaletteSequentialHue2Light1",
                                                "lineType":"dotted"
                                            },
                                            "displayName":"Cost - Forecast",
                                            "dataName" : {
                                                "Revenue" : "Cost - Forecast"
                                            }
                                        }
                                    ]
                            }
                        },
                        timeAxis: {
                            levels: ["quarter","year"]
                        }
                    }
                },{
                    key: "5",
                    name : "Combined Column & Line with Time Axis",
                    value : ["Revenue", "Revenue2"],
                    vizType : "timeseries_combination",
                    json : "/semanticTimeAxis.json",
                    dataset : {
                       dimensions: [{
                           name: 'Date',
                           value: "{Date}",
                           dataType:'date'
                       }],
                       measures: [{
                           name: 'Revenue',
                           value: '{Revenue}'
                       },{
                           name: 'Revenue2',
                           value: '{Revenue2}'
                       }],
                       data: {
                           path: "/milk"
                       }
                    },
                    vizProperties : {
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                    [
                                        {
                                            "dataContext": {"Date": {max : "3/28/2016"}, "Revenue": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue1Light1"
                                            },
                                            "displayName":"Cost - Actual",
                                            "dataName" : {
                                                "Revenue" : "Cost - Actual"
                                            }
                                        },
                                        {
                                            "dataContext": {"Date": {min : "4/1/2016"}, "Revenue": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue1Light1",
                                                "pattern":"diagonalLightStripe"
                                            },
                                            "displayName":"Cost - Forecast",
                                            "dataName" : {
                                                "Revenue" : "Cost - Forecast"
                                            }
                                        },
                                        {
                                            "dataContext": {"Date": {max : "3/28/2016"}, "Revenue2": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineColor":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineType":"line"
                                            },
                                            "displayName":"Revenue - Actual ",
                                            "dataName" : {
                                                "Revenue2" : "Revenue - Actual"
                                            }
                                        },
                                        {
                                            "dataContext": {"Date": {min : "4/1/2016"}, "Revenue2": '*'},
                                            "properties": {
                                                "color":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineColor":"sapUiChartPaletteSequentialHue1Light1",
                                                "lineType":"dotted"
                                                
                                            },
                                            "displayName":"Revenue - Forecast ",
                                            "dataName" : {
                                                "Revenue2" : "Revenue - Forecast"
                                            }
                                        }
                                    ]
                            }
                        },
                        timeAxis: {
                            levels: ["quarter","year"]
                        }
                    }
                }]
            }
        },
        
        oVizFrame : null,
 
        onInit : function (evt) {
            this.initCustomFormat();
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            this.getView().setModel(oModel);
            
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            var bindValue = this.settingsModel.chartType.values[0];
            oVizFrame.setVizProperties(bindValue.vizProperties);
            var dataModel = new JSONModel(this.dataPath + bindValue.json);
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
        },
        onChartTypeChanged : function(oEvent){
            if(this.oVizFrame){
                var selectedKey = this.chart = parseInt(oEvent.getSource().getSelectedKey());
                var bindValue = this.settingsModel.chartType.values[selectedKey];
                this.oVizFrame.destroyDataset();
                this.oVizFrame.destroyFeeds();
                var dataModel = new JSONModel(this.dataPath + bindValue.json);
                this.oVizFrame.setModel(dataModel);
                var oDataset = new FlattenedDataset(bindValue.dataset);
                this.oVizFrame.setDataset(oDataset);
                this.oVizFrame.setVizType(bindValue.vizType);
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
                var feedActualValues = new FeedItem({
                    'uid': "actualValues",
                    'type': "Measure",
                    'values': ["Revenue"]
                }),
                feedCategoryAxis = new FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Year"]
                }),
                feedTargetValues = new FeedItem({
                    'uid': "targetValues",
                    'type': "Measure",
                    'values': ["Target"]
                }),
                feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': bindValue.value
                }),
                feedTimeAxis = new FeedItem({
                    'uid': "timeAxis",
                    'type': "Dimension",
                    'values': ["Date"]
                });
                switch(selectedKey){
                    case 0:
                        this.oVizFrame.addFeed(feedActualValues);
                        this.oVizFrame.addFeed(feedTargetValues);
                        this.oVizFrame.addFeed(feedCategoryAxis);
                        break;
                    case 2:
                    case 4:
                    case 5:
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedTimeAxis);
                        break;
                    default:
                        this.oVizFrame.addFeed(feedCategoryAxis);
                        this.oVizFrame.addFeed(feedValueAxis);
                        break;
                }
            }
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});