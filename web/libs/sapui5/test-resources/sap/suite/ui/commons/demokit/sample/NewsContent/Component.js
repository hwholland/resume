jQuery.sap.declare("sap.suite.ui.commons.sample.NewsContent.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.NewsContent.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.NewsContent.NewsContent",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"NewsContent.view.xml",
					"NewsContent.controller.js"
				]
			}
		}
	}
});