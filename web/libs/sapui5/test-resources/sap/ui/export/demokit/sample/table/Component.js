jQuery.sap.declare("sap.ui.export.sample.table.Component");

sap.ui.core.UIComponent.extend("sap.ui.export.sample.table.Component", {

	metadata: {
		rootView: {
		 "viewName": "sap.ui.export.sample.table.Spreadsheet",
		   "type": "XML",
		  "async": true
		},
		dependencies: {
			libs: [
				"sap.m"
			]
		},
		config: {
			sample: {
				stretch: true,
				files: [
					"Spreadsheet.view.xml",
					"Spreadsheet.controller.js",
					"localService/metadata.xml"
				]
			}
		}
	}
});