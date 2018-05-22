/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['sap/chart/ChartType','sap/chart/TimeUnitType'],function(C,T){"use strict";var a={};var A={Line:"line",TimeSeriesLine:"timeseries_line"};function l(d){var h=d.some(function(D){return D instanceof sap.chart.data.TimeDimension;});if(h){return A.TimeSeriesLine;}else{return A.Line;}}a.adaptChartType=function(c,d){switch(c){case C.Line:return l(d);default:return c;}};return a;});
