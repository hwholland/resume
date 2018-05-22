jQuery.sap.declare("sap.suite.ui.commons.sample.ComparisonChart.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ComparisonChart.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.ComparisonChart.ComparisonChart",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"ComparisonChart.view.xml",
					"ComparisonChart.controller.js"					
				]
			}
		}
	}
});