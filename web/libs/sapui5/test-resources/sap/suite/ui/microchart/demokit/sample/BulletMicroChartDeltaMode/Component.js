sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.BulletMicroChartDeltaMode.Component", {

		metadata: {
			rootView: "sap.suite.ui.microchart.sample.BulletMicroChartDeltaMode.BulletMicroChartDeltaMode",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.microchart"
				]
			},
			config: {
				sample: {
					files: [
						"BulletMicroChartDeltaMode.view.xml",
						"BulletMicroChartDeltaMode.controller.js"
					]
				}
			}
		}
	});

	return Component;
});