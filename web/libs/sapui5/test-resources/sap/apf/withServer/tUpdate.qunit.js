/*
 * Optional URL parameter ?systemType=abap executes this on a gateway system with CDS views. Prefix /sap/ in proxy setting should be mapped to ER3 in this case.
 */

jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');

jQuery.sap.registerModulePath('sap.apf.internal.server', '../internal/server');
jQuery.sap.require('sap.apf.internal.server.userData');

jQuery.sap.registerModulePath('sap.apf.tests.withServer', '../withServer');
jQuery.sap.require('sap.apf.tests.withServer.helper');

jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require('sap.apf.core.odataRequest');

module('Update Path', {
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

asyncTest("Update path", function() {
	function readUpdatedPath(sAnalysisPath) {
		var oRequest = {
			method : "GET"
		};
		var fnSuccess = function(oData, oResponse) {
			if (oData && oData.AnalysisPath && oData.AnalysisPath === sAnalysisPath && oData.AnalysisPathName === "Updated Path" && oResponse.statusCode === 200) {
				ok(true, "Updated path exists.");
			} else {
				ok(false, "Request failed.");
			}
			start();
		};
		var fnError = function(oError) {
			ok(false, "Updated path exists.");
			start();
		};
		this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalysisPath);
	}

	function fnUpdatePath(sAnalysisPath) {
		var oPostObjectUpdated = this.helper.createPostObject();
		oPostObjectUpdated.AnalysisPathName = "Updated Path";
		oPostObjectUpdated.AnalysisPath = sAnalysisPath;

		var oRequest = {
			method : "PUT",
			data : oPostObjectUpdated
		};
		var fnSuccess = function(oData, oResponse) {
			if (!oData && oResponse.statusCode === 204) {
				ok(true, "Path updated.");
				readUpdatedPath.bind(this)(sAnalysisPath);
			} else {
				ok(false, "Request failed.");
			}
		}.bind(this);
		var fnError = function(oError) {
			ok(false, "Request failed.");
			start();
		}.bind(this);

		this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalysisPath);
	}

	// create path
	var oRequest = {
		method : "POST",
		data : this.oPostObject
	};
	var fnSuccess = function(oData, oResponse) {
		if (oData && oData.AnalysisPath && oResponse.statusText === "Created") {
			ok(true, "Path created.");
			fnUpdatePath.bind(this)(oData.AnalysisPath);
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

asyncTest("Update path with invalid ID", function() {
	var oPostObject = this.helper.createPostObject();
	var sAnalysisPath = "INVALID";
	oPostObject.AnalysisPathName = "Path with invalid ID";
	oPostObject.AnalysisPath = sAnalysisPath;

	var oRequest = {
		method : "PUT",
		data : oPostObject
	};
	var fnSuccess = function(oData, oResponse) {
		ok(false, "'Success callback.");
		start();
	}.bind(this);
	var fnError = function(oError) {
		ok(true, "Request failed.");
		start();
	}.bind(this);

	this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalysisPath);
});