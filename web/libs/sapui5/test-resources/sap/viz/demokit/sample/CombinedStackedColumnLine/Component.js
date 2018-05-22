jQuery.sap.declare("sap.viz.sample.CombinedStackedColumnLine.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.CombinedStackedColumnLine.Component", {

	metadata : {
		rootView : "sap.viz.sample.CombinedStackedColumnLine.CombStacked",
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
					"CombStacked.view.xml",
					"CombStacked.controller.js"
				]
			}
		}
	}
});