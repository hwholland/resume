jQuery.sap.declare("sap.ui.comp.sample.smartchart.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smartchart.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smartchart.SmartChart",
		dependencies: {
			libs: [
				"sap.m", "sap.ui.comp"
			]
		},
		config: {
			sample: {
				stretch: true,
				files: [
					"SmartChart.view.xml", "SmartChart.controller.js", "mockserver/metadata.xml"
				]
			}
		}
	}
});
