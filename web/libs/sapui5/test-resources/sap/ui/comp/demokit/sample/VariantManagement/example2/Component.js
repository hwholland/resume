jQuery.sap.declare("sap.ui.comp.sample.VariantManagement.example2.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.VariantManagement.example2.Component", {

	metadata : {
		rootView : "sap.ui.comp.sample.VariantManagement.example2.VariantManagement",
		dependencies : {
			libs : [
				"sap.m",
				"sap.ui.comp"
			]
		},
		config : {
			sample : {
				stretch : true,
				files : [
					"VariantManagement.view.xml",
					"VariantManagement.controller.js"
				]
			}
		}
	}
});