/* global window*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require("sap.apf.testhelper.helper");

jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.core.ajax");
jQuery.sap.require("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.textResourceHandler");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.utils.startParameter");

(function() {
	'use strict';

	sap.apf.testhelper.injectURLParameters({
		"notrycatch" : "true"
	});

	QUnit.module("Test throw", {
		beforeEach : function(assert) {

			this.oMessageHandler = new sap.apf.core.MessageHandler();
			var oMessageHandler = this.oMessageHandler;
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			});
			this.oCoreApi.getStartParameterFacade = function() {
				return new sap.apf.utils.StartParameter();
			};

			this.oCoreApi.checkForTimeout = function(jqXHR) {
				return undefined;
			};
			this.oCoreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};

			this.oCoreApi.loadMessageConfiguration = function(aMessages, bResetRegistry) {
				oMessageHandler.loadConfig(aMessages, bResetRegistry);
			};
			this.oCoreApi.loadAnalyticalConfiguration = function(oConfig) {

			};
			var oInject = {
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			};
			this.oResourcePathHandler = new sap.apf.core.ResourcePathHandler(oInject);

			this.oTextHandler = new sap.apf.core.TextResourceHandler(oInject);
			var sConfigPath = sap.apf.testhelper.determineTestResourcePath() + '/testhelper/config/' + sap.apf.testhelper.determineApplicationConfigName();
			this.fnOriginalAjax = jQuery.ajax;
			sap.apf.testhelper.replacePathsInAplicationConfiguration(this.fnOriginalAjax);
			this.oResourcePathHandler.loadConfigFromFilePath(sConfigPath);

			this.getLogEntries = jQuery.sap.log.getLogEntries;
		},
		afterEach : function(assert) {
			jQuery.ajax = this.fnOriginalAjax;
			this.oMessageHandler.activateOnErrorHandling(false);
		}
	});

	QUnit.test("Throw on fatal message and UI Callback", function(assert) {
		assert.expect(3);
		var thatAssert = assert;
		var oMessageHandler = this.oMessageHandler;
		var fnOriginalOnError = window.onerror;
		window.onerror = null;

		function fnCallback(oMessageObject) {
			var sCode = oMessageObject.getCode();
			thatAssert.equal(sCode, sap.apf.core.constants.message.code.errorExitTriggered, "Correct code for fatal");
			sCode = oMessageObject.getPrevious().getCode();
			thatAssert.equal(sCode, '5100', "original fatal error");

		}

		this.oMessageHandler.activateOnErrorHandling(true);
		this.oMessageHandler.setMessageCallback(fnCallback);

		assert.throws(function() {
			oMessageHandler.putMessage(oMessageHandler.createMessageObject({
				code : '5100'
			}));
		}, "exception expected");

		window.onerror = fnOriginalOnError;
	});

	QUnit.test("GIVEN 2 putMessage() A = error and B = technError WHEN fatal putMessage() called last THEN A and B shall logged in getLogMessages()", function(assert) {
		assert.expect(2);
		var thatAssert = assert;
		var oMessageHandler = this.oMessageHandler;
		var fnOriginalOnError = window.onerror;
		window.onerror = function() {
			return true;
		};

		oMessageHandler.activateOnErrorHandling(true);
		var fnCallback = function(oMessageObject) {
			if (oMessageObject.getSeverity() === "fatal") {
				var aLogMessages = oMessageHandler.getLogMessages();
				thatAssert.equal(aLogMessages.length, 2, "Two messages in log expected");
			}
		};

		this.oMessageHandler.setMessageCallback(fnCallback);
		//technicalError
		oMessageHandler.putMessage(oMessageHandler.createMessageObject({
			code : "3001",
			aParameters : [ "unknownKey" ],
			oCallingObject : this
		}));
		//error
		oMessageHandler.putMessage(oMessageHandler.createMessageObject({
			code : "5201",
			aParameters : [ "testParam" ],
			oCallingObject : this
		}));

		assert.throws(function() {
			oMessageHandler.putMessage(oMessageHandler.createMessageObject({
				code : '5100',
				oCallingObject : this
			}));
		}, "exception");

		window.onerror = fnOriginalOnError;

	});

}());
