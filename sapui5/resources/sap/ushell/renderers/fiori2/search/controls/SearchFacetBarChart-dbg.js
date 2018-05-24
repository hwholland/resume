/* global sap */
/* global alert */
/* global jQuery */
/* global $ */

(function() {
    "use strict";
    jQuery.sap.require("sap.suite.ui.microchart.ComparisonMicroChart");

    sap.ui.core.Control.extend('sap.ushell.renderers.fiori2.search.controls.SearchFacetBarChart', {


        metadata: {
            properties: {
                lastUpdated: {
                    type: "string"
                },
                aItems: {
                    type: "object"
                }
            },
            aggregations: {
                'items': {
                    type: 'sap.suite.ui.microchart.ComparisonMicroChartData',
                    multiple: true
                }
            }
        },

        constructor: function(options) {
            var that = this;
            that.options = options;
            //var id = options.id;
            //sap.ui.core.Control.prototype.constructor.apply(this, ['outer_' + id]);
            sap.ui.core.Control.prototype.constructor.apply(this);

            this.bindAggregation('items', 'items', function() {

                var oComparisonMicroChartData = new sap.suite.ui.microchart.ComparisonMicroChartData({
                    title: '{label}',
                    value: '{value}',
                    color: {
                        path: 'selected',
                        formatter: function(val) {
                            var res = sap.m.ValueColor.Good;
                            if (!val) {
                                res = sap.m.ValueColor.Neutral;
                            }
                            return res;
                        }
                    },
                    displayValue: '{valueLabel}',
                    press: function(oEvent) {
                        //var oSelectedItem, sSelectedBindingPath;
                        var context = oEvent.getSource().getBindingContext();
                        var model = context.getModel();
                        var data = context.getObject();
                        var isSelected = data.selected;
                        //var becomesSelected = isSelected ? false : true;
                        var filterCondition = data.filterCondition;

                        //oSelectedItem = oEvent.getSource();
                        //sSelectedBindingPath = oSelectedItem.getBindingContext().sPath + "/selected";
                        //model.setProperty(sSelectedBindingPath, becomesSelected);
                        //that.setModel(model);

                        if (isSelected) {
                            //deselect
                            if (that.options.oSearchFacetDialog) {
                                that.options.oSearchFacetDialog.onDetailPageSelectionChangeCharts(oEvent);
                            } else {
                                model.removeFilterCondition(filterCondition, true);
                            }
                            //data.selected = false;
                        } else {
                            //select  ie set filter
                            if (that.options.oSearchFacetDialog) {
                                that.options.oSearchFacetDialog.onDetailPageSelectionChangeCharts(oEvent);
                            } else {
                                model.addFilterCondition(filterCondition, true);
                            }
                            //data.selected = true;
                        }
                    },
                    customData: {
                        key: "selected", //does not work
                        value: "{selected}",
                        writeToDom: true
                    }
                });

                return oComparisonMicroChartData;

            });

        },
        renderer: function(oRm, oControl) {


            // render start of tile container
            oRm.write('<div');
            oRm.writeControlData(oControl);
            oRm.writeClasses();
            oRm.write('>');


            var oComparisonMicroChart = new sap.suite.ui.microchart.ComparisonMicroChart({
                width: "90%",
                colorPalette: "", //the colorPalette merely stops the evaluation of the bar with 'neutral', 'good' etc
                press: function(oEvent) {
                    //not used
                },
                tooltip: ""

            });
            if (oControl.options.oSearchFacetDialog) {
                oComparisonMicroChart.setWidth("95%");
                oComparisonMicroChart.addStyleClass("sapUshellSearchFacetBarChartLarge");
            } else {
                oComparisonMicroChart.addStyleClass("sapUshellSearchFacetBarChart");
            }

            oComparisonMicroChart.addEventDelegate({
                onAfterRendering: function(oEvent) {
                    $('#' + this.sId).has('.Good').addClass("sapUshellSearchFacetBarChartSelected");
                }
            });

            var items = oControl.getItems();
            var items2 = oControl.getAItems();
            if (items.length === 0 && items2) {
                items = items2;
            }
            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                if (!oControl.options.oSearchFacetDialog) {
                    if (item.mProperties.value) {
                        oComparisonMicroChart.addData(item);
                    }
                } else {
                    oComparisonMicroChart.addData(item);
                }
            }
            oRm.renderControl(oComparisonMicroChart);

            // render end of tile container
            oRm.write('</div>');
        },

        setEshRole: function() {}


    });

})();
