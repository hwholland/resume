jQuery.sap.declare("sap.ui.vbm.sample.AnalyticMapLegend.Component");

sap.ui.core.UIComponent.extend("sap.ui.vbm.sample.AnalyticMapLegend.Component", {

	metadata : {
		rootView : "sap.ui.vbm.sample.AnalyticMapLegend.V",
		dependencies : {
			libs : [
				"sap.m"
			]
		},
		config : {
			sample : {
                stretch : true,
				files : [
					"V.view.xml",
					"C.controller.js"
				]
			}
		}
	}
});