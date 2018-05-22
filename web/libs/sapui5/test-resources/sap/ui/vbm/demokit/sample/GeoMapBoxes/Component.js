jQuery.sap.declare("sap.ui.vbm.sample.GeoMapBoxes.Component");

sap.ui.core.UIComponent.extend("sap.ui.vbm.sample.GeoMapBoxes.Component", {

	metadata : {
		rootView : "sap.ui.vbm.sample.GeoMapBoxes.V",
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