jQuery.sap.declare("sap.suite.ui.commons.sample.LinkActionSheet.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.LinkActionSheet.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.LinkActionSheet.LinkActionSheet",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"LinkActionSheet.view.xml",
					"LinkActionSheet.controller.js",
					"LinkActionSheetLnkBtn.fragment.xml",
					"LinkActionSheetLnkMBtn.fragment.xml",
					"LinkActionSheetOnlyBtn.fragment.xml",
					"LinkActionSheetOnlyLnk.fragment.xml"
				]
			}
		}
	}
});