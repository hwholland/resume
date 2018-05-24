jQuery.sap.declare("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.ProcessFlowConnectionLabels.V",
		dependencies : {
			libs : [
				"sap.m",
				"sap.ui.layout",
				"sap.ui.core",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"V.view.xml",
					"C.controller.js"
				]
			}
		}
	}
});