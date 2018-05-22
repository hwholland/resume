jQuery.sap.declare("sap.viz.sample.BarWithLegend.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.BarWithLegend.Component", {

	metadata : {
		rootView : "sap.viz.sample.BarWithLegend.Bar",
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
					"Bar.view.xml",
					"Bar.controller.js"
				]
			}
		}
	}
});