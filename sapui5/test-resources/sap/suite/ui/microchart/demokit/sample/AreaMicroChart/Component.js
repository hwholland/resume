sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.AreaMicroChart.Component", {

		metadata: {
			rootView: "sap.suite.ui.microchart.sample.AreaMicroChart.AreaMicroChart",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.microchart"
				]
			},
			config: {
				sample: {
					files: [
						"AreaMicroChart.view.xml",
						"AreaMicroChart.controller.js"
					]
				}
			}
		}
	});

	return Component;
});