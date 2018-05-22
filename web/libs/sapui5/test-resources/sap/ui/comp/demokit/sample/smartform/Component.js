jQuery.sap.declare("sap.ui.comp.sample.smartform.Component");
jQuery.sap.require("sap.ui.fl.Cache");

sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smartform.Component", {

	metadata: {
		rootView: "sap.ui.comp.sample.smartform.SmartForm",
		dependencies: {
			libs: [
				"sap.m", "sap.ui.comp"
			]
		},
		config: {
			sample: {
				stretch: false,
				files: [
					"SmartForm.view.xml", "SmartForm.controller.js", "/mockserver/metadata.xml", "/mockserver/Products.json"
				]
			}
		}
	}
});

// flex framework does resolve any LRep requests for this specific component with the given content -> there are changes = empty and no additional
// back-end call is needed
sap.ui.fl.Cache._entries["sap.ui.comp.sample.smartform.Component"] = {
	promise: Promise.resolve({
		"changes": {
			"changes": [],
			"settings": {
				"isKeyUser": true,
				"isAtoAvailable": false,
				"isProductiveSystem": false,
				"features": {
					"addField": [
						"CUSTOMER", "VENDOR"
					],
					"addGroup": [
						"CUSTOMER", "VENDOR"
					],
					"removeField": [
						"CUSTOMER", "VENDOR"
					],
					"removeGroup": [
						"CUSTOMER", "VENDOR"
					],
					"hideControl": [
						"CUSTOMER", "VENDOR"
					],
					"unhideControl": [
						"CUSTOMER", "VENDOR"
					],
					"renameField": [
						"CUSTOMER", "VENDOR"
					],
					"renameGroup": [
						"CUSTOMER", "VENDOR"
					],
					"moveFields": [
						"CUSTOMER", "VENDOR"
					],
					"moveGroups": [
						"CUSTOMER", "VENDOR"
					]
				}
			}
		},
		"componentClassName": "sap.ui.comp.sample.smartform.Component"
	})
};
