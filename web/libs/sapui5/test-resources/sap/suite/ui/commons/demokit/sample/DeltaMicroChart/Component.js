jQuery.sap.declare("sap.suite.ui.commons.sample.DeltaMicroChart.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.DeltaMicroChart.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.DeltaMicroChart.DeltaMicroChart",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"DeltaMicroChart.view.xml",
					"DeltaMicroChart.controller.js"
				]
			}
		}
	}
});