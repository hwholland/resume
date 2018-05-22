jQuery.sap.declare("sap.suite.ui.commons.sample.HarveyBallMicroChart.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.HarveyBallMicroChart.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.HarveyBallMicroChart.HarveyBallMicroChart",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"HarveyBallMicroChart.view.xml",
					"HarveyBallMicroChart.controller.js"
				]
			}
		}
	}
});