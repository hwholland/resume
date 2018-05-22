jQuery.sap.declare("sap.suite.ui.commons.sample.BulletChart.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.BulletChart.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.BulletChart.BulletChart",
		dependencies : {
			libs : [
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"BulletChart.view.xml",
					"BulletChart.controller.js"
				]
			}
		}
	}
});