/*
 * Optional URL parameter ?systemType=abap executes this on a gateway system. Prefix /sap/ in proxy setting should be mapped to ER3 in this case.
 * The logical system is not used on a abap based gateway system. Therefore the test is disabled in this case.
 * 
 */

jQuery.sap.declare("sap.apf.tests.integration.withServer.tSessionHandler");

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.internal.server', '../../internal/server');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.authTestHelperAbap');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfCoreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');

jQuery.sap.require('sap.apf.internal.server.userData');

jQuery.sap.require('sap.apf.core.sessionHandler');
jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.require('sap.apf.utils.filter');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.utils.filter');
jQuery.sap.require('sap.apf.core.utils.filterTerm');
jQuery.sap.require('sap.apf.core.ajax');
jQuery.sap.require('sap.apf.core.odataRequest');
jQuery.sap.require('sap.apf.core.messageObject');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.declare('sap.apf.core.utils.checkForTimeout');

jQuery.sap.require('sap.apf.core.resourcePathHandler');

function defineFilter (oMessageHandler, filters) {
	var oFilter = new sap.apf.utils.Filter(oMessageHandler);
    var oExpression = undefined;
	var property = undefined;
	for (property in filters) {
		oExpression = {
				name: property,
				operator: sap.apf.core.constants.FilterOperators.EQ,
				value: filters[property]
		};
		oFilter.getTopAnd().addExpression(oExpression);
	}
	return oFilter;
}

if (!sap.apf.tests.integration.withServer.tSessionHandler) {

	sap.apf.tests.integration.withServer.tSessionHandler = {};
	
	sap.apf.tests.integration.withServer.tSessionHandler.commonIsolatedSetup = function (oContext) {
	
		oContext.oMessageHandler = new sap.apf.core.MessageHandler();
		var oMessageHandler = oContext.oMessageHandler;

		oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			messageHandler : oContext.oMessageHandler
		}).doubleContext();

		oContext.oCoreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};

		var oInject = {
			messageHandler : oMessageHandler,
			coreApi : oContext.oCoreApi
		};

		if(jQuery.sap.getUriParameters().get("systemType") === "abap") {
			 
			oContext.config = {
					serviceRoot : "/sap/opu/odata/sap/Z_ANALYSIS_PATH_SRV/",
					entitySet : "AnalysisPathQSet",
					systemType : "abap"
			};
			oContext.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelperAbap(function() {
				this.oSessionHandler = new sap.apf.core.SessionHandler(oInject);
				QUnit.start();
			}.bind(oContext), oContext.config);
			
			oContext.expectedXSRFTokenLength = 24;
		 } else {
			 oContext.config = {
						serviceRoot : "/sap/hba/r/apf/core/odata/apf.xsodata/",
						entitySet : 'AnalysisPathQueryResults',
						systemType : "xs"
				};
			 oContext.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
					this.oSessionHandler = new sap.apf.core.SessionHandler(oInject);
					QUnit.start();
				}.bind(oContext));
			 
			 oContext.expectedXSRFTokenLength = 32;
		 }
		
		
	};
}

module('Xsrf Token Test', {
	setup : function() {
		QUnit.stop();
		sap.apf.tests.integration.withServer.tSessionHandler.commonIsolatedSetup(this);
		sinon.spy(jQuery, "ajax");
	}, 
	teardown: function() {
		jQuery.ajax.restore();
	}
});

test('Create SessionHandler Instance for XSRF Token check', function() {
	var sXsrfToken = this.oSessionHandler.getXsrfToken(this.config.serviceRoot);
	
	ok(typeof sXsrfToken === "string", 'XSRF token expected');
	equal(sXsrfToken.length, this.expectedXSRFTokenLength, 'XSRF token of length ' + this.expectedXSRFTokenLength + ' expected');
	equal(sXsrfToken, this.oSessionHandler.getXsrfToken(this.config.serviceRoot), 'Second call for XSRF token returns same token as on first call');
	ok(jQuery.ajax.calledOnce,'Second call for XSRF token returns token from hashtable and does not trigger another ajax request');
});

module('Logical System', {
	setup : function() {

		if (jQuery.sap.getUriParameters().get("systemType") === "abap") {
			return;
		}
			QUnit.stop();
			sap.apf.tests.integration.withServer.tSessionHandler.commonIsolatedSetup(this);

			var oMessageHandler = this.oMessageHandler;
			this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.oCoreApi.updatePath = function() {

			};
			this.oCoreApi.getPersistenceConfiguration = function() {
				return {
					"path" : {
						"service" : "/sap/hba/r/apf/core/odata/apf.xsodata"
					},
					"logicalSystem" : {
						"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
					}
				};
			};
		
	}
});
test("Get logical system", function() {
	// datajs has been modified by SAP UI5 to work synchronously too
	// if this test does not work, then this modification might been missing
	
	if (jQuery.sap.getUriParameters().get("systemType") === "abap") {
		ok(true, "Test not relevant for ABAP systems");
		return;
	}
		
	expect(1);
	var oFilter = defineFilter(this.oMessageHandler, {
		SAPClient : "777",
		CompanyCode : "2000"
	});

	var sCurrentLogicalSystem = "P4QCLNT777";
	this.oSessionHandler.setContext(oFilter);
	var sLogicalSystem = this.oSessionHandler.getLogicalSystem();
	equal(sLogicalSystem, sCurrentLogicalSystem, "Correct logical system");

});
