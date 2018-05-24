/*
 * Optional URL parameter ?systemType=abap executes this on a gateway system with CDS views. Prefix /sap/ in proxy setting should be mapped to ER3 in this case.
 */
jQuery.sap.declare('sap.apf.withServer.tInsertPath');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.withServer.helper');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require('sap.apf.core.odataRequest');

(function() {
	'use strict';

	QUnit.module('Insert/Create Path(s)', {
		beforeEach : function(assert) {
			var done = assert.async();
			if (jQuery.sap.getUriParameters().get("systemType") === "abap") {
				this.config = {
					serviceRoot : "/sap/opu/odata/sap/BSANLY_APF_RUNTIME_SRV/",
					entitySet : "AnalysisPathQueryResults",
					systemType : "abap"
				};
			} else {
				this.config = {
					serviceRoot : "/sap/hba/r/apf/core/odata/apf.xsodata/",
					entitySet : 'AnalysisPathQueryResults',
					systemType : "xs"
				};
			}
			this.helper = new sap.apf.withServer.Helper(this.config);
			this.oPostObject = this.helper.createPostObject();
			this.oAuthTestHelper = this.helper.createAuthTestHelper(done, function() {
				done();
			});
		}
	});
	QUnit.test("Insert path", function(assert) {
		assert.expect(1);
		var done = assert.async();
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
				assert.ok(true, "Request succeeded.");
			} else {
				assert.ok(false, "Request failed.");
			}
			done();
		};
		var fnError = function(oError) {
			assert.ok(false, "Request failed.");
			done();
		};
		var oInject = {
			instances: {
				datajs: OData
			}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError);
	});

})();

/* TODO port the test, when the decision about this check is taken
QUnit.test("Insert path with more than 32 steps", function() {
assert.expect(1);
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
assert.ok(false, "Request with more than 32 steps succeeded.");
		} else {
assert.ok(true, "Request with more than 32 steps failed.");
		}
		start();
	};
	var fnError = function(oError) {
assert.ok(true, "Request with more than 32 steps failed.");
		start();
	};

	sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccess, fnError);
});
*/