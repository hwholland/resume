jQuery.sap.declare("sap.ui.comp.sample.personalization.example1.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.personalization.example1.Component", {
	metadata: {
		rootView: "sap.ui.comp.sample.personalization.example1.Example",
		dependencies: {
			libs: [
				"sap.m", "sap.ui.comp"
			]
		},
		config: {
			sample: {
				files: [
					"Example.view.xml", "Example.controller.js", "../mockserver/metadata.xml"
				]
			}
		}
	}
});
