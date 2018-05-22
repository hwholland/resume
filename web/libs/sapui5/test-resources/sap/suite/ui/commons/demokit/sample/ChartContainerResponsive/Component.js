jQuery.sap.declare("sap.suite.ui.commons.sample.ChartContainerResponsive.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ChartContainerResponsive.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.ChartContainerResponsive.ChartContainer",
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
					"ChartContainer.controller.js"
				]
			}
		}
	}
});