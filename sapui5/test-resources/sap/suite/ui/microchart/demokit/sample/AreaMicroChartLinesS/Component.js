sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.AreaMicroChartLinesS.Component", {

		metadata: {
			rootView: "sap.suite.ui.microchart.sample.AreaMicroChartLinesS.AreaMicroChartLinesS",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.microchart"
				]
			},
			config: {
				sample: {
					files: [
						"AreaMicroChartLinesS.view.xml",
						"AreaMicroChartLinesS.controller.js"
					]
				}
			}
		}
	});

	return Component;
});