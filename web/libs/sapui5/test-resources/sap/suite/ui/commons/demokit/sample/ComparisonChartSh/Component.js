jQuery.sap.declare("sap.suite.ui.commons.sample.ComparisonChartSh.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ComparisonChartSh.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.ComparisonChartSh.ComparisonChartSh",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"ComparisonChartSh.view.xml",
					"ComparisonChartSh.controller.js"					
				]
			}
		}
	}
});