/*global OData*/

jQuery.sap.declare("sap.apf.integration.withServer.tFilterSimplifyOData");

jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require("sap.apf.core.instance");
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");

jQuery.sap.require('sap.apf.core.utils.filter');
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require('sap.apf.core.utils.filterSimplify');
jQuery.sap.require('sap.apf.utils.hashtable');

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper/');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');

(function() {
	function createFilterNonSelectOption(context) {
		var oFilter1 = new sap.apf.core.utils.Filter(context.oMessageHandler, 'AirlineCode', context.EQ, 'SQ');
		oFilter1.addOr(new sap.apf.core.utils.Filter(context.oMessageHandler, 'AirlineCode', context.EQ, 'LH'));
		oFilter1.addOr(new sap.apf.core.utils.Filter(context.oMessageHandler, 'AirlineCode', context.EQ, 'AF'));

		var oFilter2 = new sap.apf.core.utils.Filter(context.oMessageHandler, 'AirlineCode', context.EQ, 'SQ');
		oFilter2.addOr(new sap.apf.core.utils.Filter(context.oMessageHandler, 'AirlineCode', context.EQ, 'LH'));

		var oFilter = new sap.apf.core.utils.Filter(context.oMessageHandler, oFilter1);
		oFilter.addAnd(oFilter2);

		return oFilter;
	}



if (!sap.apf.integration.withServer.tRequest) {

	sap.apf.integration.withServer.tRequest = {};

	sap.apf.integration.withServer.tRequest.commonSetup = function(oContext) {
		function defineFilterOperators() {
			jQuery.extend(oContext, sap.apf.core.constants.FilterOperators);
		}
		defineFilterOperators();
		oContext.oMessageHandler = new sap.apf.core.MessageHandler();
		oContext.oCoreApi = new sap.apf.core.Instance({
			startParameter : {
				isFilterReductionActive : function() {
					return false; // Always set to false because tests are using filter simplification independently of configured start parameter 
				}
			},
			instances: {
				messageHandler : oContext.oMessageHandler
			}
		});

		oContext.oInject = {
			instances: {
				messageHandler: oContext.oMessageHandler,
				coreApi: oContext.oCoreApi
			}
		};
	};
}

QUnit.module('Valid server request', {
	beforeEach : function(assert) {
		var done = assert.async();
		sap.apf.integration.withServer.tRequest.commonSetup(this);
		var oInject = this.oInject;
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
			this.oRequest = new sap.apf.core.Request(oInject, this.requestConfig);
			done();
		}.bind(this));

	},
	requestConfig : {
		type : "request",
		id : "CAPF_FLIGHT",
		entityType : "CAPF_FLIGHT",
		service : "/sap/opu/odata/sap/CAPF_FLIGHT_CDS",
		selectProperties : [ "AirlineCode", "MaxCapacity" ]
	}
});

QUnit.test('Correct type', function(assert) {
	assert.equal(this.oRequest.type, 'request', 'Type "request" expected');
});

QUnit.test('Send request with a filter', function(assert) {
	var done = assert.async();
	assert.expect(1);
	var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, 'AirlineCode', this.EQ, 'LH');
	var fnCallback = function(oResponse, bStepUpdated) {
		assert.ok( oResponse.data !== undefined, " oResponse.data is defined (even with empty feed) " );
		done();
	};

	this.oRequest.sendGetInBatch(oFilter, fnCallback);
});

QUnit.test('Send request with a filter, which is not representatble as ABAP select option', function(assert) {
	var done = assert.async();
	assert.expect(1);
	var oFilter = createFilterNonSelectOption(this);

	var fnCallback = function(oResponse, bStepUpdated) {
		assert.equal( oResponse.getParameters()[0], 400, " http code === 400 bad request expected ");
		done();
	};

	this.oRequest.sendGetInBatch(oFilter, fnCallback);
});

QUnit.test('Send request with a filter, which is not representatble as ABAP select option, using filter simplify', function(assert) {
	var done = assert.async();
	assert.expect(1);
	var oFilter = createFilterNonSelectOption(this);

	var filterSimplify = new sap.apf.core.utils.FilterReduction();
	var startFilter = new sap.apf.core.utils.Filter(this.oMessageHandler);
	var oReducedFilter = filterSimplify.filterReduction(this.oMessageHandler, startFilter, oFilter);

	var fnCallback = function(oResponse, bStepUpdated) {
		assert.ok( oResponse.data !== undefined, " OK required, showing that filter was successfully reduced and accepted by analytical engine " );
		done();
	};

	this.oRequest.sendGetInBatch(oReducedFilter, fnCallback);
});

}());
