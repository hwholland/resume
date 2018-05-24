jQuery.sap.declare("sap.suite.ui.commons.sample.ChartContainerCustomIconsOneChart.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ChartContainerCustomIconsOneChart.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.ChartContainerCustomIconsOneChart.ChartContainer",
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
					"ChartContainerData.json",
					"ChartContainerData1.json"
				]
			}
		}
	}
});