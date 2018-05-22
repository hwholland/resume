jQuery.sap.declare("sap.suite.ui.commons.sample.BulletChartDeltaMode.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.BulletChartDeltaMode.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.BulletChartDeltaMode.BulletChartDeltaMode",
		dependencies : {
			libs : [
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"BulletChartDeltaMode.view.xml",
					"BulletChartDeltaMode.controller.js"
				]
			}
		}
	}
});