jQuery.sap.declare("sap.apf.tests.integration.withServer.tViewParameterProvisioning");

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.registerModulePath('sap.apf.internal.server', '../../internal/server');
jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance'); // FIXME must occur in ALL test file that require helper.js
jQuery.sap.require('sap.apf.tests.integration.withDoubles.helper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.stub.ajaxStub');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');

jQuery.sap.require('sap.apf.internal.server.userData');

jQuery.sap.require('sap.apf.Component');

sap.apf.testhelper.injectURLParameters({
	"P_FromDate" : "20110101",
	"P_ToDate" : "20121231",
	"P_AgingGridMeasureInDays" : "10",
	"P_DisplayCurrency" : "USD",
	"P_ExchangeRateType" : "M",
	"P_NetDueArrearsGridMeasureInDays" : "10",
	"P_NetDueGridMeasureInDays" : "10",
	"P_SAPClient" : "777",
	"SAPClient" : "777"
});

if (!sap.apf.tests.integration.withServer.tViewParameterProvisioning) {

	sap.apf.tests.integration.withServer.tViewParameterProvisioning = {};

}

module('Add steps to path', {
	setup : function() {
		sap.apf.tests.integration.withDoubles.helper.createComponentAndApi(this);
		QUnit.stop();
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			QUnit.start();
		});

		this.initErrorHandling();
		this.fnOriginalAjax = jQuery.ajax;
		sap.apf.testhelper.replacePathsInAplicationConfiguration(this.fnOriginalAjax);
		var sUrl = sap.apf.testhelper.determineTestResourcePath() + "/integration/withServer/viewParameterProvisioningApplicationConfiguration.json";
		this.oApi.loadApplicationConfig(sUrl);
		this.oApi.resetPath();
		this.startFilter = this.oApi.createFilter();
		this.topAnd = this.startFilter.getTopAnd();
		this.defineFilterOperators();
	},
	defineFilterOperators : function() {
		jQuery.extend(this, this.startFilter.getOperators());
	},
	teardown : function() {
		this.oCompContainer.destroy();
		jQuery.ajax = this.fnOriginalAjax;
	},
	initErrorHandling : function() {
		this.sMessage = "";
		this.sMessageCode = "";
		this.sErrorSeverity = "";
		this.oApi.activateOnErrorHandling(true);
		this.oApi.setCallbackForMessageHandling(this.callbackErrorHandling.bind(this));
	},
	callbackErrorHandling : function(oErrorMessage) {
		var sMessage = oErrorMessage.getMessage();
		var sErrorSeverity = oErrorMessage.getSeverity();
		var sMessageCode = oErrorMessage.getCode();
		var oPrevious = oErrorMessage.getPrevious();
		if (oPrevious) {
			sMessage = sMessage + ' DUE TO ' + oPrevious.getMessage();
		}
		var bErrorHappened = sErrorSeverity === sap.apf.core.constants.message.severity.error;
		equal(bErrorHappened, false, "Error (" + sMessageCode + "): " + sMessage);
	}
});
asyncTest("Single step using parameter values from start filter", function() {
	expect(1);
	this.topAnd.addExpression({
		name : 'SAPClient',
		operator : this.EQ,
		value : '777'
	});
	this.topAnd.addExpression({
		name : 'P_AgingGridMeasureInDays',
		operator : this.EQ,
		value : '10'
	});
	this.topAnd.addExpression({
		name : 'P_DisplayCurrency',
		operator : this.EQ,
		value : 'USD'
	});
	this.topAnd.addExpression({
		name : 'P_ExchangeRateType',
		operator : this.EQ,
		value : 'M'
	});
	this.topAnd.addExpression({
		name : 'P_NetDueArrearsGridMeasureInDays',
		operator : this.EQ,
		value : '10'
	});
	this.topAnd.addExpression({
		name : 'P_NetDueGridMeasureInDays',
		operator : this.EQ,
		value : '10'
	});
	this.topAnd.addExpression({
		name : 'P_SAPClient',
		operator : this.EQ,
		value : '777'
	});
	this.topAnd.addExpression({
		name : 'P_FromDate',
		operator : this.EQ,
		value : '20110723'
	});
	this.topAnd.addExpression({
		name : 'P_ToDate',
		operator : this.EQ,
		value : '20120723'
	});
	this.or = this.topAnd.addOr().addExpression({
		name : 'Customer',
		operator : this.EQ,
		value : '1'
	});
	this.or.addExpression({
		name : 'Customer',
		operator : this.EQ,
		value : '1000'
	});

	this.oApi.setContext(this.startFilter);
	this.oApi.createStep("stepTemplate1", assertStepCreated);
	function assertStepCreated(oStep, bUpdated) {
		ok(bUpdated, 'Single step created and updated');
		start();
	}
});

asyncTest("Single step using all available default values from annotation file", function() {
	expect(1);
	this.topAnd.addExpression({
		name : 'P_DisplayCurrency',
		operator : this.EQ,
		value : 'USD'
	});
	this.topAnd.addExpression({
		name : 'SAPClient',
		operator : this.EQ,
		value : '777'
	});
	this.topAnd.addExpression({
		name : 'P_SAPClient',
		operator : this.EQ,
		value : '777'
	});
	this.topAnd.addExpression({
		name : 'P_FromDate',
		operator : this.EQ,
		value : '20110723'
	});
	this.topAnd.addExpression({
		name : 'P_ToDate',
		operator : this.EQ,
		value : '20120723'
	});
	this.or = this.topAnd.addOr().addExpression({
		name : 'Customer',
		operator : this.EQ,
		value : '1'
	});
	this.or.addExpression({
		name : 'Customer',
		operator : this.EQ,
		value : '1000'
	});
	this.oApi.setContext(this.startFilter);
	this.oApi.createStep("stepTemplate1", assertStepCreated);
	function assertStepCreated(oStep, bUpdated) {
		ok(bUpdated, 'Single step created and updated');
		start();
	}
});
asyncTest("Two steps - second step requires sames parameters as first step", function() {
	expect(2);
	this.topAnd.addExpression({
		name : 'P_DisplayCurrency',
		operator : this.EQ,
		value : 'USD'
	});
	this.topAnd.addExpression({
		name : 'SAPClient',
		operator : this.EQ,
		value : '777'
	});
	this.topAnd.addExpression({
		name : 'P_SAPClient',
		operator : this.EQ,
		value : '777'
	});
	this.topAnd.addExpression({
		name : 'P_FromDate',
		operator : this.EQ,
		value : '20110723'
	});
	this.topAnd.addExpression({
		name : 'P_ToDate',
		operator : this.EQ,
		value : '20120723'
	});
	this.or = this.topAnd.addOr().addExpression({
		name : 'Customer',
		operator : this.EQ,
		value : '1'
	});
	this.or.addExpression({
		name : 'Customer',
		operator : this.EQ,
		value : '1000'
	});
	function createSecondStep(oStep, bUpdated) {
		if (oStep !== this.step1) {
			return;
		}
		ok(bUpdated, 'First step created and and updated');
		this.step2 = this.oApi.createStep("stepTemplate2", assertSecondStepCreated.bind(this));
	}
	function assertSecondStepCreated(oStep, bUpdated) {
		if (oStep !== this.step2) {
			return;
		}
		ok(bUpdated, 'Second step created and updated');
		start();
	}
	this.oApi.setContext(this.startFilter);
	this.step1 = this.oApi.createStep("stepTemplate1", createSecondStep.bind(this));
});

asyncTest("Two steps - second step requires no parameters", function() {
	expect(2);
	this.topAnd.addExpression({
		name : 'P_DisplayCurrency',
		operator : this.EQ,
		value : 'USD'
	});
	this.topAnd.addExpression({
		name : 'SAPClient',
		operator : this.EQ,
		value : '777'
	});
	this.topAnd.addExpression({
		name : 'P_SAPClient',
		operator : this.EQ,
		value : '777'
	});
	this.topAnd.addExpression({
		name : 'P_FromDate',
		operator : this.EQ,
		value : '20110723'
	});
	this.topAnd.addExpression({
		name : 'P_ToDate',
		operator : this.EQ,
		value : '20120723'
	});
	this.or = this.topAnd.addOr().addExpression({
		name : 'Customer',
		operator : this.EQ,
		value : '1'
	});
	this.or.addExpression({
		name : 'Customer',
		operator : this.EQ,
		value : '1000'
	});
	function createSecondStep(oStep, bUpdated) {
		if (oStep !== this.step1) {
			return;
		}
		ok(bUpdated, 'First step created and updated');
		this.step2 = this.oApi.createStep("stepTemplate3", assertSecondStepCreated.bind(this));
	}
	function assertSecondStepCreated(oStep, bUpdated) {
		if (oStep !== this.step2) {
			return;
		}
		ok(bUpdated, 'Second step created and updated');
		start();
	}
	this.oApi.setContext(this.startFilter);
	this.step1 = this.oApi.createStep("stepTemplate1", createSecondStep.bind(this));
});

function assertCorrectUriParametersSupplied(oUriParameters) {
	equal(oUriParameters['P_AgingGridMeasureInDays'], 10, "Uri parameter P_AgingGridMeasureInDays detected");
	equal(oUriParameters['P_DisplayCurrency'], 'USD', "Uri parameter P_DisplayCurrency detected");
	equal(oUriParameters['P_ExchangeRateType'], 'M', "Uri parameter  P_ExchangeRateType detected");
	equal(oUriParameters['P_NetDueArrearsGridMeasureInDays'], 10, "Uri parameter P_NetDueArrearsGridMeasureInDays detected");
	equal(oUriParameters['P_NetDueGridMeasureInDays'], 10, "Uri parameter P_NetDueGridMeasureInDays detected");
	equal(oUriParameters['P_SAPClient'], '777', "Uri parameter P_SAPClient detected");
	equal(oUriParameters['SAPClient'], '777', "Uri parameter SAPClient detected");
	equal(oUriParameters['P_FromDate'], '20110101', "Uri parameter P_FromDate detected");
	equal(oUriParameters['P_ToDate'], '20121231', "Uri parameter P_ToDate detected");
}

asyncTest("Single step using values from URI - set in path via method setContext() from url parameters", function() {

	var oUriParameters = sap.apf.utils.getUriParameters();
	assertCorrectUriParametersSupplied(oUriParameters);

	var oFilter = this.oApi.createFilter();
	var property = undefined;
	var oExpression = undefined;

	for(property in oUriParameters) {
		oExpression = {
			name : property,
			operator : this.EQ,
			value : oUriParameters[property][0]
		};
		oFilter.getTopAnd().addExpression(oExpression);
	}
	this.oApi.setContext(oFilter);
	this.oApi.createStep("stepTemplate1", assertStepCreated);
	function assertStepCreated(oStep, bUpdated) {
		// there must be an update true, because step has just been created!
		equal(bUpdated, true, 'Step created and updated without error');
		start();
	}
});
