jQuery.sap.declare("sap.ui.comp.sample.smarttable.mtable.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smarttable.mtable.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smarttable.mtable.SmartTable",
		dependencies: {
			libs: [
				"sap.m", "sap.ui.comp"
			]
		},
		config: {
			sample: {
				files: [
					"SmartTable.view.xml", "SmartTable.controller.js", "../mockserver/metadata.xml"
				]
			}
		}
	}
});
