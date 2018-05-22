sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartmicrochart.SmartBulletMicroChart.exampleDirect.Component", {
		metadata: {
			rootView: "sap.ui.comp.sample.smartmicrochart.SmartBulletMicroChart.exampleDirect.Page",
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
						"/mockserver/metadata.xml"
					]
				}
			}
		}
	});
});