jQuery.sap.declare("sap.ui.comp.sample.smartlink.example_05.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smartlink.example_05.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smartlink.example_05.Example",
		dependencies: {
			libs: [
				"sap.m", "sap.ui.comp"
			]
		},
		config: {
			sample: {
				files: [
					"Example.view.xml", "Example.controller.js", "mockserver/metadata.xml"
				]
			}
		}
	}
});
