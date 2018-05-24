sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.Waterfall.Waterfall", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume",
        
        settingsModel : {
            dataset : {
                name: "Dataset",
                defaultSelected : 1,
                values : [{
                    name : "Small",
                    value : "/waterfallSmall.json"
                },{
                    name : "Medium",
                    value : "/waterfallMedium.json"
                }]
            },
            series : {
                name : "Series",
                defaultSelected : 0,
                enabled : false,
                values : [{
                    name : "1 Series"
                }, {
                    name : '2 Series'
                }]
            },
            dataLabel : {
                name : "Value Label",
                defaultState : true
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false,
                enabled : false
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
                        visible: true
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
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                legend: {
                    title: {
                        visible: false
                    },
                    label: {
                        text: {
                            negativeValue: "Cost",
                            positiveValue: "Revenue"
                        }
                    }
                },
                title: {
                    visible: false,
                    text: 'Revenue by City and Store Name'
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/waterfallMedium.json");
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            
            var seriesRadioGroup = this.getView().byId('seriesRadioGroup');
            seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);
            seriesRadioGroup.setEnabled(this.settingsModel.series.enabled);

            var axisTitleSwitch = this.getView().byId('axisTitleSwitch');
            axisTitleSwitch.setEnabled(this.settingsModel.axisTitle.enabled);
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
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
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});