jQuery.sap.declare("sap.me.sample.DurationCalendar.Component");

sap.ui.core.UIComponent.extend("sap.me.sample.DurationCalendar.Component", {

	metadata : {
		rootView : "sap.me.sample.DurationCalendar.DurationCalendar",
		dependencies : {
			libs : [
				"sap.me",
                "sap.ui.layout"
            ]
		},
		config : {
			sample : {
				files : [
					"DurationCalendar.view.xml",
					"DurationCalendar.controller.js"
				]
			}
		}
	}
});
