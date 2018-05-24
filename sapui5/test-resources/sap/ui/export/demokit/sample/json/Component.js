jQuery.sap.declare("sap.ui.export.sample.table.Component");

sap.ui.core.UIComponent.extend("sap.ui.export.sample.json.Component", {

	metadata: {
		rootView: {
		 "viewName": "sap.ui.export.sample.json.Spreadsheet",
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
					"Spreadsheet.controller.js"
				]
			}
		}
	}
});
