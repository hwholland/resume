jQuery.sap.declare("sap.ui.comp.sample.valuehelpdialog.example1.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.example1.Component", {

	metadata : {
		rootView : "sap.ui.comp.sample.valuehelpdialog.example1.ValueHelpDialog",
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