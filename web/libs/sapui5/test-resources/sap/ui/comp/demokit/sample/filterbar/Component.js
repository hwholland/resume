jQuery.sap.declare("sap.ui.comp.sample.filterbar.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.filterbar.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.filterbar.FilterBar",
		dependencies: {
			libs: [ "sap.m", "sap.ui.comp" ]
		},
		config: {
			sample: {
				stretch: true,
				files: [ "FilterBar.view.xml", "FilterBar.controller.js" ]
			}
		}
	}
});