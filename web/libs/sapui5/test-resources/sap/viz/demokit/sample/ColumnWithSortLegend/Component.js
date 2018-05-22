jQuery.sap.declare("sap.viz.sample.ColumnWithSortLegend.Component");

sap.ui.core.UIComponent.extend("sap.viz.sample.ColumnWithSortLegend.Component", {

	metadata : {
		rootView : "sap.viz.sample.ColumnWithSortLegend.Column",
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