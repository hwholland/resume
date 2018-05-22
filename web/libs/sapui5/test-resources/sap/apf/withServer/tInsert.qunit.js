/*
 * Optional URL parameter ?systemType=abap executes this on a gateway system with CDS views. Prefix /sap/ in proxy setting should be mapped to ER3 in this case.
 */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');


jQuery.sap.registerModulePath('sap.apf.internal.server', '../internal/server');
jQuery.sap.require('sap.apf.internal.server.userData');

jQuery.sap.registerModulePath('sap.apf.tests.withServer', '../withServer');
jQuery.sap.require('sap.apf.tests.withServer.helper')

jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require('sap.apf.core.odataRequest');


module('Insert/Create Path(s)', {
	setup : function() {
		QUnit.stop(); 		
		if(jQuery.sap.getUriParameters().get("systemType") === "abap") {
			 
			this.config = {
					serviceRoot : "/sap/opu/odata/sap/Z_ANALYSIS_PATH_SRV/",
					entitySet : "AnalysisPathQSet",
					systemType : "abap"
			}
		 } else {
			 this.config = {
						serviceRoot : "/sap/hba/r/apf/core/odata/apf.xsodata/",
						entitySet : 'AnalysisPathQueryResults',
						systemType : "xs"
				}
		 }
		this.helper = new sap.apf.tests.withServer.Helper(this.config);
		
		this.oPostObject = this.helper.createPostObject();
		this.oAuthTestHelper = this.helper.createAuthTestHelper(function() {
			QUnit.start();
		}.bind(this))
	}
});

asyncTest("Insert path", function() {
	expect(1);
	var oMessageHandler = new sap.apf.core.MessageHandler();
	 
	var sXsrfToken = this.oAuthTestHelper.getXsrfToken();
	var sUrl = this.config.serviceRoot + this.config.entitySet;
	var oRequest = {
		requestUri : sUrl,
		method : "POST",
		headers : {
			"x-csrf-token" : sXsrfToken
		},
		data : this.oPostObject
	};
	var fnSuccess = function(oData, oResponse) {
		if (oData && oData.AnalysisPath && oResponse.statusText === "Created") {
			ok(true, "Request succeeded.");
		} else {
			ok(false, "Request failed.");
		}
		start();
	};
	var fnError = function(oError) {
		ok(false, "Request failed.");
		start();
	};
	
	sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccess, fnError);
});
/* TODO port the test, when the decision about this check is taken
asyncTest("Insert path with more than 32 steps", function() {
	expect(1);
	var oMessageHandler = new sap.apf.core.MessageHandler();
	var sServiceRoot = "/sap/hba/r/apf/core/odata/apf.xsodata/";
	var sEntityType = 'AnalysisPathQueryResults';
	var sXsrfToken = this.oAuthTestHelper.getXsrfToken();
	var sUrl = sServiceRoot + sEntityType;
	var aSteps = [];
	for(var i = 0; i < 33; i++) {
		aSteps.push({
			"stepId" : "dummy"
		});
	}
	this.oPostObject.StructuredAnalysisPath = JSON.stringify({
		steps : aSteps
	});
	var oRequest = {
		requestUri : sUrl,
		method : "POST",
		headers : {
			"x-csrf-token" : sXsrfToken
		},
		data : this.oPostObject
	};
	var fnSuccess = function(oData, oResponse) {
		if (oData && oData.AnalysisPath && oResponse.statusText === "Created") {
			ok(false, "Request with more than 32 steps succeeded.");
		} else {
			ok(true, "Request with more than 32 steps failed.");
		}
		start();
	};
	var fnError = function(oError) {
		ok(true, "Request with more than 32 steps failed.");
		start();
	};

	sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccess, fnError);
});
*/