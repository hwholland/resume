jQuery.sap.declare("sap.ui.vbm.sample.GeoMapGeoCircles.Component");

sap.ui.core.UIComponent.extend("sap.ui.vbm.sample.GeoMapGeoCircles.Component", {

	metadata : {
		rootView : "sap.ui.vbm.sample.GeoMapGeoCircles.V",
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