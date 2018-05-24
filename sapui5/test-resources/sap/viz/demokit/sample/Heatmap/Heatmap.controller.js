sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/data/DimensionDefinition',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, FeedItem, DimensionDefinition, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.Heatmap.Heatmap", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/heatmap",
        
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
                defaultState : false
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            },
            dimention : {
                name : "Dimension",
                defaultSelected : 0,
                values : [{
                    name : "1 Dimension",
                    value : "/1d"
                },{
                    name : "2 Dimensions",
                    value : "/2d"
                }]
            },
            color : {
                name : "Color",
                defaultSelected : 1,
                values : [{
                    name : "3 Sections",
                    value : [{
                        "feed": "color",
                        "type": "color",
                        "numOfSegments": 3,
                        "palette": ["sapUiChartPaletteSequentialHue1Light2", "sapUiChartPaletteSequentialHue1", 
                            "sapUiChartPaletteSequentialHue1Dark2"]
                    }]
                },{
                    name : "5 Sections",
                    value : [{
                        "feed": "color",
                        "type": "color",
                        "numOfSegments": 5,
                        "palette": ["sapUiChartPaletteSequentialHue1Light2", "sapUiChartPaletteSequentialHue1Light1", 
                            "sapUiChartPaletteSequentialHue1", "sapUiChartPaletteSequentialHue1Dark1", 
                            "sapUiChartPaletteSequentialHue1Dark2"]
                    }]
                },{
                    name : "8 Sections",
                    value : [{
                        "feed": "color",
                        "type": "color",
                        "numOfSegments": 8,
                        "palette": ["sapUiChartPaletteSequentialHue3Dark1", "sapUiChartPaletteSequentialHue3",
                            "sapUiChartPaletteSequentialHue3Light1", "sapUiChartPaletteSequentialHue3Light2", 
                            "sapUiChartPaletteSequentialHue1Light2", "sapUiChartPaletteSequentialHue1Light1", 
                            "sapUiChartPaletteSequentialHue1", "sapUiChartPaletteSequentialHue1Dark1"]
                    }]
                }]
            }
        },
        
        oVizFrame : null, datasetRadioGroup : null, dimentionRadioGroup : null,  colorRadioGroup : null,flattenedDataset : null,
        monthDimension : new DimensionDefinition({name : "Month", value : "{Month}"}),
        feedCategoryAxis2 : new FeedItem({'uid' : "categoryAxis2",'type' : "Dimension", 'values' : "Month"}),
        onInit : function (evt) {
            this.initCustomFormat();
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            this.getView().setModel(oModel);
            
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    background: {
                        border: {
                            top: {
                                visible: false
                            },
                            bottom: {
                                visible: false
                            },
                            left: {
                                visible: false
                            },
                            right: {
                                visible: false
                            }
                        }
                    },
                    dataLabel: {
                        formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis2: {
                    title: {
                        visible: false
                    }
                },
                legend: {
                    visible: true,
                    formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_10,
                    title: {
                        visible: false
                    }
                },
                title: {
                    visible: false,
                    text: 'Revenue by City and Store Name'
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/1d/medium.json");
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            this.datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            this.datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            
            var seriesRadioGroup = this.getView().byId('seriesRadioGroup');
            seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);
            seriesRadioGroup.setEnabled(this.settingsModel.series.enabled);

            this.dimentionRadioGroup = this.getView().byId('dimentionRadioGroup');
            this.dimentionRadioGroup.setSelectedIndex(this.settingsModel.dimention.defaultSelected);

            this.colorRadioGroup = this.getView().byId('colorRadioGroup');
            this.colorRadioGroup.setSelectedIndex(this.settingsModel.color.defaultSelected);

            this.flattenedDataset = this.oVizFrame.getDataset();
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dimensionSelect = this.settingsModel.dimention.values[this.dimentionRadioGroup.getSelectedIndex()].value;
                var dataModel = new JSONModel(this.dataPath + dimensionSelect + bindValue.value);
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
                    categoryAxis: {
                        title: {
                            visible: state
                        }
                    },
                    categoryAxis2: {
                        title: {
                            visible: state
                        }
                    }
                });
            }
        },
        onDimentionSelected :function(oEvent){
            var dimentionRadio = oEvent.getSource();
            if(this.oVizFrame&&dimentionRadio.getSelected()){
                var bindValue = dimentionRadio.getBindingContext().getObject();
                var datasetSelect = this.settingsModel.dataset.values[this.datasetRadioGroup.getSelectedIndex()].value;
                var dataModel = new JSONModel(this.dataPath + bindValue.value + datasetSelect);
                this.oVizFrame.setModel(dataModel);
                switch(bindValue.name){
                    case "1 Dimension":
                        this.flattenedDataset.removeDimension(this.monthDimension);
                        this.oVizFrame.setDataset(this.flattenedDataset);
                        this.oVizFrame.removeFeed(this.feedCategoryAxis2);
                        break;
                    case "2 Dimensions":
                        this.flattenedDataset.addDimension(this.monthDimension);
                        this.oVizFrame.setDataset(this.flattenedDataset);
                        this.oVizFrame.addFeed(this.feedCategoryAxis2);
                        break;
                }
                var vizScales = this.settingsModel.color.values[this.colorRadioGroup.getSelectedIndex()].value;
                this.oVizFrame.setVizScales(vizScales);
            }
        },
        onColorSelected :function(oEvent){
            var colorRadio = oEvent.getSource();
            if(this.oVizFrame&&colorRadio.getSelected()){
                var bindValue = colorRadio.getBindingContext().getObject();
                this.oVizFrame.setVizScales(bindValue.value);
            }
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});