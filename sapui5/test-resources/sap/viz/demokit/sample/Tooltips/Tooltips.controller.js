sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.Tooltips.Tooltips", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume",
 
        onInit : function (evt) {
            this.initCustomFormat();
            
            var oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                interaction: {
                    behaviorType: null
                },
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
                title: {
                    visible: false,
                    text: 'Revenue by City and Store Name'
                },
                tooltip:{
                    visible:true,
                    formatString:CustomerFormat.FIORI_LABEL_FORMAT_2,
                    bodyDimensionLabel:"Stroe Name",
                    bodyDimensionValue: "Store Name"
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/large.json");
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});