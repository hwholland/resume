jQuery.sap.declare("sap.ui.comp.sample.smarttable.smarttablesmartmicrochart.Component");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smarttable.smarttablesmartmicrochart.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smarttable.smarttablesmartmicrochart.App",
		dependencies: {
			libs: [ "sap.m", "sap.suite.ui.microchart", "sap.ui.comp" ]
		},
		config: {
			sample: {
				stretch: true,
				files: ["App.view.xml", "App.controller.js", "mockserver/metadata.xml", "mockserver/Products.json"]
			}
		}
	}
});