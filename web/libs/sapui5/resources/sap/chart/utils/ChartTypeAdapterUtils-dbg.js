/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define([
    'sap/chart/ChartType',
    'sap/chart/TimeUnitType'
],function(
    ChartType,
    TimeUnitType
) {
    "use strict";

    var ChartTypeAdapterUtils = {};

    var oAdapteredChartTypes = {
        Line: "line",
        TimeSeriesLine: "timeseries_line"
    };

    function lineAdaptHandler(aDimensions) {
        var bHasTimeDimension = aDimensions.some(function(oDim) {
            return oDim instanceof sap.chart.data.TimeDimension;
        });
        if (bHasTimeDimension) {
            return oAdapteredChartTypes.TimeSeriesLine;
        } else {
            return oAdapteredChartTypes.Line;
        }
    }

    ChartTypeAdapterUtils.adaptChartType = function(sChartType, aDimensions) {
        switch (sChartType) {
            case ChartType.Line:
                return lineAdaptHandler(aDimensions);
            default:
                return sChartType;
        }
    };

    return ChartTypeAdapterUtils;
});