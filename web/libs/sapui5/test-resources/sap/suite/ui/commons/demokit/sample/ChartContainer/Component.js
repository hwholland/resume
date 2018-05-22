jQuery.sap.declare("sap.suite.ui.commons.sample.ChartContainer.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ChartContainer.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.ChartContainer.ChartContainer",
		dependencies : {
			libs : [
				"sap.m",
				"sap.ui.core",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"ChartContainer.view.xml",
					"ChartContainer.controller.js",
					"AnalyticMap.json"
				 ]
			}
		}
	}
});