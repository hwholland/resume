jQuery.sap.declare("sap.ui.comp.sample.filterbar.example2.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.filterbar.example2.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.filterbar.example2.FilterBar",
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