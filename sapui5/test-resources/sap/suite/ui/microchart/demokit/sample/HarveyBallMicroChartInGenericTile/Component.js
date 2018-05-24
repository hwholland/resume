sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.HarveyBallMicroChartInGenericTile.Component", {

		metadata: {
			rootView: "sap.suite.ui.microchart.sample.HarveyBallMicroChartInGenericTile.Page",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.microchart"
				]
			},
			config: {
				sample: {
					files: [
						"Page.view.xml",
						"Page.controller.js"
					]
				}
			}
		}
	});

	return Component;
});