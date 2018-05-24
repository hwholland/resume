sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.Pie.Pie", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume",
        
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
                enabled : false,
                values : [{
                    name : "1 Series"
                }, {
                    name : '2 Series'
                }]
            },
            dataLabel : {
                name : "Value Label",
                defaultState : false,
                enabled : false
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
                legend: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    visible: false,
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/medium.json");
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

            var dataLabelSwitch = this.getView().byId('dataLabelSwitch');
            dataLabelSwitch.setEnabled(this.settingsModel.dataLabel.enabled);

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
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});