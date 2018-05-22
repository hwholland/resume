jQuery.sap.declare("sap.ui.comp.sample.personalization.example3.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.personalization.example3.Component", {
	metadata: {
		rootView: "sap.ui.comp.sample.personalization.example3.Example",
		dependencies: {
			libs: [
				"sap.ui.comp", "sap.ui.layout", "sap.m"
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
