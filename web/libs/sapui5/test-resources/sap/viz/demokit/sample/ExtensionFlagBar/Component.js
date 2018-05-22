jQuery.sap.declare("sap.viz.sample.ExtensionFlagBar.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.ExtensionFlagBar.Component", {
	metadata : {
		rootView : "sap.viz.sample.ExtensionFlagBar.FlagBar",
		dependencies : {
			libs : [
				"sap.viz",
			]
		},
		config : {
			sample : {
				stretch : true,
				files : [
					"FlagBar.view.xml",
					"FlagBar.controller.js"
				]
			}
		}
	}
});