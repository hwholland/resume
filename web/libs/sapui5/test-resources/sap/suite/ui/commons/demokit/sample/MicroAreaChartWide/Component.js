jQuery.sap.declare("sap.suite.ui.commons.sample.MicroAreaChartWide.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.MicroAreaChartWide.Component", {

	metadata : {
		rootView : "sap.suite.ui.commons.sample.MicroAreaChartWide.MicroAreaChartWide",
		dependencies : {
			libs : [
				"sap.m",
				"sap.suite.ui.commons"
			]
		},
		config : {
			sample : {
				files : [
					"MicroAreaChartWide.view.xml",
					"..\MicroAreaChart\MicroAreaChart.controller.js"
				]
			}
		}
	}
});