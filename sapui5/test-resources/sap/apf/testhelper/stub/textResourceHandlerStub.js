/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG"); All rights reserved
 */
/*global sap:false,jQuery:false, sinon */
(function() {
	'use strict';
	//noinspection JSLint
	jQuery.sap.declare('sap.apf.testhelper.stub.textResourceHandlerStub');
	sap.apf.testhelper.stub.textResourceHandlerStub = {};
	sap.apf.testhelper.stub.textResourceHandlerStub.setup = function(testContext) {
		sap.apf.testhelper.stub.textResourceHandlerStub.testContext = testContext;
		testContext.stub = {};
		testContext.stub.textHash = {};
		testContext.stub.aPropertyFiles = [];
		testContext.stub.aPropertyFiles[0] = {};
		testContext.stub.aPropertyFiles[0].aKeys = [];
		testContext.stub.addText = function(key, value) {
			testContext.stub.textHash[key] = value;
			testContext.stub.aPropertyFiles[0].aKeys.push(key);
		};
		/**
		 * Builds bundle of UI5 without called UI5.
		 * @constructor
		 */
		testContext.stub.ResourceBundleStub = function() {
			this.aPropertyFiles = testContext.stub.aPropertyFiles;
			var aProperties = this.aPropertyFiles[0];
			this.getText = function(inKey) {
				var result = testContext.stub.textHash[inKey];
				if (result !== undefined) {
					return result;
				}
				return "This text is not defined";
			};
			this._enhance = function (oBundleStub) {
				/*oBundleStub.aPropertyFiles[0].aKeys.forEach(function(key) {
					aProperties.aKeys.push(key);
					testContext.stub.addText(key, oBundleStub.getText(key));
				});*/
			};
		};
		testContext.stub.resourceBundle = new testContext.stub.ResourceBundleStub(); // attention: singleton per test
		sap.apf.testhelper.stub.givenApfMessagesProperties(testContext.stub);
		testContext.stub.stubSapResources = sinon.stub(jQuery.sap, "resources", function() {
			return testContext.stub.resourceBundle;
		});
		testContext.stub.stubUI5getOriginInfo = sinon.stub(sap.ui.getCore().getConfiguration(), "getOriginInfo", function() {
			return "it is stubbed by ...stub.ResourceHandlerStub";
		});
	};
	sap.apf.testhelper.stub.textResourceHandlerStub.teardown = function() {
		var testContext = sap.apf.testhelper.stub.textResourceHandlerStub.testContext;
		testContext.stub.stubUI5getOriginInfo.restore();
		testContext.stub.stubSapResources.restore();
	};
}());