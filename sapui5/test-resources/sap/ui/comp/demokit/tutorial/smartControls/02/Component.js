sap.ui.define([
	'sap/ui/core/UIComponent'
],
function (UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.tutorial.smartControls.02.Component", {

		metadata: {
			config: {
				sample: {
					iframe: "webapp/index.html",
					stretch: true,
					files: [
						"webapp/test/service/metadata.xml",
						"webapp/test/service/Products.json",
						"webapp/test/service/server.js",
						"webapp/Component.js",
						"webapp/index.html",
						"webapp/manifest.json",
						"webapp/SmartFieldWithValueHelp.controller.js",
						"webapp/SmartFieldWithValueHelp.view.xml"
					]
				}
			}
		}
	});

	return Component;

});