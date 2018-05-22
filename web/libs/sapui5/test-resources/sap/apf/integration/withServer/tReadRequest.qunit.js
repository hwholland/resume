jQuery.sap.declare("sap.apf.tests.integration.withServer.tReadRequest");

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.registerModulePath('sap.apf.internal.server', '../../internal/server');
jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance'); // FIXME must occur in ALL test file that require helper.js
jQuery.sap.require('sap.apf.tests.integration.withDoubles.helper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.Component');

module("Basic functions for read request", {
	setup : function() {

		sap.apf.tests.integration.withDoubles.helper.createComponentAndApi(this);
		QUnit.stop();
		this.fnOriginalAjax = jQuery.ajax;
		sap.apf.testhelper.replacePathsInAplicationConfiguration(this.fnOriginalAjax);
		var sUrl = sap.apf.testhelper.determineTestResourcePath() + "/integration/withServer/integrationTestingApplicationConfiguration.json";
		this.oApi.loadApplicationConfig(sUrl);
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
		jQuery.ajax = this.fnOriginalAjax;
	}
});

asyncTest("Creating read request for company code with filter on client", function() {
	var assertCompanyCodeDataRequestIsOk = function(oDataResponse, oMetadata, oMessageObject) {
		ok(oDataResponse);
		equal((oMetadata && oMetadata.type && oMetadata.type === "entityTypeMetadata"), true, "Metadata object was returned");
		equal(oMessageObject, undefined, "No message is expected");
		start();
	};
	expect(4);
	function handleErrors(oMessageObject) {

	}
	this.oApi.activateOnErrorHandling(true);
	this.oApi.setCallbackForMessageHandling(handleErrors);
	var oReadRequest = this.oApi.createReadRequest("CompanyCodeQueryResults");
	var oMetadata = oReadRequest.getMetadata();
	equal(oMetadata && oMetadata.type && oMetadata.type === "entityTypeMetadata", true, "Function works as expected");
	oReadRequest.send(this.oFilter, assertCompanyCodeDataRequestIsOk.bind(this));
});

test("Wrong request id, which does not exist in configuration, provokes error message", function() {
	var sMessageCode = "";
	var assertMessageWasPutCallback = function(oMessageObject) {
		sMessageCode = oMessageObject.getCode();

	};

	this.oApi.activateOnErrorHandling(true);
	this.oApi.setCallbackForMessageHandling(assertMessageWasPutCallback);
	throws(function() {
		this.oApi.createReadRequest("UnkownRequestId");
		equal(sMessageCode, "5004", "Correct error message");
	}, Error, "must throw error to pass and to resume");
});

test("Mandatory $filter property is missing for CompanyCodeQuery", function() {
	expect(1);
	var assertMessageWasPutCallback = function(oMessageObject) {
		var sMessageCode = oMessageObject.getCode();
		equal(sMessageCode, "5005", "Message code 5005 as expected");

	};

	var oFilter = new this.oApi.createFilter();

	oFilter.getTopAnd().addExpression({
		name : 'PropertyOfNoInterest',
		operator : this.EQ,
		value : 'value1'
	});

	this.oApi.activateOnErrorHandling(true);
	this.oApi.setCallbackForMessageHandling(assertMessageWasPutCallback);

	var oReadRequest = this.oApi.createReadRequest("CompanyCodeQueryResults");
	oReadRequest.send(oFilter, function() {
	});
});

asyncTest("Get metadata by property", function(){
    expect(1);
    var callback = function(aAllParameterEntitySetKeyProperties) {
        equal(aAllParameterEntitySetKeyProperties.length, 11, "MetadataByProperty works properly, correct number of parameter entity set key propertiess returned");
        start();
    };
    var oReadRequest = this.oApi.createReadRequest("CompanyCodeQueryResults");
    var oMetadataByProperty = oReadRequest.getMetadataFacade();
    oMetadataByProperty.getAllParameterEntitySetKeyProperties(callback);
});
