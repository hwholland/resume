jQuery.sap.declare("sap.ui.comp.sample.smartfilterbar.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smartfilterbar.Component", {

	metadata: {
		rootView: {
			viewName:"sap.ui.comp.sample.smartfilterbar.SmartFilterBar",
			type: "JS"
		},
		dependencies: {
			libs: [ "sap.m", "sap.ui.comp","sap.ui.fl" ]
		},
		config: {
			sample: {
				stretch: true,
				files: [ "SmartFilterBar.view.js", "SmartFilterBar.controller.js" ]
			}
		}
	}
});