sap.ui.define([
	'sap/ui/core/UIComponent'
], function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.tutorial.smartControls.08.Component", {

		metadata: {
			config: {
				sample: {
					iframe: "webapp/index.html",
					stretch: true,
					files: [
						"webapp/test/service/component-test-changes.json", 
						"webapp/test/service/metadata.xml",
						"webapp/test/service/Products.json", 
						"webapp/test/service/server.js", 
						"webapp/Component.js", 
						"webapp/index.html", 
						"webapp/manifest.json", 
						"webapp/img/HT-1052.jpg",
						"webapp/SmartChart.controller.js",
						"webapp/SmartChart.view.xml"
					]
				}
			}
		}
	});

	return Component;

});
