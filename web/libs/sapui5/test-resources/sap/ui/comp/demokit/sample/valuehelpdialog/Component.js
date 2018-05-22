jQuery.sap.declare("sap.ui.comp.sample.valuehelpdialog.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.Component", {

	metadata : {
		rootView : "sap.ui.comp.sample.valuehelpdialog.ValueHelpDialog",
		dependencies : {
			libs : [
				"sap.m",
				"sap.ui.comp"
			]
		},
		config : {
			sample : {
				stretch : true,
				files : [
					"ValueHelpDialog.view.xml",
					"ValueHelpDialog.controller.js"
				]
			}
		}
	}
});