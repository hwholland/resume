jQuery.sap.declare("sap.suite.ui.commons.sample.DynamicContainer.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.DynamicContainer.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.DynamicContainer.DynamicContainer",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"DynamicContainer.view.xml"
				]
			}
		}
	}
});