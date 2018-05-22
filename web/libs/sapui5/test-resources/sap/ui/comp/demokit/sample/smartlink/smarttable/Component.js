jQuery.sap.declare("sap.ui.comp.sample.smartlink.smarttable.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smartlink.smarttable.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smartlink.smarttable.SmartLinkInTable",
		dependencies: {
			libs: [ "sap.m", "sap.ui.comp" ]
		},
		config: {
			sample: {
				stretch: true,
				files: [ "SmartLinkInTable.view.xml", "SmartLinkInTable.controller.js", "\mockserver\\metadata.xml" ]
			}
		}
	}
});