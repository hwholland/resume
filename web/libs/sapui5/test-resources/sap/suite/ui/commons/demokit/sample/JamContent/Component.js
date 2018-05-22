jQuery.sap.declare("sap.suite.ui.commons.sample.JamContent.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.JamContent.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.JamContent.JamContent",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"JamContent.view.xml",
					"JamContent.controller.js"
				]
			}
		}
	}
});