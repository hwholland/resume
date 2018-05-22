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
    
    var Controller = Controller.extend("sap.viz.sample.ReferenceLine.ReferenceLine", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data",
        
        settingsModel : {
            dataset : {
                name: "Examples",
                defaultSelected : 0,
                values : [{
                    name : "With Value Axis",
                    value : "/revenue_cost_consume/medium.json",
                    vizType : "bar",
                    dataset : {
                        dimensions: [{
                            name: "Store Name",
                            value: "{Store Name}"
                        }],
                        measures: [{
                            name: 'Revenue',
                            value: '{Revenue}'
                        }, {
                            name: 'Cost',
                            value: '{Cost}'
                        }],
                        data: {
                            path: "/milk"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            dataLabel: {
                                visible: true,
                                formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2
                            },
                            referenceLine: {
                                line: {
                                    valueAxis: [{
                                        value: 2326251,
                                        visible: true,
                                        size: 1,
                                        type: "dotted",
                                        label: {
                                            text: "Target",
                                            visible: true
                                        }
                                    }]
                                }
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
                            text: 'Revenue by City and Store Name'
                        }
                    }
                },{
                    name : "With Time Axis",
                    value : "/date_revenue_cost/column/large.json",
                    vizType : "timeseries_line",
                    dataset : {
                        dimensions: [{
                            name: 'Date',
                            value: "{Date}",
                            dataType: 'date'
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
                        valueAxis: {
                            visible: true,
                            label: {
                                formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_10
                            },
                            title: {
                                visible: false
                            }
                        },
                        timeAxis: {
                            title: {
                                visible: false
                            },
                            levelConfig: {
                                "year": {
                                    row: 2
                                }
                            }
                        },
                        plotArea: {
                            window: {
                                start: "7/5/2012",
                                end: "6/30/2013"
                            },
                            dataLabel: {
                                visible: false
                            },
                            referenceLine: {
                                line: {
                                    timeAxis: [{
                                        value: "1/1/2013",
                                        visible: true,
                                        size: 1,
                                        type: "dotted",
                                        label: {
                                            text: "Today",
                                            visible: true
                                        }
                                    }]
                                }
                            }
                        },
                        title: {
                            visible: false
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
            oVizFrame.setVizProperties(this.settingsModel.dataset.values[0].vizProperties);
            var dataModel = new JSONModel(this.dataPath + "/revenue_cost_consume/medium.json");
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                this.oVizFrame.destroyDataset();
                this.oVizFrame.destroyFeeds();
                var bindValue = datasetRadio.getBindingContext().getObject();
                this.oVizFrame.setVizType(bindValue.vizType);
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
                this.oVizFrame.setDataset(new FlattenedDataset(bindValue.dataset));
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);
                var feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': ["Revenue"]
                }),
                feedCategoryAxis = new FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Store Name"]
                }),
                feedTimeAxis = new FeedItem({
                    'uid': "timeAxis",
                    'type': "Dimension",
                    'values': ["Date"]
                });
                this.oVizFrame.addFeed(feedValueAxis);
                switch(bindValue.vizType){
                    case "bar":
                        this.oVizFrame.addFeed(feedCategoryAxis);
                        break;
                    case "timeseries_line":
                        this.oVizFrame.addFeed(feedTimeAxis);
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