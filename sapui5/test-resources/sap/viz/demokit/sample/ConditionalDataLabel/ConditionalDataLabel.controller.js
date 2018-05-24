sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.ConditionalDataLabel.ConditionalDataLabel", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume/month.json",
        
        settingsModel : {
            customValueDisplay : {
                name: "Custom Value Display",
                defaultSelected : 0,
                values : [{
                    name : "First & Last",
                    vizProperties : {                        
                        plotArea: {
                                callout: {
                                    top: [{
                                        dataContext: [{
                                            Month: "Jan"
                                        },{
                                            Month: "Dec"
                                        }]
                                    }]
                                },
                                dataPointStyle: {
                                        "rules":
                                        [
                                    {
                                        "dataContext": {"Month": "Jan"},
                                        "properties": {
                                            "dataLabel": true
                                        }
                                    },
                                    {
                                        "dataContext": {"Month": "Dec"},
                                        "properties": {
                                            "dataLabel": true
                                        }
                                    }
                                ],
                                "others":
                                {
                                    "properties": {
                                         "dataLabel": false
                                    }
                                }
                            }
                        }
                    }
                },{
                    name : "Max & Min",
                    vizProperties : {
                        plotArea: {
                            callout: {
                                left: [{
                                    dataContext: [{
                                        Month: "Sep"
                                    },{
                                        Month: "Mar"
                                    }]
                                }]
                            },
                            dataPointStyle: {
                                "rules":
                                [
                            {
                                "dataContext": {"Month": "Sep"},
                                "properties": {
                                    "dataLabel": true
                                }
                            },
                            {
                                "dataContext": {"Month": "Mar"},
                                "properties": {
                                    "dataLabel": true
                                }
                            }
                        ],
                                "others":
                                {
                                    "properties": {
                                         "dataLabel": false
                                    }
                                }
                            }
                        }
                    }
                },{
                    name : "1 Specific Date Only",
                    vizProperties : {
                        plotArea: {
                            callout: {
                                top: [{
                                    dataContext: [{
                                        Month: "Jul"
                                    }]
                                }]
                            },
                            dataPointStyle: {
                                "rules": 
                                [
                                    {
                                        "dataContext": {"Month": "Jul"},
                                        "properties": {
                                            "dataLabel": true
                                        }
                                    }
                                ],
                                "others": 
                                {
                                    "properties": {
                                        "dataLabel": false
                                    }
                                }
                            }
                        }
                    }
                }]
            },
            valueLabelPosition : {
                name: "Value Label Position",
                defaultSelected : 0,
                values : [{
                    name : "Outside",
                    value: false
                },{
                    name : "Inside",
                    value: true
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
            var plotArea = this.settingsModel.customValueDisplay.values[0].vizProperties.plotArea;
            var valueLabelPosition = this.settingsModel.valueLabelPosition.values[0].value;
            var vizProperties = {
                interaction: {
                        zoom: {
                            enablement: "disabled"
                        }
                    },
                valueAxis: {
                        label: {
                            formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_10
                        },
                        title: {
                            visible: false
                        },
                        visible: false
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                dataLabel: {
                    formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_1,
                    hideWhenOverlap : false
                },
                title: {
                    visible: false
                },
                legend: {
                    visible: false
                }
            };
            vizProperties.plotArea = {};
            vizProperties.plotArea.isFixedDataPointSize = false;
            vizProperties.plotArea.callout = {};
            vizProperties.plotArea.callout.label = {};
            vizProperties.plotArea.callout.label.formatString = CustomerFormat.FIORI_LABEL_SHORTFORMAT_2;
            if(valueLabelPosition) {
                vizProperties.plotArea.dataPointStyle = plotArea.dataPointStyle;
                vizProperties.plotArea.callout.top = null;
                vizProperties.plotArea.callout.left = null;
            }
            else {
                vizProperties.plotArea.dataPointStyle = null;
                vizProperties.plotArea.callout.top = plotArea.callout.top;
                vizProperties.plotArea.callout.left = plotArea.callout.left;
            }
            this._plotAreaProps = plotArea;
            this._valueLabelPosition = valueLabelPosition;

            oVizFrame.setVizProperties(vizProperties);
            var dataModel = new JSONModel(this.dataPath);
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            var customValueDisplayRadioGroup = this.getView().byId('customValueDisplayRadioGroup');
            customValueDisplayRadioGroup.setSelectedIndex(this.settingsModel.customValueDisplay.defaultSelected);

            var valueLabelPositionRadioGroup = this.getView().byId('valueLabelPositionRadioGroup');
            valueLabelPositionRadioGroup.setSelectedIndex(this.settingsModel.valueLabelPosition.defaultSelected);
        },
        updateProperties : function() {
            if(this.oVizFrame) {
                var vizProperties = {};
                vizProperties.plotArea = {};
                vizProperties.plotArea.callout = {};
                vizProperties.plotArea.callout.label = {};
                vizProperties.plotArea.callout.label.formatString = CustomerFormat.FIORI_LABEL_SHORTFORMAT_2;

                if(this._valueLabelPosition) {
                    vizProperties.plotArea.dataPointStyle = this._plotAreaProps.dataPointStyle;
                    vizProperties.plotArea.callout.top = null;
                    vizProperties.plotArea.callout.left = null;
                }
                else {
                    vizProperties.plotArea.dataPointStyle = null;
                    vizProperties.plotArea.callout.top = this._plotAreaProps.callout.top;
                    vizProperties.plotArea.callout.left = this._plotAreaProps.callout.left;
                }

                this.oVizFrame.setVizProperties(vizProperties);
            }
        },
        onCustomValueSelected : function(oEvent){
            var eRatio = oEvent.getSource();
            if(eRatio.getSelected()){
                var bindValue = eRatio.getBindingContext().getObject();
                if(bindValue.vizProperties && bindValue.vizProperties.plotArea) {
                    this._plotAreaProps = bindValue.vizProperties.plotArea;
                }
                this.updateProperties();
            }
        },
        onLabelPosSelected : function(oEvent) {
            var eRatio = oEvent.getSource();
            if(eRatio.getSelected()) {
                var bindValue = eRatio.getBindingContext().getObject();
                this._valueLabelPosition = bindValue.value;
                this.updateProperties();
            }
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});
