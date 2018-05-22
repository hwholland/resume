jQuery.sap.declare("sap.suite.ui.commons.sample.MicroAreaChart.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.MicroAreaChart.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.MicroAreaChart.MicroAreaChart",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"MicroAreaChart.view.xml",
					"MicroAreaChart.controller.js"
				]
			}
		}
	}
});