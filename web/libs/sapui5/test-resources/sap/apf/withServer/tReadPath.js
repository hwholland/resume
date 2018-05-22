jQuery.sap.declare('sap.apf.withServer.tReadPath');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.withServer.helper');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require('sap.apf.core.odataRequest');

(function() {
	'use strict';

	QUnit.module('Read Paths', {
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
			this.oAuthTestHelper = this.helper.createAuthTestHelper(done, function() {
				done();
			});
		}
	});
	QUnit.test("Read structured saved paths", function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oRequest = {
			method : "GET"
		};
		var fnSuccess = function(oData, oResponse) {
			if (oData && oData.results && oData.results.length > 0 && oResponse.statusCode === 200) {
				assert.ok(true, "Request responsed with more then 0 paths.");
			} else {
				assert.ok(false, "Request responsed with more then 0 paths.");
			}
			done();
		};
		var fnError = function(oError) {
			assert.ok(false, "Request failed.");
			done();
		};
		this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError);
	});
	QUnit.test("Structured saved paths in descending modification order", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var bOk = false;
		function assertDescendingOrder(oData) {
			var previousTimestamp;
			for(var i = 0; i < oData.results.length; i++) {
				if (previousTimestamp && oData.results[i].LastChangeUTCDateTime <= previousTimestamp) {
					bOk = true;
				}
				previousTimestamp = oData.results[i].LastChangeUTCDateTime;
			}
			assert.ok(bOk, 'Following change timesstamp must be smaller.');
		}
		var oRequest = {
			method : "GET"
		};
		var fnSuccess = function(oData, oResponse) {
			if (oData && oData.results && oData.results.length > 0 && oResponse.statusCode === 200) {
				assert.ok(true, "Request responsed with more then 0 paths.");
				assertDescendingOrder(oData);
			} else {
				assert.ok(false, "Request responsed with more then 0 paths.");
			}
			done();
		};
		var fnError = function(oError) {
			assert.ok(false, "Request failed.");
			done();
		};
		this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError);
	});
	QUnit.test("Read serialized saved path with invalid ID", function(assert) {
		var done = assert.async();
		var sAnalyticalPath = "INVALID";
		var config = this.config;
		var oRequest = {
			method : "GET"
		};
		var fnSuccess = function(oData, oResponse) {
			assert.ok(false, "Success callback");
			done();
		};
		var fnError = function(oError) {
			var oErrorResponseBody = JSON.parse(oError.response.body); // TODO oErrorResponseBody.error.code should be provided, expected 5208 
			if (oError.response.statusText === "Not Found" && oError.response.statusCode === 404 && oErrorResponseBody.error.message.value === "Resource not found.") {
				assert.ok(true, "Request responded resource not found.");
				done();
			} else if (oError.response.statusCode === 404 && config.systemType === "abap") {
				assert.ok(true, "Request responded resource not found.");
				done();
			} else {
				assert.ok(false, "Request responded resource not found.");
				done();
			}
		};
		this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalyticalPath);
	});

}());

/* TODO test probably obsolete, tb checked
QUnit.test("Read serialized saved path", function() {
	var sAnalysisPath = "52AA50A7925922BAE10000000A445B6D";
	var sURL = "./sap/hba/apps/reuse/apf/s/logic/path.xsjs" + "?" + "AnalysisPath='" + sAnalysisPath + "'";
	var oRequest = {
		type : 'GET',
		beforeSend : function(xhr) {
			xhr.setRequestHeader("x-csrf-token", this.oAuthTestHelper.getXsrfToken());
		}.bind(this),
		url : sURL,
		async : false,
		error : function(oJqXHR, sStatus, sErrorThrown) {
assert.ok(false, "Request failed.");
			start();
		}.bind(this),
		success : function(oData, sStatus, oXMLHttpRequest) {
assert.ok(oData.path.AnalysisPath.length > 0, "Request responsed with exactly one path.");
			start();
		}.bind(this)
	};
	sap.apf.core.ajax(oRequest);
});
 */
//Use to clean path persistence table once if persistence logic test fail
//QUnit.test("Delete all except ten", function() {
//	    expect(0);
//		var sLogicalSystem = "4711";
//		var sApplicationConfigurationURL = "/AnalysisPathFramework_SP03/tests/helper/config/applicationConfiguration.json";
//		var sURL = "./sap/hba/apps/reuse/apf/s/logic/path.xsjs" + "?" + "LogicalSystem='" + sLogicalSystem + "'&ApplicationConfigurationURL='" + sApplicationConfigurationURL + "'";
//		var oRequest = {
//				type : 'GET',
//				beforeSend : function(xhr) {
//					xhr.setRequestHeader("x-csrf-token", this.oAuthTestHelper.getXsrfToken());
//				}.bind(this),
//				url : sURL,
//				async : false,
//				error : function(oJqXHR, sStatus, sErrorThrown) {
//					ok(false, "Request failed.");
//				}.bind(this),
//				success : function(oData, sStatus, oXMLHttpRequest) {
//					this.allPaths = oData;
//				}.bind(this)
//		};
//		sap.apf.core.ajax(oRequest);
//		for(var i=0; i < this.allPaths.paths.length; i++){
//			if(i<10) continue;
//			deletePath.bind(this)(this.allPaths.paths[i].AnalysisPath);
//		}
//		
//		function deletePath(sAnalyticalPath) {
//			var sURL = "./sap/hba/apps/reuse/apf/s/logic/path.xsjs" + "?" + "AnalysisPath='" + sAnalyticalPath + "'";
//			var oRequest = {
//				type : 'DELETE',
//				beforeSend : function(xhr) {
//					xhr.setRequestHeader("x-csrf-token", this.oAuthTestHelper.getXsrfToken());
//				}.bind(this),
//				url : sURL,
//				async : false,
//				error : function(oJqXHR, sStatus, sErrorThrown) {
//					ok(false);
//					start();
//				}.bind(this),
//				success : function(oData, sStatus, oXMLHttpRequest) {
//					equal(oData.status, "successful");
//				}.bind(this)
//			};
//			sap.apf.core.ajax(oRequest);
//		}		
//});