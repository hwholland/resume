jQuery.sap.declare("sap.suite.ui.commons.sample.ColumnMicroChartLbls.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ColumnMicroChartLbls.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.ColumnMicroChartLbls.ColumnMicroChartLbls",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"ColumnMicroChartLbls.view.xml",
					"ColumnMicroChartLbls.controller.js"					
				]
			}
		}
	}
});