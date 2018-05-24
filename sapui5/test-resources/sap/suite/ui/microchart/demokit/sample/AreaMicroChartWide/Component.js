sap.ui.define(['sap/ui/core/UIComponent'],
		function(UIComponent) {
		"use strict";

		var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.AreaMicroChartWide.Component", {

			metadata: {
				rootView: "sap.suite.ui.microchart.sample.AreaMicroChartWide.AreaMicroChartWide",
				dependencies: {
					libs: [
						"sap.m",
						"sap.suite.ui.microchart"
					]
				},
				config: {
					sample: {
						files: [
							"AreaMicroChartWide.view.xml",
							"AreaMicroChartWide.controller.js"
						]
					}
				}
			}
		});

		return Component;
	});