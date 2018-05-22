jQuery.sap.declare("sap.ui.vbm.sample.AnalyticMapPies.Component");

sap.ui.core.UIComponent.extend("sap.ui.vbm.sample.AnalyticMapPies.Component", {

	metadata : {
		rootView : "sap.ui.vbm.sample.AnalyticMapPies.V",
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
					"C.controller.js",
					"Data.json"
				]
			}
		}
	}
});