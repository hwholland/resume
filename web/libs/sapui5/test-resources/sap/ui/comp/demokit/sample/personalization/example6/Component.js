jQuery.sap.declare("sap.ui.comp.sample.personalization.example6.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.personalization.example6.Component", {
	metadata: {
		rootView: "sap.ui.comp.sample.personalization.example6.Example",
		dependencies: {
			libs: [
				"sap.ui.comp", "sap.ui.layout", "sap.ui.table"
			]
		},
		config: {
			sample: {
				files: [
					"Example.view.xml", "Example.controller.js"
				]
			}
		}
	}
});