sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        './CustomerFormat',
        './InitPage'
    ], function(jQuery, Controller, JSONModel, FeedItem, CustomerFormat, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.viz.sample.Hierarchical.Hierarchical", {
        
        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue1_revenue2_storeName",
        
        settingsModel : {
            dataset : {
                name: "Dataset",
                defaultSelected : 0,
                values : [{
                    name : "Small",
                    value : "/hierarchySmall.json"
                },{
                    name : "Medium",
                    value : "/hierarchyMedium.json"
                },{
                    name : "Large",
                    value : "/hierarchyLarge.json"
                }]
            },
            chartExamples : {
                name : "Chart Examples",
                defaultSelected : 0,
                enabled : false,
                values : [{
                    name : "Bar Chart",
                    value : "bar"
                }, {
                    name : 'Column Chart',
                    value : "column"
                }]
            }
        },
        
        oVizFrame : null, 
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
                    visible: false,
                    text: 'Revenue by State and Store Name'
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/hierarchySmall.json");
            oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            
            InitPageUtil.initPageSettings(this.getView());
            var that = this;
            dataModel.attachRequestCompleted(function() {
                that.dataSort(this.getData());
            });
        },
        dataSort: function(dataset) {
            //let data sorted by revenue
            if (dataset && dataset.hasOwnProperty("milk")) {
                var arr = dataset.milk;
                var start = 0, end = 0, tmp = [];
                for (var i = 0; i < arr.length; i++) {
                    if (i < arr.length -1 && arr[i + 1]["State"] === arr[i]["State"]) {
                        end++;
                    } else {
                        var part = arr.slice(start, end + 1).sort(function (a, b) {
                            return b.Revenue - a.Revenue;
                        });
                        part.forEach(function(item) {tmp.push(item)});
                        end++;
                        start = end;
                    }
                }
                dataset.milk = tmp;
            }
        },
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            
            var chartExamplesRadioGroup = this.getView().byId('chartExamplesRadioGroup');
            chartExamplesRadioGroup.setSelectedIndex(this.settingsModel.chartExamples.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);
                var that = this;
                dataModel.attachRequestCompleted(function() {
                    that.dataSort(this.getData());
                });
            }
        },
        onChartExamplesSelectd : function(oEvent){
            var chartExamplesRadio = oEvent.getSource();
            if(this.oVizFrame && chartExamplesRadio.getSelected()){
                var bindValue = chartExamplesRadio.getBindingContext().getObject();
                this.oVizFrame.setVizType(bindValue.value);
            }
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    }); 
 
    return Controller;
 
});