jQuery.sap.declare("sap.ui.comp.sample.personalization.example11.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.personalization.example11.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.personalization.example11.Example",
		dependencies: {
			libs: [
				"sap.m", "sap.ui.comp"
			]
		},
		config: {
			sample: {
				stretch: true,
				files: [
					"Example.view.xml", "Example.controller.js", "mockserver/metadata.xml"
				]
			}
		}
	}
});
