jQuery.sap.declare("sap.ui.comp.sample.smartlink.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smartlink.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smartlink.SmartLink",
		dependencies: {
			libs: [ "sap.m", "sap.ui.comp" ]
		},
		config: {
			sample: {
				stretch: true,
				files: [ "SmartLink.view.xml", "SmartLink.controller.js" ]
			}
		}
	}
});