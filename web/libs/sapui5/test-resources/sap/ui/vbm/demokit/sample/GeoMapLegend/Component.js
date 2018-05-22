jQuery.sap.declare("sap.ui.vbm.sample.GeoMapLegend.Component");

sap.ui.core.UIComponent.extend("sap.ui.vbm.sample.GeoMapLegend.Component", {

	metadata : {
		rootView : "sap.ui.vbm.sample.GeoMapLegend.V",
		dependencies : {
			libs : [
				"sap.m"
			]
		},
		config : {
			sample : {
                stretch : true,
				files : [
					"V.view.xml"
				]
			}
		}
	}
});