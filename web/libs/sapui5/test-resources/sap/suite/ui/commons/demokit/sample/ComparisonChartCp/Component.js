jQuery.sap.declare("sap.suite.ui.commons.sample.ComparisonChartCp.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ComparisonChartCp.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.ComparisonChartCp.ComparisonChartCp",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"ComparisonChartCp.view.xml",
					"ComparisonChartCp.controller.js"					
				]
			}
		}
	}
});