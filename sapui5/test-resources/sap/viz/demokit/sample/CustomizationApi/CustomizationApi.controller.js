sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.CustomizationApi.CustomizationApi", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume/transportation.json",
 
        onInit : function (evt) {
            // Config the baseUrl for requireJS to find the specific module or file
            requirejs.config({
                baseUrl: jQuery.sap.getModulePath("sap.viz.sample.CustomizationApi", "/sample")
            });

            this.initCustomFormat();
            var oVizFrame = this.getView().byId("idVizFrame");
            var dataModel = new JSONModel(this.dataPath);
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
            
            require(['hw-bundle'], function () {
                oVizFrame.setVizCustomizations({
                    id: "com.sap.viz.custom.infoColumn",                   
                    customRendererProperties: {
                        "com.sap.viz.categoryAxis.labelRenderer":
                        {
                            "rules": [
                            {
                                "dataContext": [{'Transportation Mode': "Truck"}],
                                "properties": {
                                    fill: "blue",
                                    stroke: "blue"
                                }
                            },
                            {
                                "dataContext": [{'Transportation Mode': "Highspeed"}],
                                "properties": {
                                    fill: "blue",
                                    stroke: "blue"
                                }
                            },
                            {
                                "dataContext": [{'Transportation Mode': "Ship"}],
                                "properties": {
                                    fill: "blue",
                                    stroke: "blue"
                                }
                            },
                            {
                                "dataContext": [{'Transportation Mode': "Plane"}],
                                "properties": {
                                    fill: "blue",
                                    stroke: "blue"
                                }
                            }
                            ]
                        }
                    }
                });
 
                oVizFrame.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: true,
                            formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2
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
                            text: "Transportation Mode"
                        }
                    },
                    title: {
                        visible: false
                    }
                });
            }.bind(this));
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});