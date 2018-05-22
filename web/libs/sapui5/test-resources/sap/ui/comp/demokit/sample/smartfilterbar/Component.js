jQuery.sap.declare("sap.ui.comp.sample.smartfilterbar.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smartfilterbar.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smartfilterbar.SmartFilterBar",
		dependencies: {
			libs: [ "sap.m", "sap.ui.comp" ]
		},
		config: {
			sample: {
				stretch: true,
				files: [ "SmartFilterBar.view.xml", "SmartFilterBar.controller.js" ]
			}
		}
	}
});