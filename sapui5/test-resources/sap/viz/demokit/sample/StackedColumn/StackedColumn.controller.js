sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, FlattenedDataset, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.StackedColumn.StackedColumn", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume",
        
        settingsModel : {
            dataset : {
                name: "Dataset",
                defaultSelected : 1,
                values : [{
                    name : "Small",
                    value : "/betterSmall.json"
                },{
                    name : "Medium",
                    value : "/betterMedium.json"
                },{
                    name : "Large",
                    value : "/betterLarge.json"
                }]
            },
            series : {
                name : "Series",
                defaultSelected : 1,
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
                defaultState : false
            },
            type : {
                name : "Stacked Type",
                defaultSelected : 0,
                values : [{
                    name : "Regular",
                    vizType : "stacked_column",
                    vizProperties : {
                        plotArea: {
                            dataLabel: {
                                formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2
                            }
                        }
                    }
                },{
                    name : "100%",
                    vizType : "100_stacked_column",
                    vizProperties : {
                        plotArea: {
                            mode: "percentage",
                            dataLabel: {
                                type: "percentage",
                                formatString:CustomerFormat.FIORI_PERCENTAGE_FORMAT_2
                            }
                        }
                    }
                }]
            },
            dimensions: {
                Small: [{
                    name: 'Seasons',
                    value: "{Seasons}",
                }],
                Medium: [{
                    name: 'Week',
                    value: "{Week}",
                }],
                Large: [{
                    name: 'Week',
                    value: "{Week}",
                }]
            },
            measures: [{
               name: 'Cost1',
               value: '{Cost1}'
            },{
               name: 'Cost2',
               value: '{Cost2}'
            }]
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
                title: {
                    visible: false,
                    text: 'Revenue by City and Store Name'
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/betterMedium.json");
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

            var typeRadioGroup = this.getView().byId('typeRadioGroup');
            typeRadioGroup.setSelectedIndex(this.settingsModel.type.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataset = {
                    data: {
                        path: "/milk"
                    }
                };
                var dim = this.settingsModel.dimensions[bindValue.name];
                dataset.dimensions = dim;
                dataset.measures = this.settingsModel.measures;
                var oDataset = new FlattenedDataset(dataset);
                this.oVizFrame.setDataset(oDataset);
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);

                var feed = [];
                for (var i = 0; i < dim.length; i++) {
                    feed.push(dim[i].name);
                }
                var feeds = this.oVizFrame.getFeeds();
                for (var i = 0; i < feeds.length; i++) {
                    if (feeds[i].getUid() === "categoryAxis") {
                        var categoryAxisFeed = feeds[i];
                        this.oVizFrame.removeFeed(categoryAxisFeed);
                        var feed = [];
                        for (var i = 0; i < dim.length; i++) {
                            feed.push(dim[i].name);
                        }
                        categoryAxisFeed.setValues(feed);
                        this.oVizFrame.addFeed(categoryAxisFeed);
                        break;
                    }
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
                    categoryAxis: {
                        title: {
                            visible: state
                        }
                    }
                });
            }
        },
        onTypeSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var typeRadio = oEvent.getSource();
            if(this.oVizFrame && typeRadio.getSelected()){
                var bindValue = typeRadio.getBindingContext().getObject();
                this.oVizFrame.setVizType(bindValue.vizType);
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
            }
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});