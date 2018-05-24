﻿sap.ui.define(['sap/ui/test/Opa5'],
	function(Opa5) {
	"use strict";

	// All the arrangements for all Opa tests are defined here
	var Common = Opa5.extend("sap.suite.ui.generic.template.integrations.ManageSalesOrder.pages.Common", {

		iStartMyApp : function () {
			// start without debug parameter, loads much faster
			// this.iStartMyAppInAFrame("../../../template/demokit/demokit.html?sap-ui-debug=true&responderOn=true&demoApp=salesorder&sap-ui-language=en_US");
			return this.iStartMyAppInAFrame("../../../template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=salesorder&sap-ui-language=en_US");
		}
		
	});

	return Common;

});