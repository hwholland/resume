/*global OData*/

jQuery.sap.declare("sap.apf.tests.integration.withServer.tRequest");

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.internal.server', '../../internal/server');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require("sap.apf.core.instance");
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");

if (!sap.apf.tests.integration.withServer.tRequest) {

	sap.apf.tests.integration.withServer.tRequest = {};
	
	sap.apf.tests.integration.withServer.tRequest.commonSetup = function(oContext) {
		function defineFilterOperators() {
			jQuery.extend(oContext, sap.apf.core.constants.FilterOperators);
		}
		defineFilterOperators();	
		oContext.oMessageHandler = new sap.apf.core.MessageHandler();
		oContext.oCoreApi = new sap.apf.core.Instance({
            messageHandler : oContext.oMessageHandler
        });
		oContext.oCoreApi.activateOnErrorHandling(true);
		
		oContext.oInject = { messageHandler : oContext.oMessageHandler, coreApi : oContext.oCoreApi };
	};
}

module('Valid server request', {
	setup : function() {
		QUnit.stop();
		sap.apf.tests.integration.withServer.tRequest.commonSetup(this);
		var oInject = this.oInject;
		
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			this.oRequest = new sap.apf.core.Request(oInject, this.requestConfig);
			QUnit.start();
		}.bind(this));
		
	},
	requestConfig : {
		type : "request",
		id : "CompanyCodeQuery",
		entityType : "CompanyCodeQuery",
		service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
		selectProperties : [ 'SAPClient', 'CompanyCodeName' ]
	}
});
test('Correct type', function() {
	equal(this.oRequest.type, 'request', 'Type "request" expected');
});
asyncTest('Send request with filters', function() {
	expect(1);
	var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'SAPClient', this.EQ, '777');
	oFilter.addAnd('CompanyCode', this.EQ, '1000');
	var fnCallback = function(oResponse, bStepUpdated) {
		if (oResponse.data !== undefined) {
			equal(oResponse.data.length, 1, 'Two entries expected in result');
		} else { // if server is not available
			equal(oResponse.code, "5001", "correct error code on failure of http request");
		}
		start();
	};

	this.oRequest.sendGetInBatch(oFilter, fnCallback);
});


asyncTest('Send request with filters so that no data is returned', function() {
	expect(1);
	var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'SAPClient', this.EQ, '0000000000');
	var fnCallback = function(oResponse) {
		equal(oResponse.data.length, 0, 'Empty result array expected');
		start();
	};
	this.oRequest.sendGetInBatch(oFilter, fnCallback);
});
asyncTest('Send request with filters and check if metadata is handed over', function() {
	expect(2);
	var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'SAPClient', this.EQ, '0000000000');
	var fnCallback = function(oResponse) {
		equal(oResponse.data.length, 0, 'Empty result array expected');
		ok(oResponse.metadata, 'Metadata object expected');
		start();
	};
	this.oRequest.sendGetInBatch(oFilter, fnCallback);
});

module('Invalid server request', {
	setup : function() {
		QUnit.stop();
		sap.apf.tests.integration.withServer.tRequest.commonSetup(this);
		var oInject = this.oInject;
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			QUnit.start();
		});
		
		this.oRequest = new sap.apf.core.Request(oInject, this.requestConfig);
	},
	requestConfig : {
		type : "request",
		id : "WCAClearedReceivablesQuery_001",
		entityType : "WCANonExistentQuery",
		service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
		selectProperties : [ 'Customer', 'CustomerName' ]
	}
});
asyncTest('Send request returns error object', function() {
	expect(2);
	var fnCallback = function(oResponse) {
		ok(oResponse instanceof Error, 'Error information expected');
		equal(oResponse.getCode(), "5001", "correct error code on failure of http request");
		start();
	};
	this.oRequest.sendGetInBatch({}, fnCallback);
});
asyncTest('Send request to non-existing "requestUri" returns error object', function() {
	expect(2);
	var fnTmpGetAbsolutePath = sap.apf.core.utils.uriGenerator.getAbsolutePath;
	sap.apf.core.utils.uriGenerator.getAbsolutePath = function() {
		return "";
	};
	var fnCallback = function(oResponse) {
		ok(oResponse instanceof Error);
		equal(oResponse.getCode(), "5001", "correct error code on failure of http request");
		start();
	};
	this.oRequest.sendGetInBatch({}, fnCallback);
	sap.apf.core.utils.uriGenerator.getAbsolutePath = fnTmpGetAbsolutePath;
});
asyncTest('Send request with missing required filter returns error object', function() {
	expect(1);
	var oRequestConfig = {
		type : "request",
		id : "CurrencyQueryTypeId",
		entityType : "CompanyCodeQuery",
		service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
		selectProperties : [ 'CompanyCode', 'CompanyCodeName' ]
	};
	
	new sap.apf.core.Request(this.oInject, oRequestConfig).sendGetInBatch(new sap.apf.core.utils.Filter(this.oMessageHandler), function() {
	});
	var aLogEntries = jQuery.sap.log.getLogEntries();
	var nLastLogEntryPosition = aLogEntries.length - 1;
	bMessageContained = aLogEntries[nLastLogEntryPosition].message.search("5005") > -1;
	equal(bMessageContained, true, "Expected Code");
	start();
});
module('XSRF token handling', {
	setup : function() {
		QUnit.stop();
		sap.apf.tests.integration.withServer.tRequest.commonSetup(this);
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			QUnit.start();
		});

		this.oRequest = new sap.apf.core.Request(this.oInject, this.requestConfig);
		this.originalODataRequest = OData.request;
		this.xsrfTokenInPost = false;
		this.xsrfTokenInInnerGet = false;
		OData.request = function(request) {
			if (request["headers"]["x-csrf-token"] !== undefined && request["headers"]["x-csrf-token"].length === 32) {
				this.xsrfTokenInPost = true;
			}
			if (request["data"]["__batchRequests"][0]["headers"]["x-csrf-token"] !== undefined && request["data"]["__batchRequests"][0]["headers"]["x-csrf-token"].length === 32) {
				this.xsrfTokenInInnerGet = true;
			}
		}.bind(this);
	},
	teardown : function() {
		OData.request = this.originalODataRequest;
		
	},
	requestConfig : {
		type : "request",
		id : "WCAClearedReceivablesQuery_001",
		entityType : "WCAClearedReceivableQuery",
		service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
		selectProperties : [ 'Customer', 'CustomerName' ]
	}
});
test('XSRF Token in request header', function() {
	this.oRequest.sendGetInBatch();
	ok(this.xsrfTokenInPost, 'xsrf token in request header of Post Request');
	ok(this.xsrfTokenInInnerGet, 'xsrf token in request header of inner GET Request');
});


module('Language header set correctly', {
	setup : function() {
		QUnit.stop();
		sap.apf.tests.integration.withServer.tRequest.commonSetup(this);

		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			this.oRequest = new sap.apf.core.Request(this.oInject, this.requestConfig);
			QUnit.start();
		}.bind(this));
		
	},
	requestConfig : {
		type : "request",
		id : "WCAClearedReceivables",
		entityType : "WCAClearedReceivableQuery",
		service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
		selectProperties : [ 'Customer', 'CustomerName', 'CustomerCountryName' ]
	}
});
asyncTest('Send Post (Batch) and response includes correct CustomerCountryNames and no null values', function() {
	expect(2);
	var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'P_SAPClient', this.EQ, '777');
	oFilter.addAnd('P_FromDate', this.EQ, '20110723');
	oFilter.addAnd('P_ToDate', this.EQ, '20120723');
	oFilter.addAnd("P_DisplayCurrency", this.EQ, "EUR");
	var fnCallback = function(oResponse) {

		equal((oResponse instanceof Error), false, "Successfull Request in send post expected otherwise problem with service");

		if (oResponse.data) {
			notEqual(oResponse.data[0].CustomerCountryName, null, 'Data returned');
		}
		start();
	};
	this.oRequest.sendGetInBatch(oFilter, fnCallback);
});
module('Request options are executed correct', {
	setup : function() {
		QUnit.stop();
		sap.apf.tests.integration.withServer.tRequest.commonSetup(this);
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			this.oRequest = new sap.apf.core.Request(this.oInject, this.requestConfig);
			QUnit.start();
		}.bind(this));
		
	},
	requestConfig : {
		type : "request",
		id : "WCAClearedReceivables",
		entityType : "WCAClearedReceivableQuery",
		service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
		selectProperties : [ 'Customer', 'CustomerName', 'CustomerCountryName' ]
	}
});
asyncTest('Send Post (Batch) with request options for inlinecount, skip, and top', function() {
	expect(3);
	var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'P_SAPClient', this.EQ, '777');
	oFilter.addAnd('P_FromDate', this.EQ, '20110723');
	oFilter.addAnd('P_ToDate', this.EQ, '20120723');
	oFilter.addAnd("P_DisplayCurrency", this.EQ, "EUR");
	var oRequestOptions = {
		paging : {
			top : 20,
			skip : 10,
			inlineCount : true
		}
	};
	var fnCallback = function(oResponse) {
		equal((oResponse instanceof Error), false, "Successfull Request in send post expected otherwise problem with service");
		if (oResponse.data) {
			ok(oResponse.count = 999, 'Value of "__count" returned 999');
			ok(oResponse.data.length = 20, 'Number of records returned as expected');
		}

		start();
	};
	this.oRequest.sendGetInBatch(oFilter, fnCallback, oRequestOptions);
});