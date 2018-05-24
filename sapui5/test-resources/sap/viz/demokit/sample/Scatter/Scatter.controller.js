sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.Scatter.Scatter", {
        
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
                defaultState : false
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            }
        },
        
        oVizFrame : null, datasetRadioGroup : null, seriesRadioGroup : null,
 
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
                        visible: false,
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
                legend: {
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
                    visible: false
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/1_percent/medium.json");
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            this.datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            this.datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            
            this.seriesRadioGroup = this.getView().byId('seriesRadioGroup');
            this.seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var seriesValue = this.settingsModel.series.values[this.seriesRadioGroup.getSelectedIndex()];
                var dataModel = new JSONModel(this.dataPath + seriesValue.value + bindValue.value);
                this.oVizFrame.setModel(dataModel);
            }
        },
        onSeriesSelected : function(oEvent){
            var seriesRadio = oEvent.getSource();
            if(this.oVizFrame && seriesRadio.getSelected()){
                var bindValue = seriesRadio.getBindingContext().getObject();
                var datasetValue = this.settingsModel.dataset.values[this.datasetRadioGroup.getSelectedIndex()];
                var dataModel = new JSONModel(this.dataPath + bindValue.value + datasetValue.value);
                this.oVizFrame.setModel(dataModel);
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