jQuery.sap.declare("sap.suite.ui.commons.sample.NumericContentDifSizes.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.NumericContentDifSizes.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.NumericContentDifSizes.NumericContentDifSizes",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"NumericContentDifSizes.view.xml",
					"NumericContentDifSizes.controller.js"
				]
			}
		}
	}
});