jQuery.sap.declare("sap.suite.ui.commons.sample.NumericContentIcon.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.NumericContentIcon.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.NumericContentIcon.NumericContentIcon",
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
					"NumericContentIcon.view.xml",
					"NumericContentIcon.controller.js"
				]
			}
		}
	}
});