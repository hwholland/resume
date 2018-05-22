jQuery.sap.declare("sap.viz.sample.CombinedStackedBarLine.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.CombinedStackedBarLine.Component", {

	metadata : {
		rootView : "sap.viz.sample.CombinedStackedBarLine.HorCombStacked",
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
					"HorCombStacked.view.xml",
					"HorCombStacked.controller.js"
				]
			}
		}
	}
});