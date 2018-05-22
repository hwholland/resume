jQuery.sap.declare("sap.viz.sample.Bar_with_conditional_dataLabel.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.Bar_with_conditional_dataLabel.Component", {

	metadata : {
		rootView : "sap.viz.sample.Bar_with_conditional_dataLabel.Bar_with_conditional_dataLabel",
		dependencies : {
			libs : [
				"sap.viz",
				"sap.m"
			]
		},
		config : {
			sample : {
				stretch : true,
				files : [
					"Bar_with_conditional_dataLabel.view.xml",
					"Bar_with_conditional_dataLabel.controller.js"
				]
			}
		}
	}
});