window["sap-ui-demokit-config"] = {

	productName : "OpenUI5",

	supportedThemes : ["sap_bluecrystal", "sap_goldreflection", "sap_hcb"],

	onCreateContent : function (oDemokit) {

		// add the 'license' page to the main index
		oDemokit.addIndex("license", {
			caption : "License",
			index : {
				ref: "LICENSE.txt",
				links : [
					{text: "License", ref:"LICENSE.txt"}
				]
			}
		});

	}

};
