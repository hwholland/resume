sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.ColumnMicroChartSb.Component", {

		metadata: {
			rootView: "sap.suite.ui.microchart.sample.ColumnMicroChartSb.ColumnMicroChartSb",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.microchart"
				]
			},
			config: {
				sample: {
					files: [
						"ColumnMicroChartSb.view.xml",
						"ColumnMicroChartSb.controller.js"
					]
				}
			}
		}
	});

	return Component;
});