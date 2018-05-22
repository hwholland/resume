jQuery.sap.declare("sap.ui.comp.sample.personalization.exampleForTreeTableWithOData2.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.personalization.exampleForTreeTableWithOData2.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.personalization.exampleForTreeTableWithOData2.TreeTable",
		dependencies: {
			libs: [ "sap.m", "sap.ui.comp" ]
		},
		config: {
			sample: {
				stretch: true,
				files: [ "TreeTable.view.xml", "TreeTable.controller.js", "\mockserver\\metadata.xml" ]
			}
		}
	}
});