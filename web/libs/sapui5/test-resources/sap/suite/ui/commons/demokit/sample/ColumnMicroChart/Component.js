jQuery.sap.declare("sap.suite.ui.commons.sample.ColumnMicroChart.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ColumnMicroChart.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.ColumnMicroChart.ColumnMicroChart",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"ColumnMicroChart.view.xml",
					"ColumnMicroChart.controller.js"					
				]
			}
		}
	}
});