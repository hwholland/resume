sap.ui.define(['sap/ui/test/Opa5',
               "sap/suite/ui/generic/template/integrations/ManageProducts_new/utils/OpaDataStore",
               "sap/ui/test/actions/Press"],
	function(Opa5, OpaDataStore, Press) {
		"use strict";
		
		return Opa5.extend("sap.suite.ui.generic.template.opa.ManageProducts.pages.Common", {
			iStartTheListReport: function(oOptions) {
				return this.iStartMyAppInAFrame("../../../template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttaproducts&sap-ui-language=en_US");
			},
			
			iStartTheObjectPage: function(oOptions) {
				return this.iStartMyAppInAFrame("../../../template/demokit/demokit.html?serverDelay=0&responderOn=true&sap-ui-language=en_US&demoApp=sttaproducts#/STTA_C_MP_Product(ProductDraftUUID=guid'00000000-0000-0000-0000-000000000000',ActiveProduct='HT-1032')");
			},
			
			iTeardownMyApp: function() {
				OpaDataStore.clearData();
				return this.iTeardownMyAppFrame();
			},
			
			iLookAtTheScreen: function() {
				return this;
			},
			
			iClickTheButtonWithId: function(sId, sButtonText) {
				return this.waitFor({
					id: sId,
					actions: new Press(),
					errorMessage: "The " + sButtonText + " button could not be found"
				});
			}
		});
	}
);