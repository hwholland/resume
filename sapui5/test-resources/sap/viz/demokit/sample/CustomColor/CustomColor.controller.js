sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.CustomColor.CustomColor", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume/medium.json",
        
        settingsModel : {
            dataset : {
                name: "Custom Color",
                defaultSelected : 0,
                values : [{
                    name : "Good / Bad",
                    value : ["Revenue"],
                    vizProperties : {
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                [
                                    {
                                        "dataContext": {"Revenue": {"max": 1500000}},
                                        "properties": {
                                            "color":"sapUiChartPaletteSemanticBad"
                                        },
                                        "displayName":"Revenue < 1.5M"
                                    }
                                ],
                                "others":
                                {
                                    "properties": {
                                         "color": "sapUiChartPaletteSemanticGood"
                                    },
                                    "displayName": "Revenue > 1.5M"
                                }
                            }
                        }
                    }
                },{
                    name : "Color One Category",
                    value : ["Revenue"],
                    vizProperties : {
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                [
                                    {
                                        "dataContext": {"Store Name": "Alexei's Specialities"},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue1"
                                        },
                                        "displayName":"Alexei’s Specialties"
                                    }
                                ],
                                "others":
                                {
                                    "properties": {
                                         "color": "sapUiChartPaletteQualitativeHue2"
                                    },
                                    "displayName": "Other Stores"
                                }
                            }
                        }
                    }
                },{
                    name : "Color Two Series",
                    value : ["Revenue", "Cost"],
                    vizProperties :{
                        plotArea: {
                            dataPointStyle: {
                                "rules": 
                                [
                                    {
                                        "dataContext": {"Revenue": "*"},
                                        "properties": {
                                            "color": "sapUiChartPaletteSequentialHue1Light2"
                                        },
                                        "displayName": "2013"
                                    },
                                    {
                                        "dataContext": {"Cost": "*"},
                                        "properties": {
                                            "color": "sapUiChartPaletteSequentialHue1"
                                        },
                                        "displayName": "2014"
                                    }
                                ],
                                "others": null
                            }
                        }
                    }
                }]
            }
        },
        
        oVizFrame : null, 
        feedValueAxis : null,
 
        onInit : function (evt) {
            this.initCustomFormat();
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            this.getView().setModel(oModel);
            
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
                        visible: true
                    },
                     dataPointStyle: {
                        "rules":
                        [
                            {
                                "dataContext": {"Revenue": {"max": 1500000}},
                                "properties": {
                                    "color":"sapUiChartPaletteSemanticBad"
                                },
                                "displayName":"Revenue < 1.5M"
                            }
                        ],
                        "others":
                        {
                            "properties": {
                                 "color": "sapUiChartPaletteSemanticGood"
                            },
                            "displayName": "Revenue > 1.5M"
                        }
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
                    visible: false
                }
            });
            var dataModel = new JSONModel(this.dataPath);
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            this.feedValueAxis = this.getView().byId('feedValueAxis');
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                this.oVizFrame.removeFeed(this.feedValueAxis);
                this.feedValueAxis.setValues(bindValue.value);
                this.oVizFrame.addFeed(this.feedValueAxis);
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
            }
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});