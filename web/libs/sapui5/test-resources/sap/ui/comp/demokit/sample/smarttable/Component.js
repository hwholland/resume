jQuery.sap.declare("sap.ui.comp.sample.smarttable.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smarttable.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smarttable.SmartTable",
		dependencies: {
			libs: [
				"sap.m", "sap.ui.comp"
			]
		},
		config: {
			sample: {
				stretch: true,
				files: [
					"SmartTable.view.xml", "SmartTable.controller.js", "mockserver/metadata.xml"
				]
			}
		}
	}
});
