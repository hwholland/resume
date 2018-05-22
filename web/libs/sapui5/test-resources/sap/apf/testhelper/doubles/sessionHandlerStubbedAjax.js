jQuery.sap.declare('sap.apf.testhelper.doubles.sessionHandlerStubbedAjax');
jQuery.sap.require("sap.ui.thirdparty.sinon");

(function () {
	'use strict';

	sap.apf.testhelper.doubles.SessionHandlerStubbedAjax = function(oInject){
		sap.apf.core.SessionHandler.call(this, oInject); // inherit
		this.ajax = function(oSettings) {
			var oXMLHttpRequest = {
					getResponseHeader : function(sParam) {
						if (sParam === "x-sap-login-page") {
							return null;
						}
						return "dummyXsrfTokenFromSessionHandlerNew" + Math.random();
					}
			};
			oSettings.success({}, {}, oXMLHttpRequest);
		};
	};
}());
