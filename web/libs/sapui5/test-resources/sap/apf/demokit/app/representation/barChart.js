jQuery.sap.declare('sap.apf.demokit.app.representation.barChart');
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");
/**
 * @class barChart constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
sap.apf.demokit.app.representation.barChart = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = "BarChart";
	this.chartType = "Bar";
};
sap.apf.demokit.app.representation.barChart.prototype = Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);
//Set the "constructor" property to refer to barChart
sap.apf.demokit.app.representation.barChart.prototype.constructor = sap.apf.demokit.app.representation.barChart;
/**
 * @method handleCustomFormattingOnChart
 * @description sets the custom format string
 */
sap.apf.demokit.app.representation.barChart.prototype.handleCustomFormattingOnChart = function() {
	var superClass = this;
	var aMeasure = superClass.getMeasures();
	var sFormatString = superClass.getFormatStringForMeasure(aMeasure[0]); //get the format string from base class
	superClass.setFormatString("xAxis", sFormatString);
};
