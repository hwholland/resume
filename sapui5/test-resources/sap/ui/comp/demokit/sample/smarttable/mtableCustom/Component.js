jQuery.sap.declare("sap.ui.comp.sample.smarttable.mtableCustom.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smarttable.mtableCustom.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smarttable.mtableCustom.SmartTable",
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
