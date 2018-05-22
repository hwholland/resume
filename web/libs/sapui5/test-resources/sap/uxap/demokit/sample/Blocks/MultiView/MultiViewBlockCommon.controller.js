(function () {
    'use strict';
    jQuery.sap.declare({modName: "sap.uxap.sample.Blocks.MultiView.MultiViewBlockCommon", "type": "controller"});

    sap.ui.core.mvc.Controller.extend("sap.uxap.sample.Blocks.MultiView.MultiViewBlockCommon", {

        onInit: function () {
            this.oChart = this.getView().byId("chart");

            this.oChart.getDataLabel().setVisible(true);

            var oModel = new sap.ui.model.json.JSONModel({
                data:[
                    { Year : 2010, Salary: 120000   },
                    { Year : 2011, Salary: 130000    },
                    { Year : 2012, Salary: 135000    },
                    { Year : 2013, Salary: 145000    },
                    { Year : 2014, Salary: 150000    }
                ]
            });

            var oDataSet = new sap.viz.ui5.data.FlattenedDataset({
                dimensions : [
                    {
                        axis : 1,
                        name : 'Year',
                        value : "{Year}"
                    }
                ],

                measures : [
                    // measure 1
                    {
                        name : 'Salary', // 'name' is used as label in the Legend
                        value : '{Salary}' // 'value' defines the binding for the displayed value
                    }
                ],
                // 'data' is used to bind the whole data collection that is to be displayed in the chart
                data : {
                    path : "/data"
                }
            });

            this.oChart.setModel(oModel);
            this.oChart.setDataset(oDataSet);
        },

        handleSelect: function (oEvent) {

            var sCurrentMode = this.oParentBlock.getMode();
            var oSegmentedButton = oEvent.getSource();

            if (oEvent.getParameter("id").indexOf("lineChartBtn") > -1 && sCurrentMode == sap.uxap.ObjectPageSubSectionMode.Expanded) {
                oSegmentedButton.setSelectedButton(oSegmentedButton.getButtons()[1]);
                this.oParentBlock.setMode(sap.uxap.ObjectPageSubSectionMode.Collapsed);
            }
            else if (oEvent.getParameter("id").indexOf("barChartBtn") > -1 && sCurrentMode == sap.uxap.ObjectPageSubSectionMode.Collapsed) {
                oSegmentedButton.setSelectedButton(oSegmentedButton.getButtons()[0]);
                this.oParentBlock.setMode(sap.uxap.ObjectPageSubSectionMode.Expanded);
            }
        }
    });
}());

