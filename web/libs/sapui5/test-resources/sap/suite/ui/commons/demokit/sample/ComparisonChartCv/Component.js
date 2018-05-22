jQuery.sap.declare("sap.suite.ui.commons.sample.ComparisonChartCv.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ComparisonChartCv.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.ComparisonChartCv.ComparisonChartCv",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"ComparisonChartCv.view.xml",
					"ComparisonChartCv.controller.js"					
				]
			}
		}
	}
});