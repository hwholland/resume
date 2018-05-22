jQuery.sap.declare("sap.viz.sample.TimeBubble.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.TimeBubble.Component", {

	metadata : {
		rootView : "sap.viz.sample.TimeBubble.TimeBubble",
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
					"TimeBubble.view.xml",
					"TimeBubble.controller.js"
				]
			}
		}
	}
});