jQuery.sap.declare("sap.viz.sample.ColumnWithRange.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.ColumnWithRange.Component", {

	metadata : {
		rootView : "sap.viz.sample.ColumnWithRange.Column",
		dependencies : {
			libs : [
				"sap.viz",
				"sap.m"
			]
		},
		config : {
			sample : {
				stretch : true,
				files : [
					"Column.view.xml",
					"Column.controller.js"
				]
			}
		}
	}
});