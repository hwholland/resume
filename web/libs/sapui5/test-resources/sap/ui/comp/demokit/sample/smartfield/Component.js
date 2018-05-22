jQuery.sap.declare("sap.ui.comp.sample.smartfield.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smartfield.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smartfield.SmartField",
		dependencies: {
			libs: [ "sap.m", "sap.ui.comp" ]
		},
		config: {
			sample: {
				stretch: true,
				files: [ "SmartField.view.xml", "SmartField.controller.js", "/mockserver/metadata.xml", "/mockserver/Products.json" ]
			}
		}
	}
});