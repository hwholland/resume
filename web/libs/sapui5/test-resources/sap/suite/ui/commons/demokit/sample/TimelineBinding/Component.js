jQuery.sap.declare("sap.suite.ui.commons.sample.TimelineBinding.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.TimelineBinding.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.TimelineBinding.Timeline",
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