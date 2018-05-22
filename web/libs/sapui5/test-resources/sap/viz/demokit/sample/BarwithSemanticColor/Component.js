jQuery.sap.declare("sap.viz.sample.BarwithSemanticColor.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.BarwithSemanticColor.Component", {

	metadata : {
		rootView : "sap.viz.sample.BarwithSemanticColor.BarwithSemanticColor",
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
					"BarwithSemanticColor.view.xml",
					"BarwithSemanticColor.controller.js"
				]
			}
		}
	}
});