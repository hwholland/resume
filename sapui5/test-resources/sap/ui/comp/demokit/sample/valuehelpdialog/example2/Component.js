jQuery.sap.declare("sap.ui.comp.sample.valuehelpdialog.example2.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.example2.Component", {

	metadata : {
		rootView : "sap.ui.comp.sample.valuehelpdialog.example2.ValueHelpDialog",
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