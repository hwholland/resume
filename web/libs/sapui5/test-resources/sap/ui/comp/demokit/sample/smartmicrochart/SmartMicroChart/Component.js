sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartmicrochart.SmartMicroChart.Component", {
		metadata: {
			rootView: "sap.ui.comp.sample.smartmicrochart.SmartMicroChart.Page",
			dependencies: {
				libs: [ "sap.m", "sap.suite.ui.microchart" ]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"Page.view.xml",
						"Page.controller.js",
						"/mockserver/Products.json",
						"/mockserver/Series.json",
						"/mockserver/metadata.xml"
					]
				}
			}
		}
	});
});