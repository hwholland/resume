jQuery.sap.declare("sap.suite.ui.commons.sample.KpiTile.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.KpiTile.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.KpiTile.Kpis",
		dependencies : {
			libs : [
				"sap.m",
				"sap.ui.layout",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"Kpis.view.xml"
				]
			}
		}
	}
});