sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.CustomPopover.CustomPopover", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume/medium.json",
        
        settingsModel : {
            dataset : {
                name: "Custom Popover",
                defaultSelected : 0,
                values : [{
                    name : "Action Button",
                    value : [{
                        type: 'action',
                        text: 'Action',
                        press: function() {
                            console.log('This is a callback function from "Action Button" Action.');
                        }
                    }],
                    popoverProps : null
                },{
                    name : "In-Place Navigation",
                    value : [{
                        type: 'navigation',
                        text: 'Actions',
                        children: [{
                            text: 'Action 1',
                            press: function() {
                                console.log('This is a callback function from "In-Place Navigation" Action1.');
                            }
                        }, {
                            text: 'Action 2',
                            press: function() {
                                console.log('This is a callback function from "In-Place Navigation" Action2.');
                            }
                        }, {
                            text: 'Action 3',
                            press: function() {
                                console.log('This is a callback function from "In-Place Navigation" Action3.');
                            }
                        }]
                    }],
                    popoverProps : null
                },{
                    name : "Custom Content",
                    value : null,
                    popoverProps : {
                        'customDataControl' : function(data){
                            if(data.data.val) {
                                var exData = [{
                                    "Owner": "Brooks A. Williams",
                                    "Phone": "778-721-2235"
                                }, {
                                    "Owner": "Candice C. Bernardi",
                                    "Phone": "204-651-2434"
                                }, {
                                    "Owner": "Robert A. Cofield",
                                    "Phone": "262-684-6815"
                                }, {
                                    "Owner": "Melissa S. Maciel",
                                    "Phone": "778-983-3365"
                                }, {
                                    "Owner": "Diego C. Lawton",
                                    "Phone": "780-644-4957"
                                }, {
                                    "Owner": "Anthony K. Evans",
                                    "Phone": "N/A"
                                }, {
                                    "Owner": "Sue K. Gonzalez",
                                    "Phone": "647-746-4119"
                                }, {
                                    "Owner": "Nancy J. Oneal",
                                    "Phone": "N/A"
                                }, {
                                    "Owner": "Sirena C. Mack",
                                    "Phone": "905-983-3365"
                                }, {
                                    "Owner": "Gloria K. Bowlby",
                                    "Phone": "N/A"
                                }];
                                var values = data.data.val, divStr = "", idx = values[1].value;
                                var svg = "<svg width='10px' height='10px'><path d='M-5,-5L5,-5L5,5L-5,5Z' fill='#5cbae6' transform='translate(5,5)'></path></svg>";
                                divStr = divStr + "<div style = 'margin: 15px 30px 0 10px'>"+ svg + "<b style='margin-left:10px'>" + values[0].value + "</b></div>";
                                divStr = divStr + "<div style = 'margin: 5px 30px 0 30px'>" + values[2].name + "<span style = 'float: right'>" + values[2].value + "</span></div>";
                                divStr = divStr + "<div style = 'margin: 5px 30px 0 30px'>" + "Owner<span style = 'float: right'>" + exData[idx].Owner + "</span></div>";
                                divStr = divStr + "<div style = 'margin: 5px 30px 15px 30px'>" + "Phone<span style = 'float: right'>" + exData[idx].Phone + "</span></div>";
                                return new sap.ui.core.HTML({content:divStr});
                            }
                        }
                    }
                }]
            }
        },
        
        oVizFrame : null, oPopOver : null,
 
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
            
            this.oPopOver = this.getView().byId("idPopOver");
            this.oPopOver.connect(oVizFrame.getVizUid());
            this.oPopOver.setActionItems([{
                type: 'action',
                text: 'Action',
                press: function() {
                            console.log('This is a callback function from "Action Button" Action.');
                        }
            }]);
            this.oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                this.oPopOver = new sap.viz.ui5.controls.Popover(bindValue.popoverProps);
                this.oPopOver.connect(this.oVizFrame.getVizUid());
                this.oPopOver.setActionItems(bindValue.value);
            }
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});