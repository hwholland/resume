jQuery.sap.declare("sap.viz.sample.TimeBubble.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.PopoverFormatter.Component", {

	metadata : {
		rootView : "sap.viz.sample.PopoverFormatter.PopoverFormatter",
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
					"PopoverFormatter.view.xml",
					"PopoverFormatter.controller.js"
				]
			}
		}
	}
});