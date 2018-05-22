jQuery.sap.declare("sap.apf.tests.integration.withServer.tReadRequest");

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.registerModulePath('sap.apf.internal.server', '../../internal/server');
jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance'); // FIXME must occur in ALL test file that require helper.js
jQuery.sap.require('sap.apf.tests.integration.withDoubles.helper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.Component');

module("Basic functions for read request by required filter", {
	setup : function() {

		sap.apf.tests.integration.withDoubles.helper.createComponentAndApi(this);
		QUnit.stop();
		this.oFilter = this.oApi.createFilter();
		this.defineFilterOperators();
		this.oFilter.getTopAnd().addExpression({
			name : 'SAPClient',
			operator : this.EQ,
			value : '777'
		});
		this.oFilter.getTopAnd().addExpression({
			name : 'CompanyCode',
			operator : this.EQ,
			value : '1000'
		});
		new sap.apf.testhelper.AuthTestHelper(function() {
			QUnit.start();
		}.bind(this));

	},
	defineFilterOperators : function() {
		jQuery.extend(this, this.oFilter.getOperators());
	},
	teardown : function() {
		this.oCompContainer.destroy();
	
	}
});

asyncTest("Creating read request", function() {
	expect(3);
	var assertCompanyCodeDataRequestIsOk = function(oDataResponse, oMetadata, oMessageObject) {

		ok(oDataResponse);
		equal((oMetadata && oMetadata.type && oMetadata.type === "entityTypeMetadata"), true, "Metadata object was returned");
		equal(oMessageObject, undefined, "No message is expected");
		start();
	};
	function handleErrors(oMessageObject) {
		var sText = oMessageObject.getMessage();
		equal(sText, "");
	}
	this.oApi.activateOnErrorHandling(true);
	this.oApi.setCallbackForMessageHandling(handleErrors);
	
    var oRequest = this.oApi.createReadRequestByRequiredFilter({ "type": "request",  "service": "/sap/hba/apps/wca/dso/s/odata/wca.xsodata", 
    		"entityType": "CompanyCodeQuery", "selectProperties": [ "SAPClient",  "CompanyCode",  "Currency", "CurrencyShortName" ] });
   //var rr = rr = this.oApi.createReadRequestByRequiredFilter({ "type": "request", "id": "SOMEiD", "service": "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata", "entityType": "EVALUATIONS", "selectProperties": [ "FILTERS" ] })
	
    oRequest.send(this.oFilter, assertCompanyCodeDataRequestIsOk.bind(this));

});

