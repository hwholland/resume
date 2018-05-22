/*
 * Optional URL parameter ?systemType=abap executes this on a gateway system. Prefix /sap/ in proxy setting should be mapped to ER3 in this case.
 */

jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.helper');


jQuery.sap.registerModulePath('sap.apf.internal.server', '../internal/server');
jQuery.sap.require('sap.apf.internal.server.userData');

jQuery.sap.registerModulePath('sap.apf.tests.withServer', '../withServer');
jQuery.sap.require('sap.apf.tests.withServer.helper');

jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require('sap.apf.core.odataRequest');

module('Delete Path', {
	setup : function() {
		QUnit.stop();
		if (jQuery.sap.getUriParameters().get("systemType") === "abap") {

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
			};
		}

		this.helper = new sap.apf.tests.withServer.Helper(this.config);
		this.oPostObject = this.helper.createPostObject();
		this.oAuthTestHelper = this.helper.createAuthTestHelper(function() {
			QUnit.start();
		}.bind(this));
	},
	teardown : function() {

	}
});

asyncTest("Delete path", function() {
	expect(3);
	function fnReadDeletedPath(sAnalyticalPath) {
		var oRequest = {
			method : "GET",
		};
		var fnSuccess = function(oData, oResponse) {
			ok(false, "Deleted path still exists.");
			start();
		};
		var fnError = function(oError) {
			var oErrorResponseBody = JSON.parse(oError.response.body); // TODO oErrorResponseBody.error.code should be provided, expected 5208 
			if (oError.response.statusText === "Not Found" && oError.response.statusCode === 404 && oErrorResponseBody.error.message.value === "Resource not found.") {
				ok(true, "Request responded resource not found.");
				start();
			} else {
				ok(false, "Request responded resource not found.");
			}
		};
		this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalyticalPath);
	}

	function fnDeleteNewPath(sAnalyticalPath) {
		var oRequest = {
			method : "DELETE",
		};
		var fnSuccess = function(oData, oResponse) {
			if (!oData && oResponse.statusText === "No Content") {
				ok(true, "Path deleted.");
				fnReadDeletedPath.bind(this)(sAnalyticalPath);
			} else {
				ok(false, "Deletion failed.");
			}
		}.bind(this);
		var fnError = function(oError) {
			ok(false, "Request failed.");
			start();
		}.bind(this);

		this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalyticalPath);
	}

	// create path
	var oRequest = {
		method : "POST",
		data : this.oPostObject
	};
	var fnSuccess = function(oData, oResponse) {
		if (oData && oData.AnalysisPath && oResponse.statusText === "Created") {
			ok(true, "Path created.");
			fnDeleteNewPath.bind(this)(oData.AnalysisPath);
		} else {
			ok(false, "Request failed.");
		}
	}.bind(this);
	var fnError = function(oError) {
		ok(false, "Request failed.");
		start();
	}.bind(this);

	this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError);
});

asyncTest("Delete path with invalid ID", function() {
	var sAnalyticalPath = "INVALID";
	var oRequest = {
		method : "DELETE",
	};
	var fnSuccess = function(oData, oResponse) {
		ok(false, "Success callback");
		start();
	};
	var fnError = function(oError) {
		var oErrorResponseBody = JSON.parse(oError.response.body); // TODO oErrorResponseBody.error.code should be provided, expected 5208 
		if (oError.response.statusText === "Not Found" && oError.response.statusCode === 404 && oErrorResponseBody.error.message.value === "Resource not found.") {
			ok(true, "Request responded resource not found.");
			start();
		} else {
			ok(false, "Request responded resource not found.");
		}
	};

	this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalyticalPath);
});
