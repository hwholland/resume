/*global sap, jQuery, sinon, OData, location */

jQuery.sap.declare('sap.apf.integration.withDoubles.tWrongUsageOfApf');

(function () {
	'use strict';
	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
	jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
	jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
	jQuery.sap.require('sap.apf.testhelper.odata.savedPaths');
	jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.createComponent');
	jQuery.sap.require('sap.apf.testhelper.doubles.request');
	jQuery.sap.require('sap.apf.testhelper.doubles.representation');
	jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
	jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
	jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');

	jQuery.sap.require('sap.apf.Component');

	sap.apf.testhelper.injectURLParameters({
		"error-handling": "true"
	});


	function assertMessageWasPut(assert, sCode) {
		var aLogEntries = jQuery.sap.log.getLogEntries();
		var nLastLogEntryPosition = aLogEntries.length - 2;
		var bMessageContained = aLogEntries[nLastLogEntryPosition].message.search(sCode) > -1;
		assert.equal(bMessageContained, true, "Expected Code " + sCode);
	}

	QUnit.module("Access to configuration properties before load", {
		beforeEach: function () {
			var context = this;
			var inject = {
					constructors : {
						SessionHandler: sap.apf.core.SessionHandler,
						UiInstance: sap.apf.testhelper.doubles.UiInstance
					},
				functions : {
					messageCallbackForStartup: function(messageObject) {
					context.messageWasPutInCallbackForStartup = messageObject;
					}
				}
			};

			sap.apf.testhelper.createComponent(this, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, componentId : "CompId1", noLoadingOfApplicationConfig : true,  inject : inject, componentData : {}});
			this.probedDependencies = this.oComponent.getProbe();
		},
		afterEach: function () {
			this.oCompContainer.destroy();
		}
	});

	QUnit.test("Access to application configuration properties before load", function (assert) {
		assert.expect(2);
		function assertMessageIsHandled(oMessageObject) {
			var sCode = oMessageObject.getCode();
			assert.equal(sCode, "5300", "Expected Code");
		}

		this.oApi.setCallbackForMessageHandling(assertMessageIsHandled);

		assert.throws(
				function() {
					this.oApi.getApplicationConfigProperties();
				}, 
				function(error) {
					return error.message.search("APFapf1972") > -1;
				},
				"Our famous exception on fatal error was raised");
	});

	function ajaxWrapper(oParam1, oParam2) {
		if (oParam1 && oParam1.type !== 'HEAD' && oParam1.url.indexOf("sampleConfiguration.json") > 0) {
			var fnSuccess = oParam1.success;
			oParam1.success = function (arg1, arg2, arg3) {
				fnSuccess({}, arg2, arg3);
			};
		} else {
			var fnOriginalSuccess = oParam1.success;
			oParam1.success = function (oData, sStatus, oJqXHR) {
				if (oData && oData.applicationConfiguration) {
					var sResponse = JSON.stringify(oData);
					var sHref = jQuery(location).attr('href');
					sHref = sHref.replace(location.protocol + "//" + location.host, "");
					sHref = sHref.slice(0, sHref.indexOf("test-resources"));
					sResponse = sResponse.replace(/\/apf-test\//g, sHref);
					oData = JSON.parse(sResponse);
				}
				fnOriginalSuccess(oData, sStatus, oJqXHR);
			};
		}
		return jQuery.ajax(oParam1, oParam2);
	}

	QUnit.module("Empty Analytical Configuration", {
		beforeEach: function () {
			var context = this;
			var inject = {
					constructors : {
						SessionHandler: sap.apf.core.SessionHandler,
						UiInstance: sap.apf.testhelper.doubles.UiInstance
					},
					functions : {
						ajax: ajaxWrapper,
						messageCallbackForStartup: function(messageObject) {
							context.messageWasPutInCallbackForStartup = messageObject;
						}
					}
			};
			sap.apf.testhelper.createComponent(this, 
					{ componentId : "CompAjax1", noLoadingOfApplicationConfig : true,  inject : inject, componentData : {}});
		},
		afterEach: function () {
			this.oCompContainer.destroy();
		}
	});

	QUnit.test("Empty analytical configuration leeds to error 5102", function (assert) {
		assert.throws(function() {
			var sConfigPath = sap.apf.testhelper.determineTestResourcePath() + '/testhelper/config/applicationConfiguration.json';
			this.oApi.loadApplicationConfig(sConfigPath);
		}, Error, "error was thrown");

		assertMessageWasPut(assert, "5102");
	});

	function ajaxWrapper2(oParam1, oParam2) {
		if (oParam1 && oParam1.type !== 'HEAD' && oParam1.url.indexOf("applicationConfiguration.json") > 0) {
			var fnSuccess = oParam1.success;
			oParam1.success = function (arg1, arg2, arg3) {
				fnSuccess({}, arg2, arg3);
			};
			return jQuery.ajax(oParam1, oParam2);
		}
		return jQuery.ajax(oParam1, oParam2);
	}

	QUnit.module("Empty Analytical Configuration", {
		beforeEach: function () {
			var context = this;
			var inject = {
					constructors : {
						SessionHandler: sap.apf.core.SessionHandler,
						UiInstance: sap.apf.testhelper.doubles.UiInstance
					},
					functions : {
						ajax: ajaxWrapper2,
						messageCallbackForStartup: function(messageObject) {
							context.messageWasPutInCallbackForStartup = messageObject;
						}
					}
			};
			sap.apf.testhelper.createComponent(this, 
					{ componentId : "CompAjax2", noLoadingOfApplicationConfig : true,  inject : inject, componentData : {}});
		},
		afterEach: function () {
			this.oCompContainer.destroy();
		}
	});

	QUnit.test("WHEN Empty application configuration is loaded THEN fatal message with sap.apf.core.constants.message.code.errorStartUp", function (assert) {
		assert.expect(2);
		assert.throws(
			function() {
				var sConfigPath = sap.apf.testhelper.determineTestResourcePath() + '/testhelper/config/applicationConfiguration.json';
				this.oApi.loadApplicationConfig(sConfigPath);
			}, 
			function(error) {
				return error.message.search("APFapf1972") > -1;
			}, 
			"Our famous exception on fatal error was raised" );

		assert.equal(this.messageWasPutInCallbackForStartup.getPrevious().getCode(), "9003", "Error Message");
	});

}());
