sap.ui.define(['sap/m/MessageToast', 'sap/ui/core/mvc/Controller'],
	function (MessageToast, Controller) {
	"use strict";

	var PageController = Controller.extend("sap.suite.ui.microchart.sample.ColumnMicroChartResponsive.Page", {

		press: function (oEvent) {
			MessageToast.show("The column micro chart responsive is pressed.");
		}

	});

	return PageController;
});