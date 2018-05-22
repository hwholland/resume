sap.ui.define(["sap/ui/model/json/JSONModel"],
	function (JSONModel) {
		"use strict";
		
		var oManifestModel = new JSONModel("../../demokit/sample.stta.manage.products/webapp/manifest.json");
		
		return {
			"template": {},
			"demokit": {
				"sample.stta.manage.products": oManifestModel
			}
		}
	}
);