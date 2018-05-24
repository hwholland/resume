jQuery.sap.declare("sap.suite.ui.commons.sample.Timeline.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.Timeline.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.Timeline.Timeline",
		dependencies : {
			libs : [
			        "sap.m",
			        "sap.suite.ui.commons"   
			        ]
		},
		config : {
			sample : { 
				files : [
				         "Timeline.view.xml", 
				         "Timeline.controller.js"
				         ] 
			}
		}
	}
});