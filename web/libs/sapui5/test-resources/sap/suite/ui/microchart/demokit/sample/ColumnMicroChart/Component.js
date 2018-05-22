sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.ColumnMicroChart.Component", {

		metadata: {
			rootView: "sap.suite.ui.microchart.sample.ColumnMicroChart.ColumnMicroChart",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.microchart"
				]
			},
			config: {
				sample: {
					files: [
						"ColumnMicroChart.view.xml",
						"ColumnMicroChart.controller.js"
					]
				}
			}
		}
	});

	return Component;
});