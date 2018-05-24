jQuery.sap.declare('sap.apf.testhelper.doubles.sessionHandlerNew');

sap.apf.testhelper.doubles.SessionHandlerNew = function(oInject){
    'use strict';
    // Attention: works onyl if the test sets sap.apf.testhelper.doubles.OriginalSessionHandler beforehand.
    // Don't use for new tests, use sap.apf.testhelper.doubles.sessionHandlerStubbedAjax instead
	sap.apf.testhelper.doubles.OriginalSessionHandler.call(this, oInject);
	
	sinon.stub(this, "ajax", function(oSettings) {
		var oXMLHttpRequest = {
			getResponseHeader : function(sParam) {
				if (sParam === "x-sap-login-page") {
					return null;
				}
				return "dummyXsrfTokenFromSessionHandlerNew" + Math.random();
			}
		};
		oSettings.success({}, {}, oXMLHttpRequest);
	});
};