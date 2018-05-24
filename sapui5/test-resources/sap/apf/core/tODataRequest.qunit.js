jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.messageHandler");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.ui.thirdparty.datajs");
(function() {
	'use strict';
	QUnit.module('ODataRequest', {
		beforeEach : function(assert) {
			// Restore in case, that the test is called in karma
			if (OData && OData.request) {
				this.ODataRequest = OData.request;
			}
		},
		afterEach : function(assert) {
			if (this.ODataRequest) {
				OData.request = this.ODataRequest;
			}
		}
	});
	QUnit.test('Check if both callback functions (wrapped and handed over) are called', function(assert) {
		var oMsgHandler = new sap.apf.testhelper.doubles.MessageHandler().spyPutMessage();
		var bRequestSuccess = false;
		var bRequestError = false;
		var fnSuccess = function() {
			bRequestSuccess = true;
		};
		var fnError = function() {
			bRequestError = true;
		};
		var oRequest = {};
		var oInject = {
			instances : {
				datajs : {
					request : function(oRequest, fnSuccess, fnError, oBatchHandler) {
						fnSuccess();
					}
				}
			}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, {});
		assert.ok(bRequestSuccess, "Success function was called");
		var oInject = {
			instances : {
				datajs : {
					request : function(oRequest, fnSuccess, fnError, oBatchHandler) {
						fnError();
					}
				}
			}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, {});
		assert.ok(bRequestError, "Error function was called");
	});
	QUnit.test('Timeout 303', function(assert) {
		var done = assert.async();
		this.server = sinon.fakeServer.create();
		this.server.respondWith([ 303, {
			"Content-Type" : "text/plain"
		}, '' ]);
		this.server.autoRespond = true;
		var fnSuccess = function() {
			return undefined;
		};
		var fnError = function(oError) {
			assert.equal(oError.messageObject.getCode(), 5021, 'PutMessage with code 5021 expected due to timeout');
			done();
		};
		var oRequest = {};
		var oInject = {
			instances: {
				datajs: OData
			}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, {});
		this.server.restore();
	});
	QUnit.test('Timeout with redirect to login 200', function(assert) {
		var done = assert.async();
		var oMsgHandler = new sap.apf.testhelper.doubles.MessageHandler().spyPutMessage();
		this.server = sinon.fakeServer.create();
		this.server.respondWith([ 200, {
			"x-sap-login-page" : "url"
		}, '' ]);
		this.server.autoRespond = true;
		var fnSuccess = function() {
			return undefined;
		};
		var fnError = function(oError) {
			assert.equal(oError.messageObject.getCode(), 5021, 'PutMessage with code 5021 expected due to timeout');
			done();
		};
		var oRequest = {};
		var oInject = {
			instances: {
				datajs: OData
			}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, undefined);
		this.server.restore();
	});
}());
