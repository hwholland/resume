/**
 * Read a CDS View
 * required entries in forward properties
 * gateway.pattern=^/sapgateway/opu
 * gateway.target=<ER3>/sap/opu
 */

jQuery.sap.require("sap.apf.core.instance");

(function() {
	'use strict';

	var StartParameter = function() {
		this.getAnalyticalConfigurationId = function() {
			return undefined;
		};
	};
	QUnit.module("Read CDS View", {
		beforeEach : function(assert) {
			var startParameter = new StartParameter();
			var messageHandler = new sap.apf.core.MessageHandler();
			this.coreApi = new sap.apf.core.Instance({
				instances: {
					messageHandler : messageHandler,
					startParameter : startParameter
				}
			});
			this.oFilter = this.coreApi.createFilter();
			this.defineFilterOperators();
		},
		defineFilterOperators : function() {
			jQuery.extend(this, this.oFilter.getOperators());
		}
	});
	QUnit.test("Read Metadata of CDS View", function(assert) {
		var metadata = this.coreApi.getMetadata("/sapgateway/opu/odata/sap/ZJH_4APF_005_SRV");
		var attributes = metadata.getAttributes("CZISCARR");
		assert.equal(attributes.text, "CZISCARR_T", "text field recognized");
	});
	QUnit.test("Read Request on CDS View", function(assert) {
		assert.expect(4);
		var done = assert.async();
		var assertRequestIsOk = function(oDataResponse, oMetadata, oMessageObject) {
			assert.ok(oDataResponse);
			assert.equal(oDataResponse.length, 3, "2 Records and 1 totals expected");
			assert.equal((oMetadata && oMetadata.type && oMetadata.type === "entityTypeMetadata"), true, "Metadata object was returned");
			assert.equal(oMessageObject, undefined, "No message is expected");
			done();
		};
		function handleErrors(oMessageObject) {
			var sCode = oMessageObject.getCode();
			assert.ok(false, "unexpected error during read request with code " + sCode);
		}
		this.coreApi.activateOnErrorHandling(true);
		this.coreApi.setCallbackForMessageHandling(handleErrors);
		var orLevel = this.oFilter.getTopAnd().addOr("orId1").addExpression({
			name : 'CZISCARR',
			operator : this.EQ,
			value : 'AC'
		});
		orLevel.addExpression({
			name : 'CZISCARR',
			operator : this.EQ,
			value : 'AF'
		});
		var oRequest = this.coreApi.createReadRequestByRequiredFilter({
			"type" : "request",
			"service" : "/sapgateway/opu/odata/sap/ZJH_4APF_005_SRV",
			"entityType" : "ZJH_4APF_005Results",
			"selectProperties" : [ "CZISCARR", "CZISCARR_T", "TotaledProperties" ]
		});
		oRequest.send(this.oFilter, assertRequestIsOk.bind(this));
	});
}());