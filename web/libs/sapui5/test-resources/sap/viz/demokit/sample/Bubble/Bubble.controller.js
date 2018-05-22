sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, FeedItem, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.Bubble.Bubble", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume_fatPercentage",
        settingsModel : {
            dataset : {
                name: "Dataset",
                defaultSelected : 1,
                values : [{
                    name : "Small",
                    value : "/small.json"
                },{
                    name : "Medium",
                    value : "/medium.json"
                },{
                    name : "Large",
                    value : "/large.json"
                }]
            },
            series : {
                name : "Series",
                defaultSelected : 0,
                values : [{
                    name : "1 Series",
                    value : "/1_percent"
                }, {
                    name : '2 Series',
                    value : "/2_percent"
                }]
            },
            dataLabel : {
                name : "Value Label",
                defaultState : true
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            }
        },
        
        oVizFrame : null,
 
        onInit : function (evt) {
            this.initCustomFormat();
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            this.getView().setModel(oModel);
            
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
                        visible: true,
                        hideWhenOverlap: true
                    }
                },
                valueAxis: {
                    label: {
                        formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_10
                    },
                    title: {
                        visible: false
                    }
                },
                valueAxis2: {
                    label: {
                        formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_10
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
                sizeLegend: {
                    formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
                    title: {
                        visible: true
                    }
                },
                title: {
                    visible: false,
                    text: 'Revenue by City and Store Name'
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/1_percent/medium.json");
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
            oVizFrame.getDataset().setContext("Store Name");
        },
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            
            var seriesRadioGroup = this.getView().byId('seriesRadioGroup');
            seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var series = this.settingsModel.series.values[this.getView().byId('seriesRadioGroup').getSelectedIndex()].value;
                var dataModel = new JSONModel(this.dataPath + series + bindValue.value);
                this.oVizFrame.setModel(dataModel);
                this.oVizFrame.getDataset().setContext("Store Name");
            }
        },
        onSeriesSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var seriesRadio = oEvent.getSource();
            if(this.oVizFrame && seriesRadio.getSelected()){
                this.oVizFrame.destroyFeeds();
                var bindValue = seriesRadio.getBindingContext().getObject();
                var dataset = this.settingsModel.dataset.values[this.getView().byId('datasetRadioGroup').getSelectedIndex()].value;
                var dataModel = new JSONModel(this.dataPath + bindValue.value + dataset);
                this.oVizFrame.setModel(dataModel);
                var feedColor = new FeedItem({
                    'uid': "color",
                    'type': "Dimension",
                    'values': ["Fat Percentage"]
                });
                var feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': ["Revenue"]
                });
                var feedValueAxis2 = new FeedItem({
                    'uid': "valueAxis2",
                    'type': "Measure",
                    'values': ["Cost"]
                });
                var feedBubbleWidth = new FeedItem({
                    'uid': "bubbleWidth",
                    'type': "Measure",
                    'values': ["Consumption"]
                });
                this.oVizFrame.addFeed(feedValueAxis);
                this.oVizFrame.addFeed(feedValueAxis2);
                this.oVizFrame.addFeed(feedBubbleWidth);
                if (seriesRadio.getText().indexOf("2") > -1) {
                    this.oVizFrame.addFeed(feedColor);
                }

            }
        },
        onDataLabelChanged : function(oEvent){
            if(this.oVizFrame){
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: oEvent.getParameter('state')
                        }
                    }
                });
            }
        },
        onAxisTitleChanged : function(oEvent){
            if(this.oVizFrame){
                var state = oEvent.getParameter('state');
                this.oVizFrame.setVizProperties({
                    valueAxis: {
                        title: {
                            visible: state
                        }
                    },
                    valueAxis2: {
                        title: {
                            visible: state
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: state
                        }
                    }
                });
            }
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});