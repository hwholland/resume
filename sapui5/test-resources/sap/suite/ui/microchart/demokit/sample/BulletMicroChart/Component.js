sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.BulletMicroChart.Component", {

		metadata: {
			rootView: "sap.suite.ui.microchart.sample.BulletMicroChart.BulletMicroChart",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.microchart"
				]
			},
			config: {
				sample: {
					files: [
						"BulletMicroChart.view.xml",
						"BulletMicroChart.controller.js"
					]
				}
			}
		}
	});

	return Component;
});